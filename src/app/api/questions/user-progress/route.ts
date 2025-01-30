// First, update your user progress API endpoint (app/api/questions/user-progress/route.ts)
import { auth } from "@/auth";
import db from "@/drizzle";
import { userProgress, questions } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user progress
    const progressRecord = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!progressRecord) {
      // Return empty arrays if no progress exists
      return NextResponse.json({
        starredQuestions: [],
        completedQuestions: [],
      });
    }

    // Get full question details for starred and completed questions
    const [starredDetails, completedDetails] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(inArray(questions.id, progressRecord.starredQuestions || [])),
      db
        .select()
        .from(questions)
        .where(inArray(questions.id, progressRecord.completedQuestions || [])),
    ]);

    return NextResponse.json({
      starredQuestions: starredDetails,
      completedQuestions: completedDetails,
    });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return NextResponse.json(
      { error: "Failed to fetch user progress" },
      { status: 500 },
    );
  }
}
