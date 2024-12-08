import { Hono } from "hono";
import { handle } from "hono/vercel";
import Organizations from "../organizations/index";
import Users from "../users/index";
import Labels from "../labels/index";
import Comments from "../comments/index";
import Status from "../status/index";
import Tasks from "../tasks/index";
import Permissions from "../permissions/index";
import Roles from "../roles/index";
import RolePermissions from "../role-permissions/index";

const app = new Hono().basePath("/api/v1");

export default app as never;

app.route("/organizations", Organizations);
app.route("/users", Users);
app.route("/labels", Labels);
app.route("/status", Status);
app.route("/tasks", Tasks);
app.route("/comments", Comments);
app.route("/permissions", Permissions);
app.route("/roles", Roles);
app.route("/role-permissions", RolePermissions);

export const GET = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
export const PATCH = handle(app);
