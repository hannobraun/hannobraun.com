import { assertEquals } from "std/assert/mod.ts";

import { handler } from "./handler.ts";

Deno.test("redirect default domain", async () => {
  const req = new Request("https://hannobraun.deno.dev");
  const res = await handler(req);

  assertEquals(res.status, 308);
  assertEquals(res.headers.get("location"), "https://archive.hannobraun.com/");
});

Deno.test("redirect legacy archive domain", async () => {
  const req = new Request("https://archive.braun-odw.eu");
  const res = await handler(req);

  assertEquals(res.status, 308);
  assertEquals(res.headers.get("location"), "https://archive.hannobraun.com/");
});

// I've had some bad experiences with framework in the past, so let's just make
// sure that I'm handling all kinds of variants correctly. Once I extract some
// better infrastructure code, I can convert this into more targeted tests for
// that.

Deno.test("redirect default domain - /a", async () => {
  const req = new Request("https://hannobraun.deno.dev/a");
  const res = await handler(req);

  assertEquals(res.status, 308);
  assertEquals(res.headers.get("location"), "https://archive.hannobraun.com/a");
});

Deno.test("redirect default domain - /a/", async () => {
  const req = new Request("https://hannobraun.deno.dev/a/");
  const res = await handler(req);

  assertEquals(res.status, 308);
  assertEquals(
    res.headers.get("location"),
    "https://archive.hannobraun.com/a/",
  );
});

Deno.test("redirect default domain - /a/b/c", async () => {
  const req = new Request("https://hannobraun.deno.dev/a/b/c");
  const res = await handler(req);

  assertEquals(res.status, 308);
  assertEquals(
    res.headers.get("location"),
    "https://archive.hannobraun.com/a/b/c",
  );
});
