export const redirect = {
    permanent: (selector: SelectorFn, target: string) => {
        return redirectWithCode(selector, target, 308);
    },
    temporary: (selector: SelectorFn, target: string) => {
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

const redirectWithCode = (
    selector: SelectorFn,
    target: string,
    code: number,
) => {
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

interface SelectorFn {
    (url: URL): boolean;
}
