"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQL = require("sql.js");
var MBTiles = /** @class */ (function () {
    function MBTiles(buffer) {
        var uInt8Array = new Uint8Array(buffer);
        try {
            this.db = new SQL.Database(uInt8Array);
            this.metadataStmt = this.db.prepare('SELECT value FROM metadata WHERE name = :key');
            this.tilesStmt = this.db.prepare('SELECT tile_data FROM tiles WHERE tile_column = :x AND tile_row = :y AND zoom_level = :z');
            this.initialized = true;
        }
        catch (e) {
            throw e;
        }
    }
    Object.defineProperty(MBTiles.prototype, "isLoaded", {
        get: function () {
            return this.initialized;
        },
        enumerable: true,
        configurable: true
    });
    MBTiles.prototype.getTile = function (x, y, z) {
        return this.tilesStmt.getAsObject({
            ':x': x,
            ':y': y,
            ':z': z
        }).tile_data;
    };
    MBTiles.prototype.getMetadata = function (key) {
        return this.metadataStmt.getAsObject({
            ':key': key
        });
    };
    Object.defineProperty(MBTiles.prototype, "attribution", {
        get: function () {
            var value = this.getMetadata('attribution').value.toString();
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "description", {
        get: function () {
            var value = this.getMetadata('description').value.toString();
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "center", {
        get: function () {
            var value = this.getMetadata('center').value.toString().split(',');
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "format", {
        get: function () {
            var value = this.getMetadata('format').value.toString();
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "bounds", {
        get: function () {
            var value = this.getMetadata('bounds').value.toString().split(',');
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "minZoom", {
        get: function () {
            var value = this.getMetadata('minZoom').value;
            return value ? Number(value) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "maxZoom", {
        get: function () {
            var value = this.getMetadata('maxZoom').value;
            return value ? Number(value) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MBTiles.prototype, "name", {
        get: function () {
            var value = this.getMetadata('name').value.toString();
            return value ? value : null;
        },
        enumerable: true,
        configurable: true
    });
    MBTiles.prototype.close = function () {
        if (this.initialized) {
            // this.metadataStmt.free();
            // this.tilesStmt.free();
            this.db.close();
        }
    };
    return MBTiles;
}());
exports.default = MBTiles;
