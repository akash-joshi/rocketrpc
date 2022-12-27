import type { Server as http } from "https";
import { Server as SocketServer } from "socket.io";

type port = number;

export default function Server(
  endpoint: http | port = 8080,
  api: { [key: string]: (...params: any[]) => unknown }
) {
  const io = new SocketServer(endpoint);

  io.on("connection", (socket) => {
    console.log("Client connected successfully");

    socket.on("function-call", async (msg) => {
      const {
        id,
        procedureName,
        params,
      }: { id: string; procedureName: string; params: any[] } = msg;

      const procedure = api[procedureName];

      try {
        const result = await procedure(...params);

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
