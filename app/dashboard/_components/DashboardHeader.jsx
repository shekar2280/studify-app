"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IoNotifications } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { useState } from "react";
import ChatBox from "./ChatBox";

export default function DashboardHeader() {

  return (
    <div className="p-5 flex justify-end gap-5 bg-gray-100">
      <IoNotifications size={30} />
      <UserButton />
    </div>
  );
}
