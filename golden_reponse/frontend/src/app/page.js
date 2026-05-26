"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);

  return (
    <>
      {/* Immersive mesh backdrop */}
      <div className="mesh-gradient-bg" aria-hidden="true" />

      {/* Structured Floating Header */}
      <Header onOpenContact={openContact} />

      {/* Main Sections */}
      <main className="flex-grow flex flex-col relative z-10">
        {/* Hero Section */}
        <Hero onOpenContact={openContact} />

        {/* Storytelling Timeline About Section */}
        <About />

        {/* Interactive Skills Matrix Section */}
        <Skills />

        {/* Tilt Hover Grid Projects Section */}
        <Projects />
      </main>

      {/* Visual CTA Footer Section */}
      <Footer onOpenContact={openContact} />

      {/* Accessible Contact Dialog Modal */}
      <AnimatePresence mode="wait">
        {isContactOpen && (
          <ContactModal isOpen={isContactOpen} onClose={closeContact} />
        )}
      </AnimatePresence>
    </>
  );
}
