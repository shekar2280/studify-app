import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    if (!recordId) {
        return NextResponse.json({ error: "Missing recordId" }, { status: 400 });
    }

    const result = await db
        .select({
            status: STUDY_MATERIAL_TABLE.status,
            courseLayout: STUDY_MATERIAL_TABLE.courseLayout
        })
        .from(STUDY_MATERIAL_TABLE)
        .where(eq(STUDY_MATERIAL_TABLE.id, recordId));

    if (result.length === 0) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        status: result[0].status, 
        courseLayout: result[0].courseLayout 
    });
}
