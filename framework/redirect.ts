export const redirect = {
    permanent: (selector: Selector, target: string) => {
        return redirectWithCode(selector, target, 308);
    },
    temporary: (selector: Selector, target: string) => {
        return redirectWithCode(selector, target, 307);
    },
};

export const fromHosts = (hosts: string[]) => {
    return new Selector().andHosts(hosts);
};

const redirectWithCode = (selector: Selector, target: string, code: number) => {
    return (request: Request, url: URL) => {
        if (selector.select(url)) {
            return Response.redirect(
                `https://${target}${url.pathname}`,
                code,
            );
        }

        return request;
    };
};

class Selector {
    selectorFns: SelectorFn[] = [];

    andHosts(hosts: string[]): Selector {
        this.selectorFns.push((url: URL) => {
            for (const host of hosts) {
                if (url.hostname == host) {
                    return true;
                }
            }

            return false;
        });

        return this;
    }

    select(url: URL): boolean {
        let selected = true;

        for (const fn of this.selectorFns) {
            selected = selected && fn(url);
        }

        return selected;
    }
}

interface SelectorFn {
    (url: URL): boolean;
}
