"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mbTiles = void 0;
var L_MBTiles_1 = require("./L.MBTiles");
L.TileLayer.MBTiles = L.TileLayer.extend(new L_MBTiles_1.default());
var mbTiles = function (databaseUrl, options) {
    return new L.TileLayer.MBTiles(databaseUrl, options);
};
exports.mbTiles = mbTiles;
L.tileLayer.mbTiles = exports.mbTiles;
