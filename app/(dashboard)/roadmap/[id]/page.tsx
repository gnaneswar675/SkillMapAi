"use client";

import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkPlus, Share2, PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

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
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Topic Roadmap";
  const { theme } = useTheme();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      if (id === "mock-id-123") {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/roadmap/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmap();
  }, [id, setNodes, setEdges]);

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full">Loading roadmap...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full relative">
      {/* Header Panel */}
      <div className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-10 flex justify-between items-center bg-background/80 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">{topic}</h1>
          <p className="text-sm text-muted-foreground">AI-Generated Learning Path</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="gap-2">
            <BookmarkPlus className="h-4 w-4" /> Save Path
          </Button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full bg-muted/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
              <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20 mt-2">
                Intermediate
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>✕</Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This section covers the essential concepts related to {selectedNode.data.label}. 
                You will learn about the underlying architecture and how to apply these concepts in real-world scenarios.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Resources</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group bg-muted/50">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm group-hover:text-primary transition-colors">Complete Guide to {selectedNode.data.label}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">YouTube • 15 mins</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t bg-muted/30">
            <Button className="w-full gap-2">
              <CheckCircle2 className="h-4 w-4" /> Mark as Completed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
