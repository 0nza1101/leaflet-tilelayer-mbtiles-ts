"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static fetchLocal(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest;
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                resolve(new Response(xhr.response, { status: xhr.status }));
            };
            xhr.onerror = function () {
                reject(new Error('Local request failed'));
            };
            xhr.open('GET', url);
            xhr.send(null);
        });
    }
}
exports.default = Utils;
