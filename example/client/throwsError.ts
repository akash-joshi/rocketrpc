import { Client } from "../../src";
import { API } from "../api";

const client = Client<API>();

const main = async () => {
  console.log(await client.errorFunction());
};

main();
