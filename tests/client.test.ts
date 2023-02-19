import Client from "../src/client/index";

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
