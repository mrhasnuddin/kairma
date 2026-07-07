import React from "react";
import { useLanguage } from "@/lib/language";

interface EyebrowTextProps {
  text?: string;
  className?: string;
  capitalClassName?: string;
}

export const EyebrowText: React.FC<EyebrowTextProps> = ({
  text = "",
  className = "",
  capitalClassName = "",
}) => {
  const { language } = useLanguage();

  if (!text) return null;

  if (language !== "en" && language !== "ms") {
    return <span className={className}>{text}</span>;
  }

  const elements: React.ReactNode[] = [];
  let currentNormalBuffer = "";
  let isStartOfWord = true;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isAlpha = /[a-zA-Z]/.test(char);

    if (isAlpha && isStartOfWord) {
      if (currentNormalBuffer) {
        elements.push(
          <span key={`norm-${i}`} className={className}>
            {currentNormalBuffer}
          </span>
        );
        currentNormalBuffer = "";
      }
      elements.push(
        <span key={`cap-${i}`} className={capitalClassName}>
          {char}
        </span>
      );
      isStartOfWord = false;
    } else {
      currentNormalBuffer += char;
      if (!isAlpha) {
        isStartOfWord = true;
      }
    }
  }

  if (currentNormalBuffer) {
    elements.push(
      <span key="norm-end" className={className}>
        {currentNormalBuffer}
      </span>
    );
  }

  return <span className="inline">{elements}</span>;
};
