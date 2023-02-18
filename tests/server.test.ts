import Server from "../src/server/index";

describe("server", () => {
  describe("validation", () => {
    test("should throw an error if no server is provided", () => {
      // @ts-ignore
      expect(() => Server({})).toThrowError(
        "RocketRPC Server Error: No server provided"
      );
    });

    test("should throw an error if no api is provided", () => {
      expect(() =>
        // @ts-ignore
        Server({
          server: 3000,
        })
      ).toThrowError("RocketRPC Server Error: No API provided");
    });
  });

  describe("default socket", () => {
    let server: ReturnType<typeof Server>;

    beforeAll(() => {
      server = Server({
        server: 3000,
        api: {},
      });
    });

    afterAll(() => {
      server._rocketRpcContext.socket.close();
    });

    test("should return the instance of socket server", () => {
      const socket = server._rocketRpcContext.socket;

      expect(socket.constructor.name).toEqual("Server");
    });
  });
});
