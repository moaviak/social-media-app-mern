import asyncHandler from "express-async-handler";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import User from "../models/User";
import Message from "../models/Message";

/**
 * @desc Get all chats of user
 * @route GET /api/chats
 * @access Private
 */
export const getAllChats = asyncHandler(async (req, res) => {
  const receiverId = new mongoose.Types.ObjectId(req.body.user.id as string);

  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: receiverId } },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { participants: "$participants" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$participants"] },
                  { $ne: ["$_id", receiverId] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              username: 1,
              profilePicture: 1,
            },
          },
        ],
        as: "sender",
      },
    },
    {
      $unwind: "$sender",
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $project: {
        _id: 1,
        updatedAt: 1,
        sender: 1,
      },
    },
  ]);

  res.status(200).json(chats);
});

/**
 * @desc Get all messages from chat
 * @route GET /api/chats/:chatId
 * @access Private
 */
export const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    res.status(400).json({ message: "Invalid chat id" });
    return;
  }

  const messages = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "message",
      },
    },
    {
      $unwind: "$message",
    },
    {
      $sort: {
        "message.createdAt": 1, // Assuming you want to sort messages by creation time
      },
    },
    {
      $group: {
        _id: "$_id",
        messages: { $push: "$message" },
        participants: { $first: "$participants" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ]);

  res.status(200).json(messages[0].messages || []);
});

/**
 * @desc Send a message in a chat
 * @route POST /api/chats/:id
 * @access Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const { content }: { content: string } = req.body;
  const senderId: string = req.body.user.id;

  if (!content) {
    res.status(400).json({ message: "Message content is required" });
    return;
  }

  // find receiver
  const receiver = await User.findById(receiverId).lean().exec();

  if (!receiver) {
    res.status(404).json({ message: "Receiver not found" });
    return;
  }

  // find existing chat between sender and receiver
  let chat = await Chat.findOne({
    participants: {
      $all: [new mongoose.Types.ObjectId(senderId), receiver._id],
    },
  });

  if (!chat) {
    // create new chat if not found
    chat = await Chat.create({
      participants: [new mongoose.Types.ObjectId(senderId), receiver._id],
    });
  }

  // create new message
  const message = await Message.create({
    content,
    sender: new mongoose.Types.ObjectId(senderId),
    chat: chat._id,
  });

  chat.messages.push(message._id);

  await chat.save();

  res.status(201).json({ message: "Message sent successfully" });
});
