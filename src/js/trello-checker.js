/*!
 * Trello Checker
 *
 * Copyright 2010-2012, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * Date: 2012-06-21
 */

var TrelloChecker = {};

(function(Ext) {

Ext.url       = 'https://trello.com';
Ext.toolbar   = chrome.browserAction;
Ext.timer     = 15 * 1000;
Ext.prevCount = null;

Ext.deauthorize = function() {
    delete localStorage.token;
    Trello.deauthorize();
};

Ext.setColor = function(type) {
    var color = [];

    switch (type) {
        case 'ALERT':
            color = [203, 77, 77, 255];
            break;

        case 'CLEAR':
            color = [52, 178, 125, 255];
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
        return that.startTimer();
    }

    that.run();

    if (Trello.authorized()) {
        Trello.members.get(
            'me/notifications/unread',
            function (response) {
                that.debug(response);

                if (that.prevCount != response.length) {
                    that.prevCount = response.length;
                    that.setColor(response.length === 0 ? 'CLEAR' : 'ALERT');
                    that.setText(response.length);
                }

                that.startTimer();
            },
            function (response) {
                that.debug(response.status);

                if (400 <= response.status) {
                    that.deauthorize();
                }

                that.startTimer();
            }
        );
    }
    else {
        return that.startTimer();
    }
};

Ext.startTimer = function() {
    window.setTimeout(Ext.getCount, this.timer);
};

Ext.run = function(init) {
    if (localStorage.token) {
        Trello.setToken(localStorage.token);
    }

    if (init) {
        this.setColor('ALERT');
        this.setText('!');
        this.getCount();
    }
};

})(TrelloChecker);
