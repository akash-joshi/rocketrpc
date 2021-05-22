# Functions Without Borders - Fonctions sans Frontières (fsf)

![Frame 2](https://user-images.githubusercontent.com/22196279/119225442-6f446400-bb21-11eb-8e63-ae8e62d6dcc9.png)

A typesafe websocket RPC library which thins the borders between clients and servers.

While defining a server's APIs using TS, you can automatically define the frontend's function contracts. These functions can be called "natively", as if they're already present in the frontend itself.

## Usage

### Installation

Install the package

```sh
npm i fsf
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

> Note: On the client side, all functions return a Promise with the result by default, because of the asynchronous nature of sockets. So, all passed functions are also modified to return a Promise.

```ts
import { Client } from "fsf";
import { API } from "../api";

const client = Client<API>("http://localhost:8080");

const { listFiles, searchMovie } = client;

const main = async () => {
  console.log(await client.hello());
  // passing multiple parameters to the function
  console.log(await client.sum(12, 20));
  console.log(await listFiles());
  // passing a string parameter
  console.log(await searchMovie("kong"));
};

main();
```

### Server

```ts
import { Server } from "fsf";
import { API } from "../api";
import listFiles from "./apis/listFiles";
import searchMovie from "./apis/searchMovie";

const api: API = {
  hello: () => "Hello World!",
  sum: (x, y) => x + y,
  // Make an API call to movies API
  searchMovie: searchMovie,
  // Fetch all files on server
  listFiles: listFiles,
  errorFunction: (a: any) => a.b,
};

Server(8080, api);
```

## Error Handling

At the moment, any error on the server-side is sent to `std:error` and thrown on the client side.

Try running `/example/client/throwsError.ts` to check it out.

## What's Not Supported?

1. Passing functions as a parameter. This would require stringifying the function on the frontend and running `eval` on it on the backend, which is an UNSAFE OPERATION.

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

## Contributing

Pull requests are welcome. You'll probably find lots of improvements to be made.

Open issues for feedback, requesting features, reporting bugs or discussing ideas.

Special thanks to [@mkrhere](https://github.com/mkrhere) for hand-holding me through most of the code.
