import { io } from "socket.io-client";

export default function Client<API>(
  endpoint: string = "http://localhost:8080"
) {
  const socket = io(endpoint);

  const queue: any = {};

  socket.on("function-response", (msg) => {
    const { result, id } = msg;

    queue[id](result);
  });

  const waitForResult = (id: string, onResponse: any) => {
    queue[id] = onResponse;
  };

  return new Proxy(
    {},
    {
      get(_, procedureName) {
        return function (...params: any[]) {
          const id = `${new Date().valueOf()}-${procedureName.toString()}-${JSON.stringify(
            params
          )}`;

          socket.emit("function-call", {
            procedureName,
            params,
            id,
          });

          const onResponse = (result: any) => Promise.resolve(result);

          queue[id] = onResponse;

          return new Promise((resolve) => waitForResult(id, resolve));
        };
      },
    }
  ) as API;
}
