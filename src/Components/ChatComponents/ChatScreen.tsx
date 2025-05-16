import React, { useEffect, useRef } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";

type Message = {
  id: number;
  text: string;
  senderId: string;
};

type ChatScreenProps = {
  room: string;
  setRoom: (room: string | null) => void;
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  userId: string;
};

const getColorClass = (senderId: string, isMe: boolean) => {
  if (isMe) return "bg-gradient-to-br from-blue-500 to-blue-400 text-white";
  const colors = [
    "bg-gradient-to-br from-pink-200 to-pink-100",
    "bg-gradient-to-br from-green-200 to-green-100",
    "bg-gradient-to-br from-yellow-200 to-yellow-100",
    "bg-gradient-to-br from-purple-200 to-purple-100",
    "bg-gradient-to-br from-orange-200 to-orange-100",
    "bg-gradient-to-br from-teal-200 to-teal-100",
    "bg-gradient-to-br from-indigo-200 to-indigo-100",
    "bg-gradient-to-br from-red-200 to-red-100",
  ];
  const hash = senderId?.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length] + " text-gray-800";
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
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white/80 shadow-2xl rounded-3xl flex flex-col h-full sm:h-[80vh] border border-blue-200 backdrop-blur-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-bold p-4 rounded-t-3xl flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <IoChatbubblesOutline className="text-2xl" />
            <span className="tracking-wide">Room: <span className="font-extrabold">{room}</span></span>
          </div>

          <button
            type="button"
            onClick={() => setRoom(null)}
            title="Leave Room"
            className="text-white transition duration-200 cursor-pointer">
           <RxExit className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent">
          {messages.map((message) => {
            const isMe = message.senderId === userId;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-md max-w-[80%] break-words ${getColorClass(
                    message.senderId,
                    isMe
                  )} ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-2 bg-white/70 rounded-b-3xl">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;