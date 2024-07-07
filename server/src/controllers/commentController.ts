import asyncHandler from "express-async-handler";
import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import mongoose from "mongoose";
import { IComment, IUser } from "../types";

// @desc Post a Comment on Post
// @route POST /api/posts/comments/:id
// @access Private
export const postComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId: string = req.body.user.id;
  const { text }: { text: string } = req.body;
  console.log(id);

  if (!id) {
    res.status(400).json({ message: "Invalid Post ID" });
    return;
  }

  if (!text) {
    res.status(400).json({ message: "Text is required" });
    return;
  }

  const user = await User.findById(userId).exec();

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const post = await Post.findById(id).exec();

  if (!post) {
    res.status(404).json({ message: "Invalid Post ID" });
    return;
  }

  const newComment = await Comment.create({
    postId: post._id,
    userId: user._id,
    text,
  });

  if (!newComment) {
    res.status(500).json({ message: "Error posting comment!" });
  } else {
    post.comments.push(newComment._id);
    await post.save();

    res.status(200).json({ comment: newComment });
  }
});

// @desc Get all Comments on a Post
// @route GET /api/posts/comments/:id
// @access Private
export const getAllComments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Invalid Post ID" });
    return;
  }

  const comments: (IComment & { user: IUser })[] = await Comment.aggregate([
    {
      $match: { postId: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        _id: 1,
        user: {
          _id: "$user._id",
          username: "$user.username",
          profilePicture: "$user.profilePicture",
        },
        text: 1,
        likes: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  res.status(200).json({ comments });
});

// @desc Like a Comment
// @route PUT /api/posts/comments/:id
// @access Private
export const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId: string = req.body.user.id;
  const { isLiked }: { isLiked: boolean } = req.body;

  if (!id) {
    res.status(400).json({ message: "Invalid Post ID" });
    return;
  }

  const comment = await Comment.findById(id).exec();

  if (!comment) {
    res.status(400).json({ message: "Invalid Comment ID" });
    return;
  }

  const user = await User.findById(userId).exec();

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (isLiked) {
    if (!comment.likes.includes(user._id)) {
      comment.likes.push(user._id);
    }
  } else {
    comment.likes = comment.likes.filter((userId) => userId !== user._id);
  }

  await comment.save();

  res.status(200).json(comment);
});
