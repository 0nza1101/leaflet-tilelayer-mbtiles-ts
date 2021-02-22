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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MBTilesEvent = void 0;
var L = require("leaflet");
var MBTilesReader_1 = require("./MBTilesReader");
var utils_1 = require("./utils");
var MBTilesEvent;
(function (MBTilesEvent) {
    MBTilesEvent["LOADED"] = "databaseloaded";
    MBTilesEvent["ERROR"] = "databaseerror";
})(MBTilesEvent = exports.MBTilesEvent || (exports.MBTilesEvent = {}));
var MBTiles /*extends L.TileLayer*/ = /** @class */ (function () {
    function MBTiles() {
        this.options = null;
        this._mbTilesReader = null;
        this._imageFormat = null;
        this._globalEvents = null;
    }
    MBTiles.prototype.initialize = function (databaseUrl, options) {
        this._mbTilesReader = null;
        L.Util.setOptions(this, options);
        this._loadMBTiles(databaseUrl);
        this._toggleEvents(true);
        // return (L.TileLayer.prototype as any).initialize.call(this, '', options);
    };
    MBTiles.prototype.createTile = function (coords, done) {
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
        if (this._mbTilesReader && this._mbTilesReader.isLoaded) {
            L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
            L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
            tile.src = this.getTileUrl(coords);
        }
        else {
            this.on(MBTilesEvent.LOADED, function () {
                L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
                L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
                tile.src = this.getTileUrl(coords);
            }.bind(this));
        }
        return tile;
    };
    MBTiles.prototype.getTileUrl = function (coords) {
        // const globalTileRange = this.map.getPixelWorldBounds((<any>this)._tileZoom);
        var data = this._mbTilesReader.getTile(coords.x, this._globalTileRange.max.y - coords.y, coords.z);
        if (data) {
            return window.URL.createObjectURL(new Blob([data], { type: this._imageFormat }));
        }
        return L.Util.emptyImageUrl;
    };
    MBTiles.prototype._loadMBTiles = function (urlOrData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, buffer, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof urlOrData === 'string')) return [3 /*break*/, 9];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        if (!L.Browser.android) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.default.fetchLocal(urlOrData)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, fetch(urlOrData)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        response = _a;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 6:
                        buffer = _b.sent();
                        this._openMBTile(buffer);
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        this.fire(MBTilesEvent.ERROR, { error: err_1 });
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (urlOrData instanceof ArrayBuffer) {
                            this._openMBTile(urlOrData);
                        }
                        else {
                            this.fire(MBTilesEvent.ERROR);
                        }
                        _b.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    MBTiles.prototype._openMBTile = function (buffer) {
        try {
            this._mbTilesReader = new MBTilesReader_1.default(buffer);
            var attribution = this._mbTilesReader.attribution;
            if (attribution) {
                this.options.attribution = attribution;
            }
            var minZoom = this._mbTilesReader.minZoom;
            if (minZoom) {
                this.options.minZoom = minZoom;
            }
            var maxZoom = this._mbTilesReader.maxZoom;
            if (maxZoom) {
                this.options.maxZoom = maxZoom;
            }
            var format = this._mbTilesReader.format;
            if (format) {
                this._imageFormat = "image/" + format;
            }
            else {
                this._imageFormat = 'image/png';
            }
            this.fire(MBTilesEvent.LOADED);
        }
        catch (err) {
            this.fire(MBTilesEvent.ERROR, { error: err });
        }
    };
    MBTiles.prototype._toggleEvents = function (bind) {
        var _a;
        var _this = this;
        if (bind === void 0) { bind = true; }
        if (this._globalEvents === null) {
            this._globalEvents = (_a = {},
                _a[MBTilesEvent.LOADED] = function () {
                },
                _a[MBTilesEvent.ERROR] = function () {
                },
                _a['tileunload'] = function (event) {
                    _this._revokeTile(event);
                },
                _a['remove'] = function () {
                    _this._shutdown();
                },
                _a);
        }
        for (var e in this._globalEvents) {
            if (this._globalEvents.hasOwnProperty(e)) {
                this[bind ? 'on' : 'off'](e, this._globalEvents[e]);
            }
        }
    };
    MBTiles.prototype._revokeTile = function (event) {
        if (event.tile && event.tile.src != L.Util.emptyImageUrl) {
            URL.revokeObjectURL(event.tile.src);
        }
    };
    MBTiles.prototype._shutdown = function () {
        if (this._mbTilesReader.isLoaded) {
            this._mbTilesReader.close();
            this._toggleEvents(false);
            this._mbTilesReader = null;
        }
        else {
            this.on(MBTilesEvent.LOADED, this._shutdown);
        }
    };
    return MBTiles;
}());
exports.default = MBTiles;
