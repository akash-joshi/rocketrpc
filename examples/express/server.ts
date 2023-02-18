import Server from "@root/src/server";

import express from "express";

const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

const server = require("http").createServer(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const api = {
  ping: (arg: string) => {
    return `Pong - ${arg}`;
  },
};

export type API = typeof api;

Server({
  srv: server,
  api,
});
