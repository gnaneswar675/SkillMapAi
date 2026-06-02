"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className = "", delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <motion.span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface AnimatedHeadlineProps {
  line1: string;
  line2: string;
  className?: string;
}

export function AnimatedHeadline({ line1, line2, className = "" }: AnimatedHeadlineProps) {
  return (
    <h1 className={className}>
      <span className="block">
        <AnimatedText text={line1} delay={0.2} />
      </span>
      <span className="block text-gradient-hero">
        <AnimatedText text={line2} delay={0.6} />
      </span>
    </h1>
  );
}
