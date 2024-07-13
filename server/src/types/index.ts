import { JwtPayload } from "jsonwebtoken";
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

export type IPost = {
  userId: Types.ObjectId;
  caption: String;
  tags: [String];
  content: String;
  location: String;
  likes: [Types.ObjectId] | Types.ObjectId[];
  comments: [Types.ObjectId] | Types.ObjectId[];
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

export type IComment = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
};

export type IChat = {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
};

export type IMessage = {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  content: string;
};

export interface DecodedToken extends JwtPayload {
  user: {
    id: string | Types.ObjectId;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
  };
}
