(function() {

    var ONE_DAY = 1000 * 60 * 60 * 24;

    var KEY_LAST_CHANGED_AT = 'lastChangedAt';
    var KEY_OPTIONS = 'options';
    var KEY_PAUSED = 'paused';

    function now() {
        return new Date().getTime();
    }

    function updateBadge(paused) {
        var badgeText = paused ? "OFF" : "";
        chrome.browserAction.setBadgeText( { text: badgeText } );
    }

    function isPaused() {
        var isPaused = localStorage.getItem(KEY_PAUSED);
        if(typeof isPaused === "undefined"){
            isPaused = false;
        } else {
            isPaused = isPaused == 'true';
        }
        return isPaused;
    }

    function setPaused(paused) {
        var lastChangedAt = now();

        localStorage.setItem(KEY_PAUSED, paused);
        chrome.storage.sync.set( { 'paused': paused } );
        updateBadge(paused);

        localStorage.setItem(KEY_LAST_CHANGED_AT, lastChangedAt);
        return lastChangedAt;
    }

    function togglePause(tab) {
        setPaused(!isPaused());
    }

    function onMessage(request, sender, sendResponse) {

        if(request.id == 'isPaused?') {
            sendResponse({value: isPaused()});
        }
        else if(request.id == 'setOptions') {
            localStorage.setItem(KEY_OPTIONS, request.options);
        }
        else if (request.id == 'closeTab' ) {
            chrome.tabs.query({ currentWindow: true, active: true },
              function (tabs) {
               sendResponse({message: "closing tab", id: tabs[0].id });
               chrome.tabs.remove(tabs[0].id);

               var window = chrome.windows.getLastFocused({ populate: true }, function(window){
                 if(window.tabs.length <=1){
                   chrome.windows.remove(window.id);
                 }
               });
             }
           );
        }
    }

    chrome.browserAction.onClicked.addListener(togglePause);
    chrome.extension.onRequest.addListener(onMessage);
    chrome.runtime.onMessage.addListener(onMessage);

    updateBadge(isPaused());

})();
