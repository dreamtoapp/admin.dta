"use client";
import React, { ReactNode, CSSProperties } from "react";
import { motion, MotionProps } from "framer-motion";

interface MotionDivProps extends MotionProps {
  children: ReactNode;
  className?: string; // Optional className for styling
  style?: CSSProperties; // Inline styles
  whileHoverEffect?: MotionProps["whileHover"]; // Custom hover animation
  whileTapEffect?: MotionProps["whileTap"]; // Custom tap animation
}

function MotionDiv({
  children,
  className,
  style,
  whileHoverEffect = { scale: 1.05, rotate: 0.5 }, // Default hover effect
  whileTapEffect = { scale: 0.95 }, // Default tap effect
  ...motionProps
}: MotionDivProps) {
  return (
    <motion.div
      whileHover={whileHoverEffect}
      whileTap={whileTapEffect}
      className={className}
      style={style}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...motionProps} // Pass additional Framer Motion props
    >
      {children}
    </motion.div>
  );
}

export default MotionDiv;
