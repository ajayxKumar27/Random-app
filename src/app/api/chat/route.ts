import { NextRequest, NextResponse } from "next/server";

const roomMessages: Record<string, { id: number; text: string; senderId: string }[]> = {};

export async function GET(req: NextRequest, { params }: { params: { room: string } }) {
  const room = params.room;
  const messages = roomMessages[room] || [];
  return NextResponse.json(messages);
}

export async function POST(req: Request, { params }: { params: { room: string } }) {
  const room = params.room;
  const body = await req.json();

  if (!roomMessages[room]) {
    roomMessages[room] = [];
  }

  const newMessage = {
    id: Date.now(),
    text: body.text,
    senderId: body.senderId,
  };

  roomMessages[room].push(newMessage);
  return NextResponse.json(newMessage);
}
