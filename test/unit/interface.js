var test    = require('tap').test,
    tineye  = require('../../lib/index.js');

var client  = new tineye();

test('interface', function (t) {
    t.type(tineye, 'function', 'module is a function');
    t.type(client, 'object', 'instance is an object');

    t.type(client.search, 'function', 'instance includes expected method');
    t.type(client.remaining, 'function', 'instance includes expected method');
    t.type(client.count, 'function', 'instance includes expected method');

    t.end();
});