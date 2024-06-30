export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
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

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
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

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
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
