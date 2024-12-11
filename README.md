# RocketRPC 🚀 - A fast and secure RPC to expose server data to a client.

![Frame 8175 (1)](https://user-images.githubusercontent.com/22196279/219864833-74471e79-8afe-446a-95f6-7d37ef007e97.png)

RocketRPC is typesafe RPC library which gets out of your way. Define methods in your server, which you can access instantly in your client - complete with auto-completions and type-checking.

## Usage

https://user-images.githubusercontent.com/22196279/218526614-2b971301-0a72-4092-88d0-e47a8f29e3b6.mp4

## Talk

Click on the image below to watch @akash-joshi talk about RocketRPC at Svelte London:

<p align="center">
  <a href="https://youtu.be/RkQ_f7XxdMI?t=2632">
    <img alt="Talk" src="https://user-images.githubusercontent.com/22196279/226218558-f7a325a2-a051-4f06-9bc5-089051f1a48f.jpg" height="350">
  </a>
</p>

### Installation

Install the package

```sh
npm i rocketrpc
```

### Client

> Note: On the client side, all functions return a Promise with the result by default, because of the asynchronous nature of sockets. So, all passed functions are also modified to return a Promise.

```ts
import { Client } from "rocketrpc";
import { API } from "../server";

const client = Client<API>("http://localhost:8080");

const { listFiles, prisma } = client;

const main = async () => {
  // use prisma on the client
  console.log(await prisma.user.findMany());

  // passing multiple parameters to the function
  console.log(await client.sum(12, 20));

  // get server details
  console.log(await listFiles());
};

main();
```

### Server

```ts
import { Server } from "rocketrpc";
import { PrismaClient } from "@prisma/client";

import listFiles from "./apis/listFiles";

const api = {
  // initialize Prisma once
  prisma: new PrismaClient();

  sum: (x: number, y: number) => x + y,

  // Fetch all files on server
  listFiles,
};

export type API = typeof api;

Server(8080, api);
```

## Error Handling

At the moment, any error on the server-side is sent to `std:error` and thrown on the client side.

Try running the examples locally!

## Metadata Context

### Socket Client

The socket.io client being used by rocketRPC is accessible via the `_rocketRpcContext` key.

## How does it work internally?

In short, the library depends on Websockets, Object Proxies, and Typescript generics to work. In detail:

### 1. Websockets

We use socket.io for fast and reliable socket connections. Websockets can be lighter than HTTP requests when a large number of connections are needed. Also, they have a smaller code footprint than HTTP requests. Their usage is anyways abstracted away in the codebase, and they can be replaced with any other technology if needed.

### 2. Object Proxies

The framework utilizes Object Proxies get control over the client object. Any function call made on a property of the client object (or on a deconstructed property), like

```ts
client.functionOne();

// or

const { functionOne } = client;
functionOne();
```

is handled by a `get` property which has been set on the Object Proxy [here](https://github.com/akash-joshi/functions-without-borders/blob/45ed7558845b6dbf03fc368b96ca175262956051/src/client/index.ts#L33).

You can go through the code to see how it uses the property name and parameters to make a socket call to the server.

### 3. Typescript Generics

All of the auto-complete goodness that the framework provides throughout the app depends on Typescript generics. On the server side, the type is directly applied on the API object,

```ts
const api: API = { ...yourApi };
```

while on the client side it's passed to the `Client` initializer.

```ts
const client = Client<API>(endpoint);
```

The client function is actually a generic, which accepts the type provided by the user and applies `Promise` to the return type of each of them. It's a very Typescript-specific piece of code but you can read it [here](https://github.com/akash-joshi/functions-without-borders/blob/01553873cd1a1f1acc66270c5521a74b58680be0/src/client/index.ts#L3).

## Sponsors

If you find RocketRPC enjoyable to work with and wish to show your support for the project, you can express your gratitude by sponsoring it through [GitHub Sponsors](https://github.com/sponsors/akash-joshi)!

Furthermore, if your company is currently utilizing RocketRPC and would like to support its long-term maintenance, please refer to the [sponsorship tiers](https://github.com/sponsors/akash-joshi).

<table>
  <tr>
   <td align="center"><a href="https://rocketconnect.co.uk/?ref=rocketrpc"><img src="https://avatars.githubusercontent.com/u/96782953?v=4&s=200" width="200" alt="RocketConnect"/><br />RocketConnect</a></td>
  </tr>
</table>

## Contributing

Pull requests are welcome. You'll probably find lots of improvements to be made.

Open issues for feedback, requesting features, reporting bugs or discussing ideas.
