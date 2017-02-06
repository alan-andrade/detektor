var port = browser.runtime.connect({
    name: "detektor"
});

port.postMessage({
    action: 'analyzeEntirePlaylist',
    url: linkUrl
});
