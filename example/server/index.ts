import { Server } from "../../src/index";
import { API } from "../api";
import listFiles from "./apis/listFiles";
import searchMovie from "./apis/searchMovie";

const api: API = {
  hello: () => "Hello World!",
  sum: (x, y) => x + y,
  // Make an API call to movies API
  searchMovie: searchMovie,
  // Fetch all files on server
  listFiles: listFiles,
  errorFunction: (a: unknown) => a.b,
};

Server(8080, api);
