import * as L from 'leaflet';
export declare enum MBTilesEvent {
    LOADED = "databaseloaded",
    ERROR = "databaseerror"
}
export default class MBTiles {
    options: any;
    private _mbTilesReader;
    private _imageFormat;
    private _globalEvents;
    initialize(databaseUrl: string | ArrayBuffer, options: L.TileLayerOptions): void;
    createTile(coords: L.Coords, done: L.DoneCallback): HTMLImageElement;
    getTileUrl(coords: L.Coords): string;
    private _loadMBTiles;
    private _openMBTile;
    private _toggleEvents;
    private _revokeTile;
    private _shutdown;
}
