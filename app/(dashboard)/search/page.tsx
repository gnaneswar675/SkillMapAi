"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  Code2, 
  Server, 
  Brain, 
  Terminal, 
  Workflow, 
  FileText, 
  HelpCircle, 
  AlertCircle 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsLoading(true);
    router.push(`/roadmap/new?topic=${encodeURIComponent(topic)}`);
  };

  const suggestions = ["React.js", "System Design", "Machine Learning", "Data Structures", "Docker & Kubernetes", "GraphQL"];

  const categories = [
    { name: "React & Next.js", icon: Code2, desc: "Modern frontend frameworks, routing, and hooks", query: "Next.js App Router" },
    { name: "System Design", icon: Server, desc: "Scalability, microservices, load balancing, and APIs", query: "System Design" },
    { name: "Machine Learning", icon: Brain, desc: "Neural networks, data processing, and model training", query: "Machine Learning" },
    { name: "DevOps & Cloud", icon: Terminal, desc: "Docker, Kubernetes, CI/CD pipelines, and AWS", query: "Docker & Kubernetes" },
  ];

  const capabilities = [
    { title: "Interactive Roadmap Tree", desc: "AI builds a structured branching node map with coordinate offsets.", icon: Workflow, color: "text-indigo-400" },
    { title: "Learning Companion Notes", desc: "Detailed concepts, cheat sheets, and summaries.", icon: FileText, color: "text-cyan-400" },
    { title: "Interview Practice Questions", desc: "Test yourself with AI-generated interview prep.", icon: HelpCircle, color: "text-violet-400" },
    { title: "Mistakes & Best Practices", desc: "Avoid pitfalls with detailed visual solution guides.", icon: AlertCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 md:p-12 max-w-4xl mx-auto w-full relative overflow-y-auto space-y-16 pb-24">
      {/* Background radial glows */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[400px] h-[400px] pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(6, 182, 212, 0.03) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center space-y-8 relative z-10"
      >
        <div className="flex justify-center mb-2">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-pulse-glow">
            <BrainCircuit className="h-10 w-10 text-indigo-400 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            What do you want to learn?
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Enter any topic, skill, or concept. Our AI will generate a comprehensive visual roadmap branched and structured just for you.
          </p>
        </div>

        {/* Input container with fixed z-indices */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mt-8">
          <div className="relative flex items-center group">
            {/* Background glow border */}
            <div className="absolute inset-0 -m-[1px] bg-gradient-to-r from-indigo-500/20 via-transparent to-cyan-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <Search className="absolute left-4.5 h-6 w-6 text-white/30 z-20 pointer-events-none transition-colors group-focus-within:text-indigo-400" />
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js App Router, System Design..."
              className="h-16 pl-14 pr-36 text-base md:text-lg rounded-2xl bg-white/[0.02] backdrop-blur-md border-white/[0.08] text-white/90 placeholder:text-white/30 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 hover:border-white/[0.12] transition-all relative z-10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
              disabled={isLoading}
            />
            <div className="absolute right-2 z-20">
              <Button 
                type="submit" 
                size="lg"
                disabled={!topic.trim() || isLoading}
                className="rounded-xl h-12 px-5 bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all border border-indigo-500/30 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                ) : (
                  <>
                    <span className="font-semibold text-xs md:text-sm">Generate</span> 
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="pt-4">
          <p className="text-[10px] text-white/30 mb-3 tracking-[0.18em] uppercase font-bold">Popular Suggestions</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                suppressHydrationWarning
                className="px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] text-white/50 text-xs hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all cursor-pointer font-medium"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Skill Paths Grid */}
        <div className="pt-12 text-left max-w-4xl mx-auto w-full">
          <h2 className="text-[10px] text-white/30 mb-5 tracking-[0.18em] uppercase font-bold text-center">Featured Skill Paths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setTopic(cat.query)}
                className="p-5 rounded-2xl bg-white/[0.01] backdrop-blur-sm border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer group flex items-start gap-4"
              >
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-all shrink-0">
                  <cat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white/80 group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="pt-12 border-t border-white/[0.06] max-w-4xl mx-auto w-full text-left">
          <h2 className="text-[10px] text-white/30 mb-8 tracking-[0.18em] uppercase font-bold text-center">AI Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap) => (
              <div key={cap.title} className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                <div className={cn("p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit", cap.color)}>
                  <cap.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-white/80">{cap.title}</h3>
                <p className="text-[11px] text-white/40 leading-normal">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

