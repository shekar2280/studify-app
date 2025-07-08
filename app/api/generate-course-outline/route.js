import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();
        
        const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
            courseId,
            courseType,
            createdBy,
            topic,
            courseLayout: null,
            status: "processing"
        }).returning({ id: STUDY_MATERIAL_TABLE.id });

        const recordId = dbResult[0]?.id;
        if (!recordId) throw new Error("Failed to insert study material");


        await inngest.send({
            name: "course.generateOutline",
            data: { recordId, topic, courseType, difficultyLevel }
        });

        return NextResponse.json({ jobId: recordId });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
