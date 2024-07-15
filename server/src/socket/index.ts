import type { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { DecodedToken, IUser } from "../types";

const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

export const initializeSocketIO = (io: Server) => {
  return io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new Error("Unauthorized handshake. Token is missing");
      }

      const decodedToken: DecodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as DecodedToken;

      const user = await User.findById(decodedToken.user.id).select(
        "-password"
      );

      if (!user) {
        throw new Error("Unauthorized handshake. Token is invalid");
      }

      userSocketMap[user._id.toString()] = socket.id;

      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      console.log("User connected. userId: ", user.id);

      socket.on("disconnect", () => {
        console.log("user has disconnected. userId: " + user.id);
        delete userSocketMap[user._id.toString()];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    } catch (error) {
      socket.emit(
        "socketError",
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

export const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(getReceiverSocketId(roomId)).emit(event, payload);
};
