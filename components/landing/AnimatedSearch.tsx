"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";

const TOPICS = [
  "React",
  "Machine Learning",
  "System Design",
  "DevOps",
  "Cyber Security",
  "Data Structures",
  "Web Development",
];

interface AnimatedSearchProps {
  isSignedIn: boolean;
}

export function AnimatedSearch({ isSignedIn }: AnimatedSearchProps) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typeText = useCallback(() => {
    const topic = TOPICS[currentTopicIndex];
    let charIndex = 0;
    setIsTyping(true);

    const typeChar = () => {
      if (charIndex <= topic.length) {
        setDisplayText(topic.slice(0, charIndex));
        charIndex++;
        timeoutRef.current = setTimeout(typeChar, 80 + Math.random() * 40);
      } else {
        // Pause, then erase
        timeoutRef.current = setTimeout(() => {
          eraseText(topic);
        }, 2000);
      }
    };

    const eraseText = (text: string) => {
      let eraseIndex = text.length;
      const eraseChar = () => {
        if (eraseIndex >= 0) {
          setDisplayText(text.slice(0, eraseIndex));
          eraseIndex--;
          timeoutRef.current = setTimeout(eraseChar, 40);
        } else {
          setIsTyping(false);
          setCurrentTopicIndex((prev) => (prev + 1) % TOPICS.length);
        }
      };
      eraseChar();
    };

    typeChar();
  }, [currentTopicIndex]);

  useEffect(() => {
    if (!isFocused) {
      typeText();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentTopicIndex, isFocused, typeText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center"
    >
      <div className="relative w-full max-w-md group">
        {/* Pulse ring on focus */}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.3))",
              filter: "blur(20px)",
              animation: "pulse-ring 2s ease-out infinite",
            }}
          />
        )}

        {/* Glow border */}
        <div
          className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-500 ${
            isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(34,211,238,0.5), rgba(52,211,153,0.5))",
            padding: "1px",
            borderRadius: "1rem",
          }}
        />

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 z-10" />
          <input
            type="text"
            className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none transition-all relative z-[5]"
            readOnly
            value={isFocused ? "" : displayText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "Type a topic..." : ""}
          />
          {/* Blinking cursor */}
          {!isFocused && (
            <span className="absolute right-auto z-10 text-white/60 animate-blink" style={{ left: `${displayText.length * 9.5 + 52}px`, top: "50%", transform: "translateY(-50%)" }}>
              |
            </span>
          )}
        </div>
      </div>

      <Link href={isSignedIn ? "/search" : "/sign-up"}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative h-12 px-8 rounded-2xl bg-white text-black font-semibold text-sm gap-2 w-full sm:w-auto flex items-center justify-center overflow-hidden group hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-shadow duration-300"
        >
          Generate Roadmap
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
