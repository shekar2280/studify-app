import { courseOutlineAIModel } from "@/configs/AImodel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {courseId,topic,courseType,difficultyLevel,createdBy}=await req.json();
    
    const PROMPT='Generate a study material for '+topic+' for '+courseType+' and level of difficulty will be '+difficultyLevel+' with summary of course, List of Chapters along with sumary and Emoji icon for each chapter with proper spacing after each chapter subtopics, Topic list in each chapter in JSON format'

    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT)
    const aiResult = JSON.parse(aiResp.response.text());


    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId:courseId,
        courseType:courseType,
        createdBy:createdBy,
        topic:topic,
        courseLayout:aiResult
    }).returning({resp:STUDY_MATERIAL_TABLE})

    const result = await inngest.send({
        name:'notes.generate',
        data:{
            course:dbResult[0].resp
        }
    })
    console.log(result);

    return NextResponse.json({result:dbResult[0]})
}