export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IPost = {
  _id: string;
  creator: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  caption: string;
  tags: [string] | string[];
  content: string;
  location: string;
  likes: [string] | string[];
  comments: [string] | string[];
  createdAt: string;
  updatedAt: string;
};

export type IUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: [string];
  following: [string];
  createdPosts: [string];
  likedPosts: [string];
  savedPosts: [string];
  createdAt: string;
  updatedAt: string;
};

export type IDecode = {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
  };
};

export type IComment = {
  _id: string;
  text: string;
  postId: string;
  userId: string;
  user?: IUser;
  likes: string[];
  createdAt: string;
  updatedAt: string;
};

export type IChat = {
  _id: string;
  updatedAt: string;
  sender: IUser;
};

export type IMessage = {
  _id: string;
  content: string;
  sender: IUser;
  chat: string;
  createdAt: string;
  updatedAt: string;
};
