TrelloChecker.run();

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

var _notif = function(init) {
    Trello.members.get(
        'me/notifications/unread',
        function (response) {
            var $target = $('.trello-notifications ul');

            if (init) {
                $target.empty();
            }
            /*response = [
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}},
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}},
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}},
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}},
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}},
                {data:{board:{id:1},card:{name:'hoge',idShort:'unko'}}}
            ];*/

            for (var key in response) {
                var row = response[key];
                $target.append($('<li />')
                    .append(
                        $('<a />').addClass('text')
                            .text(row.data.card.name)
                            .attr('target', '_blank')
                            .attr('href', [
                                TrelloChecker.url,
                                'card',
                                row.data.board.id,
                                row.data.card.idShort
                            ].join('/'))
                    )
                    .append(
                        $('<a />').addClass('read').text('X')
                            .data('id', row.id)
                            .attr('href', '#')
                    )
                );
            }

            if (!response || !response.length) {
                $target.append('<li><b style="color: #d00;">You have no notifications.</b></li>');
            }

            $('.trello-notifications').slideDown();
        },
        function (response) {
            console.log(response.status);
        }
    );
};

var _checker = function() {
    if (Trello.authorized()) {
        $('#deauthorize').attr('disabled', false);

        Trello.members.get('me', function(me) {
            console.log(me);
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

$(document).on('click', '.trello-notifications a.read', function() {
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
    if (confirm('Do you really want to deauthorize?')) {
        TrelloChecker.deauthorize();
        _checker();
    }
});

if (!Trello.authorized()) {
    chrome.tabs.create({
        url: window.location.origin + '/callback.html?mode=authorize'
    });
}
else {
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

// Facebook
/*
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/ja_JP/all.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

window.fbAsyncInit = function() {
    FB.init({
        appId      : '279973812102399', // App ID
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });
};
*/

// Google+
(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

