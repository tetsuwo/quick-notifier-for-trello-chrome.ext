TrelloChecker = function() {
    this.toolbar = chrome.browserAction;
}

TrelloChecker.prototype.indicate = function(number) {
    if (0 < number) {
        this.toolbar.setBadgeText({ text: String(number) });
        this.toolbar.setBadgeBackgroundColor({ color: [200, 0, 0, 255] });
    } else {
        this.toolbar.setBadgeText({ text: '0' });
        this.toolbar.setBadgeBackgroundColor({ color: [66, 66, 66, 255] });
    }
};

TrelloChecker.prototype.log = function(a) {
    console.log(a);
};

TrelloChecker.prototype.run = function(init) {
    if (init) {
        this.toolbar.setBadgeBackgroundColor({ color: [66, 66, 66, 255] });
        this.toolbar.setBadgeText({ text: '--' });
    }
};

