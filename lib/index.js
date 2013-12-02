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
    cork        = require('cork'),
    crypto      = require('crypto');

/**
 * Generates a unix time stamp.
 *
 * @return {Number}
 */
function getEpoch () {
    return Math.round((new Date()).getTime() / 1000);
}

/**
 * Generates a random string.
 *
 * @return {String}
 */
function getNonce () {
    return Math.random().toString(36).substr(2, 24);
}

/**
 * Create HMAC-SHA1 hash from input & key.
 *
 * @param {String} Input
 * @param {String} Private key
 *
 * @return {String}
 */
function hmac (input, key) {
    return crypto.createHmac('sha1', key).update(input).digest('hex');
}

// --------------------------------
// --------------------------------

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
     * Request "signer".
     *
     * @param {Object} Request arguments.
     *
     * @return {Object}
     */
    self.sign = function (args) {
        _.extend(args, self.defaults);

        var epoch   = getEpoch();
        var nonce   = getNonce();

        var concat  = self.private;                     // Private key
        concat      += args.method.toUpperCase();       // HTTP method
        concat      += '';                              // Content-type
        concat      += '';                              // Uploaded image name
        concat      += epoch;                           // Date
        concat      += nonce;                           // Nonce
        concat      += self.defaults.base + args.uri;   // Request url

        // Query string params
        if (typeof args.qs !== 'undefined') {
            var append = encodeURIComponent(args.qs.image_url);
            concat += 'image_url=' + append;
        }

        // Return object to be appended to the query string
        return {
            'api_key':  self.public,
            'api_sig':  hmac(concat, self.private),
            'nonce':    nonce,
            'date':     epoch
        };
    };

    /**
     * Request adapter.
     *
     * @param {Object} HTTP request arguments
     *
     * @return {Object}
     */
    self.request = function (args, callback) {
        // Generate signature & request body
        var signature   = self.sign(args);
        var qs          = args.qs || Object.create(null);
        var body        = _.extend(args, {
            qs: signature
        });

        if (typeof qs.image_url !== 'undefined') {
            body.uri += '?image_url=' + encodeURIComponent(qs.image_url);
        }

        // Init request
        cork.request('tineye', body, callback);
    };
}

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