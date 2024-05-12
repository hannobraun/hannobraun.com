export const redirect = {
    permanent: (sources: string[], target: string) => {
        return redirectWithCode(sources, target, 308);
    },
    temporary: (sources: string[], target: string) => {
        return redirectWithCode(sources, target, 307);
    },
};

const redirectWithCode = (sources: string[], target: string, code: number) => {
    return (request: Request, url: URL) => {
        for (const source of sources) {
            if (url.hostname == source) {
                return Response.redirect(
                    `https://${target}${url.pathname}`,
                    code,
                );
            }
        }

        return request;
    };
};
