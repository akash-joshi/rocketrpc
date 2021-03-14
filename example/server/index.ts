import "module-alias/register";

import Server from "@root/src/server";
import { API } from "../api";

const api: API = {
  hello: () => "Hello World!",
  world: () => "World Hello",
  errorFunction: (a: any) => a.b,
};

Server(8080, api);
