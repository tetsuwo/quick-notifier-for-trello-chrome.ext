
describe('Adapter', function() {
    var Notif = Adapter;

    it('default: url', function() {
        expect(Notif.url).toEqual('https://trello.com');
    });

    it('default: timer', function() {
        expect(Notif.timer).toEqual(15000);
    });

    it('default: prevCount', function() {
        expect(Notif.prevCount).toBe(null);
    });

    it('default: toolbar', function() {
//        expect(Notif.toolbar).toBe(undefined);
    });

    it('getColor: ALERT', function() {
        expect(Notif.getColor('ALERT')).toEqual([200, 0, 0, 255]);
    });

    it('getColor: Not found type', function() {
        expect(Notif.getColor('CLEAR')).toEqual([150, 150, 150, 255]);
        expect(Notif.getColor('hoge')).toEqual([150, 150, 150, 255]);
    });

    it('getColor: empty string', function() {
        expect(Notif.getColor('')).toEqual([150, 150, 150, 255]);
    });

    it('getColor: null character', function() {
        expect(function() {
            Notif.getColor(null);
        }).toThrow();
    });

    it('getColor: nothing', function() {
        expect(function() {
            Notif.getColor();
        }).toThrow();
    });
});

