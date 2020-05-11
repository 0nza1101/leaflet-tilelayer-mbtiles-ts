"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const mbtiles_1 = require("./mbtiles");
/*

🍂class TileLayer.MBTiles

Loads tiles from a [`.mbtiles` file](https://github.com/mapbox/mbtiles-spec).

If they exist in the given file, it will handle the following metadata rows:

*/
L.TileLayer.MBTiles = L.TileLayer.extend({
    initialize: function (databaseUrl, options) {
        this._databaseIsLoaded = false;
        if (typeof databaseUrl === 'string') {
            if (L.Browser.android) {
                utils_1.default.fetchLocal(databaseUrl)
                    .then(response => response.arrayBuffer())
                    .then(buffer => this.openMBTile(buffer))
                    .catch(err => this.fire('databaseerror', { error: err }));
            }
            else {
                fetch(databaseUrl)
                    .then(response => response.arrayBuffer())
                    .then(buffer => this.openMBTile(buffer))
                    .catch(err => this.fire('databaseerror', { error: err }));
            }
        }
        else if (databaseUrl instanceof ArrayBuffer) {
            this.openMBTile(databaseUrl);
        }
        else {
            this.fire('databaseerror');
        }
        this.on('tileunload', (event) => {
            if (event.tile && event.tile.src != L.Util.emptyImageUrl) {
                URL.revokeObjectURL(event.tile.src);
            }
        });
        const closeDb = () => this._mbtiles.close();
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
    openMBTile: function (buffer) {
        try {
            this._mbtiles = new mbtiles_1.default(buffer);
            const attribution = this._mbtiles.attribution;
            if (attribution) {
                this.options.attribution = attribution;
            }
            const minZoom = this._mbtiles.minZoom;
            if (minZoom) {
                this.options.minZoom = minZoom;
            }
            const maxZoom = this._mbtiles.maxZoom;
            if (maxZoom) {
                this.options.maxZoom = maxZoom;
            }
            const format = this._mbtiles.format;
            if (format) {
                this._format = `image/${format}`;
            }
            else {
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
        var data = this._mbtiles.getTile(coords.x, this._globalTileRange.max.y - coords.y, coords.z);
        if (data) {
            return window.URL.createObjectURL(new Blob([data], { type: this._format }));
        }
        else {
            return L.Util.emptyImageUrl;
        }
    }
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
