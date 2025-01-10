import { NextResponse } from "next/server";
import db from "@/drizzle";
import { questions, dailyQuestions, userProgress } from "@/drizzle/schema";
import { eq, and, not, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";

const DAILY_QUESTIONS_UPDATE_TIME = 8; // 8:00 AM

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const todayDateString = now.toISOString().split("T")[0];

    const dailyRecord = await db
      .select()
      .from(dailyQuestions)
      .where(eq(dailyQuestions.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    const isSameDay =
      dailyRecord?.lastUpdated &&
      new Date(dailyRecord.lastUpdated).toISOString().split("T")[0] ===
        todayDateString;

    if (dailyRecord.questions !== null) {
      if (isSameDay && dailyRecord.questions.length > 0) {
        const dailyQuestionDetails = await db
          .select()
          .from(questions)
          .where(inArray(questions.id, dailyRecord.questions));

        return NextResponse.json({
          success: true,
          dailyQuestions: dailyQuestionDetails,
        });
      }
    }

    const userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    const excludedIds = [
      ...(userProgressData?.completedQuestions || []),
    ].filter(Boolean);

    const createDifficultyFilter = (difficulty: string) => {
      const baseFilter = eq(questions.difficulty, difficulty);
      return excludedIds.length > 0
        ? and(baseFilter, not(inArray(questions.id, excludedIds)))
        : baseFilter;
    };

    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Easy"))
        .orderBy(sql`RANDOM()`) // Randomize selection
        .limit(3),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Medium"))
        .orderBy(sql`RANDOM()`) // Randomize selection
        .limit(2),
      db
        .select()
        .from(questions)
        .where(createDifficultyFilter("Hard"))
        .orderBy(sql`RANDOM()`) // Randomize selection
        .limit(1),
    ]);

    const newDailyQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];

    const updatedRecord = {
      userId: userId,
      questions: newDailyQuestions.map((q) => q.id),
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
      { error: "Failed to fetch daily questions", details: String(err) },
      { status: 500 },
    );
  }
}
