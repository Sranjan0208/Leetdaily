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
          lastUpdated: new Date(), // Set the lastUpdated to now.
        })
        .returning(); // Use `.returning()` to get the full inserted record.

      userProgressData = newProgress[0]; // Assign the returned record.
    }

    // Ensure completedQuestions and starredQuestions are arrays, not null.
    userProgressData.completedQuestions =
      userProgressData.completedQuestions || [];
    userProgressData.starredQuestions = userProgressData.starredQuestions || [];

    // If not refreshing, try to get existing questions first
    if (!shouldRefresh) {
      const dailyRecord = await db
        .select()
        .from(dailyQuestions)
        .where(eq(dailyQuestions.userId, userId))
        .limit(1)
        .then((res) => res[0]);

      if (
        dailyRecord &&
        Array.isArray(dailyRecord.questions) &&
        dailyRecord.questions.length > 0
      ) {
        const dailyQuestionDetails = await db
          .select()
          .from(questions)
          .where(inArray(questions.id, dailyRecord.questions));

        if (dailyQuestionDetails.length > 0) {
          return NextResponse.json({
            success: true,
            dailyQuestions: dailyQuestionDetails,
          });
        }
      }
    }

    const excludedIds = [
      ...(userProgressData?.completedQuestions || []),
    ].filter(Boolean);

    // Create difficulty filter function
    const createDifficultyFilter = (difficulty: string) => {
      const baseFilter = eq(questions.difficulty, difficulty);
      return excludedIds.length > 0
        ? and(baseFilter, not(inArray(questions.id, excludedIds)))
        : baseFilter;
    };

    // Fetch new random questions for each difficulty
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Easy"))
        .orderBy(sql`RANDOM()`)
        .limit(3),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Medium"))
        .orderBy(sql`RANDOM()`)
        .limit(2),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Hard"))
        .orderBy(sql`RANDOM()`)
        .limit(1),
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
    const now = new Date();
    const dailyRecord = await db
      .select()
      .from(dailyQuestions)
      .where(eq(dailyQuestions.userId, userId))
      .limit(1)
      .then((res) => res[0]);

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

    return NextResponse.json({
      success: true,
      dailyQuestions: newDailyQuestions,
    });
  } catch (err) {
    console.error("Error fetching daily questions:", err);
    return NextResponse.json(
      { error: "Failed to fetch daily questions", details: String(err) },
      { status: 500 },
    );
  }
}
