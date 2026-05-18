"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Zap, BookOpen, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">SkillMapAi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-black hover:bg-white/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 md:pt-48 md:pb-32">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur-sm"
            >
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>SkillMapAi 1.0 is now live</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent"
            >
              Master any skill with AI-powered roadmaps.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl"
            >
              Enter any topic and instantly get a visual learning path, curated resources, and AI-generated notes to accelerate your journey.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center"
            >
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input 
                  type="text" 
                  placeholder="e.g. React, System Design, Machine Learning..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  readOnly
                />
              </div>
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 gap-2 w-full sm:w-auto">
                  Generate Roadmap <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mt-32"
          >
            {[
              {
                title: "Visual Learning Paths",
                description: "Interactive graph-based roadmaps that show you exactly what to learn and in what order.",
                icon: BrainCircuit,
              },
              {
                title: "Curated Resources",
                description: "Top-rated tutorials, articles, and videos automatically gathered for each topic.",
                icon: BookOpen,
              },
              {
                title: "Progress Tracking",
                description: "Mark topics as complete, save your favorite paths, and track your learning journey.",
                icon: Zap,
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
