export type GameRoom = {
  id: string;
  name: string;
  players: string[];
  playerNames: { [playerId: string]: string };
  isFull: boolean;
  gameState: {
    squares: (string | null)[];
    xIsNext: boolean;
    winner: string | null;
    winningCombo: number[] | null;
    wins: { [playerId: string]: number };
  };
};

// In-memory storage for rooms
export const rooms: Record<string, GameRoom> = (() => {
  const initialRooms: Record<string, GameRoom> = {};
  const roomNames = [
    "Thunder Arena",
    "Crystal Palace",
    "Phoenix Nest",
    "Dragon's Lair",
    "Shadow Realm",
    "Celestial Peak",
    "Inferno Zone",
    "Frost Cavern",
  ];

  for (let i = 0; i < 8; i++) {
    initialRooms[`room${i + 1}`] = {
      id: `room${i + 1}`,
      name: roomNames[i],
      players: [],
      playerNames: {},
      isFull: false,
      gameState: {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
        winningCombo: null,
        wins: {},
      },
    };
  }

  return initialRooms;
})();

export const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(squares: (string | null)[]): { winner: string | null; winningCombo: number[] | null } {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], winningCombo: combo };
    }
  }
  if (squares.every((sq) => sq !== null)) {
    return { winner: "draw", winningCombo: null };
  }
  return { winner: null, winningCombo: null };
}
