/**
 * Node.js client for the Tineye API
 *
 * @package tineye
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var _           = require('lodash'),
    cork        = require('cork');

var Signature   = require('./signature');

/**
 * Export
 */
function Tineye (public, private) {
    var self = this;

    // Defaults
    self.public     = public;
    self.private    = private;
    self.defaults   = {
        base:       'http://api.tineye.com/rest',
        throttle:   2000,
        method:     'get',
        json:       {}
    };

    // Run in sandbox mode if no public/private keys are provided
    // https://api.tineye.com/documentation/sandbox
    if (typeof public === 'undefined' && typeof private === 'undefined') {
        self.public         = 'LCkn,2K7osVwkX95K4Oy';
        self.private        = '6mm60lsCNIB,FwOWjJqA80QZHh9BMwc-ber4u=t^';
        self.defaults.base  = 'http://api.tineye.com/sandbox';
    }

    /**
     * Register the tineye API with cork.
     */
    cork.register('tineye', self.defaults);

    /**
     * Request adapter.
     *
     * @param {Object} HTTP request arguments
     *
     * @return {Object}
     */
    self.request = function (args, callback) {
        // Generate signature & request body
        var signature   = new Signature(self, args);
        var qs          = args.qs || Object.create(null);
        var body        = _.extend(args, {
            qs: signature
        });

        if (typeof qs['image_url'] !== 'undefined') {
            body.uri += '?image_url=' + encodeURIComponent(qs['image_url']).toLowerCase();
        }

        // Init request
        cork.request('tineye', body, callback);
    };
};

/**
 * Perform searches on the TinEye index.
 *
 * @param {String} Image url
 *
 * @return {Object}
 */
Tineye.prototype.search = function (url, callback) {
    this.request({
        uri: '/search',
        qs: {
            'image_url': url
        }
    }, callback);
};

/**
 * Lists the number of searches you have left in your current active block.
 *
 * @return {Object}
 */
Tineye.prototype.remaining = function (callback) {
    this.request({
        uri: '/remaining_searches'
    }, callback);
};

/**
 * Lists the number of indexed images.
 *
 * @return {Object}
 */
Tineye.prototype.count = function (callback) {
    this.request({
        uri: '/image_count'
    }, callback);
};

/**
 * Export
 */
module.exports = Tineye;