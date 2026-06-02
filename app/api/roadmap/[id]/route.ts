import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    let dbUser = null;
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { userId },
      });
    }

    let roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            resources: true,
          },
        },
      },
    });

    if (!roadmap) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Self-healing migration for existing roadmaps
    if (roadmap.topics.length === 0 && Array.isArray(roadmap.nodes)) {
      try {
        const nodes = roadmap.nodes as any[];
        const roadmapId = roadmap.id;
        await prisma.$transaction(
          nodes.map((node: any) => {
            const rawResources = node.data?.resources || [];
            const resources = rawResources.length > 0 ? rawResources : [
              {
                title: `GeeksforGeeks: Learn ${node.data?.label || "Topic"}`,
                url: `https://www.geeksforgeeks.org/search/${encodeURIComponent(node.data?.label || "Topic")}/`,
                type: "article"
              },
              {
                title: `Google Search: ${node.data?.label || "Topic"}`,
                url: `https://www.google.com/search?q=${encodeURIComponent((node.data?.label || "Topic") + " geeksforgeeks")}`,
                type: "search"
              }
            ];
            return prisma.topic.create({
              data: {
                roadmapId: roadmapId,
                title: node.data?.label || "Topic",
                description: node.data?.description || `Overview of ${node.data?.label || "Topic"}`,
                level: node.data?.level || "Beginner",
                nodeId: node.id,
                resources: {
                  create: resources.map((res: any) => ({
                    title: res.title,
                    url: res.url,
                    type: res.type || "article",
                  })),
                },
              },
            });
          })
        );
        
        const updatedRoadmap = await prisma.roadmap.findUnique({
          where: { id },
          include: {
            topics: {
              include: {
                resources: true,
              },
            },
          },
        });
        if (updatedRoadmap) {
          roadmap = updatedRoadmap;
        }
      } catch (migrationError) {
        console.error("Failed to migrate roadmap topics in GET route:", migrationError);
      }
    }

    const progress = dbUser
      ? await prisma.progress.findMany({
          where: {
            userId: dbUser.id,
            roadmapId: id,
          },
        })
      : [];

    return NextResponse.json({
      ...roadmap,
      progress,
    });
  } catch (error) {
    console.error("[ROADMAP_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
