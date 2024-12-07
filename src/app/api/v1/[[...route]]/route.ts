import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/v1");

export default app as never;

export const GET = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
