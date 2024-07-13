import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { DecodedToken, IUser } from "../types";

declare module "socket.io" {
  interface Socket {
    user: IUser | null;
  }
}

const mountJoinChatEvent = (socket: Socket) => {
  socket.on("joinChat", (chatId: string) => {
    console.log(`User joined the chat. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on("typing", (chatId: string) => {
    socket.in(chatId).emit("typing", chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on("stopTyping", (chatId: string) => {
    socket.in(chatId).emit("stopTyping", chatId);
  });
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

      socket.user = user;

      socket.join(user._id.toString());
      socket.emit("connected");

      console.log("User connected. userId: ", user.id);

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on("disconnect", () => {
        console.log("user has disconnected. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id.toString());
        }
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
  req.app.get("io").in(roomId).emit(event, payload);
};
