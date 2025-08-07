import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";



export async function GET(params) {
    try{
        const users = await db.select().from(USER_TABLE);
        return NextResponse.json(users);
    }catch(error) {
        console.log("Error fetching users:", error);
        return NextResponse.json({error: "Failed to fetch users" }, { status: 500 });
    }
}