const app = document.getElementById("app");
const timeline = document.createElement("DIV");
timeline.setAttribute("class", "timeline");
app.appendChild(timeline);
const album = document.getElementById("album")
const schoolWebSite = "http://www.wces.tp.edu.tw";
const classFolder = "/happy/102rainbow/";
const viewerFolder = "photo/";
const fileFolder = "files/";
const galleryPage = "pa_all.asp";
const albumPage = "pa.asp";
const albumParam = "mainid";
const photoPage = "pt_show.asp";
const photoParam = "pt_id";
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
function getUrl(encodedUri) {
    return `http://www.whateverorigin.org/get?url=${encodedUri}&callback=?`;
}
function parseToBody(response) {
  /* console.log(response);
  console.log(response.contents); */
  const parser = new DOMParser();
  return parser.parseFromString(response.contents, response.status.content_type).body;
}
var albumId;
function parseToPhotoInfo(img) {
    const src = img.src;
    const thumbnailFileName = src.substring(src.lastIndexOf("/")+1);
    const fileName = thumbnailFileName.replace("_small", "");
    return `${schoolWebSite}${classFolder}${fileFolder}${albumId}/${fileName}`;
}
function parseToPhotoInfos(body) {
    const photoInfos = [];
    const imgs = body.querySelectorAll(`img[src^='../${fileFolder}${albumId}/']`);
    //console.log(imgs);
    imgs.forEach((img) => photoInfos.push(parseToPhotoInfo(img)));
    return photoInfos;
}
function addToAlbum(photoInfos) {
    const flexbin = document.createElement("DIV");
    flexbin.setAttribute("class", "flexbin");
    photoInfos.forEach((photoInfo) => {
        const anchor = document.createElement("A");
        anchor.setAttribute("href", photoInfo);
        const img = document.createElement("IMG");
        img.setAttribute("src", photoInfo);
        flexbin.appendChild(anchor);
        anchor.appendChild(img);
    });
    album.appendChild(flexbin);
}
const callbackForFetchAlbum = function(response) {
    album.style.width = "100%";
    const body = parseToBody(response);
    addToAlbum(parseToPhotoInfos(body));
}
function openAlbum(albumInfo) {
    albumId = albumInfo.id;
    const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${albumPage}?${albumParam}=${albumId}`);
    $.getJSON(getUrl(encodedUri), callbackForFetchAlbum);
}
function returnToGallery() {
    album.removeChild(album.querySelector(".flexbin"));
    album.style.width = "0";
}
const callbackForFetchGallery = function(response) {
  const body = parseToBody(response);
  /* const selected = body.querySelector("select[name='pages']");
  console.log(selected); */
  const albumInfos = parseToAlbumInfos(body);
  //console.log(albumInfos);
  addToTimeline(albumInfos);
}
const encodedUri = encodeURIComponent(`${schoolWebSite}${classFolder}${viewerFolder}${galleryPage}`);
$.getJSON(getUrl(encodedUri), callbackForFetchGallery);
