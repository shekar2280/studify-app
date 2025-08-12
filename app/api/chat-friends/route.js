import { db } from "@/configs/db";
import { FRIENDSHIP_TABLE, USER_TABLE, MESSAGES_TABLE } from "@/configs/schema";
import { eq, or, inArray, and, count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const friendships = await db
      .select()
      .from(FRIENDSHIP_TABLE)
      .where(
        or(
          eq(FRIENDSHIP_TABLE.user1Id, userId),
          eq(FRIENDSHIP_TABLE.user2Id, userId)
        )
      );

    const friendIds = friendships.map((f) =>
      f.user1Id === userId ? f.user2Id : f.user1Id
    );

    const friends = await db
      .select({
        id: USER_TABLE.id,
        name: USER_TABLE.name,
        email: USER_TABLE.email,
      })
      .from(USER_TABLE)
      .where(inArray(USER_TABLE.id, friendIds));

    const friendsWithUnread = await Promise.all(
      friends.map(async (friend) => {
        const [{ unreadCount }] = await db
          .select({ unreadCount: count() })
          .from(MESSAGES_TABLE)
          .where(
            and(
              eq(MESSAGES_TABLE.senderId, friend.id), 
              eq(MESSAGES_TABLE.receiverId, userId),  
              eq(MESSAGES_TABLE.isRead, false)        
            )
          );

        return { ...friend, unreadCount };
      })
    );

    return NextResponse.json(friendsWithUnread);
  } catch (err) {
    console.error("Error fetching friends:", err);
    return new Response("Failed to fetch", { status: 500 });
  }
}
