const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: process.env.PROJECT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


const redisUrl = process.env.REDIS_URL;
const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

(async () => {
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
})();

const onlineUsers = new Map();

function emitOnlineUsers() {
  io.emit("get-users", Array.from(onlineUsers.keys()));
}

io.on("connection", (socket) => {


  socket.on("new-user-add", (userId) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    socket.join(userId);
    

    emitOnlineUsers();
  });

  socket.on("chat-message", (msg) => {
    io.to(msg.receiverId).emit("chat-message", msg);
  });

  socket.on("offline", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
      }
      socket.leave(userId);
      console.log(`⚠️ User ${userId} went offline`);
      emitOnlineUsers();
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    for (let [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
    emitOnlineUsers();
  });
});

server.listen(3001, () => {
  console.log("🚀 Socket.IO server running on port 3001");
});
