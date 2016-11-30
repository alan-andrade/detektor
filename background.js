const menuId = "detektor";
const storage = browser.storage.local;

browser.contextMenus.create({
    id: menuId,
    title: "Add to Playlist"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == menuId) {
        browser.tabs.executeScript({
            file: "detektor.js"
        });
    }
});

var socket = new Phoenix.Socket('ws://localhost:4000/socket');

socket.connect();
channel = socket.channel("detektor:main", {});
channel
    .join()
    .receive("ok", resp => {
        console.log("Joined successfully", resp)
    })
    .receive("error", resp => { console.log("Unable to join", resp) })


var port;

// popup
function onConnection(data) {
    storage.get("playlist").then(function (res) {
        var currentPlaylist = res["playlist"];
        if (!currentPlaylist) {
            currentPlaylist = [];
        }

        var track = {
            url: data.url,
            title: data.title,
            key: "N/A"
        };

        if (_.findWhere(currentPlaylist, {url: track.url})) {
            channel.push("getKeyForUrl", data.url);
            return;
        }
        currentPlaylist.push(track);
        storage.set({"playlist": currentPlaylist});
        channel.push("getKeyForUrl", data.url);
    });
}

browser.runtime.onConnect.addListener(function(_port) {
    port = _port;
    port.onMessage.addListener(onConnection);
});

// content script
channel.on("keyFound", track => {
    storage.get("playlist").then(function (res) {
        var playlist = res["playlist"];
        var oldTrack = _.findWhere(playlist, {url: track.url});
        if (!oldTrack) {
            console.log("Playlist should've been cleared before receving key response.");
            return
        }
        var newPlaylist = _.without(playlist, oldTrack);
        oldTrack.key = track.key;
        newPlaylist.push(oldTrack);
        storage.set({"playlist": newPlaylist});
    })
})
