import { db } from "@/configs/db";
import { FRIEND_REQUEST_TABLE, FRIENDSHIP_TABLE } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req) {
  const { senderId, receiverId } = await req.json();

  if (!senderId || !receiverId) {
    return new Response(JSON.stringify({ error: "Missing sender or receiver" }), { status: 400 });
  }

  await db
    .update(FRIEND_REQUEST_TABLE)
    .set({ status: "accepted" })
    .where(
      and(
        eq(FRIEND_REQUEST_TABLE.senderId, senderId),
        eq(FRIEND_REQUEST_TABLE.receiverId, receiverId)
      )
    );

  await db.insert(FRIENDSHIP_TABLE).values({
    user1Id: senderId,
    user2Id: receiverId,
  });

  return new Response(JSON.stringify({ message: "Friend request accepted" }), { status: 200 });
}
