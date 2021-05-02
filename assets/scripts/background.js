'use strict';
chrome || (chrome = browser);
window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();
chrome.tabs.onCreated.addListener(function (tab) {
    chrome.pageAction.show(tab.id);
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {


    if (!changeInfo.status == 'complete') return;

    tab.url && chrome.pageAction.show(tabId);

});