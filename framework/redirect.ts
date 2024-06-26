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
    return new Target(target);
};

const redirectWithCode = (selector: Selector, target: Target, code: number) => {
    return (request: Request, url: URL) => {
        if (selector.select(url)) {
            const builtTarget = target.buildTarget(url);
            return Response.redirect(builtTarget, code);
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

    andPathPrefixes(pathPrefixes: string[]): Selector {
        this.selectorFns.push((url: URL) => {
            for (const pathPrefix of pathPrefixes) {
                if (url.pathname.startsWith(pathPrefix)) {
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

class Target {
    targetFns: ((url: URL) => string)[];

    constructor(target: string) {
        this.targetFns = [(_url: URL) => {
            return `${target}`;
        }];
    }

    plusPath(): Target {
        this.targetFns.push((url) => {
            return url.pathname;
        });

        return this;
    }

    buildTarget(url: URL): string {
        let target = "";

        for (const targetFn of this.targetFns) {
            target = target.concat(targetFn(url));
        }

        return target;
    }
}
