import type { Server as http } from "https";
import { ServerOptions, Server as SocketServer } from "socket.io";

export type FunctionCallParams = {
  id: string;
  procedurePath: string;
  params: any[];
};

export interface ServerInput {
  // Socket.io server or port
  server: http | number;
  // The API to expose
  api: any;
  // Socket.io server options
  meta?: { serverOptions?: Partial<ServerOptions> };
}

export type Context = {
  _rocketRpcContext: { socket: SocketServer };
};

export default function Server(input: ServerInput): Context {
  if (!input.server) {
    throw new Error("RocketRPC Server Error: No server provided");
  }

  if (!input.api) {
    throw new Error("RocketRPC Server Error: No API provided");
  }

  const io = new SocketServer(input.server, input?.meta?.serverOptions);

  io.on("connection", (socket) => {
    console.info("RocketRPC Server Info: Client connected successfully");

    socket.on("function-call", async (msg) => {
      const { id, procedurePath, params }: FunctionCallParams = msg;

      console.info("RocketRPC Server Info: Called function with parameters: ", {
        id,
        procedurePath,
        params,
      });

      const procedureSplit = procedurePath.split(".");
      let procedure = input.api;

      for (const procedureName of procedureSplit) {
        procedure = procedure[procedureName];
      }

      try {
        const result = await procedure(...params);
        console.info(`result for method ${procedurePath}`, { result });

        socket.emit("function-response", {
          id,
          result,
          status: 200,
        });
      } catch (error: any) {
        console.error(error);
        socket.emit("function-response", {
          id,
          error: error.toString(),
          status: 500,
        });
      }
    });
  });

  return {
    _rocketRpcContext: { socket: io },
  };
}
