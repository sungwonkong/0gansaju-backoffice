/**
 * NextJS Custom Server w/ Express
 * If you don't need a server, you can delete this file.
 */

// import next from "next";
// import express from "express";

// // const port = parseInt(process.env.PORT, 10) || 3000;
// const port = 3000;
// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(async () => {
//   const server = express();

//   server.all("*", (req, res) => {
//     return handle(req, res);
//   });

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });
