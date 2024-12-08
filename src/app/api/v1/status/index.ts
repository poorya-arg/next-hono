import { StatusService } from "@/api-lib/services";
import { Hono } from "hono";

const statusApp = new Hono();

// GET /api/v1/status
statusApp.get("/", async (c) => {
  try {
    const statuses = await StatusService.getStatusList();
    return c.json(statuses);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/status/create
statusApp.post("/create", async (c) => {
  try {
    const statusData = await c.req.json();
    const newStatus = await StatusService.createStatus(statusData);
    return c.json(newStatus);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// DELETE /api/v1/status/:id
statusApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await StatusService.deleteStatus(id);
    return c.json({ message: "Status Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default statusApp;
