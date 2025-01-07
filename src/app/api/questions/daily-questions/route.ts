import { NextResponse } from "next/server";
import db from "@/drizzle";
import { questions, dailyQuestions, userProgress } from "@/drizzle/schema";
import { eq, and, not, inArray } from "drizzle-orm";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"; // You'll need to create this if you haven't already

const DAILY_QUESTIONS_UPDATE_TIME = 8; // 8:00 AM

export async function GET() {
  try {
    // Get the authenticated user's session
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: "Authentication required" },
    //     { status: 401 }
    //   );
    // }

    // const userId = session.user.id;
    const now = new Date();
    const todayDateString = now.toISOString().split("T")[0];

    // Get existing daily record for the authenticated user
    const dailyRecord = await db
      .select()
      .from(dailyQuestions)
      .where(eq(dailyQuestions.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    // Check if we already have questions for today
    const isSameDay =
      dailyRecord?.lastUpdated &&
      new Date(dailyRecord.lastUpdated).toISOString().split("T")[0] ===
        todayDateString;

    if (isSameDay) {
      return NextResponse.json({
        dailyQuestions: dailyRecord.questions || [],
      });
    }

    // Get user progress for the authenticated user
    const userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    // Safely handle excluded IDs
    const excludedIds = [
      ...(userProgressData?.completedQuestions || []),
      ...(userProgressData?.starredQuestions || []),
    ].filter(Boolean);

    // Function to create difficulty filter
    const createDifficultyFilter = (difficulty: string) => {
      const baseFilter = eq(questions.difficulty, difficulty);
      return excludedIds.length > 0
        ? and(baseFilter, not(inArray(questions.id, excludedIds)))
        : baseFilter;
    };

    // Fetch questions for each difficulty level
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Easy"))
        .limit(3),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Medium"))
        .limit(2),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Hard"))
        .limit(1),
    ]);

    // Combine selected questions
    const newDailyQuestions = [
      ...easyQuestions.map((q) => q.id),
      ...mediumQuestions.map((q) => q.id),
      ...hardQuestions.map((q) => q.id),
    ];

    // Update or insert daily questions
    const updatedRecord = {
      userId: userId,
      questions: newDailyQuestions,
      lastUpdated: now,
    };

    if (dailyRecord) {
      await db
        .update(dailyQuestions)
        .set(updatedRecord)
        .where(eq(dailyQuestions.id, dailyRecord.id));
    } else {
      await db.insert(dailyQuestions).values(updatedRecord);
    }

    return NextResponse.json({ dailyQuestions: newDailyQuestions });
  } catch (err) {
    console.error("Error fetching daily questions:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch daily questions",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
