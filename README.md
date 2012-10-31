## tineye
#### Node.js client for the [Tineye](http://www.tineye.com/) search API

[![Build Status](https://secure.travis-ci.org/thisandagain/tineye.png)](http://travis-ci.org/thisandagain/tineye)

### Installation
```bash
npm install tineye
```

### Basic Use
```javascript
var tineye = require('tineye'),
    client = new tineye('publicKey', 'privateKey');

// Let's search for an image by it's URL
var imagePath = 'http://www.tineye.com/images/meloncat.jpg';
client.search(imagePath, function (err, results) {
    console.dir(results);   // Look at all those cat pictures!
});

// Now let's check on how many API requests we have left
client.remaining(function (err, results) {
    console.dir(results);
});

// Lastly, let's see how many images tineye has in it's index
client.count(function (err, results) {
    console.dir(results);
});

```

### Testing
```bash
npm test
```