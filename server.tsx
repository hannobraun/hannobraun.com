import { Hono } from "hono/mod.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, world!");
});

Deno.serve(app.fetch);
