import express from "express";
import { BlogControllers } from "./blog.controller.ts";


const router = express.Router();

router.post("/", BlogControllers.createBlog);
router.get("/",  BlogControllers.getAllBlog);
router.get("/:id", BlogControllers.getBlogById);
router.put("/:id", BlogControllers.updateBlog);
router.delete("/:id", BlogControllers.deleteBlog);
router.patch("/:id/status", BlogControllers.updateBlogStatus);

export const BlogRoutes = router;
