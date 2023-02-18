import { PrismaClient } from "@prisma/client";
import Server from "@root/src/server";

const api = {
  prisma: new PrismaClient(),
  ping: (arg: string) => {
    return `Pong - ${arg}`;
  },
};

export type API = typeof api;

Server({
  server: 8080,
  api,
  meta: {
    serverOptions: {
      cors: {
        origin: "*",
      },
    },
  },
});
