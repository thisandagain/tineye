var test    = require('tap').test,
    tineye  = require('../../lib/index.js');

var client  = new tineye();

client.count(function (err, result) {
    console.dir(err);
    console.dir(result);

    test('unit', function (t) {
        t.equal(err, null, 'error object is null');
        t.type(result, 'object', 'result should be an object');

        t.equal(result.code, 200, 'code is of expected value');
        t.type(result.results, 'number', 'results is an integer');

        t.end();
    });
});