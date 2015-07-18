// Supported Notification Type
// ---------------------------
// [ ] addedAttachmentToCard
// [x] addedToBoard
// [x] addedToCard ... <a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a> changed anything of the card <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a> on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>
// [x] addedToOrganization
// [ ] addedMemberToCard
// [ ] addAdminToBoard
// [ ] addAdminToOrganization ... {{member.fullName}} added you to the organization {{data.organization.name}}
// [x] changeCard ... <a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a> changed anything of the card <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a> on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>
// [ ] closeBoard
// [x] commentCard
// [x] createdCard ... <a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a> changed anything of the card <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a> on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>
// [ ] invitedToBoard
// [ ] invitedToOrganization
// [x] removedFromBoard ... {{member.fullName}} removed you from the board {{board.name}}
// [x] removedFromCard ... <a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a> changed anything of the card <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a> on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>
// [ ] removedMemberFromCard
// [ ] removedFromOrganization
// [ ] memberJoinedTrello ... {member.fullName} joined Trello on your recommendation. You earned a free month of Trello Gold!
// [x] mentionedOnCard
// [ ] unconfirmedInvitedToBoard
// [ ] unconfirmedInvitedToOrganization
// [ ] updateCheckItemStateOnCard
// [x] makeAdminOfBoard ... {{member.fullName}} made you an admin on the board {{board.name}}
// [x] makeAdminOfOrganization ... {{member.fullName}} made you an admin of the organization {{data.organization.name}}
// [ ] cardDueSoon
// [ ] declinedInvitationToBoard
// [ ] declinedInvitationToOrganization


Adapter.run();

var _tempNotifications = null;

var _readNotif = function(id) {
    Trello.put(
        'notifications/' + id,
        { unread: false },
        function (response) {
            console.log(response);
            _notif(true);
        },
        function (response) {
            console.log(response.status);
        }
    );
};

var _handleItemType = function(row) {
    var comment = row.type
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(chars) {
            return chars.toUpperCase();
        });

    console.log(row);

    var outline = '';
    switch (row.type) {
        case 'updateCheckItemStateOnCard':
            comment += ' - '
                + row.data.name + '(' + row.data.state + ')';
            break;

        case 'addedToOrganization':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' added you to the organization'
                    + ' <a href="{{baseUrl}}/{{trello.data.organization.id}}">{{trello.data.organization.name}}</a>';
            comment = '';
            break;

        case 'makeAdminOfOrganization':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' made you an admin of the organization'
                    + ' <a href="{{baseUrl}}/{{trello.data.organization.id}}">{{trello.data.organization.name}}</a>';
            comment = '';
            break;

        case 'addedToBoard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' added you to the board'
                    + ' <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'removedFromBoard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' removed you from the board'
                    + ' <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'makeAdminOfBoard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' made you an admin on the board'
                    + ' <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'addedToCard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' added you to the card'
                    + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                    + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'createdCard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' created'
                    + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                    + ' in {{trello.data.list.name}}'
                    + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'removedFromCard':
            outline = '<a class="trello-username" href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                    + ' removed you from the card'
                    + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                    + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            comment = '';
            break;

        case 'changeCard':
            if (row.data.old && row.data.old.idList && row.data.listBefore) {
                outline = '<a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                        + ' moved the card'
                        + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                        + ' to {{trello.data.listAfter.name}}'
                        + ' from {{trello.data.listBefore.name}}'
                        + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            } else {
                outline = '<a href="{{baseUrl}}/{{trello.memberCreator.username}}">{{trello.memberCreator.fullName}}</a>'
                        + ' changed anything of the card'
                        + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                        + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}">{{trello.data.board.name}}</a>';
            }
            comment = '';
            break;

        case 'commentCard':
            outline = '<a href="{{baseUrl}}/{{trello.memberCreator.username}}" target="_blank">{{trello.memberCreator.fullName}}</a>'
                    + ' commented on the card'
                    + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                    + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}" target="_blank">{{trello.data.board.name}}</a>';
            comment = row.data.text;
            break;

        case 'mentionedOnCard':
            outline = '<a href="{{baseUrl}}/{{trello.memberCreator.username}}" target="_blank">{{trello.memberCreator.fullName}}</a>'
                    + ' commented on the card'
                    + ' <a href="{{baseUrl}}/c/{{trello.data.board.id}}/{{trello.data.card.idShort}}" target="_blank">{{trello.data.card.name}}</a>'
                    + ' on <a href="{{baseUrl}}/b/{{trello.data.board.shortLink}}" target="_blank">{{trello.data.board.name}}</a>';
            comment = row.data.text;
            break;

        case 'memberJoinedTrello':
            outline = '<a href="{{baseUrl}}/{{trello.memberCreator.username}}" target="_blank">{{trello.memberCreator.fullName}}</a>'
                    + ' joined Trello on your recommendation. ';
            comment = '';
            break;

        default:
            outline = 'Not supported notification type. Please your <a href="https://github.com/tetsuwo/quick-notifier-for-trello-chrome.ext/issues" target="_blank">feedback</a>!';
            comment = '';
            break;
    }

    outline = Mustache.render(outline, { baseUrl: Adapter.url, trello: row });

    return {
        outline: outline,
        comment: comment
    };
};

var _processRow = function($target, row) {
    var res = _handleItemType(row);
    var $li = $('<li />');

    $li.addClass('notif-item');
    if (row.unread) {
        $li.addClass('state-unread');
    } else {
        $li.addClass('state-read');
    }

    $li.append(
        $('<span />').addClass('card-outline')
            .html(res.outline)
    );

    if (row.unread) {
        $li.append(
            $('<span />').addClass('hover-action').append(
                $('<button />').addClass('notif-read').text('Read')
                    .data('id', row.id)
            )
        );
    }

    if (res.comment != '') {
        $li.append(
            $('<span />')
                .addClass('notif-info')
                .html(res.comment)
        );
    }

    $target.append($li);
};

var _notif = function(init) {
    Trello.members.get(
        'me/notifications',
        function (response) {
            _tempNotifications = response;
            var $target = $('.notifications ul');
            if (init) {
                $target.empty();
            }
            _buildNotifItems($target, response, false);
            $('#authentication').hide();
            $('.notifications').slideDown();
            $('#notification').show();
        },
        function (response) {
            console.log(response.status);
        }
    );
};

var _buildNotifItems = function($target, items, unreadOnly) {
    for (var key in items) {
        var row = items[key];
        //console.log(row);
        if (unreadOnly && !row.unread) {
            continue;
        }
        _processRow($target, row);
    }
    if (!items || !items.length) {
        $target.append('<li><b style="color: #d00;">You have no notifications.</b></li>');
    }
};

var _checker = function() {
    $('#authentication').show();
    if (Trello.authorized()) {
        $('#deauthorize').attr('disabled', false);
        Trello.members.get('me', function(me) {
            console.log(me);
            $('[data-id]').text(me.username);
            if (me.email && me.email != '') {
                $('[data-email]').text(me.email);
                $('.block-email').show();
            } else {
                $('.block-email').hide();
            }
            $('#go-notif').attr({
                disabled: me.username == '',
                'data-url': me.url
            });
            _notif();
        });
        return;
    }
    $('input[type=button]').attr('disabled', true);
};

$(document).on('click', '.notifications .notif-read', function() {
    _readNotif($(this).data('id'));
});

$('#share').click(function() {
    $('#sharer').slideToggle();
});

$('#go-notif').click(function() {
    chrome.tabs.create({
        url: $(this).attr('data-url') + '/notifications'
    });
});

$('#deauthorize').click(function() {
    Adapter.deauthorize();
    _checker();
    return false;
});

if (!Trello.authorized()) {
    chrome.tabs.create({
        url: window.location.origin + '/callback.html?mode=authorize'
    });
} else {
    _checker();
}


// Twitter
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
    }
})(document, "script", "twitter-wjs");

