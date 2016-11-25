function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        } else if (xmlHttp.status == 406) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var url = "http://localhost:3000/findKey?url=" + document.location;

httpGetAsync(url, function(response) {
    let json = JSON.parse(response);

    if (json.error) {
        alert(json.error);
        return
    }

    if (json.key) {
        alert("Camelot Key: " + json.key);
    }
})
