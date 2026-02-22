import { NextRequest, NextResponse } from "next/server";
import { rooms } from "@/lib/tictactoeRooms";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { playerId, playerName } = body;

    if (!roomId || !(roomId in rooms)) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (!playerId || !playerName) {
      return NextResponse.json(
        { error: "Missing playerId or playerName" },
        { status: 400 }
      );
    }

    const room = rooms[roomId];

    // Check if player is already in the room
    if (room.players.includes(playerId)) {
      return NextResponse.json(
        {
          success: true,
          message: "Already in room",
          room: {
            id: room.id,
            name: room.name,
            players: room.players,
            playerNames: room.playerNames,
            gameState: room.gameState,
          },
        },
        { status: 200 }
      );
    }

    // Check if room is full
    if (room.players.length >= 2) {
      return NextResponse.json(
        { error: "Room is full" },
        { status: 400 }
      );
    }

    // Add player to room
    room.players.push(playerId);
    room.playerNames[playerId] = playerName;
    room.isFull = room.players.length >= 2;

    // Initialize wins for new player if not exists
    if (!room.gameState.wins[playerId]) {
      room.gameState.wins[playerId] = 0;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Joined room successfully",
        room: {
          id: room.id,
          name: room.name,
          players: room.players,
          playerNames: room.playerNames,
          isFull: room.isFull,
          gameState: room.gameState,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { playerId } = body;

    if (!roomId || !(roomId in rooms)) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (!playerId) {
      return NextResponse.json(
        { error: "Missing playerId" },
        { status: 400 }
      );
    }

    const room = rooms[roomId];

    // Remove player from room
    room.players = room.players.filter((id: string) => id !== playerId);
    delete room.playerNames[playerId];
    room.isFull = false;

    // Reset game if room is empty
    if (room.players.length === 0) {
      room.playerNames = {};
      room.gameState = {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
        winningCombo: null,
        wins: {},
      };
    } else if (room.players.length === 1) {
      // If one player remains, reset the game state but keep their wins
      const remainingPlayer = room.players[0];
      const remainingPlayerName = room.playerNames[remainingPlayer];
      const wins = room.gameState.wins[remainingPlayer] || 0;
      room.playerNames = { [remainingPlayer]: remainingPlayerName };
      room.gameState = {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
        winningCombo: null,
        wins: { [remainingPlayer]: wins },
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: "Left room successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Failed to leave room" },
      { status: 500 }
    );
  }
}
