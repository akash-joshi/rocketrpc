import { io, Socket } from "socket.io-client";
import { FunctionCallParams } from "../types";

// Define a generic type `PromisifyRecord<T>`
export type PromisifyRecord<T> = {
  // For each key in the input type `T`, `K`, determine the type of the corresponding value
  [K in keyof T]-?: T[K] extends (...args: any[]) => any
    ? // If the value is a function,
      ReturnType<T[K]> extends Promise<any>
      ? // If the return type of the function is already a Promise, leave it as-is
        T[K]
      : // Otherwise, convert the function to return a Promise
        (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>
    : // If the value is an object, recursively convert it to a PromisifiedRecord
    T[K] extends object
    ? PromisifyRecord<T[K]>
    : never;
} & {
  _rocketRpcContext: RocketRPCContext;
};

export default function Client<
  API extends Record<string | symbol | number, unknown>
  >(endpoint: string = "http://localhost:8080") {
    const socket = io(endpoint);

  const queue: { [key: string]: (value: unknown) => void } = {};

  socket.on("connect", () => {
    console.info("RocketRPC Server Info: Client connected successfully")
  });

  socket.on("function-response", (msg) => {
    const { result, id, status, error } = msg;

    if (status > 200) {
      throw new Error(`ServerError: ${error}`);
    }

    queue[id](result);

    delete queue[id];
  });

  const waitForResult = (id: string, resolve: (value: unknown) => void) => {
    queue[id] = resolve;
  };

  const closeConnection = () => {
    socket.close();
  };

  function ClientProxy(path: string, options: RocketRPCContext): unknown {
    return new Proxy(() => {}, {
      get: function (_, prop) {
        if (path === "_rocketRpcContext" && prop in options) {
          return options[prop as keyof RocketRPCContext];
        }

        return ClientProxy(`${path ? `${path}.` : ""}${String(prop)}`, {
          closeConnection,
          socket,
        });
      },
      apply: function (_, __, argumentsList) {
        console.info(
          `RocketRPC Client Info: Called function at path: ${path} with parameters: ${argumentsList}`
        );
        const id = `${new Date().valueOf()}-${path}-${JSON.stringify(
          argumentsList
        )}`;

        const functionCallParams: FunctionCallParams = {
          id,
          procedurePath: path,
          params: argumentsList,
        };

        socket.emit("function-call", functionCallParams);

        return new Promise((resolve) => waitForResult(id, resolve));
      },
    });
  }

  return ClientProxy("", { closeConnection, socket }) as PromisifyRecord<API>;
}

type RocketRPCContext = {
  closeConnection: () => void;
  /** @deprecated this field might be removed in future versions -
   * https://github.com/akash-joshi/rocketrpc/discussions/17 */
  socket: Socket;
};
