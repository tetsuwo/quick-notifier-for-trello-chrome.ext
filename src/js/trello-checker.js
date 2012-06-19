TrelloChecker = function() {
    this.API_URL = 'http://api.gosetsuden.jp';
    this.data    = { peak: {}, instant: {} };
    this.toolbar = chrome.browserAction;
}

TrelloChecker.prototype.indicate = function() {
    data.ratio = (data.instant.usage * 100) / data.peak.usage;
    data.result = Math.round(data.ratio);
    toolbar.setIcon({ path: 'images/meter_'+ String(Math.ceil(data.result/10)) +'.png' });
    toolbar.setBadgeText({ text: String(data.result) +'%' });
        localStorage.usageinfo = JSON.stringify(data);
};

TrelloChecker.prototype.get = function() {
    var region = JSON.parse(localStorage.region);
    var req = new XMLHttpRequest();
    req.open('GET', api + '/peak/' + region + '/supply/today', true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            data.peak = JSON.parse(req.responseText)[0];

            var req2 = new XMLHttpRequest();
            req2.open('GET', api + '/usage/' + region + '/instant/latest', true);
            req2.onreadystatechange = function() {
                if (req2.readyState === 4) {
                    data.instant = JSON.parse(req2.responseText)[0];
                    indicate();
                }
            }
            req2.send(null);
        }
    }
    req.send(null);
};

TrelloChecker.prototype.log = function(a) {
    console.log(a);
};

TrelloChecker.prototype.run = function(init) {
    if (init) {
        this.toolbar.setBadgeBackgroundColor({ color: [66, 66, 66, 255] });
        this.toolbar.setBadgeText({ text: '-' });
    }
//    get();
};

TrelloChecker.prototype.getData = function() {
    return data;
};
