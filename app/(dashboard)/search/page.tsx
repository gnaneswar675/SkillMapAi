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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 max-w-4xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">What do you want to learn?</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter any topic, skill, or concept. Our AI will generate a comprehensive visual roadmap tailored just for you.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mt-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-muted-foreground" />
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js App Router"
              className="h-16 pl-14 pr-32 text-lg rounded-2xl shadow-lg border-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-2">
              <Button 
                type="submit" 
                size="lg"
                disabled={!topic.trim() || isLoading}
                className="rounded-xl h-12 px-6 bg-primary text-primary-foreground"
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
          <p className="text-sm text-muted-foreground mb-4">Popular Topics</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                className="px-4 py-2 rounded-full border bg-card text-sm hover:bg-primary/10 hover:border-primary/50 transition-colors"
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
