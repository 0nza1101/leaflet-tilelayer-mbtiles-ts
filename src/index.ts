import MBTiles from './L.MBTiles';

declare var L: any;

L.TileLayer.MBTiles = L.TileLayer.extend(new MBTiles());
export const mbTiles = function (databaseUrl: string | ArrayBuffer, options?: L.TileLayerOptions) {
  return new (L.TileLayer as any).MBTiles(databaseUrl, options);
};
L.tileLayer.mbTiles = mbTiles;
