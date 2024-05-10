import { serveDir } from "std/http/file_server.ts";

export const handler = (request: Request) => {
    const response = new Pipeline(request)
        .on_request(serveStatic("archive.hannobraun.com"))
        .on_request(redirect(["hannobraun.deno.dev"], archive.hostname))
        .on_request(redirect(["archive.braun-odw.eu"], archive.hostname))
        .or_else(() => new Response("not found", { status: 404 }));

    return response;
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

    or_else(f: () => Response): Response | Promise<Response> {
        if (this.request instanceof Request) {
            return f();
        }

        return this.request;
    }
}

type PipelineRequest = Request | Response | Promise<Response>;

const serveStatic = (hostname: string) => {
    return (request: Request, url: URL) => {
        if (url.hostname == hostname) {
            return serveDir(request, { fsRoot: hostname });
        }

        return request;
    };
};

const redirect = (
    sources: string[],
    target: string,
) => {
    return (request: Request, url: URL) => {
        for (const source of sources) {
            if (url.hostname == source) {
                return Response.redirect(
                    `https://${target}${url.pathname}`,
                    308,
                );
            }
        }

        return request;
    };
};

const archive = {
    hostname: "archive.hannobraun.com",
};
