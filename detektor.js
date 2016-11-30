var port = browser.runtime.connect({
    name: "detektor"
});

var title = function () {
    var pieces;

    pieces = document.title.split("-");
    if (pieces.length > 1) {
        pieces.splice(2, 1);
    }
    return pieces.join("-");
}()

port.postMessage({
    title: title,
    url: document.location.href
});
