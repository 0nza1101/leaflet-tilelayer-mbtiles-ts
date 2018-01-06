# Leaflet.TileLayer.MBTiles

A [LeafletJS](http://www.leafletjs.com) plugin to load tilesets in [`.mbtiles` format](https://github.com/mapbox/mbtiles-spec).


## Demo

The following demo loads a ~9.6MB `.mbtiles` file with the "countries" style from the good ol' Tilemill:

[http://ivansanchez.gitlab.io/Leaflet.TileLayer.MBTiles/demo/demo.html](http://ivansanchez.gitlab.io/Leaflet.TileLayer.MBTiles/demo/demo.html)

## Compatibility

[LeafletJS](http://www.leafletjs.com) 1.0.1 (or newer), [sql.js](https://github.com/kripken/sql.js/) 0.3.2 (or newer), and a web browser that supports:

* [`Blob`s](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
* [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
* [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), or use a [polyfill](https://github.com/github/fetch)
* [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Any recent version of Firefox, Chrome or Safari should work without problems. IE10/IE11 should work with a `fetch` polyfill.

## Usage

Include Leaflet in your HTML, like:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.0.1/dist/leaflet.js"></script>
```

Include the [`sql.js` library](https://github.com/kripken/sql.js/), like:

```html
<script src="https://unpkg.com/sql.js@0.3.2/js/sql.js"></script>
```

Include Leaflet.TileLayer.MBTiles, like:

```html
<script src="https://unpkg.com/leaflet.tilelayer.mbtiles@latest/Leaflet.TileLayer.MBTiles.js"></script>
```

Once everything is loaded, you can instantiate `L.TileLayer.MBTiles` just by providing
the URL to a `.mbtiles` database:

```js
var mb = L.tileLayer.mbTiles('http://server/something/cool-stuff.mbtiles').addTo(map);
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

