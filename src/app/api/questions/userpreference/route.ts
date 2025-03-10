import { NextResponse } from "next/server";
import db from "@/drizzle";
import { userProgress } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const userPreferences = await db
      .select({
        easyCount: userProgress.easyCount,
        mediumCount: userProgress.mediumCount,
        hardCount: userProgress.hardCount,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    return NextResponse.json(
      {
        preferences: userPreferences,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error fetching user preferences:", err);
    return NextResponse.json(
      { error: "Failed to fetch user preferences", details: String(err) },
      { status: 500 },
    );
  }
}

// POST endpoint to update user preferences
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { easyCount, mediumCount, hardCount } = await request.json();

    // Validate input
    if (
      easyCount < 0 ||
      easyCount > 5 ||
      mediumCount < 0 ||
      mediumCount > 5 ||
      hardCount < 0 ||
      hardCount > 5
    ) {
      return NextResponse.json(
        { error: "Invalid question counts. Values must be between 0 and 5." },
        { status: 400 },
      );
    }

    // Check if user progress exists
    const existingProgress = await db
      .select({
        id: userProgress.id,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    if (existingProgress) {
      // Update existing record
      await db
        .update(userProgress)
        .set({
          easyCount: easyCount,
          mediumCount: mediumCount,
          hardCount: hardCount,
          lastUpdated: new Date(),
        })
        .where(eq(userProgress.userId, userId));
    } else {
      // Create new record
      await db.insert(userProgress).values({
        userId: userId,
        completedQuestions: [],
        starredQuestions: [],
        easyCount: easyCount,
        mediumCount: mediumCount,
        hardCount: hardCount,
        lastUpdated: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Preferences updated successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating user preferences:", err);
    return NextResponse.json(
      { error: "Failed to update user preferences", details: String(err) },
      { status: 500 },
    );
  }
}
