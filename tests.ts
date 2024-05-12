import { assertEquals } from "std/assert/mod.ts";

import { handler } from "./handler.ts";

Deno.test("serve archive", async () => {
    const req = new Request("https://archive.hannobraun.com/missile-miner/");
    const res = await handler(req);

    assertEquals(res.status, 200);

    // Consume response, so test doesn't leak resources.
    await res.text();
});

Deno.test("redirect default domain", async () => {
    const req = new Request("https://hannobraun.deno.dev");
    const res = await handler(req);

    assertEquals(res.status, 308);
    assertEquals(
        res.headers.get("location"),
        "https://archive.hannobraun.com/",
    );
});

Deno.test("redirect legacy archive domain", async () => {
    const req = new Request("https://archive.braun-odw.eu");
    const res = await handler(req);

    assertEquals(res.status, 308);
    assertEquals(
        res.headers.get("location"),
        "https://archive.hannobraun.com/",
    );
});

Deno.test("redirect embedded article", async () => {
    const req = new Request("https://www.hannobraun.com/getting-started/");
    const res = await handler(req);

    assertEquals(res.status, 308);
    assertEquals(
        res.headers.get("location"),
        "https://archive.hannobraun.com/embedded-rust/getting-started/",
    );
});

Deno.test("redirect wake-up light articles", async () => {
    const req = new Request(
        "https://www.hannobraun.com/i-enjoyed-making-notebooks/",
    );
    const res = await handler(req);

    assertEquals(res.status, 308);
    assertEquals(
        res.headers.get("location"),
        "https://archive.hannobraun.com/wake-up-light/i-enjoyed-making-notebooks/",
    );
});

// I've had some bad experiences with frameworks in the past, so let's just make
// sure that I'm handling all kinds of variants correctly. Once I extract some
// better infrastructure code, I can convert this into more targeted tests for
// that.

Deno.test("redirect default domain - /a", async () => {
    const req = new Request("https://hannobraun.deno.dev/a");
    const res = await handler(req);

    assertEquals(res.status, 308);
    assertEquals(
        res.headers.get("location"),
        "https://archive.hannobraun.com/a",
    );
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
