import {
  followUser,
  getTopCreaors,
  getUserById,
  getUserFollowers,
  getUserFollowing,
  getUserPosts,
  searchUsers,
  updateUser,
} from "../controllers/userController";
import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";

const router = express.Router();

// Register User and Get All Users
router.route("/").put(upload.single("file"), protect, updateUser);

// Get Top Creators
router.route("/creators").get(protect, getTopCreaors);

// Search Users
router.route("/search").get(protect, searchUsers);

// Follows/Unfollow Users
router.route("/:id/follow").put(protect, followUser);

// Get User by Id
router.route("/:id").get(protect, getUserById);

// Get Usesr Posts
router.route("/:id/posts").get(protect, getUserPosts);

// Get Users Followers and Followings
router.route("/:id/followers").get(protect, getUserFollowers);
router.route("/:id/following").get(protect, getUserFollowing);

export default router;
