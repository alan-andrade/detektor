const trackId = "detektor-track";
const playlistId = "detektor-playlist";
const storage = browser.storage.local;

browser.contextMenus.create({
    id: trackId,
    title: "Add to Playlist"
});

browser.contextMenus.create({
    id: playlistId,
    title: "Analyze Entire Playlist"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == trackId) {
        browser.tabs.executeScript({
            file: "detektor.js"
        });
    } else if( info.menuItemId = playlistId) {
      var code = "var linkUrl = '" + info.linkUrl + "';";
      browser.tabs.executeScript({ code: code }, function() {
        browser.tabs.executeScript({
          file: "detektorPlaylist.js"
        });
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

        if (data.action == 'addToPlaylist') {
            if (_.findWhere(currentPlaylist, {url: data.url})) {
                return;
            }

            var track = {
                url: data.url,
                title: data.title,
                key: "N/A"
            };

            channel.push("getKeyForUrl", data.url);
            currentPlaylist.push(track);
            storage.set({"playlist": currentPlaylist});
        } else if (data.action == 'analyze') {
            channel.push("getKeyForUrl", data.url);
        } else if (data.action == 'analyzeEntirePlaylist') {
            channel.push("getPlaylistForUrl", data.url);
        }
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
        if (!oldTrack) { oldTrack = track; }
        var newPlaylist = _.without(playlist, oldTrack);
        oldTrack.key = track.key;
        newPlaylist.push(oldTrack);
        storage.set({"playlist": newPlaylist});
    })
})
