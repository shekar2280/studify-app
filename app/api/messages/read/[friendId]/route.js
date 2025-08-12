import { db } from "@/configs/db";
import { MESSAGES_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { friendId } = params;
  const currentUserId = req.headers.get("x-user-id");

  await db
    .update(MESSAGES_TABLE)
    .set({ isRead: true })
    .where(
      and(
        eq(MESSAGES_TABLE.senderId, friendId),
        eq(MESSAGES_TABLE.receiverId, currentUserId),
        eq(MESSAGES_TABLE.isRead, false)
      )
    );

  return NextResponse.json({ success: true });
}
