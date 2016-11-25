const menuId = "detektor";

function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        alert("Tab: " + tabId + " URL changed to " + changeInfo.url);
    }
}

browser.tabs.onUpdated.addListener(handleUpdated);

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
