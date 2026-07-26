"use client";

import React, { useState } from "react";

export interface MoatMatrixItem {
  number: string;
  title: string;
  description: string;
  tag: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface RosterMatrixItem {
  role: string;
  status: string;
  description: string;
}

export interface MoatsBentoContentProps {
  moatsLabel: string;
  moatsItems: MoatMatrixItem[];
}

export const MoatsBentoContent: React.FC<MoatsBentoContentProps> = ({
  moatsLabel,
  moatsItems,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {/* FULL CAPS Column Title */}
      <h3 className="font-serif font-medium text-theme-text text-box-headline uppercase tracking-wider mb-5">
        {moatsLabel}
      </h3>

      {/* Ultra-Clean Scannable Moats Stack */}
      <div className="flex flex-col gap-3">
        {moatsItems.map((moat, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${
                isHovered
                  ? "border-theme-accent bg-theme-accent/[0.07] shadow-sm"
                  : "border-theme-border/40 bg-theme-void/70 hover:border-theme-border"
              }`}
            >
              <div className="flex items-start md:items-center gap-4 min-w-0">
                {/* Number Badge */}
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 transition-colors ${
                    isHovered
                      ? "border-theme-accent bg-theme-accent text-theme-void"
                      : "border-theme-border/50 bg-theme-void text-theme-accent"
                  }`}
                >
                  {moat.number}
                </span>

                {/* Title & Description */}
                <div className="min-w-0">
                  <h4
                    className={`font-serif font-medium text-base md:text-lg text-theme-text transition-colors ${
                      isHovered ? "text-theme-accent" : ""
                    }`}
                  >
                    {moat.title}
                  </h4>
                  {moat.description && (
                    <p className="font-mono text-xs text-theme-text-muted mt-0.5 leading-relaxed">
                      {moat.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface RosterBentoContentProps {
  rosterHeading: string;
  rosterItems: RosterMatrixItem[];
}

export const RosterBentoContent: React.FC<RosterBentoContentProps> = ({
  rosterHeading,
  rosterItems,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {/* FULL CAPS Column Title */}
      <h3 className="font-serif font-medium text-theme-text text-box-headline uppercase tracking-wider mb-5">
        {rosterHeading}
      </h3>

      {/* Ultra-Clean Vertically Stacked AI Employee Rows matching Left Column */}
      <div className="flex flex-col gap-3">
        {rosterItems.map((emp, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${
                isHovered
                  ? "border-theme-accent bg-theme-accent/[0.07] shadow-sm"
                  : "border-theme-border/40 bg-theme-void/70 hover:border-theme-border"
              }`}
            >
              <div className="min-w-0">
                <h4
                  className={`font-serif font-medium text-base md:text-lg text-theme-text transition-colors ${
                    isHovered ? "text-theme-accent" : ""
                  }`}
                >
                  {emp.role}
                </h4>
                <p className="font-mono text-xs text-theme-text-muted mt-0.5 leading-relaxed">
                  {emp.description}
                </p>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full border font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                  isHovered
                    ? "border-theme-accent bg-theme-accent text-theme-void"
                    : "border-theme-accent/30 bg-theme-accent/10 text-theme-accent"
                }`}
              >
                {emp.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
