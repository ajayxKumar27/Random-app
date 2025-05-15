import React from "react";
import { IoChatbubblesOutline } from "react-icons/io5";

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

const getColorClass = (senderId: string) => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-teal-200",
  ];
  const hash = senderId?.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
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
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl flex flex-col h-full sm:h-[80vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white text-lg font-bold p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <IoChatbubblesOutline className="mr-2" />
            Chat - {room}
          </div>
          <button
            onClick={() => setRoom(null)}
            className="text-sm bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600"
          >
            Leave Room
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-sm text-gray-800 ${getColorClass(
                  message.senderId
                )}`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-300 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
