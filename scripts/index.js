document.getElementById("app").innerHTML = `<h1>Hello HenderPhoto!</h1>`;
const schoolWebSite = "http://www.wces.tp.edu.tw";
const classFolder = "/happy/102rainbow/";
const viewerFolder = "photo/";
const fileFolder = "files/";
const galleryPage = "pa_all.asp";
const albumPage = "pa.asp";
const albumParam = "mainid";
const albumId = 1563;
const photoPage = "pt_show.asp";
const photoParam = "pt_id";
//const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${galleryPage}`);
const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${albumPage}?${albumParam}=${albumId}`);
const url = `http://www.whateverorigin.org/get?url=${encodedUri}&callback=?`;
const callback = function(response) {
  console.log(response);
  console.log(response.contents);
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.contents, response.status.content_type);
  /* const selected = doc.body.querySelector("select[name='pages']");
  console.log(selected); */
  /* const selected = doc.body.querySelectorAll(`a[href^='${albumPage}?${albumParam}=']`);
  console.log(selected);
  console.log(selected[0]);
  console.log("'" + selected[0].text.trim() + "', " + selected[0].text.trim().length);
  console.log((new URLSearchParams(selected[0].search)).get(albumParam)); */
  const selected = doc.body.querySelectorAll(`a[href^='${photoPage}?${photoParam}=']`);
  console.log(selected);
  const src = selected[0].querySelector(`img[src^='../${fileFolder}${albumId}/']`).src;
  const fileName = src.substring(src.lastIndexOf("/")+1);
  console.log(fileName.replace("_small", ""));
}
$.getJSON(url, callback);
