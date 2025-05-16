import { NextRequest, NextResponse } from "next/server";

type Message = {
  id: number;
  text: string;
  senderId: string;
  timestamp?: any;
};

const rooms: Record<string, Message[]> = {
  room1: [],
  room2: [],
  room3: [],
  room4: [],
  room5: [],
};

// GET: Fetch messages for a specific room
export async function GET(request: NextRequest) {
  const room = request.nextUrl.pathname.split("/").pop(); // Extract the room name from the URL

  if (!room || !(room in rooms)) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(rooms[room]);
}

// POST: Add a message to a specific room
export async function POST(request: NextRequest) {
  const room = request.nextUrl.pathname.split("/").pop();

  if (!room || !(room in rooms)) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const body = await request.json();

  if (!body.text || !body.senderId) {
    return NextResponse.json({ error: "Missing text or senderId" }, { status: 400 });
  }

  const newMessage: Message = {
    id: rooms[room].length + 1,
    text: body.text,
    senderId: body.senderId,
    timestamp: body.timestamp || Date.now(),
  };

  rooms[room].push(newMessage);
  return NextResponse.json(newMessage);
}