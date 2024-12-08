import { OrganizationService } from "@/api-lib/services";
import { Hono } from "hono";

const app = new Hono();

// BASEURL/api/v1/organizations
app.get("/", async (c) => {
  try {
    const results = await OrganizationService.getOrganization();
    return c.json(results);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.post("/create", async (c) => {
  try {
    const orgData = await c.req.json();
    const results = await OrganizationService.createOrganization(orgData);
    return c.json(results);
  } catch (error) {
    return c.json({ message: "Internal Server Error" + error }, 500);
  }
});

export default app;
