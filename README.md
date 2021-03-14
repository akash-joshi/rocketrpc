# functions-over-websockets

A typesafe websocket RPC library for your browser and nodejs applications.

While defining a server's APIs using TS, you can automatically define the frontend's function contracts. These functions can be called "natively", as if they're already present in the frontend itself.

## Usage

### Common

Define an interface for your api which is accessable in your client and server source code (e.g. by using yarn workspaces).

```ts
export type API = {
  hello: () => string;
  world: () => string;
  sum: (x: number, y: number) => number;
};
```

### Client

```ts
import "module-alias/register";

import Client from "@root/src/client";

const client = Client<API>("http://localhost:8080");

const main = async () => {
  console.log(await client.hello());
  console.log(await client.world());
  console.log(await client.sum(12, 20));
};

main();
```

### Server

```ts
import "module-alias/register";

import Server from "@root/src/server";

const api: API = {
  hello: () => "Hello World",
  world: () => "World Hello",
  sum: (x, y) => x + y,
};

Server(8080, api);
```

## Error Handling

At the moment, any error on the server-side is sent to `std:error` and thrown on the client side.

Try running `/example/client/throwsError.ts` to check it out.

## What's Not Supported?

1. Passing functions as a parameter. This would require stringifying the function on the frontend and running `eval` on it on the backend, which is an UNSAFE OPERATION.

## Contributing

Pull requests are welcome. You'll probably find lots of improvements to be made.

Open issues for feedback, requesting features, reporting bugs or discussing ideas.

Special thanks to [@mkrhere](https://github.com/mkrhere), with whom this idea was originally ideated, and for helping me through the complex parts of the code. And  thanks to [@sparkenstein](https://github.com/sparkenstein) & [@darvesh](https://github.com/darvesh) for helping me fix and create some complex types in TS.
