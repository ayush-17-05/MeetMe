import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server is running at port:8000");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });

const io = new Server(8001, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("room:join", (data) => {
    const { email, roomId } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user:joined", { email, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    console.log(`Call incoming from ${socket.id} to ${to} with offer:`, offer);
    if (!io.sockets.sockets.get(to)) {
      console.warn(`⚠️ Target socket ${to} not found!`);
      return;
    }
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { ans });
  });

  socket.on("ice:candidate", ({ to, candidate }) => {
    console.log(`🔁 Relaying ICE candidate to ${to}`);
    io.to(to).emit("ice:candidate", { candidate });
  });
});
