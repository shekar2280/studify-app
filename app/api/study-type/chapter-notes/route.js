import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  if (!courseId || !chapterId) {
    return NextResponse.json({ error: "Missing courseId or chapterId" }, { status: 400 });
  }

  try {
    const note = await db.select().from(CHAPTER_NOTES_TABLE).where(
      and(
        eq(CHAPTER_NOTES_TABLE.courseId, courseId),
        eq(CHAPTER_NOTES_TABLE.chapterId, Number(chapterId))
      )
    );

    return NextResponse.json({ content: note?.[0]?.notes ?? null });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
