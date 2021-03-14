import "module-alias/register";

import Client from "@root/src/client";
import { API } from "../api";

const client = Client<API>();

const main = async () => {
  console.log(await client.errorFunction());
};

main();
