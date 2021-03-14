import { Server } from "../../src/index";
import { API } from "../api";

const api: API = {
  hello: () => "Hello World!",
  world: () => "World Hello",
  sum: async (x, y) => x + y,
  errorFunction: (a: any) => a.b,
};

Server(8080, api);
