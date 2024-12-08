// src/routes/comments.ts
import requirePermission from "@/api-lib/middlewares/rolePermissionMiddleware";
import { CommentsService } from "@/api-lib/services";
import { Hono } from "hono";

const commentsApp = new Hono();

// GET /api/v1/comments
commentsApp.get("/", requirePermission("readComments"), async (c) => {
  try {
    const comments = await CommentsService.getComments();
    return c.json(comments);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/comments/create
commentsApp.post("/create", requirePermission("createComment"), async (c) => {
  try {
    const commentData = await c.req.json();
    const newComment = await CommentsService.createComment(commentData);
    return c.json(newComment);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// DELETE /api/v1/comments/:id
commentsApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await CommentsService.deleteComment(id);
    return c.json({ message: "Comment Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default commentsApp;
