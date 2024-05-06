import { Hono } from "https://deno.land/x/hono@v4.3.2/mod.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, world!");
});

Deno.serve(app.fetch);
