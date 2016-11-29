const menuId = "detektor";
const storage = browser.storage.local;

browser.contextMenus.create({
    id: menuId,
    title: "Find Key (Camelot)"
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

function addUrlToPlaylist(url) {
    storage.get("playlist").then(function (res) {
        var currentPlaylist = res["playlist"];
        if (!currentPlaylist) {
            currentPlaylist = [];
        }

        var track = {url: url.url, key: "--"};
        currentPlaylist.push(url);
        storage.set({"playlist": currentPlaylist});
    });
}

function connected(p) {
    port = p;
    port.onMessage.addListener(addUrlToPlaylist);
}

browser.runtime.onConnect.addListener(connected);

channel.on("findKey", payload => {
    console.log(payload);
    // Display in box
    port.postMessage(payload);
})
