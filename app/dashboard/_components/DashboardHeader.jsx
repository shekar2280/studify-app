"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { IoNotifications } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Merriweather } from "next/font/google";
import dynamic from "next/dynamic";
import Image from "next/image";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});


const SafeUserButton = dynamic(
  async () => {
    const { UserButton } = await import("@clerk/nextjs");
    return UserButton;
  },
  { ssr: false }
);

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
    <div className="mt-5 pl-10 pr-10 flex justify-between gap-5 bg-gray-100 items-center">
      <Link href={"/dashboard"}>
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/icons8-logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />

          <h2
            className={`text-lg sm:text-xl md:text-2xl text-cyan-700 italic font-bold ${merriweather.className}`}
          >
            Studify
          </h2>
        </div>
      </Link>
      <div className="flex flex-row gap-4">
        <Link href={`/dashboard/chat`} className="relative">
          <FiMessageSquare className="text-3xl sm:text-3xl md:text-4xl" />

          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {totalUnread}
            </span>
          )}
        </Link>

        <SafeUserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10", 
            },
          }}
        />
      </div>
    </div>
  );
}
