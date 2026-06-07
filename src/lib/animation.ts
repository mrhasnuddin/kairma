export const kairmaEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeInVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom,
      duration: 0.6,
      ease: kairmaEase,
    },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const drawLineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        delay: custom.delay ?? 0, 
        type: "spring", 
        duration: custom.duration ?? 1.2, 
        bounce: 0,
        ease: "easeInOut" 
      },
      opacity: { delay: custom.delay ?? 0, duration: 0.2 },
    },
  }),
};
