import Server from "@root/src/server";

const api = {
  myFunction: (arg: string) => {
    console.log("Im running on the backend" + arg);

    return `here is that string you passed ${arg}`;
  },
};

export type API = typeof api;

Server(8080, api, {
  serverOptions: {
    cors: {
      origin: "*",
    },
  },
});
