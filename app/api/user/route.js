import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

function getDateOnly(d) {
  return d.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.id, userId));

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    const todayDate = getDateOnly(new Date());
    const lastLoginDate = user.lastLogin; 

    let newStreak = user.streak || 1;

    if (lastLoginDate) {
      const diffInDays =
        (new Date(todayDate).getTime() - new Date(lastLoginDate).getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffInDays === 0) {
        newStreak = user.streak;
      } else if (diffInDays === 1) {
        newStreak = user.streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await db
      .update(USER_TABLE)
      .set({
        streak: newStreak,
        lastLogin: todayDate,
      })
      .where(eq(USER_TABLE.id, userId));

    return NextResponse.json({
      ...user,
      streak: newStreak,
      lastLogin: todayDate,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
