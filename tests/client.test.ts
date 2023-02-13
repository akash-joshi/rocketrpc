import Client from "../src/client/index";

describe("client", () => {
  let client: ReturnType<typeof Client>;

  beforeAll(() => {
    client = Client();
  });

  afterAll(() => {
    client.socket.close();
  });

  test("should return the instance of socket", () => {
    const socket = client.socket;

    expect(socket.constructor.name).toEqual("Socket");
  });
});
