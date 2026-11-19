import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

    const { topicId, completed } = await req.json();

    if (!topicId) {
      return new NextResponse("Topic ID is required", { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_topicId: {
          userId: dbUser.id,
          topicId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: dbUser.id,
        roadmapId,
        topicId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    revalidatePath("/dashboard");

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[PROGRESS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
