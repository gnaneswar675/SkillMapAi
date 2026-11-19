"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const NODES = [
  { id: "html", label: "HTML", color: "#f97316", x: 50, y: 0 },
  { id: "css", label: "CSS", color: "#3b82f6", x: 20, y: 20 },
  { id: "js", label: "JavaScript", color: "#eab308", x: 80, y: 20 },
  { id: "react", label: "React", color: "#22d3ee", x: 35, y: 42 },
  { id: "nextjs", label: "Next.js", color: "#a78bfa", x: 65, y: 42 },
  { id: "ts", label: "TypeScript", color: "#3b82f6", x: 10, y: 42 },
  { id: "node", label: "Node.js", color: "#34d399", x: 50, y: 62 },
  { id: "db", label: "Database", color: "#f472b6", x: 85, y: 62 },
  { id: "deploy", label: "Deployment", color: "#8b5cf6", x: 50, y: 82 },
];

const EDGES = [
  { from: "html", to: "css" },
  { from: "html", to: "js" },
  { from: "css", to: "react" },
  { from: "js", to: "react" },
  { from: "js", to: "nextjs" },
  { from: "js", to: "ts" },
  { from: "react", to: "node" },
  { from: "nextjs", to: "node" },
  { from: "nextjs", to: "db" },
  { from: "node", to: "deploy" },
  { from: "db", to: "deploy" },
];

function getNodePos(id: string) {
  const node = NODES.find((n) => n.id === id);
  return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
}

export function FloatingRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      return () => el.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative w-full max-w-3xl mx-auto aspect-[4/3] mt-16 md:mt-24"
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139,92,246,0.08) 0%, transparent 50%)`,
          transition: "background 0.3s ease",
        }}
      />

      {/* SVG edges */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map((edge, i) => {
          const from = getNodePos(edge.from);
          const to = getNodePos(edge.to);
          const isActive = activeNode === edge.from || activeNode === edge.to;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.08)"}
              strokeWidth={isActive ? "0.4" : "0.2"}
              strokeDasharray="2 2"
              className="animate-dash-flow transition-all duration-500"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const dist = Math.sqrt(
          Math.pow(mousePos.x - node.x, 2) + Math.pow(mousePos.y - node.y, 2)
        );
        const isNear = dist < 20;
        const scale = isNear ? 1.15 : 1;
        const isActive = activeNode === node.id;

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    scale: scale,
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: 0.5 + i * 0.1,
              scale: { duration: 0.3 },
            }}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute flex items-center justify-center cursor-pointer z-10"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              animation: `float-slow ${6 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {/* Glow ring */}
            <div
              className="absolute inset-[-6px] rounded-2xl transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle, ${node.color}33 0%, transparent 70%)`,
                opacity: isActive || isNear ? 1 : 0.3,
                filter: "blur(8px)",
              }}
            />

            {/* Node card */}
            <div
              className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-semibold text-white transition-all duration-300 border ${
                isActive
                  ? "bg-white/15 border-white/30 shadow-lg"
                  : "bg-white/[0.06] border-white/[0.1] hover:bg-white/10"
              }`}
              style={{
                boxShadow: isActive
                  ? `0 0 20px ${node.color}40, 0 0 40px ${node.color}15`
                  : "none",
              }}
            >
              {/* Color dot */}
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{
                  backgroundColor: node.color,
                  boxShadow: `0 0 6px ${node.color}80`,
                }}
              />
              {node.label}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
