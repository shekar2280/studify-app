"use client";

import { UserButton } from "@clerk/nextjs";
import { IoNotifications } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="p-5 flex justify-end gap-5 bg-gray-100">
      <IoNotifications size={30} />
      <Link href={`/dashboard/chat`}>
        <FiMessageSquare size={30} />
      </Link>

      <UserButton />
    </div>
  );
}
