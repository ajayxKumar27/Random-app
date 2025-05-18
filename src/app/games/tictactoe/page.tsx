'use client';
import React, { useState } from "react";

type Player = "X" | "O" | null;

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getWinner = (squares: Player[]): Player | "draw" | null => {
  for (const [a, b, c] of WIN_COMBOS) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(Boolean)) return "draw";
  return null;
};

const Square: React.FC<{
  value: Player;
  onClick: () => void;
  highlight: boolean;
}> = ({ value, onClick, highlight }) => (
  <button
    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-3xl sm:text-4xl md:text-5xl font-bold rounded-xl border-2 border-blue-400 flex items-center justify-center transition-all duration-200
      ${highlight ? "bg-gradient-to-br from-blue-400 to-purple-400 text-white shadow-lg scale-105" : "bg-white hover:bg-blue-100"}
      `}
    onClick={onClick}
    disabled={!!value}
    aria-label={value ? `Cell ${value}` : "Empty cell"}
  >
    {value}
  </button>
);

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = getWinner(squares);

  const handleClick = (i: number) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Highlight winning cells
  let highlight: number[] = [];
  if (winner && winner !== "draw") {
    for (const [a, b, c] of WIN_COMBOS) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        highlight = [a, b, c];
        break;
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white p-3">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-6 drop-shadow-lg tracking-tight select-none">
        Tic Tac Toe
      </h1>
      <div className="bg-white/80 rounded-3xl shadow-2xl p-4 sm:p-8 flex flex-col items-center w-full max-w-xs sm:max-w-md">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {squares.map((val, i) => (
            <Square
              key={i}
              value={val}
              onClick={() => handleClick(i)}
              highlight={highlight.includes(i)}
            />
          ))}
        </div>
        <div className="mb-4 text-lg sm:text-xl font-semibold text-gray-700 min-h-[2.5rem]">
          {winner === "draw"
            ? "It's a Draw!"
            : winner
            ? `Winner: ${winner}`
            : `Next: ${xIsNext ? "X" : "O"}`}
        </div>
        <button
          onClick={handleReset}
          className="mt-2 px-6 py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-md hover:brightness-110 transition"
        >
          Reset Game
        </button>
      </div>
      <p className="mt-6 text-gray-500 text-center text-sm select-none">
        Play with a friend! Tap a cell to make your move.
      </p>
    </div>
  );
};

export default TicTacToe;