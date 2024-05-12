export const redirect = {
    permanent: (selector: Selector, target: string) => {
        return redirectWithCode(selector, target, 308);
    },
    temporary: (selector: Selector, target: string) => {
        return redirectWithCode(selector, target, 307);
    },
};

export const fromHosts = (hosts: string[]) => {
    return (url: URL) => {
        for (const host of hosts) {
            if (url.hostname == host) {
                return true;
            }
        }

        return false;
    };
};

const redirectWithCode = (selector: Selector, target: string, code: number) => {
    return (request: Request, url: URL) => {
        if (selector(url)) {
            return Response.redirect(
                `https://${target}${url.pathname}`,
                code,
            );
        }

        return request;
    };
};

interface Selector {
    (url: URL): boolean;
}
