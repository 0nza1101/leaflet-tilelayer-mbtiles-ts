import * as L from "leaflet";
import "../../src/index";

const map = L.map("map", {
  center: [48.864716, 2.349014],
  zoom: 8,
});

const mb = (L.tileLayer as any)
  .mbTiles("./assets/countries-raster.mbtiles", {
    minZoom: 0,
    maxZoom: 6,
  })
  .addTo(map);

mb.on("databaseloaded", (ev: any) => {
  console.info("MBTiles DB loaded", ev);
});
mb.on("databaseerror", (ev: any) => {
  console.info("MBTiles DB error", ev);
});
