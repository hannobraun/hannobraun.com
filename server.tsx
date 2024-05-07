/** @jsx jsx */

// import { html } from "hono/helper.ts";
import { Hono } from "hono/mod.ts";
// import { jsx } from "hono/middleware.ts";
import { serveStatic } from "hono/middleware.ts";

const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/(.+?)$/, "$1"),
});

// This is the default domain for the Deno Deploy project. I don't want to use
// that.
app.all("/hannobraun.deno.dev/:path", (c) => {
  const { path } = c.req.param();
  return c.redirect(`https://archive.hannobraun.com/${path}`, 308);
});

// Legacy domain
app.all("/archive.braun-odw.eu/:path", (c) => {
  const { path } = c.req.param();
  return c.redirect(`https://archive.hannobraun.com/${path}`, 308);
});

app.use(
  "/archive.hannobraun.com/*",
  serveStatic({ root: "./" }),
);

// const Layout = () =>
//   html`<!DOCTYPE html>
//   <html lang="en">
//     <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />

//         <title>stuff.hannobraun.com</title>
//     </head>
//     <body>
//       <p>Hello, world!</p>
//     </body>
//   </html>`;

// app.get("/", (c) => {
//   return c.html(<Layout />);
// });

Deno.serve(app.fetch);
