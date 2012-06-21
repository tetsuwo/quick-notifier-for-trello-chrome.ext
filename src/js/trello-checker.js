
var TrelloChecker = {};

(function(Ext) {

Ext.toolbar = chrome.browserAction;
Ext.timer = 15 * 1000;
Ext.prevCount = 0;

Ext.setColor = function(type) {
    var color = [];

    switch (type) {
        case 'ALERT':
            color = [200, 0, 0, 255];
            break;

        case 'ALLOK':
            color = [0, 80, 0, 255];
            break;

        default:
            color = [66, 66, 66, 255];
            break;
    }

    this.toolbar.setBadgeBackgroundColor({ color: color });
};

Ext.setText = function(val) {
    this.toolbar.setBadgeText({ text: String(val) });
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
                    that.setColor(response.length === 0 ? 'ALLOK' : 'ALERT');
                    that.setText(response.length);
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
        this.setColor('ALERT');
        this.setText('Oh...');
        this.getCount();
    }
};

})(TrelloChecker);
