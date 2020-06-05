chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
            chrome.pageAction.show(id);
        });
    }, { url: [{ urlMatches: 'https://github.com/' }] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.redirect_actions) {
        chrome.tabs.update({ url: request.redirect_actions });
    }
});
