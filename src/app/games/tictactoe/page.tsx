'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

type GameRoom = {
  id: string;
  name: string;
  players: string[];
  playerCount: number;
  isFull: boolean;
  wins: { [playerId: string]: number };
};

type GameState = {
  squares: (string | null)[];
  xIsNext: boolean;
  winner: string | null;
  winningCombo: number[] | null;
  wins: { [playerId: string]: number };
};

const TicTacToe: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<'nameEntry' | 'roomSelection' | 'gaming'>('nameEntry');
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef(false);
  const lastGameStateRef = useRef<string>('');
  const lastFetchTimeRef = useRef<number>(0);

  // Initialize player ID and name from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem('userId') ?? uuidv4();
    setPlayerId(storedId);
    localStorage.setItem('userId', storedId);

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setPlayerName(storedName);
      setGamePhase('roomSelection');
      setIsLoading(false);
    } else {
      setGamePhase('nameEntry');
      setIsLoading(false);
    }
  }, []);

  // Fetch available rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('/api/tictactoe/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch rooms');
    }
  }, []);

  useEffect(() => {
    if (gamePhase === 'roomSelection') {
      fetchRooms();
    }
  }, [gamePhase, fetchRooms]);

  // Fetch game state periodically
  const fetchGameState = useCallback(async (roomId: string) => {
    try {
      // Skip if there's a pending move or if last fetch was too recent (debounce)
      const now = Date.now();
      if (pendingUpdateRef.current || (now - lastFetchTimeRef.current) < 300) {
        return;
      }
      lastFetchTimeRef.current = now;

      const response = await fetch(`/api/tictactoe/${roomId}/state`);
      if (!response.ok) throw new Error('Failed to fetch game state');
      const roomData = await response.json();
      
      // Only update if there's no pending move (optimistic update in progress)
      if (!pendingUpdateRef.current) {
        // Serialize current game state to check if anything actually changed
        const gameStateHash = JSON.stringify(roomData.gameState);
        
        // Skip update if game state hasn't changed (prevents flickering)
        if (gameStateHash === lastGameStateRef.current) {
          return;
        }
        
        lastGameStateRef.current = gameStateHash;
        
        // BATCH ALL STATE UPDATES - single render cycle
        setCurrentRoom({
          id: roomData.id,
          name: roomData.name,
          players: roomData.players,
          playerCount: roomData.players.length,
          isFull: roomData.isFull,
          wins: roomData.gameState.wins,
        });
        
        setGameState(roomData.gameState);
        
        if (roomData.playerNames) {
          setPlayerNames(roomData.playerNames);
        }
      }
    } catch (err) {
      console.error('Error fetching game state:', err);
    }
  }, []);

  useEffect(() => {
    if (gamePhase === 'gaming' && currentRoom) {
      fetchGameState(currentRoom.id);
      // Polling every 300ms is safer than 500ms on deployed networks
      const interval = setInterval(() => fetchGameState(currentRoom.id), 300);
      pollIntervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [gamePhase, currentRoom, fetchGameState]);

  const handleSubmitName = () => {
    const trimmedName = tempName.trim();
    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }

    setPlayerName(trimmedName);
    localStorage.setItem('userName', trimmedName);
    setGamePhase('roomSelection');
    setError(null);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!playerId || !playerName) {
      setError('Player name not found');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/tictactoe/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          playerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to join room');
        setIsLoading(false);
        return;
      }

      setCurrentRoom({
        id: data.room.id,
        name: data.room.name,
        players: data.room.players,
        playerCount: data.room.players.length,
        isFull: data.room.isFull,
        wins: data.room.gameState.wins,
      });

      setGameState(data.room.gameState);
      lastGameStateRef.current = JSON.stringify(data.room.gameState);
      
      // Store all player names including opponent
      if (data.room.playerNames) {
        setPlayerNames(data.room.playerNames);
      }
      setGamePhase('gaming');
      setError(null);
      
      // Immediately fetch fresh state after joining to ensure we have latest data
      setTimeout(() => {
        fetchGameState(data.room.id);
      }, 100);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeMove = async (index: number) => {
    if (!currentRoom || !gameState || !playerId) return;

    // Check if it's the player's turn
    const currentPlayerIndex = gameState.xIsNext ? 0 : 1;
    if (currentRoom.players[currentPlayerIndex] !== playerId) {
      setError("It's not your turn!");
      return;
    }

    if (gameState.squares[index] !== null || gameState.winner) return;

    // Set pending flag to prevent polling from overwriting optimistic update
    pendingUpdateRef.current = true;
    lastGameStateRef.current = ''; // Clear hash to force next poll update

    // OPTIMISTIC UPDATE - Update UI immediately
    const newSquares = [...gameState.squares];
    const currentPlayerSymbol = gameState.xIsNext ? "X" : "O";
    newSquares[index] = currentPlayerSymbol;

    const optimisticGameState = {
      ...gameState,
      squares: newSquares,
      xIsNext: !gameState.xIsNext,
    };

    setGameState(optimisticGameState);
    setError(null);

    // Then make API call
    try {
      const response = await fetch(`/api/tictactoe/${currentRoom.id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          index,
          action: 'makeMove',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        lastGameStateRef.current = JSON.stringify(data.gameState);
        setGameState(data.gameState);
      } else {
        setError(data.error || 'Failed to make move');
        // Revert to previous state on error
        setGameState(gameState);
        lastGameStateRef.current = '';
      }
    } catch (err) {
      console.error('Error making move:', err);
      setError('Failed to make move');
      // Revert to previous state on error
      setGameState(gameState);
      lastGameStateRef.current = '';
    } finally {
      // Clear pending flag after a small delay to ensure polling doesn't interfere
      setTimeout(() => {
        pendingUpdateRef.current = false;
      }, 50);
    }
  };

  const handleResetGame = async () => {
    if (!currentRoom || !playerId || !gameState) return;

    // Set pending flag to prevent polling from overwriting optimistic update
    pendingUpdateRef.current = true;
    lastGameStateRef.current = ''; // Clear hash to force next poll update

    // OPTIMISTIC UPDATE - Reset board immediately
    const optimisticGameState = {
      ...gameState,
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      winningCombo: null,
    };

    setGameState(optimisticGameState);

    // Then make API call
    try {
      const response = await fetch(`/api/tictactoe/${currentRoom.id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          action: 'resetGame',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        lastGameStateRef.current = JSON.stringify(data.gameState);
        setGameState(data.gameState);
      } else {
        // Revert on error
        setGameState(gameState);
        lastGameStateRef.current = '';
      }
    } catch (err) {
      console.error('Error resetting game:', err);
      // Revert on error
      setGameState(gameState);
      lastGameStateRef.current = '';
    } finally {
      // Clear pending flag after a small delay to ensure polling doesn't interfere
      setTimeout(() => {
        pendingUpdateRef.current = false;
      }, 50);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom || !playerId) return;

    try {
      setIsLoading(true);
      await fetch(`/api/tictactoe/${currentRoom.id}/join`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });

      setCurrentRoom(null);
      setGameState(null);
      lastGameStateRef.current = ''; // Clear state hash
      setGamePhase('roomSelection');
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      await fetchRooms();
    } catch (err) {
      console.error('Error leaving room:', err);
      setError('Failed to leave room');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-white text-xl mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 md:p-8">
      {gamePhase === 'nameEntry' ? (
        <NameEntryScreen
          tempName={tempName}
          setTempName={setTempName}
          onSubmitName={handleSubmitName}
          error={error}
          isLoading={isLoading}
        />
      ) : gamePhase === 'roomSelection' ? (
        <RoomSelectionScreen
          rooms={rooms}
          playerName={playerName}
          onJoinRoom={handleJoinRoom}
          onChangeName={() => {
            setPlayerName('');
            localStorage.removeItem('userName');
            setGamePhase('nameEntry');
          }}
          error={error}
          isLoading={isLoading}
        />
      ) : (
        <GameScreen
          currentRoom={currentRoom}
          gameState={gameState}
          playerId={playerId}
          playerName={playerName}
          playerNames={playerNames}
          onMakeMove={handleMakeMove}
          onResetGame={handleResetGame}
          onLeaveRoom={handleLeaveRoom}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};

const NameEntryScreen: React.FC<{
  tempName: string;
  setTempName: (name: string) => void;
  onSubmitName: () => void;
  error: string | null;
  isLoading: boolean;
}> = ({ tempName, setTempName, onSubmitName, error, isLoading }) => (
  <div className="max-w-md mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-2xl p-8">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">Tic Tac Toe</h1>
      <p className="text-purple-300 text-center mb-6">Multiplayer</p>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-semibold mb-3">
          Enter Your Name
        </label>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmitName()}
          placeholder="Your name..."
          maxLength={20}
          className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-300/20 transition"
          autoFocus
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onSubmitName}
        disabled={!tempName.trim() || isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Continue to Rooms'}
      </button>

      <p className="text-gray-400 text-xs text-center mt-6">
        This name will be used throughout the game. You can change it later from the room selection screen.
      </p>
    </div>
  </div>
);

const RoomSelectionScreen: React.FC<{
  rooms: GameRoom[];
  playerName: string;
  onJoinRoom: (roomId: string) => void;
  onChangeName: () => void;
  error: string | null;
  isLoading: boolean;
}> = ({ rooms, playerName, onJoinRoom, onChangeName, error, isLoading }) => (
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Tic Tac Toe Multiplayer</h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="text-xl text-purple-200">Welcome, <span className="font-semibold text-purple-300">{playerName}</span>!</p>
        <button
          onClick={onChangeName}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition"
        >
          Change Name
        </button>
      </div>
      <p className="text-gray-300 mt-2">Select a room to start playing</p>
    </div>

    {error && (
      <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
        {error}
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
            room.isFull
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:shadow-2xl hover:scale-105 cursor-pointer'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-0 hover:opacity-10 transition-opacity" />
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3">{room.name}</h3>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Players: <span className="text-purple-300 font-semibold">{room.playerCount}/2</span></p>
              {room.playerCount > 0 && (
                <div className="space-y-1">
                  {room.players.slice(0, 2).map((_, idx) => (
                    <div key={idx} className="text-xs text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Player {idx + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto">
              {room.isFull ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-600 text-gray-300 rounded-lg font-semibold cursor-not-allowed"
                >
                  Room Full
                </button>
              ) : (
                <button
                  onClick={() => onJoinRoom(room.id)}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Joining...' : 'Join Room'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GameScreen: React.FC<{
  currentRoom: GameRoom | null;
  gameState: GameState | null;
  playerId: string;
  playerName: string;
  playerNames: { [key: string]: string };
  onMakeMove: (index: number) => void;
  onResetGame: () => void;
  onLeaveRoom: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}> = ({
  currentRoom,
  gameState,
  playerId,
  playerName,
  playerNames,
  onMakeMove,
  onResetGame,
  onLeaveRoom,
  error,
  setError,
}) => {
  const getPlayerName = (id: string) => playerNames[id] || 'Player';
  const currentPlayerIndex = gameState?.xIsNext ? 0 : 1;
  const isMyTurn = currentRoom && currentRoom.players[currentPlayerIndex] === playerId;
  const isWaiting = currentRoom && currentRoom.players.length < 2;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">{currentRoom?.name}</h2>
          <p className="text-purple-300">Room ID: {currentRoom?.id}</p>
        </div>
        <button
          onClick={onLeaveRoom}
          className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Leave Room
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-2xl p-6">
            {/* Player Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentRoom?.players.map((player, idx) => (
                <div
                  key={player}
                  className={`p-4 rounded-lg transition-all ${
                    idx === currentPlayerIndex
                      ? isMyTurn
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 ring-2 ring-green-300'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                      : 'bg-slate-700'
                  }`}
                >
                  <p className="text-xs text-gray-200 uppercase tracking-wide">Player {idx + 1}</p>
                  <p className="text-lg font-bold text-white">{getPlayerName(player)}</p>
                  <p className="text-sm text-gray-100 mt-1">({idx === 0 ? 'X' : 'O'})</p>
                  <p className="text-xl font-bold text-white mt-2">Wins: {gameState?.wins[player] || 0}</p>
                </div>
              ))}
              {currentRoom && currentRoom.players.length < 2 && (
                <div className="p-4 rounded-lg bg-slate-700 flex items-center justify-center">
                  <p className="text-white text-center font-semibold">Waiting for Player 2...</p>
                </div>
              )}
            </div>

            {/* Game Status */}
            {!isWaiting && gameState && (
              <div className={`p-4 rounded-lg mb-6 text-center font-bold text-xl ${
                gameState.winner
                  ? gameState.winner === 'draw'
                    ? 'bg-blue-500/30 text-blue-200'
                    : 'bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-200 ring-2 ring-green-400'
                  : 'bg-purple-500/30 text-purple-200'
              }`}>
                {gameState.winner
                  ? gameState.winner === 'draw'
                    ? "🤝 It's a Draw!"
                    : (() => {
                        const winnerPlayerIndex = gameState.winner === 'X' ? 0 : 1;
                        const winnerId = currentRoom?.players[winnerPlayerIndex];
                        const isCurrentPlayerWinner = winnerId === playerId;
                        return isCurrentPlayerWinner 
                          ? "🎉 You Won! 🎉" 
                          : `🎉 ${getPlayerName(winnerId || '')} Won! 🎉`;
                      })()
                  : isMyTurn
                  ? "⭐ Your Turn!"
                  : `${getPlayerName(currentRoom?.players[currentPlayerIndex] || '')}'s Turn`}
              </div>
            )}

            {/* Game Board */}
            {!isWaiting && gameState && (
              <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-700 p-4 rounded-xl">
                {gameState.squares.map((value, idx) => {
                  const isWinningCell = gameState.winningCombo?.includes(idx);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onMakeMove(idx);
                        setError(null);
                      }}
                      disabled={!isMyTurn || gameState.winner !== null || gameState.squares[idx] !== null}
                      className={`aspect-square text-4xl font-bold rounded-lg transition-all font-bold text-2xl sm:text-3xl md:text-4xl
                        ${
                          isWinningCell
                            ? gameState.squares[idx] === 'X'
                              ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white ring-4 ring-yellow-300 shadow-lg shadow-yellow-300'
                              : 'bg-gradient-to-br from-red-400 to-red-500 text-white ring-4 ring-yellow-300 shadow-lg shadow-yellow-300'
                            : gameState.squares[idx] === 'X'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : gameState.squares[idx] === 'O'
                            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                            : isMyTurn
                            ? 'bg-slate-600 hover:bg-purple-500 text-gray-300 hover:text-white cursor-pointer'
                            : 'bg-slate-600 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {gameState.squares[idx]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            {!isWaiting && gameState && (
              <div className="flex gap-3">
                <button
                  onClick={onResetGame}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition"
                >
                  New Round
                </button>
              </div>
            )}

            {isWaiting && (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse">
                  <p className="text-white text-xl font-semibold">Waiting for another player...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Info</h3>
            
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm">Your Username</p>
              <p className="text-white font-bold text-lg">{playerName}</p>
            </div>

            {gameState && (
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm mb-3">Your Wins</p>
                <p className="text-4xl font-bold text-green-400">{gameState.wins[playerId] || 0}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;