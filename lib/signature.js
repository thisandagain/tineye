/**
 * Signature generation component.
 *
 * @package tineye
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var _       = require('lodash'),
    crypto  = require('crypto');

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

/**
 * Constructor
 */
function Signature (self, args) {
    _.extend(args, self.defaults);

    // Create epoch & nonce
    var epoch   = getEpoch();
    var nonce   = getNonce();

    // Generate the signature string
    var concat  = self.private;                     // Private key
    concat      += args.method.toUpperCase();       // HTTP method
    concat      += '';                              // Content-type (not-supported)
    concat      += '';                              // Uploaded image name (not-supported)
    concat      += epoch;                           // Date
    concat      += nonce;                           // Nonce
    concat      += self.defaults.base + args.uri;   // Request url

    // Append query string params (if applicable)
    if (typeof args.qs !== 'undefined') {
        concat += 'image_url=' + encodeURIComponent(args.qs['image_url']).toLowerCase();
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
 * Export
 */
module.exports = Signature;