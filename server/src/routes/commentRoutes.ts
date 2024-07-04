import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getAllComments,
  likeComment,
  postComment,
} from "../controllers/commentController";

const router = express.Router();

router.use(protect);

// Comment on post
router.post("/:id", postComment);

// Get all comments from posts
router.get("/:id", getAllComments);

// Like a comment
router.put("/:id", likeComment);

export default router;
