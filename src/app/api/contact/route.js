import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// In-memory rate limiting map (IP -> { count, resetTime })
const rateLimitMap = new Map();

// Helper: Clean expired rate limits from memory to prevent leaks
const cleanExpiredRateLimits = () => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
};

// Helper: Custom sanitization to prevent XSS / injections
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // strip script tags
    .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

export async function POST(req) {
  try {
    // 1. IP Rate Limiting check
    cleanExpiredRateLimits();
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const now = Date.now();
    const rateLimitLimit = 3; // Max 3 requests
    const rateLimitWindow = 60 * 60 * 1000; // 1 Hour

    let ipData = rateLimitMap.get(ip);
    if (!ipData) {
      ipData = { count: 0, resetTime: now + rateLimitWindow };
      rateLimitMap.set(ip, ipData);
    }

    if (now > ipData.resetTime) {
      ipData.count = 0;
      ipData.resetTime = now + rateLimitWindow;
    }

    if (ipData.count >= rateLimitLimit) {
      const remainingTime = Math.ceil((ipData.resetTime - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${remainingTime} minutes before trying again.`,
        },
        { status: 429 }
      );
    }

    // Parse payload
    const body = await req.json().catch(() => ({}));
    
    // 2. Honeypot check (defense-in-depth)
    // If the request contains custom honeypot fields filled in (often done by bot scripts hitting APIs directly)
    if (body.website_honey) {
      console.warn(`[SPAM BLOCKED] Honeypot field filled by IP: ${ip}`);
      // Return a fake positive response to exhaust bot resources
      return NextResponse.json({ success: true, message: "Submission secured." });
    }

    const rawName = body.name;
    const rawEmail = body.email;
    const rawPhone = body.phone;
    const rawMessage = body.message || "";

    // Increment rate limit count
    ipData.count += 1;

    // 3. Sanitization
    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail);
    const phone = sanitizeInput(rawPhone);
    const message = sanitizeInput(rawMessage);

    // 4. Server-Side Validations
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "A valid name (minimum 2 characters) is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "A valid phone number is required (min 7 digits)." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Message must not exceed 1000 characters." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const newSubmission = {
      ip: ip.replace(/:\d+$/, ""), // mask exact port if present
      name,
      email,
      phone,
      message,
      timestamp,
    };

    // 5. Save securely to local file-based Database (data/submissions.json)
    const dataDir = path.join(process.cwd(), "data");
    const dbPath = path.join(dataDir, "submissions.json");

    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let existingSubmissions = [];
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf8");
        existingSubmissions = JSON.parse(fileContent || "[]");
      }

      existingSubmissions.push(newSubmission);
      fs.writeFileSync(dbPath, JSON.stringify(existingSubmissions, null, 2), "utf8");
      console.log(`[DATABASE LOG] Submission added to data/submissions.json from Name: ${name}`);
    } catch (dbError) {
      console.error("[DATABASE ERROR] Failed writing submission to local storage:", dbError);
      // Proceed with email trigger even if DB logs fail, so message is not lost
    }

    // 6. SMTP Email Notification Dispatch
    // Read environments
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const ownerEmail = process.env.OWNER_EMAIL || "owner@example.com";

    let transporter;
    let isTestAccount = false;

    // Check if live credentials are configured. Otherwise, fallback dynamically to Ethereal developer testing setup.
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log(`[SMTP CONFIG] Loaded custom SMTP configuration: ${smtpHost}`);
    } else {
      // Create dynamic test credentials using Ethereal
      console.log("[SMTP CONFIG] Custom SMTP environment parameters missing. Building Ethereal testing account...");
      isTestAccount = true;
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (testAccountErr) {
        console.error("[SMTP ERROR] Ethereal mail account generation failed:", testAccountErr);
        return NextResponse.json(
          {
            success: false,
            error: "Internal server error establishing temporary mail connection.",
          },
          { status: 500 }
        );
      }
    }

    // Craft rich email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #030712; color: #f3f4f6; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <h2 style="font-size: 22px; color: #8b5cf6; border-bottom: 2px solid rgba(139, 92, 246, 0.2); padding-bottom: 12px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">
          New Portfolio Submission
        </h2>
        <div style="margin-top: 20px; line-height: 1.6;">
          <p style="margin: 8px 0;"><strong style="color: #06b6d4;">Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color: #06b6d4;">Email:</strong> <a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0;"><strong style="color: #06b6d4;">Phone:</strong> ${phone}</p>
          <p style="margin: 8px 0;"><strong style="color: #06b6d4;">Timestamp:</strong> ${timestamp}</p>
          <p style="margin: 8px 0;"><strong style="color: #06b6d4;">Client IP Address:</strong> ${newSubmission.ip}</p>
          
          <div style="margin-top: 24px; padding: 18px; background-color: rgba(17, 24, 39, 0.5); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <h4 style="margin: 0 0 10px 0; color: #a78bfa; font-size: 14px; text-transform: uppercase;">Message Details</h4>
            <p style="margin: 0; font-size: 14.5px; white-space: pre-wrap; font-style: italic;">
              ${message || "No message content provided."}
            </p>
          </div>
        </div>
        <footer style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 12px; font-size: 11px; color: #6b7280; text-align: center;">
          Secured portfolio contact handler. Anti-spam systems enabled.
        </footer>
      </div>
    `;

    const mailOptions = {
      from: isTestAccount ? `"Portfolio Contact Engine" <noreply@ethereal.email>` : `"Portfolio Contact Engine" <${smtpUser}>`,
      to: ownerEmail,
      subject: `💼 Portfolio Submission from: ${name}`,
      text: `New Portfolio Submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTimestamp: ${timestamp}\n\nMessage:\n${message}`,
      html: emailHtml,
    };

    // Send the mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP DISPATCH] Email successfully sent. MessageId: ${info.messageId}`);

    // If Ethereal test account was generated, output the web interface URL for viewing actual mails
    if (isTestAccount) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n======================================================`);
      console.log(`🔥 [ETHEREAL DEBUG EMAIL PREVIEW URL] 🔥`);
      console.log(`👉 ${previewUrl} 👈`);
      console.log(`======================================================\n`);
    }

    return NextResponse.json({
      success: true,
      message: "Message successfully submitted and email dispatched.",
    });

  } catch (error) {
    console.error("[API CONTACT ERROR] Server exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during submission. Please try again.",
      },
      { status: 500 }
    );
  }
}
