import * as L from "leaflet";
import { MBTiles, mbTiles as mbtilesFactory } from '../dist/index';

describe("Create a leaflet TileLayer using a .mbtiles file", () => {

    describe("Should follow all the TileLayer interface", () => {
        let map: L.Map;
        beforeEach(() => (map = L.map(document.createElement("div"))));

        it("Should be able to add it to a map", () => {
            const mb = new MBTiles('', {});
            expect(map.hasLayer(mb)).toBeFalsy();

            mb.addTo(map);
            expect(map.hasLayer(mb)).toBeTruthy();
        });

        it("Should be removable from maps", () => {
            const mb = new MBTiles('', {});
            map.addLayer(mb);
            expect(map.hasLayer(mb)).toBeTruthy();

            mb.removeFrom(map);
            expect(map.hasLayer(mb)).toBeFalsy();
        });

        it("Should be removable from the current map", () => {
            const mb = new MBTiles('', {});
            map.addLayer(mb);
            expect(map.hasLayer(mb)).toBeTruthy();

            mb.remove();
            expect(map.hasLayer(mb)).toBeFalsy();
        });
    });
});
