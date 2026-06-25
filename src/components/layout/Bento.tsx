import React from "react";

// Helper for joining classes
const cx = (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(" ");

// Bento Grid Container
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cx(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(250px,auto)] gap-[10px] max-w-[1600px] mx-auto px-[10px] w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

// Individual Bento Box
export interface BentoBoxProps {
  className?: string;
  children: React.ReactNode;
  withBorder?: boolean;
  withGlow?: boolean;
  invisible?: boolean;
}

export const BentoBox = ({
  className,
  children,
  withBorder = true,
  withGlow = false,
  invisible = false,
}: BentoBoxProps) => {
  
  if (invisible) {
    return (
      <div className={cx("relative flex flex-col group", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cx(
        "relative rounded-3xl overflow-hidden flex flex-col group",
        "bg-theme-void text-theme-text transition-colors duration-700",
        withBorder && "border border-theme-border",
        withGlow && "hover:shadow-[0_0_20px_var(--color-theme-border-glow)] transition-shadow duration-500",
        className
      )}
    >
      {children}
    </div>
  );
};
