"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, BrainCircuit, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen p-4 max-w-4xl mx-auto w-full relative">
      {/* Background radial glow */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center space-y-8 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-pulse-glow">
            <BrainCircuit className="h-12 w-12 text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          What do you want to learn?
        </h1>
        <p className="text-sm md:text-base text-white/40 max-w-2xl mx-auto">
          Enter any topic, skill, or concept. Our AI will generate a comprehensive visual roadmap branched and structured just for you.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mt-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-white/30" />
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js App Router"
              className="h-16 pl-14 pr-36 text-lg rounded-2xl bg-white/[0.02] backdrop-blur-sm border-white/[0.08] text-white/90 placeholder:text-white/30 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 hover:border-white/[0.12] transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
              disabled={isLoading}
            />
            <div className="absolute right-2">
              <Button 
                type="submit" 
                size="lg"
                disabled={!topic.trim() || isLoading}
                className="rounded-xl h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
              >
                {isLoading ? (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                ) : (
                  <>Generate <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="pt-12">
          <p className="text-xs text-white/40 mb-4 tracking-[0.15em] uppercase font-semibold">Popular Topics</p>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/70 text-sm hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all cursor-pointer"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
