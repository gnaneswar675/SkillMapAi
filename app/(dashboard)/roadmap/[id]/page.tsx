"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState, useRef, memo } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookmarkPlus,
  Share2,
  PlayCircle,
  FileText,
  CheckCircle2,
  Circle,
  BrainCircuit,
  Copy,
  Check,
  XCircle,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import CustomNode from "@/components/roadmap/CustomNode";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { cn } from "@/lib/utils";

const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {};

const initialNodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Introduction" }, type: "input" },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "Core Concepts" } },
  { id: "3", position: { x: 400, y: 100 }, data: { label: "Advanced Topics" } },
  { id: "4", position: { x: 250, y: 200 }, data: { label: "Best Practices" }, type: "output" },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

// Helper components for notes tabs
function ConceptAccordionItem({ concept }: { concept: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden mb-3 transition-all hover:border-indigo-500/30 hover:bg-white/[0.02]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left font-semibold text-sm text-white/90 focus:outline-none"
      >
        <span>{concept.title}</span>
        <ChevronDown
          className={`h-4 w-4 text-white/40 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100 p-4 pt-0 border-t border-white/[0.06]" : "max-h-0 opacity-0"
          }`}
      >
        <p className="text-xs text-white/50 leading-relaxed mt-2">
          {concept.description}
        </p>
      </div>
    </div>
  );
}

function InterviewQuestionCard({ q, index }: { q: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(q.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyClass = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "hard":
      case "advanced":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medium":
      case "intermediate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-4 mb-3 transition-colors hover:border-indigo-500/30 hover:bg-white/[0.02]">
      <div className="flex justify-between items-start gap-3 mb-2">
        <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${getDifficultyClass(q.difficulty)}`}>
          {q.difficulty || "Easy"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <h4 className="font-semibold text-sm leading-snug mb-2 text-white/90">
        Q{index + 1}: {q.question}
      </h4>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1 focus:outline-none"
      >
        {isOpen ? "Hide Answer" : "Show Answer"}
      </button>

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] opacity-100 mt-3 p-3 bg-white/[0.02] rounded-lg text-xs text-white/50 leading-relaxed border border-white/[0.06]" : "max-h-0 opacity-0"
          }`}
      >
        {q.answer}
      </div>
    </div>
  );
}

function CommonMistakeCard({ item }: { item: any }) {
  return (
    <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-4 mb-3 space-y-3">
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3">
        <div className="flex items-start gap-2 text-rose-400 font-semibold text-xs mb-1">
          <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Mistake</span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed pl-6">
          {item.mistake}
        </p>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
        <div className="flex items-start gap-2 text-emerald-400 font-semibold text-xs mb-1">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Solution / Best Practice</span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed pl-6">
          {item.solution}
        </p>
      </div>
    </div>
  );
}

function RoadmapPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isOpen, setOpen } = useSidebarStore();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Topic Roadmap";
  const { theme } = useTheme();

  const { setCenter, fitView, getZoom } = useReactFlow();

  // Close the left menu bar by default on entering the roadmap page
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(id === "new");
  const [progress, setProgress] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // AI Assistant States
  const [notes, setNotesData] = useState<any>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Dynamic panel resize states
  const [panelWidth, setPanelWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasFetched = useRef(false);

  // Detect mobile viewports
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle panel resizing
  useEffect(() => {
    if (!isResizing || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.75;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
        fitView({ duration: 0 });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const newWidth = window.innerWidth - e.touches[0].clientX;
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.75;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
        fitView({ duration: 0 });
      }
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, isMobile, fitView]);

  const processNodesAndEdges = (roadmapData: any) => {
    const dbProgress = roadmapData.progress || [];
    setProgress(dbProgress);

    const mappedNodes = (roadmapData.nodes || []).map((node: any) => {
      const topicItem = roadmapData.topics?.find((t: any) => t.nodeId === node.id);
      const isCompleted = dbProgress.some((p: any) => p.topicId === topicItem?.id && p.completed);
      return {
        ...node,
        type: "customNode",
        data: {
          ...node.data,
          description: topicItem?.description || node.data.description || `This section covers the essential concepts related to ${node.data.label}.`,
          level: topicItem?.level || node.data.level || "Beginner",
          resources: (topicItem?.resources && topicItem.resources.length > 0)
            ? topicItem.resources
            : (node.data.resources && node.data.resources.length > 0)
              ? node.data.resources
              : [
                {
                  title: `GeeksforGeeks: Learn ${node.data.label}`,
                  url: `https://www.geeksforgeeks.org/search/${encodeURIComponent(node.data.label)}/`,
                  type: "article"
                },
                {
                  title: `Google Search: ${node.data.label}`,
                  url: `https://www.google.com/search?q=${encodeURIComponent(node.data.label + " geeksforgeeks")}`,
                  type: "search"
                }
              ],
          topicId: topicItem?.id,
          completed: isCompleted,
        },
      };
    });

    setNodes(mappedNodes);
    setEdges(roadmapData.edges || []);
  };

  useEffect(() => {
    async function fetchRoadmap() {
      if (hasFetched.current) return;
      hasFetched.current = true;

      if (id === "mock-id-123") {
        setNodes(initialNodes.map(n => ({
          ...n,
          type: "customNode",
          data: {
            ...n.data,
            description: `This section covers the essential concepts related to ${n.data.label}.`,
            level: "Beginner",
            resources: [],
            completed: false,
          }
        })));
        setEdges(initialEdges);
        setIsLoading(false);
        return;
      }

      try {
        if (id === "new") {
          const res = await fetch("/api/generate-roadmap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Failed to generate roadmap");
          }

          const data = await res.json();
          processNodesAndEdges(data);
          setIsSaved(data.isSaved || false);
          router.replace(`/roadmap/${data.id}?topic=${encodeURIComponent(topic)}`);
        } else {
          const res = await fetch(`/api/roadmap/${id}`);
          if (res.ok) {
            const data = await res.json();
            processNodesAndEdges(data);
            setIsSaved(data.isSaved || false);
          }
        }
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Something went wrong. Please try again.");
        if (id === "new") router.push("/search");
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    }

    fetchRoadmap();
  }, [id, topic, router, setNodes, setEdges]);

  // Fetch structured notes on selected node change
  useEffect(() => {
    if (!selectedNode?.data?.topicId) {
      setNotesData(null);
      return;
    }

    async function fetchNotes() {
      setNotesLoading(true);
      setActiveTab("overview");
      setDifficultyFilter("all");
      try {
        const res = await fetch(`/api/topic/${selectedNode.data.topicId}/notes`);
        if (res.ok) {
          const data = await res.json();
          setNotesData(data);
        } else {
          setNotesData(null);
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setNotesData(null);
      } finally {
        setNotesLoading(false);
      }
    }

    fetchNotes();
  }, [selectedNode]);

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);

    // Smoothly center the selected node in the visible canvas area
    if (node && node.position) {
      const zoom = getZoom() || 1.1;
      const targetX = node.position.x + 120; // Center offset for customNode width
      const targetY = node.position.y + 30;  // Center offset for customNode height

      // Delay to allow container resize transition/mount to start
      setTimeout(() => {
        setCenter(targetX, targetY, { zoom, duration: 600 });
      }, 150);
    }
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
    // Smoothly fit all roadmap content back to fill the full viewport width
    setTimeout(() => {
      fitView({ duration: 600 });
    }, 150);
  };

  const toggleProgress = async (node: any) => {
    const topicId = node.data?.topicId;
    if (!topicId) {
      alert("No database topic ID associated with this node to track progress.");
      return;
    }

    const isCurrentlyCompleted = !!node.data?.completed;
    const newCompletedState = !isCurrentlyCompleted;

    // Optimistic UI updates
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              completed: newCompletedState,
            },
          };
        }
        return n;
      })
    );

    setSelectedNode((prevSelected: any) => {
      if (prevSelected && prevSelected.id === node.id) {
        return {
          ...prevSelected,
          data: {
            ...prevSelected.data,
            completed: newCompletedState,
          },
        };
      }
      return prevSelected;
    });

    try {
      const res = await fetch(`/api/roadmap/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          completed: newCompletedState,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save progress");
      }

      const progressRecord = await res.json();
      setProgress((prev) => {
        const filtered = prev.filter((p) => p.topicId !== topicId);
        return [...filtered, progressRecord];
      });
    } catch (err) {
      console.error("Progress toggle error:", err);
      // Revert on error
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                completed: isCurrentlyCompleted,
              },
            };
          }
          return n;
        })
      );
      setSelectedNode((prevSelected: any) => {
        if (prevSelected && prevSelected.id === node.id) {
          return {
            ...prevSelected,
            data: {
              ...prevSelected.data,
              completed: isCurrentlyCompleted,
            },
          };
        }
        return prevSelected;
      });
      alert("Could not update progress. Please verify that you are signed in.");
    }
  };

  const handleSaveToggle = async () => {
    const originalSavedState = isSaved;
    const newSavedState = !originalSavedState;

    setIsSaved(newSavedState);

    try {
      const res = await fetch(`/api/roadmap/${id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved: newSavedState }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle save status");
      }
    } catch (err) {
      console.error(err);
      setIsSaved(originalSavedState);
      alert("Failed to save roadmap. Please verify you are logged in.");
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black relative overflow-hidden px-4 py-8">
        {/* Glow backdrop - multi-layered for rich aesthetics */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[600px] h-[280px] md:h-[600px] pointer-events-none -z-10 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.02) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-md w-full text-center space-y-6 z-10 flex flex-col items-center justify-center">
          {/* Glowing Animated Icon */}
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            className="p-6 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.25)] flex items-center justify-center w-22 h-22 md:w-26 md:h-26"
          >
            <BrainCircuit className="h-10 w-10 md:h-12 md:w-12 text-indigo-400 animate-pulse" />
          </motion.div>

          {/* Main Title - Responsive font size and word breaking */}
          <div className="space-y-2 px-2 w-full">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white/95 leading-snug break-words">
              {isGenerating ? (
                <>
                  Generating Path for <span className="text-indigo-400 block mt-1 leading-normal italic">"{topic}"</span>
                </>
              ) : (
                "Loading your Roadmap..."
              )}
            </h2>
          </div>

          {/* Subtitle description */}
          <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-sm px-2">
            {isGenerating
              ? "Our AI is currently analyzing the topic, structuring the curriculum, and building your personalized interactive learning tree."
              : "Fetching your saved progress and nodes..."}
          </p>

          {/* Progress bar container */}
          {isGenerating && (
            <div className="w-full max-w-[220px] md:max-w-[260px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-4 border border-white/[0.04] shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* Status logs indicator - premium touch */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-[10px] text-indigo-400/60 font-mono tracking-wider pt-2"
            >

            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black">
      {/* Left side: Canvas and Header */}
      <div className="flex-1 h-full flex flex-col relative min-w-0">
        {/* Header Panel with dynamic offset based on Sidebar collapse */}
        <div className={`absolute top-4 right-4 md:right-8 z-10 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ${isOpen ? "left-4 md:left-8" : "left-16 md:left-16"
          }`}>
          <div>
            <h1 className="text-lg md:text-2xl font-bold flex flex-wrap items-center gap-2">
              <span className="text-white/90 line-clamp-1 max-w-[150px] md:max-w-none">{topic}</span>
              {nodes.length > 0 && (
                <span className="text-[10px] md:text-sm font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {nodes.filter(n => n.data?.completed).length}/{nodes.length} ({Math.round((nodes.filter(n => n.data?.completed).length / nodes.length) * 100)}%)
                </span>
              )}
            </h1>
            <p className="text-[10px] md:text-xs text-white/40">AI-Generated Learning Path</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className={cn(
                "gap-1.5 rounded-xl transition-all text-xs md:text-sm px-3 py-1.5",
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              )}
              onClick={handleSaveToggle}
            >
              <BookmarkPlus className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isSaved ? "fill-white" : "")} />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Path"}</span>
            </Button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 w-full h-full bg-zinc-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color={theme === "dark" ? "#222" : "#ccc"} gap={16} />
            <Controls className="mb-4 mr-4" />
            {!isMobile && (
              <MiniMap
                nodeColor={theme === "dark" ? "#333" : "#eee"}
                maskColor={theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)"}
              />
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Right side: Topic Details tabs panel */}
      {selectedNode && (
        <div
          style={{
            width: isMobile ? "100%" : `${panelWidth}px`,
            height: isMobile ? "70vh" : "100%"
          }}
          className={cn(
            "bg-black/85 backdrop-blur-xl border-white/[0.08] flex flex-col overflow-hidden shadow-2xl z-40",
            isMobile
              ? "fixed bottom-0 left-0 right-0 border-t rounded-t-3xl animate-in slide-in-from-bottom duration-300"
              : "h-full border-l animate-in slide-in-from-right duration-300 shrink-0 relative max-w-full"
          )}
        >
          {/* Mobile Drag Indicator */}
          {isMobile && (
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-3 shrink-0" />
          )}

          {/* Resize Handle (only visible on desktop) */}
          {!isMobile && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
              onTouchStart={() => {
                setIsResizing(true);
              }}
              className={cn(
                "absolute top-0 left-0 w-1.5 hover:w-2 h-full cursor-col-resize z-50 transition-all",
                isResizing ? "bg-indigo-500 w-2" : "bg-transparent hover:bg-indigo-500/40 active:bg-indigo-500"
              )}
            />
          )}

          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.01] pl-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white/90">{selectedNode.data.label}</h2>
              <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" /> AI Learning Assistant
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/50 hover:text-white hover:bg-white/10" onClick={handleClosePanel}>✕</Button>
          </div>

          {/* Dynamic Tabs Bar */}
          <div className="flex border-b border-white/[0.08] bg-white/[0.01] pl-6 pr-2 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview" },
              { id: "concepts", label: "Key Concepts" },
              { id: "interview", label: "Interview Qs" },
              { id: "mistakes", label: "Mistakes" },
              { id: "revision", label: "Revision" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none shrink-0",
                    isActive ? "text-indigo-400" : "text-white/40 hover:text-white/60"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scrollable Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 pl-6 pb-20">
            {notesLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-1/2"></div>
                  <div className="h-12 bg-muted rounded w-full"></div>
                  <div className="h-12 bg-muted rounded w-full"></div>
                </div>
              </div>
            ) : notes ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-1.5 text-white/90"><FileText className="h-4 w-4 text-indigo-400" /> Summary</h3>
                      <p className="text-xs text-white/70 leading-relaxed bg-white/[0.01] border border-white/[0.06] p-3 rounded-xl">
                        {notes.overview?.summary || "No summary available."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-1.5 text-white/90"><Sparkles className="h-4 w-4 text-indigo-400" /> Why this topic matters</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {notes.overview?.importance || "No importance description available."}
                      </p>
                    </div>

                    {notes.overview?.applications && notes.overview.applications.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-white/90">Real-world applications</h3>
                        <ul className="space-y-2">
                          {notes.overview.applications.map((appStr: string, idx: number) => (
                            <li key={idx} className="text-xs text-white/50 flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                              <span>{appStr}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources section inside Overview tab */}
                    <div className="pt-4 border-t border-white/[0.08]">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5 text-white/90"><PlayCircle className="h-4 w-4 text-indigo-400" /> Topic Resources</h3>
                      <div className="space-y-3">
                        {selectedNode.data.resources && selectedNode.data.resources.length > 0 ? (
                          selectedNode.data.resources.map((resource: any, idx: number) => (
                            <a
                              key={resource.id || idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:no-underline"
                            >
                              <Card className="hover:border-indigo-500/50 transition-colors cursor-pointer group bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.02]">
                                <CardHeader className="p-3">
                                  <CardTitle className="text-xs font-semibold group-hover:text-indigo-400 transition-colors text-white/80">
                                    {resource.title}
                                  </CardTitle>
                                  <p className="text-[10px] text-white/40 mt-0.5 capitalize">
                                    {resource.type || "Article"}
                                  </p>
                                </CardHeader>
                              </Card>
                            </a>
                          ))
                        ) : (
                          <p className="text-xs text-white/40 italic">No learning resources generated for this topic yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Key Concepts Tab */}
                {activeTab === "concepts" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="font-semibold text-sm mb-2 text-foreground">Core Concepts list</h3>
                    {notes.keyConcepts && notes.keyConcepts.length > 0 ? (
                      notes.keyConcepts.map((concept: any, idx: number) => (
                        <ConceptAccordionItem key={idx} concept={concept} />
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No key concepts available.</p>
                    )}
                  </div>
                )}

                {/* 3. Interview Questions Tab */}
                {activeTab === "interview" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Filters */}
                    <div className="flex gap-1.5 p-1 bg-muted/40 border border-border/80 rounded-lg overflow-x-auto">
                      {["all", "beginner", "intermediate", "advanced"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setDifficultyFilter(filter)}
                          className={`text-[10px] font-semibold capitalize px-2.5 py-1 rounded-md transition-colors ${difficultyFilter === filter
                              ? "bg-background text-foreground shadow-sm border"
                              : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          {filter === "all" ? "All" : filter}
                        </button>
                      ))}
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3">
                      {(() => {
                        const beginnerQs = notes.interviewQuestions?.beginner || [];
                        const intermediateQs = notes.interviewQuestions?.intermediate || [];
                        const advancedQs = notes.interviewQuestions?.advanced || [];

                        let filteredQs = [];
                        if (difficultyFilter === "all") {
                          filteredQs = [...beginnerQs, ...intermediateQs, ...advancedQs];
                        } else if (difficultyFilter === "beginner") {
                          filteredQs = beginnerQs;
                        } else if (difficultyFilter === "intermediate") {
                          filteredQs = intermediateQs;
                        } else if (difficultyFilter === "advanced") {
                          filteredQs = advancedQs;
                        }

                        if (filteredQs.length === 0) {
                          return <p className="text-xs text-muted-foreground italic text-center py-4">No questions available for this difficulty.</p>;
                        }

                        return filteredQs.map((q: any, idx: number) => (
                          <InterviewQuestionCard key={idx} q={q} index={idx} />
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* 4. Common Mistakes Tab */}
                {activeTab === "mistakes" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="font-semibold text-sm mb-2 text-white/90">Frequent mistakes & best practices</h3>
                    {notes.commonMistakes && notes.commonMistakes.length > 0 ? (
                      notes.commonMistakes.map((item: any, idx: number) => (
                        <CommonMistakeCard key={idx} item={item} />
                      ))
                    ) : (
                      <p className="text-xs text-white/40 italic">No common mistakes recorded.</p>
                    )}
                  </div>
                )}

                {/* 5. Revision Notes Tab */}
                {activeTab === "revision" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="font-semibold text-sm mb-2 text-white/90">Last-minute revision recap</h3>
                    <div className="grid gap-3">
                      {notes.revisionNotes && notes.revisionNotes.length > 0 ? (
                        notes.revisionNotes.map((notePoint: string, idx: number) => (
                          <div key={idx} className="border border-indigo-500/15 bg-indigo-500/5 rounded-xl p-3.5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/60" />
                            <p className="text-xs text-indigo-200 font-semibold leading-relaxed">
                              {notePoint}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-white/40 italic">No revision notes available.</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground">Select an AI-generated node to view detailed notes.</p>
              </div>
            )}
          </div>

          {/* Side Panel Footer */}
          <div className="p-4 pl-6 border-t border-white/[0.08] bg-white/[0.01]">
            <Button
              className={`w-full gap-2 rounded-xl transition-all ${selectedNode.data.completed
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                }`}
              onClick={() => toggleProgress(selectedNode)}
            >
              {selectedNode.data.completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" /> Mark as Completed
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ReactFlowProvider>
      <RoadmapPageContent params={params} />
    </ReactFlowProvider>
  );
}
