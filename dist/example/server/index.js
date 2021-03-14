"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const src_1 = require("@root/src");
const api = {
    hello: () => "Hello World!",
    world: () => "World Hello",
    sum: (x, y) => x + y,
    errorFunction: (a) => a.b,
};
src_1.Server(8080, api);
