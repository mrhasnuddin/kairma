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
      className={`relative flex flex-col overflow-hidden bg-theme-void/80 backdrop-blur-sm transition-all duration-300 font-mono ${borderClass} ${width} ${height} ${className}`}
    >
      {/* Corner Brackets */}
      {corners && (
        <>
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-theme-accent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-theme-accent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-theme-accent pointer-events-none z-10" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-theme-accent pointer-events-none z-10" />
        </>
      )}

      {/* Header Bar */}
      {(title || subtitle || terminalStyle) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-theme-border bg-theme-void/60 text-xs select-none">
          <div className="flex items-center gap-3">
            {terminalStyle && (
              <span className="text-theme-accent font-semibold tracking-[0.18em] mr-0.5">
                //
              </span>
            )}
            {status && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusColor[status]}`}
              />
            )}
            <div className="flex flex-col">
              {title && (
                <span className="font-mono font-bold uppercase tracking-[0.18em] text-theme-text text-[11px] md:text-xs">
                  {title}
                </span>
              )}
              {subtitle && (
                <span className="text-[10px] text-theme-text-muted font-mono leading-none tracking-wider mt-0.5 uppercase">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-theme-text-muted">
            {headerRight}
            {terminalStyle && (
              <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs opacity-80">
                <span className="opacity-40 tracking-[0.18em]">LOC:</span>
                <span className="text-theme-accent font-semibold tracking-[0.18em]">SYS.PANEL</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-4 relative overflow-y-auto min-h-0 text-sm md:text-base text-theme-text">
        {children}
      </div>

      {/* Terminal Style Footer */}
      {terminalStyle && (
        <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-theme-border bg-theme-void/40 text-[10px] md:text-xs font-mono text-theme-text-muted select-none">
          <div className="flex items-center gap-2">
            <span className="text-theme-accent font-bold">&gt;</span>
            <span className="animate-pulse tracking-wider">_ READY</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="tracking-wider">KAIRMA.OS_V1.0.0</span>
            <span className="px-1.5 py-0.5 border border-theme-border text-theme-accent text-[9px] tracking-[0.18em] uppercase rounded-sm font-semibold">
              SECURE
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelFrame;
