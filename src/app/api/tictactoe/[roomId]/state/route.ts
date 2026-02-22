import { NextRequest, NextResponse } from "next/server";
import { rooms, getWinner } from "@/lib/tictactoeRooms";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    if (!roomId || !(roomId in rooms)) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = rooms[roomId];

    return NextResponse.json(
      {
        id: room.id,
        name: room.name,
        players: room.players,
        playerNames: room.playerNames,
        isFull: room.isFull,
        gameState: room.gameState,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get game state error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game state" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { playerId, index, action } = body;

    if (!roomId || !(roomId in rooms)) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = rooms[roomId];

    if (action === "makeMove") {
      if (index === undefined || !playerId) {
        return NextResponse.json(
          { error: "Missing index or playerId" },
          { status: 400 }
        );
      }

      const gameState = room.gameState;
      const currentPlayerSymbol = gameState.xIsNext ? "X" : "O";

      // Verify it's the current player's turn
      const currentPlayerIndex = gameState.xIsNext ? 0 : 1;
      if (room.players[currentPlayerIndex] !== playerId) {
        return NextResponse.json(
          { error: "Not your turn" },
          { status: 400 }
        );
      }

      // Check if cell is empty
      if (gameState.squares[index] !== null) {
        return NextResponse.json(
          { error: "Cell already occupied" },
          { status: 400 }
        );
      }

      // Make the move
      gameState.squares[index] = currentPlayerSymbol;

      // Check for winner
      const result = getWinner(gameState.squares);
      if (result.winner && result.winner !== "draw") {
        gameState.winner = result.winner;
        gameState.winningCombo = result.winningCombo;
        gameState.wins[playerId] = (gameState.wins[playerId] || 0) + 1;
      } else if (result.winner === "draw") {
        gameState.winner = "draw";
        gameState.winningCombo = null;
      }

      // Switch turn
      if (!gameState.winner) {
        gameState.xIsNext = !gameState.xIsNext;
      }

      return NextResponse.json(
        {
          success: true,
          gameState: gameState,
        },
        { status: 200 }
      );
    } else if (action === "resetGame") {
      if (!playerId) {
        return NextResponse.json(
          { error: "Missing playerId" },
          { status: 400 }
        );
      }

      // Reset game state but maintain wins
      const wins = room.gameState.wins;
      room.gameState = {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
        winningCombo: null,
        wins: wins,
      };

      return NextResponse.json(
        {
          success: true,
          gameState: room.gameState,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Unknown action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Game action error:", error);
    return NextResponse.json(
      { error: "Failed to process game action" },
      { status: 500 }
    );
  }
}
