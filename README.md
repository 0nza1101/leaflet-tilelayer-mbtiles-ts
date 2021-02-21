This is an updated version of the typescript version of Max Battcher [here](https://gitlab.com/WorldMaker/Leaflet.TileLayer.MBTiles)
This version adds OS platform detection to make it compatible with iOS and Android, since fetch didn't support File URI Schema [see](https://github.com/github/fetch/pull/92#issuecomment-140665932)..

# Leaflet.TileLayer.MBTiles [![NPM version][npm-image]][npm-url]

A [LeafletJS](http://www.leafletjs.com) plugin to load tilesets in [`.mbtiles` format](https://github.com/mapbox/mbtiles-spec).

## Exemple

The following demo loads a ~9.6MB `.mbtiles` file with the "countries" style from the good ol' Tilemill:

* Clone this repository: https://github.com/0nza1101/leaflet-tilelayer-mbtiles-ts.git
* Run `npm install` from the project root.
* `npm start`

## Compatibility

[LeafletJS](http://www.leafletjs.com) 1.0.1 (or newer), [sql.js](https://github.com/sql-js/sql.js) 0.5.0 and a web browser that supports:

* [`Blob`s](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
* [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
* [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), or use a [polyfill](https://github.com/github/fetch)
* [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Any recent version of Firefox, Chrome or Safari should work without problems. IE10/IE11 should work with a `fetch` polyfill.

## Usage

`npm i leaflet leaflet-tilelayer-mbtiles-ts --save`

Include Leaflet like:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
```
```typescript
declare var L: any;
```

or like :

```typescript
import * as L from 'leaflet';
```

or like :

```typescript
import 'leaflet';
declare var L: any;
```

Then include Leaflet.TileLayer.MBTiles, like:

```ts
import 'leaflet-tilelayer-mbtiles-ts';
```

Once everything is loaded, you can instantiate `L.TileLayer.MBTiles` just by providing
the URL to a `.mbtiles` database:

```js
const mb = L.tileLayer.mbTiles('http://server/something/cool-stuff.mbtiles').addTo(map);
```

## Extra metadata handling

Some `.mbtiles` have metadata rows which is not in the specification [`.mbtiles` format](https://github.com/mapbox/mbtiles-spec).
This plugin will handle the following optional metadata rows, if they exist:

* `minzoom` (as the layer's `minzoom` option).
* `maxzoom` (as the layer's `maxzoom` option).
* `attribution` (as the layer's `attribution` option).

Due to the database being opened asynchronously, and the fact that layer options
have to be given when the layer is instantiated, metadata handling does not work
very well. Consider handling the metadata manually and setting Leaflet layer options accordingly.


## Legalese

----------------------------------------------------------------------------

"THE BEER-WARE LICENSE":
<ivan@sanchezortega.es> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.

----------------------------------------------------------------------------

[npm-image]: https://badge.fury.io/js/leaflet-tilelayer-mbtiles-ts.svg
[npm-url]: https://www.npmjs.com/package/lleaflet-tilelayer-mbtiles-ts