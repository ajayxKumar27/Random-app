import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: Server;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    let gameState = Array(9).fill(null);
    let xIsNext = true;

    io.on("connection", (socket) => {
      socket.emit("update", { squares: gameState, xIsNext });

      socket.on("move", (data) => {
        const { index } = data;
        if (!gameState[index]) {
          gameState[index] = xIsNext ? "X" : "O";
          xIsNext = !xIsNext;
          io.emit("update", { squares: gameState, xIsNext });
        }
      });

      socket.on("reset", () => {
        gameState = Array(9).fill(null);
        xIsNext = true;
        io.emit("update", { squares: gameState, xIsNext });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}