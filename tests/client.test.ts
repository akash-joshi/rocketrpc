import { createServer } from "http";
import { Client, Server } from "../src";
import { PromisifyRecord } from "../src/client";

describe("basic example works with closing connections", () => {
  const api = {
    hello: () => "Hello World!",
    sum: (x: number, y: number) => x + y,
  };

  // recursively Promisify the return types for this record
  let client: PromisifyRecord<{
    hello: () => string;
    sum: (x: number, y: number) => number;
  }>;

  let server: ReturnType<typeof Server>;

  beforeAll((done) => {
    const httpServer = createServer();
    server = Server(httpServer, api);
    httpServer.listen(() => {
      const address = httpServer.address();
      const port = typeof address === "string" ? address : address?.port;
      client = Client<typeof api>(`http://localhost:${port}`);
      done();
    });
  });

  afterAll(() => {
    client._rocketRpcContext.closeConnection();
    server.closeConnection();
  });

  test("basic functionality should work", async () => {
    expect.assertions(2);
    expect(await client.hello()).toEqual(api.hello());
    expect(await client.sum(47, 28)).toEqual(api.sum(47, 28));
  });
});
