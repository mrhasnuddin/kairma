import React from "react";

interface PanelLineProps {
  className?: string;
  label?: string;
  labelPosition?: "left" | "center" | "right";
  variant?: "solid" | "dashed" | "glow";
}

export const PanelLineHorizontal: React.FC<PanelLineProps> = ({
  className = "",
  label,
  labelPosition = "center",
  variant = "solid",
}) => {
  const lineStyles = {
    solid: "border-theme-border",
    dashed: "border-dashed border-theme-border",
    glow: "border-theme-accent shadow-[0_0_8px_var(--theme-border-glow)]",
  };

  return (
    <div
      className={`relative flex items-center w-full my-4 select-none ${className}`}
    >
      {/* Left Cap */}
      <div className="text-[8px] text-theme-accent font-mono font-bold leading-none select-none">
        +
      </div>

      {/* Line & Label Layout */}
      {label ? (
        <>
          {labelPosition === "left" && (
            <>
              <span className="px-2 font-mono text-[9px] text-theme-accent uppercase tracking-widest font-semibold">
                [{label}]
              </span>
              <div className={`flex-1 border-t ${lineStyles[variant]}`} />
            </>
          )}
          {labelPosition === "center" && (
            <>
              <div className={`flex-1 border-t ${lineStyles[variant]}`} />
              <span className="px-2 font-mono text-[9px] text-theme-accent uppercase tracking-widest font-semibold">
                [{label}]
              </span>
              <div className={`flex-1 border-t ${lineStyles[variant]}`} />
            </>
          )}
          {labelPosition === "right" && (
            <>
              <div className={`flex-1 border-t ${lineStyles[variant]}`} />
              <span className="px-2 font-mono text-[9px] text-theme-accent uppercase tracking-widest font-semibold">
                [{label}]
              </span>
            </>
          )}
        </>
      ) : (
        <div className={`flex-1 border-t ${lineStyles[variant]}`} />
      )}

      {/* Right Cap */}
      <div className="text-[8px] text-theme-accent font-mono font-bold leading-none select-none">
        +
      </div>
    </div>
  );
};

export const PanelLineVertical: React.FC<
  Omit<PanelLineProps, "label" | "labelPosition">
> = ({ className = "", variant = "solid" }) => {
  const lineStyles = {
    solid: "border-theme-border",
    dashed: "border-dashed border-theme-border",
    glow: "border-theme-accent shadow-[0_0_8px_var(--theme-border-glow)]",
  };

  return (
    <div
      className={`relative flex flex-col items-center h-full mx-4 select-none ${className}`}
    >
      {/* Top Cap */}
      <div className="text-[8px] text-theme-accent font-mono font-bold leading-none select-none">
        +
      </div>
      {/* Vertical line */}
      <div className={`flex-1 border-l ${lineStyles[variant]}`} />
      {/* Bottom Cap */}
      <div className="text-[8px] text-theme-accent font-mono font-bold leading-none select-none">
        +
      </div>
    </div>
  );
};

interface SystemIndicatorProps {
  className?: string;
  totalBlocks?: number;
  activeBlocks?: number;
  label?: string;
}

export const SystemIndicator: React.FC<SystemIndicatorProps> = ({
  className = "",
  totalBlocks = 5,
  activeBlocks = 3,
  label = "SYS.LOAD",
}) => {
  return (
    <div
      className={`flex items-center gap-2 font-mono text-[9px] text-theme-text-muted select-none ${className}`}
    >
      {label && <span>{label}:</span>}
      <div className="flex gap-0.5">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-2.5 transition-all duration-300 ${
              i < activeBlocks
                ? "bg-theme-accent shadow-[0_0_4px_var(--theme-border-glow)]"
                : "bg-theme-border/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
