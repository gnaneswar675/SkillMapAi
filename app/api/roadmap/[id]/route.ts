import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
    });

    if (!roadmap) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("[ROADMAP_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
