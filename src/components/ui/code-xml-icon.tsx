import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const CodeXmlIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".code-left",
        { x: [0, -2, 0] },
        { duration: 0.35, ease: "easeOut" },
      );
      await animate(
        ".code-right",
        { x: [0, 2, 0] },
        { duration: 0.35, ease: "easeOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(".code-left", { x: 0 }, { duration: 0.2 });
      animate(".code-right", { x: 0 }, { duration: 0.2 });
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        style={{ overflow: "visible" }}
      >
        <motion.polyline
          className="code-left"
          points="8 6 2 12 8 18"
        />
        <motion.polyline
          className="code-right"
          points="16 18 22 12 16 6"
        />
      </motion.svg>
    );
  },
);

CodeXmlIcon.displayName = "CodeXmlIcon";
export default CodeXmlIcon;
