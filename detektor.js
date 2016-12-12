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

// linkUrl should be defined in javascript injection via background.js
if(typeof linkUrl == 'undefined') { console.log('Something went wrong with context menu callback! linkUrl is not defined!') }

port.postMessage({
    action: 'addToPlaylist',
    title: title,
    url: linkUrl
});
