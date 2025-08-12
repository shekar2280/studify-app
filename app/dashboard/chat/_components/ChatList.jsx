"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { poppins } from "@/app/fonts";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUserPlus, FaUsers } from "react-icons/fa6";
import FriendRequests from "./FriendRequests";
import OtherUsers from "./OtherUsers";
import { socket } from "@/lib/socket";

function ChatList({ onSelectFriend }) {
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

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
  }, [user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return;
    socket.emit("new-user-add", user.id);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("unread-count-update", ({ senderId, count }) => {
      setFriends((prev) =>
        prev.map((f) =>
          f.id === senderId
            ? { ...f, unreadCount: (f.unreadCount || 0) + count }
            : f
        )
      );
    });

    socket.on("unread-count-reset", ({ friendId }) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === friendId ? { ...f, unreadCount: 0 } : f))
      );
    });

    return () => {
      socket.off("get-users");
      socket.off("unread-count-update");
      socket.off("unread-count-reset");
    };
  }, [user?.id]);

  const filteredUsers =
    searchQuery.trim() === ""
      ? friends
      : friends.filter((user) =>
          user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
  console.log("Filtered users: ", filteredUsers);
  return (
    <div className="h-screen shadow-md p-5 flex flex-col">
      <div>
        <div className="flex flex-row justify-between">
          <h1 className="font-semibold text-2xl text-black">Chats</h1>
          <div className="flex flex-row gap-3">
            <FaUserPlus
              size={30}
              color={activeTab === "requests" ? "#0ea5e9" : "black"}
              className="hover:cursor-pointer"
              onClick={() =>
                setActiveTab((prev) =>
                  prev === "requests" ? null : "requests"
                )
              }
            />
            <FaUsers
              size={30}
              color={activeTab === "others" ? "#0ea5e9" : "black"}
              className="hover:cursor-pointer"
              onClick={() =>
                setActiveTab((prev) => (prev === "others" ? null : "others"))
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3 border rounded-md shadow-md">
          <button className="p-2 bg-transparent hover:bg-cyan-700 rounded-md transition">
            <Search className="text-xl text-black" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className={`w-60 pl-2 font-medium text-lg bg-transparent focus:outline-none focus:ring-0 focus:border-transparent text-gray-600 ${poppins.className}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "requests" && (
          <div className="mt-3">
            <FriendRequests />
          </div>
        )}
        {activeTab === "others" && (
          <div className="mt-3">
            <OtherUsers />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-xl font-semibold text-black mb-3">Friends</h2>
        {filteredUsers.map((f) => {
          const isOnline = onlineUsers.includes(f.id);

          return (
            <div
              key={f.id}
              className="flex flex-row justify-between items-center px-5 py-4 hover:bg-slate-300 rounded-xl cursor-pointer"
              onClick={() => {
                onSelectFriend(f);

                socket.emit("mark-messages-read", {
                  userId: user.id,
                  friendId: f.id,
                });

                setFriends((prev) =>
                  prev.map((friend) =>
                    friend.id === f.id ? { ...friend, unreadCount: 0 } : friend
                  )
                );
              }}
            >
              <div className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center relative">
                  <span className="text-black font-semibold text-lg">
                    {f.name?.charAt(0).toUpperCase()}
                  </span>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                <div>
                  <h1
                    className={`font-medium text-black text-lg truncate max-w-[150px] ${poppins.className}`}
                  >
                    {f.name}
                  </h1>
                </div>
              </div>
              <div className="justify-right">
                <h2>
                  {f.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {f.unreadCount}
                    </span>
                  )}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
