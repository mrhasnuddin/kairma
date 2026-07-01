"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteCopy } from "@/lib/language";
import Button from "../ui/Button";

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PilotModal: React.FC<PilotModalProps> = ({ isOpen, onClose }) => {
  const siteCopy = useSiteCopy();
  const c = siteCopy.pilotModal;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    workflow: "",
    sovereignty: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);

  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === "Tab") {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Work email is required");
      return;
    }
    // Restrained validation for emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid work email");
      return;
    }
    setError("");
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-theme-void/80 backdrop-blur-md font-mono overflow-y-auto"
        onKeyDown={handleFocusTrap}
      >
        {/* Modal container */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-theme-void border-2 border-theme-border rounded-sm shadow-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-6 my-auto"
        >
          {/* Gothic Technical Corners */}
          <div className="absolute top-0 left-0 w-4.5 h-4.5 border-t-2 border-l-2 border-theme-accent pointer-events-none" />
          <div className="absolute top-0 right-0 w-4.5 h-4.5 border-t-2 border-r-2 border-theme-accent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4.5 h-4.5 border-b-2 border-l-2 border-theme-accent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4.5 h-4.5 border-b-2 border-r-2 border-theme-accent pointer-events-none" />

          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text transition-colors duration-150 text-xs p-1 select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-theme-accent"
            aria-label="Close modal"
          >
            [ ESC · CLOSE ]
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="flex flex-col gap-2 border-b border-theme-border pb-4 mt-2">
                <span className="text-xs text-theme-accent tracking-[0.18em] font-mono font-bold uppercase select-none">
                  // ONBOARDING INITIATION
                </span>
                <h3 id="modal-title" className="text-2xl font-bold uppercase tracking-wider text-theme-text font-serif leading-tight">
                  {c.title}
                </h3>
                <div className="text-sm md:text-base font-serif italic text-theme-accent font-normal mt-1 leading-normal">
                  {c.subtitle}
                </div>
                <div className="text-xs text-theme-text-muted font-mono mt-1">
                  {c.monoDesc}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs md:text-sm">
                {error && (
                  <div className="p-2.5 border border-red-950 bg-red-950/20 text-red-500 text-xs rounded-xs select-none font-mono">
                    Error: {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.name.label}
                    </label>
                    <input
                      ref={firstFocusableRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={c.fields.name.placeholder}
                      className="bg-theme-void/50 border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 text-xs md:text-sm"
                    />
                  </div>

                  {/* Work Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.email.label}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={c.fields.email.placeholder}
                      className="bg-theme-void/50 border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 text-xs md:text-sm"
                    />
                  </div>

                  {/* Company field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.company.label}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={c.fields.company.placeholder}
                      className="bg-theme-void/50 border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 text-xs md:text-sm"
                    />
                  </div>

                  {/* Country field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.country.label}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-theme-void border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 appearance-none cursor-pointer text-xs md:text-sm"
                      >
                        <option value="">Select country...</option>
                        {c.fields.country.options?.map((opt) => (
                          <option key={opt} value={opt} className="bg-theme-void text-theme-text">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-theme-text-muted font-mono text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Workflow field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.workflow.label}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.workflow}
                        onChange={(e) => setFormData({ ...formData, workflow: e.target.value })}
                        className="w-full bg-theme-void border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 appearance-none cursor-pointer text-xs md:text-sm"
                      >
                        <option value="">Select workflow...</option>
                        {c.fields.workflow.options?.map((opt) => (
                          <option key={opt} value={opt} className="bg-theme-void text-theme-text">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-theme-text-muted font-mono text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Data Sovereignty field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-theme-text-muted text-xs font-mono uppercase font-bold tracking-[0.18em]">
                      {c.fields.sovereignty.label}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.sovereignty}
                        onChange={(e) => setFormData({ ...formData, sovereignty: e.target.value })}
                        className="w-full bg-theme-void border border-theme-border hover:border-theme-accent focus:border-theme-accent p-2.5 outline-none rounded-xs text-theme-text font-mono transition-colors duration-150 appearance-none cursor-pointer text-xs md:text-sm"
                      >
                        <option value="">Select requirement...</option>
                        {c.fields.sovereignty.options?.map((opt) => (
                          <option key={opt} value={opt} className="bg-theme-void text-theme-text">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-theme-text-muted font-mono text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  className="w-full mt-4 border-theme-accent py-2.5 font-bold uppercase select-none font-mono tracking-[0.18em] text-xs md:text-sm cursor-pointer"
                >
                  {c.submitCta}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-8 text-center gap-6 font-mono">
              {/* Success Sigil */}
              <div className="w-12 h-12 rounded-full border border-theme-accent flex items-center justify-center text-theme-accent animate-pulse font-bold text-lg">
                ✓
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold uppercase tracking-wider text-theme-text">
                  {c.success.title}
                </h3>
                <p className="text-base text-theme-accent font-bold">
                  {c.success.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3.5 w-full mt-4 max-w-sm">
                <a
                  href={c.success.downloadLink}
                  download
                  className="w-full text-center px-4 py-2.5 bg-theme-accent text-theme-void hover:bg-theme-accent/90 transition-colors duration-150 text-xs font-mono uppercase tracking-[0.18em] font-bold rounded-xs select-none"
                >
                  {c.success.downloadCta}
                </a>
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="md"
                  className="w-full font-bold uppercase tracking-[0.18em] text-xs"
                >
                  {c.success.closeCta}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PilotModal;
