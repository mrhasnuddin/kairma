import React from "react";
import { useLanguage } from "@/lib/language";

interface BoxHeadlineProps {
  text?: string;
  className?: string;
}

export const BoxHeadline: React.FC<BoxHeadlineProps> = ({ text, className = "" }) => {
  const { language } = useLanguage();

  if (!text) return null;

  // Apply secondary font (font-serif / Gloock / EB Garamond) for high readability and manuscript elegance
  if (language === "en" || language === "ms") {
    return (
      <span className={`font-serif font-medium tracking-normal text-balance ${className}`}>
        {text}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
};
