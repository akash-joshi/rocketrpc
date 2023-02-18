import { io, Socket } from "socket.io-client";
import Client from "../src/client/index";
import crypto from "crypto";

describe("client", () => {
  describe("default socket", () => {
    let client: ReturnType<typeof Client>;

    beforeAll(() => {
      client = Client();
    });

    afterAll(() => {
      client._rocketRpcContext.socket.close();
    });

    test("should return the instance of socket", () => {
      const socket = client._rocketRpcContext.socket;

      expect(client.socket).toEqual({});
      expect(socket.constructor.name).toEqual("Socket");
    });
  });

  describe("custom socket", () => {
    let socket: Socket;

    beforeAll(() => {
      socket = io("http://localhost:3000");
    });

    afterAll(() => {
      socket.close();
    });

    test("should return the provided socket instance", async () => {
      const testValue = crypto.randomBytes(20).toString("hex");

      // @ts-ignore
      socket[testValue] = testValue;

      const client = Client({ socket });

      // @ts-ignore
      expect(client._rocketRpcContext.socket[testValue]).toEqual(testValue);
    });
  });
});
