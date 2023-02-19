import { createServer } from "http";
import { Client, Server } from "../src";
import { PromisifyRecord } from "../src/client";

describe("client context returns socket object", () => {
  let client: ReturnType<typeof Client>;

  beforeAll(() => {
    client = Client();
  });

  afterAll(() => {
    client._rocketRpcContext.socket.close();
  });

  test("should return the instance of socket", () => {
    const socket = client._rocketRpcContext.socket;

    expect(typeof client.socket).toEqual("function");
    expect(socket.constructor.name).toEqual("Socket");
  });
});

describe("basic example working well", () => {
  const api = {
    hello: () => "Hello World!",
    sum: (x: number, y: number) => x + y,
  };

  // recursively Promisify the return types for this record
  let client: PromisifyRecord<{
    hello: () => string;
    sum: (x: number, y: number) => number;
  }>;

  beforeAll((done) => {
    const httpServer = createServer();
    // @ts-ignore
    Server(httpServer, api);
    httpServer.listen(() => {
      // @ts-ignore
      const port = httpServer.address()?.port;
      client = Client<typeof api>(`http://localhost:${port}`);
      done();
    });
  });

  test("basic functionality should work", async () => {
    // console.log({ hello: await client.hello(), sum: await client.sum(47, 28) });
    expect.assertions(2);
    expect(await client.hello()).toEqual(api.hello());
    expect(await client.sum(47, 28)).toEqual(api.sum(47, 28));
  });
});
