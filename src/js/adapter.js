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

// Event handlers for the various notification events
function notifClosed(notID, bByUser) {
    console.log("The notification '" + notID + "' was closed" + (bByUser ? " by the user" : ""));
}

function notifClicked(notID) {
    console.log("The notification '" + notID + "' was clicked");
}

function notifButtonClicked(notID, iBtn) {
    console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
}

(function(obj) {

    obj.url       = 'https://trello.com';
    obj.toolbar   = chrome.browserAction;
    obj.notif     = chrome.notifications;
    obj.timer     = 15 * 1000;
    obj.prevCount = null;
    obj.responses = {};
    obj.logCount  = 0;
    obj.idPrefix  = 'qn-trello_';

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

    obj.generateId = function(prefix) {
        return prefix + String((new Date()).getTime());
    };

    obj.notify = function(title, message) {
        var id = this.generateId(this.idPrefix);
        var options = {
            type: 'basic',
            iconUrl: 'images/128.png',
            title: title,
            message: message
        };
        var callback = function (response) {
            console.log('created notify id =', response);
        };
        chrome.notifications.create(id, options, callback);
    };

    obj.setColor = function(type) {
        this.toolbar.setBadgeBackgroundColor({
            color: obj.getColor(type)
        });
    };

    obj.setIcon = function(type) {
        var iconPath = 'images/128.png';
        if (type === 'ALERT') {
            iconPath = 'images/128.png';
        }
        this.toolbar.setIcon({ path: iconPath });
    };

    obj.setText = function(val) {
        this.toolbar.setBadgeText({
            text: String(val)
        });
    };

    obj.handleToolbar = function (type) {
        var type = type.toUpperCase();
        this.setColor(type);
        //this.setIcon(type);
        if (type === 'ALERT') {
            this.notify(
                'Trello Notifications',
                'It may to exists unread notification(s).'
            );
        }
    };

    obj.log = function() {
        if (this.logCount % 10 === 0) {
            console.clear();
        }
        console.log(arguments);
        this.logCount++;
    };

    obj.getCount = function() {
        obj.log('start');
        obj.run();
        var that = obj;
        if (!localStorage.token) {
            return that.startTimer();
        }
        if (Trello.authorized()) {
            Trello.members.get(
                'me/notifications/unread',
                function (response) {
                    that.log(response);
                    if (that.prevCount != response.length) {
                        var type = response.length === 0 ? 'CLEAR' : 'ALERT';
                        that.prevCount = response.length;
                        that.setColor(type);
                        that.handleToolbar(type);
                        that.setText(response.length);
                    }
                    that.startTimer();
                },
                function (response) {
                    that.log(response.status);
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
            this.setText('E');
            this.getCount();
        }
        if (chrome && chrome.notifications) {
            // set up the event listeners
            chrome.notifications.onClosed.addListener(notifClosed);
            chrome.notifications.onClicked.addListener(notifClicked);
            chrome.notifications.onButtonClicked.addListener(notifButtonClicked);
        }
    };

})(Adapter);
