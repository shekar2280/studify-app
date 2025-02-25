import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();
        
        console.log("Received request with data:", { courseId, topic, courseType, difficultyLevel, createdBy });

        // Insert placeholder record
        const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
            courseId,
            courseType,
            createdBy,
            topic,
            courseLayout: null,
            status: "processing"
        }).returning({ id: STUDY_MATERIAL_TABLE.id });

        console.log("DB Insert Result:", dbResult);

        const recordId = dbResult[0]?.id;
        if (!recordId) throw new Error("Failed to insert study material");

        console.log("Triggering Inngest function with:", { recordId, topic, courseType, difficultyLevel });

        // Send event to Inngest
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
