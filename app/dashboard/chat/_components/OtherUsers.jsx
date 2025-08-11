"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { poppins } from "@/app/fonts";

function OtherUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]); 
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, reqRes, friendsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/friends/pending", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          }),
          fetch("/api/friends/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          }),
        ]);

        if (!userRes.ok || !reqRes.ok || !friendsRes.ok) {
          throw new Error("One or more API requests failed");
        }

        const allUsers = await userRes.json();
        const requests = await reqRes.json();
        const friends = await friendsRes.json();

        const filtered = allUsers
          .filter((u) => u.email !== user?.primaryEmailAddress?.emailAddress)
          .filter(
            (u) =>
              !friends.some((f) => f.user1Id === u.id || f.user2Id === u.id)
          )
          .map((u) => ({
            ...u,
            pending: requests.some(
              (r) =>
                (r.senderId === user.id && r.receiverId === u.id) ||
                (r.receiverId === user.id && r.senderId === u.id)
            ),
          }));

        setUsers(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [user?.id]);

  const sendRequest = async (receiverId) => {
    try {
      await fetch("/api/friends/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: receiverId,
        }),
      });

      setSentRequests((prev) => [...prev, receiverId]);
    } catch (err) {
      console.error("Error sending friend request", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col mt-5">
        <h2 className="text-xl font-semibold text-black mb-3">Other Users</h2>

        {loading ? (
          <p className="text-black">Loading all users list...</p>
        ) : users.length === 0 ? (
          <p className="text-black">No users left to connect with.</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex flex-row justify-between items-center px-5 py-4 hover:bg-slate-300 rounded-xl"
            >
              <div className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-lg">
                    {u.name?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h1
                  className={`font-medium items-center justify-center text-black text-lg truncate max-w-[120px] block ${poppins.className}`}
                >
                  {u.name}
                </h1>
              </div>
              <div className="flex flex-row gap-4">
                {u.pending || sentRequests.includes(u.id) ? (
                  <Button disabled className="bg-gray-400 text-black">
                    Request Sent
                  </Button>
                ) : (
                  <Button onClick={() => sendRequest(u.id)}>
                    Send Request
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OtherUsers;
