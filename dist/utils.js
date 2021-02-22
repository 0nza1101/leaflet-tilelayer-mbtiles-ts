"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.fetchLocal = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = function () {
                resolve(new Response(xhr.response, { status: xhr.status }));
            };
            xhr.onerror = function () {
                reject(new Error("Local request failed"));
            };
            xhr.open("GET", url);
            xhr.send(null);
        });
    };
    return Utils;
}());
exports.default = Utils;
