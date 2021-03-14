"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function Server(endpoint = 8080, api) {
    const io = new socket_io_1.Server(endpoint);
    io.on("connection", (socket) => {
        console.log("Client connected successfully");
        socket.on("function-call", (msg) => __awaiter(this, void 0, void 0, function* () {
            const { id, procedureName, params, } = msg;
            const procedure = api[procedureName];
            try {
                const result = yield procedure(...params);
                socket.emit("function-response", {
                    id,
                    result,
                    status: 200,
                });
            }
            catch (error) {
                console.error(error);
                socket.emit("function-response", {
                    id,
                    error: error.toString(),
                    status: 500,
                });
            }
        }));
    });
}
exports.default = Server;
