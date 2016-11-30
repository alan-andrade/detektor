function goToUrl(url) {
    return browser.tabs.create({
        url: url,
        active: false,
        index: 0
    });
}

var storage = browser.storage.local;

storage.get("playlist").then(function (res) {
    var playlist = res["playlist"];

    var app = new Vue({
        el: '#app',
        data: {
            playlist: playlist
        },
        methods: {
            goToTrack: function(track) {
                goToUrl(track.url);
            },

            clearPlaylist: function() {
                storage.clear();
                app.playlist = [];
            }
        }
    });
});
