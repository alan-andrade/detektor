var port = browser.runtime.connect({name: "detektor"});

port.postMessage({
    url: document.location.href
});

port.onMessage.addListener(function (msg) {
    var out;
    console.log(msg);
    if (msg.status == "processing") {
        out = 'Processing...'
    } else if (msg.key) {
        out = msg.key
    } else {
        out = "error"
    }

    if (document.getElementById('__detektor')) {
        var el = document.getElementById('__detektor');
        el.textContent = out
    } else {
        document.body.appendChild(htmlBox(out));
    }
});

function htmlBox(msg) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = '<div \
        id="__detektor" \
        style="position: absolute; \
                top: 49px; \
                left: 0; \
                padding: 20px; \
                background: white; \
                z-index: 19999999999; \
                border: 1px solid orange;">'+ msg +'</div>';
    return wrapper;
}
