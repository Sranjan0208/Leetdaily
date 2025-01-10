import { auth } from "@/auth";
import db from "@/drizzle";
import { userProgress, questions } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Authenticate user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user progress data
    const userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .then((res) => res[0]);

    if (!userProgressData) {
      return NextResponse.json(
        { error: "User progress not found" },
        { status: 404 },
      );
    }

    const completedQuestions = userProgressData.completedQuestions || [];
    const starredQuestions = userProgressData.starredQuestions || [];

    // Fetch completed questions details
    const completedQuestionsData =
      completedQuestions.length > 0
        ? await db
            .select()
            .from(questions)
            .where(inArray(questions.id, completedQuestions))
        : [];

    // Fetch starred questions details
    const starredQuestionsData =
      starredQuestions.length > 0
        ? await db
            .select()
            .from(questions)
            .where(inArray(questions.id, starredQuestions))
        : [];

    // Return the data in a structured response
    return NextResponse.json({
      success: true,
      completedQuestions: completedQuestionsData,
      starredQuestions: starredQuestionsData,
    });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return NextResponse.json(
      { error: "Failed to fetch user progress", details: String(err) },
      { status: 500 },
    );
  }
}
