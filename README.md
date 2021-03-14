# functions-over-websockets

A typesafe websocket RPC library for your browser and nodejs applications.

While defining a server's APIs using TS, you can automatically define the frontend's function contracts. These functions can be called "natively", as if they're already present in the frontend itself.

## Usage

### Installation

Install the package

```sh
npm i functions-over-websockets
```

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

> Note: On the client side, all functions return a Promise with the result by default, because of the asynchronous nature of sockets.

```ts
import { Client } from "functions-over-websockets";

const client = Client<API>("http://localhost:8080");

// Functions can also be deconstructed from the clients
const { sum } = client;

const main = async () => {
  console.log(await client.hello());
  console.log(await client.world());
  console.log(await sum(12, 20));
};

main();
```

### Server

```ts
import { Server } from "functions-over-websockets";

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

Special thanks to [@mkrhere](https://github.com/mkrhere) for hand-holding me through most of the code.
