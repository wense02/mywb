// src/hooks/useScrollAnimations.js
import { useRef } from 'react';
import { useInView, useScroll, useTransform } from 'framer-motion';

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    ...options
  });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: options.direction === 'up' ? -50 : 50,
      scale: options.scale ? 0.9 : 1
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: options.duration || 0.8,
        delay: options.delay || 0,
        ease: options.ease || "easeOut"
      }
    }
  };

  return {
    ref,
    isInView,
    variants,
    animate: isInView ? 'visible' : 'hidden'
  };
};

export const useParallax = (speed = 0.5, options = {}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options.offset || ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  // Always call useTransform, but conditionally use the result
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const opacity = options.fade ? opacityTransform : undefined;

  return { ref, y, opacity, scrollYProgress };
};

export const useStaggerChildren = (itemCount, baseDelay = 0.1) => {
  return Array.from({ length: itemCount }, (_, i) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: 0.6,
      delay: baseDelay * i,
      ease: "easeOut"
    }
  }));
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return {
    scrollYProgress,
    scaleX: useTransform(scrollYProgress, [0, 1], [0, 1])
  };
};

// Animation variants library
export const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideInUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  staggerItem: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }
};