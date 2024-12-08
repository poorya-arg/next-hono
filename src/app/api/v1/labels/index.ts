import { Hono } from "hono";

import { LabelsService } from "@/api-lib/services";

const labelsApp = new Hono();

// GET /api/v1/labels
labelsApp.get("/", async (c) => {
  try {
    const labels = await LabelsService.getLabels();
    return c.json(labels);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/labels/create
labelsApp.post("/create", async (c) => {
  try {
    const labelData = await c.req.json();
    const newLabel = await LabelsService.createLabel(labelData);
    return c.json(newLabel);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// DELETE /api/v1/labels/:id
labelsApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await LabelsService.deleteLabel(id);
    return c.json({ message: "Label Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default labelsApp;
