"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Layout, Server, Settings, Zap } from "lucide-react";

export default function Skills() {
  const [activeTab, setActiveTab] = useState("all");

  const skillCategories = [
    { id: "all", name: "All Matrix" },
    { id: "frontend", name: "Frontend Core" },
    { id: "backend", name: "Backend Engines" },
    { id: "tools", name: "Systems & Tools" },
  ];

  const skillItems = [
    // Frontend
    { name: "React & Next.js", level: 92, category: "frontend", icon: Layout },
    { name: "Framer Motion", level: 90, category: "frontend", icon: Zap },
    { name: "Tailwind CSS & PostCSS", level: 95, category: "frontend", icon: Layout },
    { name: "JavaScript / ES6+", level: 94, category: "frontend", icon: Layout },
    
    // Backend
    { name: "Node.js & Express", level: 86, category: "backend", icon: Server },
    { name: "REST APIs & JSON Structures", level: 88, category: "backend", icon: Server },
    { name: "Nodemailer & SMTP Integrations", level: 84, category: "backend", icon: Server },
    { name: "Database Engineering (MongoDB/SQL)", level: 78, category: "backend", icon: Server },

    // Systems & Tools
    { name: "Git & CI/CD", level: 85, category: "tools", icon: Settings },
    { name: "Vite & Build Tooling", level: 88, category: "tools", icon: Settings },
    { name: "Web Security & Sanitization", level: 85, category: "tools", icon: Settings },
    { name: "Accessibility (ARIA & Semantic HTML)", level: 90, category: "tools", icon: Settings },
  ];

  const filteredSkills = activeTab === "all" 
    ? skillItems 
    : skillItems.filter(item => item.category === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen py-24 md:py-32 px-6 flex items-center justify-center bg-[#030712]/90 overflow-hidden"
    >
      {/* Decorative top grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none" />

      {/* Cybernetic ambient background details */}
      <div className="absolute right-0 bottom-1/4 w-[300px] h-[300px] rounded-full bg-accent-cyan/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-purple/20 bg-accent-purple/5 text-xs font-semibold text-accent-purple tracking-widest uppercase mb-4"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Capability Index</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white"
          >
            Powering the{" "}
            <span className="bg-gradient-to-r from-accent-purple via-purple-400 to-accent-cyan bg-clip-text text-transparent glow-text-cyan">
              Engine
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base font-light"
          >
            A breakdown of my technical stack, architecture capabilities, and interactive interface engineering strengths.
          </motion.p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === cat.id
                  ? "bg-gradient-to-r from-accent-purple to-accent-cyan text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] border-transparent"
                  : "glass-panel text-gray-400 hover:text-white border-white/5 hover:border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill) => {
            const SkillIcon = skill.icon;
            
            return (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                layout
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 flex flex-col justify-between shadow-xl relative overflow-hidden group"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-cyan transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-accent-purple/10 border border-white/5 group-hover:border-accent-purple/20 transition-all duration-300">
                      <SkillIcon className="w-5 h-5 text-accent-cyan group-hover:text-accent-purple transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-6 group-hover:text-accent-cyan transition-colors duration-300 tracking-wide">
                    {skill.name}
                  </h3>
                </div>

                {/* Progress bar container */}
                <div className="w-full">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
