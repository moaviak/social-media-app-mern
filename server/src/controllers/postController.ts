import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { INewPost } from "../types";
import User from "../models/User";
import { StorageReference, deleteObject, ref } from "firebase/storage";
import Post from "../models/Post";
import { getPostsWithCreators, uploadFileToFirebase } from "../utils";
import mongoose, { Types } from "mongoose";
import { storage } from "../config/firebase.config";
import { startOfDay, endOfDay } from "date-fns";

// @desc create a new post
// @route POST /api/posts
// @access Private
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { caption, location, tags }: INewPost = req.body;
  const userId = req.body.user.id;
  const content = req.file;

  if (!userId || !caption || !content) {
    res.status(400).json({ message: "All fields are required!" });
    return;
  }

  // check for valid userId
  const user = await User.findById(userId).exec();

  if (!user) {
    res.status(404).json({ message: "No User Found!" });
    return;
  }

  // uploading image/content to firebase storage
  const fileName = `images/${user._id}/${Date.now()}`;
  const metadata = {
    contentType: content.mimetype,
  };

  const [imageUrl, imageRef] = await uploadFileToFirebase(
    fileName,
    content.buffer,
    metadata
  );

  if (!imageUrl) {
    await deleteObject(imageRef as StorageReference);
    res.status(500).json({ message: "Failed to upload image!" });
    return;
  }

  const post = await Post.create({
    userId,
    caption,
    content: imageUrl,
    location,
    tags: tags ? tags.split(",") : [],
  });

  if (!post) {
    await deleteObject(imageRef as StorageReference);
    res.status(500).json({ message: "Failed to upload post!" });
    return;
  }

  user.createdPosts.push(post._id);

  await user.save();

  res.status(200).json({ postId: post._id, userId: user.id });
});

// @desc get recently uploaded posts from following users and themselves
// @route GET /api/posts/recent?page=&
// @access Private
export const getRecentPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId: string = req.body.user.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const recentPosts = await getPostsWithCreators(
      {
        userId: { $in: [...user.following, user._id] },
      },
      skip,
      limit
    );

    if (!recentPosts) {
      res.status(404).json({ message: "No posts found!" });
      return;
    }

    const totalPosts = await Post.countDocuments({
      userId: { $in: [...user.following, userId] },
    }).exec();
    const nextPage = page * limit < totalPosts ? page + 1 : null;

    res.status(200).json({ recentPosts, nextPage });
  }
);

// @desc Post Liked/Unliked
// @route PUT /api/posts/:id/like
// @access Private
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId: Types.ObjectId = req.body.user.id;
  const isLiked: boolean = req.body.isLiked;

  const post = await Post.findById(id).exec();
  if (!post) {
    res.status(400).json({ message: "Invalid Post Id" });
    return;
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    res.status(401).json({ message: "Unauthorized!" });
    return;
  }

  let action;

  if (isLiked) {
    action = "Liked";
    if (!post.likes.includes(user._id)) {
      post.likes.push(user._id);
    }
    if (!user.likedPosts.includes(post._id)) {
      user.likedPosts.push(post._id);
    }
  } else {
    action = "Unliked";
    post.likes = post.likes.filter(
      (likeUserId) => likeUserId.toString() !== user._id.toString()
    );
    user.likedPosts = user.likedPosts.filter(
      (likedPostId) => likedPostId.toString() !== post._id.toString()
    );
  }

  await post.save();
  await user.save();

  res.status(200).json({ postId: post._id, userId: user._id });
});

// @desc Save/Unsave Post
// @route PUT /api/posts/:id/save
// @access Private
export const savePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId: Types.ObjectId = req.body.user.id;
  const isSaved: boolean = req.body.isSaved;

  const post = await Post.findById(id).lean().exec();
  if (!post) {
    res.status(400).json({ message: "Invalid Post Id" });
    return;
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    res.status(401).json({ message: "Unauthorized!" });
    return;
  }

  let action;

  if (isSaved) {
    action = "Saved";
    if (!user.savedPosts.includes(post._id)) {
      user.savedPosts.push(post._id);
    }
  } else {
    action = "Unsaved";
    user.savedPosts = user.savedPosts.filter(
      (savedPostId) => savedPostId.toString() !== post._id.toString()
    );
  }

  await user.save();

  res.status(200).json({ postId: post._id, userId: user._id });
});

// @desc get post by id
// @route GET /api/posts/:id
// @access Private
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await getPostsWithCreators({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (!post || post.length === 0) {
    res.status(400).json({ message: "Invalid Post Id" });
    return;
  }

  res.status(200).json(post[0]);
});

// @desc Update a post
// @route PUT /api/posts/:id
// @access Private
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const content = req.file;
  const { id } = req.params;
  const { caption, location, tags } = req.body;
  const userId = req.body.user.id;

  const post = await Post.findById(id).exec();

  if (!post) {
    res.status(400).json({ message: "Invalid Post Id" });
    return;
  }

  if (post.userId.toString !== userId) {
    res.status(403).json({ message: "Forbidden!" });
    return;
  }

  let contentUrl = post.content;

  if (content) {
    // uploading image/content to firebase storage
    const fileName = `images/${post.userId}/${Date.now()}`;
    const metadata = {
      contentType: content.mimetype,
    };

    const [imageUrl, imageRef] = await uploadFileToFirebase(
      fileName,
      content.buffer,
      metadata
    );

    if (!imageUrl) {
      await deleteObject(imageRef as StorageReference);
      res.status(500).json({ message: "Failed to upload image!" });
      return;
    }
    contentUrl = imageUrl as String;

    // deleting the previous image/content from firebase storage
    const contentRef = ref(storage, post.content as string);

    await deleteObject(contentRef);
  }

  post.caption = caption;
  post.content = contentUrl;
  post.location = location;
  post.tags = tags.split(",");

  await post.save();

  res.status(200).json({ postId: post._id });
});

// @desc delete a post
// @route DELETE /api/posts/:id
// @access Private
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.body.user.id;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found!" });
    return;
  }

  if (post.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden!" });
    return;
  }

  // Delete Post content from Firebase storage
  const contentRef = ref(storage, post.content as string);

  await deleteObject(contentRef);

  // Remove post ID from user's createdPosts array
  await User.updateOne({ _id: userId }, { $pull: { createdPosts: post._id } });

  await post.deleteOne();

  res.status(200).json({ message: "Post successfully deleted!" });
});

// @desc Get saved posts of user
// @route GET /api/posts/saved
// @access Private
export const getSavedPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.user.id;

    const user = await User.findById(userId).exec();

    if (!user) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const savedPosts = await getPostsWithCreators({
      _id: { $in: user.savedPosts },
    });

    res.status(200).json(savedPosts);
  }
);

// @desc Get User's Liked Posts
// @route GET /api/users/liked
// @access Private
export const getLikedPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.user.id;

    const user = await User.findById(userId).exec();

    if (!user) {
      res.status(400).json({ message: "Invalid User Id" });
      return;
    }

    const likedPosts = await getPostsWithCreators({
      _id: { $in: user.likedPosts },
    });

    res.status(200).json(likedPosts);
  }
);

// @desc Search for Posts
// @route GET /api/posts/search?term=&search_term
// @access Private
export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const { term } = req.query;

  if (!term || typeof term !== "string") {
    res.status(400).json({ message: "Invalid search term" });
    return;
  }

  const searchRegex = new RegExp(term, "i");

  const matchingPosts = await getPostsWithCreators(
    {
      $or: [
        { caption: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ],
    },
    0,
    10
  );

  res.status(200).json(matchingPosts);
});

// @desc Get today's popular posts
// @route GET /api/posts/popular?page=&page_number
// @access Private
export const getPopularPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const popularPosts = await getPostsWithCreators(
      {
        createdAt: { $gte: start, $lte: end },
      },
      skip,
      limit
    );

    const totalPosts = await Post.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const nextPage = page * limit < totalPosts ? page + 1 : null;

    res.status(200).json({ popularPosts, nextPage });
  }
);
