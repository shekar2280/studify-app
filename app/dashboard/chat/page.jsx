"use client"

import React, { useEffect, useState } from "react";
import ChatList from "./_components/ChatList";
import Message from "./_components/Message";

export default function Chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="flex min-h-screen w-full bg-cover bg-center bg-gray-100"
    style={{ backgroundImage: `url('/background.jpg')`}}
    >
      <div
        className={`
          border-r border-gray-300 
          ${selectedFriend ? "hidden md:block" : "block"} 
          w-full md:w-[30%] md:max-w-[400px]
        `}
      >
        <ChatList onSelectFriend={setSelectedFriend} />
      </div>
      <div
        className={`
          flex-1 overflow-hidden 
          ${!selectedFriend ? "hidden md:block" : "block"}
        `}
      >
        <Message
          selectedFriend={selectedFriend}
          onBack={() => setSelectedFriend(null)} 
        />
      </div>
    </div>
  );
}
