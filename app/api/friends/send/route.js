
import { db } from "@/configs/db";
import { FRIEND_REQUEST_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { senderId, receiverId } = await req.json();

  if (!senderId || !receiverId || senderId === receiverId) {
    return new Response(JSON.stringify({ error: "Invalid user IDs" }), { status: 400 });
  }

  const existing = await db
    .select()
    .from(FRIEND_REQUEST_TABLE)
    .where(
      and(
        eq(FRIEND_REQUEST_TABLE.senderId, senderId),
        eq(FRIEND_REQUEST_TABLE.receiverId, receiverId)
      )
    );

  if (existing.length > 0) {
    return NextResponse.json({ message: "Request already exists" }, { status: 400 });
  }

  await db.insert(FRIEND_REQUEST_TABLE).values({
    senderId,
    receiverId,
    status: "pending"
  });

  return NextResponse.json({ message: "Request sent" }, { status: 200 });
}
