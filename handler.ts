import { serveDir } from "std/http/file_server.ts";

export const handler = (request: Request) => {
  const pipeline = new Pipeline(request)
    .on_request((request, url) =>
      serveStatic("archive.hannobraun.com", request, url)
    ).on_request((request, url) =>
      redirect("hannobraun.deno.dev", archive.hostname, request, url)
    ).on_request((request, url) =>
      redirect("archive.braun-odw.eu", archive.hostname, request, url)
    );

  if (
    pipeline.request instanceof Response || pipeline.request instanceof Promise
  ) {
    return pipeline.request;
  }

  return new Response("not found", { status: 404 });
};

class Pipeline {
  request: PipelineRequest;
  url: URL;

  constructor(request: Request) {
    this.request = request;
    this.url = new URL(request.url);
  }

  on_request(f: (request: Request, url: URL) => PipelineRequest): Pipeline {
    if (this.request instanceof Request) {
      this.request = f(this.request, this.url);
    }

    return this;
  }
}

type PipelineRequest = Request | Response | Promise<Response>;

const serveStatic = (
  hostname: string,
  req: Request,
  url: URL,
) => {
  if (url.hostname == hostname) {
    return serveDir(req, { fsRoot: hostname });
  }

  return req;
};

const redirect = (
  source: string,
  target: string,
  req: Request | Response | Promise<Response>,
  url: URL,
) => {
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
