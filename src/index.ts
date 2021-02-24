import _MBTiles, { MBTilesEvents as _MBTilesEvents } from './MBTiles';


declare var L: any;

/**
 * A factory for L.TileLayer.MBTiles
 * @param {string | ArrayBuffer} urlOrData
 * @param {L.TileLayerOptions} opts
 * @returns {MBTiles}
 */
const _mbTiles = (urlOrData: string | ArrayBuffer , opts: L.TileLayerOptions) => Reflect.construct(_MBTiles, [urlOrData, opts]);

L.TileLayer.MBTiles = _MBTiles;
L.tileLayer.mbTiles = _mbTiles;

export const MBTiles =  _MBTiles;
export const mbTiles = _mbTiles;
export const MBTilesEvents = _MBTilesEvents;
export default { MBTiles, mbTiles, MBTilesEvents };