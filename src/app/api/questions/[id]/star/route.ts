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
        starredQuestions: [questionId],
      });
      return NextResponse.json({ success: true, message: "Question Starred" });
    }

    const isStarred = progressRecord.starredQuestions?.includes(questionId);
    const updatedStarredQuestions = isStarred
      ? progressRecord.starredQuestions?.filter((id) => id !== questionId)
      : [...(progressRecord.starredQuestions || []), questionId];

    await db
      .update(userProgress)
      .set({ starredQuestions: updatedStarredQuestions })
      .where(eq(userProgress.id, progressRecord.id));
    return NextResponse.json({
      success: true,
      message: `Question ${isStarred ? "removed from" : "added to"} starred list`,
    });
  } catch (err) {
    console.error("Error starring question:", err);
    return NextResponse.json(
      { error: "Failed to star question" },
      { status: 500 },
    );
  }
}
