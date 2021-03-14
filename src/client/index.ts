import { io } from "socket.io-client";

export default function Client<API>(
  endpoint: string = "http://localhost:8080"
) {
  const socket = io(endpoint);

  const queue: { [key: string]: (value: unknown) => void } = {};

  socket.on("function-response", (msg) => {
    const { result, id } = msg;

    queue[id](result);

    delete queue[id];
  });

  const waitForResult = (id: string, resolve: (value: unknown) => void) => {
    queue[id] = resolve;
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

          return new Promise((resolve) => waitForResult(id, resolve));
        };
      },
    }
  ) as API;
}
