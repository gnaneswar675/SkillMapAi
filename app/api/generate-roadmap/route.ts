import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// Initialize Groq API for Llama 3.1
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the user exists in our DB to prevent foreign key errors
    const dbUser = await prisma.user.upsert({
      where: { userId },
      update: {},
      create: {
        userId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Anonymous",
        imageUrl: clerkUser.imageUrl,
      },
    });

    const { topic } = await req.json();
    if (!topic) {
      return new NextResponse("Topic is required", { status: 400 });
    }

    // Check if roadmap already exists to save API costs
    const existingRoadmap = await prisma.roadmap.findUnique({
      where: { topic: topic.toLowerCase() },
      include: {
        topics: {
          include: {
            resources: true,
          },
        },
      },
    });

    if (existingRoadmap) {
      if (existingRoadmap.topics.length === 0 && Array.isArray(existingRoadmap.nodes)) {
        try {
          const nodes = existingRoadmap.nodes as any[];
          const roadmapId = existingRoadmap.id;
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
            where: { id: existingRoadmap.id },
            include: {
              topics: {
                include: {
                  resources: true,
                },
              },
            },
          });
          return NextResponse.json(updatedRoadmap);
        } catch (migrationError) {
          console.error("Failed to migrate existing roadmap topics:", migrationError);
        }
      }
      return NextResponse.json(existingRoadmap);
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return new NextResponse("Llama/Groq API key is missing. Please add GROQ_API_KEY to your .env file.", { status: 400 });
    }

    const prompt = `
You are an expert curriculum designer. 
Generate a detailed learning roadmap for the given topic: "${topic}". 
Return ONLY a valid JSON object with this exact structure:
{
  "nodes": [
    { 
      "id": "1", 
      "position": { "x": 400, "y": 0 }, 
      "type": "input", 
      "data": { 
        "label": "Topic Name",
        "description": "A clear, detailed description explaining this topic or concept.",
        "resources": [
          { "title": "GeeksforGeeks: Topic Name Guide", "url": "https://www.geeksforgeeks.org/real-url-slug/", "type": "article" },
          { "title": "Official Documentation", "url": "https://official-docs-site.com/real-path", "type": "documentation" }
        ]
      } 
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ],
  "description": "A short 1-2 sentence summary of this learning path."
}
Use 6-10 nodes. Spread them out vertically (y: 0, 150, 300, 450...) so they don't overlap. Make the last node type "output".

CRITICAL INSTRUCTIONS FOR RESOURCES:
1. You MUST generate 2-3 REAL, SPECIFIC, AND FUNCTIONAL resource links for each node.
2. DO NOT use generic placeholders like "example.com", "your-url-slug", "topic-name-url-slug", "real-url-slug", or "official-docs-site.com". All URLs must be actual, valid URLs pointing to educational content on the internet.
3. Prioritize high-quality links from GeeksforGeeks (gfg). For example:
   - For React Virtual DOM: "https://www.geeksforgeeks.org/reactjs-virtual-dom/"
   - For React Hooks: "https://www.geeksforgeeks.org/reactjs-hooks/"
   - For SQL Joins: "https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/"
   - For JS Promises: "https://www.geeksforgeeks.org/javascript-promises/"
4. If a GeeksforGeeks link is not available, provide real links from official documentation (e.g., react.dev, developer.mozilla.org, nextjs.org/docs), freeCodeCamp, or youtube.com (search queries or specific channels).
5. All generated URLs must be complete, beginning with http:// or https://.
`;

    // Call Groq API with Llama 3.1
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a JSON generator. You always return perfect, parseable JSON and nothing else."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    let aiContent = chatCompletion.choices[0]?.message?.content || "";
    aiContent = aiContent.trim();

    if (!aiContent) {
      throw new Error("Failed to generate content from Llama 3.1");
    }

    const parsedContent = JSON.parse(aiContent);

    // Save to Database
    const newRoadmap = await prisma.roadmap.create({
      data: {
        title: `${topic} Roadmap`,
        topic: topic.toLowerCase(),
        description: parsedContent.description || "Generated by SkillMapAi",
        nodes: parsedContent.nodes,
        edges: parsedContent.edges,
        authorId: dbUser.id,
        topics: {
          create: (parsedContent.nodes || []).map((node: any) => {
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
            return {
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
            };
          }),
        },
      },
      include: {
        topics: {
          include: {
            resources: true,
          },
        },
      },
    });

    return NextResponse.json(newRoadmap);
  } catch (error: any) {
    console.error("[ROADMAP_GENERATE_ERROR]", error);

    if (error?.status === 401) {
      return new NextResponse("Invalid Llama API key. Please check your credentials.", { status: 401 });
    }

    if (error?.message) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
