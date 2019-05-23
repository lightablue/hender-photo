document.getElementById("app").innerHTML = `<h1>Hello HenderPhoto!</h1>`;

var url = "http://www.whateverorigin.org/get?url=" + encodeURIComponent("http://www.wces.tp.edu.tw/happy/102rainbow/photo/pt_show.asp?pt_id=47523") + "&callback=?";
$.getJSON(url, function(response) {
  console.log(response);
});
