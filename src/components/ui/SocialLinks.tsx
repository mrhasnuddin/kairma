"use client";

import React from "react";

export const XLogoIcon = ({ size = 14, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const GithubIcon = ({ size = 14, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const TiktokIcon = ({ size = 14, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const YoutubeIcon = ({ size = 14, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 17a2.4 2.4 0 0 1-.5-1.6V8.6A2.4 2.4 0 0 1 4.4 7h15.2a2.4 2.4 0 0 1 1.9 1.6v6.8a2.4 2.4 0 0 1-.5 1.6 2.4 2.4 0 0 1-1.9.6H4.4a2.4 2.4 0 0 1-1.9-.6Z" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

export const InstagramIcon = ({ size = 14, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const SocialLinks: React.FC = () => {
  const socials = [
    { label: "X", href: "https://x.com", Icon: XLogoIcon },
    { label: "GitHub", href: "https://github.com", Icon: GithubIcon },
    { label: "TikTok", href: "https://tiktok.com", Icon: TiktokIcon },
    { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
    { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  ];

  return (
    <div className="flex items-center justify-between gap-1 border border-theme-border/50 p-1 rounded-lg bg-theme-void/80 w-full max-w-full select-none">
      {socials.map((social, idx) => (
        <a
          key={idx}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            e.currentTarget.style.setProperty('--mx', `${x * 0.45}px`);
            e.currentTarget.style.setProperty('--my', `${y * 0.45}px`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('--mx', `0px`);
            e.currentTarget.style.setProperty('--my', `0px`);
          }}
          className="group relative flex-1 flex items-center justify-center py-2 px-2 rounded-xl cursor-pointer transition-colors duration-300 outline-none select-none text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10 overflow-hidden"
          aria-label={social.label}
        >
          <div 
            className="relative flex items-center justify-center w-6 h-6"
            style={{ 
              transform: 'translate(var(--mx, 0px), var(--my, 0px))',
              transition: 'transform 0.2s cubic-bezier(0.25, 1.25, 0.5, 1)'
            }}
          >
            <social.Icon size={14} />

            <div className="absolute inset-0 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none rounded-full border border-theme-accent/40 bg-theme-accent/5" />
          </div>
        </a>
      ))}
    </div>
  );
};
