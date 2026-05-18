"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const savedRoadmaps = [
    { id: "1", title: "Advanced React Patterns", topic: "React", date: "Oct 24, 2026", nodes: 15 },
    { id: "2", title: "Microservices Architecture", topic: "System Design", date: "Oct 22, 2026", nodes: 28 },
    { id: "3", title: "Next.js App Router Masterclass", topic: "Next.js", date: "Oct 18, 2026", nodes: 12 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Paths</h1>
        <p className="text-muted-foreground">Access your bookmarked learning roadmaps.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedRoadmaps.map((roadmap) => (
          <Card key={roadmap.id} className="flex flex-col group hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1">{roadmap.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Generated for "{roadmap.topic}"</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4">
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <div className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" /> {roadmap.nodes} topics
                </div>
                <div>{roadmap.date}</div>
              </div>
              <Link href={`/roadmap/${roadmap.id}?topic=${encodeURIComponent(roadmap.topic)}`} className="w-full">
                <Button className="w-full gap-2" variant="secondary">
                  Continue Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
        <Link href="/search" className="flex items-center justify-center h-full min-h-[200px]">
          <Card className="w-full h-full border-dashed flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground hover:text-primary">
            <div className="p-4 rounded-full bg-primary/10 mb-2">
              <Bookmark className="h-6 w-6" />
            </div>
            <p className="font-medium">Save a new path</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
