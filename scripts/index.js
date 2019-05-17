document.getElementById("app").innerHTML = `<h1>Hello HenderPhoto!</h1>`;

fetch("https://www.google.com.tw/")
.then(function(res) {
  return res.text();
})
.then(function(html) {
  console.log(`html = ${html}`);
});
/*
 * Messages in Console When the First Time Load the index.html
 * polyfill.min.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
 * index.html:1 Access to fetch at 'https://www.google.com.tw/' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
 * index.html:1 Uncaught (in promise) TypeError: Failed to fetch
 */
/*
 * Messages in Console after Reload
 * GET file://cdn.polyfill.io/v2/polyfill.min.js?features=fetch net::ERR_FILE_NOT_FOUND
 * index.html:1 Access to fetch at 'https://www.google.com.tw/' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
 * index.html:1 Uncaught (in promise) TypeError: Failed to fetch
 * Promise.then (async)
 * (anonymous) @ index.js:7
 * index.js:3 Cross-Origin Read Blocking (CORB) blocked cross-origin response https://www.google.com.tw/ with MIME type text/html. See https://www.chromestatus.com/feature/5629709824032768 for more details.
 */
