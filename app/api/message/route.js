import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  try {
    await inngest.send({
      name: "message.send",
      data: {
        senderId: body.senderId,
        receiverId: body.receiverId,
        message: body.text,
        createdAt: body.createdAt,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inngest trigger failed", error);
    return NextResponse.json({ error: "Failed to trigger Inngest" }, { status: 500 });
  }
}
