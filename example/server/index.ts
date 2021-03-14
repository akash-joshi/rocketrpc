import "module-alias/register";

import Server from "@root/src/server";

const api = {
  hello: () => "Hello World",
};

Server(8080, api);
