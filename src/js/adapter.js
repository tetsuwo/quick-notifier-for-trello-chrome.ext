/*!
 * Adapter
 *
 * Copyright 2010-2012, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * CreatedAt: 2012-06-21
 */

var Adapter = {};

(function(obj) {

    obj.url       = 'https://trello.com';
    obj.toolbar   = chrome.browserAction;
    obj.timer     = 15 * 1000;
    obj.prevCount = null;

    obj.deauthorize = function() {
        delete localStorage.token;
        Trello.deauthorize();
    };

    obj.getColor = function(type) {
        switch (type.toUpperCase()) {
            case 'ALERT':
                return [203, 77, 77, 255];

            case 'CLEAR':
                return [52, 178, 125, 255];

            default:
                return [66, 66, 66, 255];
        }
    };

    obj.setColor = function(type) {
        this.toolbar.setBadgeBackgroundColor({ color: obj.getColor(type) });
    };

    obj.setText = function(val) {
        this.toolbar.setBadgeText({ text: String(val) });
    };

    obj.debug = function(val) {
    //    console.log(val);
    };

    obj.getCount = function() {
        var that = obj;
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
        } else {
            return that.startTimer();
        }
    };

    obj.startTimer = function() {
        window.setTimeout(obj.getCount, this.timer);
    };

    obj.run = function(init) {
        if (localStorage.token) {
            Trello.setToken(localStorage.token);
        }

        if (init) {
            this.setColor('ALERT');
            this.setText('!');
            this.getCount();
        }
    };

})(Adapter);
