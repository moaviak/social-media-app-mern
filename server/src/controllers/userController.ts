import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import { IUser } from "../types";
import { deleteObject, StorageReference } from "firebase/storage";
import mongoose, { Types } from "mongoose";
import { getPostsWithCreators, uploadFileToFirebase } from "../utils";

// @desc Get All Users
// @route GET /api/users
// @access Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find()
    .select("-password -likedPosts -savedPosts")
    .exec();

  res.status(200).json(users);
});

// @desc Get User by Id
// @route GET /api/users/:id
// @access Private
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const activeUser: IUser = req.body.user;

  if (!id) {
    res.status(400).json({ message: "Must provide an Id" });
    return;
  }

  const user = await User.findById(id).select("-password").exec();

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  }

  if (activeUser.id === id) {
    res.status(200).json(user);
  } else {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePictureId: user.profilePictureId,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      createdPosts: user.createdPosts,
    });
  }
});

// @desc Get top creators
// @route GET /api/users/creators
// @access Private
export const getTopCreaors = asyncHandler(
  async (req: Request, res: Response) => {
    const topCreators = await User.find()
      .sort({ followers: -1 })
      .limit(10)
      .select("-password -likedPosts -savedPosts")
      .exec();

    res.status(200).json(topCreators);
  }
);

// @desc Follow/Unfollow User
// @route PUT /api/users/:id/follow
// @access Private
export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId: Types.ObjectId = req.body.user.id;
  const isFollowing: boolean = await req.body.isFollowing;

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "Invalid User Id" });
    return;
  }

  const currentUser = await User.findById(userId).exec();

  if (!currentUser) {
    res.status(403).json({ message: "Forbidden!" });
    return;
  }

  if (user.id === currentUser.id) {
    res.status(403).json({ message: "Cannot follow yourself!" });
    return;
  }

  let action;
  if (isFollowing) {
    action = "Follows";
    if (!currentUser.following.includes(user._id)) {
      currentUser.following.push(user._id);
    }
    if (!user.followers.includes(currentUser._id)) {
      user.followers.push(currentUser._id);
    }
  } else {
    action = "Unfollows";
    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
    user.followers = user.followers.filter(
      (userId) => userId.toString() !== currentUser._id.toString()
    );
  }

  await user.save();
  await currentUser.save();

  res.status(200).json({ userId: user._id, currentUserId: currentUser._id });
});

// @desc Get User Posts
// @route GET /api/users/:id/posts
// @access Private
export const getUserPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id).exec();

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const posts = await getPostsWithCreators({
      userId: new mongoose.Types.ObjectId(id),
    });

    res.status(200).json(posts);
  }
);

// @desc Update User Details
// @route PUT /api/users/
// @access Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const { name, bio } = req.body;
  const file = req.file;

  const user = await User.findById(userId);

  if (!user) {
    res.status(400).json({ message: "Invalid User Id" });
    return;
  }

  let profilePicture = user.profilePicture;

  if (file) {
    // Uploading profile picture to firebase storage
    const fileName = `profiles/${userId}`;
    const metadata = {
      contentType: file.mimetype,
    };

    const [imageUrl, imageRef] = await uploadFileToFirebase(
      fileName,
      file.buffer,
      metadata
    );

    if (!imageUrl) {
      await deleteObject(imageRef as StorageReference);
      res.status(500).json({ message: "Failed to upload image!" });
      return;
    }
    profilePicture = imageUrl as String;
  }

  user.name = name ? name : user.name;
  user.bio = bio;
  user.profilePicture = profilePicture;

  await user.save();

  res.status(200).json({ userId: user._id });
});

// @desc Get User Followers
// @route GET /api/users/:id/followers
// @access Private
export const getUserFollowers = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id).exec();

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const followers = await User.find({ following: user._id }).exec();

    res.status(200).json(followers);
  }
);

// @desc Get User Following
// @route GET /api/users/:id/following
// @access Private
export const getUserFollowing = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id).exec();

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const following = await User.find({ followers: user._id }).exec();

    res.status(200).json(following);
  }
);

// @desc Search Users
// @route GET /api/users/search?term=:term
// @access Private
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { term } = req.query;

  if (!term || typeof term !== "string") {
    res.status(400).json({ message: "Invalid search term" });
    return;
  }

  const searchRegex = new RegExp(term, "i");

  const matchingUsers = await User.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: searchRegex } },
          { username: { $regex: searchRegex } },
        ],
      },
    },
  ]);

  res.status(200).json(matchingUsers);
});
