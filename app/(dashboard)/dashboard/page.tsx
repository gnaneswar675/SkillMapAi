import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const userRoadmaps = await prisma.roadmap.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and saved roadmaps.</p>
        </div>
        <Link href="/search">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Roadmap
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Roadmaps</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoadmaps.length}</div>
            <p className="text-xs text-muted-foreground">Paths currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start tracking your progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-xs text-muted-foreground">Estimated time spent</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Roadmaps</h2>
        {userRoadmaps.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-xl bg-card">
            <h3 className="text-lg font-semibold mb-2">No roadmaps yet</h3>
            <p className="text-muted-foreground mb-4">Search for a topic to generate your first AI roadmap.</p>
            <Link href="/search">
              <Button>Generate Roadmap</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userRoadmaps.map((roadmap) => (
              <Link href={`/roadmap/${roadmap.id}?topic=${encodeURIComponent(roadmap.topic)}`} key={roadmap.id}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{roadmap.title}</CardTitle>
                    <CardDescription>{(roadmap.nodes as any[])?.length || 0} topics to master</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all group-hover:bg-primary/80" 
                          style={{ width: `0%` }} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
