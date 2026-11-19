"use client";

import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10 md:py-14">
      {/* Gradient border glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(34,211,238,0.4), transparent)",
        }}
      />

      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-white/70">SkillMapAi</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-xs text-white/30">
            <span className="hover:text-white/60 transition-colors cursor-pointer">About</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">Contact</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} SkillMapAi. Built with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
