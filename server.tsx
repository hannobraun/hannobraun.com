/** @jsx jsx */

// import { html } from "hono/helper.ts";
import { Hono } from "hono/mod.ts";
// import { jsx } from "hono/middleware.ts";
import { serveStatic } from "hono/middleware.ts";

const app = new Hono();

app.use("*", serveStatic({ root: "./archive.hannobraun.com" }));

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
