"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState, useRef } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkPlus, Share2, PlayCircle, FileText, CheckCircle2, Circle, BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import CustomNode from "@/components/roadmap/CustomNode";

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

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Topic Roadmap";
  const { theme } = useTheme();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(id === "new");
  const [progress, setProgress] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  
  const hasFetched = useRef(false);

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

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
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
    
    // Optimistic UI update
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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-6 bg-primary/10 rounded-full"
        >
          <BrainCircuit className="h-16 w-16 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isGenerating ? `Generating Roadmap for "${topic}"...` : "Loading your Roadmap..."}
        </h2>
        <p className="text-muted-foreground max-w-md text-center">
          {isGenerating ? "Our AI is currently analyzing the topic, designing the curriculum, and building your personalized learning path." : "Fetching your saved progress and nodes..."}
        </p>
        {isGenerating && (
          <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mt-4">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full relative">
      {/* Header Panel */}
      <div className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-10 flex justify-between items-center bg-background/80 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex flex-wrap items-center gap-3">
            <span>{topic}</span>
            {nodes.length > 0 && (
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {nodes.filter(n => n.data?.completed).length}/{nodes.length} Completed ({Math.round((nodes.filter(n => n.data?.completed).length / nodes.length) * 100)}%)
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">AI-Generated Learning Path</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button 
            size="sm" 
            className={`gap-2 transition-all ${
              isSaved
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : ""
            }`}
            onClick={handleSaveToggle}
          >
            <BookmarkPlus className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} /> 
            {isSaved ? "Saved" : "Save Path"}
          </Button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full bg-muted/20">
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
          <Background color={theme === "dark" ? "#333" : "#ccc"} gap={16} />
          <Controls className="mb-4 mr-4" />
          <MiniMap 
            nodeColor={theme === "dark" ? "#555" : "#eee"} 
            maskColor={theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)"}
          />
        </ReactFlow>
      </div>

      {/* Side Panel for Node Details */}
      {selectedNode && (
        <div className="absolute top-24 right-4 md:right-8 w-80 lg:w-96 h-[calc(100vh-8rem)] bg-background/95 backdrop-blur-md border rounded-2xl shadow-xl z-20 flex flex-col animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{selectedNode.data.label}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>✕</Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedNode.data.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Resources</h3>
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
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group bg-muted/50">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm group-hover:text-primary transition-colors">
                            {resource.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {resource.type || "Article"}
                          </p>
                        </CardHeader>
                      </Card>
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No learning resources generated for this topic yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t bg-muted/30">
            <Button
              className={`w-full gap-2 transition-all ${
                selectedNode.data.completed
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : ""
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
