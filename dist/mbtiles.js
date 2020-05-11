"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SQL = require("sql.js");
class MBTiles {
    constructor(buffer) {
        this.metadataStmt = this.db.prepare('SELECT value FROM metadata WHERE name = :key');
        this.tilesStmt = this.db.prepare('SELECT tile_data FROM tiles WHERE tile_column = :x AND tile_row = :y AND zoom_level = :z');
        const uInt8Array = new Uint8Array(buffer);
        try {
            this.db = new SQL.Database(uInt8Array);
            this.initialized = true;
        }
        catch (e) {
            throw e;
        }
    }
    get isLoaded() {
        return this.initialized;
    }
    getTile(x, y, z) {
        return this.tilesStmt.getAsObject({
            ':x': x,
            ':y': y,
            ':z': z
        }).tile_data;
    }
    getMetadata(key) {
        return this.metadataStmt.getAsObject({
            ':key': key
        });
    }
    get attribution() {
        const value = this.getMetadata('attribution').value.toString();
        return value ? value : null;
    }
    get description() {
        const value = this.getMetadata('description').value.toString();
        return value ? value : null;
    }
    get center() {
        const value = this.getMetadata('center').value.toString().split(',');
        return value ? value : null;
    }
    get format() {
        const value = this.getMetadata('format').value.toString();
        return value ? value : null;
    }
    get bounds() {
        const value = this.getMetadata('bounds').value.toString().split(',');
        return value ? value : null;
    }
    get minZoom() {
        const value = this.getMetadata('minZoom').value.toString();
        return value ? parseInt(value, 10) : null;
    }
    get maxZoom() {
        const value = this.getMetadata('maxZoom').value.toString();
        return value ? parseInt(value, 10) : null;
    }
    get name() {
        const value = this.getMetadata('name').value.toString();
        return value ? value : null;
    }
    close() {
        if (this.initialized) {
            // this.metadataStmt.free();
            // this.tilesStmt.free();
            this.db.close();
        }
    }
}
exports.default = MBTiles;
