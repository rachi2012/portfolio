# 🌌 Obsidian & Cybernetic Glow - Storytelling Portfolio

An immersive, highly performant, accessible, and responsive scroll-based storytelling portfolio built with Next.js 16, Framer Motion, and Tailwind CSS v4.


 Key Architectural Features

-Immersive Scroll Storyboard**: Interactive timelines and visual components that stagger, draw pathways, and slide using fluid physics (`framer-motion`) and GPU-accelerated layout transforms.
-Deep Obsidian & Cybernetic Styling**: Dynamic glassmorphic panels, mesh gradient background bubbles, and neon glowing focus outlines.
-Secure Modal Contact Form**:
  -Focus-Trapping & Esc-Key Listening**: Full keyboard access conforming strictly to modern accessibility requirements.
  -Honeypot Spam Defense**: Invisible validation input (`website_honey`) to silently drop bot API calls.
  -Server-Side IP Throttling**: Restricts requests to 3 submissions per hour per client to mitigate DDoS/Spam bottlenecks.
  -XSS & Injection Protection**: HTML sanitization and string entity escapes in API payloads.
-Nodemailer Notification Dispatcher**: Sends detailed HTML/text transcripts of submissions directly to the portfolio owner.
-Local File-based Database**: Stores form submissions securely in `data/submissions.json` with client IPs and UTC ISO timestamps.
-SMTP dynamic Fallback**: Runs on a live SMTP host, falling back automatically to an Ethereal developer sandbox generating mail-box preview links directly to server logs if live parameters are omitted.

---

 Folder Structure

```markdown
portfolio/
├── data/
│   └── submissions.json       # Secure local DB storing contact records [Auto-Generated]
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.js   # API Endpoint (validations, sanitization, rate-limiter, email, DB logs)
│   │   ├── globals.css        # Central styling definitions, custom glassmorphism, & Tailwind v4 theme
│   │   ├── layout.js          # Root layout loading Outfit Google Font, HTML parameters, and optimized SEO
│   │   └── page.js            # Main home canvas, controls state and handles AnimatePresence wrappers
│   └── components/
│       ├── Header.jsx         # Floating glassmorphic navbar with structural scroll progress tracker
│       ├── Hero.jsx           # Fluid scroll-parallax landing narrative
│       ├── About.jsx          # Interactive timeline narrative (draws itself as you scroll)
│       ├── Skills.jsx         # Staggered capability matrix with viewport-triggered levels
│       ├── Projects.jsx       # Custom hover tilt showcased productions
│       ├── Footer.jsx         # Accessible socials, copyright, and visual CTA banner
│       └── ContactModal.jsx   # Accessible contact form (validations, honeypot, dialog controls)
├── .env.local                 # Environment variable templates for custom SMTP servers
├── package.json               # Node packages and custom run scripts
└── README.md                  # Detailed documentation & setup steps (this file)
```

---

## 🛠️ Local Setup & Setup Instructions

### 1. Requirements
Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your workstation.

### 2. Installation
Clone the workspace or copy directories into your project folder. Navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Running Environment in Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the storytelling animations live.

### 4. Compiling the Production Bundle
To compile, bundle, and optimize the application for production:
```bash
npm run build
```
To run the built production client locally:
```bash
npm run start
```

---

## 🔒 Environment Variable Configuration

Create or modify the `.env.local` file at the root of the project. Fill in the parameters to hook up your custom SMTP email delivery server:

```env
# =========================================================================
# SMTP Live Server Email Configuration
# =========================================================================
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# The target email address that will receive the portfolio submission notifications
OWNER_EMAIL=owner@example.com
```

*Note: If no custom SMTP credentials are provided, the API automatically provisions a temporary **Ethereal Mail** inbox during development, printing the clickable email preview link directly to your terminal logs. This allows you to verify form functions instantly!*

---

## 🎨 Storytelling Animations Configuration

Animations are powered by Framer Motion within modern Client Components. 

- **Scroll Progress**: Located in [Header.jsx](file:///c:/Users/Admin/Desktop/EtharaAi/portfolio/src/components/Header.jsx). Drives a scaling progress indicator using `useScroll` + `useSpring`.
- **Parallax Shifts**: Located in [Hero.jsx](file:///c:/Users/Admin/Desktop/EtharaAi/portfolio/src/components/Hero.jsx). Shifts titles and shapes at different rates relative to the layout scroll speed using `useTransform`.
- **Self-Drawing Line**: Located in [About.jsx](file:///c:/Users/Admin/Desktop/EtharaAi/portfolio/src/components/About.jsx). Animates a glowing linear gradient mask vector as it crosses the viewport.

---

## 🌍 Production Deployment

### Option A: Vercel (Recommended)
Since this is a Next.js project, it is highly optimized for **Vercel** out of the box.
1. Connect your GitHub/GitLab workspace to Vercel.
2. Select your project directory `portfolio/`.
3. Under **Environment Variables**, insert your live SMTP variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `OWNER_EMAIL`).
4. Click **Deploy**. Vercel will automatically compile the bundle, optimize assets, and distribute the API endpoints globally.

### Option B: Docker / Custom VPS (Ubuntu, CentOS)
To run on a custom VM or server container:
1. Dockerize the Next.js app or clone code onto your VPS.
2. Run `npm install` and `npm run build`.
3. Set your production environment variables.
4. Manage the server daemon process using a tool like PM2:
   ```bash
   pm2 start npm --name "storytelling-portfolio" -- start
   ```
5. Configure Nginx as a reverse proxy passing traffic on port 80/443 down to port 3000.

---

## 🤖 LLM Evaluation Benchmark Suite

This repository includes a comprehensive, production-grade LLM evaluation framework designed to benchmark code generation capabilities on complex, concurrent, and mathematically-intensive domain tasks.

### 📋 Overview of the Evaluation
We evaluate LLM capabilities using a real-world **Fintech Real-Time sliding-Window Rate Limiter & Geo-Velocity Fraud Risk Engine** task. This problem space tests several dimensions of code quality:
1. **Concurrency Controls**: Measures ability to manage resource locking at granular levels (preventing global synchronization bottlenecks).
2. **Algorithmic Efficiency**: Evaluates time complexity optimizations ($O(K)$ sliding window eviction via `deque` vs $O(N)$ list-scans).
3. **Mathematical Rigor**: Assesses geodetic coordinate calculations (Haversine formula) and boundary edge-case handling.
4. **Defensive Programming**: Looks at validation schemas and domain-specific exception hierarchies.

### 📂 Repository Structure (Evaluation Assets)
We have added the following benchmark assets to the root directory:
```markdown
portfolio/
├── prompt.md                # Original domain-specific LLM coding prompt
├── golden_response.py       # Production-quality reference benchmark solution
├── justification.md         # Structured side-by-side comparison framework (Response A vs B)
└── BUILD_GUIDE.md           # Architectural deep-dive & construction explanation
```

### 🚀 Running & Testing the Benchmark Code

The reference benchmark code is built entirely in **pure Python** (requiring only standard libraries) to ensure seamless portability across testing environments.

#### 1. Running the Automated Unit Test Suite
To verify core risk evaluations, validation exceptions, mathematical limits, and parallel thread stability, execute the file directly:
```bash
python golden_response.py
```

#### 2. Launching the Multi-Threaded Ingestion Simulator
To trigger a concurrent simulation with live client workers generating transactions and shifting coordinates in real-time, append the `--simulate` flag:
```bash
python golden_response.py --simulate
```

### 🔬 Evaluation Methodology
Our evaluation process grades LLM submissions along a strict multi-dimensional matrix:
- **Technical Constraints (Pass/Fail)**: Compiles without dependencies, executes thread-safe logic under load, and uses custom error classes.
- **Performance Profiling (Quantitative)**: Verifies eviction time complexity scales at $O(K)$ and averages execution latency under concurrent thread loops.
- **Architectural Soundness (Qualitative)**: Reviews separation of concerns, lock granularity (global lock vs striped client locks), and proper encapsulation.
- **Edge-Case Resilience (Adversarial)**: Ingests negative amounts, out-of-bounds GPS coordinates, malformed timestamps, and out-of-order/identical timestamp streams to verify system stability.

