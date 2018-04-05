"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SQL = require("sql.js");
const L = require("leaflet");
/*

🍂class TileLayer.MBTiles

Loads tiles from a [`.mbtiles` file](https://github.com/mapbox/mbtiles-spec).

If they exist in the given file, it will handle the following metadata rows:

*/
class Utils {
    static fetchLocal(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest;
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                resolve(new Response(xhr.response, { status: xhr.status }));
            };
            xhr.onerror = function () {
                reject(new TypeError('Local request failed'));
            };
            xhr.open('GET', url);
            xhr.send(null);
        });
    }
}
exports.Utils = Utils;
L.TileLayer.MBTiles = L.TileLayer.extend({
    initialize: function (databaseUrl, options) {
        this._databaseIsLoaded = false;
        if (typeof databaseUrl === 'string') {
            if (L.Browser.android) {
                Utils.fetchLocal(databaseUrl).then(response => {
                    //console.log("Response: ", response);
                    return response.arrayBuffer();
                }).then(buffer => {
                    //console.log("This: ", this);
                    this._openDB(buffer);
                }).catch(err => {
                    this.fire('databaseerror', { error: err });
                });
            }
            else {
                fetch(databaseUrl).then(response => {
                    return response.arrayBuffer();
                }).then(buffer => {
                    this._openDB(buffer);
                }).catch(err => {
                    this.fire('databaseerror', { error: err });
                });
            }
        }
        else if (databaseUrl instanceof ArrayBuffer) {
            this._openDB(databaseUrl);
        }
        else {
            this.fire('databaseerror');
        }
        this.on('tileunload', (event) => {
            if (event.tile && event.tile.src != L.Util.emptyImageUrl) {
                URL.revokeObjectURL(event.tile.src);
            }
        });
        const closeDb = () => this._db.close();
        this.on('remove', () => {
            if (this._databaseIsLoaded) {
                closeDb();
            }
            else {
                this.on('databaseloaded', closeDb);
            }
        });
        return L.TileLayer.prototype.initialize.call(this, '', options);
    },
    _openDB: function (buffer) {
        try {
            /// This assumes the `SQL` global variable to exist!!
            var uInt8Array = new Uint8Array(buffer);
            this._db = new SQL.Database(uInt8Array);
            this._stmt = this._db.prepare('SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y');
            // Load some metadata (or at least try to)
            var metaStmt = this._db.prepare('SELECT value FROM metadata WHERE name = :key');
            var row;
            row = metaStmt.getAsObject({ ':key': 'attribution' });
            if (row.value) {
                this.options.attribution = row.value;
            }
            row = metaStmt.getAsObject({ ':key': 'minzoom' });
            if (row.value) {
                this.options.minZoom = Number(row.value);
            }
            row = metaStmt.getAsObject({ ':key': 'maxzoom' });
            if (row.value) {
                this.options.maxZoom = Number(row.value);
            }
            row = metaStmt.getAsObject({ ':key': 'format' });
            if (row.value && row.value === 'png') {
                this._format = 'image/png';
            }
            else if (row.value && row.value === 'jpg') {
                this._format = 'image/jpg';
            }
            else {
                // Fall back to PNG, hope it works.
                this._format = 'image/png';
            }
            // 🍂event databaseloaded
            // Fired when the database has been loaded, parsed, and ready for queries
            this.fire('databaseloaded');
            this._databaseIsLoaded = true;
        }
        catch (ex) {
            // 🍂event databaseloaded
            // Fired when the database could not load for any reason. Might contain
            // an `error` property describing the error.
            this.fire('databaseerror', { error: ex });
        }
    },
    createTile: function (coords, done) {
        var tile = document.createElement('img');
        if (this.options.crossOrigin) {
            tile.crossOrigin = '';
        }
        /*
         * Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
         * http://www.w3.org/TR/WCAG20-TECHS/H67
         */
        tile.alt = '';
        /*
         * Set role="presentation" to force screen readers to ignore this
         * https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
         */
        tile.setAttribute('role', 'presentation');
        // In TileLayer.MBTiles, the getTileUrl() method can only be called when
        // the database has already been loaded.
        if (this._databaseIsLoaded) {
            L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
            L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
            tile.src = this.getTileUrl(coords);
        }
        else {
            this.on('databaseloaded', function () {
                L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
                L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
                tile.src = this.getTileUrl(coords);
            }.bind(this));
        }
        return tile;
    },
    getTileUrl: function (coords) {
        // Luckily, SQL execution is synchronous. If not, this code would get
        // much more complicated.
        var row = this._stmt.getAsObject({
            ':x': coords.x,
            ':y': this._globalTileRange.max.y - coords.y,
            ':z': coords.z
        });
        if ('tile_data' in row) {
            return window.URL.createObjectURL(new Blob([row.tile_data], { type: this._format }));
        }
        else {
            return L.Util.emptyImageUrl;
        }
    },
});
/*
🍂factory tileLayer.mbTiles(databaseUrl: String, options: TileLayer options)
Returns a new `L.TileLayer.MBTiles`, fetching and using the database given in `databaseUrl`.
🍂alternative
🍂factory tileLayer.mbTiles(databaseBuffer: Uint8Array, options: TileLayer options)
Returns a new `L.TileLayer.MBTiles`, given a MBTiles database as a javascript binary array.
*/
L.tileLayer.mbTiles = function (databaseUrl, options) {
    return new L.TileLayer.MBTiles(databaseUrl, options);
};
