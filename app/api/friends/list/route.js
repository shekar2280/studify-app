import { db } from "@/configs/db";
import { FRIENDSHIP_TABLE } from "@/configs/schema";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const friends = await db
  .select()
  .from(FRIENDSHIP_TABLE)
  .where(
    or(
      eq(FRIENDSHIP_TABLE.user1Id, userId),
      eq(FRIENDSHIP_TABLE.user2Id, userId)
    )
  );

    return NextResponse.json(friends || []);
  } catch (err) {
    console.error("Friends list error:", err);
    return NextResponse.json([], { status: 500 }); 
  }
}
