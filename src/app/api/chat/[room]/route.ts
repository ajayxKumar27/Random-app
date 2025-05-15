import { NextRequest, NextResponse } from "next/server";

type Message = {
  id: number;
  text: string;
  sender: string;
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

  if (!room || !rooms[room]) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(rooms[room]);
}

// POST: Add a message to a specific room
export async function POST(request: NextRequest) {
  const room = request.nextUrl.pathname.split("/").pop(); // Extract the room name from the URL

  if (!room || !rooms[room]) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const body = await request.json();
  const newMessage = { id: rooms[room].length + 1, ...body };
  rooms[room].push(newMessage);
  return NextResponse.json(newMessage);
}