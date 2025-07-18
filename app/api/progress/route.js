// app/api/progress/route.js
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { USER_COURSE_PROGRESS_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

// POST: Update or Insert progress
export async function POST(req) {
  try {
    const { userId, courseId, type, value } = await req.json();

    if (!userId || !courseId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fieldMap = {
      notes: "notesCompleted",
      flashcards: "flashcardsCompleted",
      quiz: "quizCompleted",
      qa: "qaCompleted",
    };

    const fieldToUpdate = fieldMap[type];
    if (!fieldToUpdate) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(USER_COURSE_PROGRESS_TABLE)
      .where(
        and(
          eq(USER_COURSE_PROGRESS_TABLE.userId, userId),
          eq(USER_COURSE_PROGRESS_TABLE.courseId, courseId)
        )
      );

    if (existing.length > 0) {
      await db
        .update(USER_COURSE_PROGRESS_TABLE)
        .set({ [fieldToUpdate]: value })
        .where(
          and(
            eq(USER_COURSE_PROGRESS_TABLE.userId, userId),
            eq(USER_COURSE_PROGRESS_TABLE.courseId, courseId)
          )
        );
    } else {
      await db.insert(USER_COURSE_PROGRESS_TABLE).values({
        userId,
        courseId,
        [fieldToUpdate]: value,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Progress update failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Fetch progress for a course
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");

    if (!courseId || !userId) {
      return NextResponse.json({ error: "Missing courseId or userId" }, { status: 400 });
    }

    const progress = await db
      .select()
      .from(USER_COURSE_PROGRESS_TABLE)
      .where(
        and(
          eq(USER_COURSE_PROGRESS_TABLE.userId, userId),
          eq(USER_COURSE_PROGRESS_TABLE.courseId, courseId)
        )
      );

    // ✅ Always return an object (empty or found)
    return NextResponse.json(progress[0] || {});
  } catch (err) {
    console.error("Progress fetch failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
