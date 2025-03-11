import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { courseId, studyType } = await req.json();

    if (studyType === 'ALL') {
        const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));

        const contentList = await db.select().from(STUDY_TYPE_CONTENT_TABLE)
            .where(eq(STUDY_TYPE_CONTENT_TABLE?.courseId, courseId));


        const flashcards = contentList?.filter(item => item.type === "Flashcards" && item.status === "Ready");

        const quizcontent = contentList?.filter(item => item.type === "Quiz" && item.status === "Ready");

        const qacontent = contentList?.filter(item => item.type === "Question/Answer" && item.status === "Ready");

        const result = {
            notes: notes,
            flashcards: flashcards,
            quiz: quizcontent,
            qa: qacontent
        };

        return NextResponse.json(result);
    } else if (studyType === 'notes') {
        const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));

        return NextResponse.json(notes);
    }
    else{
        const result = await db.select().from(STUDY_TYPE_CONTENT_TABLE)
            .where(and(eq(STUDY_TYPE_CONTENT_TABLE?.courseId, courseId),
            eq(STUDY_TYPE_CONTENT_TABLE.type,studyType)))

        return NextResponse.json(result[0]??[]);
    }
}
