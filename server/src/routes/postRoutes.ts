import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createPost,
  deletePost,
  getLikedPosts,
  getPopularPosts,
  getPostById,
  getRecentPosts,
  getSavedPosts,
  likePost,
  savePost,
  searchPosts,
  updatePost,
} from "../controllers/postController";
import { upload } from "../middlewares/multerMiddleware";
import commentRoutes from "./commentRoutes";

const router = express.Router();

router.route("/").post(upload.single("file"), protect, createPost);

router.route("/recent").get(protect, getRecentPosts);

router.route("/saved").get(protect, getSavedPosts);

router.route("/liked").get(protect, getLikedPosts);

router.route("/search").get(protect, searchPosts);

router.route("/popular").get(protect, getPopularPosts);

router
  .route("/:id")
  .get(protect, getPostById)
  .put(upload.single("file"), protect, updatePost)
  .delete(protect, deletePost);

router.route("/:id/like").put(protect, likePost);

router.route("/:id/save").put(protect, savePost);

router.use("/:id/comments", commentRoutes);

export default router;
