import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function GET(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params;

    // Check if notes already exist in database
    const existingNote = await prisma.note.findFirst({
      where: { topicId },
    });

    if (existingNote) {
      return NextResponse.json(JSON.parse(existingNote.content));
    }

    // Fetch the topic and parent roadmap information to provide rich context to the AI
    const topicDetails = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        roadmap: true,
      },
    });

    if (!topicDetails) {
      return new NextResponse("Topic not found", { status: 404 });
    }

    const topicTitle = topicDetails.title;
    const roadmapTitle = topicDetails.roadmap.title;

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return new NextResponse("Llama/Groq API key is missing. Please configure GROQ_API_KEY in your .env file.", { status: 400 });
    }

    const prompt = `
You are an expert curriculum designer and senior technical educator.
Generate comprehensive, highly structured study notes for the topic "${topicTitle}" within the context of learning "${roadmapTitle}".

Return ONLY a valid JSON object matching this exact structure:
{
  "overview": {
    "summary": "Provide a comprehensive 3-4 sentence overview of the topic.",
    "importance": "Explain in 2-3 sentences why this topic is essential to learn and what problems it solves.",
    "applications": [
      "Real-world application 1 (e.g. description of how it is used in industry)",
      "Real-world application 2",
      "Real-world application 3"
    ]
  },
  "keyConcepts": [
    {
      "title": "Core Concept Title (e.g., Virtual DOM reconciliation)",
      "description": "Clear explanation of this concept and why it matters."
    },
    {
      "title": "Core Concept Title 2",
      "description": "Clear explanation..."
    },
    {
      "title": "Core Concept Title 3",
      "description": "Clear explanation..."
    }
  ],
  "interviewQuestions": {
    "beginner": [
      {
        "question": "Plausible beginner-level interview question?",
        "answer": "Detailed answer for the candidate.",
        "difficulty": "Easy"
      },
      {
        "question": "Another beginner-level question?",
        "answer": "Detailed answer...",
        "difficulty": "Easy"
      }
    ],
    "intermediate": [
      {
        "question": "Plausible intermediate-level interview question?",
        "answer": "Detailed answer showing technical depth.",
        "difficulty": "Medium"
      },
      {
        "question": "Another intermediate-level question?",
        "answer": "Detailed answer...",
        "difficulty": "Medium"
      }
    ],
    "advanced": [
      {
        "question": "Plausible advanced/senior-level interview question?",
        "answer": "Detailed explanation, architectural considerations, or design trade-offs.",
        "difficulty": "Hard"
      },
      {
        "question": "Another advanced-level question?",
        "answer": "Detailed explanation...",
        "difficulty": "Hard"
      }
    ]
  },
  "commonMistakes": [
    {
      "mistake": "Common mistake developers make (e.g., Modifying state directly in React)",
      "solution": "The correct approach or solution (e.g., Always use the setter function useState provides)"
    },
    {
      "mistake": "Another mistake...",
      "solution": "Correct approach..."
    }
  ],
  "revisionNotes": [
    "Critical revision point 1 (Keep it brief, 1-minute recap style)",
    "Critical revision point 2",
    "Critical revision point 3",
    "Critical revision point 4"
  ]
}

Ensure all summaries, concept descriptions, and answers are comprehensive and technically accurate. Do not leave placeholder values or truncated sentences.
`;

    // Request JSON from Llama 3.1
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

    const aiContent = chatCompletion.choices[0]?.message?.content || "";
    const parsedNotes = JSON.parse(aiContent.trim());

    // Save to Database
    await prisma.note.create({
      data: {
        topicId,
        content: JSON.stringify(parsedNotes),
      },
    });

    return NextResponse.json(parsedNotes);
  } catch (error) {
    console.error("[TOPIC_NOTES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
