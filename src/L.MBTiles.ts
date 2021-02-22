import * as L from 'leaflet';
import MBTilesReader from './MBTilesReader';
import Utils from './utils';

export enum MBTilesEvent {
    LOADED = 'databaseloaded',
    ERROR = 'databaseerror',
}

type TooglableEvent = { [event: string]: (event?: any) => void }

export default class MBTiles /*extends L.TileLayer*/ {

    public options: any = null;

    private _mbTilesReader: MBTilesReader = null;
    private _imageFormat: string = null;
    private _globalEvents: TooglableEvent = null;

    initialize(databaseUrl: string | ArrayBuffer, options: L.TileLayerOptions) {
        this._mbTilesReader = null;
        L.Util.setOptions(this, options);
        this._loadMBTiles(databaseUrl);
        this._toggleEvents(true);
        // return (L.TileLayer.prototype as any).initialize.call(this, '', options);
    }

    createTile(coords: L.Coords, done: L.DoneCallback) {
        const tile = document.createElement('img');

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
            L.DomEvent.on(tile, 'load', L.Util.bind((<any>this)._tileOnLoad, this, done, tile));
            L.DomEvent.on(tile, 'error', L.Util.bind((<any>this)._tileOnError, this, done, tile));

            tile.src = this.getTileUrl(coords);
        } else {
            (<any>this).on(MBTilesEvent.LOADED, function () {
                L.DomEvent.on(tile, 'load', L.Util.bind((<any>this)._tileOnLoad, this, done, tile));
                L.DomEvent.on(tile, 'error', L.Util.bind((<any>this)._tileOnError, this, done, tile));
    
                tile.src = this.getTileUrl(coords);
            }.bind(this));
        }

        return tile;
    }

    getTileUrl(coords: L.Coords) {
        // const globalTileRange = this.map.getPixelWorldBounds((<any>this)._tileZoom);
        const data = this._mbTilesReader.getTile(coords.x, (<any>this)._globalTileRange.max.y - coords.y, coords.z);

        if (data) {
            return window.URL.createObjectURL(new Blob([data], { type: this._imageFormat }));
        }

        return L.Util.emptyImageUrl;
    }

    private async _loadMBTiles(urlOrData: string | ArrayBuffer) {
        if (typeof urlOrData === 'string') {
            try {
                const response = L.Browser.android ? await Utils.fetchLocal(urlOrData) : await fetch(urlOrData);
                const buffer = await response.arrayBuffer();
                this._openMBTile(buffer);
            } catch (err) {
                (<any>this).fire(MBTilesEvent.ERROR, { error: err });
            }
        } else if (urlOrData instanceof ArrayBuffer) {
            this._openMBTile(urlOrData);
        } else {
            (<any>this).fire(MBTilesEvent.ERROR);
        }
    }

    private _openMBTile(buffer: ArrayBuffer) {
        try {
            this._mbTilesReader = new MBTilesReader(buffer);

            const attribution = this._mbTilesReader.attribution
            if (attribution) {
                this.options.attribution = attribution;
            }

            const minZoom = this._mbTilesReader.minZoom;
            if (minZoom) {
                this.options.minZoom = minZoom;
            }

            const maxZoom = this._mbTilesReader.maxZoom;
            if (maxZoom) {
                this.options.maxZoom = maxZoom;
            }

            const format = this._mbTilesReader.format;
            if (format) {
                this._imageFormat = `image/${format}`;
            } else {
                this._imageFormat = 'image/png';
            }

            (<any>this).fire(MBTilesEvent.LOADED);
        } catch (err) {
            (<any>this).fire(MBTilesEvent.ERROR, { error: err });
        }
    }

    private _toggleEvents(bind: boolean = true) {
        if (this._globalEvents === null) {
            this._globalEvents = {
                [MBTilesEvent.LOADED]: () => {

                },
                [MBTilesEvent.ERROR]: () => {

                },
                'tileunload': (event: L.TileEvent) => {
                    this._revokeTile(event);
                },
                'remove': () => {
                    this._shutdown();
                }
            };
        }
        for (const e in this._globalEvents) {
            if (this._globalEvents.hasOwnProperty(e)) {
                (<any>this)[bind ? 'on' : 'off'](e, this._globalEvents[e])
            }
        }
    }

    private _revokeTile(event: L.TileEvent) {
        if (event.tile && event.tile.src != L.Util.emptyImageUrl) {
            URL.revokeObjectURL(event.tile.src);
        }
    }

    private _shutdown() {
        if (this._mbTilesReader.isLoaded) {
            this._mbTilesReader.close();
            this._toggleEvents(false);
            this._mbTilesReader = null;
        } else {
            (<any>this).on(MBTilesEvent.LOADED, this._shutdown);
        }
    }
}