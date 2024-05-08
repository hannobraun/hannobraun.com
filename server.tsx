import { serveDir } from "std/http/file_server.ts";

Deno.serve((req) => {
  const url = new URL(req.url);

  // Primary domain. Serve from the respective directory.
  if (url.hostname == "archive.hannobraun.com") {
    return serveDir(req, { fsRoot: "archive.hannobraun.com" });
  }

  // This is the default domain for the Deno Deploy project. I don't want to use
  // that.
  if (url.hostname == "hannobraun.deno.dev") {
    return Response.redirect(
      `https://archive.hannobraun.com${url.pathname}`,
      308,
    );
  }

  // These are legacy domains that I want to redirect 1:1 to the new domain.
  if (url.hostname == "archive.braun-odw.eu") {
    return Response.redirect(
      `https://archive.hannobraun.com${url.pathname}`,
      308,
    );
  }

  return new Response("not found", { status: 404 });
});
