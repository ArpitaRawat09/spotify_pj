import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import cookie from "cookie";

function initSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: true,
    },
  });

  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    try {
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.user.id);

    socket.on("play", (data) => {
      socket.to(socket.user.id).emit("play", data);
    });

    socket.on("disconnect", () => {
      socket.leave(socket.user.id);
    });
  });
}

export default initSocketServer;
