import { evaluateAnswer } from "@/lib/gemini";
import { ExperienceLevel, Topic } from "@/types/tutor-problem";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic, level } = (await req.json()) as {
      question: string;
      answer: string;
      topic: Topic;
      level: ExperienceLevel;
    };

    const evaluation = await evaluateAnswer(question, answer, topic, level);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to evaluate answer!",
      },
      { status: 500 },
    );
  }
}
