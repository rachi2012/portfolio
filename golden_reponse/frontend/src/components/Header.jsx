"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Header({ onOpenContact }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  // Create a spring physics scroll progress indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Scroll Progress Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-accent-purple via-[#a78bfa] to-accent-cyan origin-left w-full absolute top-0 left-0 z-50 shadow-[0_0_10px_rgba(139,92,246,0.6)]"
        style={{ scaleX }}
      />

      {/* Main Navbar */}
      <div
        className={`w-full py-4 px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? "glass-panel bg-opacity-70 shadow-lg border-b border-white/5 backdrop-blur-md"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center gap-1.5 font-display text-xl font-bold tracking-wider text-white"
          >
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent group-hover:glow-text-purple transition-all duration-300">
              AC
            </span>
            <span className="hidden sm:inline text-white/90 group-hover:text-white transition-colors duration-300">
              .PORTFOLIO
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-white tracking-wide transition-colors duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Call-to-action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenContact}
              aria-label="Open contact form"
              className="relative px-6 py-2 rounded-full overflow-hidden group text-sm font-semibold text-white tracking-wider uppercase border border-accent-purple/40 bg-accent-purple/10 transition-all duration-300 hover:border-accent-cyan/80 hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
            >
              <span className="relative z-10 flex items-center gap-1">
                Get in Touch <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </span>
            </button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={onOpenContact}
              aria-label="Open contact form"
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase border border-accent-purple/30 bg-accent-purple/10 text-white"
            >
              Contact
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full glass-panel bg-opacity-95 backdrop-blur-lg border-b border-white/10 px-6 py-8 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200 border-l-2 border-transparent hover:border-accent-purple pl-3 py-1"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <motion.button
              onClick={() => {
                setIsOpen(false);
                onOpenContact();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-semibold uppercase tracking-wider shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
