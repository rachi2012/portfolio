"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Calendar, Award, Code, BookOpen } from "lucide-react";

export default function About() {
  const containerRef = useRef(null);

  // Track scroll position of the About section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Smooth the scroll height progress with spring physics
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Highlight points of the developer's career narrative
  const chapters = [
    {
      title: "The Spark of Creation",
      period: "2020 - 2021",
      icon: BookOpen,
      tag: "THE SPARK",
      description:
        "Began my coding journey by learning core HTML, CSS, and vanilla JS. Instantly fell in love with visual programming. Spent countless nights experimenting with custom animations, turning static canvases into interactive, vibrant, and alive digital artworks.",
    },
    {
      title: "Building the Core Engine",
      period: "2021 - 2023",
      icon: Code,
      tag: "THE CRUCIBLE",
      description:
        "Mastered React, Next.js, and Node.js. Transitioned into developing full-stack web applications, integrating lightweight secure servers and database systems. Focused intensely on performance optimization, bundle size minimization, and accessibility standards.",
    },
    {
      title: "Immersive Visual Engineering",
      period: "2023 - Present",
      icon: Award,
      tag: "THE HORIZON",
      description:
        "Specialized in Framer Motion scroll narratives and visual storytelling. Designed cutting-edge portfolios, landing pages, and interactive dashboards featuring fluid mesh transitions, modular React hooks, and premium glassmorphic layout designs.",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-screen py-24 md:py-32 px-6 flex items-center justify-center overflow-hidden bg-[#030712]/80"
    >
      {/* Decorative ambient lighting behind timeline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Title Block */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-xs font-semibold text-accent-cyan tracking-widest uppercase mb-4"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Developer Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white"
          >
            My Story in{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent glow-text-purple">
              Motion
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base font-light"
          >
            An interactive timeline of my development path, technical crucibles, and creative breakthroughs.
          </motion.p>
        </div>

        {/* Narrative Timeline */}
        <div className="relative mt-16 max-w-4xl mx-auto">
          {/* Central Vertical Timeline Line (Drawn on scroll) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-[1px]">
            <motion.div
              style={{ scaleY }}
              className="w-full h-full timeline-pulse origin-top rounded-full"
            />
          </div>

          {/* Chapters (Staggered panels) */}
          <div className="space-y-16 md:space-y-24">
            {chapters.map((chapter, index) => {
              const isEven = index % 2 === 0;
              const Icon = chapter.icon;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Outer Timeline Dot node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-accent-purple bg-[#030712] flex items-center justify-center z-20 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    <Icon className="w-4 h-4 text-accent-cyan" />
                  </div>

                  {/* Panel Container (Staggered transition) */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isEven ? 50 : -50,
                      y: 20,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className={`w-full md:w-[45%] pl-12 md:pl-0 ${
                      isEven ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 relative shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.06)] group">
                      {/* Interactive glow card background detail */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent-purple/2 to-accent-cyan/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Header Badge */}
                      <span className="text-[10px] tracking-widest font-mono font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-md uppercase mb-3 inline-block">
                        {chapter.tag}
                      </span>

                      {/* Period */}
                      <h4 className="text-xs font-semibold font-mono text-gray-500 mb-1 flex items-center gap-1.5 justify-start md:justify-end group-even:md:justify-start">
                        {chapter.period}
                      </h4>

                      {/* Title */}
                      <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-accent-purple transition-colors duration-200">
                        {chapter.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {chapter.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Spacer node for Desktop */}
                  <div className="hidden md:block w-[10%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
