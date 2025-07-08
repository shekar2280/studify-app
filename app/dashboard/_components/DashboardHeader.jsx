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
    <div className="p-5 flex justify-end gap-5">
      <IoNotifications size={30} />
      <FiMessageSquare
        size={30}
        onClick={() => setShowChat((prev) => !prev)}
        className="cursor-pointer"
      />
      <UserButton />
      {showChat && <ChatBox />}
    </div>
  );
}
