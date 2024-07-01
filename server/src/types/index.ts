import { Types } from "mongoose";

export type IUser = {
  id: String;
  name: String;
  username: String;
  email: String;
  password: String;
  profilePictureId: String;
  profilePicture: String;
  bio: String;
  createdPosts: [Types.ObjectId] | Types.ObjectId[];
  likedPosts: [Types.ObjectId] | Types.ObjectId[];
  savedPosts: [Types.ObjectId] | Types.ObjectId[];
  followers: [Types.ObjectId] | Types.ObjectId[];
  following: [Types.ObjectId] | Types.ObjectId[];
};

export type IUpdateUser = {
  name: string;
  bio: string;
  file: File;
};

export type IPost = {
  userId: Types.ObjectId;
  caption: String;
  tags: [String];
  content: String;
  location: String;
  likes: [Types.ObjectId] | Types.ObjectId[];
  createdAt: String;
  updatedAt: String;
};

export type INewPost = {
  userId: string;
  caption: string;
  content: File;
  location?: string;
  tags?: string;
};
