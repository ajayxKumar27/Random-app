'use client';
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatScreen from "./ChatScreen";

type Message = {
  id: number;
  text: string;
  senderId: string;
};

const ChatComponent: React.FC = () => {
  const [room, setRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const userIdRef = useRef<string>("");

  // Set/get UUID from localStorage
  useEffect(() => {
    let storedId = localStorage.getItem("userId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("userId", storedId);
    }
    userIdRef.current = storedId;
  }, []);

  useEffect(() => {
    if (!room) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${room}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // polling every 3s

    return () => clearInterval(interval);
  }, [room]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !room) return;

    try {
      const response = await fetch(`/api/chat/${room}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue, senderId: userIdRef.current }),
      });
      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!room) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Select a Room</h1>
          <div className="grid grid-cols-2 gap-4">
            {["room1", "room2", "room3", "room4", "room5"].map((roomName) => (
              <button
                key={roomName}
                onClick={() => setRoom(roomName)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {roomName}
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
    />
  );
};

export default ChatComponent;
