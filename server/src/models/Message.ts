import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types";

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
