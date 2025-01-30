import { auth } from "@/auth";
import db from "@/drizzle";
import { userProgress } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Operation = {
  id: string;
  type: "star" | "complete";
  value: boolean;
};

type BatchRequest = {
  operations: Operation[];
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const { operations }: BatchRequest = await request.json();

    // Validate operations
    if (!Array.isArray(operations) || operations.length === 0) {
      return NextResponse.json(
        { error: "Invalid operations format" },
        { status: 400 },
      );
    }

    // Get User Progress
    let progressRecord = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    // Create progress record if it doesn't exist
    if (!progressRecord) {
      const [newRecord] = await db
        .insert(userProgress)
        .values({ userId, completedQuestions: [], starredQuestions: [] })
        .returning();
      progressRecord = newRecord;
    }

    // Initialize sets for efficient operation
    const starredSet = new Set(progressRecord.starredQuestions || []);
    const completedSet = new Set(progressRecord.completedQuestions || []);

    operations.forEach(({ id, type, value }) => {
      const targetSet = type === "star" ? starredSet : completedSet;

      if (value) {
        targetSet.add(id);
      } else {
        targetSet.delete(id);
      }
    });

    // Update database with new sets
    await db
      .update(userProgress)
      .set({
        starredQuestions: Array.from(starredSet),
        completedQuestions: Array.from(completedSet),
        lastUpdated: new Date(),
      })
      .where(eq(userProgress.id, progressRecord.id));

    return NextResponse.json({
      success: true,
      message: "Batch operations processed successfully",
    });
  } catch (err) {
    console.error("Error processing batch operations:", err);
    return NextResponse.json(
      { error: "Failed to process batch operations" },
      { status: 500 },
    );
  }
}
