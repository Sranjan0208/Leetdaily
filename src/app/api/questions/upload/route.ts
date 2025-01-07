import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import db from "@/drizzle";
import { questions } from "@/drizzle/schema";
import { Questions } from "@/validators/questions-validator";

export async function POST() {
  try {
    const filePath = path.resolve(process.cwd(), "src/uploads/questions.csv");
    const questionsData: Questions[] = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          questionsData.push({
            questionId: row.ID,
            title: row.Title,
            questionLink: row.Question_Link,
            difficulty: row.Difficulty,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    await db.insert(questions).values(questionsData);
    return NextResponse.json({ message: "Questions uploaded successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to upload questions" },
      { status: 500 },
    );
  }
}
