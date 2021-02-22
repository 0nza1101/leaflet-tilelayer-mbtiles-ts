export default class Utils {
  public static fetchLocal(url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
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
  }
}
