import requirePermission from "@/api-lib/middlewares/rolePermissionMiddleware";
import { TasksService } from "@/api-lib/services";
import { Hono } from "hono";

const tasksApp = new Hono();

// GET /api/v1/tasks
tasksApp.get("/", async (c) => {
  try {
    const tasks = await TasksService.getTasks();
    return c.json(tasks);
  } catch (error) {
    console.log(error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/tasks/create
tasksApp.post("/create", requirePermission("createTask"), async (c) => {
  try {
    const taskData = await c.req.json();
    const newTask = await TasksService.createTask(taskData);
    return c.json(newTask);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// DELETE /api/v1/tasks/:id
tasksApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await TasksService.deleteTask(id);
    return c.json({ message: "Task Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

// DELETE /api/v1/tasks/:id
tasksApp.patch("/:id/assign", async (c) => {
  try {
    const id = c.req.param("id");
    const bodyData = await c.req.json();
    await TasksService.assignTaskToUser({
      taskId: id,
      userId: bodyData.userId,
    });
    return c.json({ message: "Task Assigned!" });
  } catch (error) {
    return c.json({ message: "Failed to Assign" }, 500);
  }
});

export default tasksApp;
