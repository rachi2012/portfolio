"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Sparkles } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Helix Engine",
      tag: "ANIMATION LIBRARY",
      description:
        "A highly performant, accessible scroll-narrative component framework. Built specifically to eliminate layout thrashing during heavy parallax scrolls by shifting animations completely onto GPU-accelerated CSS layers.",
      tech: ["React", "Framer Motion", "CSS Variables", "HTML5 Canvas"],
      github: "https://github.com/example/helix-engine",
      live: "https://example.com/helix-engine",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(139,92,246,0.2)]",
    },
    {
      title: "Ethara Analytics",
      tag: "REAL-TIME DASHBOARD",
      description:
        "A glassmorphic web dashboard providing clean real-time metrics, interactive chart visualizations, and high-frequency updates. Features optimized lazy loading, custom hooks, and absolute accessible navigation pathways.",
      tech: ["Next.js", "Tailwind CSS", "Recharts", "WebSockets"],
      github: "https://github.com/example/ethara-analytics",
      live: "https://example.com/ethara-analytics",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
    },
    {
      title: "Aero Secure Gateway",
      tag: "BACKEND MIDDLEWARE",
      description:
        "A secure, lightweight Node/Express API proxy serving IP-based rate limiting, sanitization pipelines (XSS defense), and Nodemailer automated SMTP triggers. Designed to scale seamlessly for high-traffic microservices.",
      tech: ["Node.js", "Express", "Nodemailer", "Redis Rate Limiter"],
      github: "https://github.com/example/aero-secure",
      live: "https://example.com/aero-secure",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(167,139,250,0.2)]",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 16 },
    },
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 md:py-32 px-6 flex items-center justify-center bg-[#030712]/80 overflow-hidden"
    >
      {/* Dynamic background glowing bubble */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-xs font-semibold text-accent-cyan tracking-widest uppercase mb-4"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Creative Showcase</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white"
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-accent-purple via-[#c084fc] to-accent-cyan bg-clip-text text-transparent glow-text-purple">
              Productions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base font-light"
          >
            A selective window into applications where aesthetics meet high-efficiency engineering.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.015 }}
              className={`glass-panel glass-panel-hover p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden group transition-all duration-300 ${project.glowColor}`}
            >
              {/* Inner ambient light gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/2 to-accent-cyan/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Project Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] tracking-widest font-mono font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-md uppercase">
                    {project.tag}
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label={`Visit ${project.title} live deployment`}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-accent-purple transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-8 font-light">
                  {project.description}
                </p>
              </div>

              {/* Technologies List */}
              <div>
                <div className="h-[1px] w-full bg-white/5 mb-6" />
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
