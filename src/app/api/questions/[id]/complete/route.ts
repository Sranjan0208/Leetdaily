import { auth } from "@/auth";
import db from "@/drizzle";
import { userProgress } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { params } = context;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unautorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const questionId = (await params).id;

    const progressRecord = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!progressRecord) {
      await db.insert(userProgress).values({
        userId,
        completedQuestions: [questionId],
      });
      return NextResponse.json({
        success: true,
        message: "Question marked as Complete",
      });
    }

    const isCompleted = progressRecord.completedQuestions?.includes(questionId);
    const updatedCompletedQuestions = isCompleted
      ? progressRecord.completedQuestions?.filter((id) => id !== questionId)
      : [...(progressRecord.completedQuestions || []), questionId];

    await db
      .update(userProgress)
      .set({ completedQuestions: updatedCompletedQuestions })
      .where(eq(userProgress.id, progressRecord.id));

    return NextResponse.json({
      success: true,
      message: `Question marked as ${isCompleted ? "incomplete" : "complete"}`,
    });
  } catch (err) {
    console.error("Error completing question:", err);
    return NextResponse.json(
      { error: "Failed to complete question" },
      { status: 500 },
    );
  }
}
