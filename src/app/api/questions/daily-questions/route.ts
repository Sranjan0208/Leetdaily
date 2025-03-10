import { NextResponse } from "next/server";
import db from "@/drizzle";
import { questions, dailyQuestions, userProgress } from "@/drizzle/schema";
import { eq, and, not, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const shouldRefresh = url.searchParams.get("refresh") === "true";

    // First, ensure user progress record exists
    let userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!userProgressData) {
      const newProgress = await db
        .insert(userProgress)
        .values({
          userId: userId,
          completedQuestions: [],
          starredQuestions: [],
          lastUpdated: new Date(),
        })
        .returning();

      userProgressData = newProgress[0];
    }

    userProgressData.completedQuestions =
      userProgressData.completedQuestions || [];
    userProgressData.starredQuestions = userProgressData.starredQuestions || [];

    // 0 is considered falsy value so when I use userProgressData.easyCount || 3, 0 is treated as falsy and easyCount was storing 3 instead of 0
    const easyCount = userProgressData.easyCount ?? 3;
    const mediumCount = userProgressData.mediumCount ?? 2;
    const hardCount = userProgressData.hardCount ?? 1;

    // Get existing daily questions record
    const dailyRecord = await db
      .select()
      .from(dailyQuestions)
      .where(eq(dailyQuestions.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    // Check if we need to refresh based on time or explicit refresh request
    const now = new Date();
    const shouldGetNewQuestions =
      shouldRefresh ||
      !dailyRecord?.lastUpdated ||
      !dailyRecord?.questions?.length ||
      isStale(dailyRecord.lastUpdated);

    if (
      !shouldGetNewQuestions &&
      dailyRecord &&
      dailyRecord.questions &&
      dailyRecord.questions.length > 0
    ) {
      const dailyQuestionDetails = await db
        .select()
        .from(questions)
        .where(inArray(questions.id, dailyRecord.questions));

      if (dailyQuestionDetails.length > 0) {
        const response = NextResponse.json({
          success: true,
          dailyQuestions: dailyQuestionDetails,
          refreshedAt: dailyRecord.lastUpdated,
        });

        // Set cache control headers
        response.headers.set("Cache-Control", "no-store, must-revalidate");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");

        return response;
      }
    }

    const excludedIds = [
      ...(userProgressData?.completedQuestions || []),
    ].filter(Boolean);

    // Create difficulty filter function
    const createDifficultyFilter = (difficulty: string, count: number) => {
      if (count === 0) return undefined; // Return undefined instead of false as where clause doesn't expect false
      const baseFilter = eq(questions.difficulty, difficulty);
      return excludedIds.length > 0
        ? and(baseFilter, not(inArray(questions.id, excludedIds)))
        : baseFilter;
    };

    // Fetch new random questions for each difficulty
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      easyCount > 0
        ? db
            .select()
            .from(questions)
            .where(createDifficultyFilter("Easy", easyCount)!)
            .orderBy(sql`RANDOM()`)
            .limit(easyCount)
        : Promise.resolve([]),
      mediumCount > 0
        ? db
            .select()
            .from(questions)
            .where(createDifficultyFilter("Medium", mediumCount)!)
            .orderBy(sql`RANDOM()`)
            .limit(mediumCount)
        : Promise.resolve([]),
      hardCount > 0
        ? db
            .select()
            .from(questions)
            .where(createDifficultyFilter("Hard", hardCount)!)
            .orderBy(sql`RANDOM()`)
            .limit(hardCount)
        : Promise.resolve([]),
    ]);

    const newDailyQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];

    if (newDailyQuestions.length === 0) {
      return NextResponse.json(
        { error: "No available questions found" },
        { status: 404 },
      );
    }

    // Update or insert the new questions
    if (dailyRecord) {
      await db
        .update(dailyQuestions)
        .set({
          questions: newDailyQuestions.map((q) => q.id),
          lastUpdated: now,
        })
        .where(eq(dailyQuestions.userId, userId));
    } else {
      await db.insert(dailyQuestions).values({
        userId: userId,
        questions: newDailyQuestions.map((q) => q.id),
        lastUpdated: now,
      });
    }

    const response = NextResponse.json({
      success: true,
      dailyQuestions: newDailyQuestions,
      refreshedAt: now,
    });

    // Set cache control headers
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (err) {
    console.error("Error fetching daily questions:", err);
    return NextResponse.json(
      { error: "Failed to fetch daily questions", details: String(err) },
      { status: 500 },
    );
  }
}

// Helper function to check if the last update is stale (e.g., older than 24 hours)
function isStale(lastUpdated: Date): boolean {
  const now = new Date();
  const hours =
    Math.abs(now.getTime() - new Date(lastUpdated).getTime()) / 36e5;
  return hours >= 24;
}
