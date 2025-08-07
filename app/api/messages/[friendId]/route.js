import { db } from "@/configs/db";
import { MESSAGES_TABLE } from "@/configs/schema";
import { eq, or, and, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { params } = await context;
  const currentUserId = req.headers.get("x-user-id");

  const friendId = params.friendId;

  const messages = await db
    .select()
    .from(MESSAGES_TABLE)
    .where(
      and(
        or(
          and(
            eq(MESSAGES_TABLE.senderId, currentUserId),
            eq(MESSAGES_TABLE.receiverId, friendId)
          ),
          and(
            eq(MESSAGES_TABLE.senderId, friendId),
            eq(MESSAGES_TABLE.receiverId, currentUserId)
          )
        )
      )
    )
    .orderBy(asc(MESSAGES_TABLE.createdAt));

  return NextResponse.json(messages);
}
