import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UnsaveButton } from "@/components/roadmap/UnsaveButton";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Find the DB user using Clerk userId to get internal cuid
  const dbUser = await prisma.user.findUnique({
    where: { userId }
  });

  const savedRoadmapRelations = dbUser
    ? await prisma.savedRoadmap.findMany({
        where: { userId: dbUser.id },
        include: {
          roadmap: true
        },
        orderBy: { createdAt: 'desc' }
      })
    : [];

  const savedRoadmaps = savedRoadmapRelations.map(sr => sr.roadmap);

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
                <UnsaveButton roadmapId={roadmap.id} />
              </div>
              <CardDescription>Generated for "{roadmap.topic}"</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4">
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <div className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" /> {(roadmap.nodes as any[])?.length || 0} topics
                </div>
                <div>{new Date(roadmap.createdAt).toLocaleDateString()}</div>
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
