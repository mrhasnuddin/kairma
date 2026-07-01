import React from "react";
import { useLanguage } from "@/lib/language";

interface BoxHeadlineProps {
  text?: string;
  className?: string;
}

export const BoxHeadline: React.FC<BoxHeadlineProps> = ({ text, className = "" }) => {
  const { language } = useLanguage();

  if (!text) return null;

  // Apply Canterbury (font-gothic) to ALL characters for English ('en') and Malay ('ms') languages
  if (language === "en" || language === "ms") {
    return (
      <span className={`font-gothic font-normal tracking-wide ${className}`}>
        {text}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
};
