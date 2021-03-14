import "module-alias/register";

import { Server } from "@root/src";
import { API } from "../api";

const api: API = {
  hello: () => "Hello World!",
  world: () => "World Hello",
  sum: (x, y) => x + y,
  errorFunction: (a: any) => a.b,
};

Server(8080, api);
