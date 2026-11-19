import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roadmapId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { saved } = await req.json();

    if (saved) {
      const savedRoadmap = await prisma.savedRoadmap.upsert({
        where: {
          userId_roadmapId: {
            userId: dbUser.id,
            roadmapId,
          },
        },
        update: {},
        create: {
          userId: dbUser.id,
          roadmapId,
        },
      });
      return NextResponse.json({ saved: true, data: savedRoadmap });
    } else {
      await prisma.savedRoadmap.deleteMany({
        where: {
          userId: dbUser.id,
          roadmapId,
        },
      });
      return NextResponse.json({ saved: false });
    }
  } catch (error) {
    console.error("[ROADMAP_SAVE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
