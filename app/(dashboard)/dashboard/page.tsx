import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Find the DB user using Clerk userId to get internal cuid
  const dbUser = await prisma.user.findUnique({
    where: { userId }
  });

  const userRoadmaps = dbUser
    ? await prisma.roadmap.findMany({
        where: { authorId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: 6
      })
    : [];

  const userProgress = dbUser
    ? await prisma.progress.findMany({
        where: {
          userId: dbUser.id,
          completed: true,
        },
      })
    : [];

  const totalCompletedTopics = userProgress.length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      {/* Background radial glow */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-white/40 text-sm">Track your learning progress and saved roadmaps.</p>
        </div>
        <Link href="/search">
          <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
            <Plus className="h-4 w-4" /> New Roadmap
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/[0.02] backdrop-blur-sm border-white/[0.08] hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Roadmaps</CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white/95">{userRoadmaps.length}</div>
            <p className="text-xs text-white/40">Paths currently in progress</p>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] backdrop-blur-sm border-white/[0.08] hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Topics Completed</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white/95">{totalCompletedTopics}</div>
            <p className="text-xs text-white/40">
              {totalCompletedTopics > 0 ? "Keep learning!" : "Start tracking your progress"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-white/90">Recent Roadmaps</h2>
        {userRoadmaps.length === 0 ? (
          <div className="text-center p-12 border border-white/[0.08] border-dashed rounded-2xl bg-white/[0.02] backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2 text-white/80">No roadmaps yet</h3>
            <p className="text-white/40 mb-6 text-sm">Search for a topic to generate your first AI roadmap.</p>
            <Link href="/search">
              <Button className="bg-white text-black hover:bg-white/90 rounded-xl">Generate Roadmap</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userRoadmaps.map((roadmap) => {
              const completedForRoadmap = userProgress.filter((p) => p.roadmapId === roadmap.id).length;
              const totalTopics = Array.isArray(roadmap.nodes) ? roadmap.nodes.length : 0;
              const progressPercent = totalTopics > 0 ? Math.round((completedForRoadmap / totalTopics) * 100) : 0;

              return (
                <Link href={`/roadmap/${roadmap.id}?topic=${encodeURIComponent(roadmap.topic)}`} key={roadmap.id}>
                  <Card className="bg-white/[0.02] backdrop-blur-sm border-white/[0.08] hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.1)] cursor-pointer group h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-1 text-white/95 group-hover:text-indigo-400 transition-colors">{roadmap.title}</CardTitle>
                      <CardDescription className="text-white/40">{totalTopics} topics to master</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Progress</span>
                          <span className="font-medium text-white/80">{progressPercent}%</span>
                         </div>
                        <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all group-hover:from-indigo-400 group-hover:to-cyan-300" 
                            style={{ width: `${progressPercent}%` }} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
