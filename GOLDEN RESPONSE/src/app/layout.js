import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Rachi Singh | Creative Frontend Engineer & Scroll Storyteller",
  description: "An immersive scrolling portfolio experience showcasing high-performance React applications, interactive timeline narratives, and responsive, accessible, cutting-edge UI engineering.",
  keywords: [
    "Frontend Developer",
    "Framer Motion",
    "Scroll Animations",
    "Next.js Portfolio",
    "Interactive Portfolio",
    "UI Engineer",
    "Creative Developer",
    "Storytelling Website"
  ],
  authors: [{ name: "Rachi Singh" }],
  creator: "Rachi Singh",
  openGraph: {
    title: "Rachi Singh | Creative Frontend Engineer",
    description: "Immerse yourself in a scroll-driven storytelling portfolio featuring modern web architectures, premium layouts, and modular engineering.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachi Singh | Creative Frontend Engineer",
    description: "Immerse yourself in a scroll-driven storytelling portfolio featuring modern web architectures, premium layouts, and modular engineering.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#030712] text-[#f3f4f6] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
