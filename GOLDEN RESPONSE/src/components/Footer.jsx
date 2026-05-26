"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mail, Sparkles } from "lucide-react";

export default function Footer({ onOpenContact }) {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { 
      name: "GitHub", 
      href: "https://github.com", 
      renderIcon: () => (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
        </svg>
      ), 
      label: "Visit my GitHub Profile" 
    },
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com", 
      renderIcon: () => (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ), 
      label: "Connect on LinkedIn" 
    },
    { 
      name: "Twitter", 
      href: "https://twitter.com", 
      renderIcon: () => (
        <svg className="w-4 h-4 fill-current animate-pulse-slow" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ), 
      label: "Follow me on Twitter" 
    },
  ];

  return (
    <footer className="relative bg-[#02050d] border-t border-white/5 overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-accent-purple/5 blur-[90px] pointer-events-none" />

      {/* Call to action section */}
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 30 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-10 md:p-16 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group max-w-4xl mx-auto mb-16"
        >
          {/* Internal Cybernetic Glows */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-cyan" />
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/5 to-accent-cyan/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <Sparkles className="w-10 h-10 text-accent-cyan mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6 tracking-tight leading-tight">
            Have a Project in{" "}
            <span className="bg-gradient-to-r from-accent-purple via-purple-300 to-accent-cyan bg-clip-text text-transparent glow-text-purple">
              Mind?
            </span>
          </h2>
          
          <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-10 font-light leading-relaxed">
            Let's design something immersive together. Reach out to discuss details, ask questions, or just say hello!
          </p>

          <button
            onClick={onOpenContact}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-bold tracking-wider uppercase shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Lower footer row */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 text-gray-400 gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm font-light">
              &copy; {currentYear} <span className="font-semibold text-white">Rachi Singh</span>. All rights reserved.
            </p>
            <p className="text-[11px] font-mono text-gray-600">
              Designed with premium aesthetics & Framer Motion scroll storyboards.
            </p>
          </div>

          {/* Social connections */}
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-accent-purple/40 hover:bg-accent-purple/10 transition-all duration-300 flex items-center justify-center"
                aria-label={social.label}
              >
                {social.renderIcon()}
              </a>
            ))}
          </div>

          {/* Scroll to Top button */}
          <button
            onClick={handleScrollTop}
            className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-accent-cyan/40 hover:bg-accent-cyan/10 transition-all duration-300 group"
            aria-label="Scroll back to top of the page"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </footer>
  );
}
