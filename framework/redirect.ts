export const redirect = {
    permanent: (selector: Selector, target: Target) => {
        return redirectWithCode(selector, target, 308);
    },
    temporary: (selector: Selector, target: Target) => {
        return redirectWithCode(selector, target, 307);
    },
};

export const fromHosts = (hosts: string[]) => {
    return new Selector().andHosts(hosts);
};

export const to = (target: string) => {
    return new Target((url: URL) => {
        return `${target}${url.pathname}`;
    });
};

const redirectWithCode = (selector: Selector, target: Target, code: number) => {
    return (request: Request, url: URL) => {
        if (selector.select(url)) {
            return Response.redirect(
                target.buildTarget(url),
                code,
            );
        }

        return request;
    };
};

class Selector {
    selectorFns: ((url: URL) => boolean)[] = [];

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

    andPathPrefix(pathPrefix: string): Selector {
        this.selectorFns.push((url: URL) => {
            console.log(url);
            console.log(url.pathname.startsWith(pathPrefix));
            return url.pathname.startsWith(pathPrefix);
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

class Target {
    targetFn: (url: URL) => string;

    constructor(targetFn: (url: URL) => string) {
        this.targetFn = targetFn;
    }

    buildTarget(url: URL): string {
        return this.targetFn(url);
    }
}
