import { Client } from "../../src/index";
import { API } from "../api";

const client = Client<API>("http://localhost:8080");

const { listFiles, searchMovie } = client;

const main = async () => {
  console.log(await client.hello());
  console.log(await client.sum(12, 20));
  console.log(await listFiles());
  console.log(await searchMovie("kong"));
};

main();
