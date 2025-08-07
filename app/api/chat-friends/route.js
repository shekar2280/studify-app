import { db } from "@/configs/db";
import { FRIENDSHIP_TABLE, USER_TABLE } from "@/configs/schema";
import { eq, or, inArray } from "drizzle-orm";
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

    return NextResponse.json(friends);
  } catch (err) {
    console.error("Error fetching friends:", err);
    return new Response("Failed to fetch", { status: 500 });
  }
}
