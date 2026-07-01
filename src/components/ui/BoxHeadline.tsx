import React from "react";
import { useLanguage } from "@/lib/language";

interface BoxHeadlineProps {
  text?: string;
  className?: string;
}

export const BoxHeadline: React.FC<BoxHeadlineProps> = ({ text, className = "" }) => {
  const { language } = useLanguage();

  if (!text) return null;

  // Apply Canterbury (font-gothic) ONLY to the first character for English ('en') and Malay ('ms') languages
  if (language === "en" || language === "ms") {
    const firstChar = text.charAt(0);
    const restChars = text.slice(1);
    return (
      <span className={className}>
        <span className="font-gothic font-normal inline text-[1.25em] mr-[1.5px]">
          {firstChar}
        </span>
        {restChars}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
};
