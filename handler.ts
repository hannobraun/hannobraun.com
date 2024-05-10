import { serveDir } from "std/http/file_server.ts";

export const handler = async (req: Request) => {
  const pipeline = new Pipeline(req);

  const result = await serveStatic(
    "archive.hannobraun.com",
    pipeline.request,
    pipeline.url,
  );
  if (result instanceof Response) {
    return result;
  }

  const result2 = await redirect(
    "hannobraun.deno.dev",
    archive.hostname,
    pipeline.request,
    pipeline.url,
  );
  if (result2 instanceof Response) {
    return result2;
  }

  const result3 = await redirect(
    "archive.braun-odw.eu",
    archive.hostname,
    pipeline.request,
    pipeline.url,
  );
  if (result3 instanceof Response) {
    return result3;
  }

  return new Response("not found", { status: 404 });
};

class Pipeline {
  request: Request;
  url: URL;

  constructor(req: Request) {
    this.request = req;
    this.url = new URL(req.url);
  }
}

const serveStatic = (
  hostname: string,
  req: Request | Promise<Response>,
  url: URL,
) => {
  if (req instanceof Promise) {
    return req;
  }

  if (url.hostname == hostname) {
    return serveDir(req, { fsRoot: hostname });
  }

  return req;
};

const redirect = (
  source: string,
  target: string,
  req: Request | Promise<Response>,
  url: URL,
) => {
  if (req instanceof Promise) {
    return req;
  }

  if (url.hostname == source) {
    return Response.redirect(
      `https://${target}${url.pathname}`,
      308,
    );
  }

  return req;
};

const archive = {
  hostname: "archive.hannobraun.com",
};
