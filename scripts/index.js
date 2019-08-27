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
function getUrl(encodedUri) {
    //const whateverorigin = "http://www.whateverorigin.org";
    const whateverorigin = "https://whatever-origin.herokuapp.com";
    return `${whateverorigin}/get?url=${encodedUri}&callback=?`;
}
function parseToBody(response) {
  /* console.log(response);
  console.log(response.contents); */
  const parser = new DOMParser();
  return parser.parseFromString(response.contents, response.status.content_type).body;
}
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
    flexbin.setAttribute("data-pswp-uid", 1);
    flexbin.onclick = onThumbnailsClick;
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

function parseThumbnailElements(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        el,
        childElements,
        thumbnailEl,
        size,
        item;

    for (var i = 0; i < numNodes; i++) {
        el = thumbElements[i];

        // include only element nodes 
        if (el.nodeType !== 1) {
            continue;
        }

        childElements = el.children;

        //size = el.getAttribute('data-size').split('x');
        size = [1600, 1600];

        // create slide object
        item = {
            src: el.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            author: el.getAttribute('data-author')
        };

        item.el = el; // save link to element for getThumbBoundsFn

        if (childElements.length > 0) {
            item.msrc = childElements[0].getAttribute('src'); // thumbnail url
            if (childElements.length > 1) {
                item.title = childElements[1].innerHTML; // caption (contents of figure)
            }
        }


        var mediumSrc = el.getAttribute('data-med');
        if (mediumSrc) {
            size = el.getAttribute('data-med-size').split('x');
            // "medium-sized" image
            item.m = {
                src: mediumSrc,
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
        }
        // original image
        item.o = {
            src: item.src,
            w: item.w,
            h: item.h
        };

        items.push(item);
    }

    return items;
}
function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
}
function onThumbnailsClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;

    var clickedListItem = closest(eTarget, function (el) {
        return el.tagName === 'A';
    });

    if (!clickedListItem) {
        return;
    }

    var clickedGallery = clickedListItem.parentNode;

    var childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

    for (var i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
            continue;
        }

        if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
        }
        nodeIndex++;
    }

    if (index >= 0) {
        openPhotoSwipe(index, clickedGallery);
    }
    return false;
}
function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {

        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

        getThumbBoundsFn: function (index) {
            // See Options->getThumbBoundsFn section of docs for more info
            var thumbnail = items[index].el.children[0],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect();

            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },

        addCaptionHTMLFn: function (item, captionEl, isFake) {
            if (!item.title) {
                captionEl.children[0].innerText = '';
                return false;
            }
            captionEl.children[0].innerHTML = item.title + '<br/><small>Photo: ' + item.author + '</small>';
            return true;
        },

    };


    if (fromURL) {
        if (options.galleryPIDs) {
            // parse real index when custom PIDs are used 
            // https://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
                if (items[j].pid == index) {
                    options.index = j;
                    break;
                }
            }
        } else {
            options.index = parseInt(index, 10) - 1;
        }
    } else {
        options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
        return;
    }



    var radios = document.getElementsByName('gallery-style');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            if (radios[i].id == 'radio-all-controls') {

            } else if (radios[i].id == 'radio-minimal-black') {
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = { top: 0, bottom: 0 };
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;
            }
            break;
        }
    }

    if (disableAnimation) {
        options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

    // see: http://photoswipe.com/documentation/responsive-images.html
    var realViewportWidth,
        useLargeImages = false,
        firstResize = true,
        imageSrcWillChange;

    gallery.listen('beforeResize', function () {

        var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
        dpiRatio = Math.min(dpiRatio, 2.5);
        realViewportWidth = gallery.viewportSize.x * dpiRatio;


        if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
            if (!useLargeImages) {
                useLargeImages = true;
                imageSrcWillChange = true;
            }

        } else {
            if (useLargeImages) {
                useLargeImages = false;
                imageSrcWillChange = true;
            }
        }

        if (imageSrcWillChange && !firstResize) {
            gallery.invalidateCurrItems();
        }

        if (firstResize) {
            firstResize = false;
        }

        imageSrcWillChange = false;

    });

    gallery.listen('gettingData', function (index, item) {
        item.src = item.o.src;
        item.w = item.o.w;
        item.h = item.o.h;
    });

    gallery.init();
}
