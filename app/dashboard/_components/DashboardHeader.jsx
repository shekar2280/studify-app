"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IoNotifications } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { useState } from "react";
import ChatBox from "./ChatBox";

export default function DashboardHeader() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="p-5 flex justify-end gap-5 bg-gray-100">
      <IoNotifications size={30} />
      <div className="flex flex-row">
        <FiMessageSquare
          size={30}
          onClick={() => setShowChat((prev) => !prev)}
          className=" cursor-pointer"
        />
        <span className="relative inline-flex size-3 rounded-full bg-red-500">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75">
        </span>
        </span>
      </div>
      <UserButton />
      {showChat && <ChatBox />}
    </div>
  );
}
