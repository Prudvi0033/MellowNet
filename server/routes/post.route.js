import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createComment, createPost, deletePost, getFeedPosts, getPostsById, likePost } from "../controllers/post.controller.js"

const router = express.Router()

router.get("/", protectRoute, getFeedPosts) 
router.post("/create", protectRoute, createPost)
router.delete("delete/:id", protectRoute, deletePost)
router.get("/:id",protectRoute, getPostsById)
router.get("/:id/comment",protectRoute, createComment)
router.get("/:id/comment",protectRoute, likePost)

export default router