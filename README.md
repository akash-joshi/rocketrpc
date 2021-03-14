# functions-over-websockets

A typesafe websocket RPC library for your browser and nodejs applications.

## Usage

### Common

1. Define an interface for your api which is accessable in your client and server source code (e.g. by using yarn workspaces).

```ts
   export type API = { 
     hello: () => string; 
     world: () => string 
  };
```

### Client

```ts
import "module-alias/register";

import Client from "@root/src/client";
import { API } from "../api";

const client = Client<API>();

const main = async () => {
  console.log(await client.hello());
  console.log(await client.world());
};

main();
```

### Server

```ts
import "module-alias/register";

import Server from "@root/src/server";
import { API } from "../api";

const api: API = {
  hello: () => "Hello World",
  world: () => "World Hello",
};

Server(8080, api);
```

## Contributing

Pull requests are welcome. You'll probably find lots of improvements to be made.

Open issues for feedback, requesting features, reporting bugs or discussing ideas.

Special thanks to [@mkrhere](https://github.com/mkrhere) for hand-holding me through most of the code.
