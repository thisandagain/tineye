/**
 * Test suite
 *
 * @package tineye
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async   = require('async'),
    test    = require('tap').test,
    target  = require(__dirname + '/../lib/index.js');

var tineye  = new target();

/**
 * Suite
 */
async.auto({

    search:     function (callback) {
        var image = 'http://www.tineye.com/images/meloncat.jpg';
        tineye.search(image, callback);
    },

    remaining:  function (callback) {
        tineye.remaining(callback);
    },

    count:      function (callback) {
        tineye.count(callback);
    },

    test:       ['search', 'remaining', 'count', function (callback, obj) {
        test('Component definition', function (t) {
            t.type(tineye, 'object', 'Component should be an object');
            t.type(tineye.search, 'function', 'Method should be a function');
            t.type(tineye.remaining, 'function', 'Method should be a function');
            t.type(tineye.count, 'function', 'Method should be a function');
            t.end();
        });

        test('Method response', function (t) {
            t.type(obj.search, 'object', 'Results should be an object');
            t.type(obj.remaining, 'object', 'Results should be an object');
            t.type(obj.count, 'object', 'Results should be an object');
            t.end();
        });

        callback();
    }]

}, function (err, obj) {
    test('Catch errors', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.end();
    });
});