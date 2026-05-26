Prompt
Context and Role
As a Frontend Developer and UI/UX Engineer of high calibre, you will have a wealth of experience creating interesting websites for companies. It’s time to use your skills to create an interesting portfolio website with some nice scroll effects.

Your job as a developer is to craft the best portfolio experience by sharing your projects and successes via a well-designed website that looks and feels modern, responsive, fast, and accessible everywhere.

Apart from creating the best portfolio experience, the other part of your challenge is the inclusion of a reliable contact system that will help users share their information with the owner of the portfolio via the contact form.

Objective
Develop a full-stack portfolio website that:

Having proven yourself as an excellent Frontend Developer/UI/UX Engineer, you have plenty of experience building impressive websites for businesses and companies. The current task is to build a professional portfolio website with cool scrolling animations.
* Uses Framer Motion for adding interaction when scrolling.
* Provides a smooth experience for the user as he scrolls through different sections.
* Possesses a modern, sleek design.
* Works perfectly on any device including mobiles, tablets, and PCs.
* Contains a "Get In Touch" button that pops up a modal form.
* Collects visitors' information securely.
* Send a notification email to the portfolio owner when the form is filled.
* Records visitors' information securely in a database.
* Adheres to current web development standards.

UI and Animation Requirements
Scroll-Based Storytelling
Create a portfolio experience where each section appears naturally as the user scrolls.
Implement:
Scroll-triggered animations
Smooth section transitions
Parallax scrolling effects
Fade-in and fade-out effects
Slide animations
Staggered element reveals
Progress-based motion effects
Create a smooth journey between:
Hero Section
Introduce the developer with eye-catching animations.
About Section
Present personal information using animated text reveals.
Skills Section
Display skills using animated progress bars, counters, or charts.
Projects Section
Showcase projects using interactive cards and motion effects.
Contact Section
Guide users toward making contact through animated call-to-action elements.

Animation Performance
Ensure animations:
Run smoothly on all devices
Use GPU-friendly properties such as transform and opacity
Avoid unnecessary re-renders
Do not interrupt scrolling
Maintain excellent user experience
Respect accessibility preferences for reduced motion

Layout Requirements
The portfolio should include the following sections:
Hero Section
Developer introduction
Professional title
Short description
Resume download button
Social media links
Animated background elements

About Section
Personal introduction
Career journey
Education details
Professional summary
Animated text effects

Skills Section
Display:
Frontend Skills
Backend Skills
Tools & Technologies
Frameworks
Databases
Use:
Animated progress bars
Skill cards
Interactive hover effects

Projects Section
Each project card should contain:
Project image
Project title
Description
Technology stack
GitHub link
Live demo link
Include:
Hover animations
Card transitions
Interactive effects

Experience Section
Display:
Work experience
Internships
Freelance projects
Achievements
Use animated timeline components.

Contact Section
Include:
Contact information
Social media links
Contact call-to-action
"Get In Touch" button

Footer
Include:
Copyright information
Navigation links
Social links

Responsive Design
The entire layout must be:
Mobile responsive
Tablet responsive
Desktop responsive
Cross-browser compatible
Accessible to all users
Performance optimized

Contact System Requirements
Modal Behavior
When the user clicks the "Get In Touch" button:
Open a modal contact form
Animate the modal using Framer Motion
Provide smooth entrance animation
Provide smooth exit animation
Support keyboard navigation
Allow closing via overlay click and Escape key

Contact Form Fields
Required:
Name
Text input
Required
Email
Required
Proper email validation
Phone Number
Required
Number validation
Optional:
Message
Multi-line textarea

Validation Requirements
Implement client-side validation:
Required field validation
Email format validation
Phone number validation
Input length validation
Display:
Clear error messages
Success messages
Loading indicators
Prevent submission when validation fails.

Backend Requirements
Create a backend system to process contact form submissions.
Implement:
API Endpoint
Example:
POST /api/contact
Responsibilities:
Receive form data
Validate data
Sanitize inputs
Store submissions
Trigger email notifications
Return structured responses

Submission Logging
Store submissions securely in:
Server Logs
Record:
Name
Email
Phone Number
Message
Timestamp
Optional Database Storage
Use:
MongoDB
PostgreSQL
Store all contact requests for future reference.

Email Notification System
Whenever a visitor submits the contact form:
Send an email to the portfolio owner containing:
Visitor Name
Email Address
Phone Number
Message
Submission Time
Use:
Nodemailer
SMTP Service
SendGrid
Resend
Brevo
The email should be delivered reliably and securely.

Environment Variables
Store sensitive credentials securely.
Example:
EMAIL_USER=
EMAIL_PASSWORD=
SMTP_HOST=
SMTP_PORT=
DATABASE_URL=
Never expose credentials on the frontend.

Spam Protection
Implement:
Rate limiting
CAPTCHA integration (optional)
Bot detection
Request throttling
Prevent spam submissions and abuse.

Data Processing Requirements
Before storing or sending data:
Input Sanitization
Protect against:
XSS attacks
Script injection
Malicious inputs
Database injection attacks

Validation
Verify:
Email format
Phone number format
Required fields
Character limits

API Responses
Success Response:
{
  "success": true,
  "message": "Message sent successfully"
}
Error Response:
{
  "success": false,
  "message": "Validation failed"
}
All responses should follow a consistent structure.

Output Requirements
The final portfolio must provide:
Beautiful storytelling experience
Smooth animations throughout the website
Modern and professional UI
Responsive design on all devices
Functional contact modal
Secure form handling
Successful email notifications
Data storage capability
User-friendly success confirmation
Graceful error handling
Fast loading performance

Error Handling and Documentation
Frontend Error Handling
Handle:
Invalid form inputs
Missing required fields
Network failures
API request failures
Display clear messages to users.

Backend Error Handling
Handle:
Validation failures
Database errors
Email delivery failures
Server exceptions
Provide structured JSON responses.
Log failures for debugging purposes.

Documentation
Provide detailed documentation including:
Project Structure
Complete folder hierarchy explanation.
Setup Instructions
Installation and configuration guide.
Environment Variables
Required environment settings.
Deployment Guide
Steps for deploying to production.
API Documentation
Endpoint details and request formats.

Performance and Scalability
Optimize the application for speed and growth.
Implement:
Frontend Optimization
Code splitting
Lazy loading
Dynamic imports
Image optimization
Memoization
Efficient rendering

Animation Optimization
Ensure animations:
Do not reduce performance
Remain smooth on low-end devices
Avoid excessive repainting
Maintain responsiveness

Backend Optimization
Efficient API design
Database indexing
Request caching
Optimized queries
Support increasing traffic without performance issues.

User Interaction Optimization
Implement:
Debouncing
Throttling
Efficient event handling

Accessibility Requirements
Follow accessibility best practices.
Include:
Semantic HTML
ARIA labels
Keyboard navigation
Focus indicators
Screen reader support
Proper color contrast
Reduced motion support

SEO Requirements
Optimize for search engines.
Implement:
Meta tags
Open Graph tags
Structured data
Sitemap.xml
Robots.txt
Optimized metadata
Fast page loading

Technology Stack
Frontend
React or Next.js
TypeScript
Framer Motion
Tailwind CSS

Backend
Node.js
Express.js or Next.js API Routes

Email Service
Nodemailer
SMTP Provider
Resend
SendGrid

Validation
React Hook Form
Zod
Validator.js

Security
Helmet
Rate Limiter
DOMPurify
Input Sanitization Libraries

Database (Optional)
MongoDB
PostgreSQL



