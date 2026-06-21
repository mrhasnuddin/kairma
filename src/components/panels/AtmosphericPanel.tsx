"use client";

import React, { useEffect, useState } from "react";
import PanelFrame from "./PanelFrame";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import { useSiteCopy } from "@/lib/language";
import { useTheme } from "@/lib/theme";

export const AtmosphericPanel: React.FC = () => {
  const { theme } = useTheme();
  const siteCopy = useSiteCopy();
  const sc = siteCopy.status;
  const [time, setTime] = useState("");

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PanelFrame
      title="SYSTEM STATUS"
      subtitle="SYSTEM_MONITOR.SH"
      terminalStyle={true}
      corners={true}
      className="h-full select-none"
    >
      <div className="flex flex-col h-full justify-between gap-4 font-mono text-xs">
        {/* Top: Metadata items */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center border-b border-theme-border/30 pb-1.5">
            <span className="text-theme-text-muted">OS NAME</span>
            <span className="font-bold text-theme-text">{sc.osName}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-theme-border/30 pb-1.5">
            <span className="text-theme-text-muted">VERSION</span>
            <span className="text-theme-accent font-semibold">{sc.version}</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/30 pb-1.5">
            <span className="text-theme-text-muted">DATA MODE</span>
            <span className="text-theme-text font-bold uppercase tracking-wider">{sc.dataMode}</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/30 pb-1.5">
            <span className="text-theme-text-muted">MODEL ROUTE</span>
            <span className="text-theme-text uppercase">{sc.modelRoute}</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/30 pb-1.5">
            <span className="text-theme-text-muted">RAW DATA</span>
            <span className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {sc.rawData}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-theme-text-muted">CLOCK</span>
            <span className="font-bold text-theme-text font-mono tabular-nums">{time || "--:--:--"}</span>
          </div>
        </div>

        {/* Bottom: Theme switcher */}
        <div className="border-t border-theme-border pt-4 mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-theme-text-muted uppercase tracking-wider font-bold">
              THEME CONTROL
            </span>
            <span className="text-[9px] opacity-75 font-mono text-theme-accent uppercase">
              {theme === "matrix-mode" ? "Matrix Mode" : "Xuan Mode"}
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </PanelFrame>
  );
};

export default AtmosphericPanel;
