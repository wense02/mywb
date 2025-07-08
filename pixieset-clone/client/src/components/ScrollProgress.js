// src/components/ScrollProgress.js
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const theme = useTheme();

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        transformOrigin: '0%',
        scaleX,
        zIndex: 9999,
      }}
    />
  );
};

export default ScrollProgress;