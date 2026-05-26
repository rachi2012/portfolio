"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send, CheckCircle2, AlertCircle, Phone, Mail, User, MessageSquare } from "lucide-react";

export default function ContactModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website_honey: "", // honeypot spam prevention
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Accessibility: Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Save active element to restore it on close
    const previousFocus = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Focus trapping
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Set initial focus to Name input after short animation delay
    const timer = setTimeout(() => {
      const nameInput = modalRef.current?.querySelector('input[name="name"]');
      nameInput?.focus();
    }, 150);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      // Restore focus on close
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  // Clean state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        website_honey: "",
      });
      setErrors({});
      setIsSuccess(false);
      setServerError("");
    }
  }, [isOpen]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Field validations
  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone Validation (Allows international phone numbers, digits, spaces, dashes, parentheses)
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (min 7 digits).";
    }

    // Message limit validation
    if (formData.message.length > 1000) {
      newErrors.message = "Message must not exceed 1000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    
    // Honeypot check: If honeypot is filled, simulate a silent successful response
    if (formData.website_honey) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setServerError(data.error || "Form submission failed. Please try again.");
      }
    } catch (err) {
      setServerError("Unable to connect to the server. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-md"
      />

      {/* Modal Dialog Window */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative w-full max-w-lg glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.25)] bg-[#030712] overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Glow corner accents */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-purple/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-accent-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal dialog"
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-accent-purple/40 hover:bg-accent-purple/10 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form success layout */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <CheckCircle2 className="w-16 h-16 text-accent-cyan mx-auto mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-full bg-accent-cyan/10 p-1" />
            <h3 id="modal-title" className="text-2xl font-display font-extrabold text-white mb-4">
              Transmission Confirmed!
            </h3>
            <p className="text-gray-300 text-sm md:text-base font-light mb-8 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="font-semibold text-white">{formData.name}</strong>. Your message was successfully encrypted and sent. I'll get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-bold tracking-wider uppercase shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:scale-[1.01] transition-transform duration-200"
            >
              Back to Portfolio
            </button>
          </motion.div>
        ) : (
          <div>
            {/* Modal Title Block */}
            <div className="mb-6">
              <h3 id="modal-title" className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
                Get in <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent glow-text-purple">Touch</span>
              </h3>
              <p className="text-gray-400 text-xs md:text-sm font-light mt-1">
                Fill out the secure fields below. I'll respond within 24 hours.
              </p>
            </div>

            {/* API Server Errors */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-950/45 border border-red-500/20 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden from normal users) */}
              <div className="absolute opacity-0 pointer-events-none w-0 h-0 z-[-1] overflow-hidden">
                <label htmlFor="website_honey">Leave this field blank</label>
                <input
                  id="website_honey"
                  name="website_honey"
                  type="text"
                  tabIndex="-1"
                  value={formData.website_honey}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name <span className="text-accent-purple">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-[#050914] border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all duration-200 ${
                      errors.name ? "border-red-500/50" : "border-white/5 hover:border-white/10"
                    }`}
                  />
                </div>
                {errors.name && (
                  <span id="name-error" className="block text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.name}
                  </span>
                )}
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address <span className="text-accent-purple">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-[#050914] border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all duration-200 ${
                        errors.email ? "border-red-500/50" : "border-white/5 hover:border-white/10"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span id="email-error" className="block text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-accent-purple">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-[#050914] border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all duration-200 ${
                        errors.phone ? "border-red-500/50" : "border-white/5 hover:border-white/10"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <span id="phone-error" className="block text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Message field (optional, character count tracker) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Message <span className="text-gray-600">(Optional)</span>
                  </label>
                  <span className={`text-[10px] font-mono ${formData.message.length > 1000 ? "text-red-400" : "text-gray-500"}`}>
                    {formData.message.length}/1000
                  </span>
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4.5 w-4 h-4 text-gray-500" />
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    maxLength="1050"
                    placeholder="Tell me about your project and requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full bg-[#050914] border rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all duration-200 resize-none ${
                      errors.message ? "border-red-500/50" : "border-white/5 hover:border-white/10"
                    }`}
                  />
                </div>
                {errors.message && (
                  <span id="message-error" className="block text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-bold tracking-wider uppercase shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:scale-[1.015] active:scale-[0.985] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Securing Submission...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
