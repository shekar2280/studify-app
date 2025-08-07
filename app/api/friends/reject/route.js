import { db } from "@/lib/db";
import { FRIEND_REQUEST_TABLE } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req) {
  const { senderId, receiverId } = await req.json();

  if (!senderId || !receiverId) {
    return new Response(JSON.stringify({ error: "Missing sender or receiver" }), { status: 400 });
  }

  await db
    .update(FRIEND_REQUEST_TABLE)
    .set({ status: "rejected" })
    .where(
      and(
        eq(FRIEND_REQUEST_TABLE.senderId, senderId),
        eq(FRIEND_REQUEST_TABLE.receiverId, receiverId)
      )
    );

  return new Response(JSON.stringify({ message: "Friend request rejected" }), { status: 200 });
}
