"use client"

import React, { useEffect, useState } from "react";
import ChatList from "./_components/ChatList";
import Message from "./_components/Message";

export default function Chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);

   useEffect(() => {
    if (selectedFriend) {
      console.log("Selected Friend:", selectedFriend);
    }
  }, [selectedFriend]);
  
  return (
    <div className="flex min-h-screen w-full bg-cover bg-center bg-gray-100"
    style={{ backgroundImage: `url('/background.jpg')`}}
    >
      <div className="w-[30%] max-w-[400px] border-r border-gray-300">
        <ChatList onSelectFriend={setSelectedFriend} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Message selectedFriend={selectedFriend} />
      </div>
    </div>
  );
}
