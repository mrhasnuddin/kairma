"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language";

export const StickyNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "OS", href: "#os" },
    { label: "Foundry", href: "#foundry" },
    { label: "Museum", href: "#museum" },
    { label: "Dispatches", href: "#dispatches" },
  ];

  return (
    <>
      {/* Desktop Sticky Nav Pill */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden md:flex">
        <div 
          className={`flex items-center gap-6 px-6 py-3 rounded-full transition-colors duration-500 backdrop-blur-md border ${
            isScrolled 
              ? "bg-theme-void/80 border-theme-border shadow-[0_0_20px_var(--color-theme-border-glow)] text-theme-text" 
              : "bg-transparent border-transparent text-theme-accent"
          }`}
        >
          <div 
            className="h-5 w-24 mr-4 bg-theme-accent"
            style={{
              WebkitMaskImage: 'url(/kairma-logo.svg)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskImage: 'url(/kairma-logo.svg)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'left center',
            }}
          />
          
          {/* Navigation links removed as per user request */}
          
          <div className="w-px h-4 bg-theme-border mx-2" />
          
          <button className="text-xs font-mono font-bold uppercase tracking-widest text-theme-void bg-theme-accent px-4 py-1.5 rounded-full transition-colors opacity-90 hover:opacity-100">
            Apply
          </button>
        </div>
      </div>

      {/* Mobile Sticky Nav Pill (Hamburger) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[calc(100%-2rem)] max-w-sm">
        <div className="flex items-center justify-between px-5 py-3 rounded-full bg-theme-void/90 backdrop-blur-md border border-theme-border shadow-lg transition-colors duration-500">
          <div 
            className="h-4 w-20 bg-theme-accent"
            style={{
              WebkitMaskImage: 'url(/kairma-logo.svg)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskImage: 'url(/kairma-logo.svg)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'left center',
            }}
          />
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-theme-text hover:text-theme-accent transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-theme-void/95 backdrop-blur-lg transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          {/* Navigation links removed as per user request */}
          <button 
            className="mt-4 text-xl font-mono font-bold uppercase tracking-widest text-theme-void bg-theme-accent px-8 py-3 rounded-full transition-colors opacity-90 hover:opacity-100"
          >
            Apply to Build
          </button>
        </div>
      </div>
    </>
  );
};
