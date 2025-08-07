"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/friends/pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) {
          console.error("Failed to fetch pending requests");
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching friend requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  const respond = async ({ senderId, action }) => {
    try {
      const endpoint =
        action === "accept" ? "/api/friends/accept" : "/api/friends/reject";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          receiverId: user.id,
        }),
      });

      setRequests((prev) =>
        prev.filter((r) => !(r.senderId === senderId && r.receiverId === user.id))
      );
    } catch (err) {
      console.error(`Failed to ${action} friend request`, err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-black mb-3">Friend Requests</h2>

      {loading ? (
        <p className="text-gray-400">Loading friend requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-red-600">No pending requests</p>
      ) : (
        requests.map((r) => (
          <div
            key={r.id}
            className="bg-slate-700 p-4 rounded-lg flex justify-between items-center mb-2"
          >
            <div>
              <p className="text-black font-medium">{r.senderName}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-black"
                onClick={() => respond({ senderId: r.senderId, action: "accept" })}
              >
                Accept
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-black"
                onClick={() => respond({ senderId: r.senderId, action: "reject" })}
              >
                Reject
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendRequests;
