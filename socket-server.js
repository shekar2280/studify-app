const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Map<userId, Set<socketId>>
const onlineUsers = new Map();

function emitOnlineUsers() {
  const userIds = Array.from(onlineUsers.keys());
  io.emit("get-users", userIds); // Send just userIds
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("new-user-add", (userId) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);
    console.log("User added:", userId, socket.id);

    emitOnlineUsers();
  });

  socket.on("disconnect", () => {
    for (const [userId, socketSet] of onlineUsers.entries()) {
      socketSet.delete(socket.id);

      if (socketSet.size === 0) {
        onlineUsers.delete(userId);
        console.log("User fully disconnected:", userId);
      }
    }

    emitOnlineUsers();
  });

  socket.on("offline", () => {
    for (const [userId, socketSet] of onlineUsers.entries()) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        onlineUsers.delete(userId);
        console.log("User went offline:", userId);
      }
    }

    emitOnlineUsers();
  });

  socket.on("chat-message", (msg) => {
    console.log("Message received:", msg);

    const receiverSockets = onlineUsers.get(msg.receiverId);
    if (receiverSockets) {
      receiverSockets.forEach((sId) => {
        io.to(sId).emit("chat-message", msg);
      });
    }
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});
