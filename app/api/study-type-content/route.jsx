import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {chapters,courseId,type} = await req.json();

    const PROMPT=type==='Flashcards'?
    'Generate the flashcard on topic: '+chapters+' in JSON format with front back content, Maximum 15': 
    type=='Quiz' ?
    'Generate Quiz on the topic : '+chapters+' with Question and Options along with correct answer in json format' :
    type=='Question/Answer' ?
    'Generate 5-6 question-answer pairs for each subtopic under the topic : '+chapters+' in json format' : 'Invalid Prompt';
    
    const result = await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseId:courseId,
        type:type
    }).returning({
        id:STUDY_TYPE_CONTENT_TABLE.id
    });

     inngest.send({
        name:'studyType.content',
        data:{
            studyType:type,
            prompt:PROMPT,
            courseId:courseId,
            recordId:result[0].id
        }
     })

     return NextResponse.json(result[0].id)
}