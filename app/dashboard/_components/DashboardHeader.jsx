"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { IoNotifications } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const { user } = useUser();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return;

      const res = await fetch("/api/chat-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      setFriends(data);
    };

    fetchFriends();

    const interval = setInterval(fetchFriends, 5000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const totalUnread = friends.reduce(
    (sum, friend) => sum + (friend.unreadCount || 0),
    0
  );

  return (
    <div className="p-5 flex justify-end gap-5 bg-gray-100 items-center">
      <Link href={`/dashboard/chat`} className="relative">
        <FiMessageSquare size={30} />

        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {totalUnread}
          </span>
        )}
      </Link>

      <UserButton />
    </div>
  );
}
