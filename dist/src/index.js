"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.Client = void 0;
const index_1 = __importDefault(require("./client/index"));
exports.Client = index_1.default;
const index_2 = __importDefault(require("./server/index"));
exports.Server = index_2.default;
