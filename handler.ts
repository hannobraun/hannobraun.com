import { serveDir } from "std/http/file_server.ts";

export const handler = (req: Request) => {
  const url = new URL(req.url);

  // Primary domain. Serve from the respective directory.
  if (url.hostname == archive.hostname) {
    return serveDir(req, { fsRoot: archive.hostname });
  }

  // This is the default domain for the Deno Deploy project. I don't want to use
  // that.
  if (url.hostname == "hannobraun.deno.dev") {
    return Response.redirect(
      `https://${archive.hostname}${url.pathname}`,
      308,
    );
  }

  // These are legacy domains that I want to redirect 1:1 to the new domain.
  if (url.hostname == "archive.braun-odw.eu") {
    return Response.redirect(
      `https://${archive.hostname}${url.pathname}`,
      308,
    );
  }

  return new Response("not found", { status: 404 });
};

const archive = {
  hostname: "archive.hannobraun.com",
};
