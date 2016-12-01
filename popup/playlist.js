var storage = browser.storage.local;

storage.get(["playlist", "currentTrack"]).then(function (res) {
    var playlist = res["playlist"]
        , currentTrack = res["currentTrack"];

    var app = new Vue({
        el: '#app',
        data: {
            playlist: playlist,
            currentTrack: currentTrack
        },
        methods: {
            playTrack: function(track) {
                console.log('current url:' + app.currentTrack.url);

                function openTab(track) {
                    browser.tabs.create({
                        url: track.url,
                        active: false,
                        index: 0
                    });
                }

                if (app.currentTrack) {
                    browser.tabs.query({
                        url: app.currentTrack.url
                    }).then(function(tabs) {
                        storage.set({'currentTrack': track});
                        app.currentTrack = track;

                        if (!tabs.length) {
                            openTab(track);
                            return
                        }
                        browser.tabs.update(tabs[0].id, {
                            url: track.url
                        });
                    });
                } else {
                    openTab(track);
                    storage.set({'currentTrack': track});
                    app.currentTrack = track;
                }
            },

            clearPlaylist: function() {
                storage.clear();
                app.playlist = [];
            }
        }
    });
});
