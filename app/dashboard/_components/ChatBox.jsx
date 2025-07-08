"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import { IoLogOutOutline } from "react-icons/io5";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true); 

  const { user } = useUser();
  const currentUserName = user?.username || user?.firstName || "Anonymous";

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        text: input,
        sender: currentUserName,
      };

      socket.emit("chat-message", message); 
      setMessages((prev) => [...prev, { ...message, self: true }]);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border shadow-md rounded p-4 z-50">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>
        <IoLogOutOutline
          size={25}
          className="cursor-pointer"
          onClick={() => setIsOpen(false)} 
        />
      </div>

      <div className="h-40 overflow-y-auto bg-gray-100 p-2 mb-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-1 border rounded"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
