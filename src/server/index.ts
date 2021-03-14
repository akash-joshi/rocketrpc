import type { Server as http } from "http";
import { Server as SocketServer } from "socket.io";

type port = number;

export default function Server(endpoint: http | port = 8080, api: any) {
  const io = new SocketServer(endpoint);

  io.on("connection", (socket) => {
    console.log("Client connected successfully");

    socket.on("function-call", async (msg) => {
      console.log(msg);

      const { id, procedureName, params } = msg;

      const procedure = api[procedureName];

      const result = await procedure(...params);

      console.log(result, socket.id);

      socket.emit("function-response", {
        id,
        result,
      });
    });
  });
}
