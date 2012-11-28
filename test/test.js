
describe('TrelloChecker', function() {
    var Notif = TrelloChecker;

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
        expect(Notif.getColor('alert')).toEqual([203, 77, 77, 255]);
        expect(Notif.getColor('ALERT')).toEqual([203, 77, 77, 255]);
    });

    it('getColor: CLEAR', function() {
        expect(Notif.getColor('clear')).toEqual([52, 178, 125, 255]);
        expect(Notif.getColor('CLEAR')).toEqual([52, 178, 125, 255]);
    });

    it('getColor: UNKO(not found type)', function() {
        expect(Notif.getColor('unko')).toEqual([66, 66, 66, 255]);
        expect(Notif.getColor('UNKO')).toEqual([66, 66, 66, 255]);
    });

    it('getColor: empty string', function() {
        expect(Notif.getColor('')).toEqual([66, 66, 66, 255]);
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

