import { Server } from "../../../src/index";
import { api } from "./api";

Server({
  server: 8080,
  api,
});
