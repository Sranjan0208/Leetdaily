import { NextRequest, NextResponse } from "next/server";
import { generateQuestion } from "@/lib/gemini";
import { ExperienceLevel, Topic } from "@/types/tutor-problem";

export async function POST(req: NextRequest) {
  try {
    const { topic, level } = (await req.json()) as {
      topic: Topic;
      level: ExperienceLevel;
    };

    const question = await generateQuestion(topic, level);
    return NextResponse.json(question);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
