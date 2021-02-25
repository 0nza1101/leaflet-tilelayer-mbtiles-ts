import * as L from 'leaflet';
import path from 'path';
import fetchMock from 'jest-fetch-mock';
import { MBTiles, mbTiles as mbtilesFactory, MBTilesEvents } from '../dist/index';
import MBTilesReader from '../dist/MBTilesReader';

jest.mock('sql.js', () => {
  const sample = {
    tile_data: new Uint8Array(0),
    value: new Object('test'),
  };
  return {
    Database: jest.fn(() => {
      return {
        prepare: jest.fn(() => {
          return {
            getAsObject: jest.fn(() => sample),
          };
        }),
      };
    }),
  };
});

describe('Create a leaflet TileLayer using a .mbtiles file', () => {
  const url: string = path.resolve(
    'file://',
    __dirname,
    '../exemple/public/assets/countries-raster.mbtiles'
  );

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Should expose a factory to create new instances', () => {
    const instance = mbtilesFactory(url, {});
    expect(instance).toBeInstanceOf(MBTiles);
  });

  describe('Should follow all the Layer interface', () => {
    let map: L.Map;
    beforeEach(() => (map = L.map(document.createElement('div'))));

    it('Should be able to add it to a map', () => {
      const mb = new MBTiles(url, {});
      expect(map.hasLayer(mb)).toBeFalsy();

      mb.addTo(map);
      expect(map.hasLayer(mb)).toBeTruthy();
    });

    it('Should be removable from maps', () => {
      const mb = new MBTiles(url, {});
      map.addLayer(mb);
      expect(map.hasLayer(mb)).toBeTruthy();

      mb.removeFrom(map);
      expect(map.hasLayer(mb)).toBeFalsy();
    });

    it('Should be removable from the current map', () => {
      const mb = new MBTiles(url, {});
      map.addLayer(mb);
      expect(map.hasLayer(mb)).toBeTruthy();

      mb.remove();
      expect(map.hasLayer(mb)).toBeFalsy();
    });

    it('Should be able to bind custom events', () => {
      const mb = new MBTiles(url, {});
      const onSpy = jest.spyOn(mb, 'on');
      const fireSpy = jest.spyOn(mb, 'fire');

      /*expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(url);

            console.log(mocked(SQL.Database, true).mock);
            const uInt8Array = new Uint8Array(0);
            const db = new SQL.Database(uInt8Array)
            const stmt = db.prepare('SELECT value FROM metadata WHERE name = :key');
            expect(db.prepare).toBeTruthy();
            expect(stmt.getAsObject).toBeTruthy();*/

      expect(onSpy).toHaveBeenCalledTimes(0);
      mb.on(MBTilesEvents.LOADED, () => null);
      mb.on(MBTilesEvents.ERROR, () => null);
      expect(onSpy).toHaveBeenCalledTimes(2);

      expect(fireSpy).toHaveBeenCalledTimes(0);
      mb.fire(MBTilesEvents.LOADED);
      expect(fireSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Should follow all the TileLayer interface', () => {
    const options: L.TileLayerOptions = { minZoom: 0, maxZoom: 6 };
    let mbTiles: any;
    let map: L.Map;
    beforeEach(() => {
      map = L.map(document.createElement('div'), { center: [48.864716, 2.349014], zoom: 6 });
      mbTiles = new MBTiles(url, options).addTo(map);
    });

    it('Should be able to set new options', () => {
      const newOptions = { minZoom: 2 };
      mbTiles.initialize(null, newOptions);

      expect(mbTiles.options.minZoom).toEqual(newOptions.minZoom);
      expect(mbTiles.options.maxZoom).toEqual(options.maxZoom);
    });

    it('Should be able to provide tile on given L.Coords', () => {
      jest.spyOn(MBTilesReader.prototype, 'getTile').mockReturnValueOnce(null);
      expect(mbTiles.getTileUrl({ x: 0, y: 0, z: 0 } as L.Coords)).toBe(L.Util.emptyImageUrl);

      // Assume that the provided Coords are present in the .mbtiles file
      jest.spyOn(MBTilesReader.prototype, 'getTile').mockReturnValueOnce(new Uint8Array(0));
      jest.spyOn(window.URL, 'createObjectURL').mockReturnValueOnce('blob:http://<3.com/uuid');
      expect(mbTiles.getTileUrl({ x: 0, y: 0, z: 0 } as L.Coords)).toBe('blob:http://<3.com/uuid');
    });
  });
});
