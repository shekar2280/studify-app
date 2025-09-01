import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy, userId } =
      await req.json();

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        courseLayout: null,
        status: "processing",
      })
      .returning({ id: STUDY_MATERIAL_TABLE.id });


    const [user] = await db
      .select({ dailyLimit: USER_TABLE.dailyLimit })
      .from(USER_TABLE)
      .where(eq(USER_TABLE.id, userId));


    if (!user || user.dailyLimit <= 0) {
      return NextResponse.json(
        { error: "Daily quota reached. Try again tomorrow." },
        { status: 403 }
      );
    }

    const recordId = dbResult[0]?.id;
    if (!recordId) throw new Error("Failed to insert study material");

   
    const inngestResult = await inngest.send({
      name: "course.generateOutline",
      data: { recordId, topic, courseType, difficultyLevel, userId },
    });


    return NextResponse.json({ jobId: recordId, inngestEventId: inngestResult.ids });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}