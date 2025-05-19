'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatScreen from "./ChatScreen";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store";

type Message = {
  id: number;
  text: string;
  senderId: string;
  timestamp: number;
};

const ROOMS = [
  { id: "room1", name: "Cozy Corner" },
  { id: "room2", name: "Cyber Dome" },
  { id: "room3", name: "Quiet Nook" },
  { id: "room4", name: "Fusion Deck" },
  { id: "room5", name: "Nova Lounge" },
];

const ChatComponent: React.FC = () => {
  const [room, setRoom] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameSubmitted, setNameSubmitted] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string>("");

  // Get dark mode from redux
  const dark = useSelector((state: RootState) => state.theme.dark);

  // Initialize user ID and name from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userId") ?? uuidv4();
    userIdRef.current = storedId;
    localStorage.setItem("userId", storedId);

    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
      setNameSubmitted(true);
    }
  }, []);

  // Fetch messages for selected room
  useEffect(() => {
    if (!room) return;

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const response = await fetch(`/api/chat/${room.id}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [room]);

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || !room) return;

    // Always get the latest name from localStorage
    const userName = localStorage.getItem("userName") || name;

    const messagePayload = {
      text,
      senderId: userIdRef.current,
      name: userName,
      timestamp: Date.now(),
    };

    try {
      const response = await fetch(`/api/chat/${room.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    }
  }, [inputValue, room, name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") sendMessage();
    },
    [sendMessage]
  );

  const handleNameSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("userName", trimmed);
    setName(trimmed);
    setNameSubmitted(true);
  };

  if (!nameSubmitted) {
    return (
      <div className={`h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br ${
        dark
          ? "from-gray-900 via-gray-800 to-gray-950"
          : "from-blue-200 via-white to-purple-200"
      }`}>
        <div className={`p-8 rounded-3xl shadow-2xl w-full max-w-sm border backdrop-blur-md flex flex-col items-center ${
          dark
            ? "bg-gray-900/90 border-gray-800"
            : "bg-white/80 border-blue-200"
        }`}>
          <div className="mb-4 text-center">
            <div className={`rounded-full mb-2 shadow-lg w-6/12 h-20 flex items-center justify-center m-auto text-center ${
              dark
                ? "bg-gradient-to-br from-blue-900 to-purple-900"
                : "bg-gradient-to-br from-blue-400 to-purple-400"
            }`}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path fill="#fff" d="M12 12c2.7 0 8 1.34 8 4v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-extrabold mb-1 tracking-wide ${
              dark ? "text-purple-100" : "text-blue-700"
            }`}>Welcome!</h2>
            <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Enter your name to continue</p>
          </div>
          <input
            type="text"
            className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 shadow-sm text-lg transition ${
              dark
                ? "bg-gray-900 border-gray-800 text-gray-100 focus:ring-purple-700"
                : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"
            }`}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
          />
          <button
            onClick={handleNameSubmit}
            className={`mt-6 w-full px-4 py-3 rounded-xl font-bold shadow-lg transition duration-200 text-lg tracking-wide ${
              dark
                ? "bg-gradient-to-r from-blue-900 to-purple-900 text-white hover:from-purple-900 hover:to-blue-900"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={`h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        dark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
          : "bg-gradient-to-br from-blue-100 via-white to-purple-200"
      }`}>
        <div className={`w-full max-w-md shadow-lg rounded-xl p-6 ${
          dark
            ? "bg-gray-900/90 border border-gray-800"
            : "bg-white border border-blue-200"
        }`}>
          <h1 className={`text-2xl font-bold text-center mb-4 ${
            dark ? "text-purple-100" : "text-blue-700"
          }`}>Select a Room</h1>
          <div className="grid grid-cols-2 gap-4">
            {ROOMS.map((roomItem) => (
              <button
                key={roomItem.id}
                onClick={() => setRoom(roomItem)}
                className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer shadow-lg font-semibold ${
                  dark
                    ? "bg-gradient-to-r from-blue-900 to-purple-900 text-white hover:from-purple-900 hover:to-blue-900"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {roomItem.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatScreen
      room={room}
      setRoom={setRoom}
      messages={messages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleKeyDown={handleKeyDown}
      sendMessage={sendMessage}
      userId={userIdRef.current}
      loading={isLoadingMessages}
      error={error}
    />
  );
};

export default ChatComponent;