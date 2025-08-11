import { db } from "@/configs/db";
import { FRIEND_REQUEST_TABLE, USER_TABLE } from "@/configs/schema";
import { eq, and, or } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const requests = await db
      .select({
        id: FRIEND_REQUEST_TABLE.id,
        senderId: FRIEND_REQUEST_TABLE.senderId,
        senderName: USER_TABLE.name,
        senderEmail: USER_TABLE.email,
        receiverId: FRIEND_REQUEST_TABLE.receiverId,
        status: FRIEND_REQUEST_TABLE.status,
        createdAt: FRIEND_REQUEST_TABLE.createdAt,
      })
      .from(FRIEND_REQUEST_TABLE)
      .leftJoin(USER_TABLE, eq(USER_TABLE.id, FRIEND_REQUEST_TABLE.senderId))
      .where(
        and(
          eq(FRIEND_REQUEST_TABLE.status, "pending"),
          or(
            eq(FRIEND_REQUEST_TABLE.receiverId, userId),
            eq(FRIEND_REQUEST_TABLE.senderId, userId)
          )
        )
      );

    return Response.json(requests);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    return new Response("Failed to fetch", { status: 500 });
  }
}
