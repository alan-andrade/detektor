var getting = browser.storage.local.get("playlist");
getting.then(function (res) {
    var playlist = res["playlist"];

    var app = new Vue({
        el: '#app',
        data: {
            playlist: playlist
        },
    });
});
