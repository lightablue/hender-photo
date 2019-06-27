const app = document.getElementById("app");
const timeline = document.createElement("DIV");
timeline.setAttribute("class", "timeline");
app.appendChild(timeline);
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
const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${galleryPage}`);
//const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${albumPage}?${albumParam}=${albumId}`);
const url = `http://www.whateverorigin.org/get?url=${encodedUri}&callback=?`;
function parseToAlbumInfo(row) {
    const columns = row.querySelectorAll('td');
    const anchor = columns[0].querySelector(`a[href^='${albumPage}?${albumParam}=']`);
    return {
        id: (new URLSearchParams(anchor.search)).get(albumParam),
        title: anchor.text.trim(),
        createDate: row.querySelectorAll('td')[2].textContent
    };
}
function parseToAlbumInfos(body) {
    const albumInfos = [];
    const rows = body.querySelectorAll("tr .news-table-td");
    rows.forEach(row => albumInfos.push(parseToAlbumInfo(row)));
    return albumInfos;
}
function addToTimeline(albumInfos) {
    albumInfos.forEach((albumInfo) => {
        const container = document.createElement("DIV");
        container.setAttribute("class", "container");
        container.classList.add(timeline.childNodes.length % 2 === 0 ? "left" : "right");
        container.onclick = function() { openAlbum(albumInfo); };
        const content = document.createElement("DIV");
        content.setAttribute("class", "content");
        const contentHeading = document.createElement("H2");
        contentHeading.innerHTML = albumInfo.title;
        const contentParagraph = document.createElement("P");
        contentParagraph.innerHTML = albumInfo.createDate;
        content.appendChild(contentHeading);
        content.appendChild(contentParagraph);
        container.appendChild(content);
        timeline.appendChild(container);
    });
}
function openAlbum(albumInfo) {
    console.log(albumInfo.id);
    document.getElementById("album").style.width = "100%";
}
function returnToGallery() {
    document.getElementById("album").style.width = "0";
}
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
  /* const selected = doc.body.querySelectorAll(`a[href^='${photoPage}?${photoParam}=']`);
  console.log(selected);
  const src = selected[0].querySelector(`img[src^='../${fileFolder}${albumId}/']`).src;
  const fileName = src.substring(src.lastIndexOf("/")+1);
  console.log(fileName.replace("_small", "")); */
  const albumInfos = parseToAlbumInfos(doc.body);
  console.log(albumInfos);
  addToTimeline(albumInfos);
}
$.getJSON(url, callback);
