import "module-alias/register";

import Client from "@root/src/client";

const client = Client<any>();

const main = async () => {
  console.log(await client.hello());
};

main();
