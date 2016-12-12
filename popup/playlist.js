var storage = browser.storage.local;
var port = browser.runtime.connect({
    name: "detektor"
});

const CurrentTrack  = 'currentTrack';
const Playlist      = 'playlist';

function setCurrentTrack(track) {
    storage.set({[CurrentTrack]: track});
}

function setPlaylist(playlist) {
    storage.set({[Playlist]: playlist});
}

function getCurrentTrack(queryResult) {
    return queryResult[CurrentTrack];
}

function getPlaylist(queryResult) {
    return queryResult[Playlist];
}

var App = new Vue({
    el: '#app',
    data: {
        playlist: [],
        currentTrack: null
    },
    watch: {
        playlist: function(newValue) {
            setPlaylist(newValue);
        }
    },
    methods: {
        playTrack: function(track) {
            function openTab(track) {
                browser.tabs.create({
                    url: track.url,
                    active: false,
                    index: 0
                });
            }

            if (this.currentTrack) {
                browser.tabs.query({
                    url: this.currentTrack.url
                }).then(function(tabs) {
                    this.currentTrack = track;

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
                this.currentTrack = track;
            }
        },

        clearPlaylist: function() {
            storage.clear();
            this.playlist = [];
        },

        removeTrack: function(track) {
            var trackIndex = this.playlist.findIndex(function(t) {
                return t.url == track.url;
            });
            this.playlist.splice(trackIndex, 1);
        },

        analyzeTrack: function (track) {
            port.postMessage({
                action: 'analyze',
                url: track.url
            });
        },

        onSortableUpdate: function(event) {
            // Hack to make it work with Vue 2
            var clonedItems = this.playlist.filter(function(item){
                return item;
            });
            clonedItems.splice(event.newIndex, 0, clonedItems.splice(event.oldIndex, 1)[0]);
            var self = this;
            self.playlist = [];
            Vue.nextTick(function(){
                self.playlist = clonedItems;
            });
        }
    }
});

storage.get([Playlist, CurrentTrack]).then(function (res) {
    App.playlist = getPlaylist(res);
    App.currentTrack = getCurrentTrack(res);
});
