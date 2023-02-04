import { io } from "socket.io-client";

// Define a generic type `PromisifiedRecord<T>`
type PromisifyRecord<T> = {
  // For each key in the input type `T`, `K`, determine the type of the corresponding value
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? // If the value is a function,
      ReturnType<T[K]> extends Promise<any>
      ? // If the return type of the function is already a Promise, leave it as-is
        T[K]
      : // Otherwise, convert the function to return a Promise
        (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>
    : // If the value is an object, recursively convert it to a PromisifiedRecord
    T[K] extends object
    ? PromisifyRecord<T[K]>
    : // Otherwise, leave the value as-is
      T[K];
};

export default function Client<
  API extends Record<string | symbol | number, unknown>
>(endpoint: string = "http://localhost:8080") {
  const socket = io(endpoint);

  const queue: { [key: string]: (value: unknown) => void } = {};

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

  const proxyHandler = {
    get(target: PromisifyRecord<API>, propertyName: string | symbol) {
      console.log(proxyHandler, propertyName);
      if (typeof target[propertyName] === "object") {
        return target[propertyName];
      }
      return function (...params: unknown[]) {
        const id = `${new Date().valueOf()}-${propertyName.toString()}-${JSON.stringify(
          params
        )}`;

        const functionCallParameters = {
          procedureName: propertyName,
          params,
          id,
        };

        console.log(functionCallParameters);

        socket.emit("function-call", functionCallParameters);

        return new Promise((resolve) => waitForResult(id, resolve));
      };
    },
    apply: function (target, thisArg, argumentsList) {
      console.log(target, thisArg, argumentsList);
    },
  } as PromisifyRecord<API>;

  const deprecatedProxyHandler = {
    get(_: any, procedureName: any) {
      return function (...params: unknown[]) {
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
  };

  function LogProxy(path: string): unknown {
    return new Proxy(() => {}, {
      get: function (_, prop) {
        return LogProxy(`${path ? `${path}.` : ""}${String(prop)}`);
      },
      apply: function (_, __, argumentsList) {
        console.log(
          `Called function at path: ${path} with parameters: ${argumentsList}`
        );
      },
    });
  }

  return LogProxy("") as PromisifyRecord<API>;
  // new Proxy({}, proxyHandler) as PromisifyRecord<API>;
}
