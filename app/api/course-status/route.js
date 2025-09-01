import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const course = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

  if (!course || course.length === 0) {
    return NextResponse.json({ status: "not_found" });
  }

  const courseData = course[0];
  const layout = courseData.courseLayout?.chapters || [];

  const chaptersInDb = await db
    .select({
      chapterId: CHAPTER_NOTES_TABLE.chapterId,
      status: CHAPTER_NOTES_TABLE.status,
    })
    .from(CHAPTER_NOTES_TABLE)
    .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

  const chapters = layout.map((ch) => {
    const dbEntry = chaptersInDb.find((c) => c.chapterId === ch.chapter_number);
    return {
      chapterId: ch.chapter_number,
      title: ch.chapter_name,
      status: dbEntry?.status || "Pending",
    };
  });

  const totalChapters = chapters.length;
  const completed = chapters.filter((c) => c.status === "Ready").length;
  const progress =
    totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;

  return NextResponse.json({
    status: courseData.status,
    topic: courseData.topic,
    difficultyLevel: courseData.difficultyLevel,
    chapters,
    progress, 
  });
}
