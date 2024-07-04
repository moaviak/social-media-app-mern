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
router.post("/", postComment);

// Get all comments from posts
router.get("/", getAllComments);

// Like a comment
router.get("/", likeComment);

export default router;
