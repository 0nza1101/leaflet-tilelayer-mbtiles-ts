// import { data } from './data.js';
// import * as L from 'leaflet';
import '../dist/index.js';
const map = L.map('map', {
    center: [48.864716, 2.349014],
    zoom: 8
});
const mb = L.tileLayer.mbTiles('./countries-raster.mbtiles', {
    minZoom: 0,
    maxZoom: 6
}).addTo(map);
mb.on('databaseloaded', (ev) => {
    console.info('MBTiles DB loaded', ev);
});
mb.on('databaseerror', (ev) => {
    console.info('MBTiles DB error', ev);
});
alert('test');
