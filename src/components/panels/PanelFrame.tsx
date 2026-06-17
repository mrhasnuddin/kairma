import React from "react";

interface PanelFrameProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  width?: string; // e.g. 'w-full', 'w-96', etc.
  height?: string; // e.g. 'h-full', 'h-64', etc.
  corners?: boolean; // Show technical L-shaped corner brackets
  terminalStyle?: boolean; // Show terminal-style header indicators and footer status
  glow?: boolean; // Apply theme-accent glow
  className?: string;
  status?: "idle" | "active" | "warning" | "error";
  headerRight?: React.ReactNode;
}

export const PanelFrame: React.FC<PanelFrameProps> = ({
  children,
  title,
  subtitle,
  width = "w-full",
  height = "h-auto",
  corners = true,
  terminalStyle = true,
  glow = false,
  className = "",
  status = "idle",
  headerRight,
}) => {
  // Determine border and shadow classes
  const borderClass = glow ? "border-etched-glow" : "border-etched";

  // Status indicator indicator styles
  const statusColor = {
    idle: "bg-theme-chrome/50",
    active: "bg-theme-accent animate-pulse",
    warning: "bg-amber-500 animate-pulse",
    error: "bg-red-600 animate-ping",
  };

  return (
    <div
      className={`relative flex flex-col min-w-0 overflow-hidden bg-theme-void/80 backdrop-blur-md transition-colors duration-300 font-sans border border-theme-border/20 ${width} ${height} ${className}`}
    >

      {/* Header Bar */}
      {(title) && (
        <div className="flex items-center justify-between px-8 py-6 md:px-12 md:py-8 select-none">
          <div className="flex items-center gap-3">
            {title && (
              <span className="font-sans font-medium text-theme-text text-xl md:text-2xl tracking-wide">
                {title}
              </span>
            )}
          </div>

          {headerRight && (
            <div className="flex items-center gap-4 text-theme-text-muted">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 min-h-0 px-8 pb-8 md:px-12 md:pb-12 relative overflow-y-auto overflow-x-hidden text-base md:text-lg text-theme-text/90 font-sans leading-relaxed custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default PanelFrame;
