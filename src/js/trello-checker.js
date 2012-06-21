
var TrelloChecker = {};

(function(Ext) {

Ext.toolbar = chrome.browserAction;
Ext.timer = 15 * 1000;
Ext.prevCount = 0;

Ext.indicate = function(number) {
    if (0 < number) {
        this.toolbar.setBadgeText({ text: String(number) });
        this.toolbar.setBadgeBackgroundColor({ color: [200, 0, 0, 255] });
    } else {
        this.toolbar.setBadgeText({ text: '0' });
        this.toolbar.setBadgeBackgroundColor({ color: [66, 66, 66, 255] });
    }
};

Ext.debug = function(val) {
//    console.log(val);
};

Ext.getCount = function() {
    var that = Ext;
    that.debug('start');

    if (!localStorage.token) {
        that.startInterval();
    }

    that.run();

    if (Trello.authorized()) {
        Trello.members.get(
            'me/notifications/unread',
            function (response) {
                that.debug(response);

                if (that.prevCount != response.length) {
                    that.prevCount = response.length;
                    that.indicate(response.length);
                }

                that.startInterval();
            }
        );
    }
    else {
        that.startInterval();
    }
};

Ext.startInterval = function() {
    window.setTimeout(this.getCount, this.timer);
};

Ext.run = function(init) {
    if (localStorage.token) {
        Trello.setToken(localStorage.token);
    }

    if (init) {
        this.indicate('--');
        this.getCount();
    }
};

})(TrelloChecker);
