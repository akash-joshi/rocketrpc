"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
function Client(endpoint = "http://localhost:8080") {
    const socket = socket_io_client_1.io(endpoint);
    const queue = {};
    socket.on("function-response", (msg) => {
        const { result, id, status, error } = msg;
        if (status > 200) {
            throw new Error(`ServerError: ${error}`);
        }
        queue[id](result);
        delete queue[id];
    });
    const waitForResult = (id, resolve) => {
        queue[id] = resolve;
    };
    return new Proxy({}, {
        get(_, procedureName) {
            return function (...params) {
                const id = `${new Date().valueOf()}-${procedureName.toString()}-${JSON.stringify(params)}`;
                socket.emit("function-call", {
                    procedureName,
                    params,
                    id,
                });
                return new Promise((resolve) => waitForResult(id, resolve));
            };
        },
    });
}
exports.default = Client;
