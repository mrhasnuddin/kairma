"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language";

interface HowDeploymentWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowDeploymentWorksModal: React.FC<HowDeploymentWorksModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-theme-void/80 backdrop-blur-md font-mono overflow-y-auto"
          onClick={onClose}
        >
          {/* Modal container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-theme-void border border-theme-border/60 rounded-3xl shadow-[0_0_50px_rgba(31,170,104,0.15)] p-6 sm:p-8 md:p-10 flex flex-col gap-6 my-auto backdrop-blur-md overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button top right */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-theme-text-muted hover:text-theme-text transition-colors duration-150 text-xs p-2 select-none cursor-pointer outline-none rounded-xl border border-theme-border/40 hover:border-theme-accent/40 bg-theme-void"
              aria-label="Close modal"
            >
              [ ESC · CLOSE ]
            </button>

            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-theme-border/30 pb-5 mt-2 pr-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-pulse" />
                <span className="text-xs text-theme-accent tracking-[0.18em] font-mono font-bold uppercase select-none">
                  // FORWARD DEPLOYMENT ARCHITECTURE
                </span>
              </div>
              <h3 id="modal-title" className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-theme-text font-serif leading-tight mt-1">
                HOW DEPLOYMENT WORKS
              </h3>
              <div className="text-xs sm:text-sm font-mono tracking-widest text-theme-accent uppercase mt-1">
                Self-Hosted AI Agents via Forward-Deployed Engineering (FDE)
              </div>
            </div>

            {/* Body Content */}
            <div className="flex flex-col gap-5 text-sm sm:text-base font-mono leading-relaxed text-theme-text">
              <p className="p-4 rounded-2xl bg-theme-void/60 border border-theme-border/30 text-theme-text">
                Enterprise deployment is not API key distribution. We embed Forward-Deployed Engineers (FDEs) directly with your operations team to connect open-weights reasoning models (DeepSeek R1, Llama 3.3, Qwen 2.5) to your proprietary database and ERP systems.
              </p>
              <p className="text-theme-text-muted px-2">
                Every workflow runs inside your VPC or bare-metal server. No data ever phones home to OpenAI, Anthropic, or Kairma. You retain 100% data sovereignty and audit-ready governance across all cross-border operations.
              </p>
            </div>

            {/* Footer status chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-theme-border/20 text-xs text-theme-text-muted font-mono">
              <span className="inline-flex items-center gap-2 text-theme-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                100% SOVEREIGN RUNTIME
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-theme-accent text-theme-void font-bold hover:opacity-90 transition-opacity uppercase tracking-wider text-xs"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HowDeploymentWorksModal;
