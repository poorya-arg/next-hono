import { Hono } from "hono";
import { handle } from "hono/vercel";
import Organizations from "../organizations/index";
import Users from "../users/index";

const app = new Hono().basePath("/api/v1");

export default app as never;

app.route("/organizations", Organizations);
app.route("/users", Users);

export const GET = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
