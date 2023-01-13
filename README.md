# 🌍 Leaflet.TileLayer.MBTiles 
[![Circle CI][actions-image]][actions-url] [![NPM downloads][npm-download-image]][npm-url] [![NPM version][npm-image]][npm-url] [![Codacy Badge][Codacy-image]][Codacy-url] [![contributions welcome][contribution-image]][issue-page] 

A [LeafletJS](http://www.leafletjs.com) plugin to load tilesets in [`.mbtiles` format](https://github.com/mapbox/mbtiles-spec).

This is a rewritten version of the typescript version based on this [fork](https://gitlab.com/WorldMaker/Leaflet.TileLayer.MBTiles)
This version adds OS platform detection to make it compatible with iOS and Android, since fetch didn't support File URI Schema [see](https://github.com/github/fetch/pull/92#issuecomment-140665932)..

## Installing
Via NPM:
```
 npm install --save leaflet-tilelayer-mbtiles-ts
```

Via Yarn:
```
 yarn add leaflet-tilelayer-mbtiles-ts
```
## Requirements
  *  Leaflet >= 1
  *  Web browser that supports:
     * [`Blob`s](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
     * [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
     * [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), or use a [polyfill](https://github.com/github/fetch)
     * [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
## Exemple

The following exemple loads a ~9.6MB `.mbtiles` file with the "countries" style from the good ol' Tilemill:

*  Clone this repository: https://github.com/0nza1101/leaflet-tilelayer-mbtiles-ts.git
*  Run `npm install` from the project root.
*  `npm start`

See also [ionic5-leaflet-mbtiles](https://github.com/0nza1101/ionic5-leaflet-mbtiles) for a Ionic sample app.
## Using the plugin
```javascript
    // Using the constructor...
    let mbtiles = new L.TileLayer.MBTiles('http://server/something/cool-stuff.mbtiles', options);
    
    // ... or use the factory
    mbtiles = L.tileLayer.mbtiles('http://server/something/cool-stuff.mbtiles', options);

    // Possible events
    mbtiles.on('databaseloaded', (ev) => {
        console.info('MBTiles DB loaded', ev);
    });

    mbtiles.on('databaseerror', (ev) => {
        console.info('MBTiles DB error', ev);
    });
    
    mbtiles.addTo(map);
```
### Importing
With ES6 imports
```javascript
    import { MBTiles, mbtiles } from 'leaflet-tilelayer-mbtiles-ts';

    // Using the constructor...
    let mbtiles = new MBTiles('./assets/mysuperfile.mbtiles', options);
    
    // ... or use the factory
    mbtiles = mbtiles('./assets/mysuperfile.mbtiles', options);
    
    mbtiles.addTo(map);
```
Global
```javascript
    import 'leaflet-tilelayer-mbtiles-ts';

    // Using the constructor...
    let mbtiles = new L.TileLayer.MBTiles('./assets/mysuperfile.mbtiles', options);
    
    // ... or use the factory
    mbtiles = L.tilelayer.mbtiles('./assets/mysuperfile.mbtiles', options);
    
    mbtiles.addTo(map);
```
## Parameters

MBTiles extends the [`TileLayer`](https://leafletjs.com/reference#tilelayer).Initialise with the same options.
## Extra metadata handling

Some `.mbtiles` have metadata rows which is not in the specification [`.mbtiles` format](https://github.com/mapbox/mbtiles-spec).
This plugin will handle the following optional metadata rows, if they exist:

*  `minzoom` (as the layer's `minzoom` option).
*  `maxzoom` (as the layer's `maxzoom` option).
*  `attribution` (as the layer's `attribution` option).


Due to the database being opened asynchronously, and the fact that layer options
have to be given when the layer is instantiated, metadata handling does not work
very well. Consider handling the metadata manually and setting Leaflet layer options accordingly.


## License

MIT

[npm-image]: https://badge.fury.io/js/leaflet-tilelayer-mbtiles-ts.svg
[npm-url]: https://www.npmjs.com/package/leaflet-tilelayer-mbtiles-ts

[npm-download-image]: https://img.shields.io/npm/dt/leaflet-tilelayer-mbtiles-ts.svg

[Codacy-image]: https://app.codacy.com/project/badge/Grade/4e6407ff274c41e1afabe02e75c582b0
[Codacy-url]: https://www.codacy.com/gh/0nza1101/leaflet-tilelayer-mbtiles-ts/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=0nza1101/leaflet-tilelayer-mbtiles-ts&amp;utm_campaign=Badge_Grade

[HitCount-image]: http://hits.dwyl.com/0nza1101/leaflet-tilelayer-mbtiles-ts.svg
[HitCount-url]: http://hits.dwyl.com/0nza1101/leaflet-tilelayer-mbtiles-ts

[contribution-image]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat
[issue-page]: https://github.com/0nza1101/leaflet-tilelayer-mbtiles-ts/issues

[Codacy-image]: https://app.codacy.com/project/badge/Grade/4e6407ff274c41e1afabe02e75c582b0
[Codacy-url]: https://www.codacy.com/gh/0nza1101/leaflet-tilelayer-mbtiles-ts/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=0nza1101/leaflet-tilelayer-mbtiles-ts&amp;utm_campaign=Badge_Grade

[actions-image]: https://github.com/0nza1101/leaflet-tilelayer-mbtiles-ts/actions/workflows/ci.yml/badge.svg?branch=master
[actions-url]: https://github.com/0nza1101/leaflet-tilelayer-mbtiles-ts/actions/workflows/ci.yml