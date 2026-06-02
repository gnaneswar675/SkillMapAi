"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, BrainCircuit, BookOpen, BarChart3, Trophy } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search a Topic",
    description: "Enter any skill or technology you want to master. From React to Machine Learning, we cover it all.",
    color: "#818cf8",
  },
  {
    icon: BrainCircuit,
    title: "AI Generates Roadmap",
    description: "Our AI engine analyzes the topic and builds a structured, visual learning path with interconnected nodes.",
    color: "#22d3ee",
  },
  {
    icon: BookOpen,
    title: "Learn Through Resources",
    description: "Each node comes with curated articles, tutorials, and documentation from top platforms like GeeksforGeeks.",
    color: "#34d399",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Mark topics as complete, save your favorite roadmaps, and watch your skill tree grow over time.",
    color: "#f59e0b",
  },
  {
    icon: Trophy,
    title: "Master the Skill",
    description: "Complete every node, ace the interview questions, and become confident in your newly acquired expertise.",
    color: "#f472b6",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-24 md:py-32">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 md:mb-20"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
          How it works
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 text-white/90">
          From curiosity to{" "}
          <span className="text-gradient-hero">mastery</span>
        </h2>
        <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm md:text-base">
          Five simple steps to transform any topic into a structured learning journey.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-2xl mx-auto">
        {/* Vertical connecting line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top"
          style={{
            background: "linear-gradient(to bottom, rgba(139,92,246,0.3), rgba(34,211,238,0.3), rgba(52,211,153,0.3), rgba(245,158,11,0.3), rgba(244,114,182,0.3))",
          }}
        />

        {/* Steps */}
        <div className="space-y-10 md:space-y-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.4 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="relative flex items-start gap-5 md:gap-7 group"
            >
              {/* Step node */}
              <div className="relative shrink-0 z-10">
                {/* Pulse ring */}
                <div
                  className="absolute inset-[-4px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `${step.color}20`,
                    filter: "blur(8px)",
                  }}
                />
                <div
                  className="relative h-12 w-12 md:h-16 md:w-16 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08]"
                  style={{
                    boxShadow: `0 0 0 0 ${step.color}00`,
                    animation: `float ${6 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <step.icon
                    className="h-5 w-5 md:h-6 md:w-6 transition-all duration-300"
                    style={{ color: step.color }}
                  />
                </div>

                {/* Step number */}
                <span
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center border"
                  style={{
                    backgroundColor: `${step.color}20`,
                    borderColor: `${step.color}40`,
                    color: step.color,
                  }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Step content */}
              <div className="pt-1 md:pt-3">
                <h3 className="text-base md:text-lg font-semibold text-white/90 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
