"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Code, Sparkles, Terminal } from "lucide-react";

export default function Hero({ onOpenContact }) {
  const containerRef = useRef(null);
  
  // Track scroll position within this component to drive parallax effects
  const { scrollY } = useScroll();

  // Create parallax displacement ranges
  const textY = useTransform(scrollY, [0, 500], [0, 180]);
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const bgY = useTransform(scrollY, [0, 800], [0, 120]);

  const float1Y = useTransform(scrollY, [0, 800], [0, -150]);
  const float2Y = useTransform(scrollY, [0, 800], [0, -80]);

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32"
    >
      {/* Dynamic Parallax Background shapes */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ scale: bgScale, y: bgY }}
      >
        {/* Soft neon glowing spheres */}
        <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] md:w-[450px] md:h-[450px] rounded-full bg-accent-purple/10 blur-[90px] md:blur-[130px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-accent-cyan/8 w-[350px] h-[350px] blur-[80px] md:blur-[120px]" />
      </motion.div>

      {/* Floating interactive structural glass elements */}
      <motion.div
        className="absolute top-1/3 left-10 md:left-24 z-10 hidden sm:block pointer-events-none"
        style={{ y: float1Y }}
      >
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5 opacity-60 backdrop-blur-md">
          <Terminal className="w-5 h-5 text-accent-cyan" />
          <span className="text-xs font-mono text-gray-400">clean_code.js</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-10 md:right-28 z-10 hidden sm:block pointer-events-none"
        style={{ y: float2Y }}
      >
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5 opacity-50 backdrop-blur-md">
          <Code className="w-5 h-5 text-accent-purple" />
          <span className="text-xs font-mono text-gray-400">framer_motion.jsx</span>
        </div>
      </motion.div>

      {/* Content wrapper */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col items-center"
        >
          {/* Badge indicator */}
          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-purple/20 bg-accent-purple/5 text-xs font-semibold text-accent-purple tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Scroll Story</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Crafting Digital{" "}
            <span className="bg-gradient-to-r from-accent-purple via-purple-400 to-accent-cyan bg-clip-text text-transparent glow-text-purple">
              Narratives
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light"
          >
            I am <strong className="font-semibold text-white">Rachi Singh</strong>. 
            A high-performance frontend engineer designing scroll-driven storytelling, 
            sleek glassmorphic interfaces, and accessible digital experiences that leave a lasting mark.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-bold tracking-wider uppercase shadow-[0_4px_25px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_35px_rgba(139,92,246,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get in Touch
            </button>
            <a
              href="#about"
              onClick={scrollToAbout}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel glass-panel-hover text-white text-sm font-bold tracking-wider uppercase border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Story <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-50">
        <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">Scroll to begin</span>
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-accent-purple to-accent-cyan animate-bounce" />
      </div>
    </section>
  );
}
