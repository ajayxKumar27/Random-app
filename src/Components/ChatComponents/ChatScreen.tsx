import React, { useEffect, useRef, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store";

type Message = {
  id: number;
  text: string;
  senderId: string;
  name?: string;
  timestamp?: number;
};

type ChatScreenProps = {
  room: { id: string; name: string };
  setRoom: (room: { id: string; name: string } | null) => void;
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  userId: string;
  loading?: boolean;
  error?: string | null;
};

const getColorClass = (senderId: string, isMe: boolean, dark: boolean) => {
  if (isMe) return dark
    ? "bg-gradient-to-br from-blue-700 to-blue-900 text-white"
    : "bg-gradient-to-br from-blue-500 to-blue-400 text-white";

  const colors = dark
    ? [
        "bg-gradient-to-br from-pink-900 to-pink-700",
        "bg-gradient-to-br from-green-900 to-green-700",
        "bg-gradient-to-br from-yellow-900 to-yellow-700",
        "bg-gradient-to-br from-purple-900 to-purple-700",
        "bg-gradient-to-br from-orange-900 to-orange-700",
        "bg-gradient-to-br from-teal-900 to-teal-700",
        "bg-gradient-to-br from-indigo-900 to-indigo-700",
        "bg-gradient-to-br from-red-900 to-red-700",
      ]
    : [
        "bg-gradient-to-br from-pink-200 to-pink-100",
        "bg-gradient-to-br from-green-200 to-green-100",
        "bg-gradient-to-br from-yellow-200 to-yellow-100",
        "bg-gradient-to-br from-purple-200 to-purple-100",
        "bg-gradient-to-br from-orange-200 to-orange-100",
        "bg-gradient-to-br from-teal-200 to-teal-100",
        "bg-gradient-to-br from-indigo-200 to-indigo-100",
        "bg-gradient-to-br from-red-200 to-red-100",
      ];

  return `${colors[senderId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length]} ${dark ? "text-gray-100" : "text-gray-800"}`;
};

const formatTimeAgo = (timestamp?: number): string => {
  if (!timestamp) return "";
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

const ChatScreen: React.FC<ChatScreenProps> = ({
  room,
  setRoom,
  messages,
  inputValue,
  setInputValue,
  handleKeyDown,
  sendMessage,
  userId,
  loading = false,
  error = null,
}) => {
  const dark = useSelector((state: RootState) => state.theme.dark);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [visibleTimeId, setVisibleTimeId] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (visibleTimeId !== null) {
      const timer = setTimeout(() => setVisibleTimeId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleTimeId]);

  return (
    <div className={`h-[calc(100vh-64px)] w-screen flex items-center justify-center p-0 sm:p-4 transition-colors duration-300 ${
      dark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
        : "bg-gradient-to-br from-blue-100 via-white to-blue-200"
    }`}>
      <div className={`w-full max-w-md shadow-2xl rounded-3xl flex flex-col h-full sm:h-[80vh] border backdrop-blur-md ${
        dark
          ? "bg-gray-900/90 border-gray-800"
          : "bg-white/80 border-blue-200"
      }`}>
        {/* Header */}
        <header className={`text-lg font-bold p-4 flex items-center justify-between shadow sm:rounded-t-3xl rounded-none transition-colors duration-300 ${
          dark
            ? "bg-gradient-to-r from-blue-900 to-purple-900 text-purple-100"
            : "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
        }`}>
          <div className="flex items-center gap-2">
            <IoChatbubblesOutline className="text-2xl" />
            <span className="font-light">{room?.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setRoom(null)}
            title="Leave Room"
            className="transition duration-200 cursor-pointer"
            aria-label="Leave room"
          >
            <RxExit className={`text-xl ${dark ? "text-purple-100" : "text-white"}`} />
          </button>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-transparent">
          {error && (
            <div className="text-center text-red-500 text-sm">{error}</div>
          )}
          {messages.map((message) => {
            const isMe = message.senderId === userId;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} w-full relative ${visibleTimeId === message.id ? "mb-12" : ""}`}
                onClick={() => setVisibleTimeId(message.id)}
                title="Click to show time"
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-md max-w-[80%] break-words ${getColorClass(
                    message.senderId,
                    isMe,
                    dark
                  )} ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {message.text}
                </div>
                {visibleTimeId === message.id && (
                  <span
                    className={`absolute ${isMe ? "right-0" : "left-0"
                      } -bottom-11 text-xs ${dark ? "text-gray-200 bg-gray-900/90" : "text-gray-600 bg-white/90"} px-2 py-1 rounded shadow`}
                  >
                    <div> {isMe ? "You" : message.name || "Anonymous"}</div>
                    <div> {formatTimeAgo(message.timestamp)} </div>
                  </span>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <footer className={`p-4 border-t flex items-center gap-2 transition-colors duration-300 ${
          dark
            ? "border-gray-800 bg-gray-900/80 sm:rounded-b-3xl rounded-none"
            : "border-gray-200 bg-white/70 sm:rounded-b-3xl rounded-none"
        }`}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 shadow-sm transition-colors duration-300 ${
              dark
                ? "bg-gray-900 border-gray-800 text-gray-100 focus:ring-purple-700"
                : "bg-white border border-blue-200 text-gray-900 focus:ring-blue-400"
            }`}
            aria-label="Message input"
          />
          <button
            onClick={sendMessage}
            className={`px-6 py-2 rounded-full font-semibold shadow transition focus:outline-none focus:ring-2 ${
              dark
                ? "bg-gradient-to-r from-blue-900 to-purple-900 text-white hover:from-purple-900 hover:to-blue-900 focus:ring-purple-700"
                : "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500 focus:ring-blue-300"
            }`}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatScreen;