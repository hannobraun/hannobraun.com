import { serveDir } from "std/http/file_server.ts";

import { fromHosts, redirect, to } from "./framework/redirect.ts";

export const handler = (request: Request) => {
    const response = new Pipeline(request)
        .onRequest(
            redirect.temporary(
                fromHosts(["hannobraun.com"]),
                to("https://www.hannobraun.com").plusPath(),
            ),
        )
        .onRequest(
            redirect.permanent(
                fromHosts(["www.hannobraun.com"]).andPathPrefix(
                    "/getting-started",
                ),
                to("https://archive.hannobraun.com/embedded-rust").plusPath(),
            ),
        )
        .onRequest(serveStatic("archive.hannobraun.com"))
        .onRequest(
            redirect.permanent(
                fromHosts(["hannobraun.deno.dev", "archive.braun-odw.eu"]),
                to("https://archive.hannobraun.com").plusPath(),
            ),
        )
        .orElse(not_found());

    return response;
};

class Pipeline {
    request: PipelineRequest;
    url: URL;

    constructor(request: Request) {
        this.request = request;
        this.url = new URL(request.url);
    }

    onRequest(f: (request: Request, url: URL) => PipelineRequest): Pipeline {
        if (this.request instanceof Request) {
            this.request = f(this.request, this.url);
        }

        return this;
    }

    orElse(f: () => Response): PipelineResponse {
        if (this.request instanceof Request) {
            return f();
        }

        return this.request;
    }
}

type PipelineRequest = Request | PipelineResponse;
type PipelineResponse = Response | Promise<Response>;

const serveStatic = (hostname: string) => {
    return (request: Request, url: URL) => {
        if (url.hostname == hostname) {
            return serveDir(request, { fsRoot: `websites/${hostname}` });
        }

        return request;
    };
};

const not_found = () => {
    return () => new Response("not found", { status: 404 });
};
