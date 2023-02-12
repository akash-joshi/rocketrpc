import Client from "@root/src/client";
import { API } from "./server";

const client = Client<API>("http://localhost:3000");

const main = async () => {
  fetch("http://localhost:3000")
    .then((response) => response.text())
    .then(console.log);

  console.log(await client.myFunction("rocketssss"));
};

main();
