import { auth } from "@/auth";
import db from "@/drizzle";
import { userProgress, questions } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // First, try to fetch existing user progress
    let userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .then((res) => res[0]);

    // If no progress exists, create a new progress record
    if (!userProgressData) {
      const newProgress = await db
        .insert(userProgress)
        .values({
          userId: userId,
          completedQuestions: [], // Initialize with empty arrays
          starredQuestions: [],
          lastUpdated: new Date(),
        })
        .returning(); // Get the inserted record

      userProgressData = newProgress[0];
    }

    // Ensure arrays are initialized even if they're null in the database
    const completedQuestions = userProgressData.completedQuestions || [];
    const starredQuestions = userProgressData.starredQuestions || [];

    // Only fetch question details if there are IDs to fetch
    const [completedQuestionsData, starredQuestionsData] = await Promise.all([
      completedQuestions.length > 0
        ? db
            .select()
            .from(questions)
            .where(inArray(questions.id, completedQuestions))
        : Promise.resolve([]),
      starredQuestions.length > 0
        ? db
            .select()
            .from(questions)
            .where(inArray(questions.id, starredQuestions))
        : Promise.resolve([]),
    ]);

    // Return structured response with empty arrays if no data
    return NextResponse.json({
      success: true,
      completedQuestions: completedQuestionsData,
      starredQuestions: starredQuestionsData,
    });
  } catch (err) {
    console.error("Error in user progress handler:", err);

    // Provide more specific error messages based on error type
    if (err instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to process user progress",
          message: err.message,
          // Avoid exposing full error details in production
          details:
            process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
