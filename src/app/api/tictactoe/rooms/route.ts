import { NextRequest, NextResponse } from "next/server";
import { rooms } from "@/lib/tictactoeRooms";

export async function GET(request: NextRequest) {
  try {
    const roomsList = Object.values(rooms).map((room) => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.length,
      isFull: room.isFull,
      players: room.players,
      wins: room.gameState.wins,
    }));

    return NextResponse.json(roomsList);
  } catch (error) {
    console.error("Get rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
