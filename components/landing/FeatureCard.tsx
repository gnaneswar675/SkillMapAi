"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
  accentColor: string;
}

export function FeatureCard({ title, description, icon: Icon, index, accentColor }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const rotateX = isHovered ? (mousePos.y - 150) / -15 : 0;
  const rotateY = isHovered ? (mousePos.x - 200) / 15 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      style={{
        perspective: "800px",
      }}
    >
      {/* Glow border on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentColor}40, transparent 50%, ${accentColor}20)`,
        }}
      />

      <div
        className="relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 h-full group-hover:bg-white/[0.06]"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? "transform 0.1s ease" : "transform 0.5s ease",
        }}
      >
        {/* Mouse-tracking internal glow */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, ${accentColor}12, transparent)`,
            }}
          />
        )}

        {/* Icon */}
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{
            background: `${accentColor}15`,
            boxShadow: isHovered ? `0 0 25px ${accentColor}25` : "none",
            animation: "float 6s ease-in-out infinite",
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-2 text-white/90">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
