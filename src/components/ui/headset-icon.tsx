import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const HeadsetIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      // Headset body bobbing
      animate(
        ".headset-body",
        { y: [0, -1.5, 0] },
        { duration: 0.8, ease: "easeInOut", repeat: Infinity }
      );
      // Mic arm wiggling
      animate(
        ".headset-mic",
        { rotate: [0, 4, 0] },
        { duration: 0.8, ease: "easeInOut", repeat: Infinity }
      );
      // Fading waves
      animate(
        ".headset-wave-1",
        { opacity: [0, 0.8, 0], scale: [0.9, 1.1, 0.9] },
        { duration: 0.8, ease: "easeOut", repeat: Infinity }
      );
      animate(
        ".headset-wave-2",
        { opacity: [0, 0.6, 0], scale: [0.9, 1.1, 0.9] },
        { duration: 0.8, ease: "easeOut", delay: 0.25, repeat: Infinity }
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(".headset-body", { y: 0 }, { duration: 0.25, ease: "easeInOut" });
      animate(".headset-mic", { rotate: 0 }, { duration: 0.25, ease: "easeInOut" });
      animate(".headset-wave-1, .headset-wave-2", { opacity: 0, scale: 1 }, { duration: 0.2 });
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.div
        ref={scope}
        className={`inline-flex cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Headset Headband and Cups */}
          <motion.g className="headset-body" style={{ transformOrigin: "12px 14px" }}>
            <path d="M3 14h3v7H3v-7zm15 0h3v7h-3v-7z" />
            <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
          </motion.g>
          
          {/* Microphone Arm */}
          <motion.path
            className="headset-mic"
            style={{ transformOrigin: "18px 19px" }}
            d="M18 19c-2 2-5 2-7 0"
          />

          {/* Acoustic waves for active customer care */}
          <motion.path
            className="headset-wave-1"
            style={{ transformOrigin: "9px 19px" }}
            d="M 9,16 C 8.5,17 8.5,18 9,19"
            initial={{ opacity: 0 }}
          />
          <motion.path
            className="headset-wave-2"
            style={{ transformOrigin: "9px 19px" }}
            d="M 7,14 C 6,16 6,19 7,21"
            initial={{ opacity: 0 }}
          />
        </svg>
      </motion.div>
    );
  },
);

HeadsetIcon.displayName = "HeadsetIcon";
export default HeadsetIcon;
