import type { Server as http } from "https";
import { ServerOptions, Server as SocketServer } from "socket.io";

type port = number;

export type FunctionCallParams = {
  id: string;
  procedurePath: string;
  params: any[];
};

export default function Server(
  endpoint: http | port = 8080,
  api: any,
  meta?: { serverOptions?: Partial<ServerOptions> }
) {
  const io = new SocketServer(endpoint, meta?.serverOptions);
  console.info(
    `Server started on ${
      typeof endpoint === "number" ? `port ${endpoint}` : "given object"
    }.`
  );

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
      let procedure = api;

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
}
