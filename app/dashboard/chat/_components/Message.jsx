"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";

function Message({ selectedFriend }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useUser();

  const currentUserId = user?.id;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedFriend || !currentUserId) return;

      const res = await fetch(`/api/messages/${selectedFriend.id}`, {
        headers: {
          "x-user-id": currentUserId,
        },
      });

      const data = await res.json();
      console.log("Fetched messages:", data);
      setMessages(data);
    };

    fetchHistory();
  }, [selectedFriend, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat-message", (msg) => {
      if (
        msg.senderId === selectedFriend.id ||
        msg.receiverId === selectedFriend.id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("chat-message");
  }, [selectedFriend]);

  useEffect(() => {
  if (selectedFriend && currentUserId) {
    fetch(`/api/messages/read/${selectedFriend.id}`, {
      method: "PATCH",
      headers: { "x-user-id": currentUserId }
    });
  }
}, [selectedFriend, currentUserId]);


  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    const message = {
      text: input,
      senderId: user.id,
      receiverId: selectedFriend.id,
      createdAt: new Date().toISOString(),
    };

    socket.emit("chat-message", message);

    setMessages((prev) => [...prev, { ...message, self: true }]);
    scrollToBottom();
    setInput("");

    try {
      await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error("Failed to store message", error);
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(message);
      return acc;
    }, {});
  };

  if (!selectedFriend) {
    return (
      <div className="h-full flex items-center justify-center text-black text-xl">
        Select a friend to start chatting
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="p-8">
        <h1 className="text-black text-2xl font-semibold">
          Messages with {selectedFriend.name}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 mt-3 pb-16">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="mb-6">
            <div className="text-center text-sm text-gray-500 mb-2">{date}</div>
            {msgs.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 text-black ${
                  msg.senderId === currentUserId ? "text-right" : "text-left"
                }`}
              >
                <span className="bg-cyan-600 px-3 py-1 rounded-xl inline-block">
                  {msg.message || msg.text}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-xl px-4 py-2 outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-cyan-600 text-black px-4 py-2 rounded-xl hover:bg-cyan-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
