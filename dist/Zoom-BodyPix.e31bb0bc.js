// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backend = Je;
exports.buffer = tr;
exports.customGrad = Xr;
exports.deprecationWarn = Be;
exports.disableDeprecationWarnings = Me;
exports.dispose = ze;
exports.disposeVariables = Pe;
exports.enableDebugMode = Fe;
exports.enableProdMode = Oe;
exports.engine = Le;
exports.env = a;
exports.fill = Dn;
exports.findBackend = Xe;
exports.findBackendFactory = Ye;
exports.getBackend = Ke;
exports.grad = Hr;
exports.grads = qr;
exports.keep = Ge;
exports.linspace = _n;
exports.memory = We;
exports.nextFrame = Wp;
exports.ones = An;
exports.op = mn;
exports.print = er;
exports.profile = Ue;
exports.range = On;
exports.ready = $e;
exports.registerBackend = Qe;
exports.removeBackend = je;
exports.scalar = Cn;
exports.setBackend = qe;
exports.setPlatform = Ze;
exports.tensor = bn;
exports.tensor1d = En;
exports.tensor2d = Rn;
exports.tensor3d = In;
exports.tensor4d = kn;
exports.tensor5d = Nn;
exports.tensor6d = Sn;
exports.tidy = Ve;
exports.time = He;
exports.valueAndGrad = $r;
exports.valueAndGrads = Kr;
exports.variableGrads = jr;
exports.zeros = Tn;
exports.isFinite = exports.irfft = exports.io = exports.inTopKAsync = exports.image = exports.imag = exports.ifft = exports.hannWindow = exports.hammingWindow = exports.greaterStrict = exports.greaterEqualStrict = exports.greaterEqual = exports.greater = exports.gatherND = exports.gather = exports.fused = exports.frame = exports.floorDiv = exports.floor = exports.fft = exports.eye = exports.expm1 = exports.expandDims = exports.exp = exports.erf = exports.equalStrict = exports.equal = exports.elu = exports.dropout = exports.dot = exports.divStrict = exports.div = exports.diag = exports.depthwiseConv2d = exports.depthToSpace = exports.cumsum = exports.cosh = exports.cos = exports.conv3dTranspose = exports.conv3d = exports.conv2dTranspose = exports.conv2d = exports.conv1d = exports.concat4d = exports.concat3d = exports.concat2d = exports.concat1d = exports.concat = exports.complex = exports.clone = exports.clipByValue = exports.ceil = exports.cast = exports.browser = exports.booleanMaskAsync = exports.batchToSpaceND = exports.batchNormalization4d = exports.batchNormalization3d = exports.batchNormalization2d = exports.batchNormalization = exports.batchNorm4d = exports.batchNorm3d = exports.batchNorm2d = exports.batchNorm = exports.basicLSTMCell = exports.backend_util = exports.avgPool3d = exports.avgPool = exports.atanh = exports.atan2 = exports.atan = exports.asinh = exports.asin = exports.argMin = exports.argMax = exports.any = exports.all = exports.addStrict = exports.addN = exports.add = exports.acosh = exports.acos = exports.abs = exports.Variable = exports.TensorBuffer = exports.Tensor = exports.SGDOptimizer = exports.Reduction = exports.Rank = exports.RMSPropOptimizer = exports.Optimizer = exports.MomentumOptimizer = exports.KernelBackend = exports.Environment = exports.ENV = exports.DataStorage = exports.AdamaxOptimizer = exports.AdamOptimizer = exports.AdagradOptimizer = exports.AdadeltaOptimizer = void 0;
exports.step = exports.stack = exports.squeeze = exports.squaredDifferenceStrict = exports.squaredDifference = exports.square = exports.sqrt = exports.split = exports.spectral = exports.sparseToDense = exports.spaceToBatchND = exports.softplus = exports.softmax = exports.slice4d = exports.slice3d = exports.slice2d = exports.slice1d = exports.slice = exports.sinh = exports.sin = exports.signal = exports.sign = exports.sigmoid = exports.setdiff1dAsync = exports.serialization = exports.separableConv2d = exports.selu = exports.scatterND = exports.rsqrt = exports.round = exports.rfft = exports.reverse4d = exports.reverse3d = exports.reverse2d = exports.reverse1d = exports.reverse = exports.reshape = exports.relu6 = exports.relu = exports.reciprocal = exports.real = exports.randomUniform = exports.randomNormal = exports.randomGamma = exports.rand = exports.prod = exports.prelu = exports.powStrict = exports.pow = exports.pool = exports.pad4d = exports.pad3d = exports.pad2d = exports.pad1d = exports.pad = exports.outerProduct = exports.onesLike = exports.oneHot = exports.notEqualStrict = exports.notEqual = exports.norm = exports.neg = exports.multinomial = exports.multiRNNCell = exports.mulStrict = exports.mul = exports.movingAverage = exports.moments = exports.modStrict = exports.mod = exports.minimumStrict = exports.minimum = exports.min = exports.mean = exports.maximumStrict = exports.maximum = exports.maxPool3d = exports.maxPool = exports.max = exports.math = exports.matMul = exports.losses = exports.logicalXor = exports.logicalOr = exports.logicalNot = exports.logicalAnd = exports.logSumExp = exports.logSoftmax = exports.logSigmoid = exports.log1p = exports.log = exports.localResponseNormalization = exports.linalg = exports.lessStrict = exports.lessEqualStrict = exports.lessEqual = exports.less = exports.leakyRelu = exports.isNaN = exports.isInf = void 0;
exports.zerosLike = exports.whereAsync = exports.where = exports.webgl = exports.version_core = exports.variable = exports.util = exports.unstack = exports.unsortedSegmentSum = exports.truncatedNormal = exports.transpose = exports.train = exports.topk = exports.tile = exports.test_util = exports.tensor_util = exports.tanh = exports.tan = exports.sum = exports.subStrict = exports.sub = exports.stridedSlice = exports.stft = void 0;

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var t = function (e, n) {
  return (t = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (t, e) {
    t.__proto__ = e;
  } || function (t, e) {
    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
  })(e, n);
};

function e(e, n) {
  function r() {
    this.constructor = e;
  }

  t(e, n), e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
}

function n(t, e, n, r) {
  return new (n || (n = Promise))(function (o, a) {
    function i(t) {
      try {
        u(r.next(t));
      } catch (t) {
        a(t);
      }
    }

    function s(t) {
      try {
        u(r.throw(t));
      } catch (t) {
        a(t);
      }
    }

    function u(t) {
      t.done ? o(t.value) : new n(function (e) {
        e(t.value);
      }).then(i, s);
    }

    u((r = r.apply(t, e || [])).next());
  });
}

function r(t, e) {
  var n,
      r,
      o,
      a,
      i = {
    label: 0,
    sent: function () {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return a = {
    next: s(0),
    throw: s(1),
    return: s(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function () {
    return this;
  }), a;

  function s(a) {
    return function (s) {
      return function (a) {
        if (n) throw new TypeError("Generator is already executing.");

        for (; i;) try {
          if (n = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, a[1])).done) return o;

          switch (r = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;

            case 4:
              return i.label++, {
                value: a[1],
                done: !1
              };

            case 5:
              i.label++, r = a[1], a = [0];
              continue;

            case 7:
              a = i.ops.pop(), i.trys.pop();
              continue;

            default:
              if (!(o = (o = i.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                i = 0;
                continue;
              }

              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                i.label = a[1];
                break;
              }

              if (6 === a[0] && i.label < o[1]) {
                i.label = o[1], o = a;
                break;
              }

              if (o && i.label < o[2]) {
                i.label = o[2], i.ops.push(a);
                break;
              }

              o[2] && i.ops.pop(), i.trys.pop();
              continue;
          }

          a = e.call(t, i);
        } catch (t) {
          a = [6, t], r = 0;
        } finally {
          n = o = 0;
        }

        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([a, s]);
    };
  }
}

var o = function () {
  function t(t) {
    this.global = t, this.flags = {}, this.flagRegistry = {}, this.urlFlags = {}, this.populateURLFlags();
  }

  return t.prototype.setPlatform = function (t, e) {
    null != this.platform && console.warn("Platform " + this.platformName + " has already been set. Overwriting the platform with " + e + "."), this.platformName = t, this.platform = e;
  }, t.prototype.registerFlag = function (t, e, n) {
    if (this.flagRegistry[t] = {
      evaluationFn: e,
      setHook: n
    }, null != this.urlFlags[t]) {
      var r = this.urlFlags[t];
      console.warn("Setting feature override from URL " + t + ": " + r + "."), this.set(t, r);
    }
  }, t.prototype.get = function (t) {
    return t in this.flags ? this.flags[t] : (this.flags[t] = this.evaluateFlag(t), this.flags[t]);
  }, t.prototype.getNumber = function (t) {
    return this.get(t);
  }, t.prototype.getBool = function (t) {
    return this.get(t);
  }, t.prototype.getFlags = function () {
    return this.flags;
  }, Object.defineProperty(t.prototype, "features", {
    get: function () {
      return this.flags;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.set = function (t, e) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot set flag " + t + " as it has not been registered.");
    this.flags[t] = e, null != this.flagRegistry[t].setHook && this.flagRegistry[t].setHook(e);
  }, t.prototype.evaluateFlag = function (t) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot evaluate flag '" + t + "': no evaluation function found.");
    return this.flagRegistry[t].evaluationFn();
  }, t.prototype.setFlags = function (t) {
    this.flags = Object.assign({}, t);
  }, t.prototype.reset = function () {
    this.flags = {}, this.urlFlags = {}, this.populateURLFlags();
  }, t.prototype.populateURLFlags = function () {
    var t = this;

    if (void 0 !== this.global && void 0 !== this.global.location && void 0 !== this.global.location.search) {
      var e,
          n,
          r = (e = this.global.location.search, n = {}, e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, function (t) {
        for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];

        return function (t, e, n) {
          t[decodeURIComponent(e)] = decodeURIComponent(n || "");
        }(n, e[0], e[1]), e.join("=");
      }), n);
      if ("tfjsflags" in r) r.tfjsflags.split(",").forEach(function (e) {
        var n = e.split(":"),
            r = n[0],
            o = n[1];

        t.urlFlags[r] = function (t, e) {
          if ("true" === (e = e.toLowerCase()) || "false" === e) return "true" === e;
          if ("" + +e === e) return +e;
          throw new Error("Could not parse value flag value " + e + " for flag " + t + ".");
        }(r, o);
      });
    }
  }, t;
}();

exports.Environment = o;

function a() {
  return i;
}

var i = null;
exports.ENV = i;

function s(t) {
  for (var e = t.length, n = 0, r = 0; e > 0;) r = Math.random() * e | 0, n = t[--e], t[e] = t[r], t[r] = n;
}

function u(t, e, n) {
  return Math.max(t, Math.min(e, n));
}

function l(t) {
  return t % 2 == 0 ? t : t + 1;
}

function c(t) {
  for (var e = 0, n = 0; n < t.length; n++) e += t[n];

  return e;
}

function h(t, e) {
  if (!t) throw new Error("string" == typeof e ? e : e());
}

function p(t, e, n) {
  void 0 === n && (n = ""), h(m(t, e), function () {
    return n + " Shapes " + t + " and " + e + " must match";
  });
}

function f(t) {
  h(null != t, function () {
    return "The input to the tensor constructor must be a non-null value.";
  });
}

function d(t, e, n) {
  if (void 0 === e && (e = []), void 0 === n && (n = !1), null == e && (e = []), Array.isArray(t) || T(t) && !n) for (var r = 0; r < t.length; ++r) d(t[r], e, n);else e.push(t);
  return e;
}

function v(t) {
  if (0 === t.length) return 1;

  for (var e = t[0], n = 1; n < t.length; n++) e *= t[n];

  return e;
}

function m(t, e) {
  if (t === e) return !0;
  if (null == t || null == e) return !1;
  if (t.length !== e.length) return !1;

  for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;

  return !0;
}

function g(t) {
  return t % 1 == 0;
}

function y(t) {
  if (null != Math.tanh) return Math.tanh(t);
  if (t === 1 / 0) return 1;
  if (t === -1 / 0) return -1;
  var e = Math.exp(2 * t);
  return (e - 1) / (e + 1);
}

function x(t) {
  var e = Math.ceil(Math.sqrt(t));
  return [e, Math.ceil(t / e)];
}

function b(t, e) {
  return e <= t.length ? t : t + " ".repeat(e - t.length);
}

function w(t, e, n) {
  return void 0 === e && (e = function (t) {
    return 0;
  }), new Promise(function (r, o) {
    var a = 0,
        i = function () {
      if (t()) r();else {
        var s = e(++a);
        null != n && a >= n ? o() : setTimeout(i, s);
      }
    };

    i();
  });
}

function C(t, e) {
  for (var n = 1, r = -1, o = 0; o < t.length; ++o) if (t[o] >= 0) n *= t[o];else if (-1 === t[o]) {
    if (-1 !== r) throw Error("Shapes can only have 1 implicit size. Found -1 at dim " + r + " and dim " + o);
    r = o;
  } else if (t[o] < 0) throw Error("Shapes can not be < 0. Found " + t[o] + " at dim " + o);

  if (-1 === r) {
    if (e > 0 && e !== n) throw Error("Size(" + e + ") must match the product of shape " + t);
    return t;
  }

  if (0 === n) throw Error("Cannot infer the missing size in [" + t + "] when there are 0 elements");
  if (e % n != 0) throw Error("The implicit shape can't be a fractional number. Got " + e + " / " + n);
  var a = t.slice();
  return a[r] = e / n, a;
}

function E(t, e) {
  var n = e.length;
  return h((t = null == t ? e.map(function (t, e) {
    return e;
  }) : [].concat(t)).every(function (t) {
    return t >= -n && t < n;
  }), function () {
    return "All values in axis param must be in range [-" + n + ", " + n + ") but got axis " + t;
  }), h(t.every(function (t) {
    return g(t);
  }), function () {
    return "All values in axis param must be integers but got axis " + t;
  }), t.map(function (t) {
    return t < 0 ? n + t : t;
  });
}

function R(t, e) {
  for (var n = [], r = [], o = null != e && Array.isArray(e) && 0 === e.length, a = null == e || o ? null : E(e, t).sort(), i = 0, s = 0; s < t.length; ++s) {
    if (null != a) {
      if (a[i] === s && 1 !== t[s]) throw new Error("Can't squeeze axis " + s + " since its dim '" + t[s] + "' is not 1");
      (null == a[i] || a[i] > s) && 1 === t[s] && (n.push(t[s]), r.push(s)), a[i] <= s && i++;
    }

    1 !== t[s] && (n.push(t[s]), r.push(s));
  }

  return {
    newShape: n,
    keptDims: r
  };
}

function I(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else {
    if ("bool" !== t) throw new Error("Unknown data type " + t);
    n = new Uint8Array(e);
  }
  return n;
}

function k(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else if ("bool" === t) n = new Uint8Array(e);else {
    if ("string" !== t) throw new Error("Unknown data type " + t);
    n = new Array(e);
  }
  return n;
}

function N(t, e) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    if (isNaN(r) || !isFinite(r)) throw Error("A tensor of type " + e + " being uploaded contains " + r + ".");
  }
}

function S(t) {
  return "bool" === t || "complex64" === t || "float32" === t || "int32" === t || "string" === t;
}

function A(t, e) {
  return "complex64" !== e && ("float32" !== e || "complex64" === t) && ("int32" !== e || "float32" === t || "complex64" === t) && ("bool" !== e || "bool" !== t);
}

function T(t) {
  return t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array;
}

function D(t) {
  if ("float32" === t || "int32" === t) return 4;
  if ("complex64" === t) return 8;
  if ("bool" === t) return 1;
  throw new Error("Unknown dtype " + t);
}

function _(t) {
  if (null == t) return 0;
  var e = 0;
  return t.forEach(function (t) {
    return e += t.length;
  }), e;
}

function O(t) {
  return "string" == typeof t || t instanceof String;
}

function F(t) {
  return "boolean" == typeof t;
}

function M(t) {
  return "number" == typeof t;
}

function B(t) {
  return Array.isArray(t) ? B(t[0]) : t instanceof Float32Array ? "float32" : t instanceof Int32Array || t instanceof Uint8Array ? "int32" : M(t) ? "float32" : O(t) ? "string" : F(t) ? "bool" : "float32";
}

function P(t) {
  return !!(t && t.constructor && t.call && t.apply);
}

function L(t, e) {
  for (var n = e; n < t; ++n) if (t % n == 0) return n;

  return t;
}

function W(t) {
  var e = t.length;
  if (e < 2) return [];
  var n = new Array(e - 1);
  n[e - 2] = t[e - 1];

  for (var r = e - 3; r >= 0; --r) n[r] = n[r + 1] * t[r + 1];

  return n;
}

function U(t, e, n) {
  if ("string" === e) throw new Error("Cannot convert a string[] to a TypedArray");
  if (Array.isArray(t) && (t = d(t)), n && N(t, e), function (t, e) {
    return t instanceof Float32Array && "float32" === e || t instanceof Int32Array && "int32" === e || t instanceof Uint8Array && "bool" === e;
  }(t, e)) return t;
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);

  if ("bool" === e) {
    for (var r = new Uint8Array(t.length), o = 0; o < r.length; ++o) 0 !== Math.round(t[o]) && (r[o] = 1);

    return r;
  }

  throw new Error("Unknown data type " + e);
}

function V(t, e) {
  if (0 === t.length) return e[0];
  var n = t.reduce(function (t, e) {
    return t * e;
  });
  if (0 === n) return [];
  if (n !== e.length) throw new Error("[" + t + "] does not match the input size.");
  return function t(e, n, r) {
    var o = new Array();
    if (1 === n.length) for (var a = n[0], i = 0; i < a; i++) o[i] = r[e + i];else {
      a = n[0];
      var s = n.slice(1),
          u = s.reduce(function (t, e) {
        return t * e;
      });

      for (i = 0; i < a; i++) o[i] = t(e + i * u, s, r);
    }
    return o;
  }(0, t, e);
}

function z(t, e) {
  for (var n = G(t, e), r = 0; r < n.length; r++) n[r] = 1;

  return n;
}

function G(t, e) {
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);
  if ("bool" === e) return new Uint8Array(t);
  throw new Error("Unknown data type " + e);
}

function H() {
  return a().platform.now();
}

function q(t) {
  t.forEach(function (e) {
    h(Number.isInteger(e) && e >= 0, function () {
      return "Tensor must have a shape comprised of positive integers but got shape [" + t + "].";
    });
  });
}

function $(t, e) {
  return void 0 === e && (e = "utf-8"), e = e || "utf-8", a().platform.encode(t, e);
}

function K(t, e) {
  return void 0 === e && (e = "utf-8"), e = e || "utf-8", a().platform.decode(t, e);
}

var j = Object.freeze({
  shuffle: s,
  clamp: u,
  nearestLargerEven: l,
  sum: c,
  randUniform: function (t, e) {
    var n = Math.random();
    return e * n + (1 - n) * t;
  },
  distSquared: function (t, e) {
    for (var n = 0, r = 0; r < t.length; r++) {
      var o = Number(t[r]) - Number(e[r]);
      n += o * o;
    }

    return n;
  },
  assert: h,
  assertShapesMatch: p,
  assertNonNull: f,
  flatten: d,
  sizeFromShape: v,
  isScalarShape: function (t) {
    return 0 === t.length;
  },
  arraysEqual: m,
  isInt: g,
  tanh: y,
  sizeToSquarishShape: x,
  createShuffledIndices: function (t) {
    for (var e = new Uint32Array(t), n = 0; n < t; ++n) e[n] = n;

    return s(e), e;
  },
  rightPad: b,
  repeatedTry: w,
  inferFromImplicitShape: C,
  parseAxisParam: E,
  squeezeShape: R,
  getTypedArrayFromDType: I,
  getArrayFromDType: k,
  checkConversionForErrors: N,
  isValidDtype: S,
  hasEncodingLoss: A,
  isTypedArray: T,
  bytesPerElement: D,
  bytesFromStringArray: _,
  isString: O,
  isBoolean: F,
  isNumber: M,
  inferDtype: B,
  isFunction: P,
  nearestDivisor: L,
  computeStrides: W,
  toTypedArray: U,
  toNestedArray: V,
  makeOnesTypedArray: z,
  makeZerosTypedArray: G,
  now: H,
  assertNonNegativeIntegerDimensions: q,
  fetch: function (t, e) {
    return a().platform.fetch(t, e);
  },
  encodeString: $,
  decodeString: K
}),
    X = function () {
  function t(t, e) {
    this.backendTimer = t, this.logger = e, null == e && (this.logger = new Y());
  }

  return t.prototype.profileKernel = function (t, e, n) {
    var r,
        o = this,
        a = this.backendTimer.time(function () {
      r = n();
    });
    return (Array.isArray(r) ? r : [r]).forEach(function (n) {
      n.data().then(function (r) {
        !function (t, e, n) {
          if ("float32" !== e) return !1;

          for (var r = 0; r < t.length; r++) {
            var o = t[r];
            if (isNaN(o) || !isFinite(o)) return console.warn("Found " + o + " in the result of '" + n + "'"), !0;
          }
        }(r, n.dtype, t), a.then(function (a) {
          var i = "";
          null != a.getExtraProfileInfo && (i = a.getExtraProfileInfo()), o.logger.logKernelProfile(t, n, r, a.kernelMs, e, i);
        });
      });
    }), r;
  }, t;
}();

exports.util = j;

var Y = function () {
  function t() {}

  return t.prototype.logKernelProfile = function (t, e, n, r, o, a) {
    var i = b(r + "ms", 9),
        s = b(t, 25),
        u = e.rank,
        l = e.size,
        c = b(e.shape.toString(), 14),
        h = "";

    for (var p in o) {
      var f = o[p].shape,
          d = f.length;
      h += p + ": " + d + "D " + (d > 0 ? f : "") + " ";
    }

    console.log("%c" + s + "\t%c" + i + "\t%c" + u + "D " + c + "\t%c" + l + "\t%c" + h + "\t%c" + a, "font-weight:bold", "color:red", "color:blue", "color: orange", "color: green", "color: steelblue");
  }, t;
}(),
    Q = 20,
    J = 3,
    Z = 7;

function tt(t, e, n, r) {
  var o = W(e),
      a = function (t, e, n, r) {
    var o = v(e),
        a = r[r.length - 1],
        i = new Array(a).fill(0),
        s = e.length,
        u = "complex64" === n ? rt(t) : t;
    if (s > 1) for (var l = 0; l < o / a; l++) for (var c = l * a, h = 0; h < a; h++) i[h] = Math.max(i[h], et(u[c + h], 0, n).length);
    return i;
  }(t, e, n, o),
      i = e.length,
      s = function t(e, n, r, o, a, i) {
    void 0 === i && (i = !0);
    var s = "complex64" === r ? 2 : 1;
    var u = n[0];
    var l = n.length;

    if (0 === l) {
      if ("complex64" === r) {
        var c = rt(e);
        return [et(c[0], 0, r)];
      }

      return "bool" === r ? [nt(e[0])] : [e[0].toString()];
    }

    if (1 === l) {
      if (u > Q) {
        var h = J * s,
            p = Array.from(e.slice(0, h)),
            f = Array.from(e.slice(u - J * s, u));
        return "complex64" === r && (p = rt(p), f = rt(f)), ["[" + p.map(function (t, e) {
          return et(t, a[e], r);
        }).join(", ") + ", ..., " + f.map(function (t, e) {
          return et(t, a[u - J + e], r);
        }).join(", ") + "]"];
      }

      var d = "complex64" === r ? rt(e) : Array.from(e);
      return ["[" + d.map(function (t, e) {
        return et(t, a[e], r);
      }).join(", ") + "]"];
    }

    var v = n.slice(1);
    var m = o.slice(1);
    var g = o[0] * s;
    var y = [];

    if (u > Q) {
      for (var x = 0; x < J; x++) {
        var b = x * g,
            w = b + g;
        y.push.apply(y, t(e.slice(b, w), v, r, m, a, !1));
      }

      y.push("...");

      for (var x = u - J; x < u; x++) {
        var b = x * g,
            w = b + g;
        y.push.apply(y, t(e.slice(b, w), v, r, m, a, x === u - 1));
      }
    } else for (var x = 0; x < u; x++) {
      var b = x * g,
          w = b + g;
      y.push.apply(y, t(e.slice(b, w), v, r, m, a, x === u - 1));
    }

    var C = 2 === l ? "," : "";
    y[0] = "[" + y[0] + C;

    for (var x = 1; x < y.length - 1; x++) y[x] = " " + y[x] + C;

    var E = ",\n";

    for (var x = 2; x < l; x++) E += "\n";

    y[y.length - 1] = " " + y[y.length - 1] + "]" + (i ? "" : E);
    return y;
  }(t, e, n, o, a),
      u = ["Tensor"];

  return r && (u.push("  dtype: " + n), u.push("  rank: " + i), u.push("  shape: [" + e + "]"), u.push("  values:")), u.push(s.map(function (t) {
    return "    " + t;
  }).join("\n")), u.join("\n");
}

function et(t, e, n) {
  return b(Array.isArray(t) ? parseFloat(t[0].toFixed(Z)) + " + " + parseFloat(t[1].toFixed(Z)) + "j" : O(t) ? "'" + t + "'" : "bool" === n ? nt(t) : parseFloat(t.toFixed(Z)).toString(), e);
}

function nt(t) {
  return 0 === t ? "false" : "true";
}

function rt(t) {
  for (var e = [], n = 0; n < t.length; n += 2) e.push([t[n], t[n + 1]]);

  return e;
}

var ot = function () {
  function t(t, e, n) {
    var r = this;

    if (this.dtype = e, this.shape = t.slice(), this.size = v(t), null != n) {
      var o = n.length;
      h(o === this.size, function () {
        return "Length of values '" + o + "' does not match the size inferred by the shape '" + r.size + "'.";
      });
    }

    if ("complex64" === e) throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");
    this.values = n || k(e, this.size), this.strides = W(t);
  }

  return t.prototype.set = function (t) {
    for (var e = this, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];

    0 === n.length && (n = [0]), h(n.length === this.rank, function () {
      return "The number of provided coordinates (" + n.length + ") must match the rank (" + e.rank + ")";
    });
    var o = this.locToIndex(n);
    this.values[o] = t;
  }, t.prototype.get = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    0 === t.length && (t = [0]);

    for (var n = 0, r = 0, o = t; r < o.length; r++) {
      var a = o[r];

      if (a < 0 || a >= this.shape[n]) {
        var i = "Requested out of range element at " + t + ".   Buffer shape=" + this.shape;
        throw new Error(i);
      }

      n++;
    }

    for (var s = t[t.length - 1], u = 0; u < t.length - 1; ++u) s += this.strides[u] * t[u];

    return this.values[s];
  }, t.prototype.locToIndex = function (t) {
    if (0 === this.rank) return 0;
    if (1 === this.rank) return t[0];

    for (var e = t[t.length - 1], n = 0; n < t.length - 1; ++n) e += this.strides[n] * t[n];

    return e;
  }, t.prototype.indexToLoc = function (t) {
    if (0 === this.rank) return [];
    if (1 === this.rank) return [t];

    for (var e = new Array(this.shape.length), n = 0; n < e.length - 1; ++n) e[n] = Math.floor(t / this.strides[n]), t -= e[n] * this.strides[n];

    return e[e.length - 1] = t, e;
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.toTensor = function () {
    return ut.make(this.shape, {
      values: this.values
    }, this.dtype);
  }, t;
}(),
    at = null,
    it = null,
    st = null;

exports.TensorBuffer = ot;

var ut = function () {
  function t(t, e, n, r, o) {
    this.kept = !1, this.isDisposedInternal = !1, this.shape = t.slice(), this.dtype = e || "float32", this.size = v(t), this.strides = W(t), this.dataId = null != r ? r : {}, this.id = at().nextTensorId(), this.rankType = this.rank < 5 ? this.rank.toString() : "higher", at().registerTensor(this, o), null != n && at().write(o, this.dataId, n);
  }

  return t.make = function (e, n, r, o) {
    var a = n.values;
    return null != n.values && "string" === r && O(n.values[0]) && (a = n.values.map(function (t) {
      return $(t);
    })), new t(e, r, a, n.dataId, o);
  }, t.prototype.flatten = function () {
    return this.throwIfDisposed(), this.as1D();
  }, t.prototype.asScalar = function () {
    return this.throwIfDisposed(), h(1 === this.size, function () {
      return "The array must have only 1 element.";
    }), this.reshape([]);
  }, t.prototype.as1D = function () {
    return this.throwIfDisposed(), this.reshape([this.size]);
  }, t.prototype.as2D = function (t, e) {
    return this.throwIfDisposed(), this.reshape([t, e]);
  }, t.prototype.as3D = function (t, e, n) {
    return this.throwIfDisposed(), this.reshape([t, e, n]);
  }, t.prototype.as4D = function (t, e, n, r) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r]);
  }, t.prototype.as5D = function (t, e, n, r, o) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r, o]);
  }, t.prototype.asType = function (t) {
    return this.throwIfDisposed(), it.cast(this, t);
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.buffer = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, it.buffer(this.shape, this.dtype, t)];
        }
      });
    });
  }, t.prototype.bufferSync = function () {
    return it.buffer(this.shape, this.dtype, this.dataSync());
  }, t.prototype.array = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, V(this.shape, t)];
        }
      });
    });
  }, t.prototype.arraySync = function () {
    return V(this.shape, this.dataSync());
  }, t.prototype.data = function () {
    return n(this, void 0, void 0, function () {
      var t, e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return this.throwIfDisposed(), t = at().read(this.dataId), "string" !== this.dtype ? [3, 2] : [4, t];

          case 1:
            e = n.sent();

            try {
              return [2, e.map(function (t) {
                return K(t);
              })];
            } catch (t) {
              throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().");
            }

            n.label = 2;

          case 2:
            return [2, t];
        }
      });
    });
  }, t.prototype.dataSync = function () {
    this.throwIfDisposed();
    var t = at().readSync(this.dataId);
    if ("string" === this.dtype) try {
      return t.map(function (t) {
        return K(t);
      });
    } catch (t) {
      throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().");
    }
    return t;
  }, t.prototype.bytes = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return this.throwIfDisposed(), [4, at().read(this.dataId)];

          case 1:
            return t = e.sent(), "string" === this.dtype ? [2, t] : [2, new Uint8Array(t.buffer)];
        }
      });
    });
  }, t.prototype.dispose = function () {
    this.isDisposed || (at().disposeTensor(this), this.isDisposedInternal = !0);
  }, Object.defineProperty(t.prototype, "isDisposed", {
    get: function () {
      return this.isDisposedInternal;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.throwIfDisposed = function () {
    if (this.isDisposed) throw new Error("Tensor is disposed.");
  }, t.prototype.toFloat = function () {
    return this.asType("float32");
  }, t.prototype.toInt = function () {
    return this.asType("int32");
  }, t.prototype.toBool = function () {
    return this.asType("bool");
  }, t.prototype.print = function (t) {
    return void 0 === t && (t = !1), it.print(this, t);
  }, t.prototype.reshape = function (t) {
    return this.throwIfDisposed(), it.reshape(this, t);
  }, t.prototype.reshapeAs = function (t) {
    return this.throwIfDisposed(), this.reshape(t.shape);
  }, t.prototype.expandDims = function (t) {
    return void 0 === t && (t = 0), it.expandDims(this, t);
  }, t.prototype.cumsum = function (t, e, n) {
    return void 0 === t && (t = 0), void 0 === e && (e = !1), void 0 === n && (n = !1), it.cumsum(this, t, e, n);
  }, t.prototype.squeeze = function (t) {
    return this.throwIfDisposed(), it.squeeze(this, t);
  }, t.prototype.clone = function () {
    return this.throwIfDisposed(), it.clone(this);
  }, t.prototype.oneHot = function (t, e, n) {
    return this.throwIfDisposed(), it.oneHot(this, t, e, n);
  }, t.prototype.toString = function (t) {
    return void 0 === t && (t = !1), tt(this.dataSync(), this.shape, this.dtype, t);
  }, t.prototype.tile = function (t) {
    return this.throwIfDisposed(), it.tile(this, t);
  }, t.prototype.gather = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), it.gather(this, t, e);
  }, t.prototype.matMul = function (t, e, n) {
    return void 0 === e && (e = !1), void 0 === n && (n = !1), this.throwIfDisposed(), it.matMul(this, t, e, n);
  }, t.prototype.dot = function (t) {
    return this.throwIfDisposed(), it.dot(this, t);
  }, t.prototype.norm = function (t, e, n) {
    return void 0 === t && (t = "euclidean"), void 0 === e && (e = null), void 0 === n && (n = !1), this.throwIfDisposed(), it.norm(this, t, e, n);
  }, t.prototype.slice = function (t, e) {
    return this.throwIfDisposed(), it.slice(this, t, e);
  }, t.prototype.reverse = function (t) {
    return this.throwIfDisposed(), it.reverse(this, t);
  }, t.prototype.concat = function (e, n) {
    return void 0 === n && (n = 0), this.throwIfDisposed(), e instanceof t && (e = [e]), it.concat([this].concat(e), n);
  }, t.prototype.split = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), it.split(this, t, e);
  }, t.prototype.stack = function (t, e) {
    return void 0 === e && (e = 0), it.stack([this, t], e);
  }, t.prototype.unstack = function (t) {
    return void 0 === t && (t = 0), it.unstack(this, t);
  }, t.prototype.pad = function (t, e) {
    return void 0 === e && (e = 0), it.pad(this, t, e);
  }, t.prototype.batchNormalization = function (t, e, n, r, o) {
    return void 0 === n && (n = .001), st("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon"), this.batchNorm(t, e, o, r, n);
  }, t.prototype.batchNorm = function (t, e, n, r, o) {
    return void 0 === o && (o = .001), this.throwIfDisposed(), it.batchNorm(this, t, e, n, r, o);
  }, t.prototype.all = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.all(this, t, e);
  }, t.prototype.any = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.any(this, t, e);
  }, t.prototype.logSumExp = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.logSumExp(this, t, e);
  }, t.prototype.sum = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.sum(this, t, e);
  }, t.prototype.prod = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.prod(this, t, e);
  }, t.prototype.mean = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.mean(this, t, e);
  }, t.prototype.min = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.min(this, t, e);
  }, t.prototype.max = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), it.max(this, t, e);
  }, t.prototype.argMin = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), it.argMin(this, t);
  }, t.prototype.argMax = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), it.argMax(this, t);
  }, t.prototype.cast = function (t) {
    return this.throwIfDisposed(), it.cast(this, t);
  }, t.prototype.add = function (t) {
    return this.throwIfDisposed(), it.add(this, t);
  }, t.prototype.addStrict = function (t) {
    return this.throwIfDisposed(), it.addStrict(this, t);
  }, t.prototype.atan2 = function (t) {
    return this.throwIfDisposed(), it.atan2(this, t);
  }, t.prototype.sub = function (t) {
    return this.throwIfDisposed(), it.sub(this, t);
  }, t.prototype.subStrict = function (t) {
    return this.throwIfDisposed(), it.subStrict(this, t);
  }, t.prototype.pow = function (t) {
    return this.throwIfDisposed(), it.pow(this, t);
  }, t.prototype.powStrict = function (t) {
    return this.throwIfDisposed(), it.powStrict(this, t);
  }, t.prototype.mul = function (t) {
    return this.throwIfDisposed(), it.mul(this, t);
  }, t.prototype.mulStrict = function (t) {
    return this.throwIfDisposed(), it.mulStrict(this, t);
  }, t.prototype.div = function (t) {
    return this.throwIfDisposed(), it.div(this, t);
  }, t.prototype.floorDiv = function (t) {
    return this.throwIfDisposed(), it.floorDiv(this, t);
  }, t.prototype.divStrict = function (t) {
    return this.throwIfDisposed(), it.divStrict(this, t);
  }, t.prototype.minimum = function (t) {
    return this.throwIfDisposed(), it.minimum(this, t);
  }, t.prototype.minimumStrict = function (t) {
    return this.throwIfDisposed(), it.minimumStrict(this, t);
  }, t.prototype.maximum = function (t) {
    return this.throwIfDisposed(), it.maximum(this, t);
  }, t.prototype.maximumStrict = function (t) {
    return this.throwIfDisposed(), it.maximumStrict(this, t);
  }, t.prototype.mod = function (t) {
    return this.throwIfDisposed(), it.mod(this, t);
  }, t.prototype.modStrict = function (t) {
    return this.throwIfDisposed(), it.modStrict(this, t);
  }, t.prototype.squaredDifference = function (t) {
    return this.throwIfDisposed(), it.squaredDifference(this, t);
  }, t.prototype.squaredDifferenceStrict = function (t) {
    return this.throwIfDisposed(), it.squaredDifferenceStrict(this, t);
  }, t.prototype.transpose = function (t) {
    return this.throwIfDisposed(), it.transpose(this, t);
  }, t.prototype.notEqual = function (t) {
    return this.throwIfDisposed(), it.notEqual(this, t);
  }, t.prototype.notEqualStrict = function (t) {
    return this.throwIfDisposed(), it.notEqualStrict(this, t);
  }, t.prototype.less = function (t) {
    return this.throwIfDisposed(), it.less(this, t);
  }, t.prototype.lessStrict = function (t) {
    return this.throwIfDisposed(), it.lessStrict(this, t);
  }, t.prototype.equal = function (t) {
    return this.throwIfDisposed(), it.equal(this, t);
  }, t.prototype.equalStrict = function (t) {
    return this.throwIfDisposed(), it.equalStrict(this, t);
  }, t.prototype.lessEqual = function (t) {
    return this.throwIfDisposed(), it.lessEqual(this, t);
  }, t.prototype.lessEqualStrict = function (t) {
    return this.throwIfDisposed(), it.lessEqualStrict(this, t);
  }, t.prototype.greater = function (t) {
    return this.throwIfDisposed(), it.greater(this, t);
  }, t.prototype.greaterStrict = function (t) {
    return this.throwIfDisposed(), it.greaterStrict(this, t);
  }, t.prototype.greaterEqual = function (t) {
    return this.throwIfDisposed(), it.greaterEqual(this, t);
  }, t.prototype.greaterEqualStrict = function (t) {
    return this.throwIfDisposed(), it.greaterEqualStrict(this, t);
  }, t.prototype.logicalAnd = function (t) {
    return this.throwIfDisposed(), it.logicalAnd(this, t);
  }, t.prototype.logicalOr = function (t) {
    return this.throwIfDisposed(), it.logicalOr(this, t);
  }, t.prototype.logicalNot = function () {
    return this.throwIfDisposed(), it.logicalNot(this);
  }, t.prototype.logicalXor = function (t) {
    return this.throwIfDisposed(), it.logicalXor(this, t);
  }, t.prototype.where = function (t, e) {
    return this.throwIfDisposed(), it.where(t, this, e);
  }, t.prototype.neg = function () {
    return this.throwIfDisposed(), it.neg(this);
  }, t.prototype.ceil = function () {
    return this.throwIfDisposed(), it.ceil(this);
  }, t.prototype.floor = function () {
    return this.throwIfDisposed(), it.floor(this);
  }, t.prototype.sign = function () {
    return this.throwIfDisposed(), it.sign(this);
  }, t.prototype.isNaN = function () {
    return this.throwIfDisposed(), it.isNaN(this);
  }, t.prototype.isInf = function () {
    return this.throwIfDisposed(), it.isInf(this);
  }, t.prototype.isFinite = function () {
    return this.throwIfDisposed(), it.isFinite(this);
  }, t.prototype.exp = function () {
    return this.throwIfDisposed(), it.exp(this);
  }, t.prototype.expm1 = function () {
    return this.throwIfDisposed(), it.expm1(this);
  }, t.prototype.log = function () {
    return this.throwIfDisposed(), it.log(this);
  }, t.prototype.log1p = function () {
    return this.throwIfDisposed(), it.log1p(this);
  }, t.prototype.sqrt = function () {
    return this.throwIfDisposed(), it.sqrt(this);
  }, t.prototype.rsqrt = function () {
    return this.throwIfDisposed(), it.rsqrt(this);
  }, t.prototype.square = function () {
    return this.throwIfDisposed(), it.square(this);
  }, t.prototype.reciprocal = function () {
    return this.throwIfDisposed(), it.reciprocal(this);
  }, t.prototype.abs = function () {
    return this.throwIfDisposed(), it.abs(this);
  }, t.prototype.clipByValue = function (t, e) {
    return this.throwIfDisposed(), it.clipByValue(this, t, e);
  }, t.prototype.relu = function () {
    return this.throwIfDisposed(), it.relu(this);
  }, t.prototype.relu6 = function () {
    return this.throwIfDisposed(), it.relu6(this);
  }, t.prototype.elu = function () {
    return this.throwIfDisposed(), it.elu(this);
  }, t.prototype.selu = function () {
    return this.throwIfDisposed(), it.selu(this);
  }, t.prototype.leakyRelu = function (t) {
    return void 0 === t && (t = .2), this.throwIfDisposed(), it.leakyRelu(this, t);
  }, t.prototype.prelu = function (t) {
    return this.throwIfDisposed(), it.prelu(this, t);
  }, t.prototype.sigmoid = function () {
    return this.throwIfDisposed(), it.sigmoid(this);
  }, t.prototype.logSigmoid = function () {
    return this.throwIfDisposed(), it.logSigmoid(this);
  }, t.prototype.softplus = function () {
    return this.throwIfDisposed(), it.softplus(this);
  }, t.prototype.zerosLike = function () {
    return this.throwIfDisposed(), it.zerosLike(this);
  }, t.prototype.onesLike = function () {
    return this.throwIfDisposed(), it.onesLike(this);
  }, t.prototype.sin = function () {
    return this.throwIfDisposed(), it.sin(this);
  }, t.prototype.cos = function () {
    return this.throwIfDisposed(), it.cos(this);
  }, t.prototype.tan = function () {
    return this.throwIfDisposed(), it.tan(this);
  }, t.prototype.asin = function () {
    return this.throwIfDisposed(), it.asin(this);
  }, t.prototype.acos = function () {
    return this.throwIfDisposed(), it.acos(this);
  }, t.prototype.atan = function () {
    return this.throwIfDisposed(), it.atan(this);
  }, t.prototype.sinh = function () {
    return this.throwIfDisposed(), it.sinh(this);
  }, t.prototype.cosh = function () {
    return this.throwIfDisposed(), it.cosh(this);
  }, t.prototype.tanh = function () {
    return this.throwIfDisposed(), it.tanh(this);
  }, t.prototype.asinh = function () {
    return this.throwIfDisposed(), it.asinh(this);
  }, t.prototype.acosh = function () {
    return this.throwIfDisposed(), it.acosh(this);
  }, t.prototype.atanh = function () {
    return this.throwIfDisposed(), it.atanh(this);
  }, t.prototype.erf = function () {
    return this.throwIfDisposed(), it.erf(this);
  }, t.prototype.round = function () {
    return this.throwIfDisposed(), it.round(this);
  }, t.prototype.step = function (t) {
    return void 0 === t && (t = 0), this.throwIfDisposed(), it.step(this, t);
  }, t.prototype.softmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), it.softmax(this, t);
  }, t.prototype.logSoftmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), it.logSoftmax(this, t);
  }, t.prototype.resizeBilinear = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), it.image.resizeBilinear(this, t, e);
  }, t.prototype.resizeNearestNeighbor = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), it.image.resizeNearestNeighbor(this, t, e);
  }, t.prototype.conv1d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NWC"), void 0 === o && (o = 1), this.throwIfDisposed(), it.conv1d(this, t, e, n, r, o, a);
  }, t.prototype.conv2d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), it.conv2d(this, t, e, n, r, o, a);
  }, t.prototype.conv2dTranspose = function (t, e, n, r, o) {
    return this.throwIfDisposed(), it.conv2dTranspose(this, t, e, n, r, o);
  }, t.prototype.depthwiseConv2D = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), it.depthwiseConv2d(this, t, e, n, r, o, a);
  }, t.prototype.separableConv2d = function (t, e, n, r, o, a) {
    return void 0 === o && (o = [1, 1]), void 0 === a && (a = "NHWC"), this.throwIfDisposed(), it.separableConv2d(this, t, e, n, r, o, a);
  }, t.prototype.avgPool = function (t, e, n, r) {
    return this.throwIfDisposed(), it.avgPool(this, t, e, n, r);
  }, t.prototype.maxPool = function (t, e, n, r) {
    return this.throwIfDisposed(), it.maxPool(this, t, e, n, r);
  }, t.prototype.localResponseNormalization = function (t, e, n, r) {
    return void 0 === t && (t = 5), void 0 === e && (e = 1), void 0 === n && (n = 1), void 0 === r && (r = .5), it.localResponseNormalization(this, t, e, n, r);
  }, t.prototype.pool = function (t, e, n, r, o) {
    return this.throwIfDisposed(), it.pool(this, t, e, n, r, o);
  }, t.prototype.variable = function (t, e, n) {
    return void 0 === t && (t = !0), this.throwIfDisposed(), lt.variable(this, t, e, n);
  }, t.prototype.unsortedSegmentSum = function (t, e) {
    return this.throwIfDisposed(), it.unsortedSegmentSum(this, t, e);
  }, t.prototype.batchToSpaceND = function (t, e) {
    return this.throwIfDisposed(), it.batchToSpaceND(this, t, e);
  }, t.prototype.spaceToBatchND = function (t, e) {
    return this.throwIfDisposed(), it.spaceToBatchND(this, t, e);
  }, t.prototype.topk = function (t, e) {
    return void 0 === t && (t = 1), void 0 === e && (e = !0), this.throwIfDisposed(), it.topk(this, t, e);
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s) {
    return void 0 === r && (r = 0), void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), this.throwIfDisposed(), it.stridedSlice(this, t, e, n, r, o, a, i, s);
  }, t.prototype.depthToSpace = function (t, e) {
    return this.throwIfDisposed(), it.depthToSpace(this, t, e);
  }, t.prototype.fft = function () {
    return this.throwIfDisposed(), it.spectral.fft(this);
  }, t.prototype.ifft = function () {
    return this.throwIfDisposed(), it.spectral.ifft(this);
  }, t.prototype.rfft = function () {
    return this.throwIfDisposed(), it.spectral.rfft(this);
  }, t.prototype.irfft = function () {
    return this.throwIfDisposed(), it.spectral.irfft(this);
  }, t;
}();

exports.Tensor = ut;
Object.defineProperty(ut, Symbol.hasInstance, {
  value: function (t) {
    return !!t && null != t.dataId && null != t.shape && null != t.dtype;
  }
});

var lt = function (t) {
  function n(e, n, r) {
    void 0 === n && (n = !0);
    var o = t.call(this, e.shape, e.dtype, null, e.dataId) || this;
    o.trainable = n, o.name = r, null == o.name && (o.name = at().nextVariableId().toString());

    try {
      at().registerVariable(o);
    } catch (t) {
      throw at().disposeTensor(o), t;
    }

    return o;
  }

  return e(n, t), n.variable = function (t, e, r, o) {
    return void 0 === e && (e = !0), null != o && o !== t.dtype && (t = t.asType(o)), new n(t, e, r);
  }, n.prototype.assign = function (t) {
    if (t.dtype !== this.dtype) throw new Error("dtype of the new value (" + t.dtype + ") and previous value (" + this.dtype + ") must match");
    if (!m(t.shape, this.shape)) throw new Error("shape of the new value (" + t.shape + ") and previous value (" + this.shape + ") must match");
    at().disposeTensor(this), this.dataId = t.dataId, at().registerTensor(this);
  }, n.prototype.dispose = function () {
    at().disposeVariable(this), this.isDisposedInternal = !0;
  }, n;
}(ut);

exports.Variable = lt;
Object.defineProperty(lt, Symbol.hasInstance, {
  value: function (t) {
    return t instanceof ut && null != t.assign && t.assign instanceof Function;
  }
});
var ct,
    ht,
    pt,
    ft,
    dt,
    vt = lt.variable;
exports.variable = vt;
exports.Rank = ct;
!function (t) {
  t.R0 = "R0", t.R1 = "R1", t.R2 = "R2", t.R3 = "R3", t.R4 = "R4", t.R5 = "R5", t.R6 = "R6";
}(ct || (exports.Rank = ct = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "int32", t.complex64 = "complex64";
}(ht || (ht = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "bool", t.complex64 = "complex64";
}(pt || (pt = {})), function (t) {
  t.float32 = "float32", t.int32 = "float32", t.bool = "float32", t.complex64 = "complex64";
}(ft || (ft = {})), function (t) {
  t.float32 = "complex64", t.int32 = "complex64", t.bool = "complex64", t.complex64 = "complex64";
}(dt || (dt = {}));
var mt = {
  float32: ft,
  int32: ht,
  bool: pt,
  complex64: dt
};

function gt(t, e) {
  if ("string" === t || "string" === e) {
    if ("string" === t && "string" === e) return "string";
    throw new Error("Can not upcast " + t + " with " + e);
  }

  return mt[t][e];
}

function yt(t) {
  return gt(t, "int32");
}

function xt(t, e) {
  if (t.dtype === e.dtype) return [t, e];
  var n = gt(t.dtype, e.dtype);
  return [t.cast(n), e.cast(n)];
}

function bt(t, e) {
  h(t.dtype === e.dtype, function () {
    return "The dtypes of the first(" + t.dtype + ") and second(" + e.dtype + ") input must match";
  });
}

function wt(t) {
  var e = [];
  return function t(e, n, r) {
    if (null == e) return;
    if (e instanceof ut) return void n.push(e);
    if (o = e, !Array.isArray(o) && "object" != typeof o) return;
    var o;
    var a = e;

    for (var i in a) {
      var s = a[i];
      r.has(s) || (r.add(s), t(s, n, r));
    }
  }(t, e, new Set()), e;
}

var Ct,
    Et = Object.freeze({
  makeTypesMatch: xt,
  assertTypesMatch: bt,
  isTensorInList: function (t, e) {
    for (var n = 0; n < e.length; n++) if (e[n].id === t.id) return !0;

    return !1;
  },
  getTensorsInContainer: wt
}),
    Rt = function () {
  function t() {
    this.registeredVariables = {}, this.nextTapeNodeId = 0, this.numBytes = 0, this.numTensors = 0, this.numStringTensors = 0, this.numDataBuffers = 0, this.gradientDepth = 0, this.kernelDepth = 0, this.scopeStack = [], this.nextScopeId = 0, this.tensorInfo = new WeakMap(), this.profiling = !1, this.activeProfile = {
      newBytes: 0,
      newTensors: 0,
      peakBytes: 0,
      kernels: [],
      result: null
    };
  }

  return t.prototype.dispose = function () {
    for (var t in this.registeredVariables) this.registeredVariables[t].dispose();
  }, t;
}(),
    It = function () {
  function t(t) {
    this.ENV = t, this.registry = {}, this.registryFactory = {}, this.pendingBackendInitId = 0, this.state = new Rt();
  }

  return t.prototype.ready = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (null != this.pendingBackendInit) return [2, this.pendingBackendInit.then(function () {})];
            if (null != this.backendInstance) return [2];
            t = this.getSortedBackends(), e = 0, r.label = 1;

          case 1:
            return e < t.length ? (n = t[e], [4, this.initializeBackend(n).success]) : [3, 5];

          case 2:
            return r.sent() ? [4, this.setBackend(n)] : [3, 4];

          case 3:
            return r.sent(), [2];

          case 4:
            return e++, [3, 1];

          case 5:
            throw new Error("Could not initialize any backends, all backend initializations failed.");
        }
      });
    });
  }, Object.defineProperty(t.prototype, "backend", {
    get: function () {
      if (null != this.pendingBackendInit) throw new Error("Backend '" + this.backendName + "' has not yet been initialized. Make sure to await tf.ready() before calling other methods");

      if (null == this.backendInstance) {
        var t = this.initializeBackendsAndReturnBest(),
            e = t.name;
        if (t.asyncInit) throw new Error("The highest priority backend '" + e + "' has not yet been initialized. Make sure to await tf.ready() before calling other methods");
        this.setBackend(e);
      }

      return this.backendInstance;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.backendNames = function () {
    return Object.keys(this.registryFactory);
  }, t.prototype.findBackend = function (t) {
    if (!(t in this.registry)) {
      if (!(t in this.registryFactory)) return null;
      if (this.initializeBackend(t).asyncInit) return null;
    }

    return this.registry[t];
  }, t.prototype.findBackendFactory = function (t) {
    return t in this.registryFactory ? this.registryFactory[t].factory : null;
  }, t.prototype.registerBackend = function (t, e, n) {
    return void 0 === n && (n = 1), t in this.registryFactory ? (console.warn(t + " backend was already registered. Reusing existing backend factory."), !1) : (this.registryFactory[t] = {
      factory: e,
      priority: n
    }, !0);
  }, t.prototype.setBackend = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (null == this.registryFactory[t]) throw new Error("Backend name '" + t + "' not found in registry");
            return this.backendName = t, null != this.registry[t] ? [3, 4] : (this.backendInstance = null, e = this.initializeBackend(t), n = e.success, e.asyncInit ? [4, n] : [3, 2]);

          case 1:
            return o = r.sent(), [3, 3];

          case 2:
            o = n, r.label = 3;

          case 3:
            if (!o) return [2, !1];
            r.label = 4;

          case 4:
            return this.backendInstance = this.registry[t], this.profiler = new X(this.backendInstance), [2, !0];
        }
      });
    });
  }, t.prototype.initializeBackend = function (t) {
    var e = this,
        n = this.registryFactory[t];
    if (null == n) throw new Error("Cannot initialize backend " + t + ", no registration found.");

    try {
      var r = n.factory();

      if (Promise.resolve(r) === r) {
        var o = ++this.pendingBackendInitId,
            a = r.then(function (n) {
          return !(o < e.pendingBackendInitId) && (e.registry[t] = n, e.pendingBackendInit = null, !0);
        }).catch(function (n) {
          return !(o < e.pendingBackendInitId) && (e.pendingBackendInit = null, console.warn("Initialization of backend " + t + " failed"), console.warn(n.stack || n.message), !1);
        });
        return this.pendingBackendInit = a, {
          success: a,
          asyncInit: !0
        };
      }

      return this.registry[t] = r, {
        success: !0,
        asyncInit: !1
      };
    } catch (e) {
      return console.warn("Initialization of backend " + t + " failed"), console.warn(e.stack || e.message), {
        success: !1,
        asyncInit: !1
      };
    }
  }, t.prototype.removeBackend = function (t) {
    if (!(t in this.registryFactory)) throw new Error(t + " backend not found in registry");
    this.backendName === t && null != this.pendingBackendInit && this.pendingBackendInitId++, t in this.registry && (this.registry[t].dispose(), delete this.registry[t]), delete this.registryFactory[t], this.backendName === t && (this.pendingBackendInit = null, this.backendName = null, this.backendInstance = null);
  }, t.prototype.getSortedBackends = function () {
    var t = this;
    if (0 === Object.keys(this.registryFactory).length) throw new Error("No backend found in registry.");
    return Object.keys(this.registryFactory).sort(function (e, n) {
      return t.registryFactory[n].priority - t.registryFactory[e].priority;
    });
  }, t.prototype.initializeBackendsAndReturnBest = function () {
    for (var t = this.getSortedBackends(), e = 0; e < t.length; e++) {
      var n = t[e],
          r = this.initializeBackend(n),
          o = r.success,
          a = r.asyncInit;
      if (a || o) return {
        name: n,
        asyncInit: a
      };
    }

    throw new Error("Could not initialize any backends, all backend initializations failed.");
  }, t.prototype.moveData = function (t, e) {
    this.write(t, e, this.readSync(e));
  }, t.prototype.tidy = function (t, e) {
    var n,
        r = this,
        o = null;

    if (null == e) {
      if ("function" != typeof t) throw new Error("Please provide a function to tidy()");
      e = t;
    } else {
      if ("string" != typeof t && !(t instanceof String)) throw new Error("When calling with two arguments, the first argument to tidy() must be a string");
      if ("function" != typeof e) throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");
      o = t;
    }

    return this.scopedRun(function () {
      return r.startScope(o);
    }, function () {
      return r.endScope(n);
    }, function () {
      return (n = e()) instanceof Promise && console.error("Cannot return a Promise inside of tidy."), n;
    });
  }, t.prototype.scopedRun = function (t, e, n) {
    t();

    try {
      var r = n();
      return e(), r;
    } catch (t) {
      throw e(), t;
    }
  }, t.prototype.nextTensorId = function () {
    return t.nextTensorId++;
  }, t.prototype.nextVariableId = function () {
    return t.nextVariableId++;
  }, t.prototype.clone = function (t) {
    var e = ut.make(t.shape, {
      dataId: t.dataId
    }, t.dtype);
    return this.addTapeNode([t], e, function (t) {
      return [t.toFloat()];
    }), e;
  }, t.prototype.runKernel = function (t, e, n) {
    var r,
        o = this,
        a = [],
        i = this.isTapeOn(),
        s = null != this.state.activeScope ? this.state.activeScope.name : "",
        u = function (t) {
      i && (a = t.map(function (t) {
        return o.keep(o.clone(t));
      }));
    },
        l = this.state.numBytes,
        c = this.state.numTensors;

    if (this.scopedRun(function () {
      return o.state.kernelDepth++;
    }, function () {
      return o.state.kernelDepth--;
    }, function () {
      r = o.ENV.getBool("DEBUG") ? o.profiler.profileKernel(s, e, function () {
        return t(o.backend, u);
      }) : t(o.backend, u);
    }), i) {
      var h = {
        id: this.state.nextTapeNodeId++,
        name: s,
        inputs: e,
        outputs: Array.isArray(r) ? r : [r],
        saved: a
      };
      null != n && (h.gradient = function (t) {
        return n(t, a);
      }), this.state.activeTape.push(h);
    }

    return this.state.profiling && this.state.activeProfile.kernels.push({
      name: s,
      bytesAdded: this.state.numBytes - l,
      totalBytesSnapshot: this.state.numBytes,
      tensorsAdded: this.state.numTensors - c,
      totalTensorsSnapshot: this.state.numTensors,
      inputShapes: Object.keys(e).map(function (t) {
        return e[t].shape;
      }),
      outputShape: Array.isArray(r) ? r.map(function (t) {
        return t.shape;
      }) : r.shape
    }), r;
  }, t.prototype.registerTensor = function (t, e) {
    var n = this.state.tensorInfo.has(t.dataId) ? this.state.tensorInfo.get(t.dataId).refCount : 0;

    if (this.state.numTensors++, "string" === t.dtype && this.state.numStringTensors++, 0 === n) {
      this.state.numDataBuffers++;
      var r = 0;
      "complex64" !== t.dtype && "string" !== t.dtype && (r = t.size * D(t.dtype)), this.state.tensorInfo.set(t.dataId, {
        backend: null != e ? e : this.backend,
        dtype: t.dtype,
        shape: t.shape,
        bytes: r,
        refCount: 0
      }), this.state.numBytes += r, null != e ? e.register(t.dataId, t.shape, t.dtype) : this.backend.register(t.dataId, t.shape, t.dtype);
    }

    this.state.tensorInfo.get(t.dataId).refCount++, t instanceof lt || this.track(t);
  }, t.prototype.registerVariable = function (t) {
    if (null != this.state.registeredVariables[t.name]) throw new Error("Variable with name " + t.name + " was already registered");
    this.state.registeredVariables[t.name] = t;
  }, t.prototype.disposeTensor = function (t) {
    if (this.state.tensorInfo.has(t.dataId)) {
      this.state.numTensors--, "string" === t.dtype && this.state.numStringTensors--;
      var e = this.state.tensorInfo.get(t.dataId);
      e.refCount <= 1 ? ("complex64" !== t.dtype && (this.state.numBytes -= e.bytes), this.state.numDataBuffers--, e.backend.disposeData(t.dataId), this.state.tensorInfo.delete(t.dataId)) : this.state.tensorInfo.get(t.dataId).refCount--;
    }
  }, t.prototype.disposeVariables = function () {
    for (var t in this.state.registeredVariables) {
      var e = this.state.registeredVariables[t];
      this.disposeVariable(e);
    }
  }, t.prototype.disposeVariable = function (t) {
    this.disposeTensor(t), null != this.state.registeredVariables[t.name] && delete this.state.registeredVariables[t.name];
  }, t.prototype.memory = function () {
    var t = this.backend.memory();
    return t.numTensors = this.state.numTensors, t.numDataBuffers = this.state.numDataBuffers, t.numBytes = this.state.numBytes, this.state.numStringTensors > 0 && (t.unreliable = !0, null == t.reasons && (t.reasons = []), t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")), t;
  }, t.prototype.profile = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        return this.state.profiling = !0, e = this.state.numBytes, n = this.state.numTensors, this.state.activeProfile.kernels = [], this.state.activeProfile.result = t(), this.state.profiling = !1, this.state.activeProfile.peakBytes = Math.max.apply(Math, this.state.activeProfile.kernels.map(function (t) {
          return t.totalBytesSnapshot;
        })), this.state.activeProfile.newBytes = this.state.numBytes - e, this.state.activeProfile.newTensors = this.state.numTensors - n, [2, this.state.activeProfile];
      });
    });
  }, t.prototype.isTapeOn = function () {
    return this.state.gradientDepth > 0 && 0 === this.state.kernelDepth;
  }, t.prototype.addTapeNode = function (t, e, n) {
    var r = {};
    t.forEach(function (t, e) {
      r[e] = t;
    });
    var o = {
      id: this.state.nextTapeNodeId++,
      name: this.state.activeScope.name,
      inputs: r,
      outputs: [e],
      gradient: function (t) {
        var e = n(t),
            r = {};
        return e.forEach(function (t, e) {
          r[e] = function () {
            return t;
          };
        }), r;
      }
    };
    this.state.activeTape.push(o);
  }, t.prototype.keep = function (t) {
    return t.kept = !0, t;
  }, t.prototype.startTape = function () {
    0 === this.state.gradientDepth && (this.state.activeTape = []), this.state.gradientDepth++;
  }, t.prototype.endTape = function () {
    this.state.gradientDepth--;
  }, t.prototype.startScope = function (t) {
    var e = {
      track: [],
      name: "unnamed scope",
      id: this.state.nextScopeId++
    };
    t && (e.name = t), this.state.scopeStack.push(e), this.state.activeScope = e;
  }, t.prototype.endScope = function (t) {
    for (var e = this, n = wt(t), r = new Set(n.map(function (t) {
      return t.id;
    })), o = 0; o < this.state.activeScope.track.length; o++) {
      var a = this.state.activeScope.track[o];
      a.kept || r.has(a.id) || a.dispose();
    }

    var i = this.state.scopeStack.pop();
    this.state.activeScope = 0 === this.state.scopeStack.length ? null : this.state.scopeStack[this.state.scopeStack.length - 1], n.forEach(function (t) {
      t.kept || t.scopeId !== i.id || e.track(t);
    });
  }, t.prototype.gradients = function (t, e, n, r) {
    var o = this;
    if (void 0 === r && (r = !1), h(e.length > 0, function () {
      return "gradients() received an empty list of xs.";
    }), null != n && "float32" !== n.dtype) throw new Error("dy must have 'float32' dtype, but has '" + n.dtype + "'");
    var a = this.scopedRun(function () {
      return o.startTape();
    }, function () {
      return o.endTape();
    }, function () {
      return o.tidy("forward", t);
    });
    h(a instanceof ut, function () {
      return "The result y returned by f() must be a tensor.";
    });

    var i = function (t, e, n) {
      for (var r = {}, o = {}, a = 0; a < e.length; a++) r[e[a].id] = !0;

      for (a = 0; a < t.length; a++) {
        var i = (d = t[a]).inputs;

        for (var s in i) {
          for (var u = i[s], l = !1, c = 0; c < e.length; c++) if (r[u.id]) {
            d.outputs.forEach(function (t) {
              return r[t.id] = !0;
            }), l = !0, o[d.id] = !0;
            break;
          }

          if (l) break;
        }
      }

      var h = {};
      h[n.id] = !0;
      var p = {};

      for (a = t.length - 1; a >= 0; a--) for (i = (d = t[a]).inputs, c = 0; c < d.outputs.length; c++) if (h[d.outputs[c].id]) {
        for (var s in i) h[i[s].id] = !0, p[d.id] = !0;

        break;
      }

      var f = [];

      for (a = 0; a < t.length; a++) {
        var d;

        if (o[(d = t[a]).id] && p[d.id]) {
          var v = {};

          for (var s in d.inputs) {
            var m = d.inputs[s];
            r[m.id] && (v[s] = m);
          }

          var g = Object.assign({}, d);
          g.inputs = v, g.outputs = d.outputs, f.push(g);
        }
      }

      return f;
    }(this.state.activeTape, e, a);

    if (!r && 0 === i.length && e.length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");
    return this.tidy("backward", function () {
      var t,
          r,
          s = {};
      s[a.id] = null == n ? (t = a.shape, r = z(v(t), "float32"), ut.make(t, {
        values: r
      })) : n, function (t, e, n) {
        for (var r = function (r) {
          var o = e[r],
              a = [];
          if (o.outputs.forEach(function (e) {
            var n = t[e.id];
            if (null != n) a.push(n);else {
              var r = ut.make(e.shape, {
                values: G(e.size, e.dtype)
              }, e.dtype);
              a.push(r);
            }
          }), null == o.gradient) throw new Error("Cannot compute gradient: gradient function not found for " + o.name + ".");

          var i = o.gradient(1 === o.outputs.length ? a[0] : a),
              s = function (e) {
            if (!(e in i)) throw new Error("Cannot backprop through input " + e + ". Available gradients found: " + Object.keys(i) + ".");
            var r = n(function () {
              return i[e]();
            });
            if ("float32" !== r.dtype) throw new Error("Error in gradient for op " + o.name + ". The gradient of input " + e + " must have 'float32' dtype, but has '" + r.dtype + "'");
            var a = o.inputs[e];
            if (!m(r.shape, a.shape)) throw new Error("Error in gradient for op " + o.name + ". The gradient of input '" + e + "' has shape '" + r.shape + "', which does not match the shape of the input '" + a.shape + "'");
            if (null == t[a.id]) t[a.id] = r;else {
              var s = t[a.id];
              t[a.id] = s.add(r), s.dispose();
            }
          };

          for (var u in o.inputs) s(u);
        }, o = e.length - 1; o >= 0; o--) r(o);
      }(s, i, function (t) {
        return o.tidy(t);
      });
      var u = e.map(function (t) {
        return s[t.id];
      });
      return 0 === o.state.gradientDepth && (o.state.activeTape.forEach(function (t) {
        for (var e in t.saved) t.saved[e].dispose();
      }), o.state.activeTape = null), {
        value: a,
        grads: u
      };
    });
  }, t.prototype.customGrad = function (t) {
    var e = this;
    return h(P(t), function () {
      return "The f passed in customGrad(f) must be a function.";
    }), function () {
      for (var n, r = [], o = 0; o < arguments.length; o++) r[o] = arguments[o];

      h(r.every(function (t) {
        return t instanceof ut;
      }), function () {
        return "The args passed in customGrad(f)(x1, x2,...) must all be tensors";
      });
      var a = {};
      return r.forEach(function (t, e) {
        a[e] = t;
      }), e.runKernel(function (e, o) {
        return h((n = t.apply(void 0, r.concat([o]))).value instanceof ut, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.value` is a tensor";
        }), h(P(n.gradFunc), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.";
        }), n.value;
      }, a, function (t, e) {
        var o = n.gradFunc(t, e),
            a = Array.isArray(o) ? o : [o];
        h(a.length === r.length, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).";
        }), h(a.every(function (t) {
          return t instanceof ut;
        }), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.";
        });
        var i = {};
        return a.forEach(function (t, e) {
          i[e] = function () {
            return t;
          };
        }), i;
      });
    };
  }, t.prototype.write = function (t, e, n) {
    var r = this.state.tensorInfo.get(e),
        o = r.backend;

    if (t = t || this.backend, "string" === r.dtype) {
      var a = _(n);

      this.state.numBytes += a - r.bytes, r.bytes = a;
    }

    t !== o && (o.disposeData(e), r.backend = t, t.register(e, r.shape, r.dtype)), t.write(e, n);
  }, t.prototype.readSync = function (t) {
    return this.state.tensorInfo.get(t).backend.readSync(t);
  }, t.prototype.read = function (t) {
    return this.state.tensorInfo.get(t).backend.read(t);
  }, t.prototype.fromPixels = function (t, e) {
    return this.backend.fromPixels(t, e);
  }, t.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return e = H(), [4, this.backend.time(t)];

          case 1:
            return (n = r.sent()).wallMs = H() - e, [2, n];
        }
      });
    });
  }, t.prototype.track = function (t) {
    return null != this.state.activeScope && (t.scopeId = this.state.activeScope.id, this.state.activeScope.track.push(t)), t;
  }, Object.defineProperty(t.prototype, "registeredVariables", {
    get: function () {
      return this.state.registeredVariables;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.reset = function () {
    for (var t in this.pendingBackendInitId++, this.state.dispose(), this.ENV.reset(), this.state = new Rt(), this.registry) this.registry[t].dispose(), delete this.registry[t];

    this.backendName = null, this.backendInstance = null, this.pendingBackendInit = null;
  }, t.nextTensorId = 0, t.nextVariableId = 0, t;
}();

exports.tensor_util = Et;

var kt = function () {
  var t = function () {
    if (null == Ct) {
      var t = void 0;
      if ("undefined" != typeof window) t = window;else if ("undefined" != typeof global) t = global;else if ("undefined" != typeof process) t = process;else {
        if ("undefined" == typeof self) throw new Error("Could not find a global object");
        t = self;
      }
      Ct = t;
    }

    return Ct;
  }();

  if (null == t._tfengine) {
    var e = new o(t);
    t._tfengine = new It(e);
  }

  return function (t) {
    exports.ENV = i = t;
  }(t._tfengine.ENV), at = function () {
    return t._tfengine;
  }, t._tfengine;
}();

function Nt() {
  return "undefined" != typeof window && null != window.document || "undefined" != typeof WorkerGlobalScope;
}

var St = a();
St.registerFlag("DEBUG", function () {
  return !1;
}, function (t) {
  t && console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.");
}), St.registerFlag("IS_BROWSER", function () {
  return Nt();
}), St.registerFlag("IS_NODE", function () {
  return "undefined" != typeof process && void 0 !== process.versions && void 0 !== process.versions.node;
}), St.registerFlag("IS_CHROME", function () {
  return "undefined" != typeof navigator && null != navigator && null != navigator.userAgent && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}), St.registerFlag("PROD", function () {
  return !1;
}), St.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY", function () {
  return St.getBool("DEBUG");
}), St.registerFlag("DEPRECATION_WARNINGS_ENABLED", function () {
  return !0;
}), St.registerFlag("IS_TEST", function () {
  return !1;
});
var At,
    Tt,
    Dt = {},
    _t = {
  alpha: !1,
  antialias: !1,
  premultipliedAlpha: !1,
  preserveDrawingBuffer: !1,
  depth: !1,
  stencil: !1,
  failIfMajorPerformanceCaveat: !0
};

function Ot(t, e) {
  Dt[t] = e;
}

function Ft(t) {
  t in Dt || (Dt[t] = function (t) {
    if (1 !== t && 2 !== t) throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");
    var e = Mt(t);
    if (e.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(), delete Dt[t];
    }, !1), 1 === t) return e.getContext("webgl", _t) || e.getContext("experimental-webgl", _t);
    return e.getContext("webgl2", _t);
  }(t));
  var e = Dt[t];
  return e.isContextLost() ? (delete Dt[t], Ft(t)) : (e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SAMPLE_COVERAGE), e.enable(e.SCISSOR_TEST), e.enable(e.CULL_FACE), e.cullFace(e.BACK), Dt[t]);
}

function Mt(t) {
  if ("undefined" != typeof OffscreenCanvas && 2 === t) return new OffscreenCanvas(300, 150);
  if ("undefined" != typeof document) return document.createElement("canvas");
  throw new Error("Cannot create a canvas in this context");
}

function Bt(t, e) {
  return [e, t];
}

function Pt(t) {
  var e = v(t);
  return x(Math.ceil(e / 4));
}

function Lt(t, e) {
  return [Math.max(1, Math.ceil(e / 2)), Math.max(1, Math.ceil(t / 2))];
}

function Wt(t, e) {
  var n,
      r,
      o,
      i,
      s,
      u,
      l,
      c,
      h,
      p = t;
  return 2 === a().getNumber("WEBGL_VERSION") ? (n = p.R32F, r = p.R16F, o = p.RGBA16F, i = p.RGBA32F, s = p.RED, u = 4, l = 1, c = p.HALF_FLOAT, h = p.FLOAT) : (n = t.RGBA, r = t.RGBA, o = t.RGBA, i = p.RGBA, s = t.RGBA, u = 4, l = 4, c = null != e ? e.HALF_FLOAT_OES : null, h = t.FLOAT), {
    internalFormatFloat: n,
    internalFormatHalfFloat: r,
    internalFormatPackedHalfFloat: o,
    internalFormatPackedFloat: i,
    textureFormatFloat: s,
    downloadTextureFormat: t.RGBA,
    downloadUnpackNumChannels: u,
    defaultNumChannels: l,
    textureTypeHalfFloat: c,
    textureTypeFloat: h
  };
}

function Ut(t, e, n) {
  var r = n();
  return e && function (t) {
    var e = t.getError();
    if (e !== t.NO_ERROR) throw new Error("WebGL Error: " + Ht(t, e));
  }(t), r;
}

!function (t) {
  t[t.RENDER = 0] = "RENDER", t[t.UPLOAD = 1] = "UPLOAD", t[t.PIXELS = 2] = "PIXELS", t[t.DOWNLOAD = 3] = "DOWNLOAD";
}(At || (At = {})), function (t) {
  t[t.UNPACKED_FLOAT16 = 0] = "UNPACKED_FLOAT16", t[t.UNPACKED_FLOAT32 = 1] = "UNPACKED_FLOAT32", t[t.PACKED_4X1_UNSIGNED_BYTE = 2] = "PACKED_4X1_UNSIGNED_BYTE", t[t.PACKED_2X2_FLOAT32 = 3] = "PACKED_2X2_FLOAT32", t[t.PACKED_2X2_FLOAT16 = 4] = "PACKED_2X2_FLOAT16";
}(Tt || (Tt = {}));
var Vt = 5.96e-8,
    zt = 65504;

function Gt(t) {
  return !!(a().getBool("WEBGL_RENDER_FLOAT32_ENABLED") || 0 === t || Vt < Math.abs(t) && Math.abs(t) < zt);
}

function Ht(t, e) {
  switch (e) {
    case t.NO_ERROR:
      return "NO_ERROR";

    case t.INVALID_ENUM:
      return "INVALID_ENUM";

    case t.INVALID_VALUE:
      return "INVALID_VALUE";

    case t.INVALID_OPERATION:
      return "INVALID_OPERATION";

    case t.INVALID_FRAMEBUFFER_OPERATION:
      return "INVALID_FRAMEBUFFER_OPERATION";

    case t.OUT_OF_MEMORY:
      return "OUT_OF_MEMORY";

    case t.CONTEXT_LOST_WEBGL:
      return "CONTEXT_LOST_WEBGL";

    default:
      return "Unknown error code " + e;
  }
}

function qt(t, e, n) {
  return de(t, e, function () {
    return t.getExtension(n);
  }, 'Extension "' + n + '" not supported on this browser.');
}

function $t(t, e, n) {
  var r = de(t, e, function () {
    return t.createShader(t.VERTEX_SHADER);
  }, "Unable to create vertex WebGLShader.");
  if (Ut(t, e, function () {
    return t.shaderSource(r, n);
  }), Ut(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw console.log(t.getShaderInfoLog(r)), new Error("Failed to compile vertex shader.");
  return r;
}

function Kt(t, e, n) {
  var r = de(t, e, function () {
    return t.createShader(t.FRAGMENT_SHADER);
  }, "Unable to create fragment WebGLShader.");
  if (Ut(t, e, function () {
    return t.shaderSource(r, n);
  }), Ut(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw function (t, e) {
    var n = Yt.exec(e);
    if (null == n) return console.log("Couldn't parse line number in error: " + e), void console.log(t);

    for (var r = +n[1], o = t.split("\n"), a = o.length.toString().length + 2, i = o.map(function (t, e) {
      return b((e + 1).toString(), a) + t;
    }), s = 0, u = 0; u < i.length; u++) s = Math.max(i[u].length, s);

    var l = i.slice(0, r - 1),
        c = i.slice(r - 1, r),
        h = i.slice(r);
    console.log(l.join("\n")), console.log(e.split("\n")[0]), console.log("%c " + b(c[0], s), "border:1px solid red; background-color:#e3d2d2; color:#a61717"), console.log(h.join("\n"));
  }(n, t.getShaderInfoLog(r)), new Error("Failed to compile fragment shader.");
  return r;
}

var jt,
    Xt,
    Yt = /ERROR: [0-9]+:([0-9]+):/g;

function Qt(t, e) {
  return de(t, e, function () {
    return t.createProgram();
  }, "Unable to create WebGLProgram.");
}

function Jt(t, e, n) {
  if (Ut(t, e, function () {
    return t.linkProgram(n);
  }), !1 === t.getProgramParameter(n, t.LINK_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Failed to link vertex and fragment shaders.");
}

function Zt(t, e, n) {
  if (Ut(t, e, function () {
    return t.validateProgram(n);
  }), !1 === t.getProgramParameter(n, t.VALIDATE_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Shader program validation failed.");
}

function te(t, e, n) {
  var r = de(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Ut(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), Ut(t, e, function () {
    return t.bufferData(t.ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function ee(t, e, n) {
  var r = de(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Ut(t, e, function () {
    return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, r);
  }), Ut(t, e, function () {
    return t.bufferData(t.ELEMENT_ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function ne(t, e) {
  return de(t, e, function () {
    return t.createTexture();
  }, "Unable to create WebGLTexture.");
}

function re(t, e) {
  var n = a().getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (t <= 0 || e <= 0) {
    var r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " is invalid.");
  }

  if (t > n || e > n) {
    r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " greater than WebGL maximum on this browser / GPU " + ("[" + n + "x" + n + "]") + ".");
  }
}

function oe(t, e) {
  return de(t, e, function () {
    return t.createFramebuffer();
  }, "Unable to create WebGLFramebuffer.");
}

function ae(t, e, n, r, o, a, i, s) {
  var u = t.getAttribLocation(n, r);
  return -1 !== u && (Ut(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, o);
  }), Ut(t, e, function () {
    return t.vertexAttribPointer(u, a, t.FLOAT, !1, i, s);
  }), Ut(t, e, function () {
    return t.enableVertexAttribArray(u);
  }), !0);
}

function ie(t, e, n, r) {
  ve(t, r), Ut(t, e, function () {
    return t.activeTexture(t.TEXTURE0 + r);
  }), Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  });
}

function se(t, e, n, r) {
  return de(t, e, function () {
    return t.getUniformLocation(n, r);
  }, 'uniform "' + r + '" not present in program.');
}

function ue(t, e, n) {
  return t.getUniformLocation(e, n);
}

function le(t, e, n, r, o, a) {
  Ut(t, e, function () {
    return ie(t, e, r, a);
  }), Ut(t, e, function () {
    return t.uniform1i(o, a);
  });
}

function ce(t, e, n, r) {
  Ut(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, r);
  }), Ut(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
  });
}

function he(t, e, n) {
  Ut(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, n);
  }), Ut(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, null, 0);
  });
}

function pe(t) {
  var e = t.checkFramebufferStatus(t.FRAMEBUFFER);
  if (e !== t.FRAMEBUFFER_COMPLETE) throw new Error("Error binding framebuffer: " + fe(t, e));
}

function fe(t, e) {
  switch (e) {
    case t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      return "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";

    case t.FRAMEBUFFER_UNSUPPORTED:
      return "FRAMEBUFFER_UNSUPPORTED";

    default:
      return "unknown error " + e;
  }
}

function de(t, e, n, r) {
  var o = Ut(t, e, function () {
    return n();
  });
  if (null == o) throw new Error(r);
  return o;
}

function ve(t, e) {
  var n = t.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1,
      r = e + t.TEXTURE0;
  if (r < t.TEXTURE0 || r > n) throw new Error("textureUnit must be in " + ("[gl.TEXTURE0, gl.TEXTURE" + n + "]") + ".");
}

function me(t, e) {
  return void 0 === e && (e = 2), v(t.slice(0, t.length - e));
}

function ge(t) {
  if (0 === t.length) throw Error("Cannot get rows and columns of an empty shape array.");
  return [t.length > 1 ? t[t.length - 2] : 1, t[t.length - 1]];
}

function ye(t) {
  var e = [1, 1, 1];
  return 0 === t.length || 1 === t.length && 1 === t[0] || (e = [me(t)].concat(ge(t))), e;
}

function xe(t, e) {
  var n;
  void 0 === e && (e = !1);
  var r = a().getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (e && (r *= 2, 1 === (t = t.map(function (e, n) {
    return n >= t.length - 2 ? l(t[n]) : t[n];
  })).length && (t = [2, t[0]])), 2 !== t.length) {
    var o = R(t);
    t = o.newShape;
  }

  var i = v(t);
  if (t.length <= 1 && i <= r) return [1, i];
  if (2 === t.length && t[0] <= r && t[1] <= r) return t;
  if (3 === t.length && t[0] * t[1] <= r && t[2] <= r) return [t[0] * t[1], t[2]];
  if (3 === t.length && t[0] <= r && t[1] * t[2] <= r) return [t[0], t[1] * t[2]];
  if (4 === t.length && t[0] * t[1] * t[2] <= r && t[3] <= r) return [t[0] * t[1] * t[2], t[3]];
  if (4 === t.length && t[0] <= r && t[1] * t[2] * t[3] <= r) return [t[0], t[1] * t[2] * t[3]];

  if (e) {
    var s = me(t),
        u = 2,
        c = 2;
    return t.length && (u = (n = ge(t))[0], c = n[1]), x(i = s * (u / 2) * (c / 2)).map(function (t) {
      return 2 * t;
    });
  }

  return x(i);
}

function be(t) {
  return t % 2 == 0;
}

function we(t, e) {
  if (m(t = t.slice(-2), e = e.slice(-2))) return !0;
  if (!t.length || !e.length) return !0;
  if (0 === t[0] || 0 === t[1] || 0 === e[0] || 0 === e[1]) return !0;

  if (t.length !== e.length) {
    var n = t.slice(-1)[0],
        r = e.slice(-1)[0];
    if (n === r) return !0;
    if (be(n) && be(r) && (1 === t[0] || 1 === e[0])) return !0;
  }

  return t[1] === e[1] && be(t[0]) && be(e[0]);
}

function Ce(t) {
  if (null == jt) {
    var e = Ft(t);
    jt = e.getParameter(e.MAX_TEXTURE_SIZE);
  }

  return jt;
}

function Ee(t) {
  if (null == Xt) {
    var e = Ft(t);
    Xt = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
  }

  return Math.min(16, Xt);
}

function Re(t) {
  if (0 === t) return 0;
  var e = Ft(t);
  return Ie(e, "EXT_disjoint_timer_query_webgl2") && 2 === t ? 2 : Ie(e, "EXT_disjoint_timer_query") ? 1 : 0;
}

function Ie(t, e) {
  return null != t.getExtension(e);
}

function ke(t) {
  try {
    if (null != Ft(t)) return !0;
  } catch (t) {
    return !1;
  }

  return !1;
}

function Ne(t) {
  if (0 === t) return !1;
  var e = Ft(t);

  if (1 === t) {
    if (!Ie(e, "OES_texture_float")) return !1;
  } else if (!Ie(e, "EXT_color_buffer_float")) return !1;

  return Ae(e);
}

function Se(t) {
  if (0 === t) return !1;
  var e = Ft(t);

  if (1 !== t) {
    if (Ie(e, "EXT_color_buffer_float")) return Ae(e);

    if (Ie(e, "EXT_color_buffer_half_float")) {
      var n = e.getExtension("EXT_color_buffer_half_float");
      return function (t, e) {
        var n = Wt(t, e),
            r = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, r);
        t.texImage2D(t.TEXTURE_2D, 0, n.internalFormatHalfFloat, 1, 1, 0, n.textureFormatFloat, n.textureTypeHalfFloat, null);
        var o = t.createFramebuffer();
        t.bindFramebuffer(t.FRAMEBUFFER, o), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, r, 0);
        var a = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE;
        return t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteTexture(r), t.deleteFramebuffer(o), a;
      }(e, n);
    }

    return !1;
  }

  return !!Ie(e, "OES_texture_float") && !!Ie(e, "WEBGL_color_buffer_float") && Ae(e);
}

function Ae(t) {
  var e = Wt(t),
      n = t.createTexture();
  t.bindTexture(t.TEXTURE_2D, n);
  t.texImage2D(t.TEXTURE_2D, 0, e.internalFormatFloat, 1, 1, 0, e.textureFormatFloat, e.textureTypeFloat, null);
  var r = t.createFramebuffer();
  t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
  var o = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE;
  return t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteTexture(n), t.deleteFramebuffer(r), o;
}

function Te(t) {
  return 2 === t && null != Ft(t).fenceSync;
}

var De = Object.freeze({
  callAndCheck: Ut,
  canBeRepresented: Gt,
  getWebGLErrorMessage: Ht,
  getExtensionOrThrow: qt,
  createVertexShader: $t,
  createFragmentShader: Kt,
  createProgram: Qt,
  linkProgram: Jt,
  validateProgram: Zt,
  createStaticVertexBuffer: te,
  createStaticIndexBuffer: ee,
  getNumChannels: function () {
    return 2 === a().getNumber("WEBGL_VERSION") ? 1 : 4;
  },
  createTexture: ne,
  validateTextureSize: re,
  createFramebuffer: oe,
  bindVertexBufferToProgramAttribute: ae,
  bindTextureUnit: ie,
  unbindTextureUnit: function (t, e, n) {
    ve(t, n), Ut(t, e, function () {
      return t.activeTexture(t.TEXTURE0 + n);
    }), Ut(t, e, function () {
      return t.bindTexture(t.TEXTURE_2D, null);
    });
  },
  getProgramUniformLocationOrThrow: se,
  getProgramUniformLocation: ue,
  bindTextureToProgramUniformSampler: le,
  bindCanvasToFramebuffer: function (t, e) {
    Ut(t, e, function () {
      return t.bindFramebuffer(t.FRAMEBUFFER, null);
    }), Ut(t, e, function () {
      return t.viewport(0, 0, t.canvas.width, t.canvas.height);
    }), Ut(t, e, function () {
      return t.scissor(0, 0, t.canvas.width, t.canvas.height);
    });
  },
  bindColorTextureToFramebuffer: ce,
  unbindColorTextureFromFramebuffer: he,
  validateFramebuffer: pe,
  getFramebufferErrorMessage: fe,
  getBatchDim: me,
  getRowsCols: ge,
  getShapeAs3D: ye,
  getTextureShapeFromLogicalShape: xe,
  isReshapeFree: we,
  getWebGLMaxTextureSize: Ce,
  resetMaxTextureSize: function () {
    jt = null;
  },
  resetMaxTexturesInShader: function () {
    Xt = null;
  },
  getMaxTexturesInShader: Ee,
  getWebGLDisjointQueryTimerVersion: Re,
  hasExtension: Ie,
  isWebGLVersionEnabled: ke,
  isCapableOfRenderingToFloatTexture: Ne,
  isDownloadFloatTextureEnabled: Se,
  isWebGLFenceEnabled: Te
}),
    _e = a();

function Oe() {
  a().set("PROD", !0);
}

function Fe() {
  a().set("DEBUG", !0);
}

function Me() {
  a().set("DEPRECATION_WARNINGS_ENABLED", !1), console.warn("TensorFlow.js deprecation warnings have been disabled.");
}

function Be(t) {
  a().getBool("DEPRECATION_WARNINGS_ENABLED") && console.warn(t + " You can disable deprecation warnings with tf.disableDeprecationWarnings().");
}

function Pe() {
  kt.disposeVariables();
}

function Le() {
  return kt;
}

function We() {
  return kt.memory();
}

function Ue(t) {
  return kt.profile(t);
}

function Ve(t, e) {
  return kt.tidy(t, e);
}

function ze(t) {
  wt(t).forEach(function (t) {
    return t.dispose();
  });
}

function Ge(t) {
  return kt.keep(t);
}

function He(t) {
  return kt.time(t);
}

function qe(t) {
  return kt.setBackend(t);
}

function $e() {
  return kt.ready();
}

function Ke() {
  return kt.backendName;
}

function je(t) {
  kt.removeBackend(t);
}

function Xe(t) {
  return kt.findBackend(t);
}

function Ye(t) {
  return kt.findBackendFactory(t);
}

function Qe(t, e, n) {
  return void 0 === n && (n = 1), kt.registerBackend(t, e, n);
}

function Je() {
  return kt.backend;
}

function Ze(t, e) {
  a().setPlatform(t, e);
}

function tn() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

  a().getBool("IS_TEST") || console.warn.apply(console, t);
}

function en(t, e) {
  var n = t;
  if (T(t)) return "string" === e ? [] : [t.length];
  if (!Array.isArray(t)) return [];

  for (var r = []; Array.isArray(n) || T(n) && "string" !== e;) r.push(n.length), n = n[0];

  return Array.isArray(t) && a().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY") && function t(e, n, r) {
    r = r || [];
    if (!Array.isArray(e) && !T(e)) return void h(0 === n.length, function () {
      return "Element arr[" + r.join("][") + "] is a primitive, but should be an array/TypedArray of " + n[0] + " elements";
    });
    h(n.length > 0, function () {
      return "Element arr[" + r.join("][") + "] should be a primitive, but is an array of " + e.length + " elements";
    });
    h(e.length === n[0], function () {
      return "Element arr[" + r.join("][") + "] should have " + n[0] + " elements, but has " + e.length + " elements";
    });
    var o = n.slice(1);

    for (var a = 0; a < e.length; ++a) t(e[a], o, r.concat(a));
  }(t, r, []), r;
}

function nn(t, e, n, r) {
  if (null != t && ("numeric" !== t && t !== e || "numeric" === t && "string" === e)) throw new Error("Argument '" + n + "' passed to '" + r + "' must be " + t + " tensor, but got " + e + " tensor");
}

function rn(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), t instanceof ut) return nn(r, t.dtype, e, n), t;
  var o = B(t);

  if ("string" !== o && ["bool", "int32", "float32"].indexOf(r) >= 0 && (o = r), nn(r, o, e, n), null == t || !T(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) {
    var i = null == t ? "null" : t.constructor.name;
    throw new Error("Argument '" + e + "' passed to '" + n + "' must be a Tensor or TensorLike, but got '" + i + "'");
  }

  var s = en(t, o);
  T(t) || Array.isArray(t) || (t = [t]);
  var u = "string" !== o ? U(t, o, a().getBool("DEBUG")) : d(t, [], !0);
  return ut.make(s, {
    values: u
  }, o);
}

function on(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), !Array.isArray(t)) throw new Error("Argument " + e + " passed to " + n + " must be a `Tensor[]` or `TensorLike[]`");
  return t.map(function (t, r) {
    return rn(t, e + "[" + r + "]", n);
  }, r);
}

function an(t, e) {
  for (var n = 0; n < t.length; ++n) if (t[t.length - n - 1] !== e - 1 - n) return !1;

  return !0;
}

function sn(t, e, n) {
  for (var r = t.length + e.length, o = [], a = 0, i = 0, s = 0; s < r; s++) -1 === n.indexOf(s) ? o.push(t[a++]) : o.push(e[i++]);

  return o;
}

function un(t, e) {
  for (var n = [], r = t.length, o = 0; o < r; o++) -1 === e.indexOf(o) && n.push(t[o]);

  return [n, e.map(function (e) {
    return t[e];
  })];
}

function ln(t, e) {
  return sn(t, e.map(function (t) {
    return 1;
  }), e);
}

function cn(t, e, n) {
  h(an(e, n), function () {
    return t + " supports only inner-most axes for now. Got axes " + e + " and rank-" + n + " input.";
  });
}

function hn(t, e) {
  if (an(t, e)) return null;

  for (var n = [], r = 0; r < e; ++r) -1 === t.indexOf(r) && n.push(r);

  return t.forEach(function (t) {
    return n.push(t);
  }), n;
}

function pn(t) {
  return t.map(function (t, e) {
    return [e, t];
  }).sort(function (t, e) {
    return t[1] - e[1];
  }).map(function (t) {
    return t[0];
  });
}

function fn(t, e) {
  for (var n = [], r = e - t; r < e; ++r) n.push(r);

  return n;
}

function dn(t, e) {
  var n = t[0].length;
  t.forEach(function (t, e) {
    h(t.length === n, function () {
      return "Error in concat" + n + "D: rank of tensors[" + e + "] must be the same as the rank of the rest (" + n + ")";
    });
  }), h(e >= 0 && e < n, function () {
    return "Error in concat" + n + "D: axis must be between 0 and " + (n - 1) + ".";
  });
  var r = t[0];
  t.forEach(function (t, o) {
    for (var a = 0; a < n; a++) h(a === e || t[a] === r[a], function () {
      return "Error in concat" + n + "D: Shape of tensors[" + o + "] (" + t + ") does not match the shape of the rest (" + r + ") along the non-concatenated axis " + o + ".";
    });
  });
}

function vn(t, e) {
  for (var n = t[0].slice(), r = 1; r < t.length; r++) n[e] += t[r][e];

  return n;
}

function mn(t) {
  var e = Object.keys(t);
  if (1 !== e.length) throw new Error("Please provide an object with a single key (operation name) mapping to a function. Got an object with " + e.length + " keys.");
  var n = e[0],
      r = t[n];
  n.endsWith("_") && (n = n.substring(0, n.length - 1));

  var o = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    kt.startScope(n);

    try {
      var o = r.apply(void 0, t);
      return o instanceof Promise && console.error("Cannot return a Promise inside of tidy."), kt.endScope(o), o;
    } catch (t) {
      throw kt.endScope(null), t;
    }
  };

  return Object.defineProperty(o, "name", {
    value: n,
    configurable: !0
  }), o;
}

_e.registerFlag("HAS_WEBGL", function () {
  return _e.getNumber("WEBGL_VERSION") > 0;
}), _e.registerFlag("WEBGL_VERSION", function () {
  return ke(2) ? 2 : ke(1) ? 1 : 0;
}), _e.registerFlag("WEBGL_BUFFER_SUPPORTED", function () {
  return 2 === _e.get("WEBGL_VERSION");
}), _e.registerFlag("WEBGL_CPU_FORWARD", function () {
  return !0;
}), _e.registerFlag("WEBGL_FORCE_F16_TEXTURES", function () {
  return !1;
}), _e.registerFlag("WEBGL_PACK", function () {
  return _e.getBool("HAS_WEBGL");
}), _e.registerFlag("WEBGL_PACK_NORMALIZATION", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_CLIP", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_DEPTHWISECONV", function () {
  return !1;
}), _e.registerFlag("WEBGL_PACK_BINARY_OPERATIONS", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_UNARY_OPERATIONS", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_PACK_REDUCE", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_LAZILY_UNPACK", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_CONV_IM2COL", function () {
  return _e.getBool("WEBGL_PACK");
}), _e.registerFlag("WEBGL_MAX_TEXTURE_SIZE", function () {
  return Ce(_e.getNumber("WEBGL_VERSION"));
}), _e.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER", function () {
  return Ee(_e.getNumber("WEBGL_VERSION"));
}), _e.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION", function () {
  var t = _e.getNumber("WEBGL_VERSION");

  return 0 === t ? 0 : Re(t);
}), _e.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE", function () {
  return _e.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 && (t = navigator.userAgent || navigator.vendor || window.opera, !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))));
  var t;
}), _e.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE", function () {
  return Ne(_e.getNumber("WEBGL_VERSION"));
}), _e.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED", function () {
  return !_e.getBool("WEBGL_FORCE_F16_TEXTURES") && _e.getBool("WEBGL_RENDER_FLOAT32_CAPABLE");
}), _e.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED", function () {
  return Se(_e.getNumber("WEBGL_VERSION"));
}), _e.registerFlag("WEBGL_FENCE_API_ENABLED", function () {
  return Te(_e.getNumber("WEBGL_VERSION"));
}), _e.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM", function () {
  return _e.getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? 4 : 0;
}), st = Be;
var gn = mn({
  complex_: function (t, e) {
    var n = rn(t, "real", "complex"),
        r = rn(e, "imag", "complex");
    return p(n.shape, r.shape, "real and imag shapes, " + n.shape + " and " + r.shape + ", must match in call to tf.complex()."), kt.runKernel(function (t) {
      return t.complex(n, r);
    }, {
      $real: n,
      $imag: r
    });
  }
}),
    yn = mn({
  real_: function (t) {
    var e = rn(t, "input", "real");
    return kt.runKernel(function (t) {
      return t.real(e);
    }, {
      $input: e
    });
  }
}),
    xn = mn({
  imag_: function (t) {
    var e = rn(t, "input", "imag");
    return kt.runKernel(function (t) {
      return t.imag(e);
    }, {
      $input: e
    });
  }
});
exports.imag = xn;
exports.real = yn;
exports.complex = gn;

function bn(t, e, n) {
  return wn(t, e, en(t, n), n);
}

function wn(t, e, n, r) {
  if (null == r && (r = B(t)), "complex64" === r) throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");
  if (!T(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");

  if (null != e) {
    q(e);
    var o = v(e),
        i = v(n);
    h(o === i, function () {
      return "Based on the provided shape, [" + e + "], the tensor should have " + o + " values but has " + i;
    });

    for (var s = 0; s < n.length; ++s) {
      var u = n[s],
          l = s !== n.length - 1 || u !== v(e.slice(s));
      h(n[s] === e[s] || !l, function () {
        return "Error creating a new Tensor. Inferred shape (" + n + ") does not match the provided shape (" + e + "). ";
      });
    }
  }

  return T(t) || Array.isArray(t) || (t = [t]), e = e || n, t = "string" !== r ? U(t, r, a().getBool("DEBUG")) : d(t, [], !0), ut.make(e, {
    values: t
  }, r);
}

function Cn(t, e) {
  if ((T(t) && "string" !== e || Array.isArray(t)) && "complex64" !== e) throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");
  if ("string" === e && T(t) && !(t instanceof Uint8Array)) throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");
  return wn(t, [], [], e);
}

function En(t, e) {
  f(t);
  var n = en(t, e);
  if (1 !== n.length) throw new Error("tensor1d() requires values to be a flat/TypedArray");
  return wn(t, null, n, e);
}

function Rn(t, e, n) {
  if (f(t), null != e && 2 !== e.length) throw new Error("tensor2d() requires shape to have two numbers");
  var r = en(t, n);
  if (2 !== r.length && 1 !== r.length) throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");
  return wn(t, e, r, n);
}

function In(t, e, n) {
  if (f(t), null != e && 3 !== e.length) throw new Error("tensor3d() requires shape to have three numbers");
  var r = en(t, n);
  if (3 !== r.length && 1 !== r.length) throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");
  return wn(t, e, r, n);
}

function kn(t, e, n) {
  if (f(t), null != e && 4 !== e.length) throw new Error("tensor4d() requires shape to have four numbers");
  var r = en(t, n);
  if (4 !== r.length && 1 !== r.length) throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");
  return wn(t, e, r, n);
}

function Nn(t, e, n) {
  if (f(t), null != e && 5 !== e.length) throw new Error("tensor5d() requires shape to have five numbers");
  var r = en(t, n);
  if (5 !== r.length && 1 !== r.length) throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");
  return wn(t, e, r, n);
}

function Sn(t, e, n) {
  if (f(t), null != e && 6 !== e.length) throw new Error("tensor6d() requires shape to have six numbers");
  var r = en(t, n);
  if (6 !== r.length && 1 !== r.length) throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");
  return wn(t, e = e || r, r, n);
}

function An(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = An(t, "float32"),
        r = Tn(t, "float32");
    return gn(n, r);
  }

  var o = z(v(t), e);
  return ut.make(t, {
    values: o
  }, e);
}

function Tn(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = Tn(t, "float32"),
        r = Tn(t, "float32");
    return gn(n, r);
  }

  var o = G(v(t), e);
  return ut.make(t, {
    values: o
  }, e);
}

function Dn(t, e, n) {
  return kt.runKernel(function (r) {
    return r.fill(t, e, n);
  }, {});
}

function _n(t, e, n) {
  if (n <= 0) throw new Error("The number of values should be positive.");
  return kt.runKernel(function (r) {
    return r.linspace(t, e, n);
  }, {});
}

function On(t, e, n, r) {
  if (void 0 === n && (n = 1), void 0 === r && (r = "float32"), 0 === n) throw new Error("Cannot have a step of zero");
  if (t === e || t < e && n < 0 || e < t && n > 1) return Tn([0], r);
  var o = G(Math.abs(Math.ceil((e - t) / n)), r);
  e < t && 1 === n && (n = -1), o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + n;

  return En(o, r);
}

var Fn = mn({
  onesLike_: function (t) {
    var e = rn(t, "x", "onesLike");

    if ("complex64" === e.dtype) {
      var n = Fn(yn(e)),
          r = Mn(xn(e));
      return gn(n, r);
    }

    return kt.runKernel(function (t) {
      return t.onesLike(e);
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    Mn = mn({
  zerosLike_: function (t) {
    var e = rn(t, "x", "zerosLike");
    return kt.runKernel(function (t) {
      return t.zerosLike(e);
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
});
exports.zerosLike = Mn;
exports.onesLike = Fn;
var Bn = mn({
  concat_: function (t, e) {
    void 0 === e && (e = 0), h(t.length >= 1, function () {
      return "Pass at least one tensor to concat";
    });
    var n = on(t, "tensors", "concat");
    "complex64" === n[0].dtype && n.forEach(function (t) {
      if ("complex64" !== t.dtype) throw new Error("Cannot concatenate complex64 tensors with a tensor\n          with dtype " + t.dtype + ". ");
    }), e = E(e, n[0].shape)[0];
    var r = vn(n.map(function (t) {
      return t.shape;
    }), e);
    if (0 === v(r)) return bn([], r);
    if (1 === (n = n.filter(function (t) {
      return t.size > 0;
    })).length) return n[0];
    var o = n.map(function (t) {
      return t.shape;
    });
    dn(o, e);
    var a = n;
    return kt.runKernel(function (t) {
      return t.concat(n, e);
    }, a, function (t) {
      var n = o.map(function (t) {
        return t[e];
      });
      return Vn(t, n, e).map(function (t) {
        return function () {
          return t;
        };
      });
    });
  }
}),
    Pn = mn({
  concat1d_: function (t) {
    return Bn(t, 0);
  }
}),
    Ln = mn({
  concat2d_: function (t, e) {
    return Bn(t, e);
  }
}),
    Wn = mn({
  concat3d_: function (t, e) {
    return Bn(t, e);
  }
}),
    Un = mn({
  concat4d_: function (t, e) {
    return Bn(t, e);
  }
}),
    Vn = mn({
  split_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r,
        o = rn(t, "x", "split");
    return n = E(n, o.shape)[0], "number" == typeof e ? (h(o.shape[n] % e == 0, function () {
      return "Number of splits must evenly divide the axis.";
    }), r = new Array(e).fill(o.shape[n] / e)) : (h(o.shape[n] === e.reduce(function (t, e) {
      return t + e;
    }), function () {
      return "The sum of sizes must match the size of the axis dimension.";
    }), r = e), kt.runKernel(function (t) {
      return t.split(o, r, n);
    }, {
      $x: o
    }, function (t) {
      return {
        $x: function () {
          return Bn(t, n);
        }
      };
    });
  }
});
exports.split = Vn;
exports.concat4d = Un;
exports.concat3d = Wn;
exports.concat2d = Ln;
exports.concat1d = Pn;
exports.concat = Bn;
"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;

function zn(t, e) {
  return t(e = {
    exports: {}
  }, e.exports), e.exports;
}

var Gn = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e,
          n = this,
          r = (e = 4022871197, function (t) {
        t = t.toString();

        for (var n = 0; n < t.length; n++) {
          var r = .02519603282416938 * (e += t.charCodeAt(n));
          r -= e = r >>> 0, e = (r *= e) >>> 0, e += 4294967296 * (r -= e);
        }

        return 2.3283064365386963e-10 * (e >>> 0);
      });
      n.next = function () {
        var t = 2091639 * n.s0 + 2.3283064365386963e-10 * n.c;
        return n.s0 = n.s1, n.s1 = n.s2, n.s2 = t - (n.c = 0 | t);
      }, n.c = 1, n.s0 = r(" "), n.s1 = r(" "), n.s2 = r(" "), n.s0 -= r(t), n.s0 < 0 && (n.s0 += 1), n.s1 -= r(t), n.s1 < 0 && (n.s1 += 1), n.s2 -= r(t), n.s2 < 0 && (n.s2 += 1), r = null;
    }

    function o(t, e) {
      return e.c = t.c, e.s0 = t.s0, e.s1 = t.s1, e.s2 = t.s2, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = n.next;
      return i.int32 = function () {
        return 4294967296 * n.next() | 0;
      }, i.double = function () {
        return i() + 1.1102230246251565e-16 * (2097152 * i() | 0);
      }, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.alea = a;
  }(0, t, !1);
}),
    Hn = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.next = function () {
        var t = e.x ^ e.x << 11;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w ^= e.w >>> 19 ^ t ^ t >>> 8;
      }, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor128 = a;
  }(0, t, !1);
}),
    qn = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.x ^ e.x >>> 2;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w = e.v, (e.d = e.d + 362437 | 0) + (e.v = e.v ^ e.v << 4 ^ t ^ t << 1) | 0;
      }, e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.v = 0, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), r == n.length && (e.d = e.x << 10 ^ e.x >>> 4), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e.v = t.v, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorwow = a;
  }(0, t, !1);
}),
    $n = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.x,
            o = e.i;
        return t = r[o], n = (t ^= t >>> 7) ^ t << 24, n ^= (t = r[o + 1 & 7]) ^ t >>> 10, n ^= (t = r[o + 3 & 7]) ^ t >>> 3, n ^= (t = r[o + 4 & 7]) ^ t << 7, t = r[o + 7 & 7], n ^= (t ^= t << 13) ^ t << 9, r[o] = n, e.i = o + 1 & 7, n;
      }, function (t, e) {
        var n,
            r = [];
        if (e === (0 | e)) r[0] = e;else for (e = "" + e, n = 0; n < e.length; ++n) r[7 & n] = r[7 & n] << 15 ^ e.charCodeAt(n) + r[n + 1 & 7] << 13;

        for (; r.length < 8;) r.push(0);

        for (n = 0; n < 8 && 0 === r[n]; ++n);

        for (8 == n ? r[7] = -1 : r[n], t.x = r, t.i = 0, n = 256; n > 0; --n) t.next();
      }(e, t);
    }

    function o(t, e) {
      return e.x = t.x.slice(), e.i = t.i, e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.x && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorshift7 = a;
  }(0, t, !1);
}),
    Kn = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.w,
            o = e.X,
            a = e.i;
        return e.w = r = r + 1640531527 | 0, n = o[a + 34 & 127], t = o[a = a + 1 & 127], n ^= n << 13, t ^= t << 17, n ^= n >>> 15, t ^= t >>> 12, n = o[a] = n ^ t, e.i = a, n + (r ^ r >>> 16) | 0;
      }, function (t, e) {
        var n,
            r,
            o,
            a,
            i,
            s = [],
            u = 128;

        for (e === (0 | e) ? (r = e, e = null) : (e += "\0", r = 0, u = Math.max(u, e.length)), o = 0, a = -32; a < u; ++a) e && (r ^= e.charCodeAt((a + 32) % e.length)), 0 === a && (i = r), r ^= r << 10, r ^= r >>> 15, r ^= r << 4, r ^= r >>> 13, a >= 0 && (i = i + 1640531527 | 0, o = 0 == (n = s[127 & a] ^= r + i) ? o + 1 : 0);

        for (o >= 128 && (s[127 & (e && e.length || 0)] = -1), o = 127, a = 512; a > 0; --a) r = s[o + 34 & 127], n = s[o = o + 1 & 127], r ^= r << 13, n ^= n << 17, r ^= r >>> 15, n ^= n >>> 12, s[o] = r ^ n;

        t.w = i, t.X = s, t.i = o;
      }(e, t);
    }

    function o(t, e) {
      return e.i = t.i, e.w = t.w, e.X = t.X.slice(), e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.X && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor4096 = a;
  }(0, t, !1);
}),
    jn = zn(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.b,
            n = e.c,
            r = e.d,
            o = e.a;
        return t = t << 25 ^ t >>> 7 ^ n, n = n - r | 0, r = r << 24 ^ r >>> 8 ^ o, o = o - t | 0, e.b = t = t << 20 ^ t >>> 12 ^ n, e.c = n = n - r | 0, e.d = r << 16 ^ n >>> 16 ^ o, e.a = o - t | 0;
      }, e.a = 0, e.b = 0, e.c = -1640531527, e.d = 1367130551, t === Math.floor(t) ? (e.a = t / 4294967296 | 0, e.b = 0 | t) : n += t;

      for (var r = 0; r < n.length + 20; r++) e.b ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.a = t.a, e.b = t.b, e.c = t.c, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.tychei = a;
  }(0, t, !1);
}),
    Xn = zn(function (t) {
  !function (e, n) {
    var r,
        o = this,
        a = 256,
        i = 6,
        s = "random",
        u = n.pow(a, i),
        l = n.pow(2, 52),
        c = 2 * l,
        h = a - 1;

    function p(t, h, p) {
      var g = [],
          y = v(function t(e, n) {
        var r,
            o = [],
            a = typeof e;
        if (n && "object" == a) for (r in e) try {
          o.push(t(e[r], n - 1));
        } catch (t) {}
        return o.length ? o : "string" == a ? e : e + "\0";
      }((h = 1 == h ? {
        entropy: !0
      } : h || {}).entropy ? [t, m(e)] : null == t ? function () {
        try {
          var t;
          return r && (t = r.randomBytes) ? t = t(a) : (t = new Uint8Array(a), (o.crypto || o.msCrypto).getRandomValues(t)), m(t);
        } catch (t) {
          var n = o.navigator,
              i = n && n.plugins;
          return [+new Date(), o, i, o.screen, m(e)];
        }
      }() : t, 3), g),
          x = new f(g),
          b = function () {
        for (var t = x.g(i), e = u, n = 0; t < l;) t = (t + n) * a, e *= a, n = x.g(1);

        for (; t >= c;) t /= 2, e /= 2, n >>>= 1;

        return (t + n) / e;
      };

      return b.int32 = function () {
        return 0 | x.g(4);
      }, b.quick = function () {
        return x.g(4) / 4294967296;
      }, b.double = b, v(m(x.S), e), (h.pass || p || function (t, e, r, o) {
        return o && (o.S && d(o, x), t.state = function () {
          return d(x, {});
        }), r ? (n[s] = t, e) : t;
      })(b, y, "global" in h ? h.global : this == n, h.state);
    }

    function f(t) {
      var e,
          n = t.length,
          r = this,
          o = 0,
          i = r.i = r.j = 0,
          s = r.S = [];

      for (n || (t = [n++]); o < a;) s[o] = o++;

      for (o = 0; o < a; o++) s[o] = s[i = h & i + t[o % n] + (e = s[o])], s[i] = e;

      (r.g = function (t) {
        for (var e, n = 0, o = r.i, i = r.j, s = r.S; t--;) e = s[o = h & o + 1], n = n * a + s[h & (s[o] = s[i = h & i + e]) + (s[i] = e)];

        return r.i = o, r.j = i, n;
      })(a);
    }

    function d(t, e) {
      return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e;
    }

    function v(t, e) {
      for (var n, r = t + "", o = 0; o < r.length;) e[h & o] = h & (n ^= 19 * e[h & o]) + r.charCodeAt(o++);

      return m(e);
    }

    function m(t) {
      return String.fromCharCode.apply(0, t);
    }

    if (n["seed" + s] = p, v(n.random(), e), t.exports) {
      t.exports = p;

      try {
        r = require("crypto");
      } catch (t) {}
    }
  }([], Math);
});
Xn.alea = Gn, Xn.xor128 = Hn, Xn.xorwow = qn, Xn.xorshift7 = $n, Xn.xor4096 = Kn, Xn.tychei = jn;

var Yn = Xn.alea,
    Qn = function () {
  function t(t, e, n, r, o) {
    this.mean = t, this.stdDev = e, this.dtype = n, this.nextVal = NaN, this.truncated = r, this.truncated && (this.upper = this.mean + 2 * this.stdDev, this.lower = this.mean - 2 * this.stdDev);
    var a = o || Math.random();
    this.random = Yn(a.toString());
  }

  return t.prototype.nextValue = function () {
    if (!isNaN(this.nextVal)) {
      var t = this.nextVal;
      return this.nextVal = NaN, t;
    }

    for (var e, n, r = !1; !r;) {
      var o = void 0,
          a = void 0,
          i = void 0;

      do {
        i = (o = 2 * this.random() - 1) * o + (a = 2 * this.random() - 1) * a;
      } while (i >= 1 || 0 === i);

      var s = Math.sqrt(-2 * Math.log(i) / i);
      e = this.mean + this.stdDev * o * s, n = this.mean + this.stdDev * a * s, this.truncated && !this.isValidTruncated(e) || (r = !0);
    }

    return this.truncated && !this.isValidTruncated(n) || (this.nextVal = this.convertValue(n)), this.convertValue(e);
  }, t.prototype.convertValue = function (t) {
    return null == this.dtype || "float32" === this.dtype ? t : Math.round(t);
  }, t.prototype.isValidTruncated = function (t) {
    return t <= this.upper && t >= this.lower;
  }, t;
}(),
    Jn = function () {
  function t(t, e, n, r) {
    this.alpha = t, this.beta = 1 / e, this.dtype = n;
    var o = r || Math.random();
    this.randu = Yn(o.toString()), this.randn = new Qn(0, 1, n, !1, this.randu()), this.d = t < 1 ? t + 2 / 3 : t - 1 / 3, this.c = 1 / Math.sqrt(9 * this.d);
  }

  return t.prototype.nextValue = function () {
    for (var t, e, n, r, o, a;;) {
      do {
        r = this.randn.nextValue(), a = 1 + this.c * r;
      } while (a <= 0);

      if (a *= a * a, e = 1 - .331 * (t = r * r) * t, n = .5 * t + this.d * (1 - a + Math.log(a)), (o = this.randu()) < e || Math.log(o) < n) break;
    }

    return a = 1 / this.beta * this.d * a, this.alpha < 1 && (a *= Math.pow(this.randu(), 1 / this.alpha)), this.convertValue(a);
  }, t.prototype.convertValue = function (t) {
    return "float32" === this.dtype ? t : Math.round(t);
  }, t;
}(),
    Zn = function () {
  function t(t, e, n, r) {
    var o = this;
    if (void 0 === t && (t = 0), void 0 === e && (e = 1), this.canReturnFloat = function () {
      return null == o.dtype || "float32" === o.dtype;
    }, this.min = t, this.range = e - t, this.dtype = n, null == r && (r = Math.random()), "number" == typeof r && (r = r.toString()), !this.canReturnFloat() && this.range <= 1) throw new Error("The difference between " + t + " - " + e + " <= 1 and dtype is not float");
    this.random = Yn(r);
  }

  return t.prototype.convertValue = function (t) {
    return this.canReturnFloat() ? t : Math.round(t);
  }, t.prototype.nextValue = function () {
    return this.convertValue(this.min + this.range * this.random());
  }, t;
}();

function tr(t, e, n) {
  return void 0 === e && (e = "float32"), e = e || "float32", q(t), new ot(t, e, n);
}

function er(t, e) {
  void 0 === e && (e = !1), console.log(t.toString(e));
}

var nr = mn({
  batchToSpaceND_: function (t, e, n) {
    var r = rn(t, "x", "batchToSpaceND"),
        o = e.reduce(function (t, e) {
      return t * e;
    });
    return h(r.rank >= 1 + e.length, function () {
      return "input rank is " + r.rank + " but should be > than blockShape.length " + e.length;
    }), h(n.length === e.length, function () {
      return "crops.length is " + n.length + " but should be equal to blockShape.length  " + e.length;
    }), h(r.shape[0] % o == 0, function () {
      return "input tensor batch is " + r.shape[0] + " but is not divisible by the product of the elements of blockShape " + e.join(" * ") + " === " + o;
    }), kt.runKernel(function (t) {
      return t.batchToSpaceND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.spaceToBatchND(e, n);
        }
      };
    });
  }
}),
    rr = mn({
  cast_: function (t, e) {
    var n = rn(t, "x", "cast");
    if (!S(e)) throw new Error("Failed to cast to unknown dtype " + e);
    if ("string" === e && "string" !== n.dtype || "string" !== e && "string" === n.dtype) throw new Error("Only strings can be casted to strings");
    return kt.runKernel(function (t) {
      return t.cast(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.clone();
        }
      };
    });
  }
}),
    or = mn({
  clone_: function (t) {
    var e = rn(t, "x", "clone", null);
    return kt.runKernel(function (t) {
      return ut.make(e.shape, {
        dataId: e.dataId
      }, e.dtype);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return t.toFloat();
        }
      };
    });
  }
}),
    ar = mn({
  cumsum_: function (t, e, n, r) {
    void 0 === e && (e = 0), void 0 === n && (n = !1), void 0 === r && (r = !1);
    var o = rn(t, "x", "cumsum"),
        a = hn([e |= 0], o.rank),
        i = o;
    null != a && (i = o.transpose(a));
    var s = fn(1, o.rank)[0],
        u = kt.runKernel(function (t) {
      return t.cumsum(i, s, n, r);
    }, {
      permutedX: i
    }, function (t) {
      return {
        permutedX: function () {
          return t.cumsum(e, n, !r);
        }
      };
    });
    return null != a && (u = u.transpose(a)), u;
  }
}),
    ir = mn({
  depthToSpace_: function (t, e, n) {
    void 0 === n && (n = "NHWC");
    var r = rn(t, "x", "depthToSpace"),
        o = "NHWC" === n ? r.shape[1] : r.shape[2],
        a = "NHWC" === n ? r.shape[2] : r.shape[3],
        i = "NHWC" === n ? r.shape[3] : r.shape[1];
    return h(o * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + o + " and " + e + "  for depthToSpace with input shape\n      " + r.shape;
    }), h(a * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + a + " and " + e + " for depthToSpace with input shape\n          " + r.shape;
    }), h(i % (e * e) == 0, function () {
      return "Dimension size must be evenly divisible by " + e * e + " but is " + i + " for depthToSpace with input shape " + r.shape;
    }), kt.runKernel(function (t) {
      return t.depthToSpace(r, e, n);
    }, {
      $x: r
    });
  }
}),
    sr = mn({
  expandDims_: function (t, e) {
    void 0 === e && (e = 0);
    var n = rn(t, "x", "expandDims", null);
    h(e <= n.rank, function () {
      return "Axis must be <= rank of the tensor";
    });
    var r = n.shape.slice();
    return e < 0 && (h(-(n.rank + 1) <= e, function () {
      return "Axis must be in the interval [" + -(n.rank + 1) + ", " + n.rank + "]";
    }), e = n.rank + e + 1), r.splice(e, 0, 1), br(n, r);
  }
}),
    ur = mn({
  eye_: function (t, e, n, r) {
    void 0 === r && (r = "float32"), null == e && (e = t);

    for (var o = tr([t, e], r), a = t <= e ? t : e, i = 0; i < a; ++i) o.set(1, i, i);

    var s = o.toTensor().as2D(t, e);
    if (null == n) return s;
    if (1 === n.length) return Rr(sr(s, 0), [n[0], 1, 1]);
    if (2 === n.length) return Rr(sr(sr(s, 0), 0), [n[0], n[1], 1, 1]);
    if (3 === n.length) return Rr(sr(sr(sr(s, 0), 0), 0), [n[0], n[1], n[2], 1, 1]);
    throw new Error("eye() currently supports only 1D and 2D batchShapes, but received " + n.length + "D.");
  }
}),
    lr = mn({
  multinomial_: function (t, e, n, r) {
    void 0 === r && (r = !1);
    var o = rn(t, "logits", "multinomial"),
        a = o.size,
        i = o.rank;
    if (a < 2) throw new Error("Error in multinomial: you need at least 2 outcomes, but got " + a + ".");
    if (i > 2) throw new Error("Rank of probabilities must be 1 or 2, but is " + i);
    n = n || Math.random();
    var s = 1 === i ? o.as2D(1, -1) : o,
        u = kt.runKernel(function (t) {
      return t.multinomial(s, r, e, n);
    }, {
      logits2D: s
    });
    return 1 === i ? u.as1D() : u;
  }
}),
    cr = mn({
  oneHot_: function (t, e, n, r) {
    if (void 0 === n && (n = 1), void 0 === r && (r = 0), e < 2) throw new Error("Error in oneHot: depth must be >=2, but it is " + e);
    var o = rn(t, "indices", "oneHot", "int32"),
        a = o.shape.concat([e]);
    return o = o.flatten(), kt.runKernel(function (t) {
      return t.oneHot(o, e, n, r);
    }, {
      $indices: o
    }, function (t) {
      return {
        $indices: function () {
          return Tn(o.shape, "float32");
        }
      };
    }).reshape(a);
  }
}),
    hr = mn({
  pad_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = rn(t, "x", "pad");
    if (0 === r.rank) throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");
    var o = e.map(function (t) {
      return t[0];
    });
    return kt.runKernel(function (t) {
      return t.pad(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.slice(o, r.shape);
        }
      };
    });
  }
}),
    pr = mn({
  pad1d_: function (t, e, n) {
    return void 0 === n && (n = 0), h(2 === e.length, function () {
      return "Invalid number of paddings. Must be length of 2.";
    }), hr(t, [e], n);
  }
}),
    fr = mn({
  pad2d_: function (t, e, n) {
    return void 0 === n && (n = 0), h(2 === e.length && 2 === e[0].length && 2 === e[1].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), hr(t, e, n);
  }
}),
    dr = mn({
  pad3d_: function (t, e, n) {
    return void 0 === n && (n = 0), h(3 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), hr(t, e, n);
  }
}),
    vr = mn({
  pad4d_: function (t, e, n) {
    return void 0 === n && (n = 0), h(4 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length && 2 === e[3].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), hr(t, e, n);
  }
}),
    mr = mn({
  rand_: function (t, e, n) {
    var r = v(t),
        o = null;
    if (null == n || "float32" === n) o = new Float32Array(r);else if ("int32" === n) o = new Int32Array(r);else {
      if ("bool" !== n) throw new Error("Unknown data type " + n);
      o = new Uint8Array(r);
    }

    for (var a = 0; a < r; a++) o[a] = e();

    return ut.make(t, {
      values: o
    }, n);
  }
}),
    gr = mn({
  randomNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type " + r);

    for (var a = new Qn(e, n, r, !1, o), i = tr(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
}),
    yr = mn({
  randomGamma_: function (t, e, n, r, o) {
    if (void 0 === n && (n = 1), void 0 === r && (r = "float32"), null == n && (n = 1), null == r && (r = "float32"), "float32" !== r && "int32" !== r) throw new Error("Unsupported data type " + r);

    for (var a = new Jn(e, n, r, o), i = tr(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
}),
    xr = mn({
  randomUniform_: function (t, e, n, r, o) {
    void 0 === e && (e = 0), void 0 === n && (n = 1), void 0 === r && (r = "float32");

    for (var a = tr(t, r), i = new Zn(e, n, null, o), s = 0; s < a.values.length; s++) a.values[s] = i.nextValue();

    return a.toTensor();
  }
}),
    br = mn({
  reshape_: function (t, e) {
    var n = rn(t, "x", "reshape", null);
    return e = C(e, n.size), h(n.size === v(e), function () {
      return "new shape and old shape must have the same number of elements.";
    }), kt.runKernel(function (t) {
      return t.reshape(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.reshape(n.shape);
        }
      };
    });
  }
}),
    wr = mn({
  spaceToBatchND_: function (t, e, n) {
    var r = rn(t, "x", "spaceToBatchND");
    return h(r.rank >= 1 + e.length, function () {
      return "input rank " + r.rank + " should be > than [blockShape] " + e.length;
    }), h(n.length === e.length, function () {
      return "paddings.shape[0] " + n.length + " must be equal to [blockShape] " + e.length;
    }), h(r.shape.reduce(function (t, r, o) {
      return o > 0 && o <= e.length ? t && (r + n[o - 1][0] + n[o - 1][1]) % e[o - 1] == 0 : t;
    }, !0), function () {
      return "input spatial dimensions " + r.shape.slice(1) + " with paddings " + n.toString() + " must be divisible by blockShapes " + e.toString();
    }), kt.runKernel(function (t) {
      return t.spaceToBatchND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.batchToSpaceND(e, n);
        }
      };
    });
  }
}),
    Cr = mn({
  squeeze_: function (t, e) {
    var n = rn(t, "x", "squeeze");
    return br(n, R(n.shape, e).newShape);
  }
}),
    Er = mn({
  stack_: function (t, e) {
    void 0 === e && (e = 0);
    var n = on(t, "tensors", "stack");
    if (h(n.length >= 1, function () {
      return "Pass at least one tensor to tf.stack";
    }), 1 === n.length) return n[0].expandDims(e);
    var r = n[0].rank,
        o = n[0].shape,
        a = n[0].dtype;
    h(e <= r, function () {
      return "Axis must be <= rank of the tensor";
    }), n.forEach(function (t) {
      p(o, t.shape, "All tensors passed to stack must have matching shapes");
    }), n.forEach(function (t) {
      h(a === t.dtype, function () {
        return "All tensors passed to stack must have matching dtypes";
      });
    });
    var i = n.map(function (t) {
      return t.expandDims(e);
    });
    return Bn(i, e);
  }
}),
    Rr = mn({
  tile_: function (t, e) {
    var n = rn(t, "x", "tile", null);
    return h(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of reps " + e + ".";
    }), kt.runKernel(function (t, r) {
      var o = t.tile(n, e);
      return r([n]), o;
    }, {
      $x: n
    }, function (t, n) {
      var r = n[0];
      return {
        $x: function () {
          var n = Mn(r);
          if (1 === r.rank) for (var o = 0; o < e[0]; ++o) n = n.add(t.slice([o * r.shape[0]], [r.shape[0]]));else if (2 === r.rank) for (o = 0; o < e[0]; ++o) for (var a = 0; a < e[1]; ++a) n = n.add(t.slice([o * r.shape[0], a * r.shape[1]], [r.shape[0], r.shape[1]]));else if (3 === r.rank) for (o = 0; o < e[0]; ++o) for (a = 0; a < e[1]; ++a) for (var i = 0; i < e[2]; ++i) n = n.add(t.slice([o * r.shape[0], a * r.shape[1], i * r.shape[2]], [r.shape[0], r.shape[1], r.shape[2]]));else {
            if (4 !== r.rank) throw new Error("Gradient for tile operation is not implemented for rank-" + r.rank + " tensors yet.");

            for (o = 0; o < e[0]; ++o) for (a = 0; a < e[1]; ++a) for (i = 0; i < e[2]; ++i) for (var s = 0; s < e[3]; ++s) n = n.add(t.slice([o * r.shape[0], a * r.shape[1], i * r.shape[2], s * r.shape[3]], [r.shape[0], r.shape[1], r.shape[2], r.shape[3]]));
          }
          return n;
        }
      };
    });
  }
}),
    Ir = mn({
  truncatedNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type " + r);

    for (var a = new Qn(e, n, r, !0, o), i = tr(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
}),
    kr = mn({
  unstack_: function (t, e) {
    void 0 === e && (e = 0), e = e || 0;
    var n = rn(t, "x", "unstack");
    return h(e >= -n.shape.length && e < n.shape.length, function () {
      return "Axis = " + e + " is not in [-" + n.shape.length + ", " + n.shape.length + ")";
    }), e < 0 && (e += n.shape.length), kt.runKernel(function (t) {
      return t.unstack(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return Er(t, e);
        }
      };
    });
  }
}),
    Nr = function (t, e) {
  return n(this, void 0, void 0, function () {
    var n, o, a, i, s, u, l, c, p, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = rn(t, "x", "setdiff1d"), o = rn(e, "y", "setdiff1d"), h(n.dtype === o.dtype, function () {
            return "x and y should have the same dtype, but got x (" + n.dtype + ") and y (" + o.dtype + ").";
          }), h(1 === n.rank, function () {
            return "x should be 1D tensor, but got x (" + n.shape + ").";
          }), h(1 === o.rank, function () {
            return "y should be 1D tensor, but got y (" + o.shape + ").";
          }), [4, n.data()];

        case 1:
          return a = r.sent(), [4, o.data()];

        case 2:
          for (i = r.sent(), s = new Set(i), u = 0, p = 0; p < a.length; p++) s.has(a[p]) || u++;

          for (l = new ot([u], n.dtype), c = new ot([u], "int32"), p = 0, f = 0; p < a.length; p++) s.has(a[p]) || (l.values[f] = a[p], c.values[f] = p, f++);

          return [2, [l.toTensor(), c.toTensor()]];
      }
    });
  });
};

exports.setdiff1dAsync = Nr;
exports.unstack = kr;
exports.truncatedNormal = Ir;
exports.tile = Rr;
exports.stack = Er;
exports.squeeze = Cr;
exports.spaceToBatchND = wr;
exports.reshape = br;
exports.randomUniform = xr;
exports.randomGamma = yr;
exports.randomNormal = gr;
exports.rand = mr;
exports.pad4d = vr;
exports.pad3d = dr;
exports.pad2d = fr;
exports.pad1d = pr;
exports.pad = hr;
exports.oneHot = cr;
exports.multinomial = lr;
exports.eye = ur;
exports.expandDims = sr;
exports.depthToSpace = ir;
exports.cumsum = ar;
exports.clone = or;
exports.cast = rr;
exports.batchToSpaceND = nr;

function Sr(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  if (r) (o = o.concat(e.slice(0))).push(t[0] / n), o = o.concat(t.slice(1));else {
    o = o.concat(t[0]);

    for (var a = e.length, i = 0; i < a; ++i) o = o.concat([t[i + 1] / e[i], e[i]]);

    o = o.concat(t.slice(a + 1));
  }
  return o;
}

function Ar(t, e, n) {
  void 0 === n && (n = !0);
  var r = [];

  if (n) {
    r.push(e);

    for (var o = e + 1; o < t; ++o) o <= 2 * e ? (r.push(o), r.push(o - (e + 1))) : r.push(o);
  } else {
    var a = [],
        i = [];

    for (o = 1; o < t; ++o) o >= 2 * e + 1 || o % 2 == 1 ? i.push(o) : a.push(o);

    r.push.apply(r, a), r.push(0), r.push.apply(r, i);
  }

  return r;
}

function Tr(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  r ? o.push(t[0] / n) : o.push(t[0] * n);

  for (var a = 1; a < t.length; ++a) a <= e.length ? r ? o.push(e[a - 1] * t[a]) : o.push(t[a] / e[a - 1]) : o.push(t[a]);

  return o;
}

function Dr(t, e) {
  for (var n = [0], r = 0; r < e; ++r) n.push(t[r][0]);

  return n;
}

function _r(t, e, n) {
  for (var r = t.slice(0, 1), o = 0; o < n; ++o) r.push(t[o + 1] - e[o][0] - e[o][1]);

  return r;
}

function Or(t, e) {
  if (t.rank < 1) throw new Error("tf.gatherND() expects the input to be rank 1 or higher, but the rank was " + t.rank + ".");
  if (e.rank < 1) throw new Error("tf.gatherND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if ("int32" !== e.dtype) throw new Error("tf.gatherND() expects the indices to be int32 type, but the dtype was " + e.dtype + ".");
  if (e.shape[e.rank - 1] > t.rank) throw new Error("index innermost dimension length must be <= tensor rank; saw: " + e.shape[e.rank - 1] + " vs. " + t.rank);
  if (0 === t.size) throw new Error("Requested more than 0 entries, but input is empty. Input shape: " + t.shape + ".");

  for (var n = e.shape, r = n[n.length - 1], o = 1, a = 0; a < n.length - 1; ++a) o *= n[a];

  var i = t.shape,
      s = n.slice();
  s.pop();
  var u = 1;

  for (a = r; a < t.rank; ++a) u *= i[a], s.push(i[a]);

  var l = W(t.shape).map(function (t) {
    return t / u;
  }).concat([1]).slice(0, r);
  return [s, o, u, l];
}

var Fr = 30;

function Mr(t) {
  return t <= Fr ? t : L(t, Math.floor(Math.sqrt(t)));
}

function Br(t, e, n) {
  if (e.rank < 1) throw new Error("tf.scatterND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if (t.rank < 1) throw new Error("tf.scatterND() expects the updates to be rank 1 or higher, but the rank was " + t.rank + ".");
  if ("int32" !== e.dtype) throw new Error("The dtype of 'indices' should be int32, but got dtype: " + e.dtype);
  if (n.length < 1) throw new Error("Output rank must be greater or equal to 1, but got shape: " + n);

  if (0 === n.length) {
    if (0 === e.size) throw new Error("Indices specified for empty output. indices shape: " + e.shape);
    if (0 === t.size) throw new Error("Updates specified for empty output. updates shape: " + t.shape);
  }

  !function (t, e, n) {
    var r = e.rank > 1 ? e.shape[e.rank - 1] : 1,
        o = e.rank > 1 ? e.rank - 1 : 1,
        a = "Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: " + n.shape + ", indices.shape: " + e.shape + ", shape: " + t + ", sliceDim: " + r + ", and batchDim: " + o + ".";
    if (n.rank < o) throw new Error(a + " update.rank < " + o + ". ");
    if (t.length < r + (n.rank - o)) throw new Error(a + " Output shape length < " + (r + (n.rank - o)));
    if (n.rank !== o + t.length - r) throw new Error(a + " update.rank != " + (o + t.length - r));

    for (var i = 0; i < o; ++i) if (n.shape[i] !== e.shape[i]) throw new Error(a + " updates.shape[" + i + "] (" + n.shape[i] + ") != indices.shape[" + i + "] (" + e.shape[i] + ").");

    for (i = 0; i < n.rank - o; ++i) if (n.shape[i + o] !== t[i + r]) throw new Error(a + " updates.shape[" + (i + o) + "] (" + n.shape[i + o] + ") != shape[" + (i + o) + "] (" + t[i + o] + ")");
  }(n, e, t);
}

function Pr(t, e, n) {
  for (var r = e.rank > 1 ? e.shape[e.rank - 1] : 1, o = n.length, a = 1, i = r; i < o; ++i) a *= n[i];

  var s = r < 1 ? 1 : r;
  return {
    sliceRank: r,
    numUpdates: e.size / s,
    sliceSize: a,
    strides: W(n.slice(0, r)).concat([1]),
    outputSize: v(n)
  };
}

function Lr(t) {
  for (var e = [], n = 0; t > 0;) 1 & t && e.push(n), t /= 2, n++;

  return e;
}

function Wr(t, e, n) {
  for (var r = [], o = 0; o < t.length; o++) r[o] = Math.ceil((e[o] - t[o]) / n[o]);

  return r;
}

function Ur(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = u(0, a, s - 1);
}

function Vr(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = i > 0 ? u(0, a, s) : u(-1, a, s - 1);
}

function zr(t, e, n) {
  for (var r = n.length, o = 0; o < n.length; o++) if (n[o] > 1) {
    r = o;
    break;
  }

  for (o = r + 1; o < n.length; o++) if (e[o] > 0 || n[o] !== t[o]) return !1;

  return !0;
}

function Gr(t, e) {
  for (var n = t.length > 0 ? t[t.length - 1] : 1, r = 0; r < t.length - 1; r++) n += t[r] * e[r];

  return n;
}

function Hr(t) {
  return h(P(t), function () {
    return "The f passed in grad(f) must be a function";
  }), function (e, n) {
    var r = rn(e, "x", "tf.grad", null),
        o = null != n ? rn(n, "dy", "tf.grad") : null;
    return kt.tidy(function () {
      var e = kt.gradients(function () {
        return t(r);
      }, [r], o),
          n = e.value,
          a = e.grads;
      return null != o && p(n.shape, o.shape, "The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"), Yr(a), a[0];
    });
  };
}

function qr(t) {
  return h(P(t), function () {
    return "The f passed in grads(f) must be a function";
  }), function (e, n) {
    h(Array.isArray(e), function () {
      return "The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s";
    });
    var r = on(e, "args", "tf.grads", null),
        o = null != n ? rn(n, "dy", "tf.grads") : null;
    return kt.tidy(function () {
      var e = kt.gradients(function () {
        return t.apply(void 0, r);
      }, r, o),
          n = e.value,
          a = e.grads;
      return null != o && p(n.shape, o.shape, "The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), Yr(a), a;
    });
  };
}

function $r(t) {
  return h(P(t), function () {
    return "The f passed in valueAndGrad(f) must be a function";
  }), function (e, n) {
    h(e instanceof ut, function () {
      return "The x passed in valueAndGrad(f)(x) must be a tensor";
    }), h(null == n || n instanceof ut, function () {
      return "The dy passed in valueAndGrad(f)(x, dy) must be a tensor";
    });
    var r = kt.gradients(function () {
      return t(e);
    }, [e], n),
        o = r.grads,
        a = r.value;
    return Yr(o), {
      grad: o[0],
      value: a
    };
  };
}

function Kr(t) {
  return h(P(t), function () {
    return "The f passed in valueAndGrads(f) must be a function";
  }), function (e, n) {
    h(Array.isArray(e) && e.every(function (t) {
      return t instanceof ut;
    }), function () {
      return "The args passed in valueAndGrads(f)(args) must be array of tensors";
    }), h(null == n || n instanceof ut, function () {
      return "The dy passed in valueAndGrads(f)(args, dy) must be a tensor";
    });
    var r = kt.gradients(function () {
      return t.apply(void 0, e);
    }, e, n);
    return null != n && p(r.value.shape, n.shape, "The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), Yr(r.grads), r;
  };
}

function jr(t, e) {
  h(P(t), function () {
    return "The f passed in variableGrads(f) must be a function";
  }), h(null == e || Array.isArray(e) && e.every(function (t) {
    return t instanceof lt;
  }), function () {
    return "The varList passed in variableGrads(f, varList) must be an array of variables";
  });
  var n = null != e;
  if (!n) for (var r in e = [], kt.registeredVariables) e.push(kt.registeredVariables[r]);
  var o = n ? e.filter(function (t) {
    return !t.trainable;
  }) : null,
      a = e.length;
  h((e = e.filter(function (t) {
    return t.trainable;
  })).length > 0, function () {
    return "variableGrads() expects at least one of the input variables to be trainable, but none of the " + a + " variables is trainable.";
  });
  var i = kt.gradients(t, e, null, !0),
      s = i.value,
      u = i.grads;
  h(u.some(function (t) {
    return null != t;
  }), function () {
    return "Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().";
  }), h(0 === s.rank, function () {
    return "The f passed in variableGrads(f) must return a scalar, but it returned a rank-" + s.rank + " tensor";
  });
  var l = {};
  return e.forEach(function (t, e) {
    null != u[e] && (l[t.name] = u[e]);
  }), null != o && o.forEach(function (t) {
    return l[t.name] = null;
  }), {
    value: s,
    grads: l
  };
}

function Xr(t) {
  return kt.customGrad(t);
}

function Yr(t) {
  if (t.filter(function (t) {
    return null == t;
  }).length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
}

var Qr = mn({
  softmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = rn(t, "logits", "softmax");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and dim was " + e);
    return Xr(function (t, n) {
      var r = t.logSumExp([e], !0),
          o = t.toFloat().sub(r).exp();
      return n([o]), {
        value: o,
        gradFunc: function (t, n) {
          var r = n[0],
              o = t.mul(r);
          return o.sub(o.sum([e], !0).mul(r));
        }
      };
    })(n);
  }
}),
    Jr = mn({
  logSoftmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = rn(t, "logits", "logSoftmax");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Log Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and axis was " + e);
    return Xr(function (t, n) {
      var r = t.max(e, !0),
          o = t.sub(r),
          a = o.toFloat().sub(o.exp().sum(e, !0).log());
      return n([a]), {
        value: a,
        gradFunc: function (t, n) {
          var r = n[0].exp();
          return t.sub(t.sum(e, !0).mul(r));
        }
      };
    })(n);
  }
}),
    Zr = function () {
  function t(t, e) {
    this.backend = t, this.dataMover = e, this.data = new WeakMap();
  }

  return t.prototype.get = function (t) {
    return this.data.has(t) || this.dataMover.moveData(this.backend, t), this.data.get(t);
  }, t.prototype.set = function (t, e) {
    this.data.set(t, e);
  }, t.prototype.has = function (t) {
    return this.data.has(t);
  }, t.prototype.delete = function (t) {
    return this.data.delete(t);
  }, t;
}(),
    to = function () {
  function t() {}

  return t.prototype.time = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.read = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.readSync = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.disposeData = function (t) {
    throw new Error("Not yet implemented.");
  }, t.prototype.write = function (t, e) {
    throw new Error("Not yet implemented.");
  }, t.prototype.fromPixels = function (t, e) {
    throw new Error("Not yet implemented.");
  }, t.prototype.register = function (t, e, n) {
    throw new Error("Not yet implemented.");
  }, t.prototype.memory = function () {
    throw new Error("Not yet implemented.");
  }, t.prototype.floatPrecision = function () {
    throw new Error("Not yet implemented");
  }, t.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.fusedBatchMatMul = function (t) {
    t.a, t.b, t.transposeA, t.transposeB, t.bias, t.activation, t.preluActivationWeights;
    throw new Error("Not yet implemented");
  }, t.prototype.slice = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.stridedSlice = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.unstack = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.reverse = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.concat = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.neg = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.add = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.addN = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.subtract = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.multiply = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.realDivide = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.floorDiv = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.sum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.prod = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.argMin = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.argMax = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.equal = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.notEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.less = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.lessEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.greater = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.greaterEqual = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalNot = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalAnd = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.logicalOr = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.where = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.select = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.topk = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.min = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.minimum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.mod = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.max = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.maximum = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.all = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.any = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.squaredDifference = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.ceil = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.floor = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.round = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sign = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isNaN = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isInf = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.isFinite = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.pow = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.exp = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.expm1 = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.log = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.log1p = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sqrt = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.rsqrt = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.square = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.reciprocal = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.relu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.relu6 = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.prelu = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.elu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.eluDer = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.selu = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.int = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.clip = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.abs = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.complexAbs = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sigmoid = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.softplus = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.sin = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cos = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.tan = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.asin = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.acos = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atan = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atan2 = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.sinh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cosh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.tanh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.asinh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.acosh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.atanh = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.erf = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.step = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.fusedConv2d = function (t) {
    t.input, t.filter, t.convInfo, t.bias, t.activation, t.preluActivationWeights;
    throw new Error("Not yet implemented");
  }, t.prototype.conv2d = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.fusedDepthwiseConv2D = function (t) {
    t.input, t.filter, t.convInfo, t.bias, t.activation, t.preluActivationWeights;
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3d = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPool = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPool = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPool3d = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.avgPool3dBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPool3d = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.maxPool3dBackprop = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.reshape = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.cast = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.tile = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.pad = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.transpose = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.gather = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.gatherND = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.scatterND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.batchNormalization = function (t, e, n, r, o, a) {
    throw new Error("Not yet implemented");
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    throw new Error("Not yet implemented");
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    throw new Error("Not yet implemented");
  }, t.prototype.multinomial = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.oneHot = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.cumsum = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    throw new Error("Not yet implemented");
  }, t.prototype.fft = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.ifft = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.complex = function (t, e) {
    throw new Error("Not yet implemented");
  }, t.prototype.real = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.imag = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    throw new Error("Not yet implemented");
  }, t.prototype.depthToSpace = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.split = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    throw new Error("Not yet implemented");
  }, t.prototype.diag = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.fill = function (t, e, n) {
    throw new Error("Not yet implemented.");
  }, t.prototype.onesLike = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.zerosLike = function (t) {
    throw new Error("Not yet implemented");
  }, t.prototype.linspace = function (t, e, n) {
    throw new Error("Not yet implemented");
  }, t.prototype.dispose = function () {
    throw new Error("Not yet implemented");
  }, t;
}();

exports.KernelBackend = to;
exports.DataStorage = Zr;
exports.logSoftmax = Jr;
exports.softmax = Qr;

function eo(t, e) {
  for (var n = t.length, r = [], o = 0; o < n; o++) {
    var a = n - 1 - o,
        i = t[a] || 1;
    (e[e.length - 1 - o] || 1) > 1 && 1 === i && r.unshift(a);
  }

  return r;
}

function no(t, e) {
  for (var n = [], r = 0; r < e.length; r++) {
    var o = t[t.length - r - 1],
        a = e.length - r - 1,
        i = e[a];
    (null == o || 1 === o && i > 1) && n.unshift(a);
  }

  return n;
}

function ro(t, e) {
  for (var n = [], r = Math.max(t.length, e.length), o = 0; o < r; o++) {
    var a = t[t.length - o - 1];
    null == a && (a = 1);
    var i = e[e.length - o - 1];
    if (null == i && (i = 1), 1 === a) n.unshift(i);else if (1 === i) n.unshift(a);else {
      if (a !== i) throw Error("Operands could not be broadcast together with shapes " + t + " and " + e + ".");
      n.unshift(a);
    }
  }

  return n;
}

function oo(t, e, n, r, o, a, i) {
  void 0 === i && (i = "channelsLast");
  var s,
      u = lo(e),
      l = u[0],
      c = u[1];
  if ("channelsLast" === i) s = [l, c, t[3], t[3]];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    s = [l, c, t[1], t[1]];
  }
  return io(t, s, n, r, o, a, !1, i);
}

function ao(t, e, n, r, o, a, i) {
  void 0 === i && (i = "NDHWC");
  var s,
      u,
      l = co(e),
      c = l[0],
      h = l[1],
      p = l[2];
  if ("NDHWC" === i) u = "channelsLast", s = [c, h, p, t[4], t[4]];else {
    if ("NCDHW" !== i) throw new Error("Unknown dataFormat " + i);
    u = "channelsFirst", s = [c, h, p, t[1], t[1]];
  }
  return so(t, s, n, r, o, !1, u, a);
}

function io(t, e, n, r, o, a, i, s) {
  void 0 === i && (i = !1), void 0 === s && (s = "channelsLast");
  var u = [-1, -1, -1, -1],
      l = u[0],
      c = u[1],
      p = u[2],
      f = u[3];
  if ("channelsLast" === s) l = t[0], c = t[1], p = t[2], f = t[3];else {
    if ("channelsFirst" !== s) throw new Error("Unknown dataFormat " + s);
    l = t[0], f = t[1], c = t[2], p = t[3];
  }

  var d,
      v = e[0],
      m = e[1],
      y = e[3],
      x = lo(n),
      b = x[0],
      w = x[1],
      C = lo(r),
      E = C[0],
      R = C[1],
      I = ho(v, E),
      k = ho(m, R),
      N = function (t, e, n, r, o, a, i, s) {
    var u, l, c;

    if ("number" == typeof t) {
      var p = 0 === t ? "VALID" : "NUMBER";
      u = {
        top: t,
        bottom: t,
        left: t,
        right: t,
        type: p
      };

      var f = function (t, e, n, r, o) {
        null == r && (r = uo(t, e, n));
        var a = t[0],
            i = t[1],
            s = po((a - e + 2 * r) / n + 1, o);
        h(g(s), function () {
          return "The output # of rows (" + s + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var u = po((i - e + 2 * r) / n + 1, o);
        return h(g(u), function () {
          return "The output # of columns (" + u + ") must be an integer. Change the stride and/or zero pad parameters";
        }), [s, u];
      }([e, n], a, r, t, s);

      l = f[0], c = f[1];
    } else if ("same" === t) {
      l = Math.ceil(e / r), c = Math.ceil(n / o);
      var d = Math.max(0, (l - 1) * r + a - e),
          v = Math.max(0, (c - 1) * o + i - n),
          m = Math.floor(d / 2),
          y = d - m,
          x = Math.floor(v / 2),
          b = v - x;
      u = {
        top: m,
        bottom: y,
        left: x,
        right: b,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      u = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        type: "VALID"
      }, l = Math.ceil((e - a + 1) / r), c = Math.ceil((n - i + 1) / o);
    }

    return {
      padInfo: u,
      outHeight: l,
      outWidth: c
    };
  }(o, c, p, b, w, I, k, a),
      S = N.padInfo,
      A = N.outHeight,
      T = N.outWidth,
      D = i ? y * f : y;

  return "channelsFirst" === s ? d = [l, D, A, T] : "channelsLast" === s && (d = [l, A, T, D]), {
    batchSize: l,
    dataFormat: s,
    inHeight: c,
    inWidth: p,
    inChannels: f,
    outHeight: A,
    outWidth: T,
    outChannels: D,
    padInfo: S,
    strideHeight: b,
    strideWidth: w,
    filterHeight: v,
    filterWidth: m,
    effectiveFilterHeight: I,
    effectiveFilterWidth: k,
    dilationHeight: E,
    dilationWidth: R,
    inShape: t,
    outShape: d,
    filterShape: e
  };
}

function so(t, e, n, r, o, a, i, s) {
  void 0 === a && (a = !1), void 0 === i && (i = "channelsLast");
  var u = [-1, -1, -1, -1, -1],
      l = u[0],
      c = u[1],
      p = u[2],
      f = u[3],
      d = u[4];
  if ("channelsLast" === i) l = t[0], c = t[1], p = t[2], f = t[3], d = t[4];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    l = t[0], d = t[1], c = t[2], p = t[3], f = t[4];
  }

  var v,
      m = e[0],
      y = e[1],
      x = e[2],
      b = e[4],
      w = co(n),
      C = w[0],
      E = w[1],
      R = w[2],
      I = co(r),
      k = I[0],
      N = I[1],
      S = I[2],
      A = ho(m, k),
      T = ho(y, N),
      D = ho(x, S),
      _ = function (t, e, n, r, o, a, i, s, u, l, c) {
    var p, f, d, v;

    if ("number" == typeof t) {
      var m = 0 === t ? "VALID" : "NUMBER";
      p = {
        top: t,
        bottom: t,
        left: t,
        right: t,
        front: t,
        back: t,
        type: m
      };

      var y = function (t, e, n, r, o, a) {
        null == o && (o = uo(t, e, r));
        var i = t[0],
            s = t[1],
            u = t[2],
            l = po((i - e + 2 * o) / r + 1, a);
        h(g(l), function () {
          return "The output # of depths (" + l + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var c = po((s - e + 2 * o) / r + 1, a);
        h(g(c), function () {
          return "The output # of rows (" + c + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var p = po((u - e + 2 * o) / r + 1, a);
        return h(g(p), function () {
          return "The output # of columns (" + p + ") must be an integer. Change the stride and/or zero pad parameters";
        }), [l, c, p, n];
      }([e, n, r, 1], s, 1, o, t, c);

      f = y[0], d = y[1], v = y[2];
    } else if ("same" === t) {
      f = Math.ceil(e / o), d = Math.ceil(n / a), v = Math.ceil(r / i);
      var x = (f - 1) * o + s - e,
          b = (d - 1) * a + u - n,
          w = (v - 1) * i + l - r,
          C = Math.floor(x / 2),
          E = x - C,
          R = Math.floor(b / 2),
          I = b - R,
          k = Math.floor(w / 2),
          N = w - k;
      p = {
        top: R,
        bottom: I,
        left: k,
        right: N,
        front: C,
        back: E,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      p = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        front: 0,
        back: 0,
        type: "VALID"
      }, f = Math.ceil((e - s + 1) / o), d = Math.ceil((n - u + 1) / a), v = Math.ceil((r - l + 1) / i);
    }

    return {
      padInfo: p,
      outDepth: f,
      outHeight: d,
      outWidth: v
    };
  }(o, c, p, f, C, E, R, A, T, D, s),
      O = _.padInfo,
      F = _.outDepth,
      M = _.outHeight,
      B = _.outWidth,
      P = a ? b * d : b;

  return "channelsFirst" === i ? v = [l, P, F, M, B] : "channelsLast" === i && (v = [l, F, M, B, P]), {
    batchSize: l,
    dataFormat: i,
    inDepth: c,
    inHeight: p,
    inWidth: f,
    inChannels: d,
    outDepth: F,
    outHeight: M,
    outWidth: B,
    outChannels: P,
    padInfo: O,
    strideDepth: C,
    strideHeight: E,
    strideWidth: R,
    filterDepth: m,
    filterHeight: y,
    filterWidth: x,
    effectiveFilterDepth: A,
    effectiveFilterHeight: T,
    effectiveFilterWidth: D,
    dilationDepth: k,
    dilationHeight: N,
    dilationWidth: S,
    inShape: t,
    outShape: v,
    filterShape: e
  };
}

function uo(t, e, n, r) {
  void 0 === r && (r = 1);
  var o = ho(e, r);
  return Math.floor((t[0] * (n - 1) - n + o) / 2);
}

function lo(t) {
  return "number" == typeof t ? [t, t, t] : 2 === t.length ? [t[0], t[1], 1] : t;
}

function co(t) {
  return "number" == typeof t ? [t, t, t] : t;
}

function ho(t, e) {
  return e <= 1 ? t : t + (t - 1) * (e - 1);
}

function po(t, e) {
  if (!e) return t;

  switch (e) {
    case "round":
      return Math.round(t);

    case "ceil":
      return Math.ceil(t);

    case "floor":
      return Math.floor(t);

    default:
      throw new Error("Unknown roundingMode " + e);
  }
}

function fo(t) {
  var e = lo(t),
      n = e[0],
      r = e[1],
      o = e[2];
  return 1 === n && 1 === r && 1 === o;
}

function vo(t, e) {
  return fo(t) || fo(e);
}

function mo(t) {
  if ("NHWC" === t) return "channelsLast";
  if ("NCHW" === t) return "channelsFirst";
  throw new Error("Unknown dataFormat " + t);
}

function go(t, e, n) {
  if ("complex64" === e) {
    if ("complex64" === t.dtype) return t.clone();
    var r = Tn(t.shape),
        o = t.toFloat(),
        a = n.complex(o, r);
    return r.dispose(), o.dispose(), a;
  }

  if (!A(t.dtype, e)) return ut.make(t.shape, {
    dataId: t.dataId
  }, e);

  if ("complex64" === t.dtype) {
    var i = n.real(t);
    a = i.cast(e);
    return i.dispose(), a;
  }

  if ("int32" === e) return n.int(t);

  if ("bool" === e) {
    var s = Cn(0, t.dtype);
    a = n.notEqual(t, s);
    return s.dispose(), a;
  }

  throw new Error("Error in Cast: failed to cast " + t.dtype + " to " + e);
}

function yo(t, e) {
  return ut.make(e, {
    dataId: t.dataId
  }, t.dtype);
}

function xo(t, e, n) {
  var r = (e - t) / (n - 1),
      o = G(n, "float32");
  o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + r;

  return En(o, "float32");
}

var bo = Object.freeze({
  castTensor: go,
  reshapeTensor: yo,
  linspaceImpl: xo,
  upcastType: gt,
  axesAreInnerMostDims: an,
  combineLocations: sn,
  computeOutAndReduceShapes: un,
  expandShapeToKeepDim: ln,
  assertAxesAreInnerMostDims: cn,
  getAxesPermutation: hn,
  getUndoAxesPermutation: pn,
  getInnerMostAxes: fn,
  getBroadcastDims: eo,
  getReductionAxes: no,
  assertAndGetBroadcastShape: ro,
  assertParamsConsistent: dn,
  computeOutShape: vn,
  computePool2DInfo: oo,
  computePool3DInfo: ao,
  computeConv2DInfo: io,
  computeConv3DInfo: so,
  computeDefaultPad: uo,
  tupleValuesAreOne: fo,
  eitherStridesOrDilationsAreOne: vo,
  convertConv2DDataFormat: mo
});
exports.backend_util = bo;

function wo(t, e) {
  if (t.length !== e.length) throw new Error("Cannot merge real and imag arrays of different lengths. real:" + t.length + ", imag: " + e.length + ".");

  for (var n = new Float32Array(2 * t.length), r = 0; r < n.length; r += 2) n[r] = t[r / 2], n[r + 1] = e[r / 2];

  return n;
}

function Co(t, e) {
  return {
    real: t[2 * e],
    imag: t[2 * e + 1]
  };
}

function Eo(t, e, n, r) {
  t[2 * r] = e, t[2 * r + 1] = n;
}

function Ro(t, e, n) {
  var r = (n ? 2 : -2) * Math.PI * (t / e);
  return {
    real: Math.cos(r),
    imag: Math.sin(r)
  };
}

function Io(t, e, n, r, o) {
  for (var a = Array.from(e).map(function (t, e) {
    return {
      score: t,
      boxIndex: e
    };
  }).filter(function (t) {
    return t.score > o;
  }).sort(function (t, e) {
    return e.score - t.score;
  }), i = [], s = 0; s < a.length; s++) {
    var u = a[s],
        l = u.score,
        c = u.boxIndex;
    if (l < o) break;

    for (var h = !1, p = i.length - 1; p >= 0; --p) {
      if (ko(t, c, i[p]) >= r) {
        h = !0;
        break;
      }
    }

    if (!h && (i.push(c), i.length >= n)) break;
  }

  return En(i, "int32");
}

function ko(t, e, n) {
  var r = t.subarray(4 * e, 4 * e + 4),
      o = t.subarray(4 * n, 4 * n + 4),
      a = Math.min(r[0], r[2]),
      i = Math.min(r[1], r[3]),
      s = Math.max(r[0], r[2]),
      u = Math.max(r[1], r[3]),
      l = Math.min(o[0], o[2]),
      c = Math.min(o[1], o[3]),
      h = Math.max(o[0], o[2]),
      p = Math.max(o[1], o[3]),
      f = (s - a) * (u - i),
      d = (h - l) * (p - c);
  if (f <= 0 || d <= 0) return 0;
  var v = Math.max(a, l),
      m = Math.max(i, c),
      g = Math.min(s, h),
      y = Math.min(u, p),
      x = Math.max(g - v, 0) * Math.max(y - m, 0);
  return x / (f + d - x);
}

function No(t, e, n) {
  var r = new Array(t.rank).fill(0),
      o = t.shape.slice();
  return e.map(function (e) {
    o[n] = e;
    var a = t.slice(r, o);
    return r[n] += e, a;
  });
}

function So(t, e) {
  for (var n = new Array(t.rank), r = 0; r < n.length; r++) n[r] = t.shape[r] * e[r];

  var o = tr(n, t.dtype);

  for (r = 0; r < o.values.length; ++r) {
    for (var a = o.indexToLoc(r), i = new Array(t.rank), s = 0; s < i.length; s++) i[s] = a[s] % t.shape[s];

    var u = t.locToIndex(i);
    o.values[r] = t.values[u];
  }

  return o.toTensor();
}

function Ao(t, e, n, r, o) {
  for (var a = e[e.length - 1], i = [t.length / a, a], s = i[0], u = i[1], l = I(n, s * r), c = I("int32", s * r), h = 0; h < s; h++) {
    for (var p = h * u, f = t.subarray(p, p + u), d = [], v = 0; v < f.length; v++) d.push({
      value: f[v],
      index: v
    });

    d.sort(function (t, e) {
      return e.value - t.value;
    });
    var m = h * r,
        g = l.subarray(m, m + r),
        y = c.subarray(m, m + r);

    for (v = 0; v < r; v++) g[v] = d[v].value, y[v] = d[v].index;
  }

  var x = e.slice();
  return x[x.length - 1] = r, [bn(l, x, n), bn(c, x, "int32")];
}

function To(t, e) {
  for (var n = [], r = 0; r < e.length; r++) e[r] && n.push(r);

  var o = tr(t, "int32"),
      a = tr([n.length, t.length], "int32");

  for (r = 0; r < n.length; r++) {
    var i = o.indexToLoc(n[r]),
        s = r * t.length;
    a.values.set(i, s);
  }

  return a.toTensor();
}

var Do = function () {
  return function (t, e) {
    this.outputShape = [], this.outputShape = t, this.variableNames = e.map(function (t, e) {
      return "T" + e;
    });
    var n = [];
    this.variableNames.forEach(function (t) {
      n.push("float v" + t + " = get" + t + "AtOutCoords();");
    });
    var r = this.variableNames.map(function (t) {
      return "v" + t;
    }).join(" + ");
    this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        float result = " + r + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    _o = function () {
  return function (t, e) {
    this.outputShape = [], this.usesPackedTextures = !0, this.outputShape = t, this.variableNames = e.map(function (t, e) {
      return "T" + e;
    });
    var n = [];
    this.variableNames.forEach(function (t) {
      n.push("vec4 v" + t + " = get" + t + "AtOutCoords();");
    });
    var r = this.variableNames.map(function (t) {
      return "v" + t;
    }).join(" + ");
    this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        vec4 result = " + r + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    Oo = function () {
  return function (t, e, n) {
    this.variableNames = ["A"];
    var r = t.windowSize,
        o = t.batchSize,
        a = t.inSize,
        i = Math.ceil(a / r);
    n || this.variableNames.push("bestIndicesA"), this.outputShape = [o, i];
    var s = "max" === e ? ">" : "<",
        u = n ? "inOffset + i;" : "round(getBestIndicesA(batch, inOffset + i));";
    this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + r + ";\n\n        int bestIndex = inOffset;\n        float bestValue = getA(batch, bestIndex);\n\n        for (int i = 0; i < " + r + "; i++) {\n          int inIdx = " + u + ";\n          float candidate = getA(batch, inIdx);\n          if (candidate " + s + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
  };
}();

function Fo(t, e) {
  return ["x", "y", "z", "w", "u", "v"].slice(0, e).map(function (e) {
    return t + "." + e;
  });
}

function Mo(t, e) {
  return 1 === e ? [t] : Fo(t, e);
}

function Bo() {
  var t, e, n, r, o, i, s, u, l, c;
  return 2 === a().getNumber("WEBGL_VERSION") ? (t = "#version 300 es", e = "in", n = "out", r = "in", o = "texture", i = "outputColor", s = "out vec4 outputColor;", u = "\n      bool isnan_custom(float val) {\n        return (val > 0.0 || val < 0.0) ? false : val != 0.0;\n      }\n\n      bvec4 isnan_custom(vec4 val) {\n        return bvec4(isnan_custom(val.x),\n          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));\n      }\n\n      #define isnan(value) isnan_custom(value)\n    ", l = "", c = "\n      #define round(value) newRound(value)\n      int newRound(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 newRound(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    ") : (t = "", e = "attribute", n = "varying", r = "varying", o = "texture2D", i = "gl_FragColor", s = "", u = "\n      #define isnan(value) isnan_custom(value)\n      bool isnan_custom(float val) {\n        return (val > 0. || val < 1. || val == 0.) ? false : true;\n      }\n      bvec4 isnan_custom(vec4 val) {\n        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));\n      }\n    ", l = "\n      uniform float INFINITY;\n\n      bool isinf(float val) {\n        return abs(val) == INFINITY;\n      }\n      bvec4 isinf(vec4 val) {\n        return equal(abs(val), vec4(INFINITY));\n      }\n    ", c = "\n      int round(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 round(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    "), {
    version: t,
    attribute: e,
    varyingVs: n,
    varyingFs: r,
    texture2D: o,
    output: i,
    defineOutput: s,
    defineSpecialNaN: u,
    defineSpecialInf: l,
    defineRound: c
  };
}

function Po(t, e, n) {
  void 0 === n && (n = "index");
  var r = W(e);
  return r.map(function (e, o) {
    return "int " + t[o] + " = " + n + " / " + e + "; " + (o === r.length - 1 ? "int " + t[o + 1] + " = " + n + " - " + t[o] + " * " + e : "index -= " + t[o] + " * " + e) + ";";
  }).join("");
}

function Lo(t) {
  var e = W(t).map(function (t) {
    return t.toString();
  });
  return "\n  int getFlatIndex(ivec3 coords) {\n    return coords.x * " + e[0] + " + coords.y * " + e[1] + " + coords.z;\n  }\n";
}

var Wo = "\n  const float FLOAT_MAX = 1.70141184e38;\n  const float FLOAT_MIN = 1.17549435e-38;\n\n  lowp vec4 encode_float(highp float v) {\n    if (isnan(v)) {\n      return vec4(255, 255, 255, 255);\n    }\n\n    highp float av = abs(v);\n\n    if(av < FLOAT_MIN) {\n      return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > FLOAT_MAX) {\n      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n    } else if(v < -FLOAT_MAX) {\n      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n    }\n\n    highp vec4 c = vec4(0,0,0,0);\n\n    highp float e = floor(log2(av));\n    highp float m = exp2(fract(log2(av))) - 1.0;\n\n    c[2] = floor(128.0 * m);\n    m -= c[2] / 128.0;\n    c[1] = floor(32768.0 * m);\n    m -= c[1] / 32768.0;\n    c[0] = floor(8388608.0 * m);\n\n    highp float ebias = e + 127.0;\n    c[3] = floor(ebias / 2.0);\n    ebias -= c[3] * 2.0;\n    c[2] += floor(ebias) * 128.0;\n\n    c[3] += 128.0 * step(0.0, -v);\n\n    return c / 255.0;\n  }\n";

function Uo(t, e, n, r) {
  var o = [];
  t.forEach(function (t) {
    var e = v(t.shapeInfo.logicalShape);
    t.shapeInfo.isUniform ? o.push("uniform float " + t.name + (e > 1 ? "[" + e + "]" : "") + ";") : (o.push("uniform sampler2D " + t.name + ";"), o.push("uniform int offset" + t.name + ";"));
  });

  var a,
      i,
      s = o.join("\n"),
      u = t.map(function (t) {
    return function (t, e, n) {
      void 0 === n && (n = !1);
      var r = "";
      r += n ? zo(t) : Vo(t);
      var o = t.shapeInfo.logicalShape,
          a = e.logicalShape;
      o.length <= a.length && (r += n ? function (t, e) {
        var n,
            r = t.name,
            o = r.charAt(0).toUpperCase() + r.slice(1),
            a = "get" + o + "AtOutCoords",
            i = t.shapeInfo.logicalShape.length,
            s = e.logicalShape.length,
            u = eo(t.shapeInfo.logicalShape, e.logicalShape),
            l = Xo(s),
            c = s - i,
            h = ["x", "y", "z", "w", "u", "v"];
        n = 0 === i ? "" : s < 2 && u.length >= 1 ? "coords = 0;" : u.map(function (t) {
          return "coords." + h[t + c] + " = 0;";
        }).join("\n");
        var p = "";
        p = s < 2 && i > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + h[e + c];
        }).join(", ");
        var f = "return outputValue;",
            d = 1 === v(t.shapeInfo.logicalShape),
            m = 1 === v(e.logicalShape);

        if (1 !== i || d || m) {
          if (d && !m) f = 1 === s ? "\n        return vec4(outputValue.x, outputValue.x, 0., 0.);\n      " : "\n        return vec4(outputValue.x);\n      ";else if (u.length) {
            var g = i - 2,
                y = i - 1;
            u.indexOf(g) > -1 && u.indexOf(y) > -1 ? f = "return vec4(outputValue.x);" : u.indexOf(g) > -1 ? f = "return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);" : u.indexOf(y) > -1 && (f = "return vec4(outputValue.xx, outputValue.zz);");
          }
        } else f = "\n      return vec4(outputValue.xy, outputValue.xy);\n    ";

        return "\n    vec4 " + a + "() {\n      " + l + " coords = getOutputCoords();\n      " + n + "\n      vec4 outputValue = get" + o + "(" + p + ");\n      " + f + "\n    }\n  ";
      }(t, e) : function (t, e) {
        var n = t.name,
            r = n.charAt(0).toUpperCase() + n.slice(1),
            o = "get" + r + "AtOutCoords",
            a = e.texShape,
            i = t.shapeInfo.texShape,
            s = t.shapeInfo.logicalShape.length,
            u = e.logicalShape.length;
        if (!t.shapeInfo.isUniform && s === u && null == t.shapeInfo.flatOffset && m(i, a)) return "\n      float " + o + "() {\n        return sampleTexture(" + n + ", resultUV);\n      }\n    ";
        var l,
            c = Xo(u),
            h = eo(t.shapeInfo.logicalShape, e.logicalShape),
            p = u - s,
            f = ["x", "y", "z", "w", "u", "v"];
        l = 0 === s ? "" : u < 2 && h.length >= 1 ? "coords = 0;" : h.map(function (t) {
          return "coords." + f[t + p] + " = 0;";
        }).join("\n");
        var d = "";
        d = u < 2 && s > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + f[e + p];
        }).join(", ");
        return "\n    float " + o + "() {\n      " + c + " coords = getOutputCoords();\n      " + l + "\n      return get" + r + "(" + d + ");\n    }\n  ";
      }(t, e));
      return r;
    }(t, e, r);
  }).join("\n"),
      l = e.texShape,
      c = Bo(),
      h = function (t) {
    return "\n    float sampleTexture(sampler2D textureSampler, vec2 uv) {\n      return " + t.texture2D + "(textureSampler, uv).r;\n    }\n  ";
  }(c),
      p = function (t) {
    return t.version + "\n    precision highp float;\n    precision highp int;\n    precision highp sampler2D;\n    " + t.varyingFs + " vec2 resultUV;\n    " + t.defineOutput + "\n    const vec2 halfCR = vec2(0.5, 0.5);\n\n    struct ivec5\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n    };\n\n    struct ivec6\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n      int v;\n    };\n\n    uniform float NAN;\n    " + t.defineSpecialNaN + "\n    " + t.defineSpecialInf + "\n    " + t.defineRound + "\n\n    int imod(int x, int y) {\n      return x - y * (x / y);\n    }\n\n    int idiv(int a, int b, float sign) {\n      int res = a / b;\n      int mod = imod(a, b);\n      if (sign < 0. && mod != 0) {\n        res -= 1;\n      }\n      return res;\n    }\n\n    //Based on the work of Dave Hoskins\n    //https://www.shadertoy.com/view/4djSRW\n    #define HASHSCALE1 443.8975\n    float random(float seed){\n      vec2 p = resultUV * seed;\n      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n      p3 += dot(p3, p3.yzx + 19.19);\n      return fract((p3.x + p3.y) * p3.z);\n    }\n\n    " + Go + "\n    " + Ho + "\n    " + qo + "\n  ";
  }(c);

  return e.isPacked ? (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (1 === n[0]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.x * " + n[1] + ".0);\n      }\n    ";
          if (1 === n[1]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.y * " + n[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      return 2 * (resTexRC.x * " + n[1] + " + resTexRC.y);\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (m(t, e)) return "\n      ivec2 getOutputCoords() {\n        return 2 * ivec2(resultUV.yx * vec2(" + n[0] + ", " + n[1] + "));\n      }\n    ";
          var r = Math.ceil(t[1] / 2);
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = t, r = e, o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)], a = Math.ceil(n[2] / 2), i = a * Math.ceil(n[1] / 2), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + o[0] + ", " + o[1] + "));\n      int index = resTexRC.x * " + o[1] + " + resTexRC.y;\n\n      int b = index / " + i + ";\n      index -= b * " + i + ";\n\n      int r = 2 * (index / " + a + ");\n      int c = imod(index, " + a + ") * 2;\n\n      return ivec3(b, r, c);\n    }\n  ";

      default:
        return function (t, e) {
          for (var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)], r = Math.ceil(t[t.length - 1] / 2), o = r * Math.ceil(t[t.length - 2] / 2), a = o, i = "", s = "b, r, c", u = 2; u < t.length - 1; u++) a *= t[t.length - u - 1], i = "\n      int b" + u + " = index / " + a + ";\n      index -= b" + u + " * " + a + ";\n    " + i, s = "b" + u + ", " + s;

          return "\n    ivec" + t.length + " getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n\n      " + i + "\n\n      int b = index / " + o + ";\n      index -= b * " + o + ";\n\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec" + t.length + "(" + s + ");\n    }\n  ";
        }(t, e);
    }

    var n, r, o, a, i;
  }(e.logicalShape, l), i = function (t) {
    return "\n    void setOutput(vec4 val) {\n      " + t.output + " = val;\n    }\n  ";
  }(c)) : (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          if (1 === e[0]) return "\n      int getOutputCoords() {\n        return int(resultUV.x * " + e[1] + ".0);\n      }\n    ";
          if (1 === e[1]) return "\n      int getOutputCoords() {\n        return int(resultUV.y * " + e[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      return resTexRC.x * " + e[1] + " + resTexRC.y;\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          if (m(t, e)) return "\n      ivec2 getOutputCoords() {\n        return ivec2(resultUV.yx * vec2(" + e[0] + ", " + e[1] + "));\n      }\n    ";
          if (1 === t[1]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(index, 0);\n      }\n    ";
          if (1 === t[0]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(0, index);\n      }\n    ";
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      int r = index / " + t[1] + ";\n      int c = index - r * " + t[1] + ";\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = e, r = Po(["r", "c", "d"], t), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      " + r + "\n      return ivec3(r, c, d);\n    }\n  ";

      case 4:
        return function (t, e) {
          var n = Po(["r", "c", "d", "d2"], t);
          return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      " + n + "\n      return ivec4(r, c, d, d2);\n    }\n  ";
        }(t, e);

      case 5:
        return function (t, e) {
          var n = Po(["r", "c", "d", "d2", "d3"], t);
          return "\n    ivec5 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx * vec2(" + e[0] + ",\n                             " + e[1] + "));\n\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec5 outShape = ivec5(r, c, d, d2, d3);\n      return outShape;\n    }\n  ";
        }(t, e);

      case 6:
        return function (t, e) {
          var n = Po(["r", "c", "d", "d2", "d3", "d4"], t);
          return "\n    ivec6 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec6 result = ivec6(r, c, d, d2, d3, d4);\n      return result;\n    }\n  ";
        }(t, e);

      default:
        throw new Error(t.length + "-D output sampling is not yet supported");
    }

    var n, r;
  }(e.logicalShape, l), i = function (t) {
    return "\n    void setOutput(float val) {\n      " + t.output + " = vec4(val, 0, 0, 0);\n    }\n  ";
  }(c)), r && (p += $o), [p, h, i, s, a, u, n].join("\n");
}

function Vo(t) {
  var e = t.shapeInfo.logicalShape;

  switch (e.length) {
    case 0:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "float " + n + "() {return " + e + ";}";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === o && 1 === a) return "\n      float " + n + "() {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";
        var i = t.shapeInfo.texShape,
            s = i[0],
            u = i[1],
            l = Ko(e);
        return "\n    float " + n + "() {\n      vec2 uv = uvFromFlat(" + s + ", " + u + ", " + l + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "\n      float " + n + "(int index) {\n        " + jo(t) + "\n      }\n    ";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === a && 1 === o) return "\n      float " + n + "(int index) {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";
        var i = Ko(e);
        if (1 === a) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2(0.5, (float(index + " + i + ") + 0.5) / " + o + ".0);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        if (1 === o) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2((float(index + " + i + ") + 0.5) / " + a + ".0, 0.5);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        return "\n    float " + n + "(int index) {\n      vec2 uv = uvFromFlat(" + o + ", " + a + ", index + " + i + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape;

        if (null != o && m(e, o)) {
          var a = o[0],
              i = o[1];
          return "\n    float " + r + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        }

        var s = R(e),
            u = s.newShape,
            l = s.keptDims,
            c = u;

        if (c.length < e.length) {
          var h = Yo(t, c);
          return "\n      " + Vo(h) + "\n      float " + r + "(int row, int col) {\n        return " + r + "(" + Qo(["row", "col"], l) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col) {\n        int index = round(dot(vec2(row, col), vec2(" + e[1] + ", 1)));\n        " + jo(t) + "\n      }\n    ";
        var p = o[0],
            f = o[1],
            d = Ko(n);
        if (1 === f) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + d + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2(0.5, (index + 0.5) / " + p + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        if (1 === p) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + d + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2((index + 0.5) / " + f + ".0, 0.5);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        return "\n  float " + r + "(int row, int col) {\n    // Explicitly use integer operations as dot() only works on floats.\n    int index = row * " + e[1] + " + col + " + d + ";\n    vec2 uv = uvFromFlat(" + p + ", " + f + ", index);\n    return sampleTexture(" + n + ", uv);\n  }\n";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[1] * e[2],
            a = e[2],
            i = R(e),
            s = i.newShape,
            u = i.keptDims,
            l = s;

        if (l.length < e.length) {
          var c = Yo(t, l);
          return "\n        " + Vo(c) + "\n        float " + r + "(int row, int col, int depth) {\n          return " + r + "(" + Qo(["row", "col", "depth"], u) + ");\n        }\n      ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth) {\n        int index = round(dot(vec3(row, col, depth),\n                          vec3(" + o + ", " + a + ", 1)));\n        " + jo(t) + "\n      }\n    ";
        var h = t.shapeInfo.texShape,
            p = h[0],
            f = h[1],
            d = t.shapeInfo.flatOffset;
        if (f === o && null == d) return "\n        float " + r + "(int row, int col, int depth) {\n          float texR = float(row);\n          float texC = dot(vec2(col, depth), vec2(" + a + ", 1));\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + f + ".0, " + p + ".0);\n          return sampleTexture(" + n + ", uv);\n        }\n      ";
        if (f === a && null == d) return "\n    float " + r + "(int row, int col, int depth) {\n      float texR = dot(vec2(row, col), vec2(" + e[1] + ", 1));\n      float texC = float(depth);\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + f + ".0, " + p + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        var v = Ko(n);
        return "\n      float " + r + "(int row, int col, int depth) {\n        // Explicitly use integer operations as dot() only works on floats.\n        int index = row * " + o + " + col * " + a + " + depth + " + v + ";\n        vec2 uv = uvFromFlat(" + p + ", " + f + ", index);\n        return sampleTexture(" + n + ", uv);\n      }\n  ";
      }(t);

    case 4:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[3],
            a = e[2] * o,
            i = e[1] * a,
            s = R(e),
            u = s.newShape,
            l = s.keptDims;

        if (u.length < e.length) {
          var c = Yo(t, u);
          return "\n      " + Vo(c) + "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        return " + r + "(" + Qo(["row", "col", "depth", "depth2"], l) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        int index = round(dot(vec4(row, col, depth, depth2),\n                          vec4(" + i + ", " + a + ", " + o + ", 1)));\n        " + jo(t) + "\n      }\n    ";
        var h = t.shapeInfo.flatOffset,
            p = t.shapeInfo.texShape,
            f = p[0],
            d = p[1];
        if (d === i && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = float(row);\n        float texC =\n            dot(vec3(col, depth, depth2),\n                vec3(" + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + d + ".0, " + f + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (d === o && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = dot(vec3(row, col, depth),\n                         vec3(" + e[1] * e[2] + ", " + e[2] + ", 1));\n        float texC = float(depth2);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + d + ".0, " + f + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var v = Ko(n);
        return "\n    float " + r + "(int row, int col, int depth, int depth2) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + i + " + col * " + a + " +\n          depth * " + o + " + depth2;\n      vec2 uv = uvFromFlat(" + f + ", " + d + ", index + " + v + ");\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 5:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[4],
            a = e[3] * o,
            i = e[2] * a,
            s = e[1] * i,
            u = R(e),
            l = u.newShape,
            c = u.keptDims;

        if (l.length < e.length) {
          var h = Yo(t, l);
          return "\n      " + Vo(h) + "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        return " + r + "(" + Qo(["row", "col", "depth", "depth2", "depth3"], c) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float index = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + s + ", " + i + ", " + a + ", " + o + ")) +\n          depth3;\n        " + jo(t) + "\n      }\n    ";
        var p = t.shapeInfo.flatOffset,
            f = t.shapeInfo.texShape,
            d = f[0],
            v = f[1];
        if (v === s && null == p) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n                         vec4(" + i + ", " + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + v + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (v === o && null == p) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float texR = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] + ",\n               " + e[2] * e[3] + ", " + e[3] + ", 1));\n        int texC = depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + v + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var m = Ko(n);
        return "\n    float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + s + " + col * " + i + " + depth * " + a + " +\n          depth2 * " + o + " + depth3 + " + m + ";\n      vec2 uv = uvFromFlat(" + d + ", " + v + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 6:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = R(e),
            a = o.newShape,
            i = o.keptDims;

        if (a.length < e.length) {
          var s = Yo(t, a);
          return "\n      " + Vo(s) + "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        return " + r + "(" + Qo(["row", "col", "depth", "depth2", "depth3", "depth4"], i) + ");\n      }\n    ";
        }

        var u = e[5],
            l = e[4] * u,
            c = e[3] * l,
            h = e[2] * c,
            p = e[1] * h;
        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n        int index = round(dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + p + ", " + h + ", " + c + ", " + l + ")) +\n          dot(\n            vec2(depth3, depth4),\n            vec2(" + u + ", 1)));\n        " + jo(t) + "\n      }\n    ";
        var f = t.shapeInfo.flatOffset,
            d = t.shapeInfo.texShape,
            v = d[0],
            m = d[1];
        if (m === p && null == f) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n          vec4(" + h + ", " + c + ", " + l + ", " + u + ")) +\n               float(depth4);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + m + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (m === u && null == f) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        float texR = dot(vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] * e[4] + ",\n               " + e[2] * e[3] * e[4] + ",\n               " + e[3] * e[4] + ",\n               " + e[4] + ")) + float(depth3);\n        int texC = depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + m + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var g = Ko(n);
        return "\n    float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + p + " + col * " + h + " + depth * " + c + " +\n          depth2 * " + l + " + depth3 * " + u + " + depth4 + " + g + ";\n      vec2 uv = uvFromFlat(" + v + ", " + m + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      throw new Error(e.length + "-D input sampling is not yet supported");
  }
}

function zo(t) {
  var e, n, r;

  switch (t.shapeInfo.logicalShape.length) {
    case 0:
      return e = t.name, n = "get" + e.charAt(0).toUpperCase() + e.slice(1), r = Bo(), "\n    vec4 " + n + "() {\n      return " + r.texture2D + "(" + e + ", halfCR);\n    }\n  ";

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1),
            r = t.shapeInfo.texShape,
            o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)],
            a = Bo();
        return "\n    vec4 " + n + "(int index) {\n      vec2 uv = packedUVfrom1D(\n        " + o[0] + ", " + o[1] + ", index);\n      return " + a.texture2D + "(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = o[0],
            i = o[1],
            s = Bo();
        if (null != o && m(e, o)) return "\n      vec4 " + r + "(int row, int col) {\n        vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n\n        return " + s.texture2D + "(" + n + ", uv);\n      }\n    ";
        var u = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)],
            l = Math.ceil(e[1] / 2);
        return "\n    vec4 " + r + "(int row, int col) {\n      vec2 uv = packedUVfrom2D(" + l + ", " + u[0] + ", " + u[1] + ", row, col);\n      return " + s.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)];

        if (1 === e[0]) {
          var i = e.slice(1),
              s = Yo(t, i);
          return "\n        " + zo(s) + "\n        vec4 " + r + "(int b, int row, int col) {\n          return " + r + "(" + Qo(["b", "row", "col"], [1, 2]) + ");\n        }\n      ";
        }

        var u = a[0],
            l = a[1],
            c = Math.ceil(e[2] / 2),
            h = c * Math.ceil(e[1] / 2),
            p = Bo();
        return "\n    vec4 " + r + "(int b, int row, int col) {\n      vec2 uv = packedUVfrom3D(\n        " + u + ", " + l + ", " + h + ", " + c + ", b, row, col);\n      return " + p.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      return function (t) {
        for (var e = t.shapeInfo.logicalShape, n = e.length, r = t.name, o = "get" + r.charAt(0).toUpperCase() + r.slice(1), a = t.shapeInfo.texShape, i = [Math.ceil(a[0] / 2), Math.ceil(a[1] / 2)], s = i[0], u = i[1], l = Math.ceil(e[n - 1] / 2), c = l * Math.ceil(e[n - 2] / 2), h = "int b, int row, int col", p = "b * " + c + " + (row / 2) * " + l + " + (col / 2)", f = 2; f < n - 1; f++) h = "int b" + f + ", " + h, c *= e[n - f - 1], p = "b" + f + " * " + c + " + " + p;

        var d = Bo();
        return "\n    vec4 " + o + "(" + h + ") {\n      int index = " + p + ";\n      int texR = index / " + u + ";\n      int texC = index - texR * " + u + ";\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + u + ", " + s + ");\n      return " + d.texture2D + "(" + r + ", uv);\n    }\n  ";
      }(t);
  }
}

var Go = "\nvec2 uvFromFlat(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom1D(int texNumR, int texNumC, int index) {\n  int texelIndex = index / 2;\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    Ho = "\nvec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,\n  int texNumC, int row, int col) {\n  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    qo = "\nvec2 packedUVfrom3D(int texNumR, int texNumC,\n    int texelsInBatch, int texelsInLogicalRow, int b,\n    int row, int col) {\n  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    $o = "\n  float getChannel(vec4 frag, vec2 innerDims) {\n    vec2 modCoord = mod(innerDims, 2.);\n    return modCoord.x == 0. ?\n      (modCoord.y == 0. ? frag.r : frag.g) :\n      (modCoord.y == 0. ? frag.b : frag.a);\n  }\n  float getChannel(vec4 frag, int dim) {\n    float modCoord = mod(float(dim), 2.);\n    return modCoord == 0. ? frag.r : frag.g;\n  }\n";

function Ko(t) {
  return "offset" + t;
}

function jo(t) {
  var e = t.name,
      n = v(t.shapeInfo.logicalShape);
  return n < 2 ? "return " + e + ";" : "\n    for (int i = 0; i < " + n + "; i++) {\n      if (i == index) {\n        return " + e + "[i];\n      }\n    }\n  ";
}

function Xo(t) {
  if (t <= 1) return "int";
  if (2 === t) return "ivec2";
  if (3 === t) return "ivec3";
  if (4 === t) return "ivec4";
  if (5 === t) return "ivec5";
  if (6 === t) return "ivec6";
  throw Error("GPU for rank " + t + " is not yet supported");
}

function Yo(t, e) {
  var n = JSON.parse(JSON.stringify(t));
  return n.shapeInfo.logicalShape = e, n;
}

function Qo(t, e) {
  return e.map(function (e) {
    return t[e];
  }).join(", ");
}

var Jo = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, h(t.length > 2, function () {
      return "Packed arg" + (n.charAt(0).toUpperCase() + n.slice(1)) + " supports only inputs with rank above 2.";
    });
    var o = t[t.length - 1],
        a = Math.ceil(o / e);
    this.outputShape = t.slice(0, -1), a > 1 && this.outputShape.push(a), r || this.variableNames.push("bestIndicesA");
    var i,
        s,
        u = this.outputShape,
        l = u.length,
        c = Xo(l),
        p = Mo("coords", l);

    if (1 === a) {
      var f = Xo(s = l + 1);
      i = "\n        " + f + " sourceLocR = " + f + "(" + p.join() + ", 0);\n        ++" + p[l - 1] + ";\n        " + f + " sourceLocG = " + f + "(" + p.join() + ", 0);\n        ++" + p[l - 2] + ";\n        " + f + " sourceLocA = " + f + "(" + p.join() + ", 0);\n        --" + p[l - 1] + ";\n        " + f + " sourceLocB = " + f + "(" + p.join() + ", 0);\n        --" + p[l - 2] + ";";
    } else s = l, i = "\n        " + c + " sourceLocR = coords;\n        ++" + p[l - 1] + ";\n        " + c + " sourceLocG = coords;\n        ++" + p[l - 2] + ";\n        " + c + " sourceLocA = coords;\n        --" + p[l - 1] + ";\n        " + c + " sourceLocB = coords;\n        --" + p[l - 2] + ";";

    var d = ["x", "y", "z", "w", "u", "v"].slice(0, s),
        v = "." + d[s - 1],
        m = d.map(function (t) {
      return "int " + t;
    }),
        g = Mo("sourceLocR", s - 1).concat("inIdx.r"),
        y = Mo("sourceLocG", s - 1).concat("inIdx.g"),
        x = Mo("sourceLocB", s - 1).concat("inIdx.b"),
        b = Mo("sourceLocA", s - 1).concat("inIdx.a"),
        w = "max" === n ? "greaterThan" : "lessThan",
        C = r ? "" : "\n          inIdx = round(vec4(getBestIndicesAChannel(" + g.join() + "),\n                             getBestIndicesAChannel(" + y.join() + "),\n                             getBestIndicesAChannel(" + x.join() + "),\n                             getBestIndicesAChannel(" + b.join() + ")));",
        E = "vec4(\n            getAChannel(" + g.join() + "),\n            hasNextCol ? getAChannel(" + y.join() + ") : 0.,\n            hasNextRow ? getAChannel(" + x.join() + ") : 0.,\n            hasNextRow && hasNextCol ? getAChannel(" + b.join() + ") : 0.)",
        R = r ? "" : "\n      float getBestIndicesAChannel(" + m.join() + ") {\n        return getChannel(getBestIndicesA(" + d.join() + "),\n                                          vec2(" + d.slice(-2).join() + "));\n      }";
    this.userCode = "\n      float getAChannel(" + m.join() + ") {\n        return getChannel(getA(" + d.join() + "),\n                               vec2(" + d.slice(-2).join() + "));\n      }\n      " + R + "\n      void main() {\n        " + c + " coords = getOutputCoords();\n        bool hasNextCol = " + p[l - 1] + " < " + (u[l - 1] - 1) + ";\n        bool hasNextRow = " + p[l - 2] + " < " + (u[l - 2] - 1) + ";\n        " + i + "\n        ivec4 srcIdx = ivec4(sourceLocR" + v + ", sourceLocG" + v + ",\n          sourceLocB" + v + ", sourceLocA" + v + ") * " + e + ";\n        ivec4 inIdx = srcIdx;\n        vec4 bestIndex = vec4(inIdx);\n        vec4 bestValue = " + E + ";\n\n        for (int i = 0; i < " + e + "; i++) {\n          inIdx = srcIdx;\n          " + C + "\n          vec4 candidate = " + E + ";\n          bvec4 nan = isnan(candidate);\n          bvec4 replace = bvec4(\n            vec4(" + w + "(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));\n\n          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,\n                           replace.y  ? candidate.y : bestValue.y,\n                           replace.z  ? candidate.z : bestValue.z,\n                           replace.w  ? candidate.w : bestValue.w);\n          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));\n          srcIdx++;\n        }\n        setOutput(bestIndex);\n      }\n    ";
  };
}(),
    Zo = function () {
  return function (t) {
    this.variableNames = ["dy"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = t.dilationHeight,
        i = t.dilationWidth,
        s = t.effectiveFilterHeight,
        u = t.effectiveFilterWidth,
        l = s - 1 - t.padInfo.top,
        c = u - 1 - t.padInfo.left,
        h = 1 / (e * n);
    this.userCode = "\n      const ivec2 pads = ivec2(" + l + ", " + c + ");\n      const float avgMultiplier = float(" + h + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + s + ";\n            wR += " + a + ") {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + u + ";\n            wC+= " + i + ") {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ta = function () {
  return function (t) {
    this.variableNames = ["dy"], this.outputShape = t.inShape;
    var e = t.filterDepth,
        n = t.filterHeight,
        r = t.filterWidth,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = t.dilationDepth,
        u = t.dilationHeight,
        l = t.dilationWidth,
        c = t.effectiveFilterDepth,
        h = t.effectiveFilterHeight,
        p = t.effectiveFilterWidth,
        f = c - 1 - t.padInfo.front,
        d = h - 1 - t.padInfo.top,
        v = p - 1 - t.padInfo.left,
        m = 1 / (e * n * r);
    this.userCode = "\n      const ivec3 pads = ivec3(" + f + ", " + d + ", " + v + ");\n      const float avgMultiplier = float(" + m + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyDCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get\n        // dx(xD, xR, xC, ch).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int wD = 0; wD < " + c + ";\n            wD += " + s + ") {\n          float dyD = float(dyDCorner + wD) / " + o + ".0;\n\n          if (dyD < 0.0 || dyD >= " + t.outDepth + ".0 || fract(dyD) > 0.0) {\n            continue;\n          }\n          int idyD = int(dyD);\n\n          for (int wR = 0; wR < " + h + ";\n              wR += " + u + ") {\n            float dyR = float(dyRCorner + wR) / " + a + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n                fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            for (int wC = 0; wC < " + p + ";\n                wC += " + l + ") {\n              float dyC = float(dyCCorner + wC) / " + i + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              float dyValue = getDy(batch, idyD, idyR, idyC, ch);\n\n              dotProd += dyValue * avgMultiplier;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ea = function () {
  return function (t, e, n, r, o, a) {
    this.outputShape = [], this.variableNames = ["x", "mean", "variance"], ro(t, e), ro(t, n);
    var i = "0.0";
    null != r && (ro(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
    var s = "1.0";
    null != o && (ro(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + i + ";\n        float scale = " + s + ";\n        float inv = scale * inversesqrt(variance + float(" + a + "));\n        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));\n      }\n    ";
  };
}(),
    na = function () {
  return function (t, e, n, r, o, a) {
    this.usesPackedTextures = !0, this.variableNames = ["x", "mean", "variance"], ro(t, e), ro(t, n);
    var i = "vec4(0.0)";
    null != r && (ro(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
    var s = "vec4(1.0)";
    null != o && (ro(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        vec4 offset = " + i + ";\n        vec4 scale = " + s + ";\n\n        vec4 x = getXAtOutCoords();\n        vec4 mean = getMeanAtOutCoords();\n        vec4 variance = getVarianceAtOutCoords();\n\n        vec4 inv = scale * inversesqrt(variance + vec4(" + a + "));\n\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
  };
}(),
    ra = "return areal * breal - aimag * bimag;",
    oa = "return areal * bimag + aimag * breal;",
    aa = function () {
  return function (t, e, n) {
    this.variableNames = ["AReal", "AImag", "BReal", "BImag"], this.outputShape = ro(e, n), this.userCode = "\n      float binaryOpComplex(\n          float areal, float aimag, float breal, float bimag) {\n        " + t + "\n      }\n\n      void main() {\n        float areal = getARealAtOutCoords();\n        float aimag = getAImagAtOutCoords();\n        float breal = getBRealAtOutCoords();\n        float bimag = getBImagAtOutCoords();\n        setOutput(binaryOpComplex(areal, aimag, breal, bimag));\n      }\n    ";
  };
}(),
    ia = "return a + b;",
    sa = "return a - b;",
    ua = "return a * b;",
    la = "return (a < 0.) ? b * a : a;",
    ca = function () {
  return function (t, e, n) {
    this.variableNames = ["A", "B"], this.outputShape = ro(e, n), this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + t + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
  };
}(),
    ha = "\n  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));\n  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);\n",
    pa = function () {
  return function (t, e, n, r) {
    void 0 === r && (r = !1), this.variableNames = ["A", "B"], this.supportsBroadcasting = !0, this.usesPackedTextures = !0, this.outputShape = ro(e, n);
    var o = this.outputShape.length,
        a = "";
    if (r) if (0 === o || 1 === v(this.outputShape)) a = "\n          result.y = 0.;\n          result.z = 0.;\n          result.w = 0.;\n        ";else if (a = "\n          " + Xo(o) + " coords = getOutputCoords();\n        ", 1 === o) a += "\n            result.y = (coords + 1) >= " + this.outputShape[0] + " ? 0. : result.y;\n            result.z = 0.;\n            result.w = 0.;\n          ";else {
      var i = Mo("coords", o);
      a += "\n            bool nextRowOutOfBounds =\n              (" + i[o - 2] + " + 1) >= " + this.outputShape[o - 2] + ";\n            bool nextColOutOfBounds =\n              (" + i[o - 1] + " + 1) >= " + this.outputShape[o - 1] + ";\n            result.y = nextColOutOfBounds ? 0. : result.y;\n            result.z = nextRowOutOfBounds ? 0. : result.z;\n            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;\n          ";
    }
    this.userCode = "\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + t + "\n      }\n\n      void main() {\n        vec4 a = getAAtOutCoords();\n        vec4 b = getBAtOutCoords();\n\n        vec4 result = binaryOperation(a, b);\n        " + a + "\n\n        setOutput(result);\n      }\n    ";
  };
}(),
    fa = function () {
  function t(t) {
    this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      uniform float minVal;\n      uniform float maxVal;\n\n      void main() {\n        float value = getAAtOutCoords();\n        if (isnan(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, minVal, maxVal));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "minVal"), n.maxLoc = r.getUniformLocationNoThrow(o, "maxVal")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    da = function () {
  function t(t) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t, this.userCode = "\n      uniform float minVal;\n      uniform float maxVal;\n\n      void main() {\n        vec4 value = getAAtOutCoords();\n\n        if (any(isnan(value))) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "minVal"), n.maxLoc = r.getUniformLocationNoThrow(o, "maxVal")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    va = function () {
  return function (t) {
    this.variableNames = ["real", "imag"], this.outputShape = t, this.userCode = "\n      void main() {\n        float re = abs(getRealAtOutCoords());\n        float im = abs(getImagAtOutCoords());\n        float mx = max(re, im);\n\n        // sadly the length function in glsl is not underflow-safe\n        // (at least not on Intel GPUs). So the safe solution is\n        // to ensure underflow-safety in all cases.\n        setOutput(\n          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))\n        );\n      }\n    ";
  };
}(),
    ma = function () {
  return function (t) {
    this.outputShape = [], this.outputShape = vn(t, 1), this.variableNames = t.map(function (t, e) {
      return "T" + e;
    });
    var e = new Array(t.length - 1);
    e[0] = t[0][1];

    for (var n = 1; n < e.length; n++) e[n] = e[n - 1] + t[n][1];

    var r = ["if (yC < " + e[0] + ") setOutput(getT0(yR, yC));"];

    for (n = 1; n < e.length; n++) {
      var o = e[n - 1];
      r.push("else if (yC < " + e[n] + ") setOutput(getT" + n + "(yR, yC-" + o + "));");
    }

    var a = e.length,
        i = e[e.length - 1];
    r.push("else setOutput(getT" + a + "(yR, yC-" + i + "));"), this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        " + r.join("\n        ") + "\n      }\n    ";
  };
}(),
    ga = function () {
  return function (t, e) {
    this.usesPackedTextures = !0, this.outputShape = [], this.outputShape = vn(t, e);
    var n = this.outputShape,
        r = n.length,
        o = Xo(r),
        a = Mo("coords", r),
        i = ["x", "y", "z", "w", "u", "v"].slice(0, r);
    this.variableNames = t.map(function (t, e) {
      return "T" + e;
    });
    var s = new Array(t.length - 1);
    s[0] = t[0][e];

    for (var u = 1; u < s.length; u++) s[u] = s[u - 1] + t[u][e];

    var l = i[e],
        c = i.slice(-2),
        h = i.join(),
        p = "if (" + l + " < " + s[0] + ") {\n        return getChannel(\n            getT0(" + h + "), vec2(" + c.join() + "));\n        }";

    for (u = 1; u < s.length; u++) {
      var f = s[u - 1];
      p += "\n        if (" + l + " < " + s[u] + "  && " + l + " >= " + s[u - 1] + ") {\n          return getChannel(\n            getT" + u + "(" + ya(i, l, f) + "),\n            vec2(" + ya(c, l, f) + "));\n        }";
    }

    var d = s.length,
        v = s[s.length - 1];
    p += "\n        return getChannel(\n          getT" + d + "(" + ya(i, l, v) + "),\n          vec2(" + ya(c, l, v) + "));", this.userCode = "\n      float getValue(" + i.map(function (t) {
      return "int " + t;
    }) + ") {\n        " + p + "\n      }\n\n      void main() {\n        " + o + " coords = getOutputCoords();\n        vec4 result = vec4(getValue(" + a + "), 0., 0., 0.);\n\n        " + a[r - 1] + " = " + a[r - 1] + " + 1;\n        if (" + a[r - 1] + " < " + n[r - 1] + ") {\n          result.g = getValue(" + a + ");\n        }\n\n        " + a[r - 2] + " = " + a[r - 2] + " + 1;\n        if (" + a[r - 2] + " < " + n[r - 2] + ") {\n          result.a = getValue(" + a + ");\n        }\n\n        " + a[r - 1] + " = " + a[r - 1] + " - 1;\n        if (" + a[r - 2] + " < " + n[r - 2] + " &&\n            " + a[r - 1] + " < " + n[r - 1] + ") {\n          result.b = getValue(" + a + ");\n        }\n        setOutput(result);\n      }\n    ";
  };
}();

function ya(t, e, n) {
  var r = t.indexOf(e);
  return t.map(function (t, e) {
    return e === r ? t + " - " + n : t;
  }).join();
}

var xa = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.padInfo.top,
        o = t.padInfo.left,
        a = "channelsLast" === t.dataFormat;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int d2 = coords.w;\n\n        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              if (" + a + ") {\n                float dyValue = getDy(b, yR, yC, d2);\n                float xValue = getX(b, xR, xC, d1);\n                dotProd += (xValue * dyValue);\n              } else {\n                float dyValue = getDy(b, d2, yR, yC);\n                float xValue = getX(b, d1, xR, xC);\n                dotProd += (xValue * dyValue);\n              }\n\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    ba = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = "channelsLast" === t.dataFormat,
        i = e - 1 - t.padInfo.top,
        s = n - 1 - t.padInfo.left,
        u = a ? 1 : 2,
        l = a ? 2 : 3,
        c = a ? 3 : 1;
    this.userCode = "\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[" + c + "];\n\n        ivec2 dyCorner = ivec2(coords[" + u + "], coords[" + l + "]) - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n\n              if (" + a + ") {\n                float xValue = getDy(batch, idyR, idyC, d2);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              } else {\n                float xValue = getDy(batch, d2, idyR, idyC);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    wa = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideDepth,
        n = t.strideHeight,
        r = t.strideWidth,
        o = t.padInfo.front,
        a = t.padInfo.top,
        i = t.padInfo.left;
    this.userCode = "\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int wF = coords.x;\n        int wR = coords.y;\n        int wC = coords.z;\n        int d1 = coords.w;\n        int d2 = coords.u;\n\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yF = 0; yF < " + t.outDepth + "; yF++) {\n            int xF = wF + yF * " + e + " - " + o + ";\n\n            if (xF < 0 || xF >= " + t.inDepth + ") {\n              continue;\n            }\n\n            for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n              int xR = wR + yR * " + n + " - " + a + ";\n\n              if (xR < 0 || xR >= " + t.inHeight + ") {\n                continue;\n              }\n\n              for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n                int xC = wC + yC * " + r + " - " + i + ";\n\n                if (xC < 0 || xC >= " + t.inWidth + ") {\n                  continue;\n                }\n\n                float dyValue = getDy(b, yF, yR, yC, d2);\n                float xValue = getX(b, xF, xR, xC, d1);\n                dotProd += (xValue * dyValue);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Ca = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterDepth,
        n = t.filterHeight,
        r = t.filterWidth,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = e - 1 - t.padInfo.front,
        u = n - 1 - t.padInfo.top,
        l = r - 1 - t.padInfo.left;
    this.userCode = "\n      const ivec3 pads = ivec3(" + s + ", " + u + ", " + l + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d1 = coords.u;\n\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyFCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + e + "; wF++) {\n          float dyF = float(dyFCorner + wF) / " + o + ".0;\n\n          if (dyF < 0.0 || dyF >= " + t.outDepth + ".0 || fract(dyF) > 0.0) {\n            continue;\n          }\n          int idyF = int(dyF);\n\n          int wFPerm = " + e + " - 1 - wF;\n\n          for (int wR = 0; wR < " + n + "; wR++) {\n            float dyR = float(dyRCorner + wR) / " + a + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n              fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            int wRPerm = " + n + " - 1 - wR;\n\n            for (int wC = 0; wC < " + r + "; wC++) {\n              float dyC = float(dyCCorner + wC) / " + i + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              int wCPerm = " + r + " - 1 - wC;\n\n              for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n                float xValue = getDy(batch, idyF, idyR, idyC, d2);\n                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Ea = function () {
  return function (t) {
    this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.padInfo.top,
        o = t.padInfo.left,
        a = t.outChannels / t.inChannels;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int dm = coords.w;\n        int d2 = d1 * " + a + " + dm;\n\n        float dotProd = 0.0;\n\n        // TO DO: Vec4 over the batch size\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Ra = function () {
  return function (t) {
    this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
    var e = t.filterHeight,
        n = t.filterWidth,
        r = t.strideHeight,
        o = t.strideWidth,
        a = e - 1 - t.padInfo.top,
        i = n - 1 - t.padInfo.left,
        s = t.outChannels / t.inChannels;
    this.userCode = "\n      const ivec2 pads = ivec2(" + a + ", " + i + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        float dotProd = 0.0;\n\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            // TO DO: Vec4 over the channelMul\n            for (int dm = 0; dm < " + s + "; dm++) {\n              int d2 = d1 * " + s + " + dm;\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, dm);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Ia = function () {
  return function (t, e, n, r) {
    void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var o = t.padInfo.top,
        a = t.padInfo.left,
        i = t.strideHeight,
        s = t.strideWidth,
        u = t.dilationHeight,
        l = t.dilationWidth,
        c = t.filterHeight,
        h = t.filterWidth,
        p = 4 * Math.floor(t.inChannels / 4),
        f = t.inChannels % 4,
        d = "channelsLast" === t.dataFormat,
        v = d ? 1 : 2,
        m = d ? 2 : 3,
        g = d ? 3 : 1,
        y = "",
        x = "";
    n && (y = r ? "float activation(float a) {\n          float b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "\n          float activation(float x) {\n            " + n + "\n          }\n        ", x = "result = activation(result);");
    var b = e ? "result += getBiasAtOutCoords();" : "";
    e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + y + "\n\n      const ivec2 strides = ivec2(" + i + ", " + s + ");\n      const ivec2 pads = ivec2(" + o + ", " + a + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d2 = coords[" + g + "];\n\n        ivec2 xRCCorner =\n            ivec2(coords[" + v + "], coords[" + m + "]) * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + c + "; wR++) {\n          int xR = xRCorner + wR * " + u + ";\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + h + "; wC++) {\n            int xC = xCCorner + wC * " + l + ";\n\n            if (xC < 0 || xC >= " + t.inWidth + ") {\n              continue;\n            }\n\n            for (int d1 = 0; d1 < " + p + "; d1 += 4) {\n              vec4 wValues = vec4(\n                getW(wR, wC, d1, d2),\n                getW(wR, wC, d1 + 1, d2),\n                getW(wR, wC, d1 + 2, d2),\n                getW(wR, wC, d1 + 3, d2)\n              );\n\n              if (" + d + ") {\n                vec4 xValues = vec4(\n                  getX(batch, xR, xC, d1),\n                  getX(batch, xR, xC, d1 + 1),\n                  getX(batch, xR, xC, d1 + 2),\n                  getX(batch, xR, xC, d1 + 3)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec4 xValues = vec4(\n                  getX(batch, d1, xR, xC),\n                  getX(batch, d1 + 1, xR, xC),\n                  getX(batch, d1 + 2, xR, xC),\n                  getX(batch, d1 + 3, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n            }\n\n            if (" + (1 === f) + ") {\n\n              if (" + d + ") {\n                dotProd +=\n                    getX(batch, xR, xC, " + p + ") *\n                    getW(wR, wC, " + p + ", d2);\n              } else {\n                dotProd +=\n                    getX(batch, " + p + ", xR, xC) *\n                    getW(wR, wC, " + p + ", d2);\n              }\n\n            } else if (" + (2 === f) + ") {\n              vec2 wValues = vec2(\n                getW(wR, wC, " + p + ", d2),\n                getW(wR, wC, " + p + " + 1, d2)\n              );\n\n              if (" + d + ") {\n                vec2 xValues = vec2(\n                  getX(batch, xR, xC, " + p + "),\n                  getX(batch, xR, xC, " + p + " + 1)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec2 xValues = vec2(\n                  getX(batch, " + p + ", xR, xC),\n                  getX(batch, " + p + " + 1, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n\n            } else if (" + (3 === f) + ") {\n              vec3 wValues = vec3(\n                getW(wR, wC, " + p + ", d2),\n                getW(wR, wC, " + p + " + 1, d2),\n                getW(wR, wC, " + p + " + 2, d2)\n              );\n\n              if (" + d + ") {\n                vec3 xValues = vec3(\n                  getX(batch, xR, xC, " + p + "),\n                  getX(batch, xR, xC, " + p + " + 1),\n                  getX(batch, xR, xC, " + p + " + 2)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec3 xValues = vec3(\n                  getX(batch, " + p + ", xR, xC),\n                  getX(batch, " + p + " + 1, xR, xC),\n                  getX(batch, " + p + " + 2, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n\n            }\n          }\n        }\n\n        float result = dotProd;\n        " + b + "\n        " + x + "\n        setOutput(result);\n      }\n    ";
  };
}(),
    ka = function () {
  return function (t) {
    this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var e = t.padInfo.front,
        n = t.padInfo.top,
        r = t.padInfo.left,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = t.dilationDepth,
        u = t.dilationHeight,
        l = t.dilationWidth,
        c = t.filterDepth,
        h = t.filterHeight,
        p = t.filterWidth,
        f = 4 * Math.floor(t.inChannels / 4),
        d = t.inChannels % 4;
    this.userCode = "\n      const ivec3 strides = ivec3(" + o + ", " + a + ", " + i + ");\n      const ivec3 pads = ivec3(" + e + ", " + n + ", " + r + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d2 = coords.u;\n\n        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n        int xFCorner = xFRCCorner.x;\n        int xRCorner = xFRCCorner.y;\n        int xCCorner = xFRCCorner.z;\n\n        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get\n        // y(yF, yR, yC, d2). ? = to be determined. : = across all\n        // values in that axis.\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + c + "; wF++) {\n          int xF = xFCorner + wF * " + s + ";\n\n          if (xF < 0 || xF >= " + t.inDepth + ") {\n            continue;\n          }\n\n          for (int wR = 0; wR < " + h + "; wR++) {\n            int xR = xRCorner + wR * " + u + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + p + "; wC++) {\n              int xC = xCCorner + wC * " + l + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              for (int d1 = 0; d1 < " + f + "; d1 += 4) {\n                vec4 xValues = vec4(\n                  getX(batch, xF, xR, xC, d1),\n                  getX(batch, xF, xR, xC, d1 + 1),\n                  getX(batch, xF, xR, xC, d1 + 2),\n                  getX(batch, xF, xR, xC, d1 + 3)\n                );\n                vec4 wValues = vec4(\n                  getW(wF, wR, wC, d1, d2),\n                  getW(wF, wR, wC, d1 + 1, d2),\n                  getW(wF, wR, wC, d1 + 2, d2),\n                  getW(wF, wR, wC, d1 + 3, d2)\n                );\n\n                dotProd += dot(xValues, wValues);\n              }\n\n              if (" + (1 === d) + ") {\n                dotProd +=\n                  getX(batch, xF, xR, xC, " + f + ") *\n                  getW(wF, wR, wC, " + f + ", d2);\n              } else if (" + (2 === d) + ") {\n                vec2 xValues = vec2(\n                  getX(batch, xF, xR, xC, " + f + "),\n                  getX(batch, xF, xR, xC, " + f + " + 1)\n                );\n                vec2 wValues = vec2(\n                  getW(wF, wR, wC, " + f + ", d2),\n                  getW(wF, wR, wC, " + f + " + 1, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              } else if (" + (3 === d) + ") {\n                vec3 xValues = vec3(\n                  getX(batch, xF, xR, xC, " + f + "),\n                  getX(batch, xF, xR, xC, " + f + " + 1),\n                  getX(batch, xF, xR, xC, " + f + " + 2)\n                );\n                vec3 wValues = vec3(\n                  getW(wF, wR, wC, " + f + ", d2),\n                  getW(wF, wR, wC, " + f + " + 1, d2),\n                  getW(wF, wR, wC, " + f + " + 2, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    Na = function () {
  return function (t, e, n, r) {
    void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.outputShape = t.outShape;
    var o = t.inHeight,
        a = t.inWidth,
        i = t.padInfo.top,
        s = t.padInfo.left,
        u = t.strideHeight,
        l = t.strideWidth,
        c = t.dilationHeight,
        h = t.dilationWidth,
        p = t.filterHeight,
        f = t.filterWidth,
        d = t.outChannels / t.inChannels,
        v = "",
        m = "";
    n && (v = r ? "float activation(float a) {\n          float b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "\n          float activation(float x) {\n            " + n + "\n          }\n        ", m = "result = activation(result);");
    var g = e ? "result += getBiasAtOutCoords();" : "";
    e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + v + "\n\n      const ivec2 strides = ivec2(" + u + ", " + l + ");\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2 / " + d + ";\n        int q = d2 - d1 * " + d + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < " + p + "; wR++) {\n          int xR = xRCorner + wR * " + c + ";\n\n          if (xR < 0 || xR >= " + o + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + f + "; wC++) {\n            int xC = xCCorner + wC * " + h + ";\n\n            if (xC < 0 || xC >= " + a + ") {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n\n        float result = dotProd;\n        " + g + "\n        " + m + "\n        setOutput(result);\n      }\n    ";
  };
}(),
    Sa = function () {
  return function (t, e, n, r) {
    void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.usesPackedTextures = !0, this.outputShape = t.outShape;

    for (var o = t.inHeight, a = t.inWidth, i = t.padInfo.top, s = t.padInfo.left, u = t.strideHeight, c = t.strideWidth, h = t.dilationHeight, p = t.dilationWidth, f = t.filterHeight, d = t.filterWidth, v = d, m = "int xR; int xC; int xCOffset;", g = 0; g < f; g++) for (var y = 0; y < d; y++) m += "\n          vec4 xTexelR" + g + "C" + 2 * y + " = vec4(0.);\n          vec4 wR" + g + "C" + y + " = vec4(0.);\n          vec4 xR" + g + "C" + y + " = vec4(0.);";

    for (g = 0; g < f; g++) for (var x = 0; x < v; x++) {
      if (m += "\n          xR = xRCorner + " + g * h + ";\n          xC = xCCorner + " + (y = 2 * x) * p + ";\n        ", 1 === c) {
        if (y < d && (m += s % 2 == 1 ? "\n                xCOffset = xC + 1;\n                if(xR >= 0 && xR < " + o + " && xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + y + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + g + "C" + y + " = vec4(0.);\n                }\n\n                xCOffset = xC + 1 - 2;\n                if(xR >= 0 && xR < " + o + " && xCOffset >= 0 && xCOffset < " + a + ") {\n                  vec4 previous = getX(batch, xR, xCOffset, d1);\n                  xR" + g + "C" + y + " = vec4(previous.zw, xTexelR" + g + "C" + y + ".xy);\n                } else {\n                  xR" + g + "C" + y + " = vec4(0, 0, xTexelR" + g + "C" + y + ".xy);\n                }\n              " : "\n                if(xR >= 0 && xR < " + o + " && xC >= 0 && xC < " + a + ") {\n                  xTexelR" + g + "C" + y + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + g + "C" + y + " = vec4(0.);\n                }\n\n                xR" + g + "C" + y + " = xTexelR" + g + "C" + y + ";\n              ", y + 1 < d)) {
          var b = s % 2 == 0 ? l(p) : p;
          p % 2 == 0 && s % 2 == 1 || p % 2 != 0 && s % 2 != 1 ? (m += "\n                  xCOffset = xC + " + s % 2 + " + " + b + ";\n\n                  if(xR >= 0 && xR < " + o + " &&\n                    xCOffset >= 0 && xCOffset < " + a + ") {\n                    xTexelR" + g + "C" + (y + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n                ", p > 1 && (m += "\n                    xCOffset -= 2;\n                    if(xR >= 0 && xR < " + o + " &&\n                      xCOffset >= 0 && xCOffset < " + a + ") {\n                      xTexelR" + g + "C" + y + " = getX(batch, xR, xCOffset, d1);\n                    } else {\n                      xTexelR" + g + "C" + y + " = vec4(0.);\n                    }\n                  "), m += "\n                  xR" + g + "C" + (y + 1) + " = vec4(\n                    xTexelR" + g + "C" + y + ".zw, xTexelR" + g + "C" + (y + 2) + ".xy);\n                ") : m += "\n                  xCOffset = xC + " + b + ";\n\n                  if(xR >= 0 && xR < " + o + " &&\n                    xCOffset >= 0 && xCOffset < " + a + ") {\n                    xTexelR" + g + "C" + (y + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n\n                  xR" + g + "C" + (y + 1) + " = xTexelR" + g + "C" + (y + 2) + ";\n                ";
        }
      } else y < d && (m += "\n              if(xR >= 0 && xR < " + o + ") {\n            ", s % 2 == 1 ? (m += "\n                xCOffset = xC + 1 - " + c + ";\n                if(xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + y + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + g + "C" + y + " = vec4(0.);\n                }\n\n                if(xC + 1 >= 0 && xC + 1 < " + a + ") {\n                  xTexelR" + g + "C" + (y + 2) + " = getX(batch, xR, xC + 1, d1);\n                } else {\n                  xTexelR" + g + "C" + (y + 2) + " = vec4(0.);\n                }\n\n                xR" + g + "C" + y + " = vec4(\n                  xTexelR" + g + "C" + y + ".zw, xTexelR" + g + "C" + (y + 2) + ".zw);\n              ", y + 1 < d && (m += "\n                  vec4 final = vec4(0.);\n                  xCOffset = xC + 1 + " + c + ";\n                  if(xCOffset >= 0 && xCOffset < " + a + ") {\n                    final = getX(batch, xR, xCOffset, d1);\n                  }\n                  xR" + g + "C" + (y + 1) + " = vec4(xTexelR" + g + "C" + (y + 2) + ".xy, final.xy);\n                ")) : (m += "\n                if(xC >= 0 && xC < " + a + ") {\n                  xTexelR" + g + "C" + y + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + g + "C" + y + " = vec4(0.);\n                }\n\n                xCOffset = xC + " + c + ";\n                if(xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + (y + 2) + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + g + "C" + (y + 2) + " = vec4(0.);\n                }\n\n                xR" + g + "C" + y + " = vec4(\n                  xTexelR" + g + "C" + y + ".xy, xTexelR" + g + "C" + (y + 2) + ".xy);\n              ", y + 1 < d && (m += "\n                  xR" + g + "C" + (y + 1) + " = vec4(\n                    xTexelR" + g + "C" + y + ".zw, xTexelR" + g + "C" + (y + 2) + ".zw);\n                ")), m += "}");

      y < d && (m += "\n            vec4 wTexelR" + g + "C" + y + " = getW(" + g + ", " + y + ", d1, q);\n            wR" + g + "C" + y + " = vec4(wTexelR" + g + "C" + y + ".xz, wTexelR" + g + "C" + y + ".xz);\n          ", y + 1 < d && (m += "\n              vec4 wTexelR" + g + "C" + (y + 1) + " = getW(" + g + ", " + (y + 1) + ", d1, q);\n              wR" + g + "C" + (y + 1) + " =\n                vec4(wTexelR" + g + "C" + (y + 1) + ".xz, wTexelR" + g + "C" + (y + 1) + ".xz);"));
    }

    for (g = 0; g < f; g++) for (y = 0; y < d; y++) m += "dotProd += xR" + g + "C" + y + " * wR" + g + "C" + y + ";";

    var w = "",
        C = "";
    n && (w = r ? "vec4 activation(vec4 a) {\n          vec4 b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "vec4 activation(vec4 x) {\n          " + n + "\n        }", C = "result = activation(result);");
    var E = e ? "result += getBiasAtOutCoords();" : "";
    e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + w + "\n\n      const ivec2 strides = ivec2(" + u + ", " + c + ");\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2;\n        int q = 0;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        vec4 dotProd = vec4(0.);\n\n        " + m + "\n\n        vec4 result = dotProd;\n        " + E + "\n        " + C + "\n        setOutput(result);\n      }\n    ";
  };
}(),
    Aa = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["Image", "Boxes", "BoxInd"], this.outputShape = [];
    var a = t[0],
        i = t[1],
        s = t[2],
        u = t[3],
        l = e[0],
        c = n[0],
        h = n[1];
    this.outputShape = [l, c, h, u];
    var p = "bilinear" === r ? 1 : 0,
        f = [i - 1 + ".0", s - 1 + ".0"],
        d = f[0],
        v = f[1],
        m = c > 1 ? ["" + (i - 1) / (c - 1), "(y2-y1) * height_ratio", "y1*" + d + " + float(y)*(height_scale)"] : ["0.0", "0.0", "0.5 * (y1+y2) * " + d],
        g = m[0],
        y = m[1],
        x = m[2],
        b = h > 1 ? ["" + (s - 1) / (h - 1), "(x2-x1) * width_ratio", "x1*" + v + " + float(x)*(width_scale)"] : ["0.0", "0.0", "0.5 * (x1+x2) * " + v],
        w = b[0],
        C = b[1],
        E = b[2];
    this.userCode = "\n      const float height_ratio = float(" + g + ");\n      const float width_ratio = float(" + w + ");\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int y = coords[1];\n        int x = coords[2];\n        int d = coords[3];\n\n        // get box vals\n        float y1 = getBoxes(b,0);\n        float x1 = getBoxes(b,1);\n        float y2 = getBoxes(b,2);\n        float x2 = getBoxes(b,3);\n\n        // get image in batch index\n        int bInd = round(getBoxInd(b));\n        if(bInd < 0 || bInd >= " + a + ") {\n          return;\n        }\n\n        float height_scale = " + y + ";\n        float width_scale = " + C + ";\n\n        float in_y = " + x + ";\n        if( in_y < 0.0 || in_y > " + d + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n        float in_x = " + E + ";\n        if( in_x < 0.0 || in_x > " + v + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n\n        vec2 sourceFracIndexCR = vec2(in_x,in_y);\n        if(" + p + " == 1) {\n          // Compute the four integer indices.\n          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);\n          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));\n\n          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);\n          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);\n          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);\n          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);\n\n          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);\n\n          float top = topLeft + (topRight - topLeft) * fracCR.x;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;\n          float newValue = top + (bottom - top) * fracCR.y;\n          setOutput(newValue);\n        } else {\n          // Compute the coordinators of nearest neighbor point.\n          ivec2 sourceNearestCR = ivec2(floor(\n            sourceFracIndexCR + vec2(0.5,0.5)));\n          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);\n          setOutput(newValue);\n        }\n      }\n    ";
  };
}(),
    Ta = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.outputShape = t;
    var r = t.length,
        o = t[t.length - 1],
        a = n ? "<" : ">";

    this.userCode = "\n      int getIndex(int i) {\n        " + (n ? "return " + o + " -i - 1;" : "return i;") + "\n      }\n\n      void main() {\n        " + Xo(r) + " coords = getOutputCoords();\n        int end = " + Da(r, "coords") + ";\n        float val = 0.0;\n        for (int i = " + o + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + a + " end) {\n            continue;\n          }\n          if (idx == end && " + e + ") {\n            continue;\n          }\n          " + Da(r, "coords") + " = idx;\n          val += getX(" + function (t, e) {
      if (1 === t) return "" + e;
      if (2 === t) return e + ".x, " + e + ".y";
      if (3 === t) return e + ".x, " + e + ".y, " + e + ".z";
      if (4 === t) return e + ".x, " + e + ".y, " + e + ".z, " + e + ".w";
      throw Error("Cumulative sum for rank " + t + " is not yet supported");
    }(r, "coords") + ");\n        }\n        setOutput(val);\n      }\n    ";
  };
}();

function Da(t, e) {
  if (1 === t) return "" + e;
  if (2 === t) return e + ".y";
  if (3 === t) return e + ".z";
  if (4 === t) return e + ".w";
  throw Error("Cumulative sum for rank " + t + " is not yet supported");
}

var _a = function () {
  return function (t, e) {
    this.variableNames = ["A"];
    var n = Bo();
    this.outputShape = t, this.userCode = "\n      ivec3 outCoordsFromFlatIndex(int index) {\n        " + Po(["r", "c", "d"], t) + "\n        return ivec3(r, c, d);\n      }\n\n      void main() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n          vec2(" + e[0] + ", " + e[1] + "));\n        int index = 4 * (resTexRC.x * " + e[1] + " + resTexRC.y);\n\n        vec4 result = vec4(0.);\n\n        for (int i=0; i<4; i++) {\n          int flatIndex = index + i;\n          ivec3 rc = outCoordsFromFlatIndex(flatIndex);\n          result[i] = getA(rc.x, rc.y, rc.z);\n        }\n\n        " + n.output + " = result;\n      }\n    ";
  };
}(),
    Oa = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0;
    var n = Bo();
    this.outputShape = t, this.userCode = "\n      ivec3 outCoordsFromFlatIndex(int index) {\n        " + Po(["r", "c", "d"], t) + "\n        return ivec3(r, c, d);\n      }\n\n      void main() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n          vec2(" + e[0] + ", " + e[1] + "));\n        int index = 4 * (resTexRC.x * " + e[1] + " + resTexRC.y);\n\n        vec4 result = vec4(0.);\n\n        for (int i=0; i<4; i++) {\n          int flatIndex = index + i;\n          ivec3 rc = outCoordsFromFlatIndex(flatIndex);\n          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));\n        }\n\n        " + n.output + " = result;\n      }\n    ";
  };
}(),
    Fa = function () {
  function t(t, e, n) {
    this.variableNames = ["x"], this.outputShape = [], this.outputShape = t, this.blockSize = e, this.dataFormat = n, this.userCode = "\n    void main() {\n      ivec4 coords = getOutputCoords();\n      int b = coords[0];\n      int h = " + this.getHeightCoordString() + ";\n      int w = " + this.getWidthCoordString() + ";\n      int d = " + this.getDepthCoordString() + ";\n\n      int in_h = h / " + e + ";\n      int offset_h = imod(h, " + e + ");\n      int in_w = w / " + e + ";\n      int offset_w = imod(w, " + e + ");\n      int offset_d = (offset_h * " + e + " + offset_w) *\n        " + this.getOutputDepthSize() + ";\n      int in_d = d + offset_d;\n\n      float result = " + this.getInputSamplingString() + ";\n      setOutput(result);\n    }\n  ";
  }

  return t.prototype.getHeightCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[1]" : "coords[2]";
  }, t.prototype.getWidthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[2]" : "coords[3]";
  }, t.prototype.getDepthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[3]" : "coords[1]";
  }, t.prototype.getOutputDepthSize = function () {
    return "NHWC" === this.dataFormat ? this.outputShape[3] : this.outputShape[1];
  }, t.prototype.getInputSamplingString = function () {
    return "NHWC" === this.dataFormat ? "getX(b, in_h, in_w, in_d)" : "getX(b, in_d, in_h, in_w)";
  }, t;
}(),
    Ma = function () {
  return function (t) {
    this.variableNames = ["X"], this.outputShape = [t, t], this.userCode = "\n      void main() {\n          ivec2 coords = getOutputCoords();\n          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;\n          setOutput(val);\n      }\n    ";
  };
}(),
    Ba = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = Bo();
    this.outputShape = t, this.userCode = "\n      " + Wo + "\n\n      void main() {\n        float x = getAAtOutCoords();\n        " + e.output + " = encode_float(x);\n      }\n    ";
  };
}(),
    Pa = function () {
  return function (t) {
    this.variableNames = ["A"], this.usesPackedTextures = !0;
    var e = Bo();
    this.outputShape = t, this.userCode = "\n      " + Wo + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));\n        " + e.output + " = encode_float(x);\n      }\n    ";
  };
}(),
    La = function () {
  return function (t, e, n) {
    void 0 === n && (n = !1), this.variableNames = ["A"];
    var r = Bo(),
        o = e[0],
        a = e[1];
    this.outputShape = t;
    var i = "result";
    n && (i = "floor(result * 255. + 0.5)"), this.userCode = "\n      " + Lo(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        int flatIndex = getFlatIndex(coords);\n        int offset = imod(flatIndex, 4);\n\n        flatIndex = idiv(flatIndex, 4, 1.);\n        \n        int r = flatIndex / " + a + ";\n        int c = imod(flatIndex, " + a + ");\n        vec2 uv = (vec2(c, r) + halfCR) / vec2(" + a + ".0, " + o + ".0);\n        vec4 values = " + r.texture2D + "(A, uv);\n\n        float result;\n\n        if(offset == 0) {\n          result = values[0];\n        } else if(offset == 1) {\n          result = values[1];\n        } else if(offset == 2) {\n          result = values[2];\n        } else {\n          result = values[3];\n        }\n\n        " + r.output + " = vec4(" + i + ", 0., 0., 0.);\n      }\n    ";
  };
}(),
    Wa = function () {
  return function (t, e, n) {
    void 0 === n && (n = !1), this.variableNames = ["A"];
    var r = Bo(),
        o = e[0],
        a = e[1];
    this.outputShape = t;
    var i = "",
        s = "result";
    n && (s = "floor(result * 255. + 0.5)");

    for (var u = 0; u <= 1; u++) for (var l = 0; l <= 1; l++) {
      var c = 2 * u + l;
      i += "\n          localCoords = coords;\n          if(localCoords[2] + " + l + " < " + t[2] + ") {\n            localCoords[2] += " + l + ";\n            if(localCoords[1] + " + u + " < " + t[1] + ") {\n              localCoords[1] += " + u + ";\n\n              flatIndex = getFlatIndex(localCoords);\n              offset = imod(flatIndex, 4);\n    \n              flatIndex = idiv(flatIndex, 4, 1.);\n\n              r = flatIndex / " + a + ";\n              c = imod(flatIndex, " + a + ");\n              uv = (vec2(c, r) + halfCR) / vec2(" + a + ".0, " + o + ".0);\n              values = " + r.texture2D + "(A, uv);\n\n              if(offset == 0) {\n                result[" + c + "] = values[0];\n              } else if(offset == 1) {\n                result[" + c + "] = values[1];\n              } else if(offset == 2) {\n                result[" + c + "] = values[2];\n              } else {\n                result[" + c + "] = values[3];\n              }\n            }\n          }\n        ";
    }

    this.userCode = "\n      " + Lo(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        vec4 result = vec4(0.);\n        int flatIndex, r, c, offset;\n        ivec3 localCoords;\n        vec2 uv;\n        vec4 values;\n        \n        " + i + "\n\n        " + r.output + " = " + s + ";\n      }\n    ";
  };
}(),
    Ua = "return real * expR - imag * expI;",
    Va = "return real * expI + imag * expR;",
    za = function () {
  return function (t, e, n) {
    this.variableNames = ["real", "imag"];
    var r = e[1];
    this.outputShape = e;
    var o = n ? "2.0 * " + Math.PI : "-2.0 * " + Math.PI,
        a = n ? r + ".0" : "1.0";
    this.userCode = "\n      const float exponentMultiplier = " + o + ";\n\n      float unaryOpComplex(float real, float expR, float imag, float expI) {\n        " + t + "\n      }\n\n      float mulMatDFT(int batch, int index) {\n        float indexRatio = float(index) / float(" + r + ");\n        float exponentMultiplierTimesIndexRatio =\n            exponentMultiplier * indexRatio;\n\n        float result = 0.0;\n\n        for (int i = 0; i < " + r + "; i++) {\n          // x = (-2|2 * PI / N) * index * i;\n          float x = exponentMultiplierTimesIndexRatio * float(i);\n          float expR = cos(x);\n          float expI = sin(x);\n          float real = getReal(batch, i);\n          float imag = getImag(batch, i);\n\n          result +=\n              unaryOpComplex(real, expR, imag, expI) / " + a + ";\n        }\n\n        return result;\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        setOutput(mulMatDFT(coords[0], coords[1]));\n      }\n    ";
  };
}(),
    Ga = function () {
  function t(t, e) {
    this.outputShape = [], this.variableNames = ["x"], this.outputShape = t, this.userCode = "\n      uniform float value;\n      void main() {\n        // Input can be obtained from uniform value.\n        setOutput(value);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.valueLoc && (e.valueLoc = n.getUniformLocationNoThrow(r, "value")), n.gl.uniform1f(e.valueLoc, t);
    };
  }, t;
}(),
    Ha = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = Bo(),
        n = t[0],
        r = t[1];
    this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + r + ".0, " + n + ".0);\n\n        vec4 values = " + e.texture2D + "(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
  };
}(),
    qa = function () {
  return function (t) {
    this.variableNames = ["A"];
    var e = Bo(),
        n = t[0],
        r = t[1];
    this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n\n        vec4 result = vec4(0.);\n\n        for(int row=0; row<=1; row++) {\n          for(int col=0; col<=1; col++) {\n            texC = coords[1] + row;\n            depth = coords[2] + col;\n\n            vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + r + ".0, " + n + ".0);\n            vec4 values = " + e.texture2D + "(A, uv);\n            float value;\n            if (depth == 0) {\n              value = values.r;\n            } else if (depth == 1) {\n              value = values.g;\n            } else if (depth == 2) {\n              value = values.b;\n            } else if (depth == 3) {\n              value = values.a;\n            }\n\n            result[row * 2 + col] = floor(value * 255.0 + 0.5);\n          }\n        }\n\n        " + e.output + " = result;\n      }\n    ";
  };
}(),
    $a = function () {
  return function (t, e, n) {
    this.variableNames = ["A", "indices"];
    var r = t.slice();
    r[n] = e, this.outputShape = r, this.rank = r.length;

    var o = Xo(this.rank),
        a = function (t, e) {
      var n = t.length;
      if (n > 4) throw Error("Gather for rank " + n + " is not yet supported");
      if (1 === n) return "int(getIndices(resRC))";

      for (var r = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], o = [], a = 0; a < t.length; a++) a === e ? o.push("int(getIndices(" + r[a] + "))") : o.push("" + r[a]);

      return o.join();
    }(t, n);

    this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
  };
}();

var Ka = function () {
  return function (t, e, n) {
    this.sliceDim = t, this.strides = e, this.variableNames = ["x", "indices"], this.outputShape = n;
    var r = Xo(e.length),
        o = Xo(n.length),
        a = this.sliceDim > 1 ? "strides[j]" : "strides";
    this.userCode = "\n        " + r + " strides = " + r + "(" + this.strides + ");\n         void main() {\n          " + o + " coords = getOutputCoords();\n          int flattenIndex = 0;\n          for (int j = 0; j < " + this.sliceDim + "; j++) {\n            int index = round(getIndices(coords[0], j));\n            flattenIndex += index * " + a + ";\n          }\n          setOutput(getX(flattenIndex, coords[1]));\n        }\n      ";
  };
}();

function ja(t, e) {
  var n = Bo();
  return $t(t, e, n.version + "\n    precision highp float;\n    " + n.attribute + " vec3 clipSpacePos;\n    " + n.attribute + " vec2 uv;\n    " + n.varyingVs + " vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }");
}

function Xa(t, e) {
  return te(t, e, new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]));
}

function Ya(t, e) {
  return ee(t, e, new Uint16Array([0, 1, 2, 2, 1, 3]));
}

function Qa(t, e, n, r, o, a, i) {
  re(n, r);
  var s = ne(t, e),
      u = t.TEXTURE_2D;
  return Ut(t, e, function () {
    return t.bindTexture(u, s);
  }), Ut(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE);
  }), Ut(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }), Ut(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MIN_FILTER, t.NEAREST);
  }), Ut(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MAG_FILTER, t.NEAREST);
  }), Ut(t, e, function () {
    return t.texImage2D(u, 0, o, n, r, 0, a, i, null);
  }), Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  }), s;
}

function Ja(t, e, n, r, o) {
  var a = Bt(n, r);
  return Qa(t, e, a[0], a[1], o.internalFormatFloat, o.textureFormatFloat, t.FLOAT);
}

function Za(t, e, n, r, o) {
  var a = Bt(n, r);
  return Qa(t, e, a[0], a[1], o.internalFormatHalfFloat, o.textureFormatFloat, o.textureTypeHalfFloat);
}

function ti(t, e, n, r, o) {
  var a = Bt(n, r);
  return Qa(t, e, a[0], a[1], t.RGBA, t.RGBA, t.UNSIGNED_BYTE);
}

function ei(t, e, n, r, o) {
  var a = Lt(n, r);
  return Qa(t, e, a[0], a[1], o.internalFormatPackedFloat, t.RGBA, t.FLOAT);
}

function ni(t, e, n, r, o) {
  var a = Lt(n, r);
  return Qa(t, e, a[0], a[1], o.internalFormatPackedHalfFloat, t.RGBA, o.textureTypeHalfFloat);
}

function ri(t, e, n, r) {
  return Ut(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), ae(t, e, n, "clipSpacePos", r, 3, 20, 0) && ae(t, e, n, "uv", r, 2, 20, 12);
}

function oi(t, e, n, r, o, a, i) {
  var s, u, l;
  Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  }), a instanceof Uint8Array ? (s = new Uint8Array(r * o * 4), u = t.UNSIGNED_BYTE, l = t.RGBA) : (s = new Float32Array(r * o * 4), u = t.FLOAT, l = i.internalFormatPackedFloat), s.set(a), Ut(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, l, r, o, 0, t.RGBA, u, s);
  }), Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function ai(t, e, n, r) {
  Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  }), r.data instanceof Uint8Array ? Ut(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, r.width, r.height, 0, t.RGBA, t.UNSIGNED_BYTE, r.data);
  }) : Ut(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r);
  }), Ut(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function ii(t, e, n, r, o) {
  var a = t.createBuffer();
  Ut(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, a);
  });
  var i = 16 * n * r;
  return Ut(t, e, function () {
    return t.bufferData(t.PIXEL_PACK_BUFFER, i, t.STREAM_READ);
  }), Ut(t, e, function () {
    return t.readPixels(0, 0, r, n, t.RGBA, t.FLOAT, 0);
  }), Ut(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, null);
  }), a;
}

function si(t, e, n) {
  var r = t,
      o = new Float32Array(n);
  return r.bindBuffer(r.PIXEL_PACK_BUFFER, e), r.getBufferSubData(r.PIXEL_PACK_BUFFER, 0, o), r.bindBuffer(r.PIXEL_PACK_BUFFER, null), o;
}

function ui(t, e, n, r, o) {
  var a = Bt(n, r),
      i = a[0],
      s = a[1],
      u = new Uint8Array(n * r * 4);
  return Ut(t, e, function () {
    return t.readPixels(0, 0, i, s, o.downloadTextureFormat, t.UNSIGNED_BYTE, u);
  }), new Float32Array(u.buffer);
}

function li(t, e, n, r, o, a, i, s) {
  var u = t,
      l = new Float32Array(function (t, e) {
    var n = Lt(t, e);
    return n[0] * n[1] * 4;
  }(a, i));
  return u.bindBuffer(u.PIXEL_PACK_BUFFER, e), u.getBufferSubData(u.PIXEL_PACK_BUFFER, 0, l), u.bindBuffer(u.PIXEL_PACK_BUFFER, null), l;
}

function ci(t, e, n, r) {
  var o = new Float32Array(n * r * 4);
  return Ut(t, e, function () {
    return t.readPixels(0, 0, r, n, t.RGBA, t.FLOAT, o);
  }), o;
}

var hi = Object.freeze({
  createVertexShader: ja,
  createVertexBuffer: Xa,
  createIndexBuffer: Ya,
  createFloat32MatrixTexture: Ja,
  createFloat16MatrixTexture: Za,
  createUnsignedBytesMatrixTexture: ti,
  createPackedMatrixTexture: ei,
  createFloat16PackedMatrixTexture: ni,
  bindVertexProgramAttributeStreams: ri,
  uploadDenseMatrixToTexture: oi,
  uploadPixelDataToTexture: ai,
  createBufferFromOutputTexture: ii,
  downloadFloat32MatrixFromBuffer: si,
  downloadByteEncodedFloatMatrixFromOutputTexture: ui,
  downloadPackedMatrixFromBuffer: li,
  downloadMatrixFromPackedOutputTexture: ci
}),
    pi = function () {
  function t(t) {
    this.outputTexture = null, this.program = null, this.disposed = !1, this.vertexAttrsAreBound = !1, this.itemsToPoll = [];
    var e = a().getNumber("WEBGL_VERSION");
    if (null != t ? (this.gl = t, Ot(e, t)) : this.gl = Ft(e), 1 === a().getNumber("WEBGL_VERSION")) this.textureFloatExtension = qt(this.gl, this.debug, "OES_texture_float"), this.colorBufferFloatExtension = this.gl.getExtension("WEBGL_color_buffer_float"), this.textureHalfFloatExtension = qt(this.gl, this.debug, "OES_texture_half_float"), this.colorBufferHalfFloatExtension = this.gl.getExtension("EXT_color_buffer_half_float");else {
      if (Ie(this.gl, "EXT_color_buffer_float")) this.colorBufferFloatExtension = this.gl.getExtension("EXT_color_buffer_float");else {
        if (!Ie(this.gl, "EXT_color_buffer_half_float")) throw new Error("GL context does not support color renderable floats");
        this.colorBufferHalfFloatExtension = this.gl.getExtension("EXT_color_buffer_half_float");
      }
    }
    this.vertexBuffer = Xa(this.gl, this.debug), this.indexBuffer = Ya(this.gl, this.debug), this.framebuffer = oe(this.gl, this.debug), this.textureConfig = Wt(this.gl, this.textureHalfFloatExtension);
  }

  return Object.defineProperty(t.prototype, "debug", {
    get: function () {
      return a().getBool("DEBUG");
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.dispose = function () {
    var t = this;

    if (!this.disposed) {
      null != this.program && console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."), null != this.outputTexture && console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");
      var e = this.gl;
      Ut(e, this.debug, function () {
        return e.finish();
      }), Ut(e, this.debug, function () {
        return e.bindFramebuffer(e.FRAMEBUFFER, null);
      }), Ut(e, this.debug, function () {
        return e.deleteFramebuffer(t.framebuffer);
      }), Ut(e, this.debug, function () {
        return e.bindBuffer(e.ARRAY_BUFFER, null);
      }), Ut(e, this.debug, function () {
        return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
      }), Ut(e, this.debug, function () {
        return e.deleteBuffer(t.indexBuffer);
      }), this.disposed = !0;
    }
  }, t.prototype.createFloat32MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), Ja(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createFloat16MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), Za(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createUnsignedBytesMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), ti(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.uploadPixelDataToTexture = function (t, e) {
    this.throwIfDisposed(), ai(this.gl, this.debug, t, e);
  }, t.prototype.uploadDenseMatrixToTexture = function (t, e, n, r) {
    this.throwIfDisposed(), oi(this.gl, this.debug, t, e, n, r, this.textureConfig);
  }, t.prototype.createFloat16PackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), ni(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createPackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), ei(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.deleteMatrixTexture = function (t) {
    var e = this;
    this.throwIfDisposed(), this.outputTexture === t && (he(this.gl, this.debug, this.framebuffer), this.outputTexture = null), Ut(this.gl, this.debug, function () {
      return e.gl.deleteTexture(t);
    });
  }, t.prototype.downloadByteEncodedFloatMatrixFromOutputTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return ui(r.gl, r.debug, e, n, r.textureConfig);
    });
  }, t.prototype.downloadPackedMatrixFromBuffer = function (t, e, n, r, o, a) {
    return li(this.gl, t, 0, 0, 0, o, a, this.textureConfig);
  }, t.prototype.downloadFloat32MatrixFromBuffer = function (t, e) {
    return si(this.gl, t, e);
  }, t.prototype.createBufferFromTexture = function (t, e, n) {
    this.bindTextureToFrameBuffer(t);
    var r = ii(this.gl, this.debug, e, n, this.textureConfig);
    return this.unbindTextureToFrameBuffer(), r;
  }, t.prototype.createAndWaitForFence = function () {
    var t = this.createFence(this.gl);
    return this.pollFence(t);
  }, t.prototype.createFence = function (t) {
    var e,
        n,
        r = this;

    if (a().getBool("WEBGL_FENCE_API_ENABLED")) {
      var o = t,
          i = o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE, 0);
      t.flush(), n = function () {
        var t = o.clientWaitSync(i, 0, 0);
        return t === o.ALREADY_SIGNALED || t === o.CONDITION_SATISFIED;
      }, e = i;
    } else a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? (e = this.beginQuery(), this.endQuery(), n = function () {
      return r.isQueryAvailable(e, a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
    }) : n = function () {
      return !0;
    };

    return {
      query: e,
      isFencePassed: n
    };
  }, t.prototype.downloadMatrixFromPackedTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return ci(r.gl, r.debug, e, n);
    });
  }, t.prototype.createProgram = function (t) {
    this.throwIfDisposed();
    var e = this.gl,
        n = Kt(e, this.debug, t),
        r = ja(e, this.debug),
        o = Qt(e, this.debug);
    return Ut(e, this.debug, function () {
      return e.attachShader(o, r);
    }), Ut(e, this.debug, function () {
      return e.attachShader(o, n);
    }), Jt(e, this.debug, o), this.debug && Zt(e, this.debug, o), this.vertexAttrsAreBound || (this.setProgram(o), this.vertexAttrsAreBound = ri(e, this.debug, this.program, this.vertexBuffer)), o;
  }, t.prototype.deleteProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), t === this.program && (this.program = null), null != t && Ut(this.gl, this.debug, function () {
      return e.gl.deleteProgram(t);
    });
  }, t.prototype.setProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), this.program = t, null != this.program && this.debug && Zt(this.gl, this.debug, this.program), Ut(this.gl, this.debug, function () {
      return e.gl.useProgram(t);
    });
  }, t.prototype.getUniformLocation = function (t, e, n) {
    return void 0 === n && (n = !0), this.throwIfDisposed(), n ? se(this.gl, this.debug, t, e) : ue(this.gl, t, e);
  }, t.prototype.getAttributeLocation = function (t, e) {
    var n = this;
    return this.throwIfDisposed(), Ut(this.gl, this.debug, function () {
      return n.gl.getAttribLocation(t, e);
    });
  }, t.prototype.getUniformLocationNoThrow = function (t, e) {
    return this.throwIfDisposed(), this.gl.getUniformLocation(t, e);
  }, t.prototype.setInputMatrixTexture = function (t, e, n) {
    this.throwIfDisposed(), this.throwIfNoProgram(), le(this.gl, this.debug, this.program, t, e, n);
  }, t.prototype.setOutputMatrixTexture = function (t, e, n) {
    this.setOutputMatrixTextureDriver(t, n, e);
  }, t.prototype.setOutputPackedMatrixTexture = function (t, e, n) {
    this.throwIfDisposed();
    var r = Lt(e, n),
        o = r[0],
        a = r[1];
    this.setOutputMatrixTextureDriver(t, o, a);
  }, t.prototype.setOutputMatrixWriteRegion = function (t, e, n, r) {
    this.setOutputMatrixWriteRegionDriver(n, t, r, e);
  }, t.prototype.setOutputPackedMatrixWriteRegion = function (t, e, n, r) {
    throw new Error("setOutputPackedMatrixWriteRegion not implemented.");
  }, t.prototype.debugValidate = function () {
    null != this.program && Zt(this.gl, this.debug, this.program), pe(this.gl);
  }, t.prototype.executeProgram = function () {
    this.throwIfDisposed(), this.throwIfNoProgram();
    var t = this.gl;
    this.debug && this.debugValidate(), Ut(t, this.debug, function () {
      return t.drawElements(t.TRIANGLES, 6, t.UNSIGNED_SHORT, 0);
    });
  }, t.prototype.blockUntilAllProgramsCompleted = function () {
    var t = this;
    this.throwIfDisposed(), Ut(this.gl, this.debug, function () {
      return t.gl.finish();
    });
  }, t.prototype.getQueryTimerExtension = function () {
    return null == this.disjointQueryTimerExtension && (this.disjointQueryTimerExtension = qt(this.gl, this.debug, 2 === a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") ? "EXT_disjoint_timer_query_webgl2" : "EXT_disjoint_timer_query")), this.disjointQueryTimerExtension;
  }, t.prototype.getQueryTimerExtensionWebGL2 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.getQueryTimerExtensionWebGL1 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.beginQuery = function () {
    if (2 === a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.gl,
          e = this.getQueryTimerExtensionWebGL2(),
          n = t.createQuery();
      return t.beginQuery(e.TIME_ELAPSED_EXT, n), n;
    }

    var r = this.getQueryTimerExtensionWebGL1(),
        o = r.createQueryEXT();
    return r.beginQueryEXT(r.TIME_ELAPSED_EXT, o), o;
  }, t.prototype.endQuery = function () {
    if (2 !== a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.getQueryTimerExtensionWebGL1();
      t.endQueryEXT(t.TIME_ELAPSED_EXT);
    } else {
      var e = this.gl,
          n = this.getQueryTimerExtensionWebGL2();
      e.endQuery(n.TIME_ELAPSED_EXT);
    }
  }, t.prototype.waitForQueryAndGetTime = function (t) {
    return n(this, void 0, void 0, function () {
      var e = this;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, w(function () {
              return e.disposed || e.isQueryAvailable(t, a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
            })];

          case 1:
            return n.sent(), [2, this.getQueryTime(t, a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))];
        }
      });
    });
  }, t.prototype.getQueryTime = function (t, e) {
    if (0 === e) return null;

    if (2 === e) {
      var n = this.gl;
      return n.getQueryParameter(t, n.QUERY_RESULT) / 1e6;
    }

    var r = this.getQueryTimerExtensionWebGL1();
    return r.getQueryObjectEXT(t, r.QUERY_RESULT_EXT) / 1e6;
  }, t.prototype.isQueryAvailable = function (t, e) {
    if (0 === e) return !0;

    if (2 === e) {
      var n = this.gl,
          r = this.getQueryTimerExtensionWebGL2(),
          o = n.getQueryParameter(t, n.QUERY_RESULT_AVAILABLE);
      return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
    }

    o = (r = this.getQueryTimerExtensionWebGL1()).getQueryObjectEXT(t, r.QUERY_RESULT_AVAILABLE_EXT);
    return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
  }, t.prototype.pollFence = function (t) {
    var e = this;
    return new Promise(function (n) {
      e.addItemToPoll(function () {
        return t.isFencePassed();
      }, function () {
        return n();
      });
    });
  }, t.prototype.pollItems = function () {
    for (var t = function (t) {
      for (var e = 0; e < t.length; ++e) {
        var n = t[e]();
        if (!n) break;
      }

      return e - 1;
    }(this.itemsToPoll.map(function (t) {
      return t.isDoneFn;
    })), e = 0; e <= t; ++e) {
      (0, this.itemsToPoll[e].resolveFn)();
    }

    this.itemsToPoll = this.itemsToPoll.slice(t + 1);
  }, t.prototype.addItemToPoll = function (t, e) {
    var n = this;
    this.itemsToPoll.push({
      isDoneFn: t,
      resolveFn: e
    }), this.itemsToPoll.length > 1 || w(function () {
      return n.pollItems(), 0 === n.itemsToPoll.length;
    });
  }, t.prototype.bindTextureToFrameBuffer = function (t) {
    this.throwIfDisposed(), ce(this.gl, this.debug, t, this.framebuffer), this.debug && pe(this.gl);
  }, t.prototype.unbindTextureToFrameBuffer = function () {
    null != this.outputTexture ? (ce(this.gl, this.debug, this.outputTexture, this.framebuffer), this.debug && pe(this.gl)) : he(this.gl, this.debug, this.framebuffer);
  }, t.prototype.downloadMatrixDriver = function (t, e) {
    this.bindTextureToFrameBuffer(t);
    var n = e();
    return this.unbindTextureToFrameBuffer(), n;
  }, t.prototype.setOutputMatrixTextureDriver = function (t, e, n) {
    this.throwIfDisposed();
    var r = this.gl;
    ce(r, this.debug, t, this.framebuffer), this.debug && pe(r), this.outputTexture = t, Ut(r, this.debug, function () {
      return r.viewport(0, 0, e, n);
    }), Ut(r, this.debug, function () {
      return r.scissor(0, 0, e, n);
    });
  }, t.prototype.setOutputMatrixWriteRegionDriver = function (t, e, n, r) {
    var o = this;
    this.throwIfDisposed(), Ut(this.gl, this.debug, function () {
      return o.gl.scissor(t, e, n, r);
    });
  }, t.prototype.throwIfDisposed = function () {
    if (this.disposed) throw new Error("Attempted to use disposed GPGPUContext.");
  }, t.prototype.throwIfNoProgram = function () {
    if (null == this.program) throw new Error("No GPU program is currently set.");
  }, t;
}();

function fi(t, e) {
  if (t.length !== e.length) throw Error("Binary was compiled with " + t.length + " inputs, but was executed with " + e.length + " inputs");
  t.forEach(function (t, n) {
    var r = t.logicalShape,
        o = e[n],
        a = o.shape;
    if (!m(r, a)) throw Error("Binary was compiled with different shapes than the current args. Shapes " + r + " and " + a + " must match");

    if (!t.isUniform || !o.isUniform) {
      var i = t.texShape,
          s = o.isUniform ? null : o.texData.texShape;
      if (!m(i, s)) throw Error("Binary was compiled with different texture shapes than the current args. Shape " + i + " and " + s + " must match");
    }
  });
}

var di = function () {
  return function (t, e, n) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;

    for (var r = n.filterWidth, o = n.inChannels, a = n.strideWidth, i = n.strideHeight, s = n.padInfo, u = n.outWidth, l = n.dilationWidth, c = n.dilationHeight, h = n.dataFormat, p = s.left, f = s.top, d = o * r, v = Bo(), m = "channelsLast" === h, g = m ? 0 : 1, y = m ? 1 : 2, x = "", b = 0; b <= 1; b++) for (var w = 0; w <= 1; w++) x += "\n          blockIndex = rc.y + " + w + ";\n          pos = rc.x + " + b + ";\n\n          if(blockIndex < " + t[1] + " && pos < " + t[0] + ") {\n            offsetY = int(blockIndex / (" + u + ")) * " + i + " - " + f + ";\n            d0 = offsetY + " + c + " * (pos / " + d + ");\n\n            if(d0 < " + e[g] + " && d0 >= 0) {\n\n              offsetX = int(mod(float(blockIndex), " + u + ".) * " + a + ". - " + p + ".);\n              d1 = offsetX + " + l + " * (int(mod(float(pos), " + d + ".) / " + o + ".));\n\n              if(d1 < " + e[y] + " && d1 >= 0) {\n\n                ch = int(mod(float(pos), " + o + ".));\n\n                if (" + m + ") {\n                  innerDims = vec2(d1, ch);\n                  result[" + (2 * b + w) + "] = getChannel(\n                    getA(d0, int(innerDims.x),\n                    int(innerDims.y)), innerDims);\n                } else {\n                  innerDims = vec2(d0, d1);\n                  result[" + (2 * b + w) + "] = getChannel(\n                    getA(ch, int(innerDims.x),\n                    int(innerDims.y)), innerDims);\n                }\n              }\n            }\n          }\n        ";

    this.userCode = "\n      void main() {\n        ivec2 rc = getOutputCoords();\n\n        vec4 result = vec4(0);\n\n        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;\n        vec2 innerDims;\n\n        " + x + "\n\n        " + v.output + " = result;\n      }\n    ";
  };
}(),
    vi = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["x"], this.outputShape = [];
    var a,
        i = e,
        s = t[3] - 1;
    this.outputShape = t;
    var u = "float(" + n + ") + float(" + r + ") * sum";
    a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n        int d = coords[3];\n        float x = getX(b, r, c, d);\n        float sum = 0.0;\n        for (int j = -" + i + "; j <= " + i + "; j++) {\n          int idx = d + j;\n          if (idx >= 0 && idx <=  " + s + ") {\n            float z = getX(b, r, c, idx);\n            sum += z * z;\n          }\n        }\n        float val = x * " + a + ";\n        setOutput(val);\n      }\n    ";
  };
}(),
    mi = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["inputImage", "outputImage", "dy"], this.outputShape = [], this.outputShape = t, this.depth = t[3], this.depthRadius = e, this.bias = n, this.alpha = r, this.beta = o, this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n\n        float result = 0.0;\n        for (int d = 0; d < " + this.depth + "; ++d) {\n          int depthBegin = int(max(0.0, float(d - " + e + ")));\n          int depthEnd = int(min(float(" + this.depth + "),\n              float(d + " + e + " + 1)));\n\n          const int MIN_DEPTH_BEGIN = 0;\n          const int MAX_DEPTH_END = " + this.depth + ";\n\n          float norm = 0.0;\n          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd) {\n              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);\n            }\n            else {\n              break;\n            }\n          }\n\n          norm = float(" + r + ") * norm + float(" + n + ");\n\n          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd){\n              float dyi = -2.0 * float(" + r + ")\n                * float(" + o + ")\n                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)\n                / norm;\n              if (k == d) {\n                dyi += pow(norm, -1.0 * " + o + ");\n              }\n              if (k == coords[3]) {\n                dyi *= getDy(b, r, c, d);\n                result += dyi;\n              }\n            }\n            else {\n              break;\n            }\n          }\n      }\n      setOutput(result);\n      }\n    ";
  };
}(),
    gi = function () {
  return function (t, e, n, r, o) {
    this.variableNames = ["x"], this.outputShape = [], this.usesPackedTextures = !0;
    var a,
        i = e,
        s = t[3] - 1;
    this.outputShape = t;
    var u = "float(" + n + ") + float(" + r + ") * sum";
    a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords.x;\n        int r = coords.y;\n        int c = coords.z;\n        int d = coords.w;\n\n        bool hasNextCol = d < " + this.outputShape[3] + ";\n        bool hasNextRow = c < " + this.outputShape[2] + ";\n\n        vec4 sum = vec4(0.);\n        vec4 xFragAtOutputCoords = getX(b, r, c, d);\n\n        vec4 xAtOutputCoords = vec4(\n          getChannel(xFragAtOutputCoords, vec2(c, d)),\n          hasNextCol ?\n            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,\n          hasNextRow ?\n            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0\n        );\n\n        int firstChannel = d - " + i + ";\n        vec2 cache = vec2(0.);\n        if(firstChannel >= 0){\n          vec4 firstChannelFrag = getX(b, r, c, firstChannel);\n          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));\n            if(hasNextRow){\n              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));\n            }\n        }\n\n        ivec2 depth = ivec2(d, d + 1);\n        for (int j = - " + i + "; j <= " + i + "; j++) {\n          ivec2 idx = depth + j;\n          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));\n          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(" + s + "));\n\n          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;\n          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;\n\n          if(depthInRange || depthPlusOneInRange){\n            vec4 z = vec4(0.);\n            vec4 xFragAtCurrentDepth;\n            z.xz = cache.xy;\n            if(depthPlusOneInRange && hasNextCol){\n              xFragAtCurrentDepth = idx.y != d ?\n                getX(b, r, c, idx.y) : xFragAtOutputCoords;\n              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));\n              if(hasNextRow){\n                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));\n              }\n            }\n            cache.xy = z.yw;\n            sum += z * z;\n          }\n        }\n        vec4 result = xAtOutputCoords * " + a + ";\n        setOutput(result);\n      }\n    ";
  };
}(),
    yi = function () {
  return function (t) {
    this.variableNames = ["dy", "maxPos"], this.outputShape = t.inShape;
    var e = t.strideHeight,
        n = t.strideWidth,
        r = t.dilationHeight,
        o = t.effectiveFilterHeight,
        a = t.effectiveFilterWidth,
        i = o - 1 - t.padInfo.top,
        s = a - 1 - t.padInfo.left,
        u = o * a - 1;
    this.userCode = "\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + o + ";\n          wR += " + r + ") {\n          float dyR = float(dyRCorner + wR) / " + e + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + a + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + n + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + u + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + a + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    xi = function () {
  return function (t) {
    this.variableNames = ["dy", "maxPos"], this.outputShape = t.inShape;
    var e = t.strideDepth,
        n = t.strideHeight,
        r = t.strideWidth,
        o = t.dilationDepth,
        a = t.dilationHeight,
        i = t.dilationWidth,
        s = t.effectiveFilterDepth,
        u = t.effectiveFilterHeight,
        l = t.effectiveFilterWidth,
        c = s - 1 - t.padInfo.front,
        h = u - 1 - t.padInfo.top,
        p = l - 1 - t.padInfo.left,
        f = s * u * l - 1;
    this.userCode = "\n      const ivec3 pads = ivec3(" + c + ", " + h + ", " + p + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyDCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get\n        // dx(xD, xR, xC, ch).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int wD = 0; wD < " + s + ";\n           wD += " + o + ") {\n          float dyD = float(dyDCorner + wD) / " + e + ".0;\n\n          if (dyD < 0.0 || dyD >= " + t.outDepth + ".0 || fract(dyD) > 0.0) {\n            continue;\n          }\n          int idyD = int(dyD);\n\n          for (int wR = 0; wR < " + u + ";\n              wR += " + a + ") {\n            float dyR = float(dyRCorner + wR) / " + n + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n                fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            for (int wC = 0; wC < " + l + ";\n                wC += " + i + ") {\n              float dyC = float(dyCCorner + wC) / " + r + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              float dyValue = getDy(batch, idyD, idyR, idyC, ch);\n              int maxPosValue = " + f + " -\n                  int(getMaxPos(batch, idyD, idyR, idyC, ch));\n\n              // Get the current value, check it against the value from the\n              // position matrix.\n              int curPosValue =\n                  wD * " + u + " * " + l + " +\n                  wR * " + l + " + wC;\n              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n              dotProd += dyValue * mask;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
  };
}(),
    bi = function () {
  return function (t, e, n, r, o, a, i) {
    void 0 === n && (n = !1), void 0 === r && (r = !1), void 0 === o && (o = !1), void 0 === a && (a = null), void 0 === i && (i = !1), this.variableNames = ["matrixA", "matrixB"], this.usesPackedTextures = !0, this.outputShape = e;
    var s = n ? t[1] : t[2],
        u = Math.ceil(s / 2),
        l = n ? "i * 2, rc.y" : "rc.y, i * 2",
        c = r ? "rc.z, i * 2" : "i * 2, rc.z",
        h = n ? ["a.xxyy", "a.zzww"] : ["a.xxzz", "a.yyww"],
        p = r ? ["b.xzxz", "b.ywyw"] : ["b.xyxy", "b.zwzw"],
        f = "",
        d = "";
    a && (f = i ? "vec4 activation(vec4 a) {\n          vec4 b = getPreluActivationWeightsAtOutCoords();\n          " + a + "\n        }" : "vec4 activation(vec4 x) {\n          " + a + "\n        }", d = "result = activation(result);");
    var v = o ? "result += getBiasAtOutCoords();" : "";
    o && this.variableNames.push("bias"), i && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + f + "\n\n      const float sharedDimension = " + u + ".0;\n\n      vec4 dot2x2ARowBCol(ivec3 rc) {\n        vec4 result = vec4(0);\n        for (int i = 0; i < " + u + "; i++) {\n          vec4 a = getMatrixA(rc.x, " + l + ");\n          vec4 b = getMatrixB(rc.x, " + c + ");\n\n          // These swizzled products need to be separately added.\n          // See: https://github.com/tensorflow/tfjs/issues/1735\n          result += (" + h[0] + " * " + p[0] + ");\n          result += (" + h[1] + " * " + p[1] + ");\n        }\n        return result;\n      }\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n        vec4 result = dot2x2ARowBCol(rc);\n\n        " + v + "\n\n        " + d + "\n\n        setOutput(result);\n      }\n    ";
  };
}(),
    wi = function () {
  function t(t, e, n) {
    this.variableNames = ["probs"], this.outputShape = [t, n], this.userCode = "\n      uniform float seed;\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n\n        float r = random(seed);\n        float cdf = 0.0;\n\n        for (int i = 0; i < " + (e - 1) + "; i++) {\n          cdf += getProbs(batch, i);\n\n          if (r < cdf) {\n            setOutput(float(i));\n            return;\n          }\n        }\n\n        // If no other event happened, last event happened.\n        setOutput(float(" + (e - 1) + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.seedLoc && (e.seedLoc = n.getUniformLocation(r, "seed")), n.gl.uniform1f(e.seedLoc, t);
    };
  }, t;
}(),
    Ci = function () {
  return function (t, e, n, r) {
    this.variableNames = ["indices"], this.outputShape = [t, e], this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + r + "), float(" + n + "),\n                      float(index == coords.y)));\n      }\n    ";
  };
}(),
    Ei = function () {
  return function (t) {
    this.variableNames = ["A"], this.outputShape = t;
    var e = t.length;
    if (0 === e) this.userCode = "\n        void main() {\n          setOutput(vec4(getA(), 0., 0., 0.));\n        }\n      ";else {
      var n = Mo("rc", e),
          r = Xo(e),
          o = function (t, e, n) {
        if (1 === t) return "rc > " + e[0];

        for (var r = "", o = t - 2; o < t; o++) r += n[o] + " >= " + e[o], o < t - 1 && (r += "||");

        return r;
      }(e, t, n),
          a = function (t, e, n, r) {
        if (1 === t) return "";
        var o = r.slice(-2);
        return "\n    int r = " + o[0] + ";\n    int c = " + o[1] + ";\n    int rp1 = r + 1;\n    int cp1 = c + 1;\n\n    bool cEdge = cp1 >= " + e + ";\n    bool rEdge = rp1 >= " + n + ";\n  ";
      }(e, t[t.length - 1], t[t.length - 2], n),
          i = function (t, e) {
        var n = t.length,
            r = function (t, e) {
          for (var n = [], r = 0; r <= 1; r++) for (var o = 0; o <= 1; o++) {
            for (var a = (0 === r ? "r" : "rp1") + ", " + (0 === o ? "c" : "cp1"), i = 2; i < t; i++) a = e[e.length - 1 - i] + "," + a;

            n.push(a);
          }

          return n;
        }(n, e);

        return 1 === n ? "getA(rc),\n            rc + 1 >= " + t[0] + " ? 0. : getA(rc + 1),\n            0, 0" : "getA(" + r[0] + "),\n          cEdge ? 0. : getA(" + r[1] + "),\n          rEdge ? 0. : getA(" + r[2] + "),\n          rEdge || cEdge ? 0. : getA(" + r[3] + ")";
      }(t, n);

      this.userCode = "\n        void main() {\n          " + r + " rc = getOutputCoords();\n\n          if(" + o + ") {\n            setOutput(vec4(0));\n          } else {\n            " + a + "\n\n            setOutput(vec4(" + i + "));\n          }\n        }\n      ";
    }
  };
}();

var Ri = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.outputShape = e.map(function (e, n) {
      return e[0] + t[n] + e[1];
    });
    var r = t.length,
        o = Xo(r),
        a = e.map(function (t) {
      return t[0];
    }).join(","),
        i = e.map(function (e, n) {
      return e[0] + t[n];
    }).join(","),
        s = ["coords[0]", "coords[1]", "coords[2]", "coords[3]"].slice(0, r);
    this.userCode = 1 !== r ? "\n      " + o + " start = " + o + "(" + a + ");\n      " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + n + "));\n        } else {\n          " + o + " coords = outC - start;\n          setOutput(getX(" + s + "));\n        }\n      }\n    " : "\n        int start = " + a + ";\n        int end = " + i + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + n + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
  };
}(),
    Ii = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.usesPackedTextures = !0, this.outputShape = e.map(function (e, n) {
      return e[0] + t[n] + e[1];
    });

    for (var r = t.length, o = Xo(r), a = e.map(function (t) {
      return t[0];
    }).join(","), i = e.map(function (e, n) {
      return e[0] + t[n];
    }).join(","), s = Mo("rc", r), u = Mo("source", r), l = s[r - 1] + " < " + this.outputShape[r - 1], c = 1 === r ? "source" : "vec2(" + u.slice(-2).join() + ")", h = [o + " rc = outputLoc;", s[r - 1] + " += 1;\n       if(" + l + ") {\n      ", 1 === r ? "" : "}\n       rc = outputLoc;\n       " + s[r - 2] + " += 1;\n       if(" + s[r - 2] + " < " + this.outputShape[r - 2] + ") {", 1 === r ? "" : "  " + s[r - 1] + " += 1;\n         if(" + l + ") {"], p = 1 === r ? "rc < start || rc >= end" : "any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))", f = "", d = 0, v = 1 === r ? 2 : 4; d < v; d++) f += "\n        " + h[d] + "\n        if (" + p + ") {\n          result[" + d + "] = float(" + n + ");\n        } else {\n          " + o + " source = rc - start;\n          result[" + d + "] = getChannel(getX(" + u.join() + "), " + c + ");\n        }\n      ";

    f += 1 === r ? "} " : "}}", this.userCode = "\n      const " + o + " start = " + o + "(" + a + ");\n      const " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outputLoc = getOutputCoords();\n        vec4 result = vec4(0.);\n        " + f + "\n        setOutput(result);\n      }\n    ";
  };
}(),
    ki = function () {
  return function (t, e, n) {
    if (this.variableNames = ["x"], "avg" === e && n) throw new Error("Cannot compute positions for average pool.");
    var r = t.filterWidth,
        o = t.strideHeight,
        a = t.strideWidth,
        i = t.dilationHeight,
        s = t.dilationWidth,
        u = t.effectiveFilterHeight,
        l = t.effectiveFilterWidth,
        c = t.padInfo.top,
        h = t.padInfo.left;
    this.outputShape = t.outShape;
    var p = "avg" === e,
        f = "0.0";
    if (p || (f = "-1.0 / 1e-20"), n) this.userCode = "\n        const ivec2 strides = ivec2(" + o + ", " + a + ");\n        const ivec2 pads = ivec2(" + c + ", " + h + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + u + ";\n              wR += " + i + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + l + ";\n                wC += " + s + ") {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value >= currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = wR * " + l + " + wC;\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";else {
      var d = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
      "avg" === e && (d = "avgValue / count");
      var v = 4 * Math.floor(r / 4),
          m = r % 4,
          g = "\n      if (" + p + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = max(values, minMaxValue);\n      }\n    ";
      this.userCode = "\n      const ivec2 strides = ivec2(" + o + ", " + a + ");\n      const ivec2 pads = ivec2(" + c + ", " + h + ");\n      const float initializationValue = " + f + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + t.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + f + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wR = 0; wR < " + u + ";\n            wR += " + i + ") {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + v + "; wC += 4) {\n            int xC = xCCorner + wC * " + s + ";\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              getValue(batch, xR, xC + 2 * " + s + ", d),\n              getValue(batch, xR, xC + 3 * " + s + ", d)\n            );\n\n            " + g + "\n          }\n\n          int xC = xCCorner + " + v + ";\n          if (" + (1 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n\n            " + g + "\n          } else if (" + (2 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + g + "\n          } else if (" + (3 === m) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + s + ", d),\n              getValue(batch, xR, xC + 2 * " + s + ", d),\n              initializationValue\n            );\n\n            " + g + "\n          }\n        }\n        setOutput(" + d + ");\n      }\n    ";
    }
  };
}(),
    Ni = function () {
  return function (t, e, n) {
    if (this.variableNames = ["x"], "avg" === e && n) throw new Error("Cannot compute positions for average pool.");
    var r = t.filterWidth,
        o = t.strideDepth,
        a = t.strideHeight,
        i = t.strideWidth,
        s = t.dilationDepth,
        u = t.dilationHeight,
        l = t.dilationWidth,
        c = t.effectiveFilterDepth,
        h = t.effectiveFilterHeight,
        p = t.effectiveFilterWidth,
        f = t.padInfo.front,
        d = t.padInfo.top,
        v = t.padInfo.left;
    this.outputShape = t.outShape;
    var m = "avg" === e,
        g = "0.0";
    if (m || (g = "-1.0 / 1e-20"), n) this.userCode = "\n        const ivec3 strides =\n            ivec3(" + o + ", " + a + ", " + i + ");\n        const ivec3 pads = ivec3(" + f + ", " + d + ", " + v + ");\n\n        void main() {\n          ivec5 coords = getOutputCoords();\n          int batch = coords.x;\n          int ch = coords.u;\n\n          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n          int xDCorner = xCorner.x;\n          int xRCorner = xCorner.y;\n          int xCCorner = xCorner.z;\n\n          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n\n          for (int wD = 0; wD < " + c + ";\n              wD += " + s + ") {\n            int xD = xDCorner + wD;\n\n            if (xD < 0 || xD >= " + t.inDepth + ") {\n              continue;\n            }\n\n            for (int wR = 0; wR < " + h + ";\n                wR += " + u + ") {\n              int xR = xRCorner + wR;\n\n              if (xR < 0 || xR >= " + t.inHeight + ") {\n                continue;\n              }\n\n              for (int wC = 0; wC < " + p + ";\n                  wC += " + l + ") {\n                int xC = xCCorner + wC;\n\n                if (xC < 0 || xC >= " + t.inWidth + ") {\n                  continue;\n                }\n\n                float value = getX(batch, xD, xR, xC, ch);\n\n                // If a min / max value has already been found, use it. If not,\n                // use the current value.\n                float currMinMaxValue = mix(\n                    value, minMaxValue, minMaxValueFound);\n                if (value >= currMinMaxValue) {\n                  minMaxValue = value;\n                  minMaxValueFound = 1.0;\n                  minMaxPosition =\n                      wD * " + h + " * " + p + " +\n                      wR * " + p + " + wC;;\n                }\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";else {
      var y = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
      "avg" === e && (y = "avgValue / count");
      var x = 4 * Math.floor(r / 4),
          b = r % 4,
          w = "\n      if (" + m + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = max(values, minMaxValue);\n      }\n    ";
      this.userCode = "\n      const ivec3 strides =\n        ivec3(" + o + ", " + a + ", " + i + ");\n      const ivec3 pads = ivec3(" + f + ", " + d + ", " + v + ");\n      const float initializationValue = " + g + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xD, int xR, int xC, int ch) {\n        if (xC < 0 || xC >= " + t.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xD, xR, xC, ch);\n      }\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n        int xDCorner = xCorner.x;\n        int xRCorner = xCorner.y;\n        int xCCorner = xCorner.z;\n\n        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + g + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wD = 0; wD < " + c + ";\n            wD += " + s + ") {\n          int xD = xDCorner + wD;\n\n          if (xD < 0 || xD >= " + t.inDepth + ") {\n            continue;\n          }\n\n          for (int wR = 0; wR < " + h + ";\n            wR += " + u + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + x + "; wC += 4) {\n              int xC = xCCorner + wC * " + l + ";\n\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + l + ", ch),\n                getValue(batch, xD, xR, xC + 2 * " + l + ", ch),\n                getValue(batch, xD, xR, xC + 3 * " + l + ", ch)\n              );\n\n              " + w + "\n            }\n\n            int xC = xCCorner + " + x + ";\n            if (" + (1 === b) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                initializationValue,\n                initializationValue,\n                initializationValue\n              );\n\n              " + w + "\n            } else if (" + (2 === b) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + l + ", ch),\n                initializationValue,\n                initializationValue\n              );\n\n              " + w + "\n            } else if (" + (3 === b) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + l + ", ch),\n                getValue(batch, xD, xR, xC + 2 * " + l + ", ch),\n                initializationValue\n              );\n\n              " + w + "\n            }\n          }\n          setOutput(" + y + ");\n        }\n      }\n    ";
    }
  };
}(),
    Si = function () {
  return function (t, e) {
    this.variableNames = ["x"];
    var n = t.windowSize,
        r = t.batchSize,
        o = t.inSize,
        a = Math.ceil(o / n);
    this.outputShape = [r, a];
    var i = "0.0",
        s = "";
    "prod" === e ? i = "1.0" : "min" === e ? (i = "1.0 / 1e-20", s = "min") : "max" === e && (i = "-1.0 / 1e-20", s = "max");
    var u = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
    "sum" === e ? u = "sumValue" : "prod" === e ? u = "prodValue" : "all" === e ? u = "allValue" : "any" === e && (u = "anyValue");
    var l = 4 * Math.floor(n / 4),
        c = n % 4,
        h = "\n      if (" + ("sum" === e) + ") {\n        sumValue += dot(values, ones);\n      } else if (" + ("prod" === e) + ") {\n        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);\n        prodValue *= tmp[0] * tmp[1];\n      } else {\n        minMaxValue = " + s + "(values, minMaxValue);\n      }\n    ",
        p = "vec4";
    "all" === e ? (i = "1.0", h = "\n        bool reducedAllValue = all(values);\n        float floatedReducedAllValue = float(reducedAllValue);\n        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);\n      ", p = "bvec4") : "any" === e && (i = "0.0", h = "\n        bool reducedAnyValue = any(values);\n        float floatedReducedAnyValue = float(reducedAnyValue);\n        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);\n      ", p = "bvec4");
    var f = "";
    o % n > 0 && (f = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      "), this.userCode = "\n      const float initializationValue = " + i + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + f + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + n + ";\n\n        vec4 minMaxValue = vec4(" + i + ");\n        float prodValue = 1.0;\n        float sumValue = 0.0;\n        float allValue = 1.0;\n        float anyValue = 0.0;\n\n        for (int i = 0; i < " + l + "; i += 4) {\n          int inIdx = inOffset + i;\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + h + "\n        }\n\n        int inIdx = inOffset + " + l + ";\n        if (" + (1 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (2 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (3 === c) + ") {\n          " + p + " values = " + p + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          " + h + "\n        }\n        setOutput(" + u + ");\n      }\n    ";
  };
}(),
    Ai = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;

    for (var n = "", r = 0; r < 4; r++) {
      var o = "thisRC = rc;";
      r % 2 == 1 && (o += "thisRC.z += 1;"), r > 1 && (o += "thisRC.y += 1;"), n += "\n        " + o + "\n        " + (r > 0 ? "if(thisRC.y < rows && thisRC.z < cols){" : "") + "\n          int flatIndex = getFlatIndex(thisRC);\n\n          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);\n          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));\n\n          result[" + r + "] =\n            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);\n        " + (r > 0 ? "}" : "") + "\n      ";
    }

    this.userCode = "\n      \n    ivec3 inputCoordsFromReshapedOutCoords(int index) {\n      " + Po(["r", "c", "d"], e) + "\n      return ivec3(r, c, d);\n    }\n  \n      " + Lo(t) + "\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n\n        vec4 result = vec4(0.);\n\n        ivec3 thisRC;\n        int rows = " + t[1] + ";\n        int cols = " + t[2] + ";\n\n        " + n + "\n\n        setOutput(result);\n      }\n    ";
  };
}();

var Ti = function () {
  return function (t, e, n) {
    this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
    var r = e.shape,
        o = r[1],
        a = r[2],
        i = t.shape,
        s = i[1],
        u = i[2],
        l = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
        c = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
        h = l[0] / c[0],
        p = l[1] / c[1],
        f = 1 / h,
        d = 1 / p,
        v = 2 * Math.ceil(f) + 2,
        m = 2 * Math.ceil(d) + 2;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + p + ");\n\n        const float invHeightScale = float(" + f + ");\n        const float invWidthScale = float(" + d + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + m + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(startRLerp - float(winHeight / 2));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(startCLerp - float(winWidth / 2));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float dxR = float(dyR) * heightScale;\n            int topDxRIndex = int(floor(dxR));\n            int bottomDxRIndex = int(min(ceil(dxR), " + (o - 1) + ".0));\n            float dxRLerp = dxR - float(topDxRIndex);\n            float inverseDxRLerp = 1.0 - dxRLerp;\n\n            float dxC = float(dyC) * widthScale;\n            int leftDxCIndex = int(floor(dxC));\n            int rightDxCIndex = int(min(ceil(dxC), " + (a - 1) + ".0));\n            float dxCLerp = dxC - float(leftDxCIndex);\n            float inverseDxCLerp = 1.0 - dxCLerp;\n\n            if (r == topDxRIndex && c == leftDxCIndex) {\n              // topLeft\n              accumulator +=\n                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;\n            }\n\n            if (r == topDxRIndex && c == rightDxCIndex) {\n              // topRight\n              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == leftDxCIndex) {\n              // bottomLeft\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == rightDxCIndex) {\n              // bottomRight\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
  };
}(),
    Di = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
    this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n        ivec2 sourceCeilRC = ivec2(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);\n        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);\n        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);\n        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n        float top = topLeft + (topRight - topLeft) * fracRC.y;\n        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n        float newValue = top + (bottom - top) * fracRC.x;\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    _i = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
    this.userCode = "\n      const vec3 effectiveInputOverOutputRatioRC = vec3(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ",\n          " + u[1] / l[1] + ");\n      const vec3 inputShapeRC = vec3(" + a + ".0, " + i + ".0,\n                                     " + i + ".0);\n\n      float getAValue(int b, int r, int c, int d) {\n        return getChannel(getA(b, r, c, d), vec2(c, d));\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        // Calculate values for next column in yRC.z.\n        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);\n\n        // Fractional source index.\n        vec3 sourceFracIndexRC = vec3(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec3 sourceFloorRC = ivec3(sourceFracIndexRC);\n        ivec3 sourceCeilRC = ivec3(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n        \n        // Should we calculate next column and row elements in 2x2 packed cell.\n        bool hasNextCol = d < " + (s - 1) + "; \n        bool hasNextRow = coords.z < " + (n - 1) + ";\n\n        // In parallel, construct four corners for all four components in\n        // packed 2x2 cell.\n        vec4 topLeft = vec4(\n          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 bottomLeft = vec4(\n          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 topRight = vec4(\n          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec4 bottomRight = vec4(\n          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);\n\n        vec4 top = mix(topLeft, topRight, fracRC.yyzz);\n        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);\n        vec4 newValue = mix(top, bottom, fracRC.x);\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    Oi = function () {
  return function (t, e, n) {
    this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
    var r = e.shape,
        o = r[1],
        a = r[2],
        i = t.shape,
        s = i[1],
        u = i[2],
        l = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
        c = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
        h = l[0] / c[0],
        p = l[1] / c[1],
        f = 1 / h,
        d = 1 / p,
        v = 2 * Math.ceil(f) + 2,
        m = 2 * Math.ceil(d) + 2;
    this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + p + ");\n\n        const float invHeightScale = float(" + f + ");\n        const float invWidthScale = float(" + d + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + m + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(floor(startRLerp - float(winHeight / 2)));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(floor(startCLerp - float(winWidth / 2)));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float sourceFracRow =\n              float(" + l[0] + ") *\n                (float(dyR) / float(" + c[0] + "));\n\n            float sourceFracCol =\n                float(" + l[1] + ") *\n                  (float(dyC) / float(" + c[1] + "));\n\n            int sourceNearestRow = int(min(\n                float(int(" + o + ") - 1),\n                " + n + " ? float(round(sourceFracRow)) :\n                                  float(floor(sourceFracRow))));\n\n            int sourceNearestCol = int(min(\n                float(int(" + a + ") - 1),\n                " + n + " ? float(round(sourceFracCol)) :\n                                  float(floor(sourceFracCol))));\n\n            if (r == sourceNearestRow && c == sourceNearestCol) {\n              accumulator += getDy(b, dyR, dyC, d);\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
  };
}(),
    Fi = function () {
  return function (t, e, n, r) {
    this.variableNames = ["A"], this.outputShape = [];
    var o = t[0],
        a = t[1],
        i = t[2],
        s = t[3];
    this.outputShape = [o, e, n, s];
    var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
        l = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n],
        c = r ? "0.5" : "0.0";
    this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / l[0] + ",\n          " + u[1] / l[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the coordinators of nearest neighbor point.\n        ivec2 sourceNearestRC = ivec2(\n          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + " + c + ")));\n\n        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);\n\n        setOutput(newValue);\n      }\n    ";
  };
}(),
    Mi = function () {
  return function (t, e) {
    this.variableNames = ["x"];
    var n = t.length;
    if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");

    if (this.outputShape = t, 1 !== n) {
      var r = t.map(function (n, r) {
        return function (n) {
          return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - coords[" + n + "] - 1" : "coords[" + n + "]";
        }(r);
      }).join(","),
          o = Xo(n);
      this.userCode = "\n      void main() {\n        " + o + " coords = getOutputCoords();\n        setOutput(getX(" + r + "));\n      }\n    ";
    } else this.userCode = "\n        void main() {\n          int coord = getOutputCoords();\n          setOutput(getX(" + t[0] + " - coord - 1));\n        }\n      ";
  };
}(),
    Bi = function () {
  return function (t, e) {
    this.variableNames = ["x"], this.usesPackedTextures = !0;
    var n = t.length;
    if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");
    this.outputShape = t;
    var r = Mo("rc", n),
        o = r[n - 1] + " + 1 < " + this.outputShape[n - 1],
        a = r[n - 2] + " + 1 < " + this.outputShape[n - 2],
        i = Xo(n);

    function s(n) {
      var r = t.map(function (r, o) {
        return function (n, r) {
          return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - " + r[n] + " - 1" : "" + r[n];
        }(o, n);
      });
      return "getChannel(getX(" + r.join(",") + "), vec2(" + r.slice(-2).join(",") + "))";
    }

    this.userCode = 1 === n ? "\n        void main(){\n          int rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = getChannel(getX(" + t[0] + " - rc - 1),\n            " + t[0] + " - rc - 1);\n          if(" + o + "){\n              result.g = getChannel(getX(" + t[0] + " - (rc  + 1) - 1),\n                " + t[0] + " - (rc  + 1) - 1);\n          }\n          setOutput(result);\n        }\n      " : "\n        void main() {\n          " + i + " rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = " + function (t) {
      return s(t);
    }(r.slice()) + ";\n          if(" + o + "){\n            result.g = " + function (t) {
      return t[n - 1] = "(" + t[n - 1] + " + 1)", s(t);
    }(r.slice()) + ";\n          }\n          if(" + a + ") {\n            result.b = " + function (t) {
      return t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
    }(r.slice()) + ";\n            if(" + o + ") {\n              result.a = " + function (t) {
      return t[n - 1] = "(" + t[n - 1] + " + 1)", t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
    }(r.slice()) + ";\n            }\n          }\n          setOutput(result);\n        }\n    ";
  };
}(),
    Pi = function () {
  return function (t, e, n, r, o, a, i) {
    void 0 === i && (i = !0), this.variableNames = ["updates", "indices", "defaultValue"], this.outputShape = a;
    var s = Xo(o.length),
        u = Xo(a.length),
        l = "";
    1 === n ? l = "i" : 2 === n && (l = "i, j");
    var c = "getIndices(" + l + ")",
        h = "";
    1 === r ? h = "i" : 2 === r && (h = "i, coords[1]");
    var p = "getUpdates(" + h + ")",
        f = e > 1 ? "strides[j]" : "strides";
    this.userCode = "\n        " + s + " strides = " + s + "(" + o + ");\n\n        void main() {\n          " + u + " coords = getOutputCoords();\n          float sum = 0.0;\n          bool found = false;\n          for (int i = 0; i < " + t + "; i++) {\n            int flattenedIndex = 0;\n            for (int j = 0; j < " + e + "; j++) {\n              int index = round(" + c + ");\n              flattenedIndex += index * " + f + ";\n            }\n            if (flattenedIndex == coords[0]) {\n              sum += " + p + ";\n              found = true;\n            }\n          }\n          setOutput(mix(getDefaultValue(), sum, float(found)));\n        }\n      ";
  };
}(),
    Li = function () {
  return function (t, e) {
    this.variableNames = ["x", "segmentIds"];
    var n = t.windowSize,
        r = t.batchSize,
        o = t.inSize,
        a = t.numSegments,
        i = a * Math.ceil(o / n);
    this.outputShape = [r, i];
    var s = 4 * Math.floor(n / 4),
        u = n % 4,
        l = "\n        sumValue += dot(values, segFilter);\n    ",
        c = "";
    o % n > 0 && (c = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      ");
    var h = "";
    o % n > 0 && (h = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return -1.0;\n        }\n      "), this.userCode = "\n      const float initializationValue = 0.0;\n\n      float getValue(int batch, int inIdx) {\n        " + c + "\n        return getX(batch, inIdx);\n      }\n\n      float getSegmentIdAtIndex(int inIdx) {\n        " + h + "\n        return getSegmentIds(inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = int(floor(float(outIdx) / float(\n          " + a + ")) * float(" + n + "));\n        int currentSeg = int(mod(float(outIdx), float(" + a + ")));\n\n        float sumValue = 0.0;\n\n        for (int i = 0; i < " + s + "; i += 4) {\n          int inIdx = inOffset + i;\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0\n          );\n\n          " + l + "\n        }\n\n        int inIdx = inOffset + " + s + ";\n        if (" + (1 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            0,\n            0,\n            0\n          );\n\n          " + l + "\n        } else if (" + (2 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n              0,\n              0\n          );\n\n          " + l + "\n        } else if (" + (3 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            0\n          );\n\n          " + l + "\n        }\n        setOutput(sumValue);\n      }\n    ";
  };
}(),
    Wi = function () {
  return function (t, e, n) {
    var r, o;
    if (this.variableNames = ["c", "a", "b"], this.outputShape = e, n > 4) throw Error("Where for rank " + n + " is not yet supported");
    if (1 === n) o = "resRC", r = "resRC";else {
      for (var a = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], i = [], s = [], u = 0; u < e.length; u++) s.push("" + a[u]), u < t && i.push("" + a[u]);

      r = i.join(), o = s.join();
    }
    var l = Xo(n);
    this.userCode = "\n      void main() {\n        " + l + " resRC = getOutputCoords();\n        float cVal = getC(" + r + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + o + "));\n        } else {\n          setOutput(getB(" + o + "));\n        }\n      }\n    ";
  };
}(),
    Ui = function () {
  function t(t) {
    this.variableNames = ["source"], this.outputShape = t, this.rank = t.length;

    var e,
        n = Xo(this.rank),
        r = "uniform int start[" + this.rank + "];",
        o = function (t) {
      if (1 === t) return "sourceLoc";
      if (t <= 6) return Vi.slice(0, t).map(function (t) {
        return "sourceLoc." + t;
      }).join(",");
      throw Error("Slicing for rank " + t + " is not yet supported");
    }(this.rank);

    e = "\n        " + n + " sourceLoc;\n        " + n + " coords = getOutputCoords();\n        " + t.map(function (t, e) {
      return "sourceLoc." + Vi[e] + " = start[" + e + "] + coords." + Vi[e] + ";";
    }).join("\n") + "\n      ", this.userCode = "\n      " + r + "\n      void main() {\n        " + e + "\n        setOutput(getSource(" + o + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    Vi = ["x", "y", "z", "w", "u", "v"];

var zi = function () {
  function t(t) {
    this.variableNames = ["source"], this.usesPackedTextures = !0, this.outputShape = t, this.rank = t.length;
    var e = Xo(this.rank),
        n = Mo("coords", this.rank),
        r = Mo("sourceLoc", this.rank),
        o = 1 === this.rank ? "sourceLoc" : "vec2(" + r.slice(-2).join() + ")",
        a = "getChannel(getSource(" + r.join() + "), " + o + ")",
        i = "\n      result.x = " + a + ";\n      if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n        ++" + r[this.rank - 1] + ";\n        result.y = " + a + ";\n        --" + r[this.rank - 1] + ";\n      }\n    ",
        s = 1 === this.rank ? "" : "\n      --" + n[this.rank - 1] + ";\n      if (++" + n[this.rank - 2] + " < " + t[this.rank - 2] + ") {\n        ++" + r[this.rank - 2] + ";\n        result.z = " + a + ";\n        if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n          ++" + r[this.rank - 1] + ";\n          result.w = " + a + ";\n        }\n      }\n    ",
        u = this.rank <= 4 ? "sourceLoc = coords +\n            " + e + "(" + t.map(function (t, e) {
      return "start[" + e + "]";
    }).join() + ");" : t.map(function (t, e) {
      return r[e] + " = " + n[e] + " + start[" + e + "];";
    }).join("\n");
    this.userCode = "\n      uniform int start[" + this.rank + "];\n      void main() {\n        " + e + " coords = getOutputCoords();\n        " + e + " sourceLoc;\n        " + u + " \n        vec4 result = vec4(0.);\n        " + i + "\n        " + s + "\n        setOutput(result);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    Gi = function () {
  return function (t, e, n) {
    this.variableNames = ["x"], this.outputShape = n;
    var r = n.length,
        o = Xo(n.length),
        a = Xo(n.length),
        i = "";
    if (1 === r) i = "coords * strides + begin";else {
      var s = 0;
      i = n.map(function (t, e) {
        return s++, 1 === n.length ? "coords * strides[" + e + "] + begin[" + e + "]" : "coords[" + (s - 1) + "] * strides[" + e + "] + begin[" + e + "]";
      }).join(",");
    }
    this.userCode = "\n      " + o + " begin = " + o + "(" + t + ");\n      " + o + " strides = " + o + "(" + e + ");\n\n      void main() {\n        " + a + " coords = getOutputCoords();\n        setOutput(getX(" + i + "));\n      }\n    ";
  };
}(),
    Hi = function () {
  function t(t) {
    this.gpgpu = t, this.numUsedTextures = 0, this.numFreeTextures = 0, this.freeTextures = {}, this.logEnabled = !1, this.usedTextures = {};
  }

  return t.prototype.acquireTexture = function (t, e, n) {
    var r,
        o = qi(e, n),
        a = $i(t, o, n);

    if (a in this.freeTextures || (this.freeTextures[a] = []), a in this.usedTextures || (this.usedTextures[a] = []), this.freeTextures[a].length > 0) {
      this.numFreeTextures--, this.numUsedTextures++, this.log();
      var i = this.freeTextures[a].shift();
      return this.usedTextures[a].push(i), i;
    }

    return this.numUsedTextures++, this.log(), o === Tt.PACKED_2X2_FLOAT32 ? r = this.gpgpu.createPackedMatrixTexture(t[0], t[1]) : o === Tt.PACKED_2X2_FLOAT16 ? r = this.gpgpu.createFloat16PackedMatrixTexture(t[0], t[1]) : o === Tt.UNPACKED_FLOAT32 ? r = this.gpgpu.createFloat32MatrixTexture(t[0], t[1]) : o === Tt.UNPACKED_FLOAT16 ? r = this.gpgpu.createFloat16MatrixTexture(t[0], t[1]) : o === Tt.PACKED_4X1_UNSIGNED_BYTE && (r = this.gpgpu.createUnsignedBytesMatrixTexture(t[0], t[1])), this.usedTextures[a].push(r), r;
  }, t.prototype.releaseTexture = function (t, e, n, r) {
    if (null != this.freeTextures) {
      var o = $i(e, qi(n, r), r);
      o in this.freeTextures || (this.freeTextures[o] = []), this.freeTextures[o].push(t), this.numFreeTextures++, this.numUsedTextures--;
      var a = this.usedTextures[o],
          i = a.indexOf(t);
      if (i < 0) throw new Error("Cannot release a texture that was never provided by this texture manager");
      a.splice(i, 1), this.log();
    }
  }, t.prototype.log = function () {
    if (this.logEnabled) {
      var t = this.numFreeTextures + this.numUsedTextures;
      console.log("Free/Used", this.numFreeTextures + " / " + this.numUsedTextures, "(" + t + ")");
    }
  }, t.prototype.getNumUsedTextures = function () {
    return this.numUsedTextures;
  }, t.prototype.getNumFreeTextures = function () {
    return this.numFreeTextures;
  }, t.prototype.dispose = function () {
    var t = this;

    if (null != this.freeTextures) {
      for (var e in this.freeTextures) this.freeTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      for (var e in this.usedTextures) this.usedTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      this.freeTextures = null, this.usedTextures = null, this.numUsedTextures = 0, this.numFreeTextures = 0;
    }
  }, t;
}();

function qi(t, e) {
  if (t === At.UPLOAD) return Tt.PACKED_2X2_FLOAT32;
  if (t === At.RENDER || null == t) return function (t) {
    return a().getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? t ? Tt.PACKED_2X2_FLOAT32 : Tt.UNPACKED_FLOAT32 : t ? Tt.PACKED_2X2_FLOAT16 : Tt.UNPACKED_FLOAT16;
  }(e);
  if (t === At.DOWNLOAD || t === At.PIXELS) return Tt.PACKED_4X1_UNSIGNED_BYTE;
  throw new Error("Unknown logical texture type " + t);
}

function $i(t, e, n) {
  return t[0] + "_" + t[1] + "_" + e + "_" + n;
}

var Ki = function () {
  return function (t, e) {
    this.variableNames = ["A"];

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[r] * e[r];

    this.outputShape = n, this.rank = n.length;

    var o = Xo(this.rank),
        a = function (t) {
      var e = t.length;
      if (e > 5) throw Error("Tile for rank " + e + " is not yet supported");
      if (1 === e) return "imod(resRC, " + t[0] + ")";

      for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u"], r = [], o = 0; o < t.length; o++) r.push("imod(" + n[o] + ", " + t[o] + ")");

      return r.join();
    }(t);

    this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
  };
}();

var ji = function () {
  return function (t, e) {
    this.variableNames = ["A"];

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

    this.outputShape = n, this.rank = n.length;

    var o = Xo(this.rank),
        a = function (t) {
      var e = t.length;
      if (e > 6) throw Error("Transpose for rank " + e + " is not yet supported");

      for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u", "resRC.v"], r = new Array(e), o = 0; o < t.length; o++) r[t[o]] = n[o];

      return r.join();
    }(e);

    this.userCode = "\n    void main() {\n      " + o + " resRC = getOutputCoords();\n      setOutput(getA(" + a + "));\n    }\n    ";
  };
}();

var Xi = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0;

    for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

    if (this.outputShape = n, this.rank = n.length, this.rank > 6) throw Error("Packed transpose for rank " + this.rank + " is not yet supported.");
    var o = Xo(this.rank),
        a = Fo("rc", this.rank),
        i = new Array(this.rank);

    for (r = 0; r < e.length; r++) i[e[r]] = a[r];

    var s = "vec2(" + i.slice(-2).join() + ")",
        u = "++" + a[this.rank - 1] + " < " + n[this.rank - 1],
        l = "getChannel(getA(" + i.join() + "), " + s + ")";
    this.userCode = "\n    void main() {\n      " + o + " rc = getOutputCoords();\n      vec4 result = vec4(0.);\n      result[0] = " + l + ";\n      if(" + u + ") {\n        result[1] = " + l + ";\n      }\n      --" + a[this.rank - 1] + ";\n      if(++" + a[this.rank - 2] + " < " + n[this.rank - 2] + ") {\n        result[2] = " + l + ";\n        if(" + u + ") {\n          result[3] = " + l + ";\n        }\n      }  \n      setOutput(result);\n    }\n    ";
  };
}(),
    Yi = 1.7580993408473768,
    Qi = 1.0507009873554805,
    Ji = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      float unaryOperation(float x) {\n        " + e + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
  };
}(),
    Zi = "if (isnan(x)) return x;",
    ts = "return x;",
    es = "return abs(x);",
    ns = Zi + "\n  return (x < 0.0) ? 0.0 : x;\n",
    rs = Zi + "\n  return (x < 0.0) ? 0.0 : min(6.0, x);\n",
    os = "return (x >= 0.0) ? x : (exp(x) - 1.0);",
    as = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + Yi + ";\n  float scale = " + Qi + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";

var is = "return -x;",
    ss = "return ceil(x);",
    us = "return floor(x);",
    ls = "return exp(x);",
    cs = "return exp(x) - 1.0;",
    hs = Zi + "\n  return sin(x);\n",
    ps = Zi + "\n  return cos(x);\n",
    fs = Zi + "\n  if (abs(x) > 1.) {\n    return NAN;\n  }\n  return asin(x);\n",
    ds = Zi + "\n  if (abs(x) > 1.) {\n    return NAN;\n  }\n  return acos(x);\n",
    vs = Zi + "\n  return atan(x);\n",
    ms = Zi + "return log(x + sqrt(x * x + 1.0));",
    gs = Zi + "\n  if (x < 1.0) return NAN;\n  return log(x + sqrt(x * x - 1.0));",
    ys = Zi + "\n  if ((x < -1.0) || (x > 1.0)) return NAN;\n  return (log(1.0 + x) - log(1.0 - x)) / 2.0;",
    xs = "return x;",
    bs = "return x;",
    ws = "\n  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));\n  bvec4 isNaN = isnan(x);\n\n  result.r = isNaN.r ? x.r : result.r;\n  result.g = isNaN.g ? x.g : result.g;\n  result.b = isNaN.b ? x.b : result.b;\n  result.a = isNaN.a ? x.a : result.a;\n\n  return result;\n",
    Cs = "\n  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));\n  bvec4 isNaN = isnan(x);\n\n  result.r = isNaN.r ? x.r : result.r;\n  result.g = isNaN.g ? x.g : result.g;\n  result.b = isNaN.b ? x.b : result.b;\n  result.a = isNaN.a ? x.a : result.a;\n\n  return result;\n",
    Es = "\n  vec4 result;\n\n  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);\n  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);\n  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);\n  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);\n\n  return result;\n",
    Rs = function () {
  return function (t, e) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t, this.userCode = "\n      vec4 unaryOperation(vec4 x) {\n        " + e + "\n      }\n\n      void main() {\n        vec4 x = getAAtOutCoords();\n        vec4 y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
  };
}(),
    Is = function () {
  return function (t) {
    this.variableNames = ["A"], this.usesPackedTextures = !0, this.outputShape = t;

    var e = t.length,
        n = Mo("rc", e),
        r = Xo(e),
        o = function (t, e) {
      if (1 === t) return "rc";

      for (var n = "", r = 0; r < t; r++) n += e[r], r < t - 1 && (n += ",");

      return n;
    }(e, n),
        a = n.slice(-2),
        i = e <= 1 ? "rc" : "vec2(" + a.join(",") + ")";

    this.userCode = "\n      void main() {\n        " + r + " rc = getOutputCoords();\n        vec4 packedInput = getA(" + o + ");\n\n        setOutput(getChannel(packedInput, " + i + "));\n      }\n    ";
  };
}(),
    ks = {};

function Ns(t, e) {
  if (void 0 === e && (e = !1), "linear" === t) return e ? bs : ts;
  if ("relu" === t) return e ? ws : ns;
  if ("elu" === t) return e ? Es : os;
  if ("relu6" === t) return e ? Cs : rs;
  if ("prelu" === t) return e ? ha : la;
  throw new Error("Activation " + t + " has not been implemented for the WebGL backend.");
}

var Ss = 600;

var As = function () {
  function t(t) {
    if (this.gpgpu = t, this.pendingRead = new WeakMap(), this.pendingDisposal = new WeakSet(), this.dataRefCount = new WeakMap(), this.numBytesInGPU = 0, this.uploadWaitMs = 0, this.downloadWaitMs = 0, this.warnedAboutMemory = !1, this.disposed = !1, !a().getBool("HAS_WEBGL")) throw new Error("WebGL is not supported on this device");

    if (null == t) {
      var e = Ft(a().getNumber("WEBGL_VERSION"));
      this.binaryCache = (n = a().getNumber("WEBGL_VERSION")) in ks ? ks[n] : (ks[n] = {}, ks[n]), this.gpgpu = new pi(e), this.canvas = e.canvas, this.gpgpuCreatedLocally = !0;
    } else this.binaryCache = {}, this.gpgpuCreatedLocally = !1, this.canvas = t.gl.canvas;

    var n;
    this.textureManager = new Hi(this.gpgpu), this.numMBBeforeWarning = null == a().global.screen ? 1024 : a().global.screen.height * a().global.screen.width * window.devicePixelRatio * Ss / 1024 / 1024, this.texData = new Zr(this, kt);
  }

  return t.prototype.register = function (t, e, n) {
    if (this.texData.has(t)) throw new Error("Data buffer is already registered");
    this.texData.set(t, {
      shape: e,
      dtype: n
    });
  }, t.prototype.fromPixels = function (t, e) {
    if (null == t) throw new Error("pixels passed to tf.browser.fromPixels() can not be null");
    var n = "undefined" != typeof OffscreenCanvas && t instanceof OffscreenCanvas || "undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement,
        r = t.data instanceof Uint8Array,
        o = "undefined" != typeof ImageData && t instanceof ImageData,
        i = "undefined" != typeof HTMLVideoElement && t instanceof HTMLVideoElement,
        s = "undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement,
        u = i ? [t.videoWidth, t.videoHeight] : [t.width, t.height],
        l = u[0],
        c = u[1],
        h = [c, l],
        p = [c, l, e];
    if (!(n || r || o || i || s)) throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was " + t.constructor.name);
    (s || i) && (null == this.fromPixels2DContext && (this.fromPixels2DContext = Mt(a().getNumber("WEBGL_VERSION")).getContext("2d")), this.fromPixels2DContext.canvas.width = l, this.fromPixels2DContext.canvas.height = c, this.fromPixels2DContext.drawImage(t, 0, 0, l, c), t = this.fromPixels2DContext.canvas);
    var f,
        d,
        v = this.makeTensorHandle(h, "int32");

    if (this.texData.get(v.dataId).usage = At.PIXELS, this.gpgpu.uploadPixelDataToTexture(this.getTexture(v.dataId), t), a().getBool("WEBGL_PACK")) {
      f = new qa(p);
      var m = this.makePackedTensor(f.outputShape, v.dtype);
      d = this.compileAndRun(f, [v], m);
    } else f = new Ha(p), d = this.compileAndRun(f, [v]);

    return this.disposeData(v.dataId), d;
  }, t.prototype.makeTensorHandle = function (t, e) {
    var n = {};
    return this.register(n, t, e), {
      dataId: n,
      shape: t,
      dtype: e
    };
  }, t.prototype.write = function (t, e) {
    if (null == e) throw new Error("MathBackendWebGL.write(): values can not be null");
    if (a().getBool("DEBUG")) for (var n = 0; n < e.length; n++) {
      var r = e[n];

      if (!Gt(r)) {
        if (a().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")) throw Error("The value " + r + " cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'");
        throw Error("The value " + r + " cannot be represented on this device.");
      }
    }
    var o = this.texData.get(t);
    if ("complex64" === o.dtype) throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");
    this.releaseGPUData(t), o.usage = At.UPLOAD, o.values = e;
  }, t.prototype.readSync = function (t) {
    var e = this.texData.get(t),
        n = e.values,
        r = e.dtype,
        o = e.complexTensors,
        a = e.slice,
        i = e.shape,
        s = e.isPacked;

    if (null != a) {
      var u = void 0;
      u = s ? new Rs(i, xs) : new Ji(i, xs);
      var l = this.compileAndRun(u, [{
        dataId: t,
        shape: i,
        dtype: r
      }]),
          c = this.readSync(l.dataId);
      return l.dispose(), c;
    }

    if (null != n) return this.convertAndCacheOnCPU(t);
    if ("string" === r) return n;
    var h,
        p,
        f = null != this.activeTimers;
    (f && (h = H()), "complex64" === r) ? p = wo(o.real.dataSync(), o.imag.dataSync()) : p = this.getValuesFromTexture(t);
    return f && (this.downloadWaitMs += H() - h), this.convertAndCacheOnCPU(t, p);
  }, t.prototype.read = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, i, s, u, l, c, h, p, f, d, m, g, y, x, b, w, C, E, R, I;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (this.pendingRead.has(t)) return e = this.pendingRead.get(t), [2, new Promise(function (t) {
              return e.push(t);
            })];
            if (n = this.texData.get(t), o = n.values, i = n.shape, s = n.slice, u = n.dtype, l = n.complexTensors, c = n.isPacked, null != s) return h = void 0, h = c ? new Rs(i, xs) : new Ji(i, xs), p = this.compileAndRun(h, [{
              dataId: t,
              shape: i,
              dtype: u
            }]), f = this.read(p.dataId), p.dispose(), [2, f];
            if (null != o) return [2, this.convertAndCacheOnCPU(t)];
            if (!a().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED") && 2 === a().getNumber("WEBGL_VERSION")) throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");
            return d = null, "complex64" !== u && a().get("WEBGL_BUFFER_SUPPORTED") && (m = this.decode(t), g = this.texData.get(m.dataId), d = (I = this.gpgpu).createBufferFromTexture.apply(I, [g.texture].concat(Pt(i)))), this.pendingRead.set(t, []), "complex64" === u ? [3, 2] : [4, this.gpgpu.createAndWaitForFence()];

          case 1:
            r.sent(), r.label = 2;

          case 2:
            return "complex64" !== u ? [3, 4] : [4, Promise.all([l.real.data(), l.imag.data()])];

          case 3:
            return x = r.sent(), b = x[0], w = x[1], y = wo(b, w), [3, 5];

          case 4:
            null == d ? y = this.getValuesFromTexture(t) : (C = v(i), y = this.gpgpu.downloadFloat32MatrixFromBuffer(d, C)), r.label = 5;

          case 5:
            return null != m && this.disposeData(m.dataId), E = this.convertAndCacheOnCPU(t, y), R = this.pendingRead.get(t), this.pendingRead.delete(t), R.forEach(function (t) {
              return t(E);
            }), this.pendingDisposal.has(t) && (this.pendingDisposal.delete(t), this.disposeData(t)), [2, E];
        }
      });
    });
  }, t.prototype.getValuesFromTexture = function (t) {
    var e,
        n = this,
        r = this.texData.get(t),
        o = r.shape,
        i = r.dtype,
        s = r.isPacked,
        u = v(o);

    if (a().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")) {
      var l = this.decode(t),
          c = this.texData.get(l.dataId),
          h = (e = this.gpgpu).downloadMatrixFromPackedTexture.apply(e, [c.texture].concat(Pt(o))).subarray(0, u);
      return this.disposeData(l.dataId), h;
    }

    var p = a().getBool("WEBGL_PACK") && !0 === s,
        f = p ? ye(o) : o,
        d = this.makeTensorHandle(f, "float32");
    d.size = v(o), this.texData.get(d.dataId).usage = At.DOWNLOAD;
    var m = Ve(function () {
      var e = p ? new Pa(f) : new Ba(f);
      return n.compileAndRun(e, [{
        shape: f,
        dtype: i,
        dataId: t
      }], d, null);
    }),
        g = this.texData.get(m.dataId),
        y = this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(g.texture, g.texShape[0], g.texShape[1]).subarray(0, u);
    return this.disposeData(d.dataId), y;
  }, t.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, i, s, u;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return e = this.activeTimers, n = [], o = !1, null == this.programTimersStack ? (this.programTimersStack = n, o = !0) : this.activeTimers.push(n), this.activeTimers = n, t(), a = d(this.activeTimers.map(function (t) {
              return t.query;
            })).filter(function (t) {
              return null != t;
            }), i = d(this.activeTimers.map(function (t) {
              return t.name;
            })).filter(function (t) {
              return null != t;
            }), this.activeTimers = e, o && (this.programTimersStack = null), [4, Promise.all(a)];

          case 1:
            return s = r.sent(), u = {
              uploadWaitMs: this.uploadWaitMs,
              downloadWaitMs: this.downloadWaitMs,
              kernelMs: c(s),
              getExtraProfileInfo: function () {
                return s.map(function (t, e) {
                  return {
                    name: i[e],
                    ms: t
                  };
                }).map(function (t) {
                  return t.name + ": " + t.ms;
                }).join(", ");
              },
              wallMs: null
            }, this.uploadWaitMs = 0, this.downloadWaitMs = 0, [2, u];
        }
      });
    });
  }, t.prototype.memory = function () {
    return {
      unreliable: !1,
      numBytesInGPU: this.numBytesInGPU
    };
  }, t.prototype.startTimer = function () {
    return a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? this.gpgpu.beginQuery() : {
      startMs: H(),
      endMs: null
    };
  }, t.prototype.endTimer = function (t) {
    return a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? (this.gpgpu.endQuery(), t) : (t.endMs = H(), t);
  }, t.prototype.getQueryTime = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return a().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? [2, this.gpgpu.waitForQueryAndGetTime(t)] : [2, (e = t).endMs - e.startMs];
      });
    });
  }, t.prototype.disposeData = function (t) {
    if (!this.pendingDisposal.has(t)) if (this.pendingRead.has(t)) this.pendingDisposal.add(t);else if (this.texData.has(t)) {
      this.releaseGPUData(t);
      var e = this.texData.get(t).complexTensors;
      null != e && (e.real.dispose(), e.imag.dispose()), this.texData.delete(t);
    }
  }, t.prototype.releaseGPUData = function (t) {
    var e = this.texData.get(t),
        n = e.texture,
        r = e.dtype,
        o = e.texShape,
        a = e.usage,
        i = e.isPacked,
        s = e.slice,
        u = s && s.origDataId || t,
        l = this.dataRefCount.get(u);
    l > 1 ? this.dataRefCount.set(u, l - 1) : (this.dataRefCount.delete(u), null != n && (this.numBytesInGPU -= this.computeBytes(o, r), this.textureManager.releaseTexture(n, o, a, i)));
    var c = this.texData.get(t);
    c.texture = null, c.texShape = null, c.isPacked = !1, c.slice = null;
  }, t.prototype.getTexture = function (t) {
    return this.uploadToGPU(t), this.texData.get(t).texture;
  }, t.prototype.getDataInfo = function (t) {
    return this.texData.get(t);
  }, t.prototype.getCPUBackend = function () {
    return a().getBool("WEBGL_CPU_FORWARD") ? (null == this.cpuBackend && (this.cpuBackend = kt.findBackend("cpu")), this.cpuBackend) : null;
  }, t.prototype.shouldExecuteOnCPU = function (t, e) {
    var n = this;
    return void 0 === e && (e = 128), null != this.getCPUBackend() && t.every(function (t) {
      return null == n.texData.get(t.dataId).texture && t.size < e;
    });
  }, t.prototype.getGPGPUContext = function () {
    return this.gpgpu;
  }, t.prototype.complex = function (t, e) {
    var n = this.makeOutputArray(t.shape, "complex64");
    return this.texData.get(n.dataId).complexTensors = {
      real: kt.keep(t.clone()),
      imag: kt.keep(e.clone())
    }, n;
  }, t.prototype.real = function (t) {
    return this.texData.get(t.dataId).complexTensors.real.clone();
  }, t.prototype.imag = function (t) {
    return this.texData.get(t.dataId).complexTensors.imag.clone();
  }, t.prototype.slice = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.slice(t, e, n);
    if (0 === v(n)) return bn([], n, t.dtype);
    var r = this.texData.get(t.dataId).isPacked,
        o = zr(t.shape, e, n);

    if (r || !o) {
      var i = a().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new zi(n) : new Ui(n),
          s = i.getCustomSetupFunc(e);
      return this.compileAndRun(i, [t], null, s);
    }

    return this.uploadToGPU(t.dataId), this.shallowSlice(t, e, n);
  }, t.prototype.shallowSlice = function (t, e, n) {
    var r = this.texData.get(t.dataId),
        o = ut.make(n, {}, t.dtype, this),
        a = this.texData.get(o.dataId);
    Object.assign(a, r), a.shape = n, a.dtype = t.dtype;
    var i = Gr(e, t.strides);
    r.slice && (i += r.slice.flatOffset), a.slice = {
      flatOffset: i,
      origDataId: r.slice && r.slice.origDataId || t.dataId
    };
    var s = this.dataRefCount.get(a.slice.origDataId) || 1;
    return this.dataRefCount.set(a.slice.origDataId, s + 1), o;
  }, t.prototype.stridedSlice = function (t, e, n, r) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.stridedSlice(t, e, n, r);
    var o = Wr(e, n, r);
    if (o.some(function (t) {
      return 0 === t;
    })) return bn([], o);
    var a = new Gi(e, r, o);
    return this.compileAndRun(a, [t]);
  }, t.prototype.reverse = function (t, e) {
    var n = a().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Bi(t.shape, e) : new Mi(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, t.prototype.concat = function (t, e) {
    if ("complex64" === t[0].dtype) {
      var n = t.map(function (t) {
        return yn(t);
      }),
          r = t.map(function (t) {
        return xn(t);
      });
      return gn(this.concat(n, e), this.concat(r, e));
    }

    if (this.shouldExecuteOnCPU(t)) return this.cpuBackend.concat(t, e);
    if (1 === t.length) return t[0];

    if (t.length > a().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var o = Math.floor(t.length / 2),
          i = this.concat(t.slice(0, o), e),
          s = this.concat(t.slice(o), e);
      return this.concat([i, s], e);
    }

    if (a().getBool("WEBGL_PACK_ARRAY_OPERATIONS") && t[0].rank > 1) {
      var u = new ga(t.map(function (t) {
        return t.shape;
      }), e);
      return this.compileAndRun(u, t);
    }

    var l = vn(t.map(function (t) {
      return t.shape;
    }), e),
        c = t.map(function (t) {
      return t.as2D(-1, v(t.shape.slice(e)));
    }),
        h = new ma(c.map(function (t) {
      return t.shape;
    }));
    return this.compileAndRun(h, c).reshape(l);
  }, t.prototype.neg = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.neg(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, is, t.dtype);
    var e = new Ji(t.shape, is);
    return this.compileAndRun(e, [t]);
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    var o = n ? t.shape[2] : t.shape[1],
        a = r ? e.shape[1] : e.shape[2],
        i = n ? t.shape[1] : t.shape[2],
        s = t.shape[0];

    if ((1 === o || 1 === a) && i > 1e3) {
      n && (t = t.transpose([0, 2, 1])), r && (e = e.transpose([0, 2, 1]));
      var u = 1 === a ? t : t.as3D(s, i, 1),
          l = 1 === a ? 2 : 1,
          c = 1 === a ? e.as3D(s, 1, i) : e;
      return this.multiply(u, c).sum(l, !0);
    }

    var h = gt(t.dtype, e.dtype),
        p = new bi(t.shape, [s, o, a], n, r),
        f = this.makePackedTensor(p.outputShape, h);
    return this.compileAndRun(p, [t, e], f);
  }, t.prototype.fusedBatchMatMul = function (t) {
    var e = t.a,
        n = t.b,
        r = t.transposeA,
        o = t.transposeB,
        a = t.bias,
        i = t.activation,
        s = t.preluActivationWeights,
        u = r ? e.shape[2] : e.shape[1],
        l = o ? n.shape[1] : n.shape[2],
        c = e.shape[0],
        h = gt(e.dtype, n.dtype),
        p = null != a,
        f = null != s,
        d = i ? Ns(i, !0) : null,
        v = new bi(e.shape, [c, u, l], r, o, p, d, f),
        m = this.makePackedTensor(v.outputShape, h),
        g = [e, n];
    return a && g.push(a), s && g.push(s), this.compileAndRun(v, g, m);
  }, t.prototype.multiply = function (t, e) {
    if ("complex64" === t.dtype) {
      var n = this.texData.get(t.dataId),
          r = this.texData.get(e.dataId),
          o = new aa(ra, t.shape, e.shape),
          i = new aa(oa, t.shape, e.shape),
          s = [this.makeComplexComponentTensorHandle(t, n.complexTensors.real), this.makeComplexComponentTensorHandle(t, n.complexTensors.imag), this.makeComplexComponentTensorHandle(e, r.complexTensors.real), this.makeComplexComponentTensorHandle(e, r.complexTensors.imag)],
          u = this.compileAndRun(o, s),
          l = this.compileAndRun(i, s),
          c = this.complex(u, l);
      return u.dispose(), l.dispose(), c;
    }

    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.multiply(t, e);
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, ua, t.dtype);
    var h = new ca(ua, t.shape, e.shape),
        p = this.makeOutputArray(h.outputShape, t.dtype);
    return this.compileAndRun(h, [t, e], p);
  }, t.prototype.batchNormalization = function (t, e, n, r, o, i) {
    var s = [t, e, n],
        u = null;
    null != i && (u = i.shape, s.push(i));
    var l = null;

    if (null != o && (l = o.shape, s.push(o)), a().getBool("WEBGL_PACK_NORMALIZATION")) {
      var c = new na(t.shape, e.shape, n.shape, u, l, r);
      return this.compileAndRun(c, s);
    }

    var h = new ea(t.shape, e.shape, n.shape, u, l, r);
    return this.compileAndRun(h, s);
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    var i = a().getBool("WEBGL_PACK_NORMALIZATION") ? new gi(t.shape, e, n, r, o) : new vi(t.shape, e, n, r, o);
    return this.compileAndRun(i, [t]);
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    var s = new mi(e.shape, r, o, a, i);
    return this.compileAndRun(s, [e, n, t]);
  }, t.prototype.tile = function (t, e) {
    if ("string" === t.dtype) {
      var n = this.readSync(t.dataId).map(function (t) {
        return K(t);
      });
      return So(tr(t.shape, t.dtype, n), e);
    }

    var r = new Ki(t.shape, e);
    return this.compileAndRun(r, [t]);
  }, t.prototype.pad = function (t, e, n) {
    var r = a().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Ii(t.shape, e, n) : new Ri(t.shape, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.transpose = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.transpose(t, e);
    var n = a().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Xi(t.shape, e) : new ji(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, t.prototype.gather = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.gather(t, e, n);
    var r = new $a(t.shape, e.size, n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    h(t.rank <= 4, function () {
      return "batchToSpaceND for rank > 4 with a WebGL backend not implemented yet";
    });

    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = Sr(t.shape, e, r),
        a = Ar(o.length, e.length),
        i = Tr(t.shape, e, r),
        s = Dr(n, e.length),
        u = _r(i, n, e.length);

    return t.reshape(o).transpose(a).reshape(i).slice(s, u);
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    h(t.rank <= 4, function () {
      return "spaceToBatchND for rank > 4 with a WebGL backend not implemented yet";
    });
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = Sr(i.shape, e, r, !1),
        u = Ar(s.length, e.length, !1),
        l = Tr(i.shape, e, r, !1);
    return i.reshape(s).transpose(u).reshape(l);
  }, t.prototype.reduce = function (t, e, n) {
    var r = t.shape[0],
        o = t.shape[1],
        a = Mr(o),
        i = new Si({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e),
        s = i.outputShape,
        u = s[0],
        l = s[1],
        c = this.makeOutputArray([u, l], n);
    return this.compileAndRun(i, [t], c), 1 === c.shape[1] ? c : this.reduce(c, e, n);
  }, t.prototype.argReduce = function (t, e, n) {
    void 0 === n && (n = null);
    var r = t.shape[0],
        o = t.shape[1];
    null != n && (r = n.shape[0], o = n.shape[1]);
    var a = Mr(o),
        i = new Oo({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e, null == n),
        s = i.outputShape,
        u = s[0],
        l = s[1],
        c = this.makeOutputArray([u, l], "int32"),
        h = [t];
    return null != n && h.push(n), this.compileAndRun(i, h, c), 1 === c.shape[1] ? c : this.argReduce(t, e, c);
  }, t.prototype.argReducePacked = function (t, e, n) {
    void 0 === n && (n = null);
    var r = null != n ? n.shape : t.shape,
        o = Mr(r[r.length - 1]),
        a = new Jo(r, o, e, null == n),
        i = this.makePackedTensor(a.outputShape, "int32"),
        s = null == n ? [t] : [t, n];
    return this.compileAndRun(a, s, i), i.rank === t.rank ? this.argReducePacked(t, e, i) : i;
  }, t.prototype.sum = function (t, e) {
    cn("sum", e, t.rank);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o),
        i = yt(t.dtype);
    return this.reduce(a, "sum", i).reshape(r);
  }, t.prototype.prod = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.prod(t, e);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o),
        i = yt(t.dtype);
    return this.reduce(a, "prod", i).reshape(r);
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    var r = 0,
        o = hn([r], t.rank),
        a = t;
    null != o && (a = t.transpose(o), r = fn(1, t.rank)[0]);

    var i = function (t, e, n) {
      for (var r = [], o = t.length, a = 0; a < o; a++) a !== e ? r.push(t[a]) : r.push(n);

      return r;
    }(a.shape, r, n),
        s = v([a.shape[r]]),
        u = a.as2D(-1, s),
        l = yt(t.dtype),
        c = this.segOpCompute(u, "unsortedSegmentSum", e, l, n).reshape(i);

    return null != o && (c = c.transpose(pn(o))), c;
  }, t.prototype.segOpCompute = function (t, e, n, r, o) {
    var a = t.shape[0],
        i = t.shape[1],
        s = function (t, e) {
      var n,
          r = !1;

      for (t <= Fr ? (n = t, r = !0) : n = L(t, Math.floor(Math.sqrt(t))); !r;) n > e || n === t ? r = !0 : n = L(t, n + 1);

      return n;
    }(i, o),
        u = new Li({
      windowSize: s,
      inSize: i,
      batchSize: a,
      numSegments: o
    }, e),
        l = u.outputShape,
        c = l[0],
        h = l[1],
        p = this.makeOutputArray([c, h], r);

    return this.compileAndRun(u, [t, n], p), p.shape[1] === o ? p : (n = On(0, o).tile([i / s]), this.segOpCompute(p, e, n, r, o));
  }, t.prototype.argMinMaxReduce = function (t, e, n) {
    var r = [e];

    if (cn("arg" + n.charAt(0).toUpperCase() + n.slice(1), r, t.rank), !a().getBool("WEBGL_PACK_REDUCE") || t.rank <= 2) {
      var o = un(t.shape, r),
          i = o[0],
          s = v(o[1]),
          u = t.as2D(-1, s);
      return this.argReduce(u, n).reshape(i);
    }

    return this.argReducePacked(t, n);
  }, t.prototype.argMin = function (t, e) {
    return this.argMinMaxReduce(t, e, "min");
  }, t.prototype.argMax = function (t, e) {
    return this.argMinMaxReduce(t, e, "max");
  }, t.prototype.cumsum = function (t, e, n, r) {
    if (e !== t.rank - 1) throw new Error("WebGL cumsum shader expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);
    var o = new Ta(t.shape, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.equal = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(equal(a, b));\n", "bool");
    var n = new ca("return float(a == b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.notEqual = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(notEqual(a, b));\n", "bool");
    var n = new ca("return float(a != b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.less = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.less(t, e);
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThan(a, b));\n", "bool");
    var n = new ca("return float(a < b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.lessEqual = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThanEqual(a, b));\n", "bool");
    var n = new ca("return float(a <= b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.greater = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.greater(t, e);
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThan(a, b));\n", "bool");
    var n = new ca("return float(a > b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.greaterEqual = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThanEqual(a, b));\n", "bool");
    var n = new ca("return float(a >= b);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.logicalNot = function (t) {
    var e = new Ji(t.shape, "return float(!(x >= 1.0));");
    return this.compileAndRun(e, [t]);
  }, t.prototype.logicalAnd = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(\n    vec4(greaterThanEqual(a, vec4(1.0))) *\n    vec4(greaterThanEqual(b, vec4(1.0))));\n", "bool");
    var n = new ca("return float(a >= 1.0 && b >= 1.0);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.logicalOr = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return min(\n    vec4(greaterThanEqual(a, vec4(1.0))) +\n    vec4(greaterThanEqual(b, vec4(1.0))),\n    vec4(1.0));\n", "bool");
    var n = new ca("return float(a >= 1.0 || b >= 1.0);", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "bool");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.select = function (t, e, n) {
    var r = new Wi(t.rank, e.shape, e.rank),
        o = this.makeOutputArray(r.outputShape, gt(e.dtype, n.dtype));
    return this.compileAndRun(r, [t, e, n], o);
  }, t.prototype.where = function (t) {
    tn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");
    var e = t.dataSync();
    return To(t.shape, e);
  }, t.prototype.topk = function (t, e, n) {
    return Ao(t.dataSync(), t.shape, t.dtype, e);
  }, t.prototype.min = function (t, e) {
    cn("min", e, t.rank);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "min", a.dtype).reshape(r);
  }, t.prototype.minimum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.minimum(t, e);
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("\n  vec4 result = vec4(min(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new ca("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return min(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.mod = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("\n  vec4 result = mod(a, b);\n  vec4 isNaN = vec4(equal(b, vec4(0.0)));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new ca("if (b == 0.0) return NAN;\n  return mod(a, b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.max = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.max(t, e);
    cn("max", e, t.rank);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "max", a.dtype).reshape(r);
  }, t.prototype.maximum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.maximum(t, e);
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("\n  vec4 result = vec4(max(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new ca("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return max(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.all = function (t, e) {
    cn("all", e, t.rank);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "all", a.dtype).reshape(r);
  }, t.prototype.any = function (t, e) {
    cn("any", e, t.rank);
    var n = un(t.shape, e),
        r = n[0],
        o = v(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "any", a.dtype).reshape(r);
  }, t.prototype.squaredDifference = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("return (a - b) * (a - b);", t.shape, e.shape) : new ca("return (a - b) * (a - b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.realDivide = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) {
      return this.packedBinaryOp(t, e, "\n  // vec4 one = vec4(equal(a, b));\n  // return one + (vec4(1.0) - one) * a / b;\n  vec4 result = a / b;\n  if(a.x == b.x) {\n    result.x = 1.;\n  }\n  if(a.y == b.y) {\n    result.y = 1.;\n  }\n  if(a.z == b.z) {\n    result.z = 1.;\n  }\n  if(a.w == b.w) {\n    result.w = 1.;\n  }\n\n  return result;\n", "float32", !0);
    }

    var n = new ca("\nif (a == b) {\n  return 1.0;\n};\nreturn a / b;", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.floorDiv = function (t, e) {
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  ivec4 ia = round(a);\n  ivec4 ib = round(b);\n  bvec4 cond = notEqual(ib, ivec4(0));\n  ivec4 result = ivec4(0);\n  vec4 s = sign(a) * sign(b);\n\n  // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n  if (cond[0]) {\n    result[0] = idiv(ia[0], ib[0], s[0]);\n  }\n  if (cond[1]) {\n    result[1] = idiv(ia[1], ib[1], s[1]);\n  }\n  if (cond[2]) {\n    result[2] = idiv(ia[2], ib[2], s[2]);\n  }\n  if (cond[3]) {\n    result[3] = idiv(ia[3], ib[3], s[3]);\n  }\n  return vec4(result);\n", "int32");
    var n = new ca("\n  float s = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  if (ib != 0) {\n    // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n    return float(idiv(ia, ib, s));\n  } else {\n    return NAN;\n  }\n", t.shape, e.shape),
        r = this.makeOutputArray(n.outputShape, "int32");
    return this.compileAndRun(n, [t, e], r);
  }, t.prototype.add = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, ia);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.add(t, e);
    var n = gt(t.dtype, e.dtype);
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, ia, n);
    var r = new ca(ia, t.shape, e.shape),
        o = this.makeOutputArray(r.outputShape, n);
    return this.compileAndRun(r, [t, e], o);
  }, t.prototype.packedUnaryOp = function (t, e, n) {
    var r = new Rs(t.shape, e),
        o = this.makePackedTensor(r.outputShape, n);
    return this.compileAndRun(r, [t], o);
  }, t.prototype.packedBinaryOp = function (t, e, n, r, o) {
    void 0 === o && (o = !1);
    var a = new pa(n, t.shape, e.shape, o),
        i = this.makePackedTensor(a.outputShape, r);
    return this.compileAndRun(a, [t, e], i);
  }, t.prototype.complexSeparableBinaryOp = function (t, e, n) {
    var r = this,
        o = this.texData.get(t.dataId),
        a = this.texData.get(e.dataId),
        i = [[o.complexTensors.real, a.complexTensors.real], [o.complexTensors.imag, a.complexTensors.imag]].map(function (o) {
      var a = o[0],
          i = o[1],
          s = r.makeComplexComponentTensorHandle(t, a),
          u = r.makeComplexComponentTensorHandle(e, i),
          l = new ca(n, t.shape, e.shape),
          c = r.makeOutputArray(l.outputShape, gt(a.dtype, i.dtype));
      return r.compileAndRun(l, [s, u], c);
    }),
        s = i[0],
        u = i[1],
        l = this.complex(s, u);
    return s.dispose(), u.dispose(), l;
  }, t.prototype.makeComplexComponentTensorHandle = function (t, e) {
    return {
      dataId: e.dataId,
      dtype: e.dtype,
      shape: t.shape
    };
  }, t.prototype.addN = function (t) {
    if (1 === t.length) return t[0];

    if (t.length > a().get("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var e = Math.floor(t.length / 2),
          n = this.addN(t.slice(0, e)),
          r = this.addN(t.slice(e));
      return this.addN([n, r]);
    }

    var o = t.map(function (t) {
      return t.dtype;
    }).reduce(function (t, e) {
      return gt(t, e);
    }),
        i = t.map(function (t) {
      return t.shape;
    }),
        s = a().getBool("WEBGL_PACK"),
        u = s ? new _o(t[0].shape, i) : new Do(t[0].shape, i),
        l = s ? this.makePackedTensor(u.outputShape, o) : this.makeOutputArray(u.outputShape, o);
    return this.compileAndRun(u, t, l);
  }, t.prototype.subtract = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, sa);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.subtract(t, e);
    var n = gt(t.dtype, e.dtype);
    if (a().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, sa, t.dtype);
    var r = new ca(sa, t.shape, e.shape),
        o = this.makeOutputArray(r.outputShape, n);
    return this.compileAndRun(r, [t, e], o);
  }, t.prototype.pow = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS"),
        r = n ? new pa("\n  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.\n  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));\n  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);\n  vec4 result = multiplier * pow(abs(a), b);\n\n  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS\n  bvec4 isExpZero = equal(b, vec4(0.0));\n  result.r = isExpZero.r ? 1.0 : result.r;\n  result.g = isExpZero.g ? 1.0 : result.g;\n  result.b = isExpZero.b ? 1.0 : result.b;\n  result.a = isExpZero.a ? 1.0 : result.a;\n\n  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new ca("\nif(a < 0.0 && floor(b) < b){\n  return NAN;\n}\nif (b == 0.0) {\n  return 1.0;\n}\nreturn (round(mod(b, 2.0)) != 1) ?\n    pow(abs(a), b) : sign(a) * pow(abs(a), b);\n", t.shape, e.shape),
        o = gt(t.dtype, e.dtype),
        i = n ? this.makePackedTensor(r.outputShape, o) : this.makeOutputArray(r.outputShape, o);
    return this.compileAndRun(r, [t, e], i);
  }, t.prototype.ceil = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.ceil(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, ss, t.dtype);
    var e = new Ji(t.shape, ss);
    return this.compileAndRun(e, [t]);
  }, t.prototype.floor = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.floor(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, us, t.dtype);
    var e = new Ji(t.shape, us);
    return this.compileAndRun(e, [t]);
  }, t.prototype.sign = function (t) {
    var e = new Ji(t.shape, "\n  if (isnan(x)) { return 0.0; }\n  return sign(x);\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.isNaN = function (t) {
    var e = new Ji(t.shape, "return float(isnan(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.isInf = function (t) {
    var e = new Ji(t.shape, "return float(isinf(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.isFinite = function (t) {
    var e = new Ji(t.shape, "return float(!isnan(x) && !isinf(x));"),
        n = this.makeOutputArray(e.outputShape, "bool");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.round = function (t) {
    var e = new Ji(t.shape, "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.exp = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.exp(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, ls, t.dtype);
    var e = new Ji(t.shape, ls);
    return this.compileAndRun(e, [t]);
  }, t.prototype.expm1 = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.expm1(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, cs, t.dtype);
    var e = new Ji(t.shape, cs);
    return this.compileAndRun(e, [t]);
  }, t.prototype.log = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.log(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, "\n  vec4 result = log(x);\n  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));\n  result.r = isNaN.r == 1.0 ? NAN : result.r;\n  result.g = isNaN.g == 1.0 ? NAN : result.g;\n  result.b = isNaN.b == 1.0 ? NAN : result.b;\n  result.a = isNaN.a == 1.0 ? NAN : result.a;\n\n  return result;\n", t.dtype);
    var e = new Ji(t.shape, "if (x < 0.0) return NAN;\n  return log(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.log1p = function (t) {
    var e = new Ji(t.shape, "return log(1.0 + x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.sqrt = function (t) {
    var e = new Ji(t.shape, "return sqrt(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.rsqrt = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.rsqrt(t);
    var e = new Ji(t.shape, "return inversesqrt(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.square = function (t) {
    var e = new Ji(t.shape, "return x * x;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.reciprocal = function (t) {
    var e = new Ji(t.shape, "return 1.0 / x;");
    return this.compileAndRun(e, [t]);
  }, t.prototype.relu = function (t) {
    var e;
    return e = a().getBool("WEBGL_PACK") ? new Rs(t.shape, ws) : new Ji(t.shape, ns), this.compileAndRun(e, [t]);
  }, t.prototype.relu6 = function (t) {
    var e;
    return e = a().getBool("WEBGL_PACK") ? new Rs(t.shape, Cs) : new Ji(t.shape, rs), this.compileAndRun(e, [t]);
  }, t.prototype.prelu = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa(ha, t.shape, e.shape) : new ca(la, t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.elu = function (t) {
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, Es, t.dtype);
    var e = new Ji(t.shape, os);
    return this.compileAndRun(e, [t]);
  }, t.prototype.eluDer = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("\n  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));\n  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));\n", t.shape, e.shape) : new ca("return (b >= 1.0) ? a : a * (b + 1.0);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.selu = function (t) {
    var e = new Ji(t.shape, as);
    return this.compileAndRun(e, [t]);
  }, t.prototype.int = function (t) {
    var e = new Ji(t.shape, "return float(int(x));"),
        n = this.makeOutputArray(e.outputShape, "int32");
    return this.compileAndRun(e, [t], n);
  }, t.prototype.clip = function (t, e, n) {
    var r,
        o = (r = a().getBool("WEBGL_PACK_CLIP") ? new da(t.shape) : new fa(t.shape)).getCustomSetupFunc(e, n);
    return this.compileAndRun(r, [t], null, o);
  }, t.prototype.abs = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.abs(t);
    if (a().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, es, t.dtype);
    var e = new Ji(t.shape, es);
    return this.compileAndRun(e, [t]);
  }, t.prototype.complexAbs = function (t) {
    var e = this.texData.get(t.dataId),
        n = new va(t.shape),
        r = [this.makeComplexComponentTensorHandle(t, e.complexTensors.real), this.makeComplexComponentTensorHandle(t, e.complexTensors.imag)];
    return this.compileAndRun(n, r);
  }, t.prototype.sigmoid = function (t) {
    var e = new Ji(t.shape, "return 1.0 / (1.0 + exp(-1.0 * x));");
    return this.compileAndRun(e, [t]);
  }, t.prototype.softplus = function (t) {
    var e = new Ji(t.shape, "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.sin = function (t) {
    var e = new Ji(t.shape, hs);
    return this.compileAndRun(e, [t]);
  }, t.prototype.cos = function (t) {
    var e = new Ji(t.shape, ps);
    return this.compileAndRun(e, [t]);
  }, t.prototype.tan = function (t) {
    var e = new Ji(t.shape, "return tan(x);");
    return this.compileAndRun(e, [t]);
  }, t.prototype.asin = function (t) {
    var e = new Ji(t.shape, fs);
    return this.compileAndRun(e, [t]);
  }, t.prototype.acos = function (t) {
    var e = new Ji(t.shape, ds);
    return this.compileAndRun(e, [t]);
  }, t.prototype.atan = function (t) {
    var e = new Ji(t.shape, vs);
    return this.compileAndRun(e, [t]);
  }, t.prototype.atan2 = function (t, e) {
    var n = a().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new pa("\n  vec4 result = atan(a, b);\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new ca("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return atan(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, t.prototype.sinh = function (t) {
    var e = new Ji(t.shape, "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.cosh = function (t) {
    var e = new Ji(t.shape, "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.tanh = function (t) {
    var e = new Ji(t.shape, "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n");
    return this.compileAndRun(e, [t]);
  }, t.prototype.asinh = function (t) {
    var e = new Ji(t.shape, ms);
    return this.compileAndRun(e, [t]);
  }, t.prototype.acosh = function (t) {
    var e = new Ji(t.shape, gs);
    return this.compileAndRun(e, [t]);
  }, t.prototype.atanh = function (t) {
    var e = new Ji(t.shape, ys);
    return this.compileAndRun(e, [t]);
  }, t.prototype.erf = function (t) {
    var e = new Ji(t.shape, '\n  // Error function is calculated approximately with elementary function.\n  // See "Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables", Abramowitz and Stegun.\n  float p = 0.3275911;\n  float a1 = 0.254829592;\n  float a2 = -0.284496736;\n  float a3 = 1.421413741;\n  float a4 = -1.453152027;\n  float a5 = 1.061405429;\n\n  float sign = sign(x);\n  x = abs(x);\n  float t = 1.0 / (1.0 + p * x);\n  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));\n');
    return this.compileAndRun(e, [t]);
  }, t.prototype.step = function (t, e) {
    var n = new Ji(t.shape, function (t) {
      return void 0 === t && (t = 0), Zi + "\n    return x > 0.0 ? 1.0 : float(" + t + ");\n  ";
    }(e));
    return this.compileAndRun(n, [t]);
  }, t.prototype.conv2dByMatMul = function (t, e, n, r, o, i) {
    var s = t.shape,
        u = this.texData.get(t.dataId),
        l = n.inChannels,
        c = s[0] * s[1] * s[2],
        p = n.outChannels,
        f = "channelsLast" === n.dataFormat,
        d = (1 === c || 1 === p) && l > 1e3,
        v = s[2] % 2 != 0 && !!u.isPacked;

    if (d || !a().getBool("WEBGL_LAZILY_UNPACK") || !a().getBool("WEBGL_PACK_BINARY_OPERATIONS") || !v) {
      var m = f ? s[0] * s[1] * s[2] : s[0] * s[2] * s[3],
          g = this.reshape(t, [1, m, n.inChannels]),
          y = this.reshape(e, [1, n.inChannels, n.outChannels]);
      return this.reshape(this.fusedBatchMatMul({
        a: g,
        b: y,
        transposeA: !1,
        transposeB: !1,
        bias: r,
        activation: o,
        preluActivationWeights: i
      }), n.outShape);
    }

    var x = f ? s[0] * s[1] * (s[2] + 1) : s[0] * s[2] * (s[3] + 1),
        b = ut.make([1, x, n.inChannels], {
      dataId: t.dataId
    }, t.dtype, this),
        w = u.shape;
    u.shape = u.shape.slice(), u.shape[u.shape.length - 2]++, h(we(u.shape, b.shape), function () {
      return "packed reshape " + u.shape + " to " + b.shape + " isn't free";
    });
    var C = this.reshape(e, [1, n.inChannels, n.outChannels]),
        E = this.fusedBatchMatMul({
      a: b,
      b: C,
      transposeA: !1,
      transposeB: !1,
      bias: r,
      activation: o,
      preluActivationWeights: i
    }),
        R = this.texData.get(E.dataId);
    return h(R.isPacked, function () {
      return "batchMatMul result is expected to be packed";
    }), u.shape = w, R.shape = n.outShape, ut.make(n.outShape, {
      dataId: E.dataId
    }, E.dtype, this);
  }, t.prototype.conv2dWithIm2Row = function (t, e, n, r, o, a) {
    var i = n.filterWidth,
        s = n.filterHeight,
        u = n.inChannels,
        l = n.outWidth,
        c = n.outHeight,
        h = "channelsLast" === n.dataFormat,
        p = i * s * u,
        f = c * l,
        d = [p, f],
        v = t.squeeze([0]),
        m = e.reshape([1, p, -1]),
        g = new di(d, v.shape, n),
        y = this.compileAndRun(g, [v]).reshape([1, d[0], d[1]]),
        x = null != r,
        b = null != a,
        w = o ? Ns(o, !0) : null,
        C = new bi(y.shape, [1, f, n.outChannels], !0, !1, x, w, b),
        E = [y, m];
    r && E.push(r), b && E.push(a);
    var R = this.compileAndRun(C, E);
    return h ? R.reshape([1, c, l, n.outChannels]) : R.reshape([1, n.outChannels, c, l]);
  }, t.prototype.fusedConv2d = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        i = t.activation,
        s = t.preluActivationWeights;
    if (1 === r.filterHeight && 1 === r.filterWidth && 1 === r.dilationHeight && 1 === r.dilationWidth && 1 === r.strideHeight && 1 === r.strideWidth && ("SAME" === r.padInfo.type || "VALID" === r.padInfo.type)) return this.conv2dByMatMul(e, n, r, o, i, s);
    if (a().getBool("WEBGL_CONV_IM2COL") && 1 === e.shape[0]) return this.conv2dWithIm2Row(e, n, r, o, i, s);
    var u = null != o,
        l = null != s,
        c = i ? Ns(i, !1) : null,
        h = new Ia(r, u, c, l),
        p = [e, n];
    return o && p.push(o), s && p.push(s), this.compileAndRun(h, p);
  }, t.prototype.conv2d = function (t, e, n) {
    if (1 === n.filterHeight && 1 === n.filterWidth && 1 === n.dilationHeight && 1 === n.dilationWidth && 1 === n.strideHeight && 1 === n.strideWidth && ("SAME" === n.padInfo.type || "VALID" === n.padInfo.type)) return this.conv2dByMatMul(t, e, n);
    if (a().getBool("WEBGL_CONV_IM2COL") && 1 === t.shape[0]) return this.conv2dWithIm2Row(t, e, n);
    var r = new Ia(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    var r = new ba(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    var r = new xa(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.fusedDepthwiseConv2D = function (t) {
    var e,
        n = t.input,
        r = t.filter,
        o = t.convInfo,
        i = t.bias,
        s = t.activation,
        u = t.preluActivationWeights,
        l = a().getBool("WEBGL_PACK_DEPTHWISECONV") && o.strideWidth <= 2 && o.outChannels / o.inChannels == 1,
        c = s ? Ns(s, l) : null,
        h = [n, r],
        p = null != i,
        f = null != u;
    return p && h.push(i), f && h.push(u), l ? (e = new Sa(o, p, c, f), this.compileAndRun(e, h, this.makePackedTensor(o.outShape, n.dtype))) : (e = new Na(o, p, c, f), this.compileAndRun(e, h));
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    var r;
    return a().getBool("WEBGL_PACK_DEPTHWISECONV") && n.strideWidth <= 2 && n.outChannels / n.inChannels == 1 ? (r = new Sa(n), this.compileAndRun(r, [t, e], this.makePackedTensor(n.outShape, t.dtype))) : (r = new Na(n), this.compileAndRun(r, [t, e]));
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    var r = new Ra(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    var r = new Ea(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3d = function (t, e, n) {
    var r = new ka(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    var r = new Ca(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    var r = new wa(n);
    return this.compileAndRun(r, [t, e]);
  }, t.prototype.maxPool = function (t, e) {
    var n = new ki(e, "max", !1),
        r = this.makeOutputArray(n.outputShape, t.dtype);
    return this.compileAndRun(n, [t], r);
  }, t.prototype.avgPool = function (t, e) {
    var n = new ki(e, "avg", !1),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t], r);
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    var o = new ki(r, "max", !0),
        a = this.compileAndRun(o, [e]),
        i = new yi(r),
        s = this.makeOutputArray(i.outputShape, e.dtype),
        u = this.compileAndRun(i, [t, a], s);
    return a.dispose(), u;
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    var r = new Zo(n),
        o = this.makeOutputArray(r.outputShape, e.dtype);
    return this.compileAndRun(r, [t], o);
  }, t.prototype.cast = function (t, e) {
    return go(t, e, this);
  }, t.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, t.prototype.avgPool3d = function (t, e) {
    var n = new Ni(e, "avg", !1),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t], r);
  }, t.prototype.avgPool3dBackprop = function (t, e, n) {
    var r = new ta(n),
        o = this.makeOutputArray(r.outputShape, e.dtype);
    return this.compileAndRun(r, [t], o);
  }, t.prototype.maxPool3d = function (t, e) {
    var n = new Ni(e, "max", !1),
        r = this.makeOutputArray(n.outputShape, "float32");
    return this.compileAndRun(n, [t], r);
  }, t.prototype.maxPool3dBackprop = function (t, e, n, r) {
    var o = new Ni(r, "max", !0),
        a = this.compileAndRun(o, [e]),
        i = new xi(r),
        s = this.makeOutputArray(i.outputShape, e.dtype),
        u = this.compileAndRun(i, [t, a], s);
    return a.dispose(), u;
  }, t.prototype.reshape = function (t, e) {
    var n = this.texData.get(t.dataId);
    return !n.isPacked || we(t.shape, e) || null !== n.texture && we(n.shape, e) ? yo(t, e) : this.packedReshape(t, e);
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    var o = a().getBool("WEBGL_PACK_IMAGE_OPERATIONS") ? new _i(t.shape, e, n, r) : new Di(t.shape, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    var r = new Ti(t, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    var o = new Fi(t.shape, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    var r = new Oi(t, e, n);
    return this.compileAndRun(r, [t]);
  }, t.prototype.multinomial = function (t, e, n, r) {
    var o = e ? t : Qr(t),
        a = o.shape[0],
        i = o.shape[1],
        s = new wi(a, i, n),
        u = this.makeOutputArray(s.outputShape, "int32"),
        l = s.getCustomSetupFunc(r);
    return this.compileAndRun(s, [o], u, l);
  }, t.prototype.oneHot = function (t, e, n, r) {
    var o = new Ci(t.size, e, n, r);
    return this.compileAndRun(o, [t]);
  }, t.prototype.diag = function (t) {
    var e = new Ma(t.size);
    return this.compileAndRun(e, [t]);
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return tn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead"), Io(t.dataSync(), e.dataSync(), n, r, o);
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    var i = new Aa(t.shape, e.shape, r, o, a);
    return this.compileAndRun(i, [t, e, n]);
  }, t.prototype.depthToSpace = function (t, e, n) {
    h(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });
    var r = t.shape[0],
        o = "NHWC" === n ? t.shape[1] : t.shape[2],
        a = "NHWC" === n ? t.shape[2] : t.shape[3],
        i = "NHWC" === n ? t.shape[3] : t.shape[1],
        s = o * e,
        u = a * e,
        l = i / (e * e),
        c = new Fa("NHWC" === n ? [r, s, u, l] : [r, l, s, u], e, n);
    return this.compileAndRun(c, [t]);
  }, t.prototype.split = function (t, e, n) {
    return No(t, e, n);
  }, t.prototype.scatterND = function (t, e, n) {
    var r = Pr(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        l = [u / i, i],
        c = t.reshape([a, o]),
        h = e.reshape([a, i]);
    if (0 === u) return yo(bn([]), n);
    var p = Cn(0),
        f = new Pi(a, o, c.rank, h.rank, s, l);
    return this.compileAndRun(f, [h, c, p]).reshape(n);
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    var o = Pr(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.strides,
        u = o.outputSize,
        l = new Pi(i, a, t.rank, e.rank, s, [u, 1], !1);
    return this.compileAndRun(l, [e, t, r]).reshape(n);
  }, t.prototype.fft = function (t) {
    return this.fftImpl(t, !1);
  }, t.prototype.ifft = function (t) {
    return this.fftImpl(t, !0);
  }, t.prototype.fftImpl = function (t, e) {
    var n = this.texData.get(t.dataId),
        r = new za(Ua, t.shape, e),
        o = new za(Va, t.shape, e),
        a = [this.makeComplexComponentTensorHandle(t, n.complexTensors.real), this.makeComplexComponentTensorHandle(t, n.complexTensors.imag)],
        i = this.compileAndRun(r, a),
        s = this.compileAndRun(o, a),
        u = this.complex(i, s).as2D(t.shape[0], t.shape[1]);
    return i.dispose(), s.dispose(), u;
  }, t.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = Or(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3],
        l = e.reshape([i, r]),
        c = t.reshape([t.size / s, s]),
        h = new Ka(r, u, [i, s]);
    return this.compileAndRun(h, [c, l]).reshape(a);
  }, t.prototype.fill = function (t, e, n) {
    if ("string" === (n = n || B(e))) {
      var r = k(n, v(t));
      return r.fill(e), ut.make(t, {
        values: r
      }, n);
    }

    var o = new Ga(t, e),
        a = o.getCustomSetupFunc(e),
        i = this.makeOutputArray(t, n);
    return this.compileAndRun(o, [], i, a);
  }, t.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported under string dtype");
    return this.fill(t.shape, 1, t.dtype);
  }, t.prototype.zerosLike = function (t) {
    return this.fill(t.shape, "string" === t.dtype ? "" : 0, t.dtype);
  }, t.prototype.linspace = function (t, e, n) {
    return xo(t, e, n);
  }, t.prototype.makeOutputArray = function (t, e) {
    return ut.make(t, {}, e, this);
  }, t.prototype.makePackedTensor = function (t, e) {
    var n = ut.make(t, {}, e, this);
    return this.texData.get(n.dataId).isPacked = !0, n;
  }, t.prototype.unpackTensor = function (t) {
    var e = new Is(t.shape);
    return this.compileAndRun(e, [t], ut.make(e.outputShape, {}, t.dtype, this));
  }, t.prototype.packTensor = function (t) {
    var e = new Ei(t.shape);
    return this.compileAndRun(e, [t], this.makePackedTensor(t.shape, t.dtype), null, !0);
  }, t.prototype.packedReshape = function (t, e) {
    var n = t.reshape([me(t.shape)].concat(ge(t.shape))),
        r = [me(e)].concat(ge(e)),
        o = new Ai(r, n.shape);
    return this.compileAndRun(o, [n], null, null, !0).reshape(e);
  }, t.prototype.decode = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.isPacked,
        o = n.shape,
        a = n.dtype,
        i = ye(o),
        s = Pt(o),
        u = this.makeTensorHandle(o, "float32");
    return this.texData.get(u.dataId).isPacked = !0, this.texData.get(u.dataId).dtype = a, this.texData.get(u.dataId).texShape = s.map(function (t) {
      return 2 * t;
    }), e = r ? new Oa(i, s) : new _a(i, s), this.compileAndRun(e, [{
      shape: i,
      dtype: a,
      dataId: t
    }], u, null, !0), u;
  }, t.prototype.compileAndRun = function (t, e, n, r, o) {
    var i = this;
    if (void 0 === o && (o = !1), null == n && (n = t.usesPackedTextures ? this.makePackedTensor(t.outputShape, e[0].dtype) : this.makeOutputArray(t.outputShape, e[0].dtype)), 0 === n.size) return this.texData.get(n.dataId).values = I(n.dtype, 0), n;
    var s = e.map(function (e) {
      if ("complex64" === e.dtype) throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");
      var n = i.texData.get(e.dataId);

      if (null == n.texture) {
        if (!t.usesPackedTextures && v(e.shape) <= a().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM")) return {
          shape: e.shape,
          texData: null,
          isUniform: !0,
          uniformValues: n.values
        };
        t.usesPackedTextures && (n.isPacked = !0, n.shape = e.shape);
      } else if (!!n.isPacked != !!t.usesPackedTextures) e = n.isPacked ? i.unpackTensor(e) : i.packTensor(e), n = i.texData.get(e.dataId);else if (n.isPacked && !we(n.shape, e.shape)) {
        var r = e,
            o = e.shape;
        e.shape = n.shape, e = i.packedReshape(e, o), n = i.texData.get(e.dataId), r.shape = o;
      }

      return i.uploadToGPU(e.dataId), {
        shape: e.shape,
        texData: n,
        isUniform: !1
      };
    });
    this.uploadToGPU(n.dataId);

    var u,
        l = {
      shape: n.shape,
      texData: this.texData.get(n.dataId),
      isUniform: !1
    },
        c = function (t, e, n) {
      var r = "";
      e.concat(n).forEach(function (t) {
        var e = null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0,
            n = t.isUniform ? "uniform" : t.texData.texShape;
        r += t.shape + "_" + n + "_" + e;
      });
      var o = t.userCode,
          a = t.constructor.name;
      return a += "_" + r + "_" + o;
    }(t, s, l),
        h = this.getAndSaveBinary(c, function () {
      return function (t, e, n, r) {
        var o = e.userCode,
            i = n.map(function (t, n) {
          var r = {
            logicalShape: t.shape,
            texShape: t.isUniform ? null : t.texData.texShape,
            isUniform: t.isUniform,
            isPacked: !t.isUniform && t.texData.isPacked,
            flatOffset: null
          };
          return null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0 && (r.flatOffset = t.texData.slice.flatOffset), {
            name: e.variableNames[n],
            shapeInfo: r
          };
        }),
            s = i.map(function (t) {
          return t.shapeInfo;
        }),
            u = {
          logicalShape: r.shape,
          texShape: r.texData.texShape,
          isUniform: !1,
          isPacked: r.texData.isPacked,
          flatOffset: null
        },
            l = Uo(i, u, o, e.usesPackedTextures),
            c = t.createProgram(l),
            h = null,
            p = t.getUniformLocation(c, "NAN", !1);
        1 === a().getNumber("WEBGL_VERSION") && (h = t.getUniformLocation(c, "INFINITY", !1));

        for (var f = {}, d = 0; d < e.variableNames.length; d++) {
          var v = e.variableNames[d];
          f[v] = t.getUniformLocation(c, v, !1), f["offset" + v] = t.getUniformLocation(c, "offset" + v, !1);
        }

        return {
          program: e,
          source: l,
          webGLProgram: c,
          uniformLocations: f,
          inShapeInfos: s,
          outShapeInfo: u,
          infLoc: h,
          nanLoc: p
        };
      }(i.gpgpu, t, s, l);
    }),
        p = null != this.activeTimers;

    return p && (u = this.startTimer()), function (t, e, n, r, o) {
      fi(e.inShapeInfos, n), fi([e.outShapeInfo], [r]);
      var i = r.texData.texture,
          s = r.texData.texShape;
      r.texData.isPacked ? t.setOutputPackedMatrixTexture(i, s[0], s[1]) : t.setOutputMatrixTexture(i, s[0], s[1]), t.setProgram(e.webGLProgram), 1 === a().getNumber("WEBGL_VERSION") && null !== e.infLoc && t.gl.uniform1f(e.infLoc, 1 / 0), null !== e.nanLoc && t.gl.uniform1f(e.nanLoc, NaN), n.forEach(function (n, r) {
        var o = e.program.variableNames[r],
            a = e.uniformLocations[o],
            i = e.uniformLocations["offset" + o];
        if (null != a) if (n.isUniform) {
          if (v(n.shape) < 2) t.gl.uniform1f(a, n.uniformValues[0]);else {
            var s = n.uniformValues;
            s instanceof Float32Array || (s = new Float32Array(s)), t.gl.uniform1fv(a, s);
          }
        } else null != n.texData.slice && null != i && t.gl.uniform1i(i, n.texData.slice.flatOffset), t.setInputMatrixTexture(n.texData.texture, a, r);
      }), null != o && o(t, e.webGLProgram), t.executeProgram();
    }(this.gpgpu, h, s, l, r), p && (u = this.endTimer(u), this.activeTimers.push({
      name: t.constructor.name,
      query: this.getQueryTime(u)
    })), !a().getBool("WEBGL_LAZILY_UNPACK") && this.texData.get(n.dataId).isPacked && !1 === o ? this.unpackTensor(n) : n;
  }, t.prototype.getAndSaveBinary = function (t, e) {
    return t in this.binaryCache || (this.binaryCache[t] = e()), this.binaryCache[t];
  }, t.prototype.getTextureManager = function () {
    return this.textureManager;
  }, t.prototype.dispose = function () {
    this.disposed || (this.textureManager.dispose(), null != this.canvas && null != this.canvas.remove ? this.canvas.remove() : this.canvas = null, null != this.fromPixels2DContext && this.fromPixels2DContext.canvas.remove && this.fromPixels2DContext.canvas.remove(), this.gpgpuCreatedLocally && (this.gpgpu.program = null, this.gpgpu.dispose()), this.disposed = !0);
  }, t.prototype.floatPrecision = function () {
    var t = this;
    return null == this.floatPrecisionValue && (this.floatPrecisionValue = Ve(function () {
      if (!a().get("WEBGL_RENDER_FLOAT32_ENABLED")) {
        var e = a().getBool("DEBUG");
        a().set("DEBUG", !1);
        var n = t.abs(Cn(1e-8)).dataSync()[0];
        if (a().set("DEBUG", e), n > 0) return 32;
      }

      return 16;
    })), this.floatPrecisionValue;
  }, t.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, t.prototype.uploadToGPU = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.shape,
        o = n.dtype,
        a = n.values,
        i = n.texture,
        s = n.usage,
        u = n.isPacked;

    if (null == i) {
      var l,
          c = null != this.activeTimers;
      c && (l = H());
      var h = n.texShape;

      if (null == h && (h = xe(r, u), n.texShape = h), null != a) {
        var p = ye(r),
            f = void 0,
            d = h[1],
            m = h[0],
            g = a instanceof Uint8Array;
        u ? (d = (e = Lt(h[0], h[1]))[0], m = e[1], f = new Wa(p, [m, d], g)) : f = new La(p, [m, d], g);
        var y = this.makeTensorHandle([m, d], o);
        this.texData.get(y.dataId).usage = g ? At.PIXELS : At.UPLOAD, this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(y.dataId), d, m, a);
        var x = this.makeTensorHandle(f.outputShape, y.dtype);
        x.size = v(f.outputShape), this.texData.get(x.dataId).isPacked = u, this.compileAndRun(f, [y], x);
        var b = this.texData.get(x.dataId);
        n.texture = b.texture, n.texShape = b.texShape, n.isPacked = b.isPacked, n.usage = b.usage, this.disposeData(y.dataId), this.texData.delete(x.dataId), n.values = null, c && (this.uploadWaitMs += H() - l);
      } else {
        var w = this.acquireTexture(h, s, o, u);
        n.texture = w;
      }
    }
  }, t.prototype.convertAndCacheOnCPU = function (t, e) {
    var n = this.texData.get(t),
        r = n.dtype;
    return this.releaseGPUData(t), null != e && (n.values = function (t, e) {
      if ("float32" === e || "complex64" === e) return t;

      if ("int32" === e || "bool" === e) {
        for (var n = "int32" === e ? new Int32Array(t.length) : new Uint8Array(t.length), r = 0; r < n.length; ++r) n[r] = Math.round(t[r]);

        return n;
      }

      throw new Error("Unknown dtype " + e);
    }(e, r)), n.values;
  }, t.prototype.acquireTexture = function (t, e, n, r) {
    if (this.numBytesInGPU += this.computeBytes(t, n), !this.warnedAboutMemory && this.numBytesInGPU > 1024 * this.numMBBeforeWarning * 1024) {
      var o = (this.numBytesInGPU / 1024 / 1024).toFixed(2);
      this.warnedAboutMemory = !0, console.warn("High memory usage in GPU: " + o + " MB, most likely due to a memory leak");
    }

    return this.textureManager.acquireTexture(t, e, r);
  }, t.prototype.computeBytes = function (t, e) {
    return t[0] * t[1] * D(e);
  }, t;
}();

Nt() && kt.registerBackend("webgl", function () {
  return new As();
}, 2);

var Ts = mn({
  abs_: function (t) {
    var e = rn(t, "x", "abs");
    return "complex64" === e.dtype ? kt.runKernel(function (t) {
      return t.complexAbs(e);
    }, {
      $x: e
    }) : kt.runKernel(function (t, n) {
      var r = t.abs(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.toFloat().step(-1));
        }
      };
    });
  }
}),
    Ds = mn({
  acos_: function (t) {
    var e = rn(t, "x", "acos");
    return kt.runKernel(function (t, n) {
      var r = t.acos(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Cn(1).sub(n.toFloat().square()).sqrt()).neg();
        }
      };
    });
  }
}),
    _s = mn({
  acosh_: function (t) {
    var e = rn(t, "x", "acosh");
    return kt.runKernel(function (t, n) {
      var r = t.acosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(n.toFloat().square().sub(1).sqrt());
        }
      };
    });
  }
}),
    Os = mn({
  asin_: function (t) {
    var e = rn(t, "x", "asin");
    return kt.runKernel(function (t, n) {
      var r = t.asin(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Cn(1).sub(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    Fs = mn({
  asinh_: function (t) {
    var e = rn(t, "x", "asinh");
    return kt.runKernel(function (t, n) {
      var r = t.asinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(Cn(1).add(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    Ms = mn({
  atan_: function (t) {
    var e = rn(t, "x", "atan");
    return kt.runKernel(function (t, n) {
      var r = t.atan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().square().add(1));
        }
      };
    });
  }
}),
    Bs = mn({
  atanh_: function (t) {
    var e = rn(t, "x", "atanh");
    return kt.runKernel(function (t, n) {
      var r = t.atanh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(Cn(1).sub(n.toFloat().square()));
        }
      };
    });
  }
}),
    Ps = mn({
  ceil_: function (t) {
    var e = rn(t, "x", "ceil");
    return kt.runKernel(function (t) {
      return t.ceil(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    Ls = mn({
  clipByValue_: function (t, e, n) {
    var r = rn(t, "x", "clipByValue");
    return h(e <= n, function () {
      return "Error in clip: min (" + e + ") must be less than or equal to max (" + n + ").";
    }), kt.runKernel(function (t, o) {
      var a = t.clip(r, e, n);
      return o([r]), a;
    }, {
      $x: r
    }, function (t, r) {
      var o = r[0];
      return {
        $x: function () {
          return t.where(o.greaterEqual(e).logicalAnd(o.lessEqual(n)), Mn(t));
        }
      };
    });
  }
}),
    Ws = mn({
  cos_: function (t) {
    var e = rn(t, "x", "cos");
    return kt.runKernel(function (t, n) {
      var r = t.cos(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().sin().neg().mul(t);
        }
      };
    });
  }
}),
    Us = mn({
  cosh_: function (t) {
    var e = rn(t, "x", "cosh");
    return kt.runKernel(function (t, n) {
      var r = t.cosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().sinh().mulStrict(t);
        }
      };
    });
  }
}),
    Vs = mn({
  erf_: function (t) {
    var e = rn(t, "x", "erf");
    return h("int32" === e.dtype || "float32" === e.dtype, function () {
      return "Input dtype must be `int32` or `float32`.";
    }), "int32" === e.dtype && (e = e.toFloat()), kt.runKernel(function (t, n) {
      var r = t.erf(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.square().neg().exp().mul(2 / Math.sqrt(Math.PI)));
        }
      };
    });
  }
}),
    zs = mn({
  exp_: function (t) {
    var e = rn(t, "x", "exp");
    return kt.runKernel(function (t, n) {
      var r = t.exp(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      return {
        $x: function () {
          return t.mulStrict(e[0]);
        }
      };
    });
  }
}),
    Gs = mn({
  expm1_: function (t) {
    var e = rn(t, "x", "expm1");
    return kt.runKernel(function (t, n) {
      var r = t.expm1(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.exp());
        }
      };
    });
  }
}),
    Hs = mn({
  floor_: function (t) {
    var e = rn(t, "x", "floor");
    return kt.runKernel(function (t) {
      return t.floor(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    qs = mn({
  log_: function (t) {
    var e = rn(t, "x", "log");
    return kt.runKernel(function (t, n) {
      var r = t.log(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat());
        }
      };
    });
  }
}),
    $s = mn({
  log1p_: function (t) {
    var e = rn(t, "x", "log1p");
    return kt.runKernel(function (t, n) {
      var r = t.log1p(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.add(1));
        }
      };
    });
  }
}),
    Ks = mn({
  logSigmoid_: function (t) {
    var e = rn(t, "x", "logSigmoid");
    return kt.runKernel(function (t, n) {
      var r = t.softplus(e.neg()).neg();
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.neg().sigmoid());
        }
      };
    });
  }
}),
    js = mn({
  neg_: function (t) {
    var e = rn(t, "x", "neg");
    return kt.runKernel(function (t) {
      return t.neg(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return t.neg();
        }
      };
    });
  }
}),
    Xs = mn({
  reciprocal_: function (t) {
    var e = rn(t, "x", "reciprocal");
    return kt.runKernel(function (t, n) {
      var r = t.reciprocal(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.square().neg());
        }
      };
    });
  }
}),
    Ys = mn({
  round_: function (t) {
    var e = rn(t, "x", "round");
    return kt.runKernel(function (t) {
      return t.round(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    Qs = mn({
  rsqrt_: function (t) {
    var e = rn(t, "x", "rsqrt");
    return kt.runKernel(function (t, n) {
      var r = t.rsqrt(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.pow(1.5).mul(2)).neg();
        }
      };
    });
  }
}),
    Js = mn({
  sigmoid_: function (t) {
    var e = rn(t, "x", "sigmoid");
    return kt.runKernel(function (t, n) {
      var r = t.sigmoid(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.mul(Cn(1).sub(n)));
        }
      };
    });
  }
}),
    Zs = mn({
  sign_: function (t) {
    var e = rn(t, "x", "sign");
    return kt.runKernel(function (t) {
      return t.sign(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    tu = mn({
  isNaN_: function (t) {
    var e = rn(t, "x", "isNaN");
    return kt.runKernel(function (t) {
      return t.isNaN(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    eu = mn({
  isInf_: function (t) {
    var e = rn(t, "x", "isInf");
    return kt.runKernel(function (t) {
      return t.isInf(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    nu = mn({
  isFinite_: function (t) {
    var e = rn(t, "x", "isFinite");
    return kt.runKernel(function (t) {
      return t.isFinite(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    ru = mn({
  sin_: function (t) {
    var e = rn(t, "x", "sin");
    return kt.runKernel(function (t, n) {
      var r = t.sin(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().cos().mul(t);
        }
      };
    });
  }
}),
    ou = mn({
  sinh_: function (t) {
    var e = rn(t, "x", "sinh");
    return kt.runKernel(function (t, n) {
      var r = t.sinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().cosh().mulStrict(t);
        }
      };
    });
  }
}),
    au = mn({
  softplus_: function (t) {
    var e = rn(t, "x", "softplus");
    return kt.runKernel(function (t, n) {
      var r = t.softplus(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.sigmoid());
        }
      };
    });
  }
}),
    iu = mn({
  sqrt_: function (t) {
    var e = rn(t, "x", "sqrt");
    return kt.runKernel(function (t, n) {
      var r = t.sqrt(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().sqrt().mul(2));
        }
      };
    });
  }
}),
    su = mn({
  square_: function (t) {
    var e = rn(t, "x", "square");
    return kt.runKernel(function (t, n) {
      return n([e]), t.square(e);
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.toFloat().mul(2));
        }
      };
    });
  }
}),
    uu = mn({
  step_: function (t, e) {
    void 0 === e && (e = 0);
    var n = rn(t, "x", "step");
    return kt.runKernel(function (t) {
      return t.step(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return Mn(t);
        }
      };
    });
  }
}),
    lu = mn({
  tan_: function (t) {
    var e = rn(t, "x", "tan");
    return kt.runKernel(function (t, n) {
      var r = t.tan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.cos().square());
        }
      };
    });
  }
}),
    cu = mn({
  tanh_: function (t) {
    var e = rn(t, "x", "tanh");
    return kt.runKernel(function (t, n) {
      var r = t.tanh(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Cn(1).sub(n.square()).mulStrict(t);
        }
      };
    });
  }
});

exports.tanh = cu;
exports.tan = lu;
exports.step = uu;
exports.square = su;
exports.sqrt = iu;
exports.softplus = au;
exports.sinh = ou;
exports.sin = ru;
exports.isFinite = nu;
exports.isInf = eu;
exports.isNaN = tu;
exports.sign = Zs;
exports.sigmoid = Js;
exports.rsqrt = Qs;
exports.round = Ys;
exports.reciprocal = Xs;
exports.neg = js;
exports.logSigmoid = Ks;
exports.log1p = $s;
exports.log = qs;
exports.floor = Hs;
exports.expm1 = Gs;
exports.exp = zs;
exports.erf = Vs;
exports.cosh = Us;
exports.cos = Ws;
exports.clipByValue = Ls;
exports.ceil = Ps;
exports.atanh = Bs;
exports.atan = Ms;
exports.asinh = Fs;
exports.asin = Os;
exports.acosh = _s;
exports.acos = Ds;
exports.abs = Ts;

function hu(t, e, n, r, o, a) {
  var i,
      s,
      u = rn(t, "x", "batchNorm"),
      l = rn(e, "mean", "batchNorm"),
      c = rn(n, "variance", "batchNorm");
  return null != o && (i = rn(o, "scale", "batchNorm")), null != r && (s = rn(r, "offset", "batchNorm")), h(2 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), h(2 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank " + l.rank + ".";
  }), h(2 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank " + c.rank + ".";
  }), null != i && h(2 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank " + i.rank + ".";
  }), null != s && h(2 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank " + s.rank + ".";
  }), du(u, l, c, s, i, a);
}

function pu(t, e, n, r, o, a) {
  var i,
      s,
      u = rn(t, "x", "batchNorm"),
      l = rn(e, "mean", "batchNorm"),
      c = rn(n, "variance", "batchNorm");
  return null != o && (i = rn(o, "scale", "batchNorm")), null != r && (s = rn(r, "offset", "batchNorm")), h(3 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), h(3 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank " + l.rank + ".";
  }), h(3 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank " + c.rank + ".";
  }), null != i && h(3 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank " + i.rank + ".";
  }), null != s && h(3 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank " + s.rank + ".";
  }), du(u, l, c, s, i, a);
}

function fu(t, e, n, r, o, a) {
  var i,
      s,
      u = rn(t, "x", "batchNorm"),
      l = rn(e, "mean", "batchNorm"),
      c = rn(n, "variance", "batchNorm");
  return null != o && (i = rn(o, "scale", "batchNorm")), null != r && (s = rn(r, "offset", "batchNorm")), h(4 === u.rank, function () {
    return "Error in batchNorm4D: x must be rank 4 but got rank " + u.rank + ".";
  }), h(4 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank " + l.rank + ".";
  }), h(4 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank " + c.rank + ".";
  }), null != i && h(4 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank " + i.rank + ".";
  }), null != s && h(4 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank " + s.rank + ".";
  }), du(u, l, c, s, i, a);
}

function du(t, e, n, r, o, a) {
  null == a && (a = .001);
  var i,
      s,
      u,
      l = rn(t, "x", "batchNorm"),
      c = rn(e, "mean", "batchNorm"),
      p = rn(n, "variance", "batchNorm");
  null != o && (i = rn(o, "scale", "batchNorm")), null != r && (s = rn(r, "offset", "batchNorm")), h(c.rank === p.rank, function () {
    return "Batch normalization gradient requires mean and variance to have equal ranks.";
  }), h(null == s || c.rank === s.rank, function () {
    return "Batch normalization gradient requires mean and offset to have equal ranks.";
  }), h(null == i || c.rank === i.rank, function () {
    return "Batch normalization gradient requires mean and scale to have equal ranks.";
  }), u = 0 === l.rank || 1 === l.rank ? l.as4D(1, 1, 1, l.size) : 2 === l.rank ? l.as4D(1, 1, l.shape[0], l.shape[1]) : 3 === l.rank ? l.as4D(1, l.shape[0], l.shape[1], l.shape[2]) : l;
  return kt.runKernel(function (t, e) {
    var n = t.batchNormalization(u, vu(c), vu(p), a, vu(i), vu(s));
    return e([l, c, p, i]), n;
  }, {
    $x: l,
    $mean: c,
    $variance: p,
    $scale: i,
    $offset: s
  }, function (t, e) {
    var n = e,
        r = n[0],
        o = n[1],
        i = n[2],
        s = n[3],
        l = null == s ? Cn(1) : s,
        c = no(o.shape, u.shape),
        h = [];

    if (1 === o.rank) {
      for (var p = 0; p < u.shape.length - 1; ++p) h.push(u.shape[p]);

      h.push(1);
    }

    var f = r.sub(o),
        d = t.mul(l),
        v = Qs(i.add(Cn(a))),
        m = v.mul(v).mul(v).mul(Cn(-.5));
    return {
      $x: function () {
        return 1 === o.rank ? t.mul(Rr(v.as4D(1, 1, 1, o.shape[0]), h)).mul(l).reshape(r.shape) : t.mul(v).mul(l).reshape(r.shape);
      },
      $mean: function () {
        var t = v.mul(Cn(-1)).mul(d);
        return 1 === o.rank && (t = t.sum(c)), t.reshape(o.shape);
      },
      $variance: function () {
        var t = m.mul(f).mul(d);
        return 1 === o.rank && (t = t.sum(c)), t.reshape(o.shape);
      },
      $scale: function () {
        var e = f.mul(v),
            n = t.mul(e);
        return 1 === o.rank && (n = n.sum(c)), n.reshape(o.shape);
      },
      $offset: function () {
        var e = t;
        return 1 === o.rank && (e = e.sum(c)), e.reshape(o.shape);
      }
    };
  }).reshape(l.shape);
}

function vu(t) {
  return null == t ? null : 0 === t.rank ? t.as1D() : 1 === t.rank ? t : 2 === t.rank ? t.as4D(1, 1, t.shape[0], t.shape[1]) : 3 === t.rank ? t.as4D(1, t.shape[0], t.shape[1], t.shape[2]) : t;
}

function mu() {
  Be("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon");
}

var gu = mn({
  batchNormalization2d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), mu(), hu(t, e, n, a, o, r);
  }
}),
    yu = mn({
  batchNormalization3d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), mu(), pu(t, e, n, a, o, r);
  }
}),
    xu = mn({
  batchNormalization4d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), mu(), fu(t, e, n, a, o, r);
  }
}),
    bu = mn({
  batchNormalization_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), mu(), du(t, e, n, a, o, r);
  }
}),
    wu = mn({
  batchNorm_: du
}),
    Cu = mn({
  batchNorm2d_: hu
}),
    Eu = mn({
  batchNorm3d_: pu
}),
    Ru = mn({
  batchNorm4d_: fu
});
exports.batchNorm4d = Ru;
exports.batchNorm3d = Eu;
exports.batchNorm2d = Cu;
exports.batchNorm = wu;
exports.batchNormalization = bu;
exports.batchNormalization4d = xu;
exports.batchNormalization3d = yu;
exports.batchNormalization2d = gu;

var Iu = mn({
  logicalAnd_: function (t, e) {
    var n = rn(t, "a", "logicalAnd", "bool"),
        r = rn(e, "b", "logicalAnd", "bool");
    return ro(n.shape, r.shape), kt.runKernel(function (t) {
      return t.logicalAnd(n, r);
    }, {
      $a: n,
      $b: r
    });
  }
}),
    ku = mn({
  logicalNot_: function (t) {
    var e = rn(t, "x", "logicalNot", "bool");
    return kt.runKernel(function (t) {
      return t.logicalNot(e);
    }, {
      $x: e
    });
  }
}),
    Nu = mn({
  logicalOr_: function (t, e) {
    var n = rn(t, "a", "logicalOr", "bool"),
        r = rn(e, "b", "logicalOr", "bool");
    return ro(n.shape, r.shape), kt.runKernel(function (t) {
      return t.logicalOr(n, r);
    }, {
      $a: n,
      $b: r
    });
  }
}),
    Su = mn({
  logicalXor_: function (t, e) {
    var n = rn(t, "a", "logicalXor", "bool"),
        r = rn(e, "b", "logicalXor", "bool");
    return ro(n.shape, r.shape), Nu(t, e).logicalAnd(Iu(t, e).logicalNot());
  }
}),
    Au = mn({
  where_: function (t, e, n) {
    var r = rn(e, "a", "where"),
        o = rn(n, "b", "where"),
        a = rn(t, "condition", "where", "bool");
    return p(r.shape, o.shape, "Error in where: "), 1 === a.rank ? h(a.shape[0] === r.shape[0], function () {
      return "The first dimension of `a` must match the size of `condition`.";
    }) : p(a.shape, o.shape, "Error in where: "), kt.runKernel(function (t, e) {
      var n = t.select(a, r, o);
      return e([a]), n;
    }, {
      $condition: a,
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0];
      return {
        $condition: function () {
          return Mn(n).toFloat();
        },
        $a: function () {
          return t.mul(n.cast(t.dtype));
        },
        $b: function () {
          return t.mul(n.logicalNot().cast(t.dtype));
        }
      };
    });
  }
}),
    Tu = function (t) {
  return n(this, void 0, void 0, function () {
    var e, n, o;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return [4, (e = rn(t, "condition", "whereAsync", "bool")).data()];

        case 1:
          return n = r.sent(), o = To(e.shape, n), t !== e && e.dispose(), [2, o];
      }
    });
  });
};

exports.whereAsync = Tu;
exports.where = Au;
exports.logicalXor = Su;
exports.logicalOr = Nu;
exports.logicalNot = ku;
exports.logicalAnd = Iu;

var Du = mn({
  add_: function (t, e) {
    var n,
        r = rn(t, "a", "add"),
        o = rn(e, "b", "add");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t) {
      return t.add(r, o);
    }, {
      $a: r,
      $b: o
    }, function (t) {
      return {
        $a: function () {
          var e = t,
              n = no(r.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
        },
        $b: function () {
          var e = t,
              n = no(o.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(o.shape);
        }
      };
    });
  }
}),
    _u = mn({
  addN_: function (t) {
    h(Array.isArray(t), function () {
      return "The argument passed to tf.addN() must be a list of tensors";
    }), h(t.length >= 1, function () {
      return "Must pass at least one tensor to tf.addN(), but got " + t.length;
    });
    var e = t.map(function (t, e) {
      return rn(t, "tensors" + e, "addN");
    }),
        n = e[0];
    e.forEach(function (t) {
      if (t.dtype !== n.dtype) throw new Error("All tensors passed to tf.addN() must have the same dtype");
    }), e.forEach(function (t) {
      if (!m(t.shape, n.shape)) throw new Error("All tensors passed to tf.addN() must have the same shape");
    });
    var r = e;
    return kt.runKernel(function (t) {
      return t.addN(e);
    }, r, function (t) {
      var n = {};
      return e.forEach(function (e, r) {
        n[r] = function () {
          return t.clone();
        };
      }), n;
    });
  }
}),
    Ou = mn({
  addStrict_: function (t, e) {
    var n = rn(t, "a", "addStrict"),
        r = rn(e, "b", "addStrict");
    return p(n.shape, r.shape, "Error in addStrict: "), n.add(r);
  }
}),
    Fu = mn({
  atan2_: function (t, e) {
    var n,
        r = rn(t, "a", "atan2"),
        o = rn(e, "b", "atan2");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t, e) {
      var n = t.atan2(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = Du(n.square(), r.square()),
              o = t.mul(r.div(e)),
              i = no(n.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(n.shape);
        },
        $b: function () {
          var e = Du(n.square(), r.square()),
              o = js(t.mul(n.div(e))),
              i = no(r.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(r.shape);
        }
      };
    });
  }
}),
    Mu = mn({
  div_: function (t, e) {
    var n,
        r = rn(t, "a", "div"),
        o = rn(e, "b", "div");
    if (n = xt(r, o), r = n[0], o = n[1], "int32" === r.dtype && "int32" === o.dtype) return Pu(r, o);
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t, e) {
      var n = t.realDivide(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.div(r.toFloat()),
              o = no(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = no(r.shape, a);
          o.length > 0 && (e = e.sum(o).reshape(r.shape));
          var i = r.square();
          return e.div(i.toFloat()).neg();
        }
      };
    });
  }
}),
    Bu = mn({
  divStrict_: function (t, e) {
    var n = rn(t, "a", "div"),
        r = rn(e, "b", "div");
    return p(n.shape, r.shape, "Error in divideStrict: "), n.div(r);
  }
}),
    Pu = mn({
  floorDiv_: function (t, e) {
    var n,
        r = rn(t, "a", "floorDiv"),
        o = rn(e, "b", "floorDiv");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t, e) {
      var n = t.floorDiv(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.div(r.toFloat()),
              o = no(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = no(r.shape, a);
          o.length > 0 && (e = e.sum(o).reshape(r.shape));
          var i = r.square();
          return e.div(i.toFloat()).neg();
        }
      };
    });
  }
}),
    Lu = mn({
  maximum_: function (t, e) {
    var n,
        r = rn(t, "a", "maximum"),
        o = rn(e, "b", "maximum");
    return n = xt(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), ro(r.shape, o.shape), kt.runKernel(function (t, e) {
      var n = t.maximum(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return t.mul(n.greaterEqual(r).toFloat());
        },
        $b: function () {
          return t.mul(n.less(r).toFloat());
        }
      };
    });
  }
}),
    Wu = mn({
  maximumStrict_: function (t, e) {
    var n = rn(t, "a", "maximumStrict"),
        r = rn(e, "b", "maximumStrict");
    return p(n.shape, r.shape, "Error in maximumStrict: "), n.maximum(r);
  }
}),
    Uu = mn({
  minimum_: function (t, e) {
    var n,
        r = rn(t, "a", "minimum"),
        o = rn(e, "b", "minimum");
    return n = xt(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), ro(r.shape, o.shape), kt.runKernel(function (t, e) {
      var n = t.minimum(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return t.mul(n.lessEqual(r).toFloat());
        },
        $b: function () {
          return t.mul(n.greater(r).toFloat());
        }
      };
    });
  }
}),
    Vu = mn({
  minimumStrict_: function (t, e) {
    var n = rn(t, "a", "minimumStrict"),
        r = rn(e, "b", "minimumStrict");
    return p(n.shape, r.shape, "Error in minimumStrict: "), n.minimum(r);
  }
}),
    zu = mn({
  mod_: function (t, e) {
    var n,
        r = rn(t, "a", "mod"),
        o = rn(e, "b", "mod");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t, e) {
      var n = t.mod(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = no(n.shape, a);
          return e.length > 0 ? t.sum(e).reshape(n.shape) : t;
        },
        $b: function () {
          var e = t.mul(n.div(r).floor().neg()),
              o = no(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    });
  }
}),
    Gu = mn({
  modStrict_: function (t, e) {
    var n = rn(t, "a", "modStrict"),
        r = rn(e, "b", "modStrict");
    return p(n.shape, r.shape, "Error in modStrict: "), n.mod(r);
  }
}),
    Hu = mn({
  mul_: function (t, e) {
    var n,
        r = rn(t, "a", "mul"),
        o = rn(e, "b", "mul");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t, e) {
      var n = t.multiply(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = t.mul(r.toFloat()),
              o = no(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        $b: function () {
          var e = t.mul(n.toFloat()),
              o = no(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    });
  }
}),
    qu = mn({
  mulStrict_: function (t, e) {
    var n = rn(t, "a", "mul"),
        r = rn(e, "b", "mul");
    return p(n.shape, r.shape, "Error in multiplyStrict: "), n.mul(r);
  }
}),
    $u = mn({
  pow_: function (t, e) {
    var n = rn(t, "base", "pow"),
        r = rn(e, "exp", "pow"),
        o = ro(n.shape, r.shape);
    return t = n.cast(gt(n.dtype, r.dtype)), e = r.cast(gt(n.dtype, r.dtype)), kt.runKernel(function (t, e) {
      var o = t.pow(n, r);
      return e([n, r, o]), o;
    }, {
      $base: n,
      $exp: r
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          a = e[2];
      return {
        $base: function () {
          var e = r.toFloat(),
              a = t.mul(e.mul(n.pow(e.sub(Cn(1))))),
              i = no(n.shape, o);
          return i.length > 0 && (a = a.sum(i)), a.reshape(n.shape);
        },
        $exp: function () {
          var e = n.greater(0),
              i = n.log().where(e, Mn(n)),
              s = t.mul(a.mul(i)),
              u = no(r.shape, o);
          return u.length > 0 && (s = s.sum(u)), s.reshape(r.shape);
        }
      };
    });
  }
}),
    Ku = mn({
  powStrict_: function (t, e) {
    return p(t.shape, e.shape, "Error in powStrict: "), t.pow(e);
  }
}),
    ju = mn({
  squaredDifference_: function (t, e) {
    var n,
        r = rn(t, "a", "squaredDifference"),
        o = rn(e, "b", "squaredDifference");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t, e) {
      var n = t.squaredDifference(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = Cn(2);
      return {
        $a: function () {
          return t.mul(n.sub(r).mul(o));
        },
        $b: function () {
          return t.mul(r.sub(n).mul(o));
        }
      };
    });
  }
}),
    Xu = mn({
  squaredDifferenceStrict_: function (t, e) {
    var n = rn(t, "a", "squaredDifferenceStrict"),
        r = rn(e, "b", "squaredDifferenceStrict");
    return p(n.shape, r.shape, "Error in squaredDifferenceStrict: "), n.squaredDifference(r);
  }
}),
    Yu = mn({
  sub_: function (t, e) {
    var n,
        r = rn(t, "a", "sub"),
        o = rn(e, "b", "sub");
    n = xt(r, o), r = n[0], o = n[1];
    var a = ro(r.shape, o.shape);
    return kt.runKernel(function (t) {
      return t.subtract(r, o);
    }, {
      $a: r,
      $b: o
    }, function (t) {
      return {
        $a: function () {
          var e = t,
              n = no(r.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
        },
        $b: function () {
          var e = t,
              n = no(o.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.neg().reshape(o.shape);
        }
      };
    });
  }
}),
    Qu = mn({
  subStrict_: function (t, e) {
    var n = rn(t, "a", "subStrict"),
        r = rn(e, "b", "subStrict");
    return p(n.shape, r.shape, "Error in subStrict: "), n.sub(r);
  }
});

exports.subStrict = Qu;
exports.sub = Yu;
exports.squaredDifferenceStrict = Xu;
exports.squaredDifference = ju;
exports.powStrict = Ku;
exports.pow = $u;
exports.mulStrict = qu;
exports.mul = Hu;
exports.modStrict = Gu;
exports.mod = zu;
exports.minimumStrict = Vu;
exports.minimum = Uu;
exports.maximumStrict = Wu;
exports.maximum = Lu;
exports.floorDiv = Pu;
exports.divStrict = Bu;
exports.div = Mu;
exports.atan2 = Fu;
exports.addStrict = Ou;
exports.addN = _u;
exports.add = Du;
var Ju = mn({
  equal_: function (t, e) {
    var n,
        r = rn(t, "a", "equal"),
        o = rn(e, "b", "equal");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t) {
      return t.equal(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    Zu = mn({
  equalStrict_: function (t, e) {
    var n = rn(t, "a", "equalStrict"),
        r = rn(e, "b", "equalStrict");
    return p(n.shape, r.shape, "Error in equalStrict: "), n.equal(r);
  }
}),
    tl = mn({
  greater_: function (t, e) {
    var n,
        r = rn(t, "a", "greater"),
        o = rn(e, "b", "greater");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t) {
      return t.greater(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    el = mn({
  greaterEqual_: function (t, e) {
    var n,
        r = rn(t, "a", "greaterEqual"),
        o = rn(e, "b", "greaterEqual");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t, e) {
      var n = t.greaterEqual(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          return Mn(n);
        },
        $b: function () {
          return Mn(r);
        }
      };
    });
  }
}),
    nl = mn({
  greaterEqualStrict_: function (t, e) {
    var n = rn(t, "a", "greaterEqualStrict"),
        r = rn(e, "b", "greaterEqualStrict");
    return p(n.shape, r.shape, "Error in greaterEqualStrict: "), n.greaterEqual(r);
  }
}),
    rl = mn({
  greaterStrict_: function (t, e) {
    var n = rn(t, "a", "greaterStrict"),
        r = rn(e, "b", "greaterStrict");
    return p(n.shape, r.shape, "Error in greaterStrict: "), n.greater(r);
  }
}),
    ol = mn({
  less_: function (t, e) {
    var n,
        r = rn(t, "a", "less"),
        o = rn(e, "b", "less");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t) {
      return t.less(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    al = mn({
  lessEqual_: function (t, e) {
    var n,
        r = rn(t, "a", "lessEqual"),
        o = rn(e, "b", "lessEqual");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t) {
      return t.lessEqual(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    il = mn({
  lessEqualStrict_: function (t, e) {
    var n = rn(t, "a", "lessEqualStrict"),
        r = rn(e, "b", "lessEqualStrict");
    return p(n.shape, r.shape, "Error in lessEqualStrict: "), n.lessEqual(r);
  }
}),
    sl = mn({
  lessStrict_: function (t, e) {
    var n = rn(t, "a", "lessStrict"),
        r = rn(e, "b", "lessStrict");
    return p(n.shape, r.shape, "Error in lessStrict: "), n.less(r);
  }
}),
    ul = mn({
  notEqual_: function (t, e) {
    var n,
        r = rn(t, "a", "notEqual"),
        o = rn(e, "b", "notEqual");
    return n = xt(r, o), r = n[0], o = n[1], ro(r.shape, o.shape), kt.runKernel(function (t) {
      return t.notEqual(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    ll = mn({
  notEqualStrict_: function (t, e) {
    var n = rn(t, "a", "notEqualStrict"),
        r = rn(e, "b", "notEqualStrict");
    return p(n.shape, r.shape, "Error in notEqualStrict: "), n.notEqual(r);
  }
});
exports.notEqualStrict = ll;
exports.notEqual = ul;
exports.lessStrict = sl;
exports.lessEqualStrict = il;
exports.lessEqual = al;
exports.less = ol;
exports.greaterStrict = rl;
exports.greaterEqualStrict = nl;
exports.greaterEqual = el;
exports.greater = tl;
exports.equalStrict = Zu;
exports.equal = Ju;

function cl(t, e) {
  for (var n = [], r = t; r < e; ++r) n.push(r);

  return n;
}

function hl(t) {
  for (var e = [], n = 0; n < t.length; ++n) for (var r = 0; r < t[n].length; ++r) e.push(t[n][r]);

  return e;
}

var pl = mn({
  gather_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = rn(t, "x", "gather"),
        o = rn(e, "indices", "gather", "int32");
    n = E(n, r.shape)[0];

    var a = function (t, e, n) {
      for (var r = t.shape[n], o = [], a = 1, i = 1, s = 0; s < n; s++) o.push(t.shape[s]), a *= t.shape[s];

      for (s = 0; s < e.rank; s++) o.push(e.shape[s]);

      for (s = n + 1; s < t.rank; s++) o.push(t.shape[s]), i *= t.shape[s];

      return {
        batchSize: a,
        sliceSize: i,
        dimSize: r,
        outputShape: o
      };
    }(r, o, n);

    return kt.runKernel(function (t, e) {
      var a = t.gather(r, o.flatten(), n);
      return e([o]), a;
    }, {
      $x: r
    }, function (t, e) {
      var o = e[0];
      return {
        $x: function () {
          var e = r.shape,
              a = o.size,
              i = e.slice(0, n),
              s = i.length,
              u = e.slice(n, e.length).slice(1),
              l = u.length,
              c = cl(0, s),
              h = cl(s + 1, s + 1 + l),
              p = hl([i, [a], u]),
              f = t.reshape(p),
              d = o.reshape([a]),
              v = hl([[s], c, h]),
              m = f.transpose(v),
              g = fl(m, d, r.shape[n]),
              y = pn(v);
          return g = g.transpose(y);
        }
      };
    }).reshape(a.outputShape);
  }
}),
    fl = mn({
  unsortedSegmentSum_: function (t, e, n) {
    var r = rn(t, "x", "unsortedSegmentSum"),
        o = rn(e, "segmentIds", "unsortedSegmentSum", "int32");
    return h(g(n), function () {
      return "numSegments must be of dtype int";
    }), kt.runKernel(function (t, e) {
      var a = t.unsortedSegmentSum(r, o, n);
      return e([o]), a;
    }, {
      $x: r
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return function (t, e) {
            for (var n = Lu(e, Mn(e)), r = pl(t, n), o = el(e, Cn(0, "int32")), a = r.rank - o.rank, i = 0; i < a; ++i) o = sr(o, i + 1);

            o = Iu(o, An(r.shape, "bool"));
            var s = Mn(r);
            return Au(o, r, s);
          }(t, n);
        }
      };
    });
  }
});
exports.unsortedSegmentSum = fl;
exports.gather = pl;

var dl = function (t, e, o) {
  return n(this, void 0, void 0, function () {
    var n, a, i, s, u, l, c, f, d, v, m, g, y;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          for (n = rn(t, "tensor", "boolMask"), a = rn(e, "mask", "boolMask", "bool"), i = null == o ? 0 : o, s = a.rank, u = n.shape, h(s > 0, function () {
            return "mask cannot be scalar";
          }), p(u.slice(i, i + s), a.shape, "mask's shape must match the first K dimensions of tensor's shape,"), l = 1, c = i; c < i + s; c++) l *= u[c];

          return f = u.slice(0, i).concat([l], u.slice(i + s)), d = n.reshape(f), v = a.reshape([-1]), [4, Tu(v)];

        case 1:
          return m = r.sent(), g = m.squeeze([1]), y = pl(d, g, i), t !== n && n.dispose(), e !== a && a.dispose(), g.dispose(), d.dispose(), v.dispose(), m.dispose(), [2, y];
      }
    });
  });
};

exports.booleanMaskAsync = dl;

function vl(t, e, n, r, o, a, i) {
  void 0 === a && (a = "NHWC"), h(t.length === e.rank, function () {
    return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
  });
  var s = t,
      u = e,
      l = !1;
  3 === e.rank && (l = !0, u = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]), s = [1, t[0], t[1], t[2]]), h(4 === s.length, function () {
    return "Error in conv2dDerInput: inShape must be length 4, but got length " + s.length + ".";
  }), h(4 === u.rank, function () {
    return "Error in conv2dDerInput: dy must be rank 4, but got rank " + u.rank;
  }), h(4 === n.rank, function () {
    return "Error in conv2dDerInput: filter must be rank 4, but got rank " + n.rank;
  });
  var c = "NHWC" === a ? s[3] : s[1],
      p = "NHWC" === a ? u.shape[3] : u.shape[1];
  h(c === n.shape[2], function () {
    return "Error in conv2dDerInput: depth of input (" + c + ") must match input depth for filter " + n.shape[2] + ".";
  }), h(p === n.shape[3], function () {
    return "Error in conv2dDerInput: depth of output (" + p + ") must match output depth for filter " + n.shape[3] + ".";
  }), null != i && h(g(o), function () {
    return "Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + o + ".";
  });
  var f = mo(a),
      d = io(s, n.shape, r, 1, o, i, !1, f),
      v = kt.runKernel(function (t, e) {
    var r = t.conv2dDerInput(u, n, d);
    return e([n, u]), r;
  }, {
    dy4D: u,
    filter: n
  }, function (t, e) {
    var n = e[0],
        s = e[1];
    return {
      dy4D: function () {
        return xl(t, n, r, o, a, 1, i);
      },
      filter: function () {
        return wl(t, s, n.shape, r, o, a, i);
      }
    };
  });
  return l ? v.as3D(v.shape[1], v.shape[2], v.shape[3]) : v;
}

function ml(t) {
  var e = function (t) {
    return "number" == typeof t ? [t, t, t] : 2 === t.length ? [t[0], t[1], 1] : t;
  }(t),
      n = e[0],
      r = e[1],
      o = e[2];

  return 1 === n && 1 === r && 1 === o;
}

function gl(t, e, n, r, o) {
  h(t.length === e.rank, function () {
    return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
  });
  var a = t,
      i = e,
      s = !1;
  4 === e.rank && (s = !0, i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3]), a = [1, t[0], t[1], t[2], t[3]]);
  var u = a[4],
      l = i.shape[4];
  h(5 === a.length, function () {
    return "Error in conv3dDerInput: inShape must be length 5, but got length " + a.length + ".";
  }), h(5 === i.rank, function () {
    return "Error in conv3dDerInput: dy must be rank 5, but got rank " + i.rank;
  }), h(5 === n.rank, function () {
    return "Error in conv3dDerInput: filter must be rank 5, but got rank " + n.rank;
  }), h(u === n.shape[3], function () {
    return "Error in conv3dDerInput: depth of input (" + u + ") must match input depth for filter " + n.shape[3] + ".";
  }), h(l === n.shape[4], function () {
    return "Error in conv3dDerInput: depth of output (" + l + ") must match output depth for filter " + n.shape[4] + ".";
  });
  var c = so(a, n.shape, r, 1, o),
      p = kt.runKernel(function (t) {
    return t.conv3dDerInput(i, n, c);
  }, {
    dy5D: i
  });
  return s ? p.as4D(p.shape[1], p.shape[2], p.shape[3], p.shape[4]) : p;
}

var yl = mn({
  conv1d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NWC"), void 0 === a && (a = 1);
    var s = rn(t, "x", "conv1d"),
        u = rn(e, "filter", "conv1d"),
        l = s,
        c = !1;
    2 === s.rank && (c = !0, l = s.as3D(1, s.shape[0], s.shape[1])), h(3 === l.rank, function () {
      return "Error in conv1d: input must be rank 3, but got rank " + l.rank + ".";
    }), h(3 === u.rank, function () {
      return "Error in conv1d: filter must be rank 3, but got rank " + u.rank + ".";
    }), null != i && h(g(r), function () {
      return "Error in conv1d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    }), h(l.shape[2] === u.shape[1], function () {
      return "Error in conv1d: depth of input (" + l.shape[2] + ") must match input depth for filter " + u.shape[1] + ".";
    }), h(vo(n, a), function () {
      return "Error in conv1D: Either stride or dilation must be 1. Got stride " + n + " and dilation '" + a + "'";
    }), h("NWC" === o, function () {
      return "Error in conv1d: got dataFormat of " + o + " but only NWC is currently supported.";
    });
    var p = u.as4D(1, u.shape[0], u.shape[1], u.shape[2]),
        f = l.as4D(l.shape[0], 1, l.shape[1], l.shape[2]),
        d = xl(f, p, [1, n], r, "NHWC", [1, a], i);
    return c ? d.as2D(d.shape[2], d.shape[3]) : d.as3D(d.shape[0], d.shape[2], d.shape[3]);
  }
}),
    xl = mn({
  conv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = rn(t, "x", "conv2d"),
        u = rn(e, "filter", "conv2d"),
        l = s,
        c = !1;
    3 === s.rank && (c = !0, l = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), h(4 === l.rank, function () {
      return "Error in conv2d: input must be rank 4, but got rank " + l.rank + ".";
    }), h(4 === u.rank, function () {
      return "Error in conv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), null != i && h(g(r), function () {
      return "Error in conv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    });
    var p = "NHWC" === o ? l.shape[3] : l.shape[1];
    h(p === u.shape[2], function () {
      return "Error in conv2d: depth of input (" + p + ") must match input depth for filter " + u.shape[2] + ".";
    }), h(vo(n, a), function () {
      return "Error in conv2D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    });
    var f = mo(o),
        d = io(l.shape, u.shape, n, a, r, i, !1, f),
        v = kt.runKernel(function (t, e) {
      var n = t.conv2d(l, u, d);
      return e([u, l]), n;
    }, {
      x: l,
      $filter: u
    }, function (t, e) {
      var i = e,
          s = i[0],
          u = i[1];
      return h(fo(a), function () {
        return "Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      }), {
        x: function () {
          return Cl(u.shape, t, s, n, r, o);
        },
        $filter: function () {
          return wl(u, t, s.shape, n, r, o);
        }
      };
    });
    return c ? v.as3D(v.shape[1], v.shape[2], v.shape[3]) : v;
  }
}),
    bl = mn({
  conv3d_: function (t, e, n, r, o, a) {
    void 0 === o && (o = "NDHWC"), void 0 === a && (a = [1, 1, 1]);
    var i = rn(t, "x", "conv3d"),
        s = rn(e, "filter", "conv3d"),
        u = i,
        l = !1;
    4 === i.rank && (l = !0, u = i.as5D(1, i.shape[0], i.shape[1], i.shape[2], i.shape[3])), h(5 === u.rank, function () {
      return "Error in conv3d: input must be rank 5, but got rank " + u.rank + ".";
    }), h(5 === s.rank, function () {
      return "Error in conv3d: filter must be rank 5, but got rank " + s.rank + ".";
    }), h(u.shape[4] === s.shape[3], function () {
      return "Error in conv3d: depth of input (" + u.shape[4] + ") must match input depth for filter " + s.shape[3] + ".";
    }), h(function (t, e) {
      return ml(t) || ml(e);
    }(n, a), function () {
      return "Error in conv3D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), h("NDHWC" === o, function () {
      return "Error in conv3d: got dataFormat of " + o + " but only NDHWC is currently supported.";
    });
    var c = so(u.shape, s.shape, n, a, r),
        p = kt.runKernel(function (t, e) {
      var n = t.conv3d(u, s, c);
      return e([u, s]), n;
    }, {
      x: u,
      $filter: s
    }, function (t, e) {
      h(ml(a), function () {
        return "Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      });
      var o = e[0],
          i = e[1];
      return {
        x: function () {
          return gl(o.shape, t, i, n, r);
        },
        $filter: function () {
          return function (t, e, n, r, o) {
            var a = t;
            4 === t.rank && (a = t.as5D(1, t.shape[0], t.shape[1], t.shape[2], t.shape[3]));
            var i = e;
            4 === i.rank && (i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3])), h(5 === a.rank, function () {
              return "Error in conv3dDerFilter: input must be rank 5, but got shape " + a.shape + ".";
            }), h(5 === i.rank, function () {
              return "Error in conv3dDerFilter: dy must be rank 5, but got shape " + i.shape + ".";
            }), h(5 === n.length, function () {
              return "Error in conv3dDerFilter: filterShape must be length 5, but got " + n + ".";
            }), h(a.shape[4] === n[3], function () {
              return "Error in conv3dDerFilter: depth of input " + a.shape[4] + ") must match input depth in filter (" + n[3] + ".";
            }), h(i.shape[4] === n[4], function () {
              return "Error in conv3dDerFilter: depth of dy (" + i.shape[4] + ") must match output depth for filter (" + n[4] + ").";
            });
            var s = so(a.shape, n, r, 1, o);
            return kt.runKernel(function (t) {
              return t.conv3dDerFilter(a, i, s);
            }, {
              x5D: a,
              dy5D: i
            });
          }(o, t, i.shape, n, r);
        }
      };
    });
    return l ? p.as4D(p.shape[1], p.shape[2], p.shape[3], p.shape[4]) : p;
  }
}),
    wl = mn({
  conv2dDerFilter_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NHWC");
    var s = t;
    3 === t.rank && (s = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
    var u = e;
    3 === u.rank && (u = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), h(4 === s.rank, function () {
      return "Error in conv2dDerFilter: input must be rank 4, but got shape " + s.shape + ".";
    }), h(4 === u.rank, function () {
      return "Error in conv2dDerFilter: dy must be rank 4, but got shape " + u.shape + ".";
    }), h(4 === n.length, function () {
      return "Error in conv2dDerFilter: filterShape must be length 4, but got " + n + ".";
    });
    var l = "NHWC" === a ? s.shape[3] : s.shape[1],
        c = "NHWC" === a ? u.shape[3] : u.shape[1];
    h(l === n[2], function () {
      return "Error in conv2dDerFilter: depth of input " + l + ") must match input depth in filter (" + n[2] + ".";
    }), h(c === n[3], function () {
      return "Error in conv2dDerFilter: depth of dy (" + c + ") must match output depth for filter (" + n[3] + ").";
    }), null != i && h(g(o), function () {
      return "Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + o + ".";
    });
    var p = mo(a),
        f = io(s.shape, n, r, 1, o, i, !1, p);
    return kt.runKernel(function (t) {
      return t.conv2dDerFilter(s, u, f);
    }, {
      x4D: s,
      dy4D: u
    });
  }
}),
    Cl = mn({
  conv2dDerInput_: vl
}),
    El = mn({
  depthwiseConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = rn(t, "x", "depthwiseConv2d"),
        u = rn(e, "filter", "depthwiseConv2d"),
        l = s,
        c = !1;
    3 === s.rank && (c = !0, l = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), h(4 === l.rank, function () {
      return "Error in depthwiseConv2d: input must be rank 4, but got rank " + l.rank + ".";
    }), h(4 === u.rank, function () {
      return "Error in depthwiseConv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), h(l.shape[3] === u.shape[2], function () {
      return "Error in depthwiseConv2d: number of input channels (" + l.shape[3] + ") must match the inChannels dimension in filter " + u.shape[2] + ".";
    }), null == a && (a = [1, 1]), h(vo(n, a), function () {
      return "Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), null != i && h(g(r), function () {
      return "Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    });
    var p = io(l.shape, u.shape, n, a, r, i, !0),
        f = kt.runKernel(function (t, e) {
      var n = t.depthwiseConv2D(l, u, p);
      return e([l, u]), n;
    }, {
      x: l,
      $filter: u
    }, function (t, e) {
      h(fo(a), function () {
        return "Error in gradient of depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '" + a + "'";
      });
      var n = e[0],
          r = e[1];
      return {
        x: function () {
          return Rl(n.shape, t, r, p);
        },
        $filter: function () {
          return Il(n, t, r.shape, p);
        }
      };
    });
    return c ? f.as3D(f.shape[1], f.shape[2], f.shape[3]) : f;
  }
}),
    Rl = mn({
  depthwiseConv2dDerInput_: function (t, e, n, r) {
    var o = e,
        a = !1;
    3 === e.rank && (a = !0, o = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]));
    var i = kt.runKernel(function (t) {
      return t.depthwiseConv2DDerInput(o, n, r);
    }, {
      dy4D: o
    });
    return a ? i.as3D(i.shape[1], i.shape[2], i.shape[3]) : i;
  }
}),
    Il = mn({
  depthwiseConv2dDerFilter_: function (t, e, n, r) {
    var o = t;
    3 === t.rank && (o = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
    var a = e;
    return 3 === a.rank && (a = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), kt.runKernel(function (t) {
      return t.depthwiseConv2DDerFilter(o, a, r);
    }, {
      x4D: o,
      dy4D: a
    });
  }
}),
    kl = mn({
  separableConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = [1, 1]), void 0 === i && (i = "NHWC");
    var s = rn(t, "x", "separableConv2d"),
        u = rn(e, "depthwiseFilter", "separableConv2d"),
        l = rn(n, "pointwiseFilter", "separableConv2d"),
        c = s,
        p = !1;
    if (3 === s.rank && (p = !0, c = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), "NCHW" === i) throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");
    h(4 === c.rank, function () {
      return "Error in separableConv2d: input must be rank 4, but got rank " + c.rank + ".";
    }), h(4 === u.rank, function () {
      return "Error in separableConv2d: depthwise filter must be rank 4, but got rank " + u.rank + ".";
    }), h(4 === l.rank, function () {
      return "Error in separableConv2d: pointwise filter must be rank 4, but got rank " + u.rank + ".";
    }), h(1 === l.shape[0], function () {
      return "Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got " + l.shape[0] + ".";
    }), h(1 === l.shape[1], function () {
      return "Error in separableConv2d: the second dimension of pointwise filter must be 1, but got " + l.shape[1] + ".";
    });
    var f = u.shape[2],
        d = u.shape[3];
    h(l.shape[2] === f * d, function () {
      return "Error in separableConv2d: the third dimension of pointwise filter must be " + f * d + ", but got " + l.shape[2] + ".";
    });
    var v = El(c, u, r, o, i, a),
        m = xl(v, l, 1, "valid", i);
    return p ? m.as3D(m.shape[1], m.shape[2], m.shape[3]) : m;
  }
}),
    Nl = mn({
  conv2dTranspose_: function (t, e, n, r, o, a) {
    return vl(n, rn(t, "x", "conv2dTranspose"), rn(e, "filter", "conv2dTranspose"), r, o, "NHWC", a);
  }
}),
    Sl = mn({
  conv3dTranspose_: function (t, e, n, r, o) {
    return gl(n, rn(t, "x", "conv3dTranspose"), rn(e, "filter", "conv3dTranspose"), r, o);
  }
});
exports.conv3dTranspose = Sl;
exports.conv2dTranspose = Nl;
exports.separableConv2d = kl;
exports.depthwiseConv2d = El;
exports.conv3d = bl;
exports.conv2d = xl;
exports.conv1d = yl;
var Al = mn({
  matMul_: function (t, e, n, r) {
    var o;
    void 0 === n && (n = !1), void 0 === r && (r = !1);
    var a = rn(t, "a", "matMul"),
        i = rn(e, "b", "matMul");
    o = xt(a, i), a = o[0], i = o[1];
    var s = n ? a.shape[a.rank - 2] : a.shape[a.rank - 1],
        u = r ? i.shape[i.rank - 1] : i.shape[i.rank - 2],
        l = n ? a.shape[a.rank - 1] : a.shape[a.rank - 2],
        c = r ? i.shape[i.rank - 2] : i.shape[i.rank - 1],
        p = a.shape.slice(0, -2),
        f = i.shape.slice(0, -2),
        d = v(p),
        g = v(f);
    h(a.rank >= 2 && i.rank >= 2 && a.rank === i.rank, function () {
      return "Error in matMul: inputs must have the same rank of at least 2, got ranks " + a.rank + " and " + i.rank + ".";
    }), h(m(p, f), function () {
      return "Error in matMul: outer dimensions (" + p + ") and (" + f + ") of Tensors with shapes " + a.shape + " and " + i.shape + " must match.";
    }), h(s === u, function () {
      return "Error in matMul: inner shapes (" + s + ") and (" + u + ") of Tensors with shapes " + a.shape + " and " + i.shape + " and transposeA=" + n + " and transposeB=" + r + " must match.";
    });
    var y = a.shape.slice(0, -2).concat([l, c]),
        x = n ? a.as3D(d, s, l) : a.as3D(d, l, s),
        b = r ? i.as3D(g, c, u) : i.as3D(g, u, c);
    return kt.runKernel(function (t, e) {
      var o = t.batchMatMul(x, b, n, r);
      return e([x, b]), o;
    }, {
      $a: x,
      $b: b
    }, function (t, e) {
      var o = e,
          a = o[0],
          i = o[1];
      return n || r ? !n && r ? {
        $a: function () {
          return t.matMul(i, !1, !1);
        },
        $b: function () {
          return t.matMul(a, !0, !1);
        }
      } : n && !r ? {
        $a: function () {
          return i.matMul(t, !1, !0);
        },
        $b: function () {
          return a.matMul(t, !1, !1);
        }
      } : {
        $a: function () {
          return i.matMul(t, !0, !0);
        },
        $b: function () {
          return t.matMul(a, !0, !0);
        }
      } : {
        $a: function () {
          return t.matMul(i, !1, !0);
        },
        $b: function () {
          return a.matMul(t, !0, !1);
        }
      };
    }).reshape(y);
  }
}),
    Tl = mn({
  dot_: function (t, e) {
    var n = rn(t, "t1", "dot"),
        r = rn(e, "t2", "dot");
    h(!(1 !== n.rank && 2 !== n.rank || 1 !== r.rank && 2 !== r.rank), function () {
      return "Error in dot: inputs must all be rank 1 or 2, but got ranks " + n.rank + " and " + r.rank + ".";
    });
    var o = 1 === n.rank ? n.size : n.shape[1],
        a = 1 === r.rank ? r.size : r.shape[0];
    return h(o === a, function () {
      return "Error in dot: inner dimensions of inputs must match, but got " + o + " and " + a + ".";
    }), 1 === n.rank && 1 === r.rank ? n.as2D(1, -1).matMul(r.as2D(-1, 1)).asScalar() : 1 === n.rank && 2 === r.rank ? n.as2D(1, -1).matMul(r.as2D(r.shape[0], r.shape[1])).as1D() : 2 === n.rank && 1 === r.rank ? n.matMul(r.as2D(-1, 1)).as1D() : n.matMul(r.as2D(r.shape[0], r.shape[1]));
  }
}),
    Dl = mn({
  outerProduct_: function (t, e) {
    var n = rn(t, "v1", "outerProduct"),
        r = rn(e, "v2", "outerProduct");
    return h(1 === n.rank && 1 === r.rank, function () {
      return "Error in outerProduct: inputs must be rank 1, but got ranks " + n.rank + " and " + r.rank + ".";
    }), n.as2D(-1, 1).matMul(r.as2D(1, -1));
  }
});
exports.outerProduct = Dl;
exports.dot = Tl;
exports.matMul = Al;

var _l = mn({
  reverse_: function (t, e) {
    var n = rn(t, "x", "reverse");
    if (0 === n.rank) return n.clone();
    var r = E(e, n.shape);
    return kt.runKernel(function (t) {
      return t.reverse(n, r);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.reverse(r);
        }
      };
    }).reshapeAs(n);
  }
}),
    Ol = mn({
  reverse1d_: function (t) {
    var e = rn(t, "x", "reverse");
    return h(1 === e.rank, function () {
      return "Error in reverse1D: x must be rank 1 but got rank " + e.rank + ".";
    }), _l(e, 0);
  }
}),
    Fl = mn({
  reverse2d_: function (t, e) {
    var n = rn(t, "x", "reverse");
    return h(2 === n.rank, function () {
      return "Error in reverse2D: x must be rank 2 but got rank " + n.rank + ".";
    }), _l(n, e);
  }
}),
    Ml = mn({
  reverse3d_: function (t, e) {
    var n = rn(t, "x", "reverse");
    return h(3 === n.rank, function () {
      return "Error in reverse3D: x must be rank 3 but got rank " + n.rank + ".";
    }), _l(n, e);
  }
}),
    Bl = mn({
  reverse4d_: function (t, e) {
    var n = rn(t, "x", "reverse");
    return h(4 === n.rank, function () {
      return "Error in reverse4D: x must be rank 4 but got rank " + n.rank + ".";
    }), _l(n, e);
  }
});

exports.reverse4d = Bl;
exports.reverse3d = Ml;
exports.reverse2d = Fl;
exports.reverse1d = Ol;
exports.reverse = _l;

function Pl(t, e, n, r, o, a) {
  var i = rn(t, "x", "maxPool"),
      s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), null == r && (r = [1, 1]), h(4 === s.rank, function () {
    return "Error in maxPool: input must be rank 4 but got rank " + s.rank + ".";
  }), h(vo(n, r), function () {
    return "Error in maxPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  }), null != a && h(g(o), function () {
    return "Error in maxPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var l = oo(s.shape, e, n, r, o, a),
      c = kt.runKernel(function (t, e) {
    var n = t.maxPool(s, l);
    return e([s, n]), n;
  }, {
    x: s
  }, function (t, a) {
    var i = a[0],
        s = a[1];
    return {
      x: function () {
        return function (t, e, n, r, o, a, i, s) {
          var u = rn(t, "dy", "maxPoolBackprop"),
              l = rn(e, "input", "maxPoolBackprop"),
              c = rn(n, "output", "maxPoolBackprop");
          h(l.rank === u.rank, function () {
            return "Rank of input (" + l.rank + ") does not match rank of dy (" + u.rank + ")";
          }), null == a && (a = [1, 1]), h(vo(o, a), function () {
            return "Error in maxPoolBackProp: Either strides or dilations must be 1. Got strides " + o + " and dilations '" + a + "'";
          }), h(4 === u.rank, function () {
            return "Error in maxPoolBackprop: dy must be rank 4 but got rank " + u.rank + ".";
          }), h(4 === l.rank, function () {
            return "Error in maxPoolBackprop: input must be rank 4 but got rank " + l.rank + ".";
          }), null != s && h(g(i), function () {
            return "Error in maxPoolBackprop: pad must be an integer when using, dimRoundingMode " + s + " but got pad " + i + ".";
          });
          var p = oo(l.shape, r, o, a, i, s);
          return kt.runKernel(function (t) {
            return t.maxPoolBackprop(u, l, c, p);
          }, {
            $dy: u,
            $input: l
          });
        }(t, i, s, e, n, r, o);
      }
    };
  });
  return u ? c.as3D(c.shape[1], c.shape[2], c.shape[3]) : c;
}

function Ll(t, e, n, r, o, a) {
  var i = rn(t, "x", "avgPool", "float32");
  null == r && (r = [1, 1]), h(vo(n, r), function () {
    return "Error in avgPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  });
  var s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), h(4 === s.rank, function () {
    return "Error in avgPool: x must be rank 4 but got rank " + s.rank + ".";
  }), null != a && h(g(o), function () {
    return "Error in avgPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var l = oo(s.shape, e, n, r, o, a),
      c = kt.runKernel(function (t) {
    return t.avgPool(s, l);
  }, {
    x: s
  }, function (t) {
    return {
      x: function () {
        return function (t, e, n, r, o, a) {
          var i = rn(t, "dy", "avgPoolBackprop"),
              s = rn(e, "input", "avgPoolBackprop");
          h(s.rank === i.rank, function () {
            return "Rank of input (" + s.rank + ") does not match rank of dy (" + i.rank + ")";
          }), null == o && (o = [1, 1]), h(vo(r, o), function () {
            return "Error in avgPoolBackprop: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + o + "'";
          });
          var u = s,
              l = i,
              c = !1;
          3 === s.rank && (c = !0, u = s.as4D(1, s.shape[0], s.shape[1], s.shape[2]), l = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), h(4 === l.rank, function () {
            return "Error in avgPoolBackprop: dy must be rank 4 but got rank " + l.rank + ".";
          }), h(4 === u.rank, function () {
            return "Error in avgPoolBackprop: input must be rank 4 but got rank " + u.rank + ".";
          });
          var p = oo(u.shape, n, r, o, a),
              f = kt.runKernel(function (t) {
            return t.avgPoolBackprop(l, u, p);
          }, {
            dy4D: l,
            input4D: u
          });
          return c ? f.as3D(f.shape[1], f.shape[2], f.shape[3]) : f;
        }(t, s, e, n, r, o);
      }
    };
  });
  return c = c.cast(i.dtype), u ? c.as3D(c.shape[1], c.shape[2], c.shape[3]) : c;
}

var Wl = mn({
  maxPool_: function (t, e, n, r, o) {
    return Pl(t, e, n, 1, r, o);
  }
}),
    Ul = mn({
  avgPool_: function (t, e, n, r, o) {
    return Ll(t, e, n, 1, r, o);
  }
}),
    Vl = mn({
  pool_: function (t, e, n, r, o, a) {
    null == o && (o = [1, 1]), null == a && (a = 1), 0 === r && (r = "valid");
    var i = rn(t, "x", "maxPool"),
        s = i,
        u = !1;
    3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), h(vo(a, o), function () {
      return "Error in pool: Either strides or dilations must be 1. Got strides " + a + " and dilations '" + o + "'";
    });
    var l,
        c = oo(s.shape, e, a, o, r),
        p = [c.dilationHeight, c.dilationWidth];
    l = "same" === r ? function (t, e) {
      var n = t.map(function (t, n) {
        return t + (t - 1) * (e[n] - 1);
      }).map(function (t) {
        return t - 1;
      }),
          r = n.map(function (t) {
        return Math.floor(t / 2);
      }),
          o = n.map(function (t, e) {
        return t - r[e];
      });
      return n.map(function (t, e) {
        return [r[e], o[e]];
      });
    }([c.filterHeight, c.filterWidth], p) : [[0, 0], [0, 0]];

    var f = 1 === p[0] && 1 === p[1],
        d = function (t, e, n) {
      var r = n.map(function (t) {
        return t[0];
      }),
          o = n.map(function (t) {
        return t[1];
      }),
          a = t.concat(r, o),
          i = e.map(function (t, e) {
        return (t - a[e] % t) % t;
      }),
          s = o.map(function (t, e) {
        return t + i[e];
      }),
          u = e.map(function (t, e) {
        return [r[e], s[e]];
      }),
          l = e.map(function (t, e) {
        return [0, i[e]];
      });
      return [u, l];
    }([c.inHeight, c.inWidth], p, l),
        v = d[0],
        m = d[1],
        g = f ? r : "valid",
        y = f ? s : wr(s, p, v),
        x = ("avg" === n ? function () {
      return Ll(y, e, a, 1, g);
    } : function () {
      return Pl(y, e, a, 1, g);
    })(),
        b = f ? x : nr(x, p, m);

    return u ? b.as3D(b.shape[1], b.shape[2], b.shape[3]) : b;
  }
}),
    zl = mn({
  maxPool3d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NDHWC");
    var s = rn(t, "x", "maxPool3d"),
        u = s,
        l = !1;
    4 === s.rank && (l = !0, u = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3])), null == i && (i = [1, 1, 1]), h(5 === u.rank, function () {
      return "Error in maxPool3d: x must be rank 5 but got rank " + u.rank + ".";
    }), h("NDHWC" === a, function () {
      return "Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of " + a;
    }), h(vo(n, i), function () {
      return "Error in maxPool3d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + i + "'";
    }), null != o && h(g(r), function () {
      return "Error in maxPool3d: pad must be an integer when using, dimRoundingMode " + o + " but got pad " + r + ".";
    });
    var c = ao(u.shape, e, n, i, r, o, a),
        p = kt.runKernel(function (t, e) {
      var n = t.maxPool3d(u, c);
      return e([u, n]), n;
    }, {
      x: u
    }, function (t, a) {
      var s = a[0],
          u = a[1];
      return {
        x: function () {
          return function (t, e, n, r, o, a, i, s) {
            var u = rn(t, "dy", "maxPool3dBackprop"),
                l = rn(e, "input", "maxPool3dBackprop"),
                c = rn(n, "output", "maxPool3dBackprop"),
                p = u,
                f = l,
                d = c,
                v = !1;
            4 === l.rank && (v = !0, p = u.as5D(1, u.shape[0], u.shape[1], u.shape[2], u.shape[3]), f = l.as5D(1, l.shape[0], l.shape[1], l.shape[2], l.shape[3]), d = c.as5D(1, c.shape[0], c.shape[1], c.shape[2], c.shape[3])), h(5 === p.rank, function () {
              return "Error in maxPool3dBackprop: dy must be rank 5 but got rank " + p.rank + ".";
            }), h(5 === f.rank, function () {
              return "Error in maxPool3dBackprop: input must be rank 5 but got rank " + f.rank + ".";
            }), h(5 === d.rank, function () {
              return "Error in maxPool3dBackprop: output must be rank 5 but got rank " + d.rank + ".";
            }), null == a && (a = [1, 1, 1]), h(vo(o, a), function () {
              return "Error in maxPool3dBackprop: Either strides or dilations must be 1. Got strides " + o + " and dilations '" + a + "'";
            }), null != s && h(g(i), function () {
              return "Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode " + s + " but got pad " + i + ".";
            });
            var m = ao(f.shape, r, o, a, i, s),
                y = kt.runKernel(function (t) {
              return t.maxPool3dBackprop(p, f, d, m);
            }, {
              dy5D: p,
              input5D: f
            });
            return v ? y.as4D(y.shape[1], y.shape[2], y.shape[3], y.shape[4]) : y;
          }(t, s, u, e, n, i, r, o);
        }
      };
    });
    return l ? p.as4D(p.shape[1], p.shape[2], p.shape[3], p.shape[4]) : p;
  }
}),
    Gl = mn({
  avgPool3d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NDHWC");
    var s = rn(t, "x", "avgPool3d", "float32"),
        u = s,
        l = !1;
    4 === s.rank && (l = !0, u = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3])), null == i && (i = [1, 1, 1]), h(5 === u.rank, function () {
      return "Error in avgPool3d: x must be rank 5 but got rank " + u.rank + ".";
    }), h("NDHWC" === a, function () {
      return "Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of " + a;
    }), h(vo(n, i), function () {
      return "Error in avgPool3d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + i + "'";
    }), null != o && h(g(r), function () {
      return "Error in avgPool3d: pad must be an integer when using, dimRoundingMode " + o + " but got pad " + r + ".";
    });
    var c = ao(u.shape, e, n, i, r, o, a),
        p = kt.runKernel(function (t) {
      return t.avgPool3d(u, c);
    }, {
      x: u
    }, function (t) {
      return {
        x: function () {
          return function (t, e, n, r, o, a, i) {
            var s = rn(t, "dy", "avgPool3dBackprop"),
                u = rn(e, "input", "avgPool3dBackprop"),
                l = s,
                c = u,
                p = !1;
            4 === u.rank && (p = !0, l = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3]), c = u.as5D(1, u.shape[0], u.shape[1], u.shape[2], u.shape[3])), h(5 === l.rank, function () {
              return "Error in avgPool3dBackprop: dy must be rank 5 but got rank " + l.rank + ".";
            }), h(5 === c.rank, function () {
              return "Error in avgPool3dBackprop: input must be rank 5 but got rank " + c.rank + ".";
            }), null == o && (o = [1, 1, 1]), h(vo(r, o), function () {
              return "Error in avgPool3dBackprop: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + o + "'";
            }), null != i && h(g(a), function () {
              return "Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + a + ".";
            });
            var f = ao(c.shape, n, r, o, a, i),
                d = kt.runKernel(function (t) {
              return t.avgPool3dBackprop(l, c, f);
            }, {
              dy5D: l,
              input5D: c
            });
            return p ? d.as4D(d.shape[1], d.shape[2], d.shape[3], d.shape[4]) : d;
          }(t, u, e, n, i, r, o);
        }
      };
    });
    return p = p.cast(u.dtype), l ? p.as4D(p.shape[1], p.shape[2], p.shape[3], p.shape[4]) : p;
  }
});
exports.avgPool3d = Gl;
exports.maxPool3d = zl;
exports.pool = Vl;
exports.avgPool = Ul;
exports.maxPool = Wl;
var Hl = mn({
  slice_: function (t, e, n) {
    var r,
        o,
        a = rn(t, "x", "slice");
    if (0 === a.rank) throw new Error("Slicing scalar is not possible");
    (r = "number" == typeof e ? [e].concat(new Array(a.rank - 1).fill(0)) : e.length < a.rank ? e.concat(new Array(a.rank - e.length).fill(0)) : e.slice()).forEach(function (t) {
      h(-1 !== t, function () {
        return "slice() does not support negative begin indexing.";
      });
    }), o = (o = null == n ? new Array(a.rank).fill(-1) : "number" == typeof n ? [n].concat(new Array(a.rank - 1).fill(-1)) : n.length < a.rank ? n.concat(new Array(a.rank - n.length).fill(-1)) : n).map(function (t, e) {
      return t >= 0 ? t : (h(-1 === t, function () {
        return "Negative size values should be exactly -1 but got " + t + " for the slice() size at index " + e + ".";
      }), a.shape[e] - r[e]);
    }), function (t, e, n) {
      h(t.rank === e.length, function () {
        return "Error in slice" + t.rank + "D: Length of begin " + e + " must match the rank of the array (" + t.rank + ").";
      }), h(t.rank === n.length, function () {
        return "Error in slice" + t.rank + "D: Length of size " + n + " must match the rank of the array (" + t.rank + ").";
      });

      for (var r = function (r) {
        h(e[r] + n[r] <= t.shape[r], function () {
          return "Error in slice" + t.rank + "D: begin[" + r + "] + size[" + r + "] (" + (e[r] + n[r]) + ") would overflow input.shape[" + r + "] (" + t.shape[r] + ")";
        });
      }, o = 0; o < t.rank; ++o) r(o);
    }(a, r, o);
    var i = a.shape;
    return kt.runKernel(function (t) {
      return t.slice(a, r, o);
    }, {
      $x: a
    }, function (t) {
      for (var e = [], n = 0; n < t.rank; n++) e.push([r[n], i[n] - r[n] - o[n]]);

      return {
        $x: function () {
          return t.pad(e);
        }
      };
    });
  }
}),
    ql = mn({
  slice1d_: function (t, e, n) {
    var r = rn(t, "x", "slice1d");
    return h(1 === r.rank, function () {
      return "slice1d expects a rank-1 tensor, but got a rank-" + r.rank + " tensor";
    }), Hl(r, [e], [n]);
  }
}),
    $l = mn({
  slice2d_: function (t, e, n) {
    var r = rn(t, "x", "slice2d");
    return h(2 === r.rank, function () {
      return "slice2d expects a rank-2 tensor, but got a rank-" + r.rank + " tensor";
    }), Hl(r, e, n);
  }
}),
    Kl = mn({
  slice3d_: function (t, e, n) {
    var r = rn(t, "x", "slice3d");
    return h(3 === r.rank, function () {
      return "slice3d expects a rank-3 tensor, but got a rank-" + r.rank + " tensor";
    }), Hl(r, e, n);
  }
}),
    jl = mn({
  slice4d_: function (t, e, n) {
    var r = rn(t, "x", "slice4d");
    return h(4 === r.rank, function () {
      return "slice4d expects a rank-4 tensor, but got a rank-" + r.rank + " tensor";
    }), Hl(r, e, n);
  }
});
exports.slice4d = jl;
exports.slice3d = Kl;
exports.slice2d = $l;
exports.slice1d = ql;
exports.slice = Hl;

function Xl(t, e, n, r, o) {
  return e.rank < n.rank && (e = e.reshape(ln(e.shape, r))), t.rank < n.rank && (t = t.reshape(ln(t.shape, r))), {
    $x: function () {
      var r = t.mul(n.equal(e).cast(t.dtype));
      return null == o ? r : r.transpose(o);
    }
  };
}

var Yl = mn({
  all_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "all", "bool"),
        o = E(e, r.shape),
        a = o,
        i = hn(a, r.rank);
    null != i && (r = r.transpose(i), a = fn(a.length, r.rank));
    var s = kt.runKernel(function (t) {
      return t.all(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = ln(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Ql = mn({
  any_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "any", "bool"),
        o = E(e, r.shape),
        a = o,
        i = hn(a, r.rank);
    null != i && (r = r.transpose(i), a = fn(a.length, r.rank));
    var s = kt.runKernel(function (t) {
      return t.any(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = ln(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Jl = mn({
  argMax_: function (t, e) {
    void 0 === e && (e = 0);
    var n = rn(t, "x", "argMax");
    null == e && (e = 0);
    var r = E(e, n.shape),
        o = hn(r, n.rank);
    return null != o && (n = n.transpose(o), r = fn(r.length, n.rank)), kt.runKernel(function (t, e) {
      var o = t.argMax(n, r[0]);
      return e([n]), o;
    }, {
      $x: n
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Mn(n);
        }
      };
    });
  }
}),
    Zl = mn({
  argMin_: function (t, e) {
    void 0 === e && (e = 0);
    var n = rn(t, "x", "argMin");
    null == e && (e = 0);
    var r = E(e, n.shape),
        o = hn(r, n.rank);
    return null != o && (n = n.transpose(o), r = fn(r.length, n.rank)), kt.runKernel(function (t, e) {
      var o = t.argMin(n, r[0]);
      return e([n]), o;
    }, {
      $x: n
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Mn(n);
        }
      };
    });
  }
}),
    tc = mn({
  logSumExp_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "logSumExp"),
        o = E(e, r.shape),
        a = r.max(o, !0),
        i = r.sub(a).exp().sum(o).log(),
        s = a.reshape(i.shape).add(i);

    if (n) {
      var u = ln(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    ec = mn({
  max_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "max"),
        o = r,
        a = E(e, r.shape),
        i = a,
        s = hn(i, r.rank);
    null != s && (r = r.transpose(s), i = fn(i.length, r.rank));
    var u = kt.runKernel(function (t, e) {
      var n = t.max(r, i);
      return e([o, n]), n;
    }, {
      $x: r
    }, function (t, e) {
      return Xl(t, e[1], e[0], a, s);
    });

    if (n) {
      var l = ln(u.shape, a);
      u = u.reshape(l);
    }

    return u;
  }
}),
    nc = mn({
  mean_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "mean"),
        o = E(e, r.shape),
        a = v(un(r.shape, o)[1]);
    return Xr(function (t) {
      var r = Cn(a);
      return {
        value: (r.dtype === t.dtype ? t : t.cast(r.dtype)).div(r).sum(e, n),
        gradFunc: function (e) {
          var n = t.shape.slice();
          return o.forEach(function (t) {
            n[t] = 1;
          }), e.reshape(n).mul(An(t.shape, "float32")).div(a);
        }
      };
    })(r);
  }
}),
    rc = mn({
  min_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "min"),
        o = r,
        a = E(e, r.shape),
        i = a,
        s = hn(i, r.rank);
    null != s && (r = r.transpose(s), i = fn(i.length, r.rank));
    var u = kt.runKernel(function (t, e) {
      var n = t.min(r, i);
      return e([o, n]), n;
    }, {
      $x: r
    }, function (t, e) {
      return Xl(t, e[1], e[0], a, s);
    });

    if (n) {
      var l = ln(u.shape, a);
      u = u.reshape(l);
    }

    return u;
  }
}),
    oc = mn({
  moments_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = E(e, (t = rn(t, "x", "moments")).shape),
        o = t.mean(r, n),
        a = o.shape;
    n || (a = ln(o.shape, r));
    var i = t.toFloat().sub(o.reshape(a)).square();
    return {
      mean: o,
      variance: i.mean(r, n)
    };
  }
}),
    ac = mn({
  sum_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "sum");
    "bool" === r.dtype && (r = r.toInt());
    var o = E(e, r.shape);
    return Xr(function (t) {
      var e = hn(o, t.rank),
          r = o,
          a = t;
      null != e && (a = t.transpose(e), r = fn(r.length, t.rank));
      var i = kt.runKernel(function (t) {
        return t.sum(a, r);
      }, {
        permutedX: a
      });

      if (n) {
        var s = ln(i.shape, o);
        i = i.reshape(s);
      }

      return {
        value: i,
        gradFunc: function (e) {
          var n = t.shape.slice();
          return o.forEach(function (t) {
            n[t] = 1;
          }), e.reshape(n).mul(An(t.shape, "float32"));
        }
      };
    })(r);
  }
}),
    ic = mn({
  prod_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = rn(t, "x", "prod");
    "bool" === r.dtype && (r = r.toInt());
    var o = E(e, r.shape),
        a = hn(o, r.rank),
        i = o,
        s = r;
    null != a && (s = r.transpose(a), i = fn(i.length, r.rank));
    var u = kt.runKernel(function (t) {
      return t.prod(s, i);
    }, {
      permutedX: s
    });

    if (n) {
      var l = ln(u.shape, o);
      u = u.reshape(l);
    }

    return u;
  }
});
exports.prod = ic;
exports.sum = ac;
exports.moments = oc;
exports.min = rc;
exports.mean = nc;
exports.max = ec;
exports.logSumExp = tc;
exports.argMin = Zl;
exports.argMax = Jl;
exports.any = Ql;
exports.all = Yl;
var sc = mn({
  elu_: function (t) {
    var e = rn(t, "x", "elu");
    return kt.runKernel(function (t, n) {
      var r = t.elu(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return kt.runKernel(function (e) {
            return e.eluDer(t, n);
          }, {
            dy: t,
            y: n
          });
        }
      };
    });
  }
}),
    uc = mn({
  leakyRelu_: function (t, e) {
    void 0 === e && (e = .2);
    var n = rn(t, "x", "leakyRelu");
    return Lu(Cn(e).mul(n), n);
  }
}),
    lc = mn({
  prelu_: function (t, e) {
    var n = rn(t, "x", "prelu"),
        r = rn(e, "alpha", "prelu");
    return kt.runKernel(function (t, e) {
      var o = t.prelu(n, r);
      return e([n, r]), o;
    }, {
      $x: n,
      $alpha: r
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = n.greater(0);
      return {
        $x: function () {
          return Au(o, t, t.mul(r));
        },
        $alpha: function () {
          var e = Au(o, Mn(t), t.mul(n)),
              a = no(r.shape, t.shape);
          return a.length > 0 && (e = e.sum(a)), e.reshape(r.shape);
        }
      };
    });
  }
}),
    cc = mn({
  relu_: function (t) {
    var e = rn(t, "x", "relu");
    return "bool" === e.dtype ? e.toInt() : kt.runKernel(function (t, n) {
      var r = t.relu(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mulStrict(n.step().toFloat());
        }
      };
    });
  }
}),
    hc = mn({
  relu6_: function (t) {
    var e = rn(t, "x", "relu6");
    return "bool" === e.dtype ? e.toInt() : kt.runKernel(function (t, n) {
      var r = t.relu6(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0],
          r = n.lessEqual(6).mul(n.step());
      return {
        $x: function () {
          return t.mulStrict(r.toFloat());
        }
      };
    });
  }
}),
    pc = mn({
  selu_: function (t) {
    var e = rn(t, "x", "selu");
    return kt.runKernel(function (t, n) {
      var r = t.selu(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          var e = n.greater(Cn(0)),
              r = Cn(Yi),
              o = Cn(Qi),
              a = t.mul(o),
              i = t.mul(r).mul(n.toFloat().exp());
          return Au(e, a, i);
        }
      };
    });
  }
});
exports.selu = pc;
exports.relu6 = hc;
exports.relu = cc;
exports.prelu = lc;
exports.leakyRelu = uc;
exports.elu = sc;
var fc = mn({
  transpose_: function (t, e) {
    var n = rn(t, "x", "transpose");
    return null == e && (e = n.shape.map(function (t, e) {
      return e;
    }).reverse()), h(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of perm " + e + ".";
    }), e.forEach(function (t) {
      h(t >= 0 && t < n.rank, function () {
        return "All entries in 'perm' must be between 0 and " + (n.rank - 1) + " but got " + e;
      });
    }), n.rank <= 1 ? n.clone() : kt.runKernel(function (t) {
      return t.transpose(n, e);
    }, {
      $x: n
    }, function (t) {
      var n = pn(e);
      return {
        $x: function () {
          return t.transpose(n);
        }
      };
    });
  }
});
exports.transpose = fc;
var dc = mn({
  localResponseNormalization_: function (t, e, n, r, o) {
    void 0 === e && (e = 5), void 0 === n && (n = 1), void 0 === r && (r = 1), void 0 === o && (o = .5);
    var a = rn(t, "x", "localResponseNormalization");
    h(4 === a.rank || 3 === a.rank, function () {
      return "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + a.rank + ".";
    }), h(g(e), function () {
      return "Error in localResponseNormalization: depthRadius must be an integer but got depthRadius " + e + ".";
    });
    var i = a,
        s = !1;
    3 === a.rank && (s = !0, i = a.as4D(1, a.shape[0], a.shape[1], a.shape[2]));
    var u = kt.runKernel(function (t, a) {
      var s = t.localResponseNormalization4D(i, e, n, r, o);
      return a([i, s]), s;
    }, {
      x4D: i
    }, function (t, a) {
      var i = a[0],
          s = a[1];
      return {
        x4D: function () {
          return kt.runKernel(function (a) {
            return a.LRNGrad(t, i, s, e, n, r, o);
          }, {});
        }
      };
    });
    return s ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
});
exports.localResponseNormalization = dc;
var vc = mn({
  norm_: function (t, e, n, r) {
    void 0 === e && (e = "euclidean"), void 0 === n && (n = null), void 0 === r && (r = !1);

    var o = function t(e, n, r) {
      if (void 0 === r && (r = null), 0 === e.rank) return e.abs();
      if (1 !== e.rank && null === r) return t(e.reshape([-1]), n, r);

      if (1 === e.rank || "number" == typeof r || Array.isArray(r) && 1 === r.length) {
        if (1 === n) return e.abs().sum(r);
        if (n === 1 / 0) return e.abs().max(r);
        if (n === -1 / 0) return e.abs().min(r);
        if ("euclidean" === n || 2 === n) return e.abs().pow(Cn(2, "int32")).sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      if (Array.isArray(r) && 2 === r.length) {
        if (1 === n) return e.abs().sum(r[0]).max(r[1] - 1);
        if (n === 1 / 0) return e.abs().sum(r[1]).max(r[0]);
        if (n === -1 / 0) return e.abs().sum(r[1]).min(r[0]);
        if ("fro" === n || "euclidean" === n) return e.square().sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      throw new Error("Error in norm: invalid axis: " + r);
    }(t = rn(t, "x", "norm"), e, n),
        a = o.shape;

    if (r) {
      var i = E(n, t.shape);
      a = ln(o.shape, i);
    }

    return o.reshape(a);
  }
});
exports.norm = vc;
var mc = mn({
  basicLSTMCell_: function (t, e, n, r, o, a) {
    var i = rn(t, "forgetBias", "basicLSTMCell"),
        s = rn(e, "lstmKernel", "basicLSTMCell"),
        u = rn(n, "lstmBias", "basicLSTMCell"),
        l = rn(r, "data", "basicLSTMCell"),
        c = rn(o, "c", "basicLSTMCell"),
        h = rn(a, "h", "basicLSTMCell"),
        p = l.concat(h, 1).matMul(s).add(u),
        f = p.shape[0],
        d = p.shape[1] / 4,
        v = [f, d],
        m = p.slice([0, 0], v),
        g = p.slice([0, d], v),
        y = p.slice([0, 2 * d], v),
        x = p.slice([0, 3 * d], v),
        b = m.sigmoid().mulStrict(g.tanh()).addStrict(c.mulStrict(i.add(y).sigmoid())),
        w = b.tanh().mulStrict(x.sigmoid());
    return [b, w];
  }
}),
    gc = mn({
  multiRNNCell_: function (t, e, n, r) {
    for (var o = rn(e, "data", "multiRNNCell"), a = on(n, "c", "multiRNNCell"), i = on(r, "h", "multiRNNCell"), s = o, u = [], l = 0; l < t.length; l++) {
      var c = t[l](s, a[l], i[l]);
      u.push(c[0]), u.push(c[1]), s = c[1];
    }

    var h = [],
        p = [];

    for (l = 0; l < u.length; l += 2) h.push(u[l]), p.push(u[l + 1]);

    return [h, p];
  }
});
exports.multiRNNCell = gc;
exports.basicLSTMCell = mc;
var yc = mn({
  movingAverage_: function (t, e, n, r, o) {
    void 0 === o && (o = !0);
    var a = rn(t, "v", "movingAverage"),
        i = rn(e, "x", "movingAverage"),
        s = rn(n, "decay", "movingAverage");
    bt(a, i), h(m(a.shape, i.shape), function () {
      return "Shape mismatch in v and x";
    });
    var u = Cn(1),
        l = u.sub(s),
        c = i.sub(a).mul(l);

    if (o) {
      h(null != r, function () {
        return "When using zeroDebias: true, step is required.";
      });
      var p = rn(r, "step", "movingAverage");
      c = c.div(u.sub($u(s, p)));
    }

    return a.add(c);
  }
});
exports.movingAverage = yc;
var xc = mn({
  stridedSlice_: function (t, e, n, r, o, a, i, s, u) {
    if (void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), void 0 === u && (u = 0), null == r && (r = new Array(e.length)), 0 !== i) throw new Error("ellipsis mask is not yet supported");
    var l = rn(t, "x", "stridedSlice"),
        c = Lr(s),
        h = l.shape.slice();
    c.forEach(function (t) {
      e[t] = 0, n[t] = 1, h.splice(t, 0, 1);
    }), l = l.reshape(h);

    for (var p = 0; p < l.rank; p++) e[p] = Ur(o, e, r, l.shape, p), n[p] = Vr(a, n, r, l.shape, p), r[p] = r[p] || 1;

    var f = Lr(u);
    f.forEach(function (t) {
      n[t] = e[t] + 1, r[t] = 1;
    });
    var d = Wr(e, n, r),
        v = d.filter(function (t, e) {
      return -1 === f.indexOf(e);
    });
    return r.every(function (t) {
      return 1 === t;
    }) ? Hl(l, e, d).reshape(v) : kt.runKernel(function (t) {
      return t.stridedSlice(l, e, n, r);
    }, {
      $x: l
    }).reshape(v);
  }
});
exports.stridedSlice = xc;
var bc = mn({
  topk_: function (t, e, n) {
    void 0 === e && (e = 1), void 0 === n && (n = !0);
    var r = rn(t, "x", "topk");
    if (0 === r.rank) throw new Error("topk() expects the input to be of rank 1 or higher");
    var o = r.shape[r.shape.length - 1];
    if (e > o) throw new Error("'k' passed to topk() must be <= the last dimension (" + o + ") but got " + e);
    var a = kt.runKernel(function (t) {
      return t.topk(r, e, n);
    }, {
      $x: r
    });
    return {
      values: a[0],
      indices: a[1]
    };
  }
});
exports.topk = bc;
var wc = mn({
  scatterND_: function (t, e, n) {
    var r = rn(t, "indices", "scatterND", "int32"),
        o = rn(e, "updates", "scatterND");
    return Br(o, r, n), kt.runKernel(function (t) {
      return t.scatterND(r, o, n);
    }, {
      $indices: r,
      $updates: o
    });
  }
});
exports.scatterND = wc;
var Cc = mn({
  fft_: function (t) {
    h("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.fft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return kt.runKernel(function (t) {
      return t.fft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    Ec = mn({
  ifft_: function (t) {
    h("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.ifft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return kt.runKernel(function (t) {
      return t.ifft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    Rc = mn({
  rfft_: function (t, e) {
    h("float32" === t.dtype, function () {
      return "The dtype for rfft() must be real value but got " + t.dtype;
    });
    var n,
        r = t.shape[t.shape.length - 1],
        o = t.size / r;

    if (null != e && e < r) {
      var a = t.shape.map(function (t) {
        return 0;
      }),
          i = t.shape.map(function (t) {
        return t;
      });
      i[t.shape.length - 1] = e, n = t.slice(a, i), r = e;
    } else if (null != e && e > r) {
      var s = t.shape.map(function (t) {
        return t;
      });
      s[t.shape.length - 1] = e - r, n = t.concat(Tn(s), t.shape.length - 1), r = e;
    } else n = t;

    var u = n.zerosLike(),
        l = gn(n, u).as2D(o, r),
        c = Cc(l),
        p = Math.floor(r / 2) + 1,
        f = yn(c),
        d = xn(c),
        v = f.split([p, r - p], f.shape.length - 1),
        m = d.split([p, r - p], d.shape.length - 1),
        g = n.shape.slice();
    return g[n.shape.length - 1] = p, gn(v[0], m[0]).reshape(g);
  }
}),
    Ic = mn({
  irfft_: function (t) {
    var e = t.shape[t.shape.length - 1],
        n = t.size / e;

    if (e <= 2) {
      var r = t.as2D(n, e),
          o = Ec(r);
      return yn(o);
    }

    var a = [n, 2 * (e - 1)],
        i = yn(t).as2D(n, e),
        s = xn(t).as2D(n, e),
        u = i.slice([0, 1], [n, e - 2]).reverse(1),
        l = s.slice([0, 1], [n, e - 2]).reverse(1).mul(Cn(-1)),
        c = i.concat(u, 1),
        h = s.concat(l, 1);
    return r = gn(c, h).as2D(a[0], a[1]), o = Ec(r), yn(o);
  }
}),
    kc = Object.freeze({
  fft: Cc,
  ifft: Ec,
  rfft: Rc,
  irfft: Ic
});
exports.spectral = kc;
exports.irfft = Ic;
exports.rfft = Rc;
exports.ifft = Ec;
exports.fft = Cc;
var Nc = mn({
  sparseToDense_: function (t, e, n, r) {
    void 0 === r && (r = 0);
    var o = rn(t, "sparseIndices", "sparseToDense", "int32"),
        a = rn(e, "sparseValues", "sparseToDense"),
        i = rn(r, "defaultValue", "sparseToDense", a.dtype);
    return function (t, e, n, r) {
      if ("int32" !== t.dtype) throw new Error("tf.sparseToDense() expects the indices to be int32 type, but the dtype was " + t.dtype + ".");
      if (t.rank > 2) throw new Error("sparseIndices should be a scalar, vector, or matrix, but got shape " + t.shape + ".");
      var o = t.rank > 0 ? t.shape[0] : 1,
          a = t.rank > 1 ? t.shape[1] : 1;
      if (n.length !== a) throw new Error("outputShape has incorrect number of elements:, " + n.length + ", should be: " + a + ".");
      var i = e.size;
      if (0 !== e.rank && (1 !== e.rank || i !== o)) throw new Error("sparseValues has incorrect shape " + e.shape + ", should be [] or [" + o + "]");
      if (e.dtype !== r.dtype) throw new Error("sparseValues.dtype must match defaultValues.dtype");
    }(o, a, n, i), kt.runKernel(function (t) {
      return t.sparseToDense(o, a, n, i);
    }, {
      $sparseIndices: o,
      $sparseValues: a,
      $defaultValue: i
    });
  }
});
exports.sparseToDense = Nc;
var Sc = mn({
  gatherND_: function (t, e) {
    var n = rn(e, "indices", "gatherND", "int32"),
        r = rn(t, "x", "gatherND");
    return kt.runKernel(function (t) {
      return t.gatherND(r, n);
    }, {
      $x: r,
      $indices: n
    });
  }
});
exports.gatherND = Sc;
var Ac = mn({
  diag_: function (t) {
    var e = rn(t, "x", "diag").flatten(),
        n = t.shape.concat(t.shape);
    return kt.runKernel(function (t) {
      return t.diag(e);
    }, {
      $x: e
    }).reshape(n);
  }
});
exports.diag = Ac;
var Tc = mn({
  dropout_: function (t, e, n, r) {
    var o = rn(t, "x", "dropout");
    if (h("float32" === o.dtype, function () {
      return "x has to be a floating point tensor since it's going to be scaled, but got a " + o.dtype + " tensor instead.";
    }), h(e >= 0 && e < 1, function () {
      return "rate must be a float in the range [0, 1), but got " + e + ".";
    }), 0 === e) return t instanceof ut ? o.clone() : o;

    var a = function (t, e) {
      if (null == e) return t.shape.slice();
      if (m(t.shape, e)) return e;

      if (t.shape.length === e.length) {
        for (var n = [], r = 0; r < t.shape.length; r++) null == e[r] && null != t.shape[r] ? n.push(t.shape[r]) : n.push(e[r]);

        return n;
      }

      return e;
    }(o, n),
        i = 1 - e,
        s = xr(a, 0, 1, "float32", r).add(i).floor().div(i);

    return o.mul(s);
  }
});
exports.dropout = Tc;

function Dc(t, e, n) {
  for (var r = 1 - t % 2, o = new Float32Array(t), a = 0; a < t; ++a) {
    var i = 2 * Math.PI * a / (t + r - 1);
    o[a] = e - n * Math.cos(i);
  }

  return En(o, "float32");
}

var _c = mn({
  hannWindow_: function (t) {
    return Dc(t, .5, .5);
  }
}),
    Oc = mn({
  hammingWindow_: function (t) {
    return Dc(t, .54, .46);
  }
}),
    Fc = mn({
  frame_: function (t, e, n, r, o) {
    void 0 === r && (r = !1), void 0 === o && (o = 0);

    for (var a = 0, i = []; a + e <= t.size;) i.push(Hl(t, a, e)), a += n;

    if (r) for (; a < t.size;) {
      var s = a + e - t.size,
          u = Bn([Hl(t, a, e - s), Dn([s], o)]);
      i.push(u), a += n;
    }
    return 0 === i.length ? Rn([], [0, e]) : Bn(i).as2D(i.length, e);
  }
}),
    Mc = mn({
  stft_: function (t, e, n, r, o) {
    var a;
    void 0 === o && (o = _c), null == r && (a = e, r = Math.floor(Math.pow(2, Math.ceil(Math.log(a) / Math.log(2)))));

    for (var i = Fc(t, e, n), s = Hu(i, o(e)), u = [], l = 0; l < i.shape[0]; l++) u.push(Rc(s.slice([l, 0], [1, e]), r));

    return Bn(u);
  }
}),
    Bc = Object.freeze({
  hannWindow: _c,
  hammingWindow: Oc,
  frame: Fc,
  stft: Mc
});

exports.signal = Bc;
exports.stft = Mc;
exports.frame = Fc;
exports.hammingWindow = Oc;
exports.hannWindow = _c;

var Pc,
    Lc = function (t, e, o) {
  return void 0 === o && (o = 1), n(this, void 0, void 0, function () {
    var n, a, i, s, u, l, c, f, d, v, m, g, y, x;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = rn(t, "predictions", "inTopK"), a = rn(e, "targets", "inTopK"), h(n.rank > 1, function () {
            return "inTopK() expects the predictions to be of rank 2 or higher, but got " + n.rank;
          }), h(n.rank - 1 === a.rank, function () {
            return "predictions rank should be 1 larger than targets rank, but got predictions rank " + n.rank + " and targets rank " + a.rank;
          }), p(n.shape.slice(0, n.shape.length - 1), a.shape, "predictions's shape should be align with the targets' shape, except the last dimension."), i = n.shape[n.shape.length - 1], h(o > 0 && o <= i, function () {
            return "'k' passed to inTopK() must be > 0 && <= the predictions last dimension (" + i + "), but got " + o;
          }), [4, n.data()];

        case 1:
          return s = r.sent(), [4, a.data()];

        case 2:
          for (u = r.sent(), l = [s.length / i, i], f = l[1], d = I("bool", c = l[0]), v = 0; v < c; v++) {
            for (m = v * f, g = s.subarray(m, m + f), y = [], x = 0; x < g.length; x++) y.push({
              value: g[x],
              index: x
            });

            for (y.sort(function (t, e) {
              return e.value - t.value;
            }), d[v] = 0, x = 0; x < o; x++) if (y[x].index === u[v]) {
              d[v] = 1;
              break;
            }
          }

          return t !== n && n.dispose(), e !== a && a.dispose(), [2, bn(d, a.shape, "bool")];
      }
    });
  });
};

exports.inTopKAsync = Lc;
exports.Reduction = Pc;
!function (t) {
  t[t.NONE = 0] = "NONE", t[t.MEAN = 1] = "MEAN", t[t.SUM = 2] = "SUM", t[t.SUM_BY_NONZERO_WEIGHTS = 3] = "SUM_BY_NONZERO_WEIGHTS";
}(Pc || (exports.Reduction = Pc = {}));
var Wc = mn({
  absoluteDifference_: function (t, e, n, r) {
    void 0 === r && (r = Pc.SUM_BY_NONZERO_WEIGHTS);
    var o = rn(t, "labels", "absoluteDifference"),
        a = rn(e, "predictions", "absoluteDifference"),
        i = null;
    null != n && (i = rn(n, "weights", "absoluteDifference")), p(o.shape, a.shape, "Error in absoluteDifference: ");
    var s = o.sub(a).abs();
    return Uc(s, i, r);
  }
}),
    Uc = mn({
  computeWeightedLoss_: function (t, e, n) {
    void 0 === n && (n = Pc.SUM_BY_NONZERO_WEIGHTS);
    var r = rn(t, "losses", "computeWeightedLoss"),
        o = null;
    null != e && (o = rn(e, "weights", "computeWeightedLoss"));
    var a = null == o ? r : r.mul(o);
    if (n === Pc.NONE) return a;
    if (n === Pc.SUM) return a.sum();

    if (n === Pc.MEAN) {
      if (null == o) return a.mean();
      var i = r.size / o.size,
          s = a.sum().div(o.sum());
      return i > 1 ? s.div(Cn(i)) : s;
    }

    if (n === Pc.SUM_BY_NONZERO_WEIGHTS) {
      if (null == o) return a.sum().div(Cn(r.size));
      var u = o.mul(An(r.shape)).notEqual(Cn(0)).sum().toFloat();
      return a.sum().div(u);
    }

    throw Error("Unknown reduction: " + n);
  }
}),
    Vc = mn({
  cosineDistance_: function (t, e, n, r, o) {
    void 0 === o && (o = Pc.SUM_BY_NONZERO_WEIGHTS);
    var a = rn(t, "labels", "cosineDistance"),
        i = rn(e, "predictions", "cosineDistance"),
        s = null;
    null != r && (s = rn(r, "weights", "cosineDistance")), p(a.shape, i.shape, "Error in cosineDistance: ");
    var u = Cn(1).sub(a.mul(i).sum(n, !0));
    return Uc(u, s, o);
  }
}),
    zc = mn({
  hingeLoss_: function (t, e, n, r) {
    void 0 === r && (r = Pc.SUM_BY_NONZERO_WEIGHTS);
    var o = rn(t, "labels", "hingeLoss"),
        a = rn(e, "predictions", "hingeLoss"),
        i = null;
    null != n && (i = rn(n, "weights", "hingeLoss")), p(o.shape, a.shape, "Error in hingeLoss: ");
    var s = Cn(1);
    o = Cn(2).mul(o).sub(s);
    var u = s.sub(o.mul(a)).relu();
    return Uc(u, i, r);
  }
}),
    Gc = mn({
  huberLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1), void 0 === o && (o = Pc.SUM_BY_NONZERO_WEIGHTS);
    var a = rn(t, "labels", "huberLoss"),
        i = rn(e, "predictions", "huberLoss"),
        s = null;
    null != n && (s = rn(n, "weights", "huberLoss")), p(a.shape, i.shape, "Error in huberLoss: ");
    var u = Cn(r),
        l = i.sub(a).abs(),
        c = Uu(l, u),
        h = l.sub(c),
        f = Cn(.5).mul(c.square()).add(u.mul(h));
    return Uc(f, s, o);
  }
}),
    Hc = mn({
  logLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1e-7), void 0 === o && (o = Pc.SUM_BY_NONZERO_WEIGHTS);
    var a = rn(t, "labels", "logLoss"),
        i = rn(e, "predictions", "logLoss"),
        s = null;
    null != n && (s = rn(n, "weights", "logLoss")), p(a.shape, i.shape, "Error in logLoss: ");
    var u = Cn(1),
        l = Cn(r),
        c = a.mul(i.add(l).log()).neg().sub(u.sub(a).mul(u.sub(i).add(l).log()));
    return Uc(c, s, o);
  }
}),
    qc = mn({
  meanSquaredError_: function (t, e, n, r) {
    void 0 === r && (r = Pc.SUM_BY_NONZERO_WEIGHTS);
    var o = rn(t, "labels", "meanSquaredError"),
        a = rn(e, "predictions", "meanSquaredError"),
        i = null;
    null != n && (i = rn(n, "weights", "meanSquaredError")), p(o.shape, a.shape, "Error in meanSquaredError: ");
    var s = o.squaredDifference(a);
    return Uc(s, i, r);
  }
}),
    $c = mn({
  sigmoidCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Pc.SUM_BY_NONZERO_WEIGHTS);
    var a = rn(t, "multiClassLabels", "sigmoidCrossEntropy"),
        i = rn(e, "logits", "sigmoidCrossEntropy"),
        s = null;

    if (null != n && (s = rn(n, "weights", "sigmoidCrossEntropy")), p(a.shape, i.shape, "Error in sigmoidCrossEntropy: "), r > 0) {
      var u = Cn(r),
          l = Cn(1),
          c = Cn(.5);
      a = a.mul(l.sub(u)).add(c.mul(u));
    }

    var h = function (t, e) {
      var n = rn(t, "labels", "sigmoidCrossEntropyWithLogits"),
          r = rn(e, "logits", "sigmoidCrossEntropyWithLogits");
      p(n.shape, r.shape, "Error in sigmoidCrossEntropyWithLogits: ");
      var o = r.relu(),
          a = r.mul(n),
          i = r.abs().neg().exp().log1p();
      return o.sub(a).add(i);
    }(a, i);

    return Uc(h, s, o);
  }
}),
    Kc = mn({
  softmaxCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Pc.SUM_BY_NONZERO_WEIGHTS);
    var a = rn(t, "onehotLabels", "softmaxCrossEntropy"),
        i = rn(e, "logits", "softmaxCrossEntropy"),
        s = null;

    if (null != n && (s = rn(n, "weights", "softmaxCrossEntropy")), p(a.shape, i.shape, "Error in softmaxCrossEntropy: "), r > 0) {
      var u = Cn(r),
          l = Cn(1),
          c = Cn(a.shape[1]);
      a = a.mul(l.sub(u)).add(u.div(c));
    }

    var h = function (t, e, n) {
      if (void 0 === n && (n = -1), -1 === n && (n = e.rank - 1), n !== e.rank - 1) throw Error("Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank " + e.rank + " and dim was " + n);
      return Xr(function (t, e, r) {
        var o = e.logSumExp([n], !0),
            a = e.toFloat().sub(o);
        return r([t, a]), {
          value: a.mul(t).neg().sum([n]),
          gradFunc: function (t, e) {
            var r = e[0],
                o = e[1],
                a = ln(t.shape, [n]);
            return [t.reshape(a).mul(r.toFloat().sub(o.exp())), t.reshape(a).mul(o.exp().sub(r.toFloat()))];
          }
        };
      })(t, e);
    }(a, i);

    return Uc(h, s, o);
  }
}),
    jc = Object.freeze({
  get Reduction() {
    return Pc;
  },

  absoluteDifference: Wc,
  computeWeightedLoss: Uc,
  cosineDistance: Vc,
  hingeLoss: zc,
  huberLoss: Gc,
  logLoss: Hc,
  meanSquaredError: qc,
  sigmoidCrossEntropy: $c,
  softmaxCrossEntropy: Kc
});
exports.losses = jc;

function Xc(t, e) {
  return void 0 === e && (e = !1), kt.tidy(function () {
    if (2 !== t.shape.length) throw new Error("qr2d() requires a 2D Tensor, but got a " + t.shape.length + "D Tensor.");

    for (var n = t.shape[0], r = t.shape[1], o = ur(n), a = t.clone(), i = Rn([[1]], [1, 1]), s = i.clone(), u = n >= r ? r : n, l = function (t) {
      var e,
          u = a,
          l = s,
          c = o;
      e = kt.tidy(function () {
        var e = a.slice([t, t], [n - t, 1]),
            u = e.norm(),
            l = a.slice([t, t], [1, 1]),
            c = Rn([[-1]]).where(l.greater(0), Rn([[1]])),
            h = l.sub(c.mul(u)),
            p = e.div(h);
        s = 1 === p.shape[0] ? i.clone() : i.concat(p.slice([1, 0], [p.shape[0] - 1, p.shape[1]]), 0);
        var f = c.matMul(h).div(u).neg(),
            d = a.slice([t, 0], [n - t, r]),
            v = f.mul(s);
        if (0 === t) a = d.sub(v.matMul(s.transpose().matMul(d)));else {
          var m = d.sub(v.matMul(s.transpose().matMul(d)));
          a = a.slice([0, 0], [t, r]).concat(m, 0);
        }
        var g = o.slice([0, t], [n, o.shape[1] - t]);
        if (0 === t) o = g.sub(g.matMul(s).matMul(v.transpose()));else {
          var y = g.sub(g.matMul(s).matMul(v.transpose()));
          o = o.slice([0, 0], [n, t]).concat(y, 1);
        }
        return [s, a, o];
      }), s = e[0], a = e[1], o = e[2], ze([u, l, c]);
    }, c = 0; c < u; ++c) l(c);

    return !e && n > r && (o = o.slice([0, 0], [n, r]), a = a.slice([0, 0], [r, r])), [o, a];
  });
}

var Yc = mn({
  gramSchmidt_: function (t) {
    var e;

    if (Array.isArray(t)) {
      e = !1, h(null != t && t.length > 0, function () {
        return "Gram-Schmidt process: input must not be null, undefined, or empty";
      });

      for (var n = t[0].shape[0], r = function (e) {
        h(t[e].shape[0] === n, function () {
          return "Gram-Schmidt: Non-unique lengths found in the input vectors: (" + t[e].shape[0] + " vs. " + n + ")";
        });
      }, o = 1; o < t.length; ++o) r(o);
    } else e = !0, t = Vn(t, t.shape[0], 0).map(function (t) {
      return Cr(t, [0]);
    });

    h(t.length <= t[0].shape[0], function () {
      return "Gram-Schmidt: Number of vectors (" + t.length + ") exceeds number of dimensions (" + t[0].shape[0] + ").";
    });

    var a = [],
        i = t,
        s = function (t) {
      a.push(kt.tidy(function () {
        var e = i[t];
        if (t > 0) for (var n = 0; n < t; ++n) {
          var r = ac(a[n].mulStrict(e)).mul(a[n]);
          e = e.sub(r);
        }
        return e.div(vc(e, "euclidean"));
      }));
    };

    for (o = 0; o < t.length; ++o) s(o);

    return e ? Er(a, 0) : a;
  }
}),
    Qc = mn({
  qr_: function (t, e) {
    if (void 0 === e && (e = !1), t.rank < 2) throw new Error("qr() requires input tensor to have a rank >= 2, but got rank " + t.rank);
    if (2 === t.rank) return Xc(t, e);
    var n = t.shape.slice(0, t.shape.length - 2).reduce(function (t, e) {
      return t * e;
    }),
        r = kr(t.reshape([n, t.shape[t.shape.length - 2], t.shape[t.shape.length - 1]]), 0),
        o = [],
        a = [];
    return r.forEach(function (t) {
      var n = Xc(t, e),
          r = n[0],
          i = n[1];
      o.push(r), a.push(i);
    }), [Er(o, 0).reshape(t.shape), Er(a, 0).reshape(t.shape)];
  }
}),
    Jc = Object.freeze({
  gramSchmidt: Yc,
  qr: Qc
});
exports.linalg = Jc;

function Zc(t, e, n, r, o) {
  null == r && (r = .5), null == o && (o = Number.NEGATIVE_INFINITY);
  var a = t.shape[0];
  return n = Math.min(n, a), h(0 <= r && r <= 1, function () {
    return "iouThreshold must be in [0, 1], but was '" + r + "'";
  }), h(2 === t.rank, function () {
    return "boxes must be a 2D tensor, but was of rank '" + t.rank + "'";
  }), h(4 === t.shape[1], function () {
    return "boxes must have 4 columns, but 2nd dimension was " + t.shape[1];
  }), h(1 === e.rank, function () {
    return "scores must be a 1D tensor";
  }), h(e.shape[0] === a, function () {
    return "scores has incompatible shape with boxes. Expected " + a + ", but was " + e.shape[0];
  }), {
    maxOutputSize: n,
    iouThreshold: r,
    scoreThreshold: o
  };
}

var th = mn({
  resizeBilinear_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = rn(t, "images", "resizeBilinear");
    h(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeBilinear: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), h(2 === e.length, function () {
      return "Error in resizeBilinear: new shape must 2D, but got shape " + e + ".";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = kt.runKernel(function (t, e) {
      return e([o]), t.resizeBilinear(o, i, s, n);
    }, {
      batchImages: o
    }, function (t, e) {
      return {
        batchImages: function () {
          return kt.runKernel(function (r) {
            return r.resizeBilinearBackprop(t, e[0], n);
          }, {});
        }
      };
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    eh = mn({
  resizeNearestNeighbor_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = rn(t, "images", "resizeNearestNeighbor");
    h(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), h(2 === e.length, function () {
      return "Error in resizeNearestNeighbor: new shape must 2D, but got shape " + e + ".";
    }), h("float32" === r.dtype || "int32" === r.dtype, function () {
      return "`images` must have `int32` or `float32` as dtype";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = kt.runKernel(function (t, e) {
      return e([o]), t.resizeNearestNeighbor(o, i, s, n);
    }, {
      batchImages: o
    }, function (t, e) {
      return {
        batchImages: function () {
          return kt.runKernel(function (r) {
            return r.resizeNearestNeighborBackprop(t, e[0], n);
          }, {});
        }
      };
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    nh = mn({
  nonMaxSuppression_: function (t, e, n, r, o) {
    void 0 === r && (r = .5), void 0 === o && (o = Number.NEGATIVE_INFINITY);
    var a = rn(t, "boxes", "nonMaxSuppression"),
        i = rn(e, "scores", "nonMaxSuppression"),
        s = Zc(a, i, n, r, o);
    return n = s.maxOutputSize, r = s.iouThreshold, o = s.scoreThreshold, kt.runKernel(function (t) {
      return t.nonMaxSuppression(a, i, n, r, o);
    }, {
      $boxes: a
    });
  }
}),
    rh = function (t, e, o, a, i) {
  return void 0 === a && (a = .5), void 0 === i && (i = Number.NEGATIVE_INFINITY), n(this, void 0, void 0, function () {
    var n, s, u, l, c, h, p;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = rn(t, "boxes", "nonMaxSuppressionAsync"), s = rn(e, "scores", "nonMaxSuppressionAsync"), u = Zc(n, s, o, a, i), o = u.maxOutputSize, a = u.iouThreshold, i = u.scoreThreshold, [4, Promise.all([n.data(), s.data()])];

        case 1:
          return l = r.sent(), c = l[0], h = l[1], p = Io(c, h, o, a, i), n !== t && n.dispose(), s !== e && s.dispose(), [2, p];
      }
    });
  });
},
    oh = mn({
  cropAndResize_: function (t, e, n, r, o, a) {
    var i = rn(t, "image", "cropAndResize", "float32"),
        s = rn(e, "boxes", "cropAndResize", "float32"),
        u = rn(n, "boxInd", "cropAndResize", "int32");
    o = o || "bilinear", a = a || 0;
    var l = s.shape[0];
    return h(4 === i.rank, function () {
      return "Error in cropAndResize: image must be rank 4,but got rank " + i.rank + ".";
    }), h(2 === s.rank && 4 === s.shape[1], function () {
      return "Error in cropAndResize: boxes must be have size [" + l + ",4] but had shape " + s.shape + ".";
    }), h(1 === u.rank && u.shape[0] === l, function () {
      return "Error in cropAndResize: boxInd must be have size [" + l + "] but had shape " + s.shape + ".";
    }), h(2 === r.length, function () {
      return "Error in cropAndResize: cropSize must be of length 2, but got length " + r.length + ".";
    }), h(r[0] >= 1 && r[1] >= 1, function () {
      return "cropSize must be atleast [1,1], but was " + r;
    }), h("bilinear" === o || "nearest" === o, function () {
      return "method must be bilinear or nearest, but was " + o;
    }), kt.runKernel(function (t, e) {
      return t.cropAndResize(i, s, u, r, o, a);
    }, {
      $image: i,
      $boxes: s
    });
  }
}),
    ah = Object.freeze({
  resizeBilinear: th,
  resizeNearestNeighbor: eh,
  nonMaxSuppression: nh,
  nonMaxSuppressionAsync: rh,
  cropAndResize: oh
});

exports.image = ah;
var ih = mn({
  matMul_: function (t) {
    var e,
        n = t.a,
        r = t.b,
        o = t.transposeA,
        a = void 0 !== o && o,
        i = t.transposeB,
        s = void 0 !== i && i,
        u = t.bias,
        l = t.activation,
        c = void 0 === l ? "linear" : l,
        p = t.preluActivationWeights,
        f = rn(n, "a", "fused matMul"),
        d = rn(r, "b", "fused matMul");
    e = xt(f, d), f = e[0], d = e[1];
    var g = a ? f.shape[f.rank - 2] : f.shape[f.rank - 1],
        y = s ? d.shape[d.rank - 1] : d.shape[d.rank - 2],
        x = a ? f.shape[f.rank - 1] : f.shape[f.rank - 2],
        b = s ? d.shape[d.rank - 2] : d.shape[d.rank - 1],
        w = f.shape.slice(0, -2),
        C = d.shape.slice(0, -2),
        E = v(w),
        R = v(C);
    h(f.rank >= 2 && d.rank >= 2 && f.rank === d.rank, function () {
      return "Error in fused matMul: inputs must have the same rank of at least 2, got ranks " + f.rank + " and " + d.rank + ".";
    }), h(m(w, C), function () {
      return "Error in fused matMul: outer dimensions (" + w + ") and (" + C + ") of Tensors with shapes " + f.shape + " and " + d.shape + " must match.";
    }), h(g === y, function () {
      return "Error in fused matMul: inner shapes (" + g + ") and (" + y + ") of Tensors with shapes " + f.shape + " and " + d.shape + " and transposeA=" + a + " and transposeB=" + s + " must match.";
    });
    var I,
        k,
        N = f.shape.slice(0, -2).concat([x, b]),
        S = a ? f.as3D(E, g, x) : f.as3D(E, x, g),
        A = s ? d.as3D(R, b, y) : d.as3D(R, y, b);
    null != u && ro(N, (I = xt(I = rn(u, "bias", "fused matMul"), f)[0]).shape), null != p && (k = rn(p, "prelu weights", "fused matMul"));
    var T = {
      $a: S,
      $b: A
    };
    return null != u && (T.$bias = I), null != p && (T.$preluActivationWeights = k), kt.runKernel(function (t, e) {
      var n = t.fusedBatchMatMul({
        a: S,
        b: A,
        transposeA: a,
        transposeB: s,
        bias: I,
        activation: c,
        preluActivationWeights: k
      });
      return e([S, A, n]), n;
    }, T, function (t, e) {
      var n,
          r = e[0],
          o = e[1],
          i = e[2];
      if (null == c || "linear" === c) n = t;else {
        if ("relu" !== c) throw new Error("Gradient for activation " + c + " has not been implemented yet.");
        n = t.mul(i.step());
      }
      var l = {};
      return null != u && (l = {
        $bias: function () {
          var t = n,
              e = no(I.shape, n.shape);
          return e.length > 0 && (t = t.sum(e)), t.reshape(I.shape);
        }
      }), a || s ? !a && s ? Object.assign({
        $a: function () {
          return n.matMul(o, !1, !1);
        },
        $b: function () {
          return n.matMul(r, !0, !1);
        }
      }, l) : a && !s ? Object.assign({
        $a: function () {
          return o.matMul(n, !1, !0);
        },
        $b: function () {
          return r.matMul(n, !1, !1);
        }
      }, l) : Object.assign({
        $a: function () {
          return o.matMul(n, !0, !0);
        },
        $b: function () {
          return n.matMul(r, !0, !0);
        }
      }, l) : Object.assign({
        $a: function () {
          return n.matMul(o, !1, !0);
        },
        $b: function () {
          return r.matMul(n, !0, !1);
        }
      }, l);
    }).reshape(N);
  }
}),
    sh = mn({
  conv2d_: function (t) {
    var e = t.x,
        n = t.filter,
        r = t.strides,
        o = t.pad,
        a = t.dataFormat,
        i = void 0 === a ? "NHWC" : a,
        s = t.dilations,
        u = void 0 === s ? [1, 1] : s,
        l = t.dimRoundingMode,
        c = t.bias,
        p = t.activation,
        f = void 0 === p ? "linear" : p,
        d = t.preluActivationWeights,
        v = rn(e, "x", "conv2d"),
        m = rn(n, "filter", "conv2d"),
        y = v,
        x = !1;
    3 === v.rank && (x = !0, y = v.as4D(1, v.shape[0], v.shape[1], v.shape[2])), h(4 === y.rank, function () {
      return "Error in fused conv2d: input must be rank 4, but got rank " + y.rank + ".";
    }), h(4 === m.rank, function () {
      return "Error in fused conv2d: filter must be rank 4, but got rank " + m.rank + ".";
    }), null != l && h(g(o), function () {
      return "Error in fused conv2d: pad must be an integer when using, dimRoundingMode " + l + " but got pad " + o + ".";
    }), h(y.shape[3] === m.shape[2], function () {
      return "Error in conv2d: depth of input (" + y.shape[3] + ") must match input depth for filter " + m.shape[2] + ".";
    }), h(vo(r, u), function () {
      return "Error in conv2D: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + u + "'";
    }), h("NHWC" === i, function () {
      return "Error in conv2d: got dataFormat of " + i + " but only NHWC is currently supported.";
    });
    var b,
        w,
        C = io(y.shape, m.shape, r, u, o, l);
    null != c && (b = xt(b = rn(c, "bias", "fused conv2d"), v)[0], ro(C.outShape, b.shape)), null != d && (w = rn(d, "prelu weights", "fused conv2d"));
    var E = {
      x: y,
      $filter: m
    };
    null != c && (E.$bias = b), null != d && (E.$preluActivationWeights = w);
    var R = kt.runKernel(function (t, e) {
      var n = t.fusedConv2d({
        input: y,
        filter: m,
        convInfo: C,
        bias: b,
        activation: f,
        preluActivationWeights: w
      });
      return e([m, y, n]), n;
    }, E, function (t, e) {
      var n,
          a = e,
          i = a[0],
          s = a[1],
          l = a[2];
      if (null == f || "linear" === f) n = t;else {
        if ("relu" !== f) throw new Error("Gradient for activation " + f + " has not been implemented yet.");
        n = t.mul(l.step());
      }
      h(fo(u), function () {
        return "Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + u + "'";
      });
      var p = {};
      return null != c && (p = {
        $bias: function () {
          var t = n,
              e = no(b.shape, n.shape);
          return e.length > 0 && (t = t.sum(e)), t.reshape(b.shape);
        }
      }), Object.assign({
        x: function () {
          return Cl(s.shape, n, i, r, o);
        },
        $filter: function () {
          return wl(s, n, i.shape, r, o);
        }
      }, p);
    });
    return x ? R.as3D(R.shape[1], R.shape[2], R.shape[3]) : R;
  }
}),
    uh = mn({
  depthwiseConv2d_: function (t) {
    var e = t.x,
        n = t.filter,
        r = t.strides,
        o = t.pad,
        a = (t.dataFormat, t.dilations),
        i = void 0 === a ? [1, 1] : a,
        s = t.dimRoundingMode,
        u = t.bias,
        l = t.activation,
        c = void 0 === l ? "linear" : l,
        p = t.preluActivationWeights,
        f = rn(e, "x", "depthwiseConv2d"),
        d = rn(n, "filter", "depthwiseConv2d"),
        v = f,
        m = !1;
    3 === f.rank && (m = !0, v = f.as4D(1, f.shape[0], f.shape[1], f.shape[2])), h(4 === v.rank, function () {
      return "Error in fused depthwiseConv2d: input must be rank 4, but got rank " + v.rank + ".";
    }), h(4 === d.rank, function () {
      return "Error in fused depthwiseConv2d: filter must be rank 4, but got rank " + d.rank + ".";
    }), h(v.shape[3] === d.shape[2], function () {
      return "Error in fused depthwiseConv2d: number of input channels (" + v.shape[3] + ") must match the inChannels dimension in filter " + d.shape[2] + ".";
    }), null == i && (i = [1, 1]), h(vo(r, i), function () {
      return "Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + i + "'";
    }), null != s && h(g(o), function () {
      return "Error in fused depthwiseConv2d: pad must be an integer when using dimRoundingMode " + s + " but got pad " + o + ".";
    });
    var y,
        x,
        b = io(v.shape, d.shape, r, i, o, s, !0);
    null != u && (y = xt(y = rn(u, "bias", "fused conv2d"), f)[0], ro(b.outShape, y.shape)), null != p && (x = rn(p, "prelu weights", "fused depthwiseConv2d"));
    var w = {
      x: v,
      $filter: d
    };
    null != u && (w.$bias = y), null != p && (w.$preluActivationWeights = x);
    var C = kt.runKernel(function (t, e) {
      var n = t.fusedDepthwiseConv2D({
        input: v,
        filter: d,
        convInfo: b,
        bias: y,
        activation: c,
        preluActivationWeights: x
      });
      return e([v, d, n]), n;
    }, w, function (t, e) {
      h(fo(i), function () {
        return "Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '" + i + "'";
      });
      var n,
          r = e[0],
          o = e[1],
          a = e[2];
      if (null == c || "linear" === c) n = t;else {
        if ("relu" !== c) throw new Error("Gradient for activation " + c + " has not been implemented yet.");
        n = t.mul(a.step());
      }
      var s = {};
      return null != u && (s = {
        $bias: function () {
          var t = n,
              e = no(y.shape, n.shape);
          return e.length > 0 && (t = t.sum(e)), t.reshape(y.shape);
        }
      }), Object.assign({
        x: function () {
          return Rl(r.shape, n, o, b);
        },
        $filter: function () {
          return Il(r, n, o.shape, b);
        }
      }, s);
    });
    return m ? C.as3D(C.shape[1], C.shape[2], C.shape[3]) : C;
  }
}),
    lh = Object.freeze({
  matMul: ih,
  conv2d: sh,
  depthwiseConv2d: uh
}),
    ch = Object.freeze({
  image: ah,
  linalg: Jc,
  losses: jc,
  spectral: kc,
  fused: lh,
  signal: Bc,
  conv1d: yl,
  conv2d: xl,
  conv3d: bl,
  depthwiseConv2d: El,
  separableConv2d: kl,
  conv2dTranspose: Nl,
  conv3dTranspose: Sl,
  op: mn,
  batchNormalization2d: gu,
  batchNormalization3d: yu,
  batchNormalization4d: xu,
  batchNormalization: bu,
  batchNorm: wu,
  batchNorm2d: Cu,
  batchNorm3d: Eu,
  batchNorm4d: Ru,
  booleanMaskAsync: dl,
  complex: gn,
  real: yn,
  imag: xn,
  concat: Bn,
  concat1d: Pn,
  concat2d: Ln,
  concat3d: Wn,
  concat4d: Un,
  split: Vn,
  matMul: Al,
  dot: Tl,
  outerProduct: Dl,
  reverse: _l,
  reverse1d: Ol,
  reverse2d: Fl,
  reverse3d: Ml,
  reverse4d: Bl,
  maxPool: Wl,
  avgPool: Ul,
  pool: Vl,
  maxPool3d: zl,
  avgPool3d: Gl,
  slice: Hl,
  slice1d: ql,
  slice2d: $l,
  slice3d: Kl,
  slice4d: jl,
  abs: Ts,
  acos: Ds,
  acosh: _s,
  asin: Os,
  asinh: Fs,
  atan: Ms,
  atanh: Bs,
  ceil: Ps,
  clipByValue: Ls,
  cos: Ws,
  cosh: Us,
  erf: Vs,
  exp: zs,
  expm1: Gs,
  floor: Hs,
  log: qs,
  log1p: $s,
  logSigmoid: Ks,
  neg: js,
  reciprocal: Xs,
  round: Ys,
  rsqrt: Qs,
  sigmoid: Js,
  sign: Zs,
  isNaN: tu,
  isInf: eu,
  isFinite: nu,
  sin: ru,
  sinh: ou,
  softplus: au,
  sqrt: iu,
  square: su,
  step: uu,
  tan: lu,
  tanh: cu,
  all: Yl,
  any: Ql,
  argMax: Jl,
  argMin: Zl,
  logSumExp: tc,
  max: ec,
  mean: nc,
  min: rc,
  moments: oc,
  sum: ac,
  prod: ic,
  equal: Ju,
  equalStrict: Zu,
  greater: tl,
  greaterEqual: el,
  greaterEqualStrict: nl,
  greaterStrict: rl,
  less: ol,
  lessEqual: al,
  lessEqualStrict: il,
  lessStrict: sl,
  notEqual: ul,
  notEqualStrict: ll,
  add: Du,
  addN: _u,
  addStrict: Ou,
  atan2: Fu,
  div: Mu,
  divStrict: Bu,
  floorDiv: Pu,
  maximum: Lu,
  maximumStrict: Wu,
  minimum: Uu,
  minimumStrict: Vu,
  mod: zu,
  modStrict: Gu,
  mul: Hu,
  mulStrict: qu,
  pow: $u,
  powStrict: Ku,
  squaredDifference: ju,
  squaredDifferenceStrict: Xu,
  sub: Yu,
  subStrict: Qu,
  elu: sc,
  leakyRelu: uc,
  prelu: lc,
  relu: cc,
  relu6: hc,
  selu: pc,
  logicalAnd: Iu,
  logicalNot: ku,
  logicalOr: Nu,
  logicalXor: Su,
  where: Au,
  whereAsync: Tu,
  buffer: tr,
  print: er,
  batchToSpaceND: nr,
  cast: rr,
  clone: or,
  cumsum: ar,
  depthToSpace: ir,
  expandDims: sr,
  eye: ur,
  multinomial: lr,
  oneHot: cr,
  pad: hr,
  pad1d: pr,
  pad2d: fr,
  pad3d: dr,
  pad4d: vr,
  rand: mr,
  randomNormal: gr,
  randomGamma: yr,
  randomUniform: xr,
  reshape: br,
  spaceToBatchND: wr,
  squeeze: Cr,
  stack: Er,
  tile: Rr,
  truncatedNormal: Ir,
  unstack: kr,
  setdiff1dAsync: Nr,
  fill: Dn,
  linspace: _n,
  ones: An,
  range: On,
  scalar: Cn,
  tensor: bn,
  tensor1d: En,
  tensor2d: Rn,
  tensor3d: In,
  tensor4d: kn,
  tensor5d: Nn,
  tensor6d: Sn,
  zeros: Tn,
  onesLike: Fn,
  zerosLike: Mn,
  transpose: fc,
  softmax: Qr,
  logSoftmax: Jr,
  localResponseNormalization: dc,
  norm: vc,
  gather: pl,
  unsortedSegmentSum: fl,
  basicLSTMCell: mc,
  multiRNNCell: gc,
  movingAverage: yc,
  stridedSlice: xc,
  topk: bc,
  scatterND: wc,
  fft: Cc,
  ifft: Ec,
  rfft: Rc,
  irfft: Ic,
  sparseToDense: Nc,
  gatherND: Sc,
  diag: Ac,
  dropout: Tc,
  hannWindow: _c,
  hammingWindow: Oc,
  frame: Fc,
  stft: Mc,
  inTopKAsync: Lc
});
exports.fused = lh;

function hh(t, e, n, r) {
  if ("linear" === n) return t.linear(e);
  if ("relu" === n) return t.relu(e);
  if ("elu" === n) return t.elu(e);
  if ("relu6" === n) return t.relu6(e);
  if ("prelu" === n) return t.prelu(e, r);
  throw new Error("Activation " + n + " has not been implemented for the CPU backend.");
}

var ph = function () {
  function t() {
    if (this.blockSize = 48, this.firstUse = !0, a().get("IS_BROWSER")) {
      var t = "undefined" != typeof OffscreenCanvas ? new OffscreenCanvas(300, 150) : "undefined" != typeof document ? document.createElement("canvas") : null;
      null !== t && (this.fromPixels2DContext = t.getContext("2d"));
    }

    this.data = new Zr(this, kt);
  }

  return t.prototype.register = function (t, e, n) {
    if (this.firstUse && (this.firstUse = !1, a().get("IS_NODE") && tn("\n============================\nHi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.\n============================\n")), this.data.has(t)) throw new Error("Data buffer is already registered");
    this.data.set(t, {
      dtype: n
    });
  }, t.prototype.write = function (t, e) {
    if (null == e) throw new Error("MathBackendCPU.write(): values can not be null");
    this.data.get(t).values = e;
  }, t.prototype.fromPixels = function (t, e) {
    if (null == t) throw new Error("pixels passed to tf.browser.fromPixels() can not be null");
    var n,
        r,
        o = t.data instanceof Uint8Array,
        i = "undefined" != typeof ImageData && t instanceof ImageData,
        s = "undefined" != typeof HTMLVideoElement && t instanceof HTMLVideoElement,
        u = "undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement,
        l = s ? [t.videoWidth, t.videoHeight] : [t.width, t.height],
        c = l[0],
        h = l[1];
    if (a().get("IS_NODE") && null == t.getContext) throw new Error("When running in node, pixels must be an HTMLCanvasElement like the one returned by the `canvas` npm package");
    if (null != t.getContext) n = t.getContext("2d").getImageData(0, 0, c, h).data;else if (i || o) n = t.data;else {
      if (!u && !s) throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData or {data: Uint32Array, width: number, height: number}, but was " + t.constructor.name);
      if (null == this.fromPixels2DContext) throw new Error("Can't read pixels from HTMLImageElement outside the browser.");
      this.fromPixels2DContext.canvas.width = c, this.fromPixels2DContext.canvas.height = h, this.fromPixels2DContext.drawImage(t, 0, 0, c, h), n = this.fromPixels2DContext.getImageData(0, 0, c, h).data;
    }
    if (4 === e) r = new Int32Array(n);else {
      var p = c * h;
      r = new Int32Array(p * e);

      for (var f = 0; f < p; f++) for (var d = 0; d < e; ++d) r[f * e + d] = n[4 * f + d];
    }
    return In(r, [h, c, e], "int32");
  }, t.prototype.read = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        return [2, this.readSync(t)];
      });
    });
  }, t.prototype.readSync = function (t) {
    var e = this.data.get(t),
        n = e.dtype,
        r = e.complexTensors;
    return "complex64" === n ? wo(this.readSync(r.real.dataId), this.readSync(r.imag.dataId)) : this.data.get(t).values;
  }, t.prototype.bufferSync = function (t) {
    var e = this.readSync(t.dataId),
        n = e;
    if ("string" === t.dtype) try {
      n = e.map(function (t) {
        return K(t);
      });
    } catch (t) {
      throw new Error("Failed to decode encoded string bytes into utf-8");
    }
    return tr(t.shape, t.dtype, n);
  }, t.prototype.disposeData = function (t) {
    if (this.data.has(t)) {
      var e = this.data.get(t).complexTensors;
      null != e && (e.real.dispose(), e.imag.dispose()), this.data.delete(t);
    }
  }, t.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return e = H(), t(), [2, {
          kernelMs: H() - e
        }];
      });
    });
  }, t.prototype.memory = function () {
    return {
      unreliable: !0,
      reasons: ["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]
    };
  }, t.prototype.complex = function (t, e) {
    var n = ut.make(t.shape, {}, "complex64");
    return this.data.get(n.dataId).complexTensors = {
      real: kt.keep(t.clone()),
      imag: kt.keep(e.clone())
    }, n;
  }, t.prototype.real = function (t) {
    return this.data.get(t.dataId).complexTensors.real.clone();
  }, t.prototype.imag = function (t) {
    return this.data.get(t.dataId).complexTensors.imag.clone();
  }, t.prototype.assertNotComplex = function (t, e) {
    Array.isArray(t) || (t = [t]), t.forEach(function (t) {
      null != t && h("complex64" !== t.dtype, function () {
        return e + " does not support complex64 tensors.";
      });
    });
  }, t.prototype.slice = function (t, e, n) {
    if (this.assertNotComplex(t, "slice"), zr(t.shape, e, n)) {
      var r = Gr(e, t.strides),
          o = v(n);
      return bn(this.readSync(t.dataId).subarray(r, r + o), n, t.dtype);
    }

    for (var a = tr(n, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s).map(function (t, n) {
        return t + e[n];
      });
      a.values[s] = i.get.apply(i, u);
    }

    return a.toTensor();
  }, t.prototype.stridedSlice = function (t, e, n, r) {
    this.assertNotComplex(t, "stridedSlice");
    var o = Wr(e, n, r);
    if (o.some(function (t) {
      return 0 === t;
    })) return bn([], o);

    for (var a = tr(o, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; s++) {
      for (var u = a.indexToLoc(s), l = new Array(u.length), c = 0; c < l.length; c++) l[c] = u[c] * r[c] + e[c];

      a.set.apply(a, [i.get.apply(i, l)].concat(u));
    }

    return a.toTensor();
  }, t.prototype.diag = function (t) {
    for (var e = this.readSync(t.dataId), n = tr([t.size, t.size], t.dtype), r = n.values, o = 0; o < e.length; o++) r[o * t.size + o] = e[o];

    return n.toTensor();
  }, t.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, t.prototype.reverse = function (t, e) {
    this.assertNotComplex(t, "reverse");

    for (var n = tr(t.shape, t.dtype), r = this.bufferSync(t), o = function (o) {
      var a = n.indexToLoc(o),
          i = a.slice();
      e.forEach(function (e) {
        return i[e] = t.shape[e] - 1 - i[e];
      }), n.set.apply(n, [r.get.apply(r, i)].concat(a));
    }, a = 0; a < n.size; a++) o(a);

    return n.toTensor();
  }, t.prototype.concat = function (t, e) {
    var n = this;

    if ("complex64" === t[0].dtype) {
      var r = t.map(function (t) {
        return yn(t);
      }),
          o = t.map(function (t) {
        return xn(t);
      });
      return gn(this.concat(r, e), this.concat(o, e));
    }

    var a = t.map(function (t) {
      var n = v(t.shape.slice(e));
      return t.as2D(-1, n);
    }),
        i = vn(a.map(function (t) {
      return t.shape;
    }), 1),
        s = tr(i, t[0].dtype).values;

    if (1 === a[0].shape[0]) {
      var u = 0;
      a.forEach(function (t) {
        s.set(n.readSync(t.dataId), u), u += t.size;
      });
    } else {
      var l = 0;
      a.forEach(function (t) {
        for (var e = n.readSync(t.dataId), r = 0, o = 0; o < t.shape[0]; ++o) for (var a = o * i[1] + l, u = 0; u < t.shape[1]; ++u) s[a + u] = e[r++];

        l += t.shape[1];
      });
    }

    var c = vn(t.map(function (t) {
      return t.shape;
    }), e);
    return bn(s, c, t[0].dtype);
  }, t.prototype.neg = function (t) {
    return this.assertNotComplex(t, "neg"), this.multiply(Cn(-1), t);
  }, t.prototype.add = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t + n,
        imag: e + r
      };
    }) : this.broadcastedBinaryOp(t, e, gt(t.dtype, e.dtype), function (t, e) {
      return t + e;
    });
  }, t.prototype.addN = function (t) {
    var e = this;
    this.assertNotComplex(t, "addN");

    for (var n = t.map(function (t) {
      return e.readSync(t.dataId);
    }), r = tr(t[0].shape, t[0].dtype), o = r.values, a = 0; a < t.length; a++) for (var i = n[a], s = 0; s < o.length; s++) o[s] += i[s];

    return r.toTensor();
  }, t.prototype.subtract = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t - n,
        imag: e - r
      };
    }) : this.broadcastedBinaryOp(t, e, gt(t.dtype, e.dtype), function (t, e) {
      return t - e;
    });
  }, t.prototype.pow = function (t, e) {
    return this.assertNotComplex([t, e], "pow"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.pow(t, e);
    });
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    this.assertNotComplex([t, e], "matMul");

    for (var o = n ? t.shape[1] : t.shape[2], a = n ? t.shape[2] : t.shape[1], i = r ? e.shape[1] : e.shape[2], s = t.shape[0], u = this.readSync(t.dataId), l = this.readSync(e.dataId), c = n ? [t.strides[0], 1, t.strides[1]] : [t.strides[0], t.strides[1], 1], h = c[0], p = c[1], f = c[2], d = r ? [1, e.strides[1], e.strides[0]] : [e.strides[1], 1, e.strides[0]], v = d[0], m = d[1], g = d[2], y = a * i, x = tr([s, a, i], t.dtype), b = x.values, w = this.blockSize, C = 0; C < s; C++) for (var E = 0; E < a; E += w) for (var R = 0; R < i; R += w) for (var I = 0; I < o; I += w) for (var k = Math.min(E + w, a), N = Math.min(R + w, i), S = Math.min(I + w, o), A = E; A < k; A++) for (var T = R; T < N; T++) {
      for (var D = 0, _ = I; _ < S; _++) D += u[C * h + A * p + _ * f] * l[_ * v + T * m + C * g];

      b[C * y + (A * i + T)] += D;
    }

    return x.toTensor();
  }, t.prototype.fusedBatchMatMul = function (t) {
    var e = t.a,
        n = t.b,
        r = t.transposeA,
        o = t.transposeB,
        a = t.bias,
        i = t.activation,
        s = t.preluActivationWeights,
        u = this.batchMatMul(e, n, r, o);
    return a && (u = this.add(u, a)), i && (u = hh(this, u, i, s)), u;
  }, t.prototype.multiply = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t * n - e * r,
        imag: t * r + e * n
      };
    }) : this.broadcastedBinaryOp(t, e, gt(t.dtype, e.dtype), function (t, e) {
      return t * e;
    });
  }, t.prototype.realDivide = function (t, e) {
    this.assertNotComplex([t, e], "realDivide");
    return this.broadcastedBinaryOp(t, e, "float32", function (t, e) {
      return t / e;
    });
  }, t.prototype.floorDiv = function (t, e) {
    this.assertNotComplex([t, e], "floorDiv");
    return this.broadcastedBinaryOp(t, e, "int32", function (t, e) {
      return Math.floor(t / e);
    });
  }, t.prototype.sum = function (t, e) {
    this.assertNotComplex(t, "sum"), cn("sum", e, t.rank);

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, gt(t.dtype, "int32")), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = 0, p = 0; p < i; ++p) h += u[c + p];

      s[l] = h;
    }

    return a;
  }, t.prototype.prod = function (t, e) {
    this.assertNotComplex(t, "sum");

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, gt(t.dtype, "int32")), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = 1, p = 0; p < i; ++p) h *= u[c + p];

      s[l] = h;
    }

    return a;
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    this.assertNotComplex(t, "unsortedSegmentSum");

    for (var r = [], o = t.rank - e.rank, a = 0; a < o; ++a) e = e.expandDims(a + 1);

    for (a = 0; a < n; ++a) {
      var i = Cn(a, "int32"),
          s = Ju(i, e).asType("float32").mul(t).sum(0);
      r.push(s);
    }

    return Er(r);
  }, t.prototype.argMin = function (t, e) {
    this.assertNotComplex(t, "argMin");
    var n = [e];
    cn("argMin", n, t.rank);

    for (var r = un(t.shape, n), o = r[0], a = r[1], i = Tn(o, "int32"), s = v(a), u = this.readSync(i.dataId), l = this.readSync(t.dataId), c = 0; c < u.length; ++c) {
      for (var h = c * s, p = l[h], f = 0, d = 0; d < s; ++d) {
        var m = l[h + d];
        m < p && (p = m, f = d);
      }

      u[c] = f;
    }

    return i;
  }, t.prototype.argMax = function (t, e) {
    this.assertNotComplex(t, "argMax");
    var n = [e];
    cn("argMax", n, t.rank);

    for (var r = un(t.shape, n), o = r[0], a = r[1], i = Tn(o, "int32"), s = v(a), u = this.readSync(i.dataId), l = this.readSync(t.dataId), c = 0; c < u.length; ++c) {
      for (var h = c * s, p = l[h], f = 0, d = 0; d < s; ++d) {
        var m = l[h + d];
        m > p && (p = m, f = d);
      }

      u[c] = f;
    }

    return i;
  }, t.prototype.cumsum = function (t, e, n, r) {
    if (this.assertNotComplex(t, "cumsum"), e !== t.rank - 1) throw new Error("backend.cumsum in CPU expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);

    for (var o = gt(t.dtype, "int32"), a = Tn(t.shape, o), i = this.readSync(a.dataId), s = this.readSync(t.dataId), u = t.shape[t.rank - 1], l = r ? function (t, e) {
      return t + u - e - 1;
    } : function (t, e) {
      return t + e;
    }, c = 0; c < s.length; c += u) for (var h = 0; h < u; h++) {
      var p = l(c, h);
      if (0 === h) i[p] = n ? 0 : s[p];else {
        var f = l(c, h - 1);
        i[p] = n ? s[f] + i[f] : s[p] + i[f];
      }
    }

    return a;
  }, t.prototype.equal = function (t, e) {
    return this.assertNotComplex([t, e], "equal"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t === e ? 1 : 0;
    });
  }, t.prototype.notEqual = function (t, e) {
    return this.assertNotComplex([t, e], "notEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t !== e ? 1 : 0;
    });
  }, t.prototype.less = function (t, e) {
    return this.assertNotComplex([t, e], "less"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t < e ? 1 : 0;
    });
  }, t.prototype.lessEqual = function (t, e) {
    return this.assertNotComplex([t, e], "lessEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t <= e ? 1 : 0;
    });
  }, t.prototype.greater = function (t, e) {
    return this.assertNotComplex([t, e], "greater"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t > e ? 1 : 0;
    });
  }, t.prototype.greaterEqual = function (t, e) {
    return this.assertNotComplex([t, e], "greaterEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t >= e ? 1 : 0;
    });
  }, t.prototype.logicalNot = function (t) {
    this.assertNotComplex(t, "logicalNot");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) n[r] = e[r] ? 0 : 1;

    return ut.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.logicalAnd = function (t, e) {
    return this.assertNotComplex([t, e], "logicalAnd"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t && e;
    });
  }, t.prototype.logicalOr = function (t, e) {
    return this.assertNotComplex([t, e], "logicalOr"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t || e;
    });
  }, t.prototype.select = function (t, e, n) {
    this.assertNotComplex([t, e, n], "select");

    for (var r = this.readSync(t.dataId), o = this.readSync(e.dataId), a = this.readSync(n.dataId), i = Tn(e.shape, gt(e.dtype, n.dtype)), s = this.readSync(i.dataId), u = 0, l = 0 === t.rank || t.rank > 1 || 1 === e.rank ? 1 : v(e.shape.slice(1)), c = 0; c < r.length; c++) for (var h = 0; h < l; h++) 1 === r[c] ? s[u++] = o[c] : s[u++] = a[c];

    return i;
  }, t.prototype.where = function (t) {
    this.assertNotComplex([t], "where");
    var e = this.readSync(t.dataId);
    return To(t.shape, e);
  }, t.prototype.topk = function (t, e, n) {
    return this.assertNotComplex(t, "topk"), Ao(this.readSync(t.dataId), t.shape, t.dtype, e);
  }, t.prototype.min = function (t, e) {
    this.assertNotComplex(t, "min"), cn("min", e, t.rank);

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, t.dtype), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        f < h && (h = f);
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.minimum = function (t, e) {
    return this.assertNotComplex([t, e], "minimum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.min(t, e);
    });
  }, t.prototype.mod = function (t, e) {
    return this.assertNotComplex([t, e], "mod"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t % e;
      return t < 0 && e < 0 || t >= 0 && e >= 0 ? n : (n + e) % e;
    });
  }, t.prototype.max = function (t, e) {
    this.assertNotComplex(t, "max"), cn("max", e, t.rank);

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, t.dtype), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        f > h && (h = f);
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.maximum = function (t, e) {
    return this.assertNotComplex([t, e], "maximum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.max(t, e);
    });
  }, t.prototype.all = function (t, e) {
    this.assertNotComplex(t, "all"), cn("all", e, t.rank);

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, t.dtype), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        h = h && f;
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.any = function (t, e) {
    this.assertNotComplex(t, "any"), cn("any", e, t.rank);

    for (var n = un(t.shape, e), r = n[0], o = n[1], a = Tn(r, t.dtype), i = v(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), l = 0; l < s.length; ++l) {
      for (var c = l * i, h = u[c], p = 0; p < i; ++p) {
        var f = u[c + p];
        h = h || f;
      }

      s[l] = h;
    }

    return a;
  }, t.prototype.squaredDifference = function (t, e) {
    return this.assertNotComplex([t, e], "squaredDifference"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t - e;
      return n * n;
    });
  }, t.prototype.ceil = function (t) {
    this.assertNotComplex(t, "ceil");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.ceil(e[r]);

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.floor = function (t) {
    this.assertNotComplex(t, "floor");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.floor(e[r]);

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.sign = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) e[r] < 0 ? n[r] = -1 : e[r] > 0 ? n[r] = 1 : n[r] = 0;

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.isNaN = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isNaN(e[r]) && (n[r] = 1);

    return ut.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.isInf = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Math.abs(e[r]) === 1 / 0 && (n[r] = 1);

    return ut.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.isFinite = function (t) {
    this.assertNotComplex(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isFinite(e[r]) && (n[r] = 1);

    return ut.make(t.shape, {
      values: n
    }, "bool");
  }, t.prototype.round = function (t) {
    this.assertNotComplex(t, "round");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = Math.floor(e[r]);
      e[r] - o < .5 ? n[r] = Math.floor(e[r]) : e[r] - o > .5 ? n[r] = Math.ceil(e[r]) : n[r] = o % 2 == 0 ? o : o + 1;
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.exp = function (t) {
    this.assertNotComplex(t, "exp");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.exp(e[r]);

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.expm1 = function (t) {
    this.assertNotComplex(t, "expm1");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.expm1(e[r]);

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.log = function (t) {
    this.assertNotComplex(t, "log");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log(o);
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.log1p = function (t) {
    this.assertNotComplex(t, "log1p");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log1p(o);
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.sqrt = function (t) {
    this.assertNotComplex(t, "sqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.sqrt(o);
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.rsqrt = function (t) {
    this.assertNotComplex(t, "rsqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = 1 / Math.sqrt(o);
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.square = function (t) {
    this.assertNotComplex(t, "square");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = o * o;
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.reciprocal = function (t) {
    this.assertNotComplex(t, "reciprocal");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = 1 / e[r];

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.linear = function (t) {
    return t;
  }, t.prototype.relu = function (t) {
    this.assertNotComplex(t, "relu");

    for (var e = Tn(t.shape, t.dtype), n = this.readSync(e.dataId), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) n[o] = Math.max(0, r[o]);

    return e;
  }, t.prototype.relu6 = function (t) {
    this.assertNotComplex(t, "relu");

    for (var e = Tn(t.shape, t.dtype), n = this.readSync(e.dataId), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) n[o] = Math.min(Math.max(0, r[o]), 6);

    return e;
  }, t.prototype.prelu = function (t, e) {
    return this.assertNotComplex([t, e], "prelu"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return t < 0 ? e * t : t;
    });
  }, t.prototype.elu = function (t) {
    this.assertNotComplex(t, "elu");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = n[r];
      e[r] = o >= 0 ? o : Math.exp(o) - 1;
    }

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.eluDer = function (t, e) {
    this.assertNotComplex([t, e], "eluDer");

    for (var n = new Float32Array(e.size), r = this.readSync(e.dataId), o = this.readSync(t.dataId), a = 0; a < r.length; ++a) {
      var i = r[a];
      n[a] = i >= 1 ? o[a] : o[a] * (i + 1);
    }

    return ut.make(e.shape, {
      values: n
    });
  }, t.prototype.selu = function (t) {
    this.assertNotComplex(t, "selu");

    for (var e = Yi, n = Qi, r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i >= 0 ? n * i : e * (Math.exp(i) - 1);
    }

    return ut.make(t.shape, {
      values: r
    });
  }, t.prototype.clip = function (t, e, n) {
    this.assertNotComplex(t, "clip");

    for (var r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i > n ? n : i < e ? e : i;
    }

    return ut.make(t.shape, {
      values: r
    });
  }, t.prototype.abs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.abs(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.complexAbs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < t.size; ++r) {
      var o = n[2 * r],
          a = n[2 * r + 1];
      e[r] = Math.hypot(o, a);
    }

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.int = function (t) {
    this.assertNotComplex(t, "int");

    for (var e = new Int32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = n[r];

    return ut.make(t.shape, {
      values: e
    }, "int32");
  }, t.prototype.sigmoid = function (t) {
    this.assertNotComplex(t, "sigmoid");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = 1 / (1 + Math.exp(-n[r]));

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.softplus = function (t) {
    this.assertNotComplex(t, "softplus");

    for (var e = Math.log(1.1920928955078125e-7) + 2, n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o] > -e,
          i = r[o] < e,
          s = Math.exp(r[o]),
          u = void 0;
      u = i ? s : a ? r[o] : Math.log(1 + s), n[o] = u;
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.sin = function (t) {
    this.assertNotComplex(t, "sin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sin(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.cos = function (t) {
    this.assertNotComplex(t, "cos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cos(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.tan = function (t) {
    this.assertNotComplex(t, "tan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.tan(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.asin = function (t) {
    this.assertNotComplex(t, "asin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asin(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.acos = function (t) {
    this.assertNotComplex(t, "acos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acos(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.atan = function (t) {
    this.assertNotComplex(t, "atan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atan(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.atan2 = function (t, e) {
    return this.assertNotComplex([t, e], "atan2"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.atan2(t, e);
    });
  }, t.prototype.sinh = function (t) {
    this.assertNotComplex(t, "sinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sinh(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.cosh = function (t) {
    this.assertNotComplex(t, "cosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cosh(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.tanh = function (t) {
    this.assertNotComplex(t, "tanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = y(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.asinh = function (t) {
    this.assertNotComplex(t, "asinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asinh(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.acosh = function (t) {
    this.assertNotComplex(t, "acosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acosh(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.atanh = function (t) {
    this.assertNotComplex(t, "atanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atanh(n[r]);

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.erf = function (t) {
    this.assertNotComplex(t, "erf");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = Math.sign(n[r]),
          a = Math.abs(n[r]),
          i = 1 / (1 + .3275911 * a);
      e[r] = o * (1 - ((((1.061405429 * i - 1.453152027) * i + 1.421413741) * i - .284496736) * i + .254829592) * i * Math.exp(-a * a));
    }

    return ut.make(t.shape, {
      values: e
    });
  }, t.prototype.step = function (t, e) {
    void 0 === e && (e = 0), this.assertNotComplex(t, "step");

    for (var n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o];
      isNaN(a) ? n[o] = NaN : n[o] = a > 0 ? 1 : e;
    }

    return ut.make(t.shape, {
      values: n
    });
  }, t.prototype.fusedConv2d = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        a = t.activation,
        i = t.preluActivationWeights,
        s = this.conv2d(e, n, r);
    return o && (s = this.add(s, o)), a && (s = hh(this, s, a, i)), s;
  }, t.prototype.conv2d = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2d");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, l = "channelsLast" === n.dataFormat, c = tr(n.outShape, t.dtype), h = t.strides[0], p = l ? t.strides[1] : t.strides[2], f = l ? t.strides[2] : 1, d = l ? 1 : t.strides[1], v = c.strides[0], m = l ? c.strides[1] : c.strides[2], g = l ? c.strides[2] : 1, y = l ? 1 : c.strides[1], x = this.readSync(t.dataId), b = this.readSync(e.dataId), w = c.values, C = 0; C < n.batchSize; ++C) for (var E = C * h, R = C * v, I = 0; I < n.outHeight; ++I) for (var k = R + I * m, N = I * n.strideHeight - u, S = 0; S < r; S++) {
      var A = N + S * a;
      if (!(A < 0 || A >= n.inHeight)) for (var T = S * e.strides[0], D = E + A * p, _ = 0; _ < n.outWidth; ++_) for (var O = k + _ * g, F = _ * n.strideWidth - s, M = 0; M < o; M++) {
        var B = F + M * i;
        if (!(B < 0 || B >= n.inWidth)) for (var P = D + B * f, L = T + M * e.strides[1], W = 0; W < n.inChannels; ++W) {
          for (var U = x[P + W * d], V = 0; V < n.outChannels; ++V) w[O + V * y] += U * b[L + V];

          L += n.outChannels;
        }
      }
    }

    return c.toTensor();
  }, t.prototype.conv3d = function (t, e, n) {
    for (var r = n.filterDepth, o = n.filterHeight, a = n.filterWidth, i = n.dilationDepth, s = n.dilationHeight, u = n.dilationWidth, l = n.padInfo.front, c = n.padInfo.left, h = n.padInfo.top, p = tr(n.outShape, t.dtype), f = this.readSync(t.dataId), d = this.readSync(e.dataId), v = p.values, m = 0; m < n.batchSize; ++m) for (var g = m * t.strides[0], y = m * p.strides[0], x = 0; x < n.outDepth; ++x) for (var b = y + x * p.strides[1], w = x * n.strideDepth - l, C = 0; C < r; C++) {
      var E = w + C * i;
      if (!(E < 0 || E >= n.inDepth)) for (var R = C * e.strides[0], I = g + E * t.strides[1], k = 0; k < n.outHeight; ++k) for (var N = b + k * p.strides[2], S = k * n.strideHeight - h, A = 0; A < o; A++) {
        var T = S + A * s;
        if (!(T < 0 || T >= n.inHeight)) for (var D = R + A * e.strides[1], _ = I + T * t.strides[2], O = 0; O < n.outWidth; ++O) for (var F = N + O * n.outChannels, M = O * n.strideWidth - c, B = 0; B < a; B++) {
          var P = M + B * u;
          if (!(P < 0 || P >= n.inWidth)) for (var L = D + B * e.strides[2], W = _ + P * n.inChannels, U = L, V = 0; V < n.inChannels; ++V) {
            for (var z = f[W + V], G = 0; G < n.outChannels; ++G) v[F + G] += z * d[U + G];

            U += n.outChannels;
          }
        }
      }
    }

    return p.toTensor();
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2dDerInput");

    for (var r = tr(n.inShape, "float32"), o = r.values, a = this.readSync(t.dataId), i = this.readSync(e.dataId), s = e.strides, u = s[0], l = s[1], c = s[2], h = n.batchSize, p = n.filterHeight, f = n.filterWidth, d = n.inChannels, v = n.inHeight, m = n.inWidth, g = n.outChannels, y = n.outHeight, x = n.outWidth, b = n.strideHeight, w = n.strideWidth, C = n.dataFormat, E = p - 1 - n.padInfo.top, R = f - 1 - n.padInfo.left, I = "channelsLast" === C, k = r.strides[0], N = I ? r.strides[1] : r.strides[2], S = I ? r.strides[2] : 1, A = I ? 1 : r.strides[1], T = t.strides[0], D = I ? t.strides[1] : t.strides[2], _ = I ? t.strides[2] : 1, O = I ? 1 : t.strides[1], F = 0; F < h; ++F) for (var M = 0; M < d; ++M) for (var B = 0; B < v; ++B) for (var P = B - E, L = Math.max(0, Math.ceil(P / b)), W = Math.min(y, (p + P) / b), U = 0; U < m; ++U) {
      for (var V = U - R, z = Math.max(0, Math.ceil(V / w)), G = Math.min(x, (f + V) / w), H = 0, q = L; q < W; ++q) for (var $ = q * b - P, K = z; K < G; ++K) for (var j = T * F + D * q + _ * K, X = u * (p - 1 - $) + l * (f - 1 - (K * w - V)) + c * M, Y = 0; Y < g; ++Y) {
        H += a[j + O * Y] * i[X + Y];
      }

      o[k * F + N * B + S * U + A * M] = H;
    }

    return r.toTensor();
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    for (var r = tr(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], l = a[3], c = this.readSync(t.dataId), h = t.strides, p = h[0], f = h[1], d = h[2], v = h[3], m = this.readSync(e.dataId), g = e.strides, y = g[0], x = g[1], b = g[2], w = g[3], C = n.batchSize, E = n.filterDepth, R = n.filterHeight, I = n.filterWidth, k = n.inChannels, N = n.inDepth, S = n.inHeight, A = n.inWidth, T = n.outChannels, D = n.outDepth, _ = n.outHeight, O = n.outWidth, F = n.strideDepth, M = n.strideHeight, B = n.strideWidth, P = E - 1 - n.padInfo.front, L = R - 1 - n.padInfo.top, W = I - 1 - n.padInfo.left, U = 0; U < C; ++U) for (var V = 0; V < k; ++V) for (var z = 0; z < N; ++z) for (var G = z - P, H = Math.max(0, Math.ceil(G / F)), q = Math.min(D, (E + G) / F), $ = 0; $ < S; ++$) for (var K = $ - L, j = Math.max(0, Math.ceil(K / M)), X = Math.min(_, (R + K) / M), Y = 0; Y < A; ++Y) {
      for (var Q = Y - W, J = Math.max(0, Math.ceil(Q / B)), Z = Math.min(O, (I + Q) / B), tt = 0, et = H; et < q; ++et) for (var nt = et * F - G, rt = j; rt < X; ++rt) for (var ot = rt * M - K, at = J; at < Z; ++at) for (var it = p * U + f * et + d * rt + v * at, st = y * (E - 1 - nt) + x * (R - 1 - ot) + b * (I - 1 - (at * B - Q)) + w * V, ut = 0; ut < T; ++ut) {
        tt += c[it + ut] * m[st + ut];
      }

      o[i * U + s * z + u * $ + l * Y + V] = tt;
    }

    return r.toTensor();
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    this.assertNotComplex([t, e], "conv2dDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = "channelsLast" === n.dataFormat, u = tr(n.filterShape, "float32"), l = n.padInfo.left, c = n.padInfo.top, h = this.bufferSync(t), p = this.bufferSync(e), f = 0; f < a; ++f) for (var d = Math.max(0, Math.ceil((c - f) / r)), v = Math.min(n.outHeight, (n.inHeight + c - f) / r), m = 0; m < i; ++m) for (var g = Math.max(0, Math.ceil((l - m) / o)), y = Math.min(n.outWidth, (n.inWidth + l - m) / o), x = 0; x < n.inChannels; ++x) for (var b = 0; b < n.outChannels; ++b) {
      for (var w = 0, C = 0; C < n.batchSize; ++C) for (var E = d; E < v; ++E) for (var R = f + E * r - c, I = g; I < y; ++I) {
        var k = m + I * o - l;
        w += s ? h.get(C, R, k, x) * p.get(C, E, I, b) : h.get(C, x, R, k) * p.get(C, b, E, I);
      }

      u.set(w, f, m, x, b);
    }

    return u.toTensor();
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    for (var r = n.strideDepth, o = n.strideHeight, a = n.strideWidth, i = n.filterDepth, s = n.filterHeight, u = n.filterWidth, l = tr(n.filterShape, "float32"), c = l.values, h = l.strides, p = h[0], f = h[1], d = h[2], v = h[3], m = this.readSync(e.dataId), g = e.strides, y = g[0], x = g[1], b = g[2], w = g[3], C = this.readSync(t.dataId), E = t.strides, R = E[0], I = E[1], k = E[2], N = E[3], S = n.padInfo.front, A = n.padInfo.left, T = n.padInfo.top, D = 0; D < i; ++D) for (var _ = Math.max(0, Math.ceil((S - D) / r)), O = Math.min(n.outDepth, (n.inDepth + S - D) / r), F = D * p, M = 0; M < s; ++M) for (var B = Math.max(0, Math.ceil((T - M) / o)), P = Math.min(n.outHeight, (n.inHeight + T - M) / o), L = M * f + F, W = 0; W < u; ++W) for (var U = Math.max(0, Math.ceil((A - W) / a)), V = Math.min(n.outWidth, (n.inWidth + A - W) / a), z = W * d + L, G = 0; G < n.inChannels; ++G) for (var H = G * v + z, q = 0; q < n.outChannels; ++q) {
      for (var $ = 0, K = 0; K < n.batchSize; ++K) for (var j = K * R, X = K * y, Y = _; Y < O; ++Y) for (var Q = (D + Y * r - S) * I + j, J = Y * x + X, Z = B; Z < P; ++Z) for (var tt = (M + Z * o - T) * k + Q, et = Z * b + J, nt = U; nt < V; ++nt) {
        var rt = nt * w + et;
        $ += C[(W + nt * a - A) * N + tt + G] * m[rt + q];
      }

      c[H + q] = $;
    }

    return l.toTensor();
  }, t.prototype.fusedDepthwiseConv2D = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        a = t.activation,
        i = t.preluActivationWeights,
        s = this.depthwiseConv2D(e, n, r);
    return o && (s = this.add(s, o)), a && (s = hh(this, s, a, i)), s;
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2D");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, l = n.outChannels / n.inChannels, c = tr(n.outShape, t.dtype), h = this.readSync(t.dataId), p = this.readSync(e.dataId), f = c.values, d = 0; d < n.batchSize; ++d) for (var v = d * t.strides[0], m = d * c.strides[0], g = 0; g < n.outHeight; ++g) for (var y = m + g * c.strides[1], x = g * n.strideHeight - s, b = 0; b < r; ++b) {
      var w = x + b * a;
      if (!(w < 0 || w >= n.inHeight)) for (var C = b * e.strides[0], E = v + w * t.strides[1], R = 0; R < n.outWidth; ++R) for (var I = y + R * c.strides[2], k = R * n.strideWidth - u, N = 0; N < o; ++N) {
        var S = k + N * i;
        if (!(S < 0 || S >= n.inWidth)) for (var A = C + N * e.strides[1], T = E + S * n.inChannels, D = I, _ = A, O = 0; O < n.inChannels; ++O) {
          for (var F = h[T + O], M = 0; M < l; ++M) f[D + M] += F * p[_ + M];

          D += l, _ += l;
        }
      }
    }

    return c.toTensor();
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2DDerInput");

    for (var r = tr(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], l = this.readSync(t.dataId), c = t.strides, h = c[0], p = c[1], f = c[2], d = this.readSync(e.dataId), v = e.strides, m = v[0], g = v[1], y = v[2], x = n.batchSize, b = n.filterHeight, w = n.filterWidth, C = n.inChannels, E = n.inHeight, R = n.inWidth, I = n.outChannels, k = n.outHeight, N = n.outWidth, S = n.strideHeight, A = n.strideWidth, T = b - 1 - n.padInfo.top, D = w - 1 - n.padInfo.left, _ = I / C, O = 0; O < x; ++O) for (var F = 0; F < C; ++F) for (var M = 0; M < E; ++M) for (var B = M - T, P = Math.max(0, Math.ceil(B / S)), L = Math.min(k, (b + B) / S), W = 0; W < R; ++W) {
      for (var U = W - D, V = Math.max(0, Math.ceil(U / A)), z = Math.min(N, (w + U) / A), G = 0, H = P; H < L; ++H) for (var q = H * S - B, $ = V; $ < z; ++$) for (var K = h * O + p * H + f * $, j = m * (b - 1 - q) + g * (w - 1 - ($ * A - U)) + y * F, X = 0; X < _; ++X) {
        G += l[K + (F * _ + X)] * d[j + X];
      }

      o[i * O + s * M + u * W + F] = G;
    }

    return r.toTensor();
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    this.assertNotComplex([t, e], "depthwiseConv2DDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = tr(n.filterShape, "float32"), u = n.padInfo.left, l = n.padInfo.top, c = n.outChannels / n.inChannels, h = this.bufferSync(t), p = this.bufferSync(e), f = 0; f < a; ++f) for (var d = Math.max(0, Math.ceil((l - f) / r)), v = Math.min(n.outHeight, (n.inHeight + l - f) / r), m = 0; m < i; ++m) for (var g = Math.max(0, Math.ceil((u - m) / o)), y = Math.min(n.outWidth, (n.inWidth + u - m) / o), x = 0; x < n.outChannels; ++x) {
      for (var b = Math.trunc(x / c), w = x % c, C = 0, E = 0; E < n.batchSize; ++E) for (var R = d; R < v; ++R) for (var I = f + R * r - l, k = g; k < y; ++k) {
        var N = m + k * o - u;
        C += h.get(E, I, N, b) * p.get(E, R, k, x);
      }

      s.set(C, f, m, b, w);
    }

    return s.toTensor();
  }, t.prototype.tile = function (t, e) {
    return this.assertNotComplex(t, "tile"), So(this.bufferSync(t), e);
  }, t.prototype.pad = function (t, e, n) {
    this.assertNotComplex(t, "pad");
    var r = e.map(function (e, n) {
      return e[0] + t.shape[n] + e[1];
    }),
        o = e.map(function (t) {
      return t[0];
    }),
        a = this.bufferSync(t),
        i = tr(r, t.dtype);
    0 !== n && i.values.fill(n);

    for (var s = 0; s < t.size; s++) {
      var u = a.indexToLoc(s),
          l = u.map(function (t, e) {
        return t + o[e];
      });
      i.set.apply(i, [a.get.apply(a, u)].concat(l));
    }

    return i.toTensor();
  }, t.prototype.transpose = function (t, e) {
    this.assertNotComplex(t, "transpose");

    for (var n = new Array(t.rank), r = 0; r < n.length; r++) n[r] = t.shape[e[r]];

    var o = this.readSync(t.dataId),
        a = tr(n, t.dtype),
        i = this.bufferSync(t);

    for (r = 0; r < t.size; ++r) {
      for (var s = i.indexToLoc(r), u = new Array(s.length), l = 0; l < u.length; l++) u[l] = s[e[l]];

      var c = a.locToIndex(u);
      a.values[c] = o[r];
    }

    return a.toTensor();
  }, t.prototype.gather = function (t, e, n) {
    this.assertNotComplex([t, e], "gather");
    var r = t.shape.slice(),
        o = this.readSync(e.dataId);
    r[n] = o.length;

    for (var a = tr(r, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s),
          l = u.slice();
      l[n] = o[u[n]];
      var c = i.locToIndex(l);
      a.values[s] = i.values[c];
    }

    return a.toTensor();
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    this.assertNotComplex([t], "batchToSpaceND");

    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = Sr(t.shape, e, r),
        a = Ar(o.length, e.length),
        i = Tr(t.shape, e, r),
        s = Dr(n, e.length),
        u = _r(i, n, e.length);

    return t.reshape(o).transpose(a).reshape(i).slice(s, u);
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    this.assertNotComplex([t], "spaceToBatchND");
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = Sr(i.shape, e, r, !1),
        u = Ar(s.length, e.length, !1),
        l = Tr(i.shape, e, r, !1);
    return i.reshape(s).transpose(u).reshape(l);
  }, t.prototype.pool = function (t, e, n) {
    this.assertNotComplex(t, "pool");

    for (var r = e.strideHeight, o = e.strideWidth, a = e.dilationHeight, i = e.dilationWidth, s = e.effectiveFilterHeight, u = e.effectiveFilterWidth, l = e.padInfo.top, c = e.padInfo.left, h = "max" === n ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, p = this.readSync(t.dataId), f = tr(e.outShape, t.dtype), d = f.values, v = e.outShape[1] * e.outShape[2] * e.outShape[3], m = e.outShape[2] * e.outShape[3], g = e.outShape[3], y = 0; y < e.batchSize; ++y) for (var x = y * v, b = y * t.strides[0], w = 0; w < e.inChannels; ++w) for (var C = 0; C < e.outHeight; ++C) for (var E = C * r - l, R = Math.max(0, E), I = Math.min(e.inHeight, s + E), k = x + C * m, N = 0; N < e.outWidth; ++N) {
      for (var S = N * o - c, A = Math.max(0, S), T = Math.min(e.inWidth, u + S), D = h, _ = 0, O = 0, F = R; F < I; F += a) {
        for (var M = b + F * t.strides[1], B = A; B < T; B += i) {
          var P = p[M + B * t.strides[2] + w];
          "max" === n && P > D ? D = P : "avg" === n && (_ += P, O++);
        }

        if (isNaN(D)) break;
      }

      d[k + N * g + w] = "avg" === n ? _ / O : D;
    }

    return f.toTensor();
  }, t.prototype.maxPool = function (t, e) {
    return this.pool(t, e, "max");
  }, t.prototype.maxPoolPositions = function (t, e) {
    for (var n = tr(e.outShape, "int32"), r = e.strideHeight, o = e.strideWidth, a = e.dilationHeight, i = e.dilationWidth, s = e.effectiveFilterHeight, u = e.effectiveFilterWidth, l = e.padInfo.top, c = e.padInfo.left, h = this.bufferSync(t), p = 0; p < e.batchSize; ++p) for (var f = 0; f < e.inChannels; ++f) for (var d = 0; d < e.outHeight; ++d) {
      for (var v = d * r - l, m = v; m < 0;) m += a;

      for (var g = Math.min(e.inHeight, s + v), y = 0; y < e.outWidth; ++y) {
        for (var x = y * o - c, b = x; b < 0;) b += i;

        for (var w = Math.min(e.inWidth, u + x), C = Number.NEGATIVE_INFINITY, E = -1, R = m; R < g; R += a) for (var I = R - v, k = b; k < w; k += i) {
          var N = k - x,
              S = h.get(p, R, k, f);
          S > C && (C = S, E = I * u + N);
        }

        n.set(E, p, d, y, f);
      }
    }

    return n.toTensor();
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    this.assertNotComplex([e, n], "maxPoolBackprop");

    for (var o = this.maxPoolPositions(e, r), a = r.strideHeight, i = r.strideWidth, s = r.dilationHeight, u = r.dilationWidth, l = r.effectiveFilterHeight, c = r.effectiveFilterWidth, h = c - 1 - r.padInfo.left, p = l - 1 - r.padInfo.top, f = tr(e.shape, "float32"), d = this.bufferSync(o), v = this.bufferSync(t), m = 0; m < r.batchSize; ++m) for (var g = 0; g < r.inChannels; ++g) for (var y = 0; y < r.inHeight; ++y) for (var x = 0; x < r.inWidth; ++x) {
      for (var b = y - p, w = x - h, C = 0, E = 0; E < l; E += s) {
        var R = (b + E) / a;
        if (!(R < 0 || R >= r.outHeight || Math.floor(R) !== R)) for (var I = 0; I < c; I += u) {
          var k = (w + I) / i;

          if (!(k < 0 || k >= r.outWidth || Math.floor(k) !== k)) {
            var N = l * c - 1 - d.get(m, R, k, g) === E * c + I ? 1 : 0;
            if (0 !== N) C += v.get(m, R, k, g) * N;
          }
        }
      }

      f.set(C, m, y, x, g);
    }

    return f.toTensor();
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "avgPoolBackprop");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = n.dilationHeight, u = n.dilationWidth, l = n.effectiveFilterHeight, c = n.effectiveFilterWidth, h = c - 1 - n.padInfo.left, p = l - 1 - n.padInfo.top, f = tr(e.shape, "float32"), d = 1 / (a * i), v = this.bufferSync(t), m = 0; m < n.batchSize; ++m) for (var g = 0; g < n.inChannels; ++g) for (var y = 0; y < n.inHeight; ++y) for (var x = 0; x < n.inWidth; ++x) {
      for (var b = y - p, w = x - h, C = 0, E = 0; E < l; E += s) {
        var R = (b + E) / r;
        if (!(R < 0 || R >= n.outHeight || Math.floor(R) !== R)) for (var I = 0; I < c; I += u) {
          var k = (w + I) / o;
          if (!(k < 0 || k >= n.outWidth || Math.floor(k) !== k)) C += v.get(m, R, k, g);
        }
      }

      f.set(C * d, m, y, x, g);
    }

    return f.toTensor();
  }, t.prototype.pool3d = function (t, e, n) {
    this.assertNotComplex(t, "pool3d");

    for (var r = e.strideDepth, o = e.strideHeight, a = e.strideWidth, i = e.dilationDepth, s = e.dilationHeight, u = e.dilationWidth, l = e.effectiveFilterDepth, c = e.effectiveFilterHeight, h = e.effectiveFilterWidth, p = e.padInfo.front, f = e.padInfo.top, d = e.padInfo.left, v = "max" === n ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, m = this.readSync(t.dataId), g = tr(e.outShape, t.dtype), y = g.values, x = e.outShape[1] * e.outShape[2] * e.outShape[3] * e.outShape[4], b = e.outShape[2] * e.outShape[3] * e.outShape[4], w = e.outShape[3] * e.outShape[4], C = e.outShape[4], E = 0; E < e.batchSize; ++E) for (var R = E * x, I = E * t.strides[0], k = 0; k < e.inChannels; ++k) for (var N = 0; N < e.outDepth; ++N) {
      for (var S = N * r - p, A = S; A < 0;) A += i;

      for (var T = Math.min(e.inDepth, l + S), D = R + N * b, _ = 0; _ < e.outHeight; ++_) {
        for (var O = _ * o - f, F = O; F < 0;) F += s;

        for (var M = Math.min(e.inHeight, c + O), B = D + _ * w, P = 0; P < e.outWidth; ++P) {
          for (var L = P * a - d, W = L; W < 0;) W += u;

          for (var U = Math.min(e.inWidth, h + L), V = B + P * C, z = v, G = 0, H = 0, q = A; q < T; q += i) {
            for (var $ = I + q * t.strides[1], K = F; K < M; K += s) {
              for (var j = $ + K * t.strides[2], X = W; X < U; X += u) {
                var Y = m[j + X * t.strides[3] + k];
                if ("max" === n && Y > z ? z = Y : "avg" === n && (G += Y, H++), isNaN(z)) break;
              }

              if (isNaN(z)) break;
            }

            if (isNaN(z)) break;
          }

          y[V + k] = "avg" === n ? G / H : z;
        }
      }
    }

    return g.toTensor();
  }, t.prototype.avgPool3d = function (t, e) {
    return this.assertNotComplex(t, "avgPool3d"), this.pool3d(t, e, "avg").toFloat();
  }, t.prototype.avgPool3dBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "avgPool3dBackprop");

    for (var r = n.strideDepth, o = n.strideHeight, a = n.strideWidth, i = n.filterDepth, s = n.filterHeight, u = n.filterWidth, l = n.dilationDepth, c = n.dilationHeight, h = n.dilationWidth, p = n.effectiveFilterDepth, f = n.effectiveFilterHeight, d = n.effectiveFilterWidth, v = p - 1 - n.padInfo.front, m = d - 1 - n.padInfo.left, g = f - 1 - n.padInfo.top, y = tr(e.shape, "float32"), x = 1 / (i * s * u), b = this.bufferSync(t), w = 0; w < n.batchSize; ++w) for (var C = 0; C < n.inChannels; ++C) for (var E = 0; E < n.inDepth; ++E) for (var R = 0; R < n.inHeight; ++R) for (var I = 0; I < n.inWidth; ++I) {
      for (var k = E - v, N = R - g, S = I - m, A = 0, T = 0; T < p; T += l) {
        var D = (k + T) / r;
        if (!(D < 0 || D >= n.outDepth || Math.floor(D) !== D)) for (var _ = 0; _ < f; _ += c) {
          var O = (N + _) / o;
          if (!(O < 0 || O >= n.outHeight || Math.floor(O) !== O)) for (var F = 0; F < d; F += h) {
            var M = (S + F) / a;
            if (!(M < 0 || M >= n.outWidth || Math.floor(M) !== M)) A += b.get(w, D, O, M, C);
          }
        }
      }

      y.set(A * x, w, E, R, I, C);
    }

    return y.toTensor();
  }, t.prototype.maxPool3d = function (t, e) {
    return this.assertNotComplex(t, "maxPool3d"), this.pool3d(t, e, "max").toFloat();
  }, t.prototype.maxPool3dPositions = function (t, e) {
    for (var n = tr(e.outShape, "int32"), r = e.strideDepth, o = e.strideHeight, a = e.strideWidth, i = e.dilationDepth, s = e.dilationHeight, u = e.dilationWidth, l = e.effectiveFilterDepth, c = e.effectiveFilterHeight, h = e.effectiveFilterWidth, p = e.padInfo.front, f = e.padInfo.top, d = e.padInfo.left, v = this.bufferSync(t), m = 0; m < e.batchSize; ++m) for (var g = 0; g < e.inChannels; ++g) for (var y = 0; y < e.outDepth; ++y) {
      for (var x = y * r - p, b = x; b < 0;) b += i;

      for (var w = Math.min(e.inDepth, l + x), C = 0; C < e.outHeight; ++C) {
        for (var E = C * o - f, R = E; R < 0;) R += s;

        for (var I = Math.min(e.inHeight, c + E), k = 0; k < e.outWidth; ++k) {
          for (var N = k * a - d, S = N; S < 0;) S += u;

          for (var A = Math.min(e.inWidth, h + N), T = Number.NEGATIVE_INFINITY, D = -1, _ = b; _ < w; _ += i) for (var O = _ - x, F = R; F < I; F += s) for (var M = F - E, B = S; B < A; B += u) {
            var P = B - N,
                L = v.get(m, _, F, B, g);
            L >= T && (T = L, D = O * c * h + M * c + P);
          }

          n.set(D, m, y, C, k, g);
        }
      }
    }

    return n.toTensor();
  }, t.prototype.maxPool3dBackprop = function (t, e, n, r) {
    this.assertNotComplex([e, n], "maxPool3dBackprop");

    for (var o = this.maxPool3dPositions(e, r), a = r.strideDepth, i = r.strideHeight, s = r.strideWidth, u = r.dilationDepth, l = r.dilationHeight, c = r.dilationWidth, h = r.effectiveFilterDepth, p = r.effectiveFilterHeight, f = r.effectiveFilterWidth, d = h - 1 - r.padInfo.front, v = f - 1 - r.padInfo.left, m = p - 1 - r.padInfo.top, g = tr(e.shape, "float32"), y = this.bufferSync(o), x = this.bufferSync(t), b = 0; b < r.batchSize; ++b) for (var w = 0; w < r.inChannels; ++w) for (var C = 0; C < r.inDepth; ++C) for (var E = 0; E < r.inHeight; ++E) for (var R = 0; R < r.inWidth; ++R) {
      for (var I = C - d, k = E - m, N = R - v, S = 0, A = 0; A < h; A += u) {
        var T = (I + A) / a;
        if (!(T < 0 || T >= r.outDepth || Math.floor(T) !== T)) for (var D = 0; D < p; D += l) {
          var _ = (k + D) / i;

          if (!(_ < 0 || _ >= r.outHeight || Math.floor(_) !== _)) for (var O = 0; O < f; O += c) {
            var F = (N + O) / s;

            if (!(F < 0 || F >= r.outWidth || Math.floor(F) !== F)) {
              var M = h * p * f - 1 - y.get(b, T, _, F, w) === A * p * f + D * f + O ? 1 : 0;
              if (0 !== M) S += x.get(b, T, _, F, w) * M;
            }
          }
        }
      }

      g.set(S, b, C, E, R, w);
    }

    return g.toTensor();
  }, t.prototype.cast = function (t, e) {
    return go(t, e, this);
  }, t.prototype.reshape = function (t, e) {
    return yo(t, e);
  }, t.prototype.avgPool = function (t, e) {
    return this.assertNotComplex(t, "avgPool"), this.pool(t, e, "avg").toFloat();
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    this.assertNotComplex(t, "resizeBilinear");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], l = this.readSync(t.dataId), c = new Float32Array(v([a, e, n, u])), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], p = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], f = 0, d = h[0] / p[0], m = h[1] / p[1], g = 0; g < a; g++) for (var y = 0; y < e; y++) for (var x = d * y, b = Math.floor(x), w = x - b, C = Math.min(i - 1, Math.ceil(x)), E = g * t.strides[0] + b * t.strides[1], R = g * t.strides[0] + C * t.strides[1], I = 0; I < n; I++) for (var k = m * I, N = Math.floor(k), S = k - N, A = Math.min(s - 1, Math.ceil(k)), T = E + N * t.strides[2], D = R + N * t.strides[2], _ = E + +A * t.strides[2], O = R + A * t.strides[2], F = 0; F < u; F++) {
      var M = l[T + F],
          B = l[D + F],
          P = M + (l[_ + F] - M) * S,
          L = P + (B + (l[O + F] - B) * S - P) * w;
      c[f++] = L;
    }

    return bn(c, [a, e, n, u]);
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "resizeBilinearBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, l = u[1], c = u[2], h = new Float32Array(o * a * i * s), p = [n && l > 1 ? a - 1 : a, n && c > 1 ? i - 1 : i], f = [n && l > 1 ? l - 1 : l, n && c > 1 ? c - 1 : c], d = p[0] / f[0], v = p[1] / f[1], m = this.readSync(t.dataId), g = 0, y = 0; y < o; y++) for (var x = y * e.strides[0], b = 0; b < l; b++) for (var w = b * d, C = Math.floor(w), E = Math.min(Math.ceil(w), a - 1), R = x + C * e.strides[1], I = x + E * e.strides[1], k = w - C, N = 1 - k, S = 0; S < c; S++) for (var A = S * v, T = Math.floor(A), D = Math.min(Math.ceil(A), i - 1), _ = A - T, O = 1 - _, F = R + T * e.strides[2], M = R + D * e.strides[2], B = I + T * e.strides[2], P = I + D * e.strides[2], L = N * O, W = N * _, U = k * O, V = k * _, z = 0; z < s; z++) {
      var G = m[g++];
      h[F + z] += G * L, h[M + z] += G * W, h[B + z] += G * U, h[P + z] += G * V;
    }

    return kn(h, [o, i, a, s], e.dtype);
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    this.assertNotComplex(t, "resizeNearestNeighbor");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], l = this.readSync(t.dataId), c = new Float32Array(a * e * n * u), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], p = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], f = h[0] / p[0], d = h[1] / p[1], v = 0, m = 0; m < a; m++) for (var g = m * t.strides[0], y = 0; y < e; y++) for (var x = f * y, b = g + Math.min(i - 1, r ? Math.round(x) : Math.floor(x)) * t.strides[1], w = 0; w < n; w++) for (var C = d * w, E = b + Math.min(s - 1, r ? Math.round(C) : Math.floor(C)) * t.strides[2], R = 0; R < u; R++) {
      var I = l[E + R];
      c[v++] = I;
    }

    return bn(c, [a, e, n, u], t.dtype);
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    this.assertNotComplex([t, e], "resizeNearestNeighborBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, l = u[1], c = u[2], h = new Float32Array(o * a * i * s), p = this.readSync(t.dataId), f = [n && l > 1 ? a - 1 : a, n && c > 1 ? i - 1 : i], d = [n && l > 1 ? l - 1 : l, n && c > 1 ? c - 1 : c], v = f[0] / d[0], m = f[1] / d[1], g = 1 / v, y = 1 / m, x = 2 * Math.ceil(g) + 2, b = 2 * Math.ceil(y) + 2, w = 0; w < o; w++) for (var C = w * e.strides[0], E = 0; E < a; E++) for (var R = C + E * e.strides[1], I = Math.floor(E * g), k = Math.floor(I - x / 2), N = 0; N < i; N++) for (var S = R + N * e.strides[2], A = Math.floor(N * y), T = Math.floor(A - b / 2), D = 0; D < s; D++) {
      for (var _ = 0, O = 0; O < x; O++) {
        var F = O + k;

        if (!(F < 0 || F >= l)) {
          var M = C + F * t.strides[1],
              B = F * v;
          if (E === Math.min(a - 1, n ? Math.round(B) : Math.floor(B))) for (var P = 0; P < b; P++) {
            var L = P + T;

            if (!(L < 0 || L >= c)) {
              var W = M + L * t.strides[2],
                  U = L * m;
              N === Math.min(i - 1, n ? Math.round(U) : Math.floor(U)) && (_ += p[W + D]);
            }
          }
        }
      }

      h[S + D] = _;
    }

    return kn(h, e.shape, e.dtype);
  }, t.prototype.batchNormalization = function (t, e, n, r, o, a) {
    this.assertNotComplex([t, e, n, o, a], "batchNorm");

    for (var i = this.readSync(t.dataId), s = this.readSync(e.dataId), u = this.readSync(n.dataId), l = o ? this.readSync(o.dataId) : new Float32Array([1]), c = a ? this.readSync(a.dataId) : new Float32Array([0]), h = new Float32Array(i.length), p = c.length, f = l.length, d = u.length, v = s.length, m = 0, g = 0, y = 0, x = 0, b = 0; b < i.length; ++b) h[b] = c[m++] + (i[b] - s[g++]) * l[y++] / Math.sqrt(u[x++] + r), m >= p && (m = 0), g >= v && (g = 0), y >= f && (y = 0), x >= d && (x = 0);

    return kn(h, t.shape);
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    this.assertNotComplex(t, "localResponseNormalization4D");
    var a = t.shape[3],
        i = a - 1,
        s = this.readSync(t.dataId),
        u = t.size,
        l = new Float32Array(u);

    function c(t) {
      for (var n = t % a, r = t - n + Math.max(0, n - e), o = t - n + Math.min(n + e, i), u = 0; r <= o; r++) {
        var l = s[r];
        u += l * l;
      }

      return u;
    }

    for (var h = 0; h < u; h++) {
      var p = c(h),
          f = s[h] * Math.pow(n + r * p, -o);
      l[h] = f;
    }

    return kn(l, t.shape);
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    this.assertNotComplex(t, "LRNGrad");

    for (var s = t.shape[3], u = this.readSync(t.dataId), l = this.readSync(e.dataId), c = this.readSync(n.dataId), h = new Float32Array(t.size), p = t.size, f = 0; f < p; f++) {
      for (var d = f % s, v = f - d + Math.max(0, d - r), m = f - d + Math.min(s, d + r + 1), g = 0, y = v; y < m; y++) g += Math.pow(l[y], 2);

      g = a * g + o;

      for (y = v; y < m; y++) {
        var x = -2 * a * i * l[y] * c[f] / g;
        f === y && (x += Math.pow(g, -i)), x *= u[f], h[y] += x;
      }
    }

    return kn(h, t.shape);
  }, t.prototype.multinomial = function (t, e, n, r) {
    this.assertNotComplex(t, "multinomial");

    for (var o = e ? t : Qr(t), a = o.shape[0], i = o.shape[1], s = Tn([a, n], "int32"), u = this.readSync(s.dataId), l = this.readSync(o.dataId), c = 0; c < a; ++c) {
      var h = c * i,
          p = new Float32Array(i - 1);
      p[0] = l[h];

      for (var f = 1; f < p.length; ++f) p[f] = p[f - 1] + l[h + f];

      for (var d = Yn(r.toString()), v = c * n, m = 0; m < n; ++m) {
        var g = d();
        u[v + m] = p.length;

        for (var y = 0; y < p.length; y++) if (g < p[y]) {
          u[v + m] = y;
          break;
        }
      }
    }

    return s;
  }, t.prototype.oneHot = function (t, e, n, r) {
    this.assertNotComplex(t, "oneHot");
    var o = new Float32Array(t.size * e);
    o.fill(r);

    for (var a = this.readSync(t.dataId), i = 0; i < t.size; ++i) a[i] >= 0 && a[i] < e && (o[i * e + a[i]] = n);

    return Rn(o, [t.size, e], "int32");
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return this.assertNotComplex(t, "nonMaxSuppression"), Io(this.readSync(t.dataId), this.readSync(e.dataId), n, r, o);
  }, t.prototype.fft = function (t) {
    return this.fftBatch(t, !1);
  }, t.prototype.ifft = function (t) {
    return this.fftBatch(t, !0);
  }, t.prototype.fftBatch = function (t, e) {
    for (var n = t.shape[0], r = t.shape[1], o = tr(t.shape, "float32"), a = tr(t.shape, "float32"), i = yn(t).as2D(n, r), s = xn(t).as2D(n, r), u = 0; u < n; u++) for (var l = i.slice([u, 0], [1, r]), c = s.slice([u, 0], [1, r]), h = gn(l, c), p = this.readSync(this.fftImpl(h, e).dataId), f = 0; f < r; f++) {
      var d = Co(p, f);
      o.values[u * r + f] = d.real, a.values[u * r + f] = d.imag;
    }

    return gn(o.toTensor(), a.toTensor()).as2D(n, r);
  }, t.prototype.fftImpl = function (t, e) {
    var n = t.as1D(),
        r = n.size;

    if (this.isExponentOf2(r)) {
      var o = this.fftRadix2(n, r, e).as2D(t.shape[0], t.shape[1]);
      return e && (o = gn(yn(o).div(Cn(r)), xn(o).div(Cn(r)))), o;
    }

    var a = this.readSync(t.dataId),
        i = function (t) {
      for (var e = new Float32Array(t.length / 2), n = new Float32Array(t.length / 2), r = 0; r < t.length; r += 2) e[r / 2] = t[r], n[r / 2] = t[r + 1];

      return {
        real: e,
        imag: n
      };
    }(this.fourierTransformByMatmul(a, r, e));

    return gn(i.real, i.imag).as2D(t.shape[0], t.shape[1]);
  }, t.prototype.isExponentOf2 = function (t) {
    return 0 == (t & t - 1);
  }, t.prototype.fftRadix2 = function (t, e, n) {
    if (1 === e) return t;

    var r = this.readSync(t.dataId),
        o = e / 2,
        a = function (t) {
      for (var e = Math.ceil(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 0; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        i = gn(a.real, a.imag).as1D(),
        s = function (t) {
      for (var e = Math.floor(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 2; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        u = gn(s.real, s.imag).as1D();

    i = this.fftRadix2(i, o, n), u = this.fftRadix2(u, o, n);

    var l = function (t, e) {
      for (var n = new Float32Array(t / 2), r = new Float32Array(t / 2), o = 0; o < Math.ceil(t / 2); o++) {
        var a = (e ? 2 : -2) * Math.PI * (o / t);
        n[o] = Math.cos(a), r[o] = Math.sin(a);
      }

      return {
        real: n,
        imag: r
      };
    }(e, n),
        c = gn(l.real, l.imag).mul(u),
        h = i.add(c),
        p = i.sub(c),
        f = yn(h).concat(yn(p)),
        d = xn(h).concat(xn(p));

    return gn(f, d).as1D();
  }, t.prototype.fourierTransformByMatmul = function (t, e, n) {
    for (var r = new Float32Array(2 * e), o = 0; o < e; o++) {
      for (var a = 0, i = 0, s = 0; s < e; s++) {
        var u = Ro(o * s, e, n),
            l = Co(t, s);
        a += l.real * u.real - l.imag * u.imag, i += l.real * u.imag + l.imag * u.real;
      }

      n && (a /= e, i /= e), Eo(r, a, i, o);
    }

    return r;
  }, t.prototype.depthToSpace = function (t, e, n) {
    h("NHWC" === n, function () {
      return "Only NHWC dataFormat supported on CPU for depthToSpace. Got " + n;
    }), h(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });

    for (var r = t.shape[0], o = t.shape[1], a = t.shape[2], i = t.shape[3], s = o * e, u = a * e, l = i / (e * e), c = this.readSync(t.dataId), p = new Float32Array(r * s * u * l), f = 0, d = 0; d < r; ++d) for (var v = 0; v < s; ++v) for (var m = Math.floor(v / e), g = v % e, y = 0; y < u; ++y) for (var x = Math.floor(y / e), b = (g * e + y % e) * l, w = 0; w < l; ++w) {
      var C = w + b + i * (x + a * (m + o * d));
      p[f++] = c[C];
    }

    return kn(p, [r, s, u, l]);
  }, t.prototype.broadcastedBinaryOp = function (t, e, n, r) {
    var o = ro(t.shape, e.shape),
        a = tr(o, n),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = eo(t.shape, o),
        l = eo(e.shape, o),
        c = a.values;
    if (u.length + l.length === 0) for (var h = 0; h < c.length; ++h) c[h] = r(i[h % i.length], s[h % s.length]);else {
      var p = this.bufferSync(t),
          f = this.bufferSync(e),
          d = function (n) {
        var o = a.indexToLoc(n),
            h = o.slice(-t.rank);
        u.forEach(function (t) {
          return h[t] = 0;
        });
        var d = p.locToIndex(h),
            v = o.slice(-e.rank);
        l.forEach(function (t) {
          return v[t] = 0;
        });
        var m = f.locToIndex(v);
        c[n] = r(i[d], s[m]);
      };

      for (h = 0; h < c.length; ++h) d(h);
    }
    return a.toTensor();
  }, t.prototype.broadcastedBinaryComplexOp = function (t, e, n) {
    var r = ro(t.shape, e.shape),
        o = tr(r, "float32"),
        a = tr(r, "float32"),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = eo(t.shape, r),
        l = eo(e.shape, r),
        c = o.values,
        h = a.values;
    if (u.length + l.length === 0) for (var p = 0; p < c.length; p++) {
      var f = p % i.length,
          d = p % s.length,
          v = n(i[2 * f], i[2 * f + 1], s[2 * d], s[2 * d + 1]);
      c[p] = v.real, h[p] = v.imag;
    } else {
      var m = this.bufferSync(this.data.get(t.dataId).complexTensors.real),
          g = this.bufferSync(this.data.get(e.dataId).complexTensors.real),
          y = function (r) {
        var a = o.indexToLoc(r),
            p = a.slice(-t.rank);
        u.forEach(function (t) {
          return p[t] = 0;
        });
        var f = m.locToIndex(p),
            d = a.slice(-e.rank);
        l.forEach(function (t) {
          return d[t] = 0;
        });
        var v = g.locToIndex(d),
            y = n(i[2 * f], i[2 * f + 1], s[2 * v], s[2 * v + 1]);
        c[r] = y.real, h[r] = y.imag;
      };

      for (p = 0; p < c.length; p++) y(p);
    }
    return this.complex(o.toTensor(), a.toTensor());
  }, t.prototype.split = function (t, e, n) {
    return No(t, e, n);
  }, t.prototype.dispose = function () {}, t.prototype.floatPrecision = function () {
    return 32;
  }, t.prototype.epsilon = function () {
    return 1e-7;
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    for (var i = t.shape, s = i[0], u = i[1], l = i[2], c = i[3], h = e.shape[0], p = r[0], f = r[1], d = tr([h, p, f, c], t.dtype), v = this.readSync(e.dataId), m = this.readSync(n.dataId), g = this.readSync(t.dataId), y = t.strides, x = d.strides, b = 0; b < h; b++) {
      var w = 4 * b,
          C = v[w],
          E = v[w + 1],
          R = v[w + 2],
          I = v[w + 3],
          k = m[b];
      if (!(k >= s)) for (var N = p > 1 ? (R - C) * (u - 1) / (p - 1) : 0, S = f > 1 ? (I - E) * (l - 1) / (f - 1) : 0, A = 0; A < p; A++) {
        var T = p > 1 ? C * (u - 1) + A * N : .5 * (C + R) * (u - 1);
        if (T < 0 || T > u - 1) for (var D = 0; D < f; D++) for (var _ = 0; _ < c; _++) {
          var O = _ + D * x[2] + A * x[1] + b * x[0];
          d.values[O] = a;
        } else if ("bilinear" === o) {
          var F = Math.floor(T),
              M = Math.ceil(T),
              B = T - F;

          for (D = 0; D < f; D++) {
            if ((q = f > 1 ? E * (l - 1) + D * S : .5 * (E + I) * (l - 1)) < 0 || q > l - 1) for (_ = 0; _ < c; _++) {
              O = _ + D * x[2] + A * x[1] + b * x[0];
              d.values[O] = a;
            } else {
              var P = Math.floor(q),
                  L = Math.ceil(q),
                  W = q - P;

              for (_ = 0; _ < c; _++) {
                var U = g[O = _ + P * y[2] + F * y[1] + k * y[0]],
                    V = g[O = _ + L * y[2] + F * y[1] + k * y[0]],
                    z = g[O = _ + P * y[2] + M * y[1] + k * y[0]],
                    G = U + (V - U) * W,
                    H = z + (g[O = _ + L * y[2] + M * y[1] + k * y[0]] - z) * W;
                O = _ + D * x[2] + A * x[1] + b * x[0], d.values[O] = G + (H - G) * B;
              }
            }
          }
        } else for (D = 0; D < f; ++D) {
          var q;
          if ((q = f > 1 ? E * (l - 1) + D * S : .5 * (E + I) * (l - 1)) < 0 || q > l - 1) for (_ = 0; _ < c; _++) {
            O = _ + D * x[2] + A * x[1] + b * x[0];
            d.values[O] = a;
          } else {
            var $ = Math.round(q),
                K = Math.round(T);

            for (_ = 0; _ < c; _++) {
              var j = _ + $ * y[2] + K * y[1] + k * y[0],
                  X = _ + D * x[2] + A * x[1] + b * x[0];
              d.values[X] = g[j];
            }
          }
        }
      }
    }

    return d.toTensor();
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    var o = Pr(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.sliceSize,
        u = o.strides,
        l = o.outputSize;
    return this.scatter(t, e, n, l, s, i, a, u, r, !1);
  }, t.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = Or(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3];
    if (0 === i) return bn([], a, t.dtype);

    for (var l = new ot([i, s], t.dtype), c = this.readSync(e.dataId), h = this.readSync(t.dataId), p = 0; p < i; p++) {
      for (var f = [], d = 0, v = 0; v < r; v++) {
        var m = c[p * r + v];
        d += m * u[v], f.push(m);
      }

      if (d < 0 || d >= t.size / s) throw new Error("Invalid indices: " + f + " does not index into " + t.shape);

      for (var g = 0; g < s; g++) l.values[p * s + g] = h[d * s + g];
    }

    return l.toTensor().reshape(a);
  }, t.prototype.scatterND = function (t, e, n) {
    var r = Pr(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        l = Cn(0);
    return this.scatter(t, e, n, u, i, a, o, s, l, !0);
  }, t.prototype.fill = function (t, e, n) {
    var r = k(n = n || B(e), v(t));
    return r.fill(e), ut.make(t, {
      values: r
    }, n);
  }, t.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported for string tensors");
    return this.fill(t.shape, 1, t.dtype);
  }, t.prototype.zerosLike = function (t) {
    var e = k(t.dtype, v(t.shape));
    return ut.make(t.shape, {
      values: e
    }, t.dtype);
  }, t.prototype.linspace = function (t, e, n) {
    return xo(t, e, n);
  }, t.prototype.scatter = function (t, e, n, r, o, a, i, s, u, l) {
    var c = [r / o, o],
        h = this.readSync(t.dataId),
        p = this.readSync(e.dataId);
    if (0 === r) return bn([], n, e.dtype);
    var f = new ot(c, e.dtype);
    f.values.fill(this.readSync(u.dataId)[0]);

    for (var d = 0; d < a; d++) {
      for (var v = [], m = 0, g = 0; g < i; g++) {
        var y = h[d * i + g];
        v.push(y), m += y * s[g];
      }

      if (m < 0 || m >= r / o) throw new Error("Invalid indices: " + v + " does not index into " + n);

      for (var x = 0; x < o; x++) l ? f.values[m * o + x] += p[d * o + x] : f.values[m * o + x] = 0 === e.rank ? p[0] : p[d * o + x];
    }

    return f.toTensor().reshape(n);
  }, t;
}();

kt.registerBackend("cpu", function () {
  return new ph();
}, 1);

var fh = function () {
  function t() {}

  return t.prototype.fetch = function (t, e) {
    return fetch(t, e);
  }, t.prototype.now = function () {
    return performance.now();
  }, t.prototype.encode = function (t, e) {
    if ("utf-8" !== e && "utf8" !== e) throw new Error("Browser's encoder only supports utf-8, but got " + e);
    return null == this.textEncoder && (this.textEncoder = new TextEncoder()), this.textEncoder.encode(t);
  }, t.prototype.decode = function (t, e) {
    return new TextDecoder(e).decode(t);
  }, t;
}();

a().get("IS_BROWSER") && a().setPlatform("browser", new fh());

var dh,
    vh = function () {
  return require("node-fetch");
},
    mh = function () {
  function t() {
    this.util = require("util"), this.textEncoder = new this.util.TextEncoder();
  }

  return t.prototype.fetch = function (t, e) {
    return null != a().global.fetch ? a().global.fetch(t, e) : (null == dh && (dh = vh()), dh(t, e));
  }, t.prototype.now = function () {
    var t = process.hrtime();
    return 1e3 * t[0] + t[1] / 1e6;
  }, t.prototype.encode = function (t, e) {
    if ("utf-8" !== e && "utf8" !== e) throw new Error("Node built-in encoder only supports utf-8, but got " + e);
    return this.textEncoder.encode(t);
  }, t.prototype.decode = function (t, e) {
    return 0 === t.length ? "" : new this.util.TextDecoder(e).decode(t);
  }, t;
}();

a().get("IS_NODE") && a().setPlatform("node", new mh());
var gh = {
  float32: 4,
  int32: 4,
  uint16: 2,
  uint8: 1,
  bool: 1
},
    yh = 4;

function xh(t, e) {
  for (var n = {}, r = 0, o = function (e) {
    var o = e.name,
        a = e.dtype,
        i = e.shape,
        s = v(i),
        u = void 0;

    if (("quantization" in e)) {
      var l = e.quantization;
      if ("uint8" !== l.dtype && "uint16" !== l.dtype) throw new Error("Weight " + e.name + " has unknown quantization dtype " + l.dtype + ". Supported quantization dtypes are: 'uint8' and 'uint16'.");
      var c = gh[l.dtype],
          h = t.slice(r, r + s * c),
          p = "uint8" === l.dtype ? new Uint8Array(h) : new Uint16Array(h);
      if ("float32" === a) u = Float32Array.from(p, function (t) {
        return t * l.scale + l.min;
      });else {
        if ("int32" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = Int32Array.from(p, function (t) {
          return Math.round(t * l.scale + l.min);
        });
      }
      r += s * c;
    } else if ("string" === a) {
      var f = v(e.shape);
      u = [];

      for (var d = 0; d < f; d++) {
        var m = new Uint32Array(t.slice(r, r + yh))[0];
        r += yh;
        var g = new Uint8Array(t.slice(r, r + m));
        u.push(g), r += m;
      }
    } else {
      var y = gh[a];
      h = t.slice(r, r + s * y);
      if ("float32" === a) u = new Float32Array(h);else if ("int32" === a) u = new Int32Array(h);else {
        if ("bool" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = new Uint8Array(h);
      }
      r += s * y;
    }

    n[o] = bn(u, i, a);
  }, a = 0, i = e; a < i.length; a++) {
    o(i[a]);
  }

  return n;
}

function bh(t) {
  if (null === t) throw new Error("Invalid input value: " + JSON.stringify(t));
  var e = 0,
      n = [];
  t.forEach(function (t) {
    if (e += t.byteLength, n.push(t.byteLength === t.buffer.byteLength ? t : new t.constructor(t)), !(t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array)) throw new Error("Unsupported TypedArray subtype: " + t.constructor.name);
  });
  var r = new Uint8Array(e),
      o = 0;
  return n.forEach(function (t) {
    r.set(new Uint8Array(t.buffer), o), o += t.byteLength;
  }), r.buffer;
}

var wh = "undefined" != typeof Buffer && ("undefined" == typeof Blob || "undefined" == typeof atob || "undefined" == typeof btoa);

function Ch(t) {
  return wh ? Buffer.byteLength(t) : new Blob([t]).size;
}

function Eh(t) {
  var e = 0;
  t.forEach(function (t) {
    e += t.byteLength;
  });
  var n = new Uint8Array(e),
      r = 0;
  return t.forEach(function (t) {
    n.set(new Uint8Array(t), r), r += t.byteLength;
  }), n.buffer;
}

function Rh(t) {
  for (t = t.trim(); t.endsWith("/");) t = t.slice(0, t.length - 1);

  var e = t.split("/");
  return e[e.length - 1];
}

function Ih(t) {
  if (t.modelTopology instanceof ArrayBuffer) throw new Error("Expected JSON model topology, received ArrayBuffer.");
  return {
    dateSaved: new Date(),
    modelTopologyType: "JSON",
    modelTopologyBytes: null == t.modelTopology ? 0 : Ch(JSON.stringify(t.modelTopology)),
    weightSpecsBytes: null == t.weightSpecs ? 0 : Ch(JSON.stringify(t.weightSpecs)),
    weightDataBytes: null == t.weightData ? 0 : t.weightData.byteLength
  };
}

var kh = function () {
  function t() {
    this.saveRouters = [], this.loadRouters = [];
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerSaveRouter = function (e) {
    t.getInstance().saveRouters.push(e);
  }, t.registerLoadRouter = function (e) {
    t.getInstance().loadRouters.push(e);
  }, t.getSaveHandlers = function (e) {
    return t.getHandlers(e, "save");
  }, t.getLoadHandlers = function (e, n) {
    return t.getHandlers(e, "load", n);
  }, t.getHandlers = function (e, n, r) {
    var o = [];
    return ("load" === n ? t.getInstance().loadRouters : t.getInstance().saveRouters).forEach(function (t) {
      var n = t(e, r);
      null !== n && o.push(n);
    }), o;
  }, t;
}(),
    Nh = "://",
    Sh = function () {
  function t() {
    this.managers = {};
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerManager = function (e, n) {
    h(null != e, function () {
      return "scheme must not be undefined or null.";
    }), e.endsWith(Nh) && (e = e.slice(0, e.indexOf(Nh))), h(e.length > 0, function () {
      return "scheme must not be an empty string.";
    });
    var r = t.getInstance();
    h(null == r.managers[e], function () {
      return "A model store manager is already registered for scheme '" + e + "'.";
    }), r.managers[e] = n;
  }, t.getManager = function (t) {
    var e = this.getInstance().managers[t];
    if (null == e) throw new Error("Cannot find model manager for scheme '" + t + "'");
    return e;
  }, t.getSchemes = function () {
    return Object.keys(this.getInstance().managers);
  }, t;
}();

function Ah(t) {
  if (-1 === t.indexOf(Nh)) throw new Error("The url string provided does not contain a scheme. Supported schemes are: " + Sh.getSchemes().join(","));
  return {
    scheme: t.split(Nh)[0],
    path: t.split(Nh)[1]
  };
}

function Th(t, e, o) {
  return void 0 === o && (o = !1), n(this, void 0, void 0, function () {
    var n, a, i, s, u, l, c, p, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return h(t !== e, function () {
            return "Old path and new path are the same: '" + t + "'";
          }), h((n = kh.getLoadHandlers(t)).length > 0, function () {
            return "Copying failed because no load handler is found for source URL " + t + ".";
          }), h(n.length < 2, function () {
            return "Copying failed because more than one (" + n.length + ") load handlers for source URL " + t + ".";
          }), a = n[0], h((i = kh.getSaveHandlers(e)).length > 0, function () {
            return "Copying failed because no save handler is found for destination URL " + e + ".";
          }), h(i.length < 2, function () {
            return "Copying failed because more than one (" + n.length + ") save handlers for destination URL " + e + ".";
          }), s = i[0], u = Ah(t).scheme, l = Ah(t).path, c = u === Ah(t).scheme, [4, a.load()];

        case 1:
          return p = r.sent(), o && c ? [4, Sh.getManager(u).removeModel(l)] : [3, 3];

        case 2:
          r.sent(), r.label = 3;

        case 3:
          return [4, s.save(p)];

        case 4:
          return f = r.sent(), !o || c ? [3, 6] : [4, Sh.getManager(u).removeModel(l)];

        case 5:
          r.sent(), r.label = 6;

        case 6:
          return [2, f.modelArtifactsInfo];
      }
    });
  });
}

var Dh = "models_store",
    _h = "model_info_store";

function Oh() {
  if (!a().getBool("IS_BROWSER")) throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");
  var t = window,
      e = t.indexedDB || t.mozIndexedDB || t.webkitIndexedDB || t.msIndexedDB || t.shimIndexedDB;
  if (null == e) throw new Error("The current browser does not appear to support IndexedDB.");
  return e;
}

function Fh(t) {
  var e = t.result;
  e.createObjectStore(Dh, {
    keyPath: "modelPath"
  }), e.createObjectStore(_h, {
    keyPath: "modelPath"
  });
}

var Mh = function () {
  function t(t) {
    if (this.indexedDB = Oh(), null == t || !t) throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");
    this.modelPath = t;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        return [2, this.databaseAction(this.modelPath, t)];
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return [2, this.databaseAction(this.modelPath)];
      });
    });
  }, t.prototype.databaseAction = function (t, e) {
    var n = this;
    return new Promise(function (t, r) {
      var o = n.indexedDB.open("tensorflowjs", 1);
      o.onupgradeneeded = function () {
        return Fh(o);
      }, o.onsuccess = function () {
        var a = o.result;

        if (null == e) {
          var i = a.transaction(Dh, "readonly"),
              s = i.objectStore(Dh).get(n.modelPath);
          s.onsuccess = function () {
            if (null == s.result) return a.close(), r(new Error("Cannot find model with path '" + n.modelPath + "' in IndexedDB."));
            t(s.result.modelArtifacts);
          }, s.onerror = function (t) {
            return a.close(), r(s.error);
          }, i.oncomplete = function () {
            return a.close();
          };
        } else {
          var u,
              l = Ih(e),
              c = a.transaction(_h, "readwrite"),
              h = c.objectStore(_h),
              p = h.put({
            modelPath: n.modelPath,
            modelArtifactsInfo: l
          });
          p.onsuccess = function () {
            var o = (u = a.transaction(Dh, "readwrite")).objectStore(Dh).put({
              modelPath: n.modelPath,
              modelArtifacts: e,
              modelArtifactsInfo: l
            });
            o.onsuccess = function () {
              return t({
                modelArtifactsInfo: l
              });
            }, o.onerror = function (t) {
              var e = (h = c.objectStore(_h)).delete(n.modelPath);
              e.onsuccess = function () {
                return a.close(), r(o.error);
              }, e.onerror = function (t) {
                return a.close(), r(o.error);
              };
            };
          }, p.onerror = function (t) {
            return a.close(), r(p.error);
          }, c.oncomplete = function () {
            null == u ? a.close() : u.oncomplete = function () {
              return a.close();
            };
          };
        }
      }, o.onerror = function (t) {
        return r(o.error);
      };
    });
  }, t.URL_SCHEME = "indexeddb://", t;
}(),
    Bh = function (t) {
  return a().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(Mh.URL_SCHEME) ? (e = t.slice(Mh.URL_SCHEME.length), new Mh(e)) : null;
  var e;
};

kh.registerSaveRouter(Bh), kh.registerLoadRouter(Bh);

var Ph = function () {
  function t() {
    this.indexedDB = Oh();
  }

  return t.prototype.listModels = function () {
    return n(this, void 0, void 0, function () {
      var t = this;
      return r(this, function (e) {
        return [2, new Promise(function (e, n) {
          var r = t.indexedDB.open("tensorflowjs", 1);
          r.onupgradeneeded = function () {
            return Fh(r);
          }, r.onsuccess = function () {
            var t = r.result,
                o = t.transaction(_h, "readonly"),
                a = o.objectStore(_h).getAll();
            a.onsuccess = function () {
              for (var t = {}, n = 0, r = a.result; n < r.length; n++) {
                var o = r[n];
                t[o.modelPath] = o.modelArtifactsInfo;
              }

              e(t);
            }, a.onerror = function (e) {
              return t.close(), n(a.error);
            }, o.oncomplete = function () {
              return t.close();
            };
          }, r.onerror = function (t) {
            return n(r.error);
          };
        })];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return n(this, void 0, void 0, function () {
      var e = this;
      return r(this, function (n) {
        var r;
        return t = (r = t).startsWith(Mh.URL_SCHEME) ? r.slice(Mh.URL_SCHEME.length) : r, [2, new Promise(function (n, r) {
          var o = e.indexedDB.open("tensorflowjs", 1);
          o.onupgradeneeded = function () {
            return Fh(o);
          }, o.onsuccess = function () {
            var e,
                a = o.result,
                i = a.transaction(_h, "readwrite"),
                s = i.objectStore(_h),
                u = s.get(t);
            u.onsuccess = function () {
              if (null == u.result) return a.close(), r(new Error("Cannot find model with path '" + t + "' in IndexedDB."));

              var o = s.delete(t),
                  i = function () {
                var o = (e = a.transaction(Dh, "readwrite")).objectStore(Dh).delete(t);
                o.onsuccess = function () {
                  return n(u.result.modelArtifactsInfo);
                }, o.onerror = function (t) {
                  return r(u.error);
                };
              };

              o.onsuccess = i, o.onerror = function (t) {
                return i(), a.close(), r(u.error);
              };
            }, u.onerror = function (t) {
              return a.close(), r(u.error);
            }, i.oncomplete = function () {
              null == e ? a.close() : e.oncomplete = function () {
                return a.close();
              };
            };
          }, o.onerror = function (t) {
            return r(o.error);
          };
        })];
      });
    });
  }, t;
}();

if (a().getBool("IS_BROWSER")) try {
  Sh.registerManager(Mh.URL_SCHEME, new Ph());
} catch (t) {}
var Lh = "/",
    Wh = "tensorflowjs_models",
    Uh = "info",
    Vh = "model_topology",
    zh = "weight_specs",
    Gh = "weight_data",
    Hh = "model_metadata";

function qh(t) {
  return {
    info: [Wh, t, Uh].join(Lh),
    topology: [Wh, t, Vh].join(Lh),
    weightSpecs: [Wh, t, zh].join(Lh),
    weightData: [Wh, t, Gh].join(Lh),
    modelMetadata: [Wh, t, Hh].join(Lh)
  };
}

function $h(t) {
  var e = t.split(Lh);
  if (e.length < 3) throw new Error("Invalid key format: " + t);
  return e.slice(1, e.length - 1).join(Lh);
}

var Kh = function () {
  function t(t) {
    if (!a().getBool("IS_BROWSER") || void 0 === window.localStorage) throw new Error("The current environment does not support local storage.");
    if (this.LS = window.localStorage, null == t || !t) throw new Error("For local storage, modelPath must not be null, undefined or empty.");
    this.modelPath = t, this.keys = qh(this.modelPath);
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o;
      return r(this, function (r) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        e = JSON.stringify(t.modelTopology), n = JSON.stringify(t.weightSpecs), o = Ih(t);

        try {
          return this.LS.setItem(this.keys.info, JSON.stringify(o)), this.LS.setItem(this.keys.topology, e), this.LS.setItem(this.keys.weightSpecs, n), this.LS.setItem(this.keys.weightData, (a = t.weightData, wh ? Buffer.from(a).toString("base64") : btoa(String.fromCharCode.apply(null, new Uint8Array(a))))), this.LS.setItem(this.keys.modelMetadata, JSON.stringify({
            format: t.format,
            generatedBy: t.generatedBy,
            convertedBy: t.convertedBy
          })), [2, {
            modelArtifactsInfo: o
          }];
        } catch (t) {
          throw this.LS.removeItem(this.keys.info), this.LS.removeItem(this.keys.topology), this.LS.removeItem(this.keys.weightSpecs), this.LS.removeItem(this.keys.weightData), this.LS.removeItem(this.keys.modelMetadata), new Error("Failed to save model '" + this.modelPath + "' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=" + o.modelTopologyBytes + ", weightSpecsBytes=" + o.weightSpecsBytes + ", weightDataBytes=" + o.weightDataBytes + ".");
        }

        var a;
        return [2];
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s;
      return r(this, function (r) {
        if (null == (t = JSON.parse(this.LS.getItem(this.keys.info)))) throw new Error("In local storage, there is no model with name '" + this.modelPath + "'");
        if ("JSON" !== t.modelTopologyType) throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");
        if (e = {}, null == (n = JSON.parse(this.LS.getItem(this.keys.topology)))) throw new Error("In local storage, the topology of model '" + this.modelPath + "' is missing.");
        if (e.modelTopology = n, null == (o = JSON.parse(this.LS.getItem(this.keys.weightSpecs)))) throw new Error("In local storage, the weight specs of model '" + this.modelPath + "' are missing.");
        if (e.weightSpecs = o, null != (a = this.LS.getItem(this.keys.modelMetadata)) && (i = JSON.parse(a), e.format = i.format, e.generatedBy = i.generatedBy, e.convertedBy = i.convertedBy), null == (s = this.LS.getItem(this.keys.weightData))) throw new Error("In local storage, the binary weight values of model '" + this.modelPath + "' are missing.");
        return e.weightData = function (t) {
          if (wh) {
            var e = Buffer.from(t, "base64");
            return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
          }

          for (var n = atob(t), r = new Uint8Array(n.length), o = 0; o < n.length; ++o) r.set([n.charCodeAt(o)], o);

          return r.buffer;
        }(s), [2, e];
      });
    });
  }, t.URL_SCHEME = "localstorage://", t;
}(),
    jh = function (t) {
  return a().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(Kh.URL_SCHEME) ? (e = t.slice(Kh.URL_SCHEME.length), new Kh(e)) : null;
  var e;
};

kh.registerSaveRouter(jh), kh.registerLoadRouter(jh);

var Xh = function () {
  function t() {
    h(a().getBool("IS_BROWSER"), function () {
      return "Current environment is not a web browser";
    }), h(void 0 !== window.localStorage, function () {
      return "Current browser does not appear to support localStorage";
    }), this.LS = window.localStorage;
  }

  return t.prototype.listModels = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i;
      return r(this, function (r) {
        for (t = {}, e = Wh + Lh, n = Lh + Uh, o = 0; o < this.LS.length; ++o) (a = this.LS.key(o)).startsWith(e) && a.endsWith(n) && (i = $h(a), t[i] = JSON.parse(this.LS.getItem(a)));

        return [2, t];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        var o;
        if (t = (o = t).startsWith(Kh.URL_SCHEME) ? o.slice(Kh.URL_SCHEME.length) : o, e = qh(t), null == this.LS.getItem(e.info)) throw new Error("Cannot find model at path '" + t + "'");
        return n = JSON.parse(this.LS.getItem(e.info)), this.LS.removeItem(e.info), this.LS.removeItem(e.topology), this.LS.removeItem(e.weightSpecs), this.LS.removeItem(e.weightData), [2, n];
      });
    });
  }, t;
}();

if (a().getBool("IS_BROWSER")) try {
  Sh.registerManager(Kh.URL_SCHEME, new Xh());
} catch (t) {}
var Yh = "model",
    Qh = ".json",
    Jh = ".weights.bin";

function Zh(t) {
  return new Promise(function (t) {
    return setTimeout(t);
  }).then(t);
}

var tp = function () {
  function t(e) {
    if (!a().getBool("IS_BROWSER")) throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");
    e.startsWith(t.URL_SCHEME) && (e = e.slice(t.URL_SCHEME.length)), null != e && 0 !== e.length || (e = Yh), this.modelTopologyFileName = e + Qh, this.weightDataFileName = e + Jh;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, i, s;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if ("undefined" == typeof document) throw new Error("Browser downloads are not supported in this environment since `document` is not present");
            if (e = window.URL.createObjectURL(new Blob([t.weightData], {
              type: "application/octet-stream"
            })), !(t.modelTopology instanceof ArrayBuffer)) return [3, 1];
            throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");

          case 1:
            return n = [{
              paths: ["./" + this.weightDataFileName],
              weights: t.weightSpecs
            }], o = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              weightsManifest: n
            }, a = window.URL.createObjectURL(new Blob([JSON.stringify(o)], {
              type: "application/json"
            })), (i = null == this.jsonAnchor ? document.createElement("a") : this.jsonAnchor).download = this.modelTopologyFileName, i.href = a, [4, Zh(function () {
              return i.dispatchEvent(new MouseEvent("click"));
            })];

          case 2:
            return r.sent(), null == t.weightData ? [3, 4] : ((s = null == this.weightDataAnchor ? document.createElement("a") : this.weightDataAnchor).download = this.weightDataFileName, s.href = e, [4, Zh(function () {
              return s.dispatchEvent(new MouseEvent("click"));
            })]);

          case 3:
            r.sent(), r.label = 4;

          case 4:
            return [2, {
              modelArtifactsInfo: Ih(t)
            }];
        }
      });
    });
  }, t.URL_SCHEME = "downloads://", t;
}(),
    ep = function () {
  function t(t) {
    if (null == t || t.length < 1) throw new Error("When calling browserFiles, at least 1 file is required, but received " + t);
    this.files = t;
  }

  return t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t,
          e,
          n = this;
      return r(this, function (r) {
        return t = this.files[0], e = this.files.slice(1), [2, new Promise(function (r, o) {
          var a = new FileReader();
          a.onload = function (a) {
            var i = JSON.parse(a.target.result),
                s = i.modelTopology;

            if (null != s) {
              0 === e.length && r({
                modelTopology: s
              });
              var u = i.weightsManifest;

              if (null != u) {
                var l;

                try {
                  l = n.checkManifestAndWeightFiles(u, e);
                } catch (t) {
                  return void o(t);
                }

                var c = [],
                    h = [],
                    p = [];
                u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    h.push(t), p.push(null);
                  }), c.push.apply(c, t.weights);
                }), u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    var e = new FileReader();
                    e.onload = function (e) {
                      var n = e.target.result,
                          o = h.indexOf(t);
                      p[o] = n, -1 === p.indexOf(null) && r({
                        modelTopology: s,
                        weightSpecs: c,
                        weightData: Eh(p)
                      });
                    }, e.onerror = function (e) {
                      return o("Failed to weights data from file of path '" + t + "'.");
                    }, e.readAsArrayBuffer(l[t]);
                  });
                });
              } else o(new Error("weightManifest field is missing from file " + t.name));
            } else o(new Error("modelTopology field is missing from file " + t.name));
          }, a.onerror = function (e) {
            return o("Failed to read model topology and weights manifest JSON from file '" + t.name + "'. BrowserFiles supports loading Keras-style tf.Model artifacts only.");
          }, a.readAsText(t);
        })];
      });
    });
  }, t.prototype.checkManifestAndWeightFiles = function (t, e) {
    for (var n = [], r = e.map(function (t) {
      return Rh(t.name);
    }), o = {}, a = 0, i = t; a < i.length; a++) {
      i[a].paths.forEach(function (t) {
        var a = Rh(t);
        if (-1 !== n.indexOf(a)) throw new Error("Duplicate file basename found in weights manifest: '" + a + "'");
        if (n.push(a), -1 === r.indexOf(a)) throw new Error("Weight file with basename '" + a + "' is not provided.");
        o[t] = e[r.indexOf(a)];
      });
    }

    if (n.length !== e.length) throw new Error("Mismatch in the number of files in weights manifest (" + n.length + ") and the number of weight files provided (" + e.length + ").");
    return o;
  }, t;
}();

function np(t, e, n, r) {
  !function (t) {
    h(null != t && Array.isArray(t) && t.length > 0, function () {
      return "promises must be a none empty array";
    });
  }(t), function (t, e) {
    h(t >= 0 && t <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got startFraction " + t;
    }), h(e >= 0 && e <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got endFraction " + e;
    }), h(e >= t, function () {
      return "startFraction must be no more than endFraction, but got startFraction " + t + " and endFraction " + e;
    });
  }(n = null == n ? 0 : n, r = null == r ? 1 : r);
  var o = 0;
  return Promise.all(t.map(function (a) {
    return a.then(function (a) {
      var i = n + ++o / t.length * (r - n);
      return e(i), a;
    }), a;
  }));
}

function rp(t, e) {
  return n(this, void 0, void 0, function () {
    var n, o, i, s, u, l, c, h, p;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return null == e && (e = {}), n = null == e.fetchFunc ? a().platform.fetch : e.fetchFunc, o = t.map(function (t) {
            return n(t, e.requestInit, {
              isBinary: !0
            });
          }), i = 0, s = .5, null != e.onProgress ? [3, 2] : [4, Promise.all(o)];

        case 1:
          return u = r.sent(), [3, 4];

        case 2:
          return [4, np(o, e.onProgress, i, s)];

        case 3:
          u = r.sent(), r.label = 4;

        case 4:
          return l = u.map(function (t) {
            return t.arrayBuffer();
          }), c = .5, h = 1, null != e.onProgress ? [3, 6] : [4, Promise.all(l)];

        case 5:
          return p = r.sent(), [3, 8];

        case 6:
          return [4, np(l, e.onProgress, c, h)];

        case 7:
          p = r.sent(), r.label = 8;

        case 8:
          return [2, p];
      }
    });
  });
}

function op(t) {
  var e = this;
  return function (o, a, i) {
    return void 0 === a && (a = ""), n(e, void 0, void 0, function () {
      var e, n, s, u, l, c, h, p, f, d;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (e = o.map(function () {
              return !1;
            }), n = {}, s = null != i ? i.map(function () {
              return !1;
            }) : [], u = [], o.forEach(function (t, r) {
              var o = 0;
              t.weights.forEach(function (t) {
                var a = "quantization" in t ? t.quantization.dtype : t.dtype,
                    l = gh[a] * v(t.shape),
                    c = function () {
                  e[r] = !0, null == n[r] && (n[r] = []), n[r].push({
                    manifestEntry: t,
                    groupOffset: o,
                    sizeBytes: l
                  });
                };

                null != i ? i.forEach(function (e, n) {
                  e === t.name && (c(), s[n] = !0);
                }) : c(), u.push(t.name), o += l;
              });
            }), !s.every(function (t) {
              return t;
            })) throw l = i.filter(function (t, e) {
              return !s[e];
            }), new Error("Could not find weights in manifest with names: " + l.join(", ") + ". \nManifest JSON has weights with names: " + u.join(", ") + ".");
            return c = e.reduce(function (t, e, n) {
              return e && t.push(n), t;
            }, []), h = [], c.forEach(function (t) {
              o[t].paths.forEach(function (t) {
                var e = a + (a.endsWith("/") ? "" : "/") + t;
                h.push(e);
              });
            }), [4, t(h)];

          case 1:
            return p = r.sent(), f = {}, d = 0, c.forEach(function (t) {
              for (var e = o[t].paths.length, r = 0, a = 0; a < e; a++) r += p[d + a].byteLength;

              for (var i = new ArrayBuffer(r), s = new Uint8Array(i), u = 0, l = 0; l < e; l++) {
                var c = new Uint8Array(p[d + l]);
                s.set(c, u), u += c.byteLength;
              }

              n[t].forEach(function (t) {
                var e = xh(i.slice(t.groupOffset, t.groupOffset + t.sizeBytes), [t.manifestEntry]);

                for (var n in e) f[n] = e[n];
              }), d += e;
            }), [2, f];
        }
      });
    });
  };
}

kh.registerSaveRouter(function (t) {
  return a().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(tp.URL_SCHEME) ? (e = t.slice(tp.URL_SCHEME.length), void 0 === e && (e = "model"), new tp(e)) : null;
  var e;
});

var ap = function () {
  function t(t, e) {
    if (this.DEFAULT_METHOD = "POST", null == e && (e = {}), this.weightPathPrefix = e.weightPathPrefix, this.onProgress = e.onProgress, null != e.fetchFunc ? (h("function" == typeof e.fetchFunc, function () {
      return "Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)";
    }), this.fetch = e.fetchFunc) : this.fetch = a().platform.fetch, h(null != t && t.length > 0, function () {
      return "URL path for http must not be null, undefined or empty.";
    }), Array.isArray(t) && h(2 === t.length, function () {
      return "URL paths for http must have a length of 2, (actual length is " + t.length + ").";
    }), this.path = t, null != e.requestInit && null != e.requestInit.body) throw new Error("requestInit is expected to have no pre-existing body, but has one.");
    this.requestInit = e.requestInit || {};
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");
            return (e = Object.assign({
              method: this.DEFAULT_METHOD
            }, this.requestInit)).body = new FormData(), n = [{
              paths: ["./model.weights.bin"],
              weights: t.weightSpecs
            }], o = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              userDefinedMetadata: t.userDefinedMetadata,
              weightsManifest: n
            }, e.body.append("model.json", new Blob([JSON.stringify(o)], {
              type: "application/json"
            }), "model.json"), null != t.weightData && e.body.append("model.weights.bin", new Blob([t.weightData], {
              type: "application/octet-stream"
            }), "model.weights.bin"), [4, this.fetch(this.path, e)];

          case 1:
            if ((a = r.sent()).ok) return [2, {
              modelArtifactsInfo: Ih(t),
              responses: [a]
            }];
            throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status " + a.status + ".");
        }
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s, u;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.fetch(this.path, this.requestInit)];

          case 1:
            if (!(t = r.sent()).ok) throw new Error("Request to " + this.path + " failed with status code " + t.status + ". Please verify this URL points to the model JSON of the model to load.");
            r.label = 2;

          case 2:
            return r.trys.push([2, 4,, 5]), [4, t.json()];

          case 3:
            return e = r.sent(), [3, 5];

          case 4:
            throw r.sent(), n = "Failed to parse model JSON of response from " + this.path + ".", this.path.endsWith(".pb") ? n += " Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository." : n += " Please make sure the server is serving valid JSON for this request.", new Error(n);

          case 5:
            if (o = e.modelTopology, a = e.weightsManifest, null == o && null == a) throw new Error("The JSON from HTTP path " + this.path + " contains neither model topology or manifest for weights.");
            return null == a ? [3, 7] : [4, this.loadWeights(a)];

          case 6:
            u = r.sent(), i = u[0], s = u[1], r.label = 7;

          case 7:
            return [2, {
              modelTopology: o,
              weightSpecs: i,
              weightData: s
            }];
        }
      });
    });
  }, t.prototype.loadWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, i, s, u, l, c, h, p;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            for (e = Array.isArray(this.path) ? this.path[1] : this.path, n = function (t) {
              var e = t.lastIndexOf("/"),
                  n = t.lastIndexOf("?"),
                  r = t.substring(0, e),
                  o = n > e ? t.substring(n) : "";
              return [r + "/", o];
            }(e), o = n[0], a = n[1], i = this.weightPathPrefix || o, s = [], u = 0, l = t; u < l.length; u++) c = l[u], s.push.apply(s, c.weights);

            return h = [], t.forEach(function (t) {
              t.paths.forEach(function (t) {
                h.push(i + t + a);
              });
            }), [4, rp(h, {
              requestInit: this.requestInit,
              fetchFunc: this.fetch,
              onProgress: this.onProgress
            })];

          case 1:
            return p = r.sent(), [2, [s, Eh(p)]];
        }
      });
    });
  }, t.URL_SCHEME_REGEX = /^https?:\/\//, t;
}();

function ip(t) {
  return null != t.match(ap.URL_SCHEME_REGEX);
}

var sp = function (t, e) {
  if ("undefined" == typeof fetch) return null;
  return (Array.isArray(t) ? t.every(function (t) {
    return ip(t);
  }) : ip(t)) ? up(t, {
    onProgress: e
  }) : null;
};

function up(t, e) {
  return new ap(t, e);
}

kh.registerSaveRouter(sp), kh.registerLoadRouter(sp);

var lp = function () {
  function t(t) {
    this.modelArtifacts = t;
  }

  return t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return [2, this.modelArtifacts];
      });
    });
  }, t;
}(),
    cp = function () {
  function t(t) {
    this.saveHandler = t;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        return [2, this.saveHandler(t)];
      });
    });
  }, t;
}();

var hp = Object.freeze({
  browserFiles: function (t) {
    return new ep(t);
  },
  browserHTTPRequest: function (t, e) {
    return up(t, e);
  },
  concatenateArrayBuffers: Eh,
  decodeWeights: xh,
  encodeWeights: function (t, e) {
    return n(this, void 0, void 0, function () {
      var o,
          a,
          i,
          s,
          u,
          l = this;
      return r(this, function (c) {
        switch (c.label) {
          case 0:
            for (o = [], a = [], i = Array.isArray(t) ? t.map(function (t) {
              return t.name;
            }) : Object.keys(t), s = function (s) {
              var u = i[s],
                  c = Array.isArray(t) ? t[s].tensor : t[u];
              if ("float32" !== c.dtype && "int32" !== c.dtype && "bool" !== c.dtype && "string" !== c.dtype) throw new Error("Unsupported dtype in weight '" + u + "': " + c.dtype);
              var h = {
                name: u,
                shape: c.shape,
                dtype: c.dtype
              };

              if ("string" === c.dtype) {
                var p = new Promise(function (t) {
                  return n(l, void 0, void 0, function () {
                    var e, n, o, a, i, s, u;
                    return r(this, function (r) {
                      switch (r.label) {
                        case 0:
                          return [4, c.bytes()];

                        case 1:
                          for (e = r.sent(), n = e.reduce(function (t, e) {
                            return t + e.length;
                          }, 0) + yh * e.length, o = new Uint8Array(n), a = 0, i = 0; i < e.length; i++) s = e[i], u = new Uint8Array(new Uint32Array([s.length]).buffer), o.set(u, a), a += yh, o.set(s, a), a += s.length;

                          return t(o), [2];
                      }
                    });
                  });
                });
                a.push(p);
              } else a.push(c.data());

              null != e && (h.group = e), o.push(h);
            }, u = 0; u < i.length; ++u) s(u);

            return [4, Promise.all(a)];

          case 1:
            return [2, {
              data: bh(c.sent()),
              specs: o
            }];
        }
      });
    });
  },
  fromMemory: function (t, e, n, r) {
    return 1 === arguments.length ? null != t.modelTopology || null != t.weightSpecs ? new lp(t) : (console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."), new lp({
      modelTopology: t
    })) : (console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."), new lp({
      modelTopology: t,
      weightSpecs: e,
      weightData: n,
      trainingConfig: r
    }));
  },
  getLoadHandlers: function (t, e) {
    return kh.getLoadHandlers(t, e);
  },
  getModelArtifactsInfoForJSON: Ih,
  getSaveHandlers: function (t) {
    return kh.getSaveHandlers(t);
  },
  http: up,
  isHTTPScheme: ip,
  loadWeights: function (t, e, o, a) {
    return void 0 === e && (e = ""), n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return [2, op(function (t) {
          return rp(t, {
            requestInit: a
          });
        })(t, e, o)];
      });
    });
  },
  registerLoadRouter: function (t) {
    return kh.registerLoadRouter(t);
  },
  registerSaveRouter: function (t) {
    return kh.registerSaveRouter(t);
  },
  weightsLoaderFactory: op,
  withSaveHandler: function (t) {
    return new cp(t);
  },
  copyModel: function (t, e) {
    return n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return [2, Th(t, e, !1)];
      });
    });
  },
  listModels: function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            t = Sh.getSchemes(), e = {}, n = 0, o = t, r.label = 1;

          case 1:
            return n < o.length ? (a = o[n], [4, Sh.getManager(a).listModels()]) : [3, 4];

          case 2:
            for (s in i = r.sent()) e[a + Nh + s] = i[s];

            r.label = 3;

          case 3:
            return n++, [3, 1];

          case 4:
            return [2, e];
        }
      });
    });
  },
  moveModel: function (t, e) {
    return n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return [2, Th(t, e, !0)];
      });
    });
  },
  removeModel: function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return e = Ah(t), [2, Sh.getManager(e.scheme).removeModel(e.path)];
      });
    });
  }
});
exports.io = hp;
var pp = mn({
  confusionMatrix_: function (t, e, n) {
    var r = rn(t, "labels", "confusionMatrix"),
        o = rn(e, "predictions", "confusionMatrix");
    h(null == n || n > 0 && Number.isInteger(n), function () {
      return "If provided, numClasses must be a positive integer, but got " + n;
    }), h(1 === r.rank, function () {
      return "Expected the rank of labels to be 1, but got " + r.rank;
    }), h(1 === o.rank, function () {
      return "Expected the rank of predictions to be 1, but got " + o.rank;
    }), h(r.shape[0] === o.shape[0], function () {
      return "Mismatch in the number of examples: " + r.shape[0] + " vs. " + o.shape[0] + ". Labels and predictions should have the same number of elements.";
    }), h(n > 0 && Number.isInteger(n), function () {
      return "numClasses is required to be a positive integer, but got " + n;
    });
    var a = cr(r.asType("int32"), n),
        i = cr(o.asType("int32"), n);
    return a.transpose().matMul(i).asType("int32");
  }
}),
    fp = Object.freeze({
  confusionMatrix: pp
});
exports.math = fp;

var dp = mn({
  fromPixels_: function (t, e) {
    if (void 0 === e && (e = 3), e > 4) throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");
    var n = "undefined" != typeof HTMLVideoElement && t instanceof HTMLVideoElement;
    if (n && n && t.readyState < 2) throw new Error("The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.");
    return kt.fromPixels(t, e);
  }
}),
    vp = Object.freeze({
  toPixels: function (t, e) {
    return n(this, void 0, void 0, function () {
      var n, o, a, i, s, u, l, c, h, p, f, d, v, m, g, y, x, b, w, C, E, R, I;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (n = rn(t, "img", "toPixels"), t instanceof ut || (n = n.toInt()), 2 !== n.rank && 3 !== n.rank) throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + n.rank + ".");
            if (o = n.shape.slice(0, 2), a = o[0], i = o[1], (s = 2 === n.rank ? 1 : n.shape[2]) > 4 || 2 === s) throw new Error("toPixels only supports depth of size 1, 3 or 4 but got " + s);
            return [4, n.data()];

          case 1:
            return u = r.sent(), l = n.min(), c = n.max(), [4, Promise.all([l.data(), c.data()])];

          case 2:
            if (h = r.sent(), p = h[0], f = h[1], d = p[0], v = f[0], l.dispose(), c.dispose(), "float32" === n.dtype) {
              if (d < 0 || v > 1) throw new Error("Tensor values for a float32 Tensor must be in the range [0 - 1] but got range [" + d + " - " + v + "].");
            } else {
              if ("int32" !== n.dtype) throw new Error("Unsupported type for toPixels: " + n.dtype + ". Please use float32 or int32 tensors.");
              if (d < 0 || v > 255) throw new Error("Tensor values for a int32 Tensor must be in the range [0 - 255] but got range [" + d + " - " + v + "].");
            }

            for (m = "float32" === n.dtype ? 255 : 1, g = new Uint8ClampedArray(i * a * 4), y = 0; y < a * i; ++y) x = void 0, b = void 0, w = void 0, C = void 0, 1 === s ? (x = u[y] * m, b = u[y] * m, w = u[y] * m, C = 255) : 3 === s ? (x = u[3 * y] * m, b = u[3 * y + 1] * m, w = u[3 * y + 2] * m, C = 255) : 4 === s && (x = u[4 * y] * m, b = u[4 * y + 1] * m, w = u[4 * y + 2] * m, C = u[4 * y + 3] * m), g[0 + (E = 4 * y)] = Math.round(x), g[E + 1] = Math.round(b), g[E + 2] = Math.round(w), g[E + 3] = Math.round(C);

            return null != e && (e.width = i, e.height = a, R = e.getContext("2d"), I = new ImageData(g, i, a), R.putImageData(I, 0, 0)), n !== t && n.dispose(), [2, g];
        }
      });
    });
  },
  fromPixels: dp
}),
    mp = function () {
  function t() {}

  return t.prototype.getClassName = function () {
    return this.constructor.className;
  }, t.fromConfig = function (t, e) {
    return new t(e);
  }, t;
}(),
    gp = function () {
  function t() {
    this.classNameMap = {};
  }

  return t.getMap = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.register = function (e) {
    t.getMap().classNameMap[e.className] = [e, e.fromConfig];
  }, t;
}();

exports.browser = vp;

function yp(t) {
  h(null != t.className, function () {
    return "Class being registered does not have the static className property defined.";
  }), h("string" == typeof t.className, function () {
    return "className is required to be a string, but got type " + typeof t.className;
  }), h(t.className.length > 0, function () {
    return "Class being registered has an empty-string as its className, which is disallowed.";
  }), gp.register(t);
}

var xp = Object.freeze({
  Serializable: mp,
  SerializationMap: gp,
  registerClass: yp
}),
    bp = .001,
    wp = .1;
exports.serialization = xp;

function Cp() {
  return 32 === kt.backend.floatPrecision() ? bp : wp;
}

function Ep(t, e, n) {
  var r = !0;

  if ((T(t) || T(e)) && (r = !1), T(t) && T(e) && (r = !0), r) {
    var o = t.constructor.name,
        a = e.constructor.name;
    if (o !== a) throw new Error("Arrays are of different type. Actual: " + o + ". Expected: " + a);
  }

  if (Array.isArray(t) && Array.isArray(e)) {
    var i = en(t),
        s = en(e);
    if (!m(i, s)) throw new Error("Arrays have different shapes. Actual: [" + i + "]. Expected: [" + s + "]");
  }

  var u = T(t) ? t : d(t),
      l = T(e) ? e : d(e);
  if (u.length !== l.length) throw new Error("Arrays have different lengths actual: " + u.length + " vs expected: " + l.length + ".\nActual:   " + u + ".\nExpected: " + l + ".");

  for (var c = 0; c < l.length; ++c) {
    var h = u[c],
        p = l[c];
    if (!n(h, p)) throw new Error("Arrays differ: actual[" + c + "] = " + h + ", expected[" + c + "] = " + p + ".\nActual:   " + u + ".\nExpected: " + l + ".");
  }
}

function Rp(t, e, n) {
  return !isFinite(t) && !isFinite(e) || !(isNaN(t) || isNaN(e) || Math.abs(t - e) > n);
}

var Ip = Object.freeze({
  TEST_EPSILON_FLOAT16: wp,
  expectArraysClose: function (t, e, n) {
    return null == n && (n = Cp()), Ep(t, e, function (t, e) {
      return Rp(t, e, n);
    });
  },
  testEpsilon: Cp,
  expectPromiseToFail: function (t, e) {
    t().then(function () {
      return e.fail();
    }, function () {
      return e();
    });
  },
  expectArraysEqual: function (t, e) {
    var n = "string" == typeof e || "number" == typeof e || "boolean" == typeof e ? [e] : e;
    return O(t) || O(t[0]) || O(e) || O(e[0]) ? Ep(t, n, function (t, e) {
      return t == e;
    }) : Ep(t, e, function (t, e) {
      return Rp(t, e, 0);
    });
  },
  expectNumbersClose: function (t, e, n) {
    if (null == n && (n = Cp()), !Rp(t, e, n)) throw new Error("Numbers differ: actual === " + t + ", expected === " + e);
  },
  expectValuesInRange: function (t, e, n) {
    for (var r = 0; r < t.length; r++) if (t[r] < e || t[r] > n) throw new Error("Value out of range:" + t[r] + " low: " + e + ", high: " + n);
  },
  expectArrayBuffersEqual: function (t, e) {
    expect(new Float32Array(t)).toEqual(new Float32Array(e));
  }
}),
    kp = "1.2.11";
exports.version_core = kp;
exports.test_util = Ip;

var Np = Object.freeze({
  gpgpu_util: hi,
  webgl_util: De,
  forceHalfFloat: function () {
    a().set("WEBGL_FORCE_F16_TEXTURES", !0);
  },
  MathBackendWebGL: As,
  setWebGLContext: Ot,
  GPGPUContext: pi
}),
    Sp = function (t) {
  function o() {
    return null !== t && t.apply(this, arguments) || this;
  }

  return e(o, t), o.prototype.minimize = function (t, e, n) {
    void 0 === e && (e = !1);
    var r = this.computeGradients(t, n),
        o = r.value,
        a = r.grads;

    if (null != n) {
      var i = n.map(function (t) {
        return {
          name: t.name,
          tensor: a[t.name]
        };
      });
      this.applyGradients(i);
    } else this.applyGradients(a);

    return ze(a), e ? o : (o.dispose(), null);
  }, Object.defineProperty(o.prototype, "iterations", {
    get: function () {
      return null == this.iterations_ && (this.iterations_ = 0), this.iterations_;
    },
    enumerable: !0,
    configurable: !0
  }), o.prototype.incrementIterations = function () {
    this.iterations_ = this.iterations + 1;
  }, o.prototype.computeGradients = function (t, e) {
    return jr(t, e);
  }, o.prototype.dispose = function () {
    null != this.iterations_ && ze(this.iterations_);
  }, o.prototype.saveIterations = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return null == this.iterations_ && (this.iterations_ = 0), [2, {
          name: "iter",
          tensor: Cn(this.iterations_, "int32")
        }];
      });
    });
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("getWeights() is not implemented for this optimizer yet.");
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("setWeights() is not implemented for this optimizer class " + this.getClassName());
      });
    });
  }, o.prototype.extractIterations = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return e = this, [4, t[0].tensor.data()];

          case 1:
            return e.iterations_ = n.sent()[0], [2, t.slice(1)];
        }
      });
    });
  }, o;
}(mp);

exports.Optimizer = Sp;
exports.webgl = Np;
Object.defineProperty(Sp, Symbol.hasInstance, {
  value: function (t) {
    return null != t.minimize && null != t.computeGradients && null != t.applyGradients;
  }
});

var Ap = function (t) {
  function o(e, n, r) {
    void 0 === r && (r = null);
    var o = t.call(this) || this;
    return o.learningRate = e, o.rho = n, o.epsilon = r, o.accumulatedGrads = [], o.accumulatedUpdates = [], null == r && (o.epsilon = kt.backend.epsilon()), o;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = kt.registeredVariables[n];
      null == e.accumulatedGrads[r] && (e.accumulatedGrads[r] = {
        originalName: n + "/accum_grad",
        variable: Ve(function () {
          return Mn(o).variable(!1);
        })
      }), null == e.accumulatedUpdates[r] && (e.accumulatedUpdates[r] = {
        originalName: n + "/accum_var",
        variable: Ve(function () {
          return Mn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable,
            s = e.accumulatedUpdates[r].variable;
        Ve(function () {
          var t = i.mul(e.rho).add(a.square().mul(1 - e.rho)),
              n = s.add(e.epsilon).sqrt().div(i.add(e.epsilon).sqrt()).mul(a),
              r = s.mul(e.rho).add(n.square().mul(1 - e.rho));
          i.assign(t), s.assign(r);
          var u = n.mul(-e.learningRate).add(o);
          o.assign(u);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedUpdates && (ze(this.accumulatedGrads.map(function (t) {
      return t.variable;
    })), ze(this.accumulatedUpdates.map(function (t) {
      return t.variable;
    })));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedGrads.concat(this.accumulatedUpdates), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = t.length / 2, !1, this.accumulatedGrads = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedUpdates = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      rho: this.rho,
      epsilon: this.epsilon
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.rho, e.epsilon);
  }, o.className = "Adadelta", o;
}(Sp);

exports.AdadeltaOptimizer = Ap;
yp(Ap);

var Tp = function (t) {
  function o(e, n) {
    void 0 === n && (n = .1);
    var r = t.call(this) || this;
    return r.learningRate = e, r.initialAccumulatorValue = n, r.accumulatedGrads = [], r;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = kt.registeredVariables[n];

      if (null == e.accumulatedGrads[r]) {
        e.accumulatedGrads[r] = {
          originalName: n + "/accumulator",
          variable: Ve(function () {
            return Dn(o.shape, e.initialAccumulatorValue).variable(!1);
          })
        };
      }

      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable;
        Ve(function () {
          var t = i.add(a.square());
          i.assign(t);
          var n = a.div(t.add(kt.backend.epsilon()).sqrt()).mul(-e.learningRate).add(o);
          o.assign(n);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedGrads && ze(this.accumulatedGrads.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulatedGrads.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulatedGrads = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      initialAccumulatorValue: this.initialAccumulatorValue
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.initialAccumulatorValue);
  }, o.className = "Adagrad", o;
}(Sp);

exports.AdagradOptimizer = Tp;
yp(Tp);

var Dp = function (t) {
  function o(e, n, r, o) {
    void 0 === o && (o = null);
    var a = t.call(this) || this;
    return a.learningRate = e, a.beta1 = n, a.beta2 = r, a.epsilon = o, a.accumulatedFirstMoment = [], a.accumulatedSecondMoment = [], Ve(function () {
      a.accBeta1 = Cn(n).variable(), a.accBeta2 = Cn(r).variable();
    }), null == o && (a.epsilon = kt.backend.epsilon()), a;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Ve(function () {
      var r = Yu(1, e.accBeta1),
          o = Yu(1, e.accBeta2);
      n.forEach(function (n, a) {
        var i = kt.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Ve(function () {
            return Mn(i).variable(!1);
          })
        }), null == e.accumulatedSecondMoment[a] && (e.accumulatedSecondMoment[a] = {
          originalName: n + "/v",
          variable: Ve(function () {
            return Mn(i).variable(!1);
          })
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              l = e.accumulatedSecondMoment[a].variable,
              c = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = l.mul(e.beta2).add(s.square().mul(1 - e.beta2)),
              p = c.div(r),
              f = h.div(o);
          u.assign(c), l.assign(h);
          var d = p.div(f.sqrt().add(e.epsilon)).mul(-e.learningRate).add(i);
          i.assign(d);
        }
      }), e.accBeta1.assign(e.accBeta1.mul(e.beta1)), e.accBeta2.assign(e.accBeta2.mul(e.beta2));
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.accBeta1.dispose(), this.accBeta2.dispose(), null != this.accumulatedFirstMoment && ze(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedSecondMoment && ze(this.accumulatedSecondMoment.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedFirstMoment.concat(this.accumulatedSecondMoment), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e,
          n = this;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = r.sent(), Ve(function () {
              n.accBeta1.assign($u(n.beta1, n.iterations_ + 1)), n.accBeta2.assign($u(n.beta2, n.iterations_ + 1));
            }), e = t.length / 2, !1, this.accumulatedFirstMoment = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedSecondMoment = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon);
  }, o.className = "Adam", o;
}(Sp);

exports.AdamOptimizer = Dp;
yp(Dp);

var _p = function (t) {
  function o(e, n, r, o, a) {
    void 0 === o && (o = null), void 0 === a && (a = 0);
    var i = t.call(this) || this;
    return i.learningRate = e, i.beta1 = n, i.beta2 = r, i.epsilon = o, i.decay = a, i.accumulatedFirstMoment = [], i.accumulatedWeightedInfNorm = [], Ve(function () {
      i.iteration = Cn(0).variable(), i.accBeta1 = Cn(n).variable();
    }), null == o && (i.epsilon = kt.backend.epsilon()), i;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Ve(function () {
      var r = Yu(1, e.accBeta1),
          o = Mu(-e.learningRate, e.iteration.mul(e.decay).add(1));
      n.forEach(function (n, a) {
        var i = kt.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Mn(i).variable(!1)
        }), null == e.accumulatedWeightedInfNorm[a] && (e.accumulatedWeightedInfNorm[a] = {
          originalName: n + "/v",
          variable: Mn(i).variable(!1)
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              l = e.accumulatedWeightedInfNorm[a].variable,
              c = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = l.mul(e.beta2),
              p = s.abs(),
              f = h.maximum(p);
          u.assign(c), l.assign(f);
          var d = o.div(r).mul(c.div(f.add(e.epsilon))).add(i);
          i.assign(d);
        }
      }), e.iteration.assign(e.iteration.add(1)), e.accBeta1.assign(e.accBeta1.mul(e.beta1));
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.accBeta1.dispose(), this.iteration.dispose(), null != this.accumulatedFirstMoment && ze(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedWeightedInfNorm && ze(this.accumulatedWeightedInfNorm.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("getWeights() is not implemented for Adamax yet.");
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("setWeights() is not implemented for Adamax yet.");
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon,
      decay: this.decay
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon, e.decay);
  }, o.className = "Adamax", o;
}(Sp);

exports.AdamaxOptimizer = _p;
yp(_p);

var Op = function (t) {
  function o(e) {
    var n = t.call(this) || this;
    return n.learningRate = e, n.setLearningRate(e), n;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != o) {
        var a = kt.registeredVariables[n];
        Ve(function () {
          var t = e.c.mul(o).add(a);
          a.assign(t);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.setLearningRate = function (t) {
    this.learningRate = t, null != this.c && this.c.dispose(), this.c = Ge(Cn(-t));
  }, o.prototype.dispose = function () {
    this.c.dispose();
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()]];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            if (0 !== (t = e.sent()).length) throw new Error("SGD optimizer does not have settable weights.");
            return [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate);
  }, o.className = "SGD", o;
}(Sp);

exports.SGDOptimizer = Op;
yp(Op);

var Fp = function (t) {
  function o(e, n, r) {
    void 0 === r && (r = !1);
    var o = t.call(this, e) || this;
    return o.learningRate = e, o.momentum = n, o.useNesterov = r, o.accumulations = [], o.m = Cn(o.momentum), o;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = kt.registeredVariables[n];

      if (null == e.accumulations[r]) {
        e.accumulations[r] = {
          originalName: n + "/momentum",
          variable: Ve(function () {
            return Mn(o).variable(!1);
          })
        };
      }

      var a = e.accumulations[r].variable,
          i = Array.isArray(t) ? t[r].tensor : t[n];
      null != i && Ve(function () {
        var t,
            n = e.m.mul(a).add(i);
        t = e.useNesterov ? e.c.mul(i.add(n.mul(e.m))).add(o) : e.c.mul(n).add(o), a.assign(n), o.assign(t);
      });
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.m.dispose(), null != this.accumulations && ze(this.accumulations.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.setMomentum = function (t) {
    this.momentum = t;
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulations.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulations = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      momentum: this.momentum,
      useNesterov: this.useNesterov
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.momentum, e.useNesterov);
  }, o.className = "Momentum", o;
}(Op);

exports.MomentumOptimizer = Fp;
yp(Fp);

var Mp = function (t) {
  function o(e, n, r, o, a) {
    void 0 === n && (n = .9), void 0 === r && (r = 0), void 0 === o && (o = null), void 0 === a && (a = !1);
    var i = t.call(this) || this;
    return i.learningRate = e, i.decay = n, i.momentum = r, i.epsilon = o, i.accumulatedMeanSquares = [], i.accumulatedMoments = [], i.accumulatedMeanGrads = [], i.centered = a, null == o && (i.epsilon = kt.backend.epsilon()), i;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = kt.registeredVariables[n];
      null == e.accumulatedMeanSquares[r] && (e.accumulatedMeanSquares[r] = {
        originalName: n + "/rms",
        variable: Ve(function () {
          return Mn(o).variable(!1);
        })
      }), null == e.accumulatedMoments[r] && (e.accumulatedMoments[r] = {
        originalName: n + "/momentum",
        variable: Ve(function () {
          return Mn(o).variable(!1);
        })
      }), null == e.accumulatedMeanGrads[r] && e.centered && (e.accumulatedMeanGrads[r] = {
        originalName: n + "/mg",
        variable: Ve(function () {
          return Mn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedMeanSquares[r].variable,
            s = e.accumulatedMoments[r].variable;
        Ve(function () {
          var t = i.mul(e.decay).add(a.square().mul(1 - e.decay));

          if (e.centered) {
            var n = e.accumulatedMeanGrads[r].variable,
                u = n.mul(e.decay).add(a.mul(1 - e.decay)),
                l = s.mul(e.momentum).add(a.mul(e.learningRate).div(t.sub(u.square().add(e.epsilon)).sqrt()));
            i.assign(t), n.assign(u), s.assign(l);
            var c = o.sub(l);
            o.assign(c);
          } else {
            var h = i.mul(e.decay).add(a.square().mul(1 - e.decay));
            l = s.mul(e.momentum).add(a.mul(e.learningRate).div(h.add(e.epsilon).sqrt()));
            i.assign(h), s.assign(l);
            c = o.sub(l);
            o.assign(c);
          }
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedMeanSquares && ze(this.accumulatedMeanSquares.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMeanGrads && this.centered && ze(this.accumulatedMeanGrads.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMoments && ze(this.accumulatedMoments.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedMeanSquares.concat(this.accumulatedMoments), this.centered && t.push.apply(t, this.accumulatedMeanGrads), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = this.centered ? t.length / 3 : t.length / 2, !1, this.accumulatedMeanSquares = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedMoments = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.centered && (this.accumulatedMeanGrads = t.slice(2 * e, 3 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            })), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      decay: this.decay,
      momentum: this.momentum,
      epsilon: this.epsilon,
      centered: this.centered
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.decay, e.momentum, e.epsilon, e.centered);
  }, o.className = "RMSProp", o;
}(Sp);

exports.RMSPropOptimizer = Mp;
yp(Mp);

var Bp = function () {
  function t() {}

  return t.sgd = function (t) {
    return new Op(t);
  }, t.momentum = function (t, e, n) {
    return void 0 === n && (n = !1), new Fp(t, e, n);
  }, t.rmsprop = function (t, e, n, r, o) {
    return void 0 === e && (e = .9), void 0 === n && (n = 0), void 0 === r && (r = null), void 0 === o && (o = !1), new Mp(t, e, n, r, o);
  }, t.adam = function (t, e, n, r) {
    return void 0 === t && (t = .001), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), new Dp(t, e, n, r);
  }, t.adadelta = function (t, e, n) {
    return void 0 === t && (t = .001), void 0 === e && (e = .95), void 0 === n && (n = null), new Ap(t, e, n);
  }, t.adamax = function (t, e, n, r, o) {
    return void 0 === t && (t = .002), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), void 0 === o && (o = 0), new _p(t, e, n, r, o);
  }, t.adagrad = function (t, e) {
    return void 0 === e && (e = .1), new Tp(t, e);
  }, t;
}(),
    Pp = {
  sgd: Bp.sgd,
  momentum: Bp.momentum,
  adadelta: Bp.adadelta,
  adagrad: Bp.adagrad,
  rmsprop: Bp.rmsprop,
  adamax: Bp.adamax,
  adam: Bp.adam
},
    Lp = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : "undefined" != typeof setImmediate ? setImmediate : function (t) {
  return t();
};

exports.train = Pp;

function Wp() {
  return new Promise(function (t) {
    return Lp(function () {
      return t();
    });
  });
}

it = ch;
},{"crypto":"node_modules/parcel-bundler/src/builtins/_empty.js","node-fetch":"node_modules/parcel-bundler/src/builtins/_empty.js","util":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGraphModel = loadGraphModel;
exports.deregisterOp = deregisterOp;
exports.registerOp = registerOp;
exports.version_converter = exports.GraphModel = void 0;

var _tfjsCore = require("@tensorflow/tfjs-core");

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DataType,
    SaverDef,
    __assign = function () {
  return (__assign = Object.assign || function (e) {
    for (var t, a = 1, r = arguments.length; a < r; a++) for (var n in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);

    return e;
  }).apply(this, arguments);
};

function __awaiter(e, t, a, r) {
  return new (a || (a = Promise))(function (n, s) {
    function o(e) {
      try {
        u(r.next(e));
      } catch (e) {
        s(e);
      }
    }

    function p(e) {
      try {
        u(r.throw(e));
      } catch (e) {
        s(e);
      }
    }

    function u(e) {
      e.done ? n(e.value) : new a(function (t) {
        t(e.value);
      }).then(o, p);
    }

    u((r = r.apply(e, t || [])).next());
  });
}

function __generator(e, t) {
  var a,
      r,
      n,
      s,
      o = {
    label: 0,
    sent: function () {
      if (1 & n[0]) throw n[1];
      return n[1];
    },
    trys: [],
    ops: []
  };
  return s = {
    next: p(0),
    throw: p(1),
    return: p(2)
  }, "function" == typeof Symbol && (s[Symbol.iterator] = function () {
    return this;
  }), s;

  function p(s) {
    return function (p) {
      return function (s) {
        if (a) throw new TypeError("Generator is already executing.");

        for (; o;) try {
          if (a = 1, r && (n = 2 & s[0] ? r.return : s[0] ? r.throw || ((n = r.return) && n.call(r), 0) : r.next) && !(n = n.call(r, s[1])).done) return n;

          switch (r = 0, n && (s = [2 & s[0], n.value]), s[0]) {
            case 0:
            case 1:
              n = s;
              break;

            case 4:
              return o.label++, {
                value: s[1],
                done: !1
              };

            case 5:
              o.label++, r = s[1], s = [0];
              continue;

            case 7:
              s = o.ops.pop(), o.trys.pop();
              continue;

            default:
              if (!(n = (n = o.trys).length > 0 && n[n.length - 1]) && (6 === s[0] || 2 === s[0])) {
                o = 0;
                continue;
              }

              if (3 === s[0] && (!n || s[1] > n[0] && s[1] < n[3])) {
                o.label = s[1];
                break;
              }

              if (6 === s[0] && o.label < n[1]) {
                o.label = n[1], n = s;
                break;
              }

              if (n && o.label < n[2]) {
                o.label = n[2], o.ops.push(s);
                break;
              }

              n[2] && o.ops.pop(), o.trys.pop();
              continue;
          }

          s = t.call(e, o);
        } catch (e) {
          s = [6, e], r = 0;
        } finally {
          a = n = 0;
        }

        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([s, p]);
    };
  }
}

!function (e) {
  e[e.DT_INVALID = 0] = "DT_INVALID", e[e.DT_FLOAT = 1] = "DT_FLOAT", e[e.DT_DOUBLE = 2] = "DT_DOUBLE", e[e.DT_INT32 = 3] = "DT_INT32", e[e.DT_UINT8 = 4] = "DT_UINT8", e[e.DT_INT16 = 5] = "DT_INT16", e[e.DT_INT8 = 6] = "DT_INT8", e[e.DT_STRING = 7] = "DT_STRING", e[e.DT_COMPLEX64 = 8] = "DT_COMPLEX64", e[e.DT_INT64 = 9] = "DT_INT64", e[e.DT_BOOL = 10] = "DT_BOOL", e[e.DT_QINT8 = 11] = "DT_QINT8", e[e.DT_QUINT8 = 12] = "DT_QUINT8", e[e.DT_QINT32 = 13] = "DT_QINT32", e[e.DT_BFLOAT16 = 14] = "DT_BFLOAT16", e[e.DT_FLOAT_REF = 101] = "DT_FLOAT_REF", e[e.DT_DOUBLE_REF = 102] = "DT_DOUBLE_REF", e[e.DT_INT32_REF = 103] = "DT_INT32_REF", e[e.DT_UINT8_REF = 104] = "DT_UINT8_REF", e[e.DT_INT16_REF = 105] = "DT_INT16_REF", e[e.DT_INT8_REF = 106] = "DT_INT8_REF", e[e.DT_STRING_REF = 107] = "DT_STRING_REF", e[e.DT_COMPLEX64_REF = 108] = "DT_COMPLEX64_REF", e[e.DT_INT64_REF = 109] = "DT_INT64_REF", e[e.DT_BOOL_REF = 110] = "DT_BOOL_REF", e[e.DT_QINT8_REF = 111] = "DT_QINT8_REF", e[e.DT_QUINT8_REF = 112] = "DT_QUINT8_REF", e[e.DT_QINT32_REF = 113] = "DT_QINT32_REF", e[e.DT_BFLOAT16_REF = 114] = "DT_BFLOAT16_REF";
}(DataType || (DataType = {})), function (e) {
  !function (e) {
    e[e.LEGACY = 0] = "LEGACY", e[e.V1 = 1] = "V1", e[e.V2 = 2] = "V2";
  }(e.CheckpointFormatVersion || (e.CheckpointFormatVersion = {}));
}(SaverDef || (SaverDef = {}));
var CUSTOM_OPS = {};

function registerOp(e, t) {
  var a = {
    tfOpName: e,
    category: "custom",
    inputs: [],
    attrs: [],
    customExecutor: t
  };
  CUSTOM_OPS[e] = a;
}

function getRegisteredOp(e) {
  return CUSTOM_OPS[e];
}

function deregisterOp(e) {
  delete CUSTOM_OPS[e];
}

function getParamValue(e, t, a, r) {
  var n = t.inputParams[e];

  if (n && void 0 !== n.inputIndexStart) {
    var s = n.inputIndexStart,
        o = 0 === n.inputIndexEnd ? void 0 : void 0 === n.inputIndexEnd ? s + 1 : n.inputIndexEnd;
    if ("tensor" === n.type) return getTensor(t.inputNames[n.inputIndexStart], a, r);
    if ("tensors" === n.type) return t.inputNames.slice(s, o).map(function (e) {
      return getTensor(e, a, r);
    });
    var p = Array.prototype.slice.call(getTensor(t.inputNames.slice(s)[0], a, r).dataSync());
    return "number" === n.type ? p[0] : p;
  }

  var u = t.attrParams[e];
  return u && u.value;
}

function getTensor(e, t, a) {
  var r = parseNodeName(e),
      n = r[0],
      s = r[1],
      o = a.currentContextIds.find(function (e) {
    return !!t[getNodeNameWithContextId(n, e)];
  });
  return void 0 !== o ? t[getNodeNameWithContextId(n, o)][s] : void 0;
}

function getTensorsForCurrentContenxt(e, t, a) {
  return t[getNodeNameWithContextId(e, a.currentContextId)];
}

function getNodeNameAndIndex(e, t) {
  var a = parseNodeName(e),
      r = a[0],
      n = a[1];
  return [getNodeNameWithContextId(r, t && t.currentContextId), n];
}

function getNodeNameWithContextId(e, t) {
  return t ? e + "-" + t : e;
}

function parseNodeName(e) {
  var t = e.lastIndexOf(":");
  return -1 === t ? [e, 0] : [e.substring(0, t), Number(e.substring(t + 1))];
}

function split$1(e, t) {
  for (var a = [], r = 0; r < e.length; r += t) a.push(e.slice(r, r + t));

  return a;
}

var json = [{
  tfOpName: "Add",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AddV2",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AddN",
  category: "arithmetic",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "BiasAdd",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sub",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "RealDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Div",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mul",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Maximum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Minimum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Pow",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "SquaredDifference",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorMod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    arithmetic = Object.freeze({
  json: json
}),
    json$1 = [{
  tfOpName: "Abs",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan2",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ceil",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ClipByValue",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "clip_value_min",
    name: "clipValueMin",
    type: "number"
  }, {
    tfName: "clip_value_max",
    name: "clipValueMax",
    type: "number"
  }]
}, {
  tfOpName: "Complex",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "real",
    type: "tensor"
  }, {
    start: 1,
    name: "imag",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ComplexAbs",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Cos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Cosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Elu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Exp",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Floor",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Imag",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "Tout",
    name: "outputType",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Neg",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Real",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "Tout",
    name: "outputType",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Prelu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "alpha",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu6",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "clipValueMin",
    name: "clipValueMin",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "clipValueMax",
    name: "clipValueMax",
    type: "number",
    defaultValue: 6
  }]
}, {
  tfOpName: "Selu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sigmoid",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Rsqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Square",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sign",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Round",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Expm1",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log1p",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Reciprocal",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Softplus",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Erf",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Prod",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axes",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LeakyRelu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: .2
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    basicMath = Object.freeze({
  json: json$1
}),
    json$2 = [{
  tfOpName: "LoopCond",
  category: "control",
  inputs: [{
    start: 0,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Switch",
  category: "control",
  inputs: [{
    start: 0,
    name: "data",
    type: "tensor"
  }, {
    start: 1,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Merge",
  category: "control",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "Enter",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "frame_name",
    name: "frameName",
    type: "string"
  }, {
    tfName: "is_constant",
    name: "isConstant",
    type: "bool"
  }]
}, {
  tfOpName: "Exit",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NextIteration",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "size",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }, {
    tfName: "dynamic_size",
    name: "dynamicSize",
    type: "bool"
  }, {
    tfName: "clear_after_read",
    name: "clearAfterRead",
    type: "bool"
  }, {
    tfName: "identical_element_shapes",
    name: "identicalElementShapes",
    type: "bool"
  }, {
    tfName: "tensor_array_name",
    name: "name",
    type: "string"
  }]
}, {
  tfOpName: "TensorArrayWriteV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayReadV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayGatherV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }]
}, {
  tfOpName: "TensorArrayScatterV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArrayConcatV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape_except0",
    name: "elementShapeExcept0",
    type: "shape",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArraySplitV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "tensor",
    type: "tensor"
  }, {
    start: 2,
    name: "lengths",
    type: "number[]"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArraySizeV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }]
}, {
  tfOpName: "TensorArrayCloseV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }]
}],
    control = Object.freeze({
  json: json$2
}),
    json$3 = [{
  tfOpName: "AvgPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AvgPool3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPool3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Conv1D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "stride",
    name: "stride",
    type: "number"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NWC"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "dilation",
    name: "dilation",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "Conv2D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "useCudnnOnGpu",
    name: "useCudnnOnGpu",
    type: "bool"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "_FusedConv2D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 2,
    end: 0,
    name: "args",
    type: "tensors"
  }],
  attrs: [{
    tfName: "num_args",
    name: "numArgs",
    type: "number"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "explicit_paddings",
    name: "explicitPaddings",
    type: "number[]",
    defaultValue: []
  }, {
    tfName: "use_cudnn_on_gpu",
    name: "useCudnnOnGpu",
    type: "bool",
    defaultValue: !0
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]",
    defaultValue: [1, 1, 1, 1]
  }, {
    tfName: "fused_ops",
    name: "fusedOps",
    type: "string[]",
    defaultValue: []
  }, {
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: 1e-4
  }]
}, {
  tfOpName: "Conv2DBackpropInput",
  category: "convolution",
  inputs: [{
    start: 2,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 0,
    name: "outputShape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "DepthwiseConv2d",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthwiseConv2dNative",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "Conv3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}],
    convolution = Object.freeze({
  json: json$3
}),
    json$4 = [{
  tfOpName: "Fill",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }, {
    start: 1,
    name: "value",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "LinSpace",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "num",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "OneHot",
  category: "creation",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "depth",
    type: "number"
  }, {
    start: 2,
    name: "onValue",
    type: "number",
    defaultValue: 1
  }, {
    start: 3,
    name: "offValue",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ones",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "OnesLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "RandomUniform",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "minval",
    name: "minval",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "maxval",
    name: "maxval",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "seed",
    name: "seed",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Range",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "step",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "Tidx",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TruncatedNormal",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "means",
    name: "mean",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "stddev",
    name: "stdDev",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "seed",
    name: "seed",
    type: "number"
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Zeros",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ZerosLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Multinomial",
  category: "creation",
  inputs: [{
    start: 0,
    name: "logits",
    type: "tensor"
  }, {
    start: 1,
    name: "numSamples",
    type: "number"
  }],
  attrs: [{
    tfName: "seed",
    name: "seed",
    type: "number"
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "output_dtype",
    name: "output_dtype",
    type: "dtype"
  }]
}],
    creation = Object.freeze({
  json: json$4
}),
    json$5 = [{
  tfOpName: "NonMaxSuppressionV2",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }]
}, {
  tfOpName: "NonMaxSuppressionV3",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }, {
    start: 4,
    name: "scoreThreshold",
    type: "number"
  }]
}, {
  tfOpName: "Where",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ListDiff",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    dynamic = Object.freeze({
  json: json$5
}),
    json$6 = [{
  tfOpName: "TopKV2",
  category: "evaluation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "k",
    type: "number"
  }],
  attrs: [{
    tfName: "sorted",
    name: "sorted",
    type: "bool"
  }]
}],
    evaluation = Object.freeze({
  json: json$6
}),
    json$7 = [{
  tfOpName: "PlaceholderWithDefault",
  category: "graph",
  inputs: [{
    start: 0,
    name: "default",
    type: "tensor"
  }],
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Placeholder",
  category: "graph",
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Const",
  category: "graph"
}, {
  tfOpName: "Identity",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IdentityN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Snapshot",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Rank",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Size",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Shape",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "ShapeN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Print",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "data",
    type: "tensors"
  }],
  attrs: [{
    tfName: "message",
    name: "message",
    type: "string"
  }, {
    tfName: "first_n",
    name: "firstN",
    type: "number",
    notSupported: !0
  }, {
    tfName: "summarize",
    name: "summarize",
    type: "number",
    defaultValue: 3
  }]
}, {
  tfOpName: "NoOp",
  category: "graph",
  inputs: []
}, {
  tfOpName: "StopGradient",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "FakeQuantWithMinMaxVars",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "min",
    name: "min",
    type: "number"
  }, {
    tfName: "max",
    name: "max",
    type: "number"
  }]
}],
    graph = Object.freeze({
  json: json$7
}),
    json$8 = [{
  tfOpName: "ResizeBilinear",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ResizeNearestNeighbor",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "CropAndResize",
  category: "image",
  inputs: [{
    start: 0,
    name: "image",
    type: "tensor"
  }, {
    start: 1,
    name: "boxes",
    type: "tensor"
  }, {
    start: 2,
    name: "boxInd",
    type: "tensor"
  }, {
    start: 3,
    name: "cropSize",
    type: "number[]"
  }],
  attrs: [{
    tfName: "method",
    name: "method",
    type: "string"
  }, {
    tfName: "extrapolation_value",
    name: "extrapolationValue",
    type: "number"
  }]
}],
    image$1 = Object.freeze({
  json: json$8
}),
    json$9 = [{
  tfOpName: "Equal",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NotEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Greater",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "GreaterEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Less",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LessEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalAnd",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalNot",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalOr",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Select",
  category: "logical",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }, {
    start: 1,
    name: "a",
    type: "tensor"
  }, {
    start: 2,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    logical = Object.freeze({
  json: json$9
}),
    json$10 = [{
  tfOpName: "MatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "transpose_a",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "transpose_b",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "BatchMatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "adj_x",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "adj_y",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "BatchMatMulV2",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "adj_x",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "adj_y",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Transpose",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "perm",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    matrices = Object.freeze({
  json: json$10
}),
    json$11 = [{
  tfOpName: "FusedBatchNorm",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "FusedBatchNormV2",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "FusedBatchNormV3",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "LRN",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "depth_radius",
    name: "radius",
    type: "number",
    defaultValue: 5
  }, {
    tfName: "bias",
    name: "bias",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "beta",
    name: "beta",
    type: "number",
    defaultValue: .5
  }]
}, {
  tfOpName: "Softmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "LogSoftmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !0,
    notSupported: !0
  }]
}],
    normalization = Object.freeze({
  json: json$11
}),
    json$12 = [{
  tfOpName: "Max",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Mean",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Min",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Sum",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "All",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Any",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "ArgMax",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "ArgMin",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Prod",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}],
    reduction = Object.freeze({
  json: json$12
}),
    json$13 = [{
  tfOpName: "ConcatV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: -1,
    name: "tensors",
    type: "tensors"
  }, {
    start: -1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Concat",
  category: "slice_join",
  inputs: [{
    start: 1,
    end: 0,
    name: "tensors",
    type: "tensors"
  }, {
    start: 0,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "GatherV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Gather",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "Reverse",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "dims",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "ReverseV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "Slice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "size",
    type: "number[]"
  }]
}, {
  tfOpName: "StridedSlice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "end",
    type: "number[]"
  }, {
    start: 3,
    name: "strides",
    type: "number[]"
  }],
  attrs: [{
    tfName: "begin_mask",
    name: "beginMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "end_mask",
    name: "endMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "new_axis_mask",
    name: "newAxisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "ellipsis_mask",
    name: "ellipsisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "shrink_axis_mask",
    name: "shrinkAxisMask",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Pack",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Unpack",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "num",
    name: "num",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }]
}, {
  tfOpName: "Tile",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "reps",
    type: "number[]"
  }]
}, {
  tfOpName: "Split",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    start: 1,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "num_split",
    name: "numOrSizeSplits",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "SplitV",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "numOrSizeSplits",
    type: "number[]"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "ScatterNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "values",
    type: "tensor"
  }, {
    start: 2,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "GatherNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !1,
    notSupported: !0
  }]
}],
    sliceJoin = Object.freeze({
  json: json$13
}),
    json$14 = [{
  tfOpName: "FFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "RFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "IRFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}],
    spectral = Object.freeze({
  json: json$14
}),
    json$15 = [{
  tfOpName: "Cast",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "SrcT",
    name: "sdtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "DstT",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ExpandDims",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Pad",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }],
  attrs: [{
    tfName: "constant_value",
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "PadV2",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }, {
    start: 2,
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Reshape",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "Squeeze",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    tfDeprecatedName: "squeeze_dims",
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "SpaceToBatchND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "paddings",
    type: "number[]"
  }]
}, {
  tfOpName: "BatchToSpaceND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "crops",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthToSpace",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "block_size",
    name: "blockSize",
    type: "number"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string"
  }]
}],
    transformation = Object.freeze({
  json: json$15
}),
    OperationMapper = function () {
  function e() {
    var e = [arithmetic, basicMath, control, convolution, creation, dynamic, evaluation, logical, image$1, graph, matrices, normalization, reduction, sliceJoin, spectral, transformation],
        t = [].concat.apply([], e.map(function (e) {
      return e.json;
    }));
    this.opMappers = t.reduce(function (e, t) {
      return e[t.tfOpName] = t, e;
    }, {});
  }

  return Object.defineProperty(e, "Instance", {
    get: function () {
      return this._instance || (this._instance = new this());
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.transformGraph = function (e) {
    var t = this,
        a = [],
        r = [],
        n = e.node.reduce(function (e, n) {
      return e[n.name] = t.mapNode(n), "Placeholder" === n.op && a.push(e[n.name]), "Const" === n.op && r.push(e[n.name]), e;
    }, {}),
        s = [],
        o = [],
        p = Object.keys(n);
    return p.forEach(function (e) {
      var t = n[e];
      t.inputNames.forEach(function (e) {
        var a = getNodeNameAndIndex(e)[0];
        t.inputs.push(n[a]), n[a].children.push(t);
      }), 0 === t.inputs.length && s.push(t);
    }), p.forEach(function (e) {
      var t = n[e];
      0 === t.children.length && o.push(t);
    }), {
      nodes: n,
      inputs: s,
      outputs: o,
      weights: r,
      placeholders: a
    };
  }, e.prototype.mapNode = function (e) {
    var t = getRegisteredOp(e.op) || this.opMappers[e.op] || {};
    null == e.attr && (e.attr = {});
    var a = {
      name: e.name,
      op: e.op,
      category: t.category,
      inputNames: (e.input || []).map(function (e) {
        return e.startsWith("^") ? e.substr(1) : e;
      }),
      inputs: [],
      children: [],
      inputParams: {},
      attrParams: {},
      rawAttrs: e.attr
    };
    return null != t.inputs && (a.inputParams = t.inputs.reduce(function (e, t) {
      return e[t.name] = {
        type: t.type,
        inputIndexStart: t.start,
        inputIndexEnd: t.end
      }, e;
    }, {})), null != t.attrs && (a.attrParams = t.attrs.reduce(function (t, a) {
      var r = a.type,
          n = void 0;

      switch (a.type) {
        case "string":
          void 0 === (n = getStringParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "string[]":
          void 0 === (n = getStringArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number":
          void 0 === (n = getNumberParam(e.attr, a.tfName, a.defaultValue || 0)) && a.tfDeprecatedName && (n = getNumberParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number[]":
          void 0 === (n = getNumericArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getNumericArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool":
          void 0 === (n = getBoolParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool[]":
          void 0 === (n = getBoolArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape":
          void 0 === (n = getTensorShapeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape[]":
          void 0 === (n = getTensorShapeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype":
          void 0 === (n = getDtypeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype[]":
          void 0 === (n = getDtypeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "tensor":
        case "tensors":
          break;

        default:
          throw new Error("Unsupported param type: " + a.type + " for op: " + e.op);
      }

      return t[a.name] = {
        value: n,
        type: r
      }, t;
    }, {})), a;
  }, e;
}();

function decodeBase64(e) {
  var t = _tfjsCore.ENV.global;
  if (void 0 !== t.atob) return t.atob(e);
  if ("undefined" != typeof Buffer) return new Buffer(e, "base64").toString();
  throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()");
}

function parseStringParam(e, t) {
  var a = Array.isArray(e) ? String.fromCharCode.apply(null, e) : decodeBase64(e);
  return t ? a : a.toLowerCase();
}

function getStringParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return null != n ? parseStringParam(n.s, r) : a;
}

function getBoolParam(e, t, a) {
  var r = e[t];
  return r ? r.b : a;
}

function getNumberParam(e, t, a) {
  var r = e[t] || {},
      n = null != r.i ? r.i : null != r.f ? r.f : a;
  return "number" == typeof n ? n : parseInt(n, 10);
}

function parseDtypeParam(e) {
  switch ("string" == typeof e && (e = DataType[e]), e) {
    case DataType.DT_FLOAT:
      return "float32";

    case DataType.DT_INT32:
      return "int32";

    case DataType.DT_BOOL:
      return "bool";

    case DataType.DT_DOUBLE:
      return "float32";

    case DataType.DT_STRING:
      return "string";

    default:
      return null;
  }
}

function getDtypeParam(e, t, a) {
  var r = e[t];
  return r && r.type ? parseDtypeParam(r.type) : a;
}

function getDtypeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.type ? r.list.type.map(function (e) {
    return parseDtypeParam(e);
  }) : a;
}

function parseTensorShapeParam(e) {
  if (!e.unknownRank) return null != e.dim ? e.dim.map(function (e) {
    return "number" == typeof e.size ? e.size : parseInt(e.size, 10);
  }) : [];
}

function getTensorShapeParam(e, t, a) {
  var r = e[t];
  return r && r.shape ? parseTensorShapeParam(r.shape) : a;
}

function getNumericArrayParam(e, t, a) {
  var r = e[t];
  return r ? ((r.list.f && r.list.f.length ? r.list.f : r.list.i) || []).map(function (e) {
    return "number" == typeof e ? e : parseInt(e, 10);
  }) : a;
}

function getStringArrayParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return n && n.list && n.list.s ? n.list.s.map(function (e) {
    return parseStringParam(e, r);
  }) : a;
}

function getTensorShapeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.shape ? r.list.shape.map(function (e) {
    return parseTensorShapeParam(e);
  }) : a;
}

function getBoolArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.b ? r.list.b : a;
}

var NodeValueImpl = function () {
  function e(e, t, a) {
    var r = this;
    this.node = e, this.tensorMap = t, this.context = a, this.inputs = [], this.attrs = {}, this.inputs = e.inputNames.map(function (e) {
      return r.getInput(e);
    }), null != e.rawAttrs && (this.attrs = Object.keys(e.rawAttrs).reduce(function (e, t) {
      return e[t] = r.getAttr(t), e;
    }, {}));
  }

  return e.prototype.getInput = function (e) {
    return getTensor(e, this.tensorMap, this.context);
  }, e.prototype.getAttr = function (e, t) {
    var a = this.node.rawAttrs[e];
    if (null != a.tensor) return getTensor(e, this.tensorMap, this.context);
    if (null != a.i || null != a.f) return getNumberParam(this.node.rawAttrs, e, t);
    if (null != a.s) return getStringParam(this.node.rawAttrs, e, t);
    if (null != a.b) return getBoolParam(this.node.rawAttrs, e, t);
    if (null != a.shape) return getTensorShapeParam(this.node.rawAttrs, e, t);
    if (null != a.type) return getDtypeParam(this.node.rawAttrs, e, t);

    if (null != a.list) {
      if (null != a.list.i || null != a.list.f) return getNumericArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.s) return getStringArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.shape) return getTensorShapeArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.b) return getBoolArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.type) return getDtypeArrayParam(this.node.rawAttrs, e, t);
    }

    return t;
  }, e;
}(),
    executeOp = function (e, t, a) {
  switch (e.op) {
    case "BiasAdd":
    case "AddV2":
    case "Add":
      return [(0, _tfjsCore.add)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "AddN":
      return [(0, _tfjsCore.addN)(getParamValue("tensors", e, t, a))];

    case "FloorMod":
    case "Mod":
      return [(0, _tfjsCore.mod)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Mul":
      return [(0, _tfjsCore.mul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "RealDiv":
    case "Div":
      return [(0, _tfjsCore.div)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "FloorDiv":
      return [(0, _tfjsCore.floorDiv)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Sub":
      return [(0, _tfjsCore.sub)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Minimum":
      return [(0, _tfjsCore.minimum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Maximum":
      return [(0, _tfjsCore.maximum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Pow":
      return [(0, _tfjsCore.pow)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "SquaredDifference":
      return [(0, _tfjsCore.squaredDifference)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$1 = function (e, t, a) {
  switch (e.op) {
    case "Abs":
    case "ComplexAbs":
      return [(0, _tfjsCore.abs)(getParamValue("x", e, t, a))];

    case "Acos":
      return [(0, _tfjsCore.acos)(getParamValue("x", e, t, a))];

    case "Acosh":
      return [(0, _tfjsCore.acosh)(getParamValue("x", e, t, a))];

    case "Asin":
      return [(0, _tfjsCore.asin)(getParamValue("x", e, t, a))];

    case "Asinh":
      return [(0, _tfjsCore.asinh)(getParamValue("x", e, t, a))];

    case "Atan":
      return [(0, _tfjsCore.atan)(getParamValue("x", e, t, a))];

    case "Atan2":
      return [(0, _tfjsCore.atan2)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

    case "Atanh":
      return [(0, _tfjsCore.atanh)(getParamValue("x", e, t, a))];

    case "Ceil":
      return [(0, _tfjsCore.ceil)(getParamValue("x", e, t, a))];

    case "Complex":
      return [(0, _tfjsCore.complex)(getParamValue("real", e, t, a), getParamValue("imag", e, t, a))];

    case "Cos":
      return [(0, _tfjsCore.cos)(getParamValue("x", e, t, a))];

    case "Cosh":
      return [(0, _tfjsCore.cosh)(getParamValue("x", e, t, a))];

    case "Elu":
      return [(0, _tfjsCore.elu)(getParamValue("x", e, t, a))];

    case "Erf":
      return [(0, _tfjsCore.erf)(getParamValue("x", e, t, a))];

    case "Exp":
      return [(0, _tfjsCore.exp)(getParamValue("x", e, t, a))];

    case "Expm1":
      return [(0, _tfjsCore.expm1)(getParamValue("x", e, t, a))];

    case "Floor":
      return [(0, _tfjsCore.floor)(getParamValue("x", e, t, a))];

    case "Log":
      return [(0, _tfjsCore.log)(getParamValue("x", e, t, a))];

    case "Log1p":
      return [(0, _tfjsCore.log1p)(getParamValue("x", e, t, a))];

    case "Imag":
      return [(0, _tfjsCore.imag)(getParamValue("x", e, t, a))];

    case "Neg":
      return [(0, _tfjsCore.neg)(getParamValue("x", e, t, a))];

    case "Reciprocal":
      return [(0, _tfjsCore.reciprocal)(getParamValue("x", e, t, a))];

    case "Real":
      return [(0, _tfjsCore.real)(getParamValue("x", e, t, a))];

    case "Relu":
      return [(0, _tfjsCore.relu)(getParamValue("x", e, t, a))];

    case "Round":
      return [(0, _tfjsCore.round)(getParamValue("x", e, t, a))];

    case "Selu":
      return [(0, _tfjsCore.selu)(getParamValue("x", e, t, a))];

    case "Sigmoid":
      return [(0, _tfjsCore.sigmoid)(getParamValue("x", e, t, a))];

    case "Sin":
      return [(0, _tfjsCore.sin)(getParamValue("x", e, t, a))];

    case "Sign":
      return [(0, _tfjsCore.sign)(getParamValue("x", e, t, a))];

    case "Sinh":
      return [(0, _tfjsCore.sinh)(getParamValue("x", e, t, a))];

    case "Softplus":
      return [(0, _tfjsCore.softplus)(getParamValue("x", e, t, a))];

    case "Sqrt":
      return [(0, _tfjsCore.sqrt)(getParamValue("x", e, t, a))];

    case "Square":
      return [(0, _tfjsCore.square)(getParamValue("x", e, t, a))];

    case "Tanh":
      return [(0, _tfjsCore.tanh)(getParamValue("x", e, t, a))];

    case "Tan":
      return [(0, _tfjsCore.tan)(getParamValue("x", e, t, a))];

    case "Relu6":
    case "ClipByValue":
      return [(0, _tfjsCore.clipByValue)(getParamValue("x", e, t, a), getParamValue("clipValueMin", e, t, a), getParamValue("clipValueMax", e, t, a))];

    case "Rsqrt":
      return [(0, _tfjsCore.rsqrt)(getTensor(e.inputNames[0], t, a))];

    case "Prod":
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), getParamValue("axes", e, t, a))];

    case "LeakyRelu":
      return [(0, _tfjsCore.leakyRelu)(getParamValue("x", e, t, a), getParamValue("alpha", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    TensorArray = function () {
  function e(t, a, r, n, s, o, p) {
    this.name = t, this.dtype = a, this.maxSize = r, this.elementShape = n, this.identicalElementShapes = s, this.dynamicSize = o, this.clearAfterRead = p, this.tensors = [], this.closed_ = !1, this.id = e.nextId++;
  }

  return Object.defineProperty(e.prototype, "closed", {
    get: function () {
      return this.closed_;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.clearAndClose = function () {
    this.tensors.forEach(function (e) {
      return e.tensor.dispose();
    }), this.tensors = [], this.closed_ = !0;
  }, e.prototype.size = function () {
    return this.tensors.length;
  }, e.prototype.read = function (e) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || e >= this.tensors.length) throw new Error("Tried to read from index " + e + ", but array size is: " + this.tensors.length);
    var t = this.tensors[e];
    if (t.cleared) throw new Error("TensorArray " + this.name + ": Could not read index " + e + " twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).");
    return this.clearAfterRead && (t.cleared = !0), t.read = !0, t.tensor;
  }, e.prototype.readMany = function (e) {
    var t = this;
    return e.map(function (e) {
      return t.read(e);
    });
  }, e.prototype.write = function (e, t) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || !this.dynamicSize && e >= this.maxSize) throw new Error("Tried to write to index " + e + ", but array is not resizeable and size is: " + this.maxSize);
    var a = this.tensors[e] || {};
    if (t.dtype !== this.dtype) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ",\n          because the value dtype is " + t.dtype + ", but TensorArray dtype is " + this.dtype + ".");
    if (0 !== this.size() || null != this.elementShape && 0 !== this.elementShape.length || (this.elementShape = t.shape), this.assertShapesMatchAllowUndefinedSize(this.elementShape, t.shape, "TensorArray " + this.name + ": Could not write to TensorArray index " + e + "."), a && a.read) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been read.");
    if (a && a.written) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been written.");
    a.tensor = t, a.written = !0, this.tensors[e] = a;
  }, e.prototype.writeMany = function (e, t) {
    var a = this;
    if (e.length !== t.length) throw new Error("TensorArray " + this.name + ": could not write multiple tensors,because the index size: " + e.length + " is not the same as tensors size: " + t.length + ".");
    e.forEach(function (e, r) {
      return a.write(e, t[r]);
    });
  }, e.prototype.gather = function (e, t) {
    if (t && t !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but gather requested dtype " + t);

    if (!e) {
      e = [];

      for (var a = 0; a < this.size(); a++) e.push(a);
    }

    if (0 === e.length) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));
    var r = this.readMany(e);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: "), (0, _tfjsCore.stack)(r, 0);
  }, e.prototype.concat = function (e) {
    if (e && e !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but concat requested dtype " + e);
    if (0 === this.size()) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));

    for (var t = [], a = 0; a < this.size(); a++) t.push(a);

    var r = this.readMany(t);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: tensor array shape (" + this.elementShape + ") vs first tensor shape (" + r[0].shape + ")"), (0, _tfjsCore.concat)(r, 0);
  }, e.prototype.scatter = function (e, t) {
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    if (e.length !== t.shape[0]) throw new Error("Expected len(indices) == tensor.shape[0], but saw: " + e.length + " vs. " + t.shape[0]);
    var a = Math.max.apply(Math, e);
    if (!this.dynamicSize && a >= this.maxSize) throw new Error("Max index must be < array size (" + a + "  vs. " + this.maxSize + ")");
    this.writeMany(e, (0, _tfjsCore.unstack)(t, 0));
  }, e.prototype.split = function (e, t) {
    var a = this;
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    var r = 0,
        n = e.map(function (e) {
      return r += e;
    });
    if (r !== t.shape[0]) throw new Error("Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        " + r + ", and tensor's shape is: " + t.shape);
    if (!this.dynamicSize && e.length !== this.maxSize) throw new Error("TensorArray's size is not equal to the size of lengths (" + this.maxSize + " vs. " + e.length + "), and the TensorArray is not marked as dynamically resizeable");
    var s = 0 === r ? 0 : t.size / r,
        o = [];
    (0, _tfjsCore.tidy)(function () {
      t = t.reshape([1, r, s]);

      for (var p = 0; p < e.length; ++p) {
        var u = [0, 0 === p ? 0 : n[p - 1], 0],
            i = [1, e[p], s];
        o[p] = (0, _tfjsCore.slice)(t, u, i).reshape(a.elementShape);
      }

      return o;
    });

    for (var p = [], u = 0; u < e.length; u++) p[u] = u;

    this.writeMany(p, o);
  }, e.prototype.assertShapesMatchAllowUndefinedSize = function (e, t, a) {
    void 0 === a && (a = ""), _tfjsCore.util.assert(this.shapesEqualAllowUndefinedSize(e, t), function () {
      return a + " Shapes " + e + " and " + t + " must match";
    });
  }, e.prototype.shapesEqualAllowUndefinedSize = function (e, t) {
    if (e.length !== t.length) return !1;

    for (var a = 0; a < e.length; a++) if (-1 !== e[a] && -1 !== t[a] && e[a] !== t[a]) return !1;

    return !0;
  }, e.nextId = 0, e;
}();

function executeOp$2(e, t, a) {
  return __awaiter(this, void 0, void 0, function () {
    var r, n, s, o, p, u, i, m, l, c, d, y, f, g, h, N, x, V, P, b, T, O, S, v, _, w, A, D, E, I, C, M, k, z, j;

    return __generator(this, function (F) {
      switch (F.label) {
        case 0:
          switch (e.op) {
            case "LoopCond":
              return [3, 1];

            case "Switch":
              return [3, 2];

            case "Merge":
              return [3, 4];

            case "Enter":
              return [3, 5];

            case "Exit":
              return [3, 6];

            case "NextIteration":
              return [3, 7];

            case "TensorArrayV3":
              return [3, 8];

            case "TensorArrayWriteV3":
              return [3, 9];

            case "TensorArrayReadV3":
              return [3, 10];

            case "TensorArrayGatherV3":
              return [3, 11];

            case "TensorArrayScatterV3":
              return [3, 12];

            case "TensorArrayConcatV3":
              return [3, 13];

            case "TensorArraySplitV3":
              return [3, 14];

            case "TensorArraySizeV3":
              return [3, 15];

            case "TensorArrayCloseV3":
              return [3, 16];
          }

          return [3, 17];

        case 1:
          return [2, [getParamValue("pred", e, t, a).clone()]];

        case 2:
          return r = getParamValue("pred", e, t, a), n = getParamValue("data", e, t, a), [4, r.data()];

        case 3:
          return [2, F.sent()[0] ? [void 0, n.clone()] : [n.clone(), void 0]];

        case 4:
          return [2, (s = e.inputNames.find(function (e) {
            return void 0 !== getTensor(e, t, a);
          })) ? [getTensor(s, t, a).clone()] : void 0];

        case 5:
          return o = getParamValue("frameName", e, t, a), p = getParamValue("tensor", e, t, a), a.enterFrame(o), [2, [p.clone()]];

        case 6:
          return u = getParamValue("tensor", e, t, a), a.exitFrame(), [2, [u.clone()]];

        case 7:
          return i = getParamValue("tensor", e, t, a), a.nextIteration(), [2, [i.clone()]];

        case 8:
          return m = getParamValue("size", e, t, a), l = getParamValue("dtype", e, t, a), c = getParamValue("elementShape", e, t, a), d = getParamValue("dynamicSize", e, t, a), y = getParamValue("clearAfterRead", e, t, a), f = getParamValue("identicalElementShapes", e, t, a), g = getParamValue("name", e, t, a), h = new TensorArray(g, l, m, c, f, d, y), a.addTensorArray(h), [2, [(0, _tfjsCore.scalar)(h.id), (0, _tfjsCore.scalar)(1)]];

        case 9:
          return N = getParamValue("tensorArrayId", e, t, a), x = getParamValue("index", e, t, a), V = getParamValue("tensor", e, t, a), a.getTensorArray(N).write(x, V), [2, [(0, _tfjsCore.scalar)(1)]];

        case 10:
          return P = getParamValue("tensorArrayId", e, t, a), b = getParamValue("index", e, t, a), [2, [a.getTensorArray(P).read(b)]];

        case 11:
          return T = getParamValue("tensorArrayId", e, t, a), O = getParamValue("indices", e, t, a), S = getParamValue("dtype", e, t, a), [2, [a.getTensorArray(T).gather(O, S)]];

        case 12:
          return v = getParamValue("tensorArrayId", e, t, a), _ = getParamValue("indices", e, t, a), w = getParamValue("tensor", e, t, a), a.getTensorArray(v).scatter(_, w), [2, [(0, _tfjsCore.scalar)(1)]];

        case 13:
          return A = getParamValue("tensorArrayId", e, t, a), D = a.getTensorArray(A), E = getParamValue("dtype", e, t, a), [2, [D.concat(E)]];

        case 14:
          return I = getParamValue("tensorArrayId", e, t, a), C = getParamValue("tensor", e, t, a), M = getParamValue("lengths", e, t, a), a.getTensorArray(I).split(M, C), [2, [(0, _tfjsCore.scalar)(1)]];

        case 15:
          return k = getParamValue("tensorArrayId", e, t, a), z = a.getTensorArray(k), [2, [(0, _tfjsCore.scalar)(z.size(), "int32")]];

        case 16:
          return j = getParamValue("tensorArrayId", e, t, a), a.getTensorArray(j).clearAndClose(), [2, []];

        case 17:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
}

var executeOp$3 = function (e, t, a) {
  var r, n;

  switch (e.op) {
    case "Conv1D":
      var s = getParamValue("stride", e, t, a),
          o = getParamValue("pad", e, t, a),
          p = getParamValue("dataFormat", e, t, a).toUpperCase(),
          u = getParamValue("dilation", e, t, a);
      return [(0, _tfjsCore.conv1d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), s, o, p, u)];

    case "Conv2D":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), p = getParamValue("dataFormat", e, t, a).toUpperCase();
      var i = getParamValue("dilations", e, t, a);
      return [(0, _tfjsCore.conv2d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), [s[1], s[2]], o, p, [i[1], i[2]])];

    case "_FusedConv2D":
      var m = (r = getParamValue("fusedOps", e, t, a))[0],
          l = r[1],
          c = "biasadd" === m,
          d = "prelu" === l,
          y = "fusedbatchnorm" === m,
          f = getParamValue("numArgs", e, t, a);

      if (c) {
        if (d && 2 !== f) throw new Error("Fused Conv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");
        if (!d && 1 !== f) throw new Error("Fused Conv2d with BiasAdd must have one extra argument: bias.");
      }

      if (y) throw new Error("Fused Conv2d with FusedBatchNorm is not supported.");
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), p = getParamValue("dataFormat", e, t, a).toUpperCase(), i = getParamValue("dilations", e, t, a);
      var g = (n = getParamValue("args", e, t, a))[0],
          h = n[1];
      return [_tfjsCore.fused.conv2d({
        x: getParamValue("x", e, t, a),
        filter: getParamValue("filter", e, t, a),
        strides: [s[1], s[2]],
        pad: o,
        dataFormat: p,
        dilations: [i[1], i[2]],
        bias: g,
        activation: l,
        preluActivationWeights: h
      })];

    case "Conv2DBackpropInput":
    case "Conv2dTranspose":
      var N = getParamValue("outputShape", e, t, a);
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a);
      return [(0, _tfjsCore.conv2dTranspose)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), N, [s[1], s[2]], o)];

    case "DepthwiseConv2dNative":
    case "DepthwiseConv2d":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), i = getParamValue("dilations", e, t, a), p = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthwiseConv2d)(getParamValue("input", e, t, a), getParamValue("filter", e, t, a), [s[1], s[2]], o, p, [i[1], i[2]])];

    case "Conv3D":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), p = getParamValue("dataFormat", e, t, a).toUpperCase(), i = getParamValue("dilations", e, t, a);
      return [(0, _tfjsCore.conv3d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), [s[1], s[2], s[3]], o, p, [i[1], i[2], i[3]])];

    case "AvgPool":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a);
      var x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.avgPool)(getParamValue("x", e, t, a), [x[1], x[2]], [s[1], s[2]], o)];

    case "MaxPool":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.maxPool)(getParamValue("x", e, t, a), [x[1], x[2]], [s[1], s[2]], o)];

    case "AvgPool3D":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.avgPool3d)(getParamValue("x", e, t, a), [x[1], x[2], x[3]], [s[1], s[2], s[3]], o)];

    case "MaxPool3D":
      s = getParamValue("strides", e, t, a), o = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.maxPool3d)(getParamValue("x", e, t, a), [x[1], x[2], x[3]], [s[1], s[2], s[3]], o)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$4 = function (e, t, a) {
  switch (e.op) {
    case "Fill":
      var r = getParamValue("shape", e, t, a),
          n = getParamValue("dtype", e, t, a),
          s = getParamValue("value", e, t, a);
      return [(0, _tfjsCore.fill)(r, s, n)];

    case "LinSpace":
      var o = getParamValue("start", e, t, a),
          p = getParamValue("stop", e, t, a),
          u = getParamValue("num", e, t, a);
      return [(0, _tfjsCore.linspace)(o, p, u)];

    case "Multinomial":
      var i = getParamValue("logits", e, t, a),
          m = getParamValue("numSamples", e, t, a),
          l = getParamValue("seed", e, t, a);
      return [(0, _tfjsCore.multinomial)(i, m, l)];

    case "OneHot":
      var c = getParamValue("indices", e, t, a),
          d = getParamValue("depth", e, t, a),
          y = getParamValue("onValue", e, t, a),
          f = getParamValue("offValue", e, t, a);
      return [(0, _tfjsCore.oneHot)(c, d, y, f)];

    case "Ones":
      return [(0, _tfjsCore.ones)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "OnesLike":
      return [(0, _tfjsCore.onesLike)(getParamValue("x", e, t, a))];

    case "RandomUniform":
      return [(0, _tfjsCore.randomUniform)(getParamValue("shape", e, t, a), getParamValue("minval", e, t, a), getParamValue("maxval", e, t, a), getParamValue("dtype", e, t, a))];

    case "Range":
      o = getParamValue("start", e, t, a);
      var g = getParamValue("stop", e, t, a),
          h = getParamValue("step", e, t, a);
      return [(0, _tfjsCore.range)(o, g, h, getParamValue("dtype", e, t, a))];

    case "TruncatedNormal":
      r = getParamValue("shape", e, t, a);
      var N = getParamValue("mean", e, t, a),
          x = getParamValue("stdDev", e, t, a);
      l = getParamValue("seed", e, t, a);
      return [(0, _tfjsCore.truncatedNormal)(r, N, x, getParamValue("dtype", e, t, a), l)];

    case "Zeros":
      return [(0, _tfjsCore.zeros)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "ZerosLike":
      return [(0, _tfjsCore.zerosLike)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
};

function executeOp$5(e, t, a) {
  return __awaiter(this, void 0, void 0, function () {
    var r, n, s, o, p;
    return __generator(this, function (u) {
      switch (u.label) {
        case 0:
          switch (e.op) {
            case "NonMaxSuppressionV3":
            case "NonMaxSuppressionV2":
              return [3, 1];

            case "Where":
              return [3, 3];

            case "ListDiff":
              return [3, 5];
          }

          return [3, 6];

        case 1:
          return r = getParamValue("boxes", e, t, a), n = getParamValue("scores", e, t, a), s = getParamValue("maxOutputSize", e, t, a), o = getParamValue("iouThreshold", e, t, a), p = getParamValue("scoreThreshold", e, t, a), [4, _tfjsCore.image.nonMaxSuppressionAsync(r, n, s, o, p)];

        case 2:
          return [2, [u.sent()]];

        case 3:
          return [4, (0, _tfjsCore.whereAsync)(getParamValue("condition", e, t, a))];

        case 4:
          return [2, [u.sent()]];

        case 5:
          return [2, (0, _tfjsCore.setdiff1dAsync)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

        case 6:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
}

var executeOp$6 = function (e, t, a) {
  switch (e.op) {
    case "TopKV2":
      var r = getParamValue("x", e, t, a),
          n = getParamValue("k", e, t, a),
          s = getParamValue("sorted", e, t, a),
          o = (0, _tfjsCore.topk)(r, n, s);
      return [o.values, o.indices];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$7 = function (e, t, a) {
  switch (e.op) {
    case "Const":
      return t[e.name];

    case "PlaceholderWithDefault":
      var r = getParamValue("default", e, t, a);
      return [getTensor(e.name, t, a) || r];

    case "Placeholder":
      return [getTensor(e.name, t, a)];

    case "Identity":
    case "StopGradient":
    case "FakeQuantWithMinMaxVars":
      return [getParamValue("x", e, t, a).clone()];

    case "IdentityN":
      return getParamValue("x", e, t, a).map(function (e) {
        return e.clone();
      });

    case "Snapshot":
      return [getParamValue("x", e, t, a).clone()];

    case "Shape":
      return [(0, _tfjsCore.tensor1d)(getParamValue("x", e, t, a).shape, "int32")];

    case "ShapeN":
      return getParamValue("x", e, t, a).map(function (e) {
        return (0, _tfjsCore.tensor1d)(e.shape);
      });

    case "Size":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).size, "int32")];

    case "Rank":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).rank, "int32")];

    case "NoOp":
      return [];

    case "Print":
      var n = getParamValue("x", e, t, a),
          s = getParamValue("data", e, t, a),
          o = getParamValue("message", e, t, a),
          p = getParamValue("summarize", e, t, a);
      console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."), console.log(o);

      for (var u = 0; u < s.length; u++) console.log(Array.prototype.slice.call(s[u].dataSync()).slice(0, p));

      return [n];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$8 = function (e, t, a) {
  switch (e.op) {
    case "ResizeBilinear":
      var r = getParamValue("images", e, t, a),
          n = getParamValue("size", e, t, a),
          s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeBilinear(r, [n[0], n[1]], s)];

    case "ResizeNearestNeighbor":
      r = getParamValue("images", e, t, a), n = getParamValue("size", e, t, a), s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeNearestNeighbor(r, [n[0], n[1]], s)];

    case "CropAndResize":
      var o = getParamValue("image", e, t, a),
          p = getParamValue("boxes", e, t, a),
          u = getParamValue("boxInd", e, t, a),
          i = getParamValue("cropSize", e, t, a),
          m = getParamValue("method", e, t, a),
          l = getParamValue("extrapolationValue", e, t, a);
      return [_tfjsCore.image.cropAndResize(o, p, u, i, m, l)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$9 = function (e, t, a) {
  switch (e.op) {
    case "Equal":
      return [(0, _tfjsCore.equal)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "NotEqual":
      return [(0, _tfjsCore.notEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Greater":
      return [(0, _tfjsCore.greater)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "GreaterEqual":
      return [(0, _tfjsCore.greaterEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Less":
      return [(0, _tfjsCore.less)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LessEqual":
      return [(0, _tfjsCore.lessEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalAnd":
      return [(0, _tfjsCore.logicalAnd)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalNot":
      return [(0, _tfjsCore.logicalNot)(getParamValue("a", e, t, a))];

    case "LogicalOr":
      return [(0, _tfjsCore.logicalOr)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Select":
      return [(0, _tfjsCore.where)(getParamValue("condition", e, t, a), getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$10 = function (e, t, a) {
  switch (e.op) {
    case "BatchMatMul":
    case "BatchMatMulV2":
    case "MatMul":
      return [(0, _tfjsCore.matMul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a), getParamValue("transposeA", e, t, a), getParamValue("transposeB", e, t, a))];

    case "Transpose":
      return [(0, _tfjsCore.transpose)(getParamValue("x", e, t, a), getParamValue("perm", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$11 = function (e, t, a) {
  switch (e.op) {
    case "FusedBatchNorm":
    case "FusedBatchNormV2":
    case "FusedBatchNormV3":
      return [(0, _tfjsCore.batchNorm)(getParamValue("x", e, t, a), getParamValue("mean", e, t, a), getParamValue("variance", e, t, a), getParamValue("offset", e, t, a), getParamValue("scale", e, t, a), getParamValue("epsilon", e, t, a))];

    case "LRN":
      return [(0, _tfjsCore.localResponseNormalization)(getParamValue("x", e, t, a), getParamValue("radius", e, t, a), getParamValue("bias", e, t, a), getParamValue("alpha", e, t, a), getParamValue("beta", e, t, a))];

    case "Softmax":
      return [(0, _tfjsCore.softmax)(getParamValue("x", e, t, a))];

    case "LogSoftmax":
      return [(0, _tfjsCore.logSoftmax)(getParamValue("x", e, t, a))];

    case "SparseToDense":
      return [(0, _tfjsCore.sparseToDense)(getParamValue("sparseIndices", e, t, a), getParamValue("outputShape", e, t, a), getParamValue("sparseValues", e, t, a), getParamValue("defaultValue", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$12 = function (e, t, a) {
  switch (e.op) {
    case "Max":
      var r = getParamValue("axis", e, t, a),
          n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.max)(getParamValue("x", e, t, a), r, n)];

    case "Mean":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.mean)(getParamValue("x", e, t, a), r, n)];

    case "Min":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.min)(getParamValue("x", e, t, a), r, n)];

    case "Sum":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.sum)(getParamValue("x", e, t, a), r, n)];

    case "All":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.all)(getParamValue("x", e, t, a), r, n)];

    case "Any":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.any)(getParamValue("x", e, t, a), r, n)];

    case "ArgMax":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMax)(getParamValue("x", e, t, a), r)];

    case "ArgMin":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMin)(getParamValue("x", e, t, a), r)];

    case "Prod":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), r, n)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$13 = function (e, t, a) {
  switch (e.op) {
    case "ConcatV2":
    case "Concat":
      var r = getParamValue("axis", e, t, a),
          n = getParamValue("tensors", e, t, a);
      return [(0, _tfjsCore.concat)(n, r)];

    case "GatherV2":
    case "Gather":
      r = getParamValue("axis", e, t, a);
      var s = getParamValue("x", e, t, a),
          o = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gather)(s, o.asType("int32"), r)];

    case "ReverseV2":
    case "Reverse":
      r = getParamValue("axis", e, t, a), s = getParamValue("x", e, t, a);
      return [(0, _tfjsCore.reverse)(s, r)];

    case "Slice":
      var p = getParamValue("begin", e, t, a),
          u = getParamValue("size", e, t, a);
      return [(0, _tfjsCore.slice)(getParamValue("x", e, t, a), p, u)];

    case "StridedSlice":
      p = getParamValue("begin", e, t, a);
      var i = getParamValue("end", e, t, a),
          m = getParamValue("strides", e, t, a),
          l = getParamValue("beginMask", e, t, a),
          c = getParamValue("endMask", e, t, a),
          d = getParamValue("ellipsisMask", e, t, a),
          y = getParamValue("newAxisMask", e, t, a),
          f = getParamValue("shrinkAxisMask", e, t, a),
          g = getParamValue("x", e, t, a);
      if (1 === p.length && g.shape.length > 1) for (var h = 1; h < g.shape.length; h++) p.push(0), i.push(g.shape[h]), m.push(m[0]);
      return [(0, _tfjsCore.stridedSlice)(g, p, i, m, l, c, d, y, f)];

    case "Pack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensors", e, t, a),
            s = n[0].shape,
            o = n[0].squeeze().shape,
            p = n.map(function (e) {
          var t = _tfjsCore.util.arraysEqual(e.shape, s);

          if (!t && !_tfjsCore.util.arraysEqual(e.squeeze().shape, o)) throw new Error("the input tensors shape does not match");
          return t ? e : e.reshape(s);
        });
        return [(0, _tfjsCore.stack)(p, r)];
      });

    case "Unpack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensor", e, t, a);
        return (0, _tfjsCore.unstack)(n, r);
      });

    case "Tile":
      var N = getParamValue("reps", e, t, a);
      return [(0, _tfjsCore.tile)(getParamValue("x", e, t, a), N)];

    case "Split":
    case "SplitV":
      r = getParamValue("axis", e, t, a);
      var x = getParamValue("numOrSizeSplits", e, t, a);
      return (0, _tfjsCore.split)(getParamValue("x", e, t, a), x, r);

    case "ScatterNd":
      o = getParamValue("indices", e, t, a);
      var V = getParamValue("values", e, t, a),
          P = getParamValue("shape", e, t, a);
      return [(0, _tfjsCore.scatterND)(o, V, P)];

    case "GatherNd":
      var b = getParamValue("x", e, t, a);
      o = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gatherND)(b, o)];

    case "SparseToDense":
      o = getParamValue("sparseIndices", e, t, a), P = getParamValue("outputShape", e, t, a);
      var T = getParamValue("sparseValues", e, t, a),
          O = getParamValue("defaultValue", e, t, a);
      return [(0, _tfjsCore.sparseToDense)(o, T, P, T.dtype === O.dtype ? O : O.asType(T.dtype))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$14 = function (e, t, a) {
  switch (e.op) {
    case "FFT":
      return [(0, _tfjsCore.fft)(getParamValue("x", e, t, a))];

    case "IFFT":
      return [(0, _tfjsCore.ifft)(getParamValue("x", e, t, a))];

    case "RFFT":
      return [(0, _tfjsCore.rfft)(getParamValue("x", e, t, a))];

    case "IRFFT":
      return [(0, _tfjsCore.irfft)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$15 = function (e, t, a) {
  switch (e.op) {
    case "Cast":
      return [(0, _tfjsCore.cast)(getParamValue("x", e, t, a), getParamValue("dtype", e, t, a))];

    case "ExpandDims":
      var r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.expandDims)(getParamValue("x", e, t, a), r)];

    case "Squeeze":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.squeeze)(getParamValue("x", e, t, a), r)];

    case "Reshape":
      return [(0, _tfjsCore.reshape)(getParamValue("x", e, t, a), getParamValue("shape", e, t, a))];

    case "PadV2":
    case "Pad":
      return [(0, _tfjsCore.pad)(getParamValue("x", e, t, a), split$1(getParamValue("padding", e, t, a), 2), getParamValue("constantValue", e, t, a))];

    case "SpaceToBatchND":
      var n = getParamValue("blockShape", e, t, a),
          s = split$1(getParamValue("paddings", e, t, a), 2);
      return [(0, _tfjsCore.spaceToBatchND)(getParamValue("x", e, t, a), n, s)];

    case "BatchToSpaceND":
      n = getParamValue("blockShape", e, t, a);
      var o = split$1(getParamValue("crops", e, t, a), 2);
      return [(0, _tfjsCore.batchToSpaceND)(getParamValue("x", e, t, a), n, o)];

    case "DepthToSpace":
      var p = getParamValue("blockSize", e, t, a),
          u = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthToSpace)(getParamValue("x", e, t, a), p, u)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
};

function executeOp$16(e, t, a) {
  var r = function (e, t, a) {
    switch (e.category) {
      case "arithmetic":
        return executeOp(e, t, a);

      case "basic_math":
        return executeOp$1(e, t, a);

      case "control":
        return executeOp$2(e, t, a);

      case "convolution":
        return executeOp$3(e, t, a);

      case "creation":
        return executeOp$4(e, t, a);

      case "dynamic":
        return executeOp$5(e, t, a);

      case "evaluation":
        return executeOp$6(e, t, a);

      case "image":
        return executeOp$8(e, t, a);

      case "graph":
        return executeOp$7(e, t, a);

      case "logical":
        return executeOp$9(e, t, a);

      case "matrices":
        return executeOp$10(e, t, a);

      case "normalization":
        return executeOp$11(e, t, a);

      case "reduction":
        return executeOp$12(e, t, a);

      case "slice_join":
        return executeOp$13(e, t, a);

      case "spectral":
        return executeOp$14(e, t, a);

      case "transformation":
        return executeOp$15(e, t, a);

      case "custom":
        var r = getRegisteredOp(e.op);
        if (r && r.customExecutor) return r.customExecutor(new NodeValueImpl(e, t, a));
        throw TypeError("Custom op " + e.op + " is not registered.");

      default:
        throw TypeError("Unknown op '" + e.op + "'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()");
    }
  }(e, t, a);

  return r instanceof Promise ? r.then(function (e) {
    return [].concat(e);
  }) : [].concat(r);
}

var ExecutionContext = function () {
  function e(e, t) {
    this.weightMap = e, this.tensorArrayMap = t, this.rootContext = {
      id: 0,
      frameName: "",
      iterationId: 0
    }, this.contexts = [this.rootContext], this.lastId = 0, this.generateCurrentContextIds();
  }

  return e.prototype.newFrame = function (e, t) {
    return {
      id: e,
      frameName: t,
      iterationId: 0
    };
  }, Object.defineProperty(e.prototype, "currentContext", {
    get: function () {
      return this.contexts;
    },
    set: function (e) {
      this.contexts !== e && (this.contexts = e, this.generateCurrentContextIds());
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextId", {
    get: function () {
      return this._currentContextIds[0];
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextIds", {
    get: function () {
      return this._currentContextIds;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.generateCurrentContextIds = function () {
    for (var e = [], t = 0; t < this.contexts.length - 1; t++) {
      var a = this.contexts.slice(0, this.contexts.length - t);
      e.push(this.contextIdforContexts(a));
    }

    e.push(""), this._currentContextIds = e;
  }, e.prototype.contextIdforContexts = function (e) {
    return e ? e.map(function (e) {
      return 0 === e.id && 0 === e.iterationId ? "" : e.frameName + "-" + e.iterationId;
    }).join("/") : "";
  }, e.prototype.enterFrame = function (e) {
    this.contexts && (this.lastId++, this.contexts = this.contexts.slice(), this.contexts.push(this.newFrame(this.lastId, e)), this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)));
  }, e.prototype.exitFrame = function () {
    if (!(this.contexts && this.contexts.length > 1)) throw new Error("Cannot exit frame, the context is empty");
    this.contexts = this.contexts.slice(), this.contexts.splice(-1), this.currentContextIds.shift();
  }, e.prototype.nextIteration = function () {
    if (!(this.contexts && this.contexts.length > 0)) throw new Error("Cannot increase frame iteration, the context is empty");
    this.contexts = this.contexts.slice(), this.lastId++;
    var e = Object.assign({}, this.contexts[this.contexts.length - 1]);
    e.iterationId += 1, e.id = this.lastId, this.contexts.splice(-1, 1, e), this._currentContextIds.splice(0, 1, this.contextIdforContexts(this.contexts));
  }, e.prototype.getWeight = function (e) {
    return this.weightMap[e];
  }, e.prototype.addTensorArray = function (e) {
    this.tensorArrayMap[e.id] = e;
  }, e.prototype.getTensorArray = function (e) {
    return this.tensorArrayMap[e];
  }, e;
}();

function getExecutionSubgraph(e, t, a) {
  for (var r = new Set(), n = [], s = null, o = null, p = new Set(), u = t.slice(); u.length > 0;) {
    var i = u.pop();
    (isControlFlow(i) || isDynamicShape(i)) && null == s && (o = (s = i).children.map(function (e) {
      return e.name;
    }).filter(function (e) {
      return r.has(e);
    })), r.add(i.name), null == a[i.name] && null == e[i.name] && (0 !== i.inputs.length ? i.inputs.forEach(function (e) {
      p.has(e.name) || (p.add(e.name), u.push(e));
    }) : n.push(i.name));
  }

  return {
    inputs: e,
    outputs: t,
    usedNodes: r,
    missingInputs: n,
    dynamicNode: s,
    syncInputs: o
  };
}

function getNodesInTopologicalOrder(e, t, a) {
  var r = a.usedNodes,
      n = a.inputs,
      s = [];
  Object.keys(n).map(function (t) {
    return e.nodes[t];
  }).forEach(function (e) {
    r.has(e.name) && s.push(e);
  }), e.weights.forEach(function (e) {
    r.has(e.name) && s.push(e);
  });

  for (var o = new Set(), p = []; s.length > 0;) {
    var u = s.pop();
    o.add(u.name), t[u.name] || p.push(u), u.children.forEach(function (e) {
      !o.has(e.name) && r.has(e.name) && e.inputs.every(function (e) {
        return o.has(e.name);
      }) && s.push(e);
    });
  }

  return p;
}

var CONTROL_FLOW_OPS = ["Switch", "Merge", "Enter", "Exit", "NextIteration"],
    DYNAMIC_SHAPE_OPS = ["NonMaxSuppressionV2", "NonMaxSuppressionV3", "Where"];

function isControlFlow(e) {
  return CONTROL_FLOW_OPS.indexOf(e.op) >= 0;
}

function isDynamicShape(e) {
  return DYNAMIC_SHAPE_OPS.indexOf(e.op) >= 0;
}

var GraphExecutor = function () {
  function e(e) {
    this.graph = e, this.compiledMap = new Map(), this._weightMap = {}, this.SEPERATOR = ",", this.placeholders = e.placeholders, this._outputs = e.outputs;
  }

  return Object.defineProperty(e.prototype, "weightMap", {
    get: function () {
      return this._weightMap;
    },
    set: function (e) {
      var t = Object.keys(e).map(function (t) {
        return e[t].map(function (e) {
          return e.id;
        });
      });
      this.weightIds = [].concat.apply([], t), this._weightMap = e;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this.placeholders.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this._outputs.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this.placeholders.map(function (e) {
        return e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this.outputs.map(function (e) {
        return e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.getCompilationKey = function (e, t) {
    var a = e.map(function (e) {
      return e.name;
    }).sort(),
        r = t.map(function (e) {
      return e.name;
    }).sort();
    return a.join(this.SEPERATOR) + "--" + r.join(this.SEPERATOR);
  }, e.prototype.compile = function (e, t) {
    var a = getExecutionSubgraph(e, t, this.weightMap),
        r = a.missingInputs,
        n = a.dynamicNode,
        s = a.syncInputs;
    if (null != n) throw new Error("This execution contains the node '" + n.name + "', which has the dynamic op '" + n.op + "'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [" + s + "]");

    if (r.length > 0) {
      var o = t.map(function (e) {
        return e.name;
      }),
          p = Object.keys(e);
      throw new Error("Cannot compute the outputs [" + o + "] from the provided inputs [" + p + "]. Missing the following inputs: [" + r + "]");
    }

    return getNodesInTopologicalOrder(this.graph, this.weightMap, a);
  }, e.prototype.execute = function (e, t) {
    var a = this,
        r = Object.keys(e).sort();
    this.checkInputs(e), this.checkInputShapeAndType(e), this.checkOutputs(t);
    var n = r.map(function (e) {
      return a.graph.nodes[e];
    }),
        s = t.map(function (e) {
      return a.graph.nodes[parseNodeName(e)[0]];
    }),
        o = this.getCompilationKey(n, s),
        p = this.compiledMap.get(o);
    null == p && (p = this.compile(e, s), this.compiledMap.set(o, p));
    var u = {};
    return (0, _tfjsCore.tidy)(function () {
      var r = new ExecutionContext(a._weightMap, u),
          n = __assign({}, a.weightMap);

      Object.keys(e).forEach(function (t) {
        n[t] = [e[t]];
      });

      for (var s = a.getFrozenTensorIds(n), o = {}, i = 0; i < p.length; i++) {
        var m = p[i];

        if (!n[m.name]) {
          var l = executeOp$16(m, n, r);
          if (l instanceof Promise) throw new Error("The execution of the op '" + m.op + "' returned a promise. Please use model.executeAsync() instead.");
          n[m.name] = l, a.checkTensorForDisposal(m.name, m, n, r, s, t, o);
        }
      }

      return t.map(function (e) {
        return getTensor(e, n, r);
      });
    });
  }, e.prototype.getFrozenTensorIds = function (e) {
    var t = [].concat.apply([], Object.keys(e).map(function (t) {
      return e[t];
    }).map(function (e) {
      return e.map(function (e) {
        return e.id;
      });
    }));
    return new Set(t);
  }, e.prototype.checkTensorForDisposal = function (e, t, a, r, n, s, o) {
    "control" !== t.category && -1 === s.indexOf(e) && (a[e].forEach(function (e) {
      null != e && (o[e.id] = (o[e.id] || 0) + t.children.length);
    }), t.inputs.forEach(function (e) {
      if ("control" !== e.category) {
        var t = getTensorsForCurrentContenxt(e.name, a, r);
        null != t && t.forEach(function (e) {
          if (e && !n.has(e.id)) {
            var t = o[e.id];
            1 === t ? (e.dispose(), delete o[e.id]) : null != t && o[e.id]--;
          }
        });
      }
    }));
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a,
          r,
          n,
          s,
          o,
          p,
          u = this;
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            return this.checkInputs(e), this.checkInputShapeAndType(e), this.checkOutputs(t), a = {}, r = new ExecutionContext(this._weightMap, a), [4, this.executeWithControlFlow(e, r, t)];

          case 1:
            return n = i.sent(), s = t.map(function (e) {
              return getTensor(e, n, r);
            }), o = new Set(s.map(function (e) {
              return e.id;
            })), p = new Set(Object.keys(e).map(function (t) {
              return e[t].id;
            })), Object.keys(n).forEach(function (e) {
              n[e].forEach(function (e) {
                !e || e.isDisposed || o.has(e.id) || p.has(e.id) || -1 !== u.weightIds.indexOf(e.id) || e.dispose();
              });
            }), [2, s];
        }
      });
    });
  }, e.prototype.executeWithControlFlow = function (e, t, a) {
    return __awaiter(this, void 0, void 0, function () {
      var r,
          n,
          s,
          o,
          p,
          u,
          i,
          m,
          l,
          c,
          d,
          y,
          f,
          g,
          h,
          N,
          x = this;
      return __generator(this, function (V) {
        switch (V.label) {
          case 0:
            r = Object.keys(e), n = r.map(function (e) {
              return x.graph.nodes[e];
            }), s = a.map(function (e) {
              return x.graph.nodes[parseNodeName(e)[0]];
            }), o = getExecutionSubgraph(e, s, this.weightMap), p = o.usedNodes, u = o.missingInputs, i = o.dynamicNode, m = o.syncInputs, l = n.concat(this.graph.weights).map(function (e) {
              return {
                node: e,
                contexts: t.currentContext
              };
            }), c = __assign({}, this.weightMap), Object.keys(e).forEach(function (t) {
              c[t] = [e[t]];
            }), d = {}, y = this.getFrozenTensorIds(c), f = {}, V.label = 1;

          case 1:
            return l.length > 0 ? (g = this.processStack(n, l, t, c, f, y, a, d, p), [4, Promise.all(g)]) : [3, 3];

          case 2:
            return V.sent(), [3, 1];

          case 3:
            if (null == i && console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead."), (h = s.filter(function (e) {
              return !isControlFlow(e) && !getTensor(e.name, c, t);
            }).map(function (e) {
              return e.name;
            })).length > 0) throw N = "", null != i && (N = "Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [" + m + "]"), new Error("Cannot compute the outputs [" + h + "] from the provided inputs [" + r + "]. Consider providing the following inputs: [" + u + "]. " + N);
            return [2, c];
        }
      });
    });
  }, e.prototype.processStack = function (e, t, a, r, n, s, o, p, u) {
    for (var i = this, m = [], l = function () {
      var l = t.pop();
      a.currentContext = l.contexts;
      var d = "";

      if ("Enter" === l.node.op && getParamValue("isConstant", l.node, r, a) && (d = getNodeNameAndIndex(l.node.name, a)[0]), -1 === e.indexOf(l.node)) {
        var y = executeOp$16(l.node, r, a);
        d || (d = getNodeNameAndIndex(l.node.name, a)[0]);
        var f = a.currentContext;
        y instanceof Promise ? m.push(y.then(function (e) {
          return r[d] = e, a.currentContext = f, i.checkTensorForDisposal(d, l.node, r, a, s, o, p), i.processChildNodes(l.node, t, a, r, n, u), e;
        })) : (r[d] = y, c.checkTensorForDisposal(d, l.node, r, a, s, o, p), c.processChildNodes(l.node, t, a, r, n, u));
      } else c.processChildNodes(l.node, t, a, r, n, u);
    }, c = this; t.length > 0;) l();

    return m;
  }, e.prototype.processChildNodes = function (e, t, a, r, n, s) {
    e.children.forEach(function (e) {
      var o = getNodeNameAndIndex(e.name, a)[0];
      !n[o] && s.has(e.name) && ("Merge" === e.op ? e.inputNames.some(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })) : e.inputNames.every(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })));
    });
  }, e.prototype.dispose = function () {
    var e = this;
    Object.keys(this.weightMap).forEach(function (t) {
      return e.weightMap[t].forEach(function (e) {
        return e.dispose();
      });
    });
  }, e.prototype.checkInputShapeAndType = function (e) {
    var t = this;
    Object.keys(e).forEach(function (a) {
      var r = e[a],
          n = t.graph.nodes[a];

      if (n.attrParams.shape && n.attrParams.shape.value) {
        var s = n.attrParams.shape.value,
            o = s.length === r.shape.length && r.shape.every(function (e, t) {
          return -1 === s[t] || s[t] === e;
        });

        _tfjsCore.util.assert(o, function () {
          return "The shape of dict['" + n.name + "'] provided in model.execute(dict) must be [" + s + "], but was [" + r.shape + "]";
        });
      }

      n.attrParams.dtype && n.attrParams.dtype.value && _tfjsCore.util.assert(r.dtype === n.attrParams.dtype.value, function () {
        return "The dtype of dict['" + n.name + "'] provided in model.execute(dict) must be " + n.attrParams.dtype.value + ", but was " + r.dtype;
      });
    });
  }, e.prototype.checkInputs = function (e) {
    var t = this,
        a = Object.keys(e).filter(function (e) {
      return !t.graph.nodes[e];
    });
    if (a.length > 0) throw new Error("The dict provided in model.execute(dict) has keys: [" + a + "] that are not part of graph");
  }, e.prototype.checkOutputs = function (e) {
    var t = this;
    e.forEach(function (e) {
      var a = parseNodeName(e)[0];
      if (!t.graph.nodes[a]) throw new Error("The output '" + e + "' is not found in the graph");
    });
  }, e;
}(),
    TFHUB_SEARCH_PARAM = "?tfjs-format=file",
    DEFAULT_MODEL_NAME = "model.json",
    GraphModel = function () {
  function e(e, t) {
    void 0 === t && (t = {}), this.modelUrl = e, this.loadOptions = t, this.version = "n/a", null == t && (this.loadOptions = {});
  }

  return Object.defineProperty(e.prototype, "modelVersion", {
    get: function () {
      return this.version;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this.executor.inputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this.executor.outputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this.executor.inputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this.executor.outputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "weights", {
    get: function () {
      return this.executor.weightMap;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.findIOHandler = function () {
    var e = this.modelUrl;
    if (null != e.load) this.handler = e;else if (null != this.loadOptions.requestInit) this.handler = _tfjsCore.io.browserHTTPRequest(e, this.loadOptions);else {
      var t = _tfjsCore.io.getLoadHandlers(e, this.loadOptions.onProgress);

      if (0 === t.length) t.push(_tfjsCore.io.browserHTTPRequest(e, this.loadOptions));else if (t.length > 1) throw new Error("Found more than one (" + t.length + ") load handlers for URL '" + [e] + "'");
      this.handler = t[0];
    }
  }, e.prototype.load = function () {
    return __awaiter(this, void 0, void 0, function () {
      var e, t, a;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            if (this.findIOHandler(), null == this.handler.load) throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");
            return [4, this.handler.load()];

          case 1:
            return e = r.sent(), t = e.modelTopology, this.version = t.versions.producer + "." + t.versions.minConsumer, a = _tfjsCore.io.decodeWeights(e.weightData, e.weightSpecs), this.executor = new GraphExecutor(OperationMapper.Instance.transformGraph(t)), this.executor.weightMap = this.convertTensorMapToTensorsMap(a), [2, !0];
        }
      });
    });
  }, e.prototype.predict = function (e, t) {
    return this.execute(e, this.outputNodes);
  }, e.prototype.normalizeInputs = function (e) {
    if (!(e instanceof _tfjsCore.Tensor || Array.isArray(e))) return e;
    if ((e = Array.isArray(e) ? e : [e]).length !== this.inputNodes.length) throw new Error("Input tensor count mismatch,the graph model has " + this.inputNodes.length + " placeholders, while there are " + e.length + " input tensors.");
    return this.inputNodes.reduce(function (t, a, r) {
      return t[a] = e[r], t;
    }, {});
  }, e.prototype.normalizeOutputs = function (e) {
    return e = e || this.outputNodes, Array.isArray(e) ? e : [e];
  }, e.prototype.execute = function (e, t) {
    e = this.normalizeInputs(e), t = this.normalizeOutputs(t);
    var a = this.executor.execute(e, t);
    return a.length > 1 ? a : a[0];
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            return e = this.normalizeInputs(e), t = this.normalizeOutputs(t), [4, this.executor.executeAsync(e, t)];

          case 1:
            return [2, (a = r.sent()).length > 1 ? a : a[0]];
        }
      });
    });
  }, e.prototype.convertTensorMapToTensorsMap = function (e) {
    return Object.keys(e).reduce(function (t, a) {
      return t[a] = [e[a]], t;
    }, {});
  }, e.prototype.dispose = function () {
    this.executor.dispose();
  }, e;
}();

exports.GraphModel = GraphModel;

function loadGraphModel(e, t) {
  return void 0 === t && (t = {}), __awaiter(this, void 0, void 0, function () {
    var a;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (null == e) throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");
          return null == t && (t = {}), t.fromTFHub && null == e.load && (e.endsWith("/") || (e += "/"), e = "" + e + DEFAULT_MODEL_NAME + TFHUB_SEARCH_PARAM), [4, (a = new GraphModel(e, t)).load()];

        case 1:
          return r.sent(), [2, a];
      }
    });
  });
}

var version = "1.2.11";
exports.version_converter = version;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow-models/body-pix/dist/body-pix.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.blurBodyPart = blurBodyPart;
exports.drawBokehEffect = drawBokehEffect;
exports.drawMask = drawMask;
exports.drawPixelatedMask = drawPixelatedMask;
exports.toColoredPartMask = toColoredPartMask;
exports.toMask = toMask;
exports.flipPoseHorizontal = flipPoseHorizontal;
exports.resizeAndPadTo = resizeAndPadTo;
exports.scaleAndCropToInputTensorShape = scaleAndCropToInputTensorShape;
exports.PART_CHANNELS = exports.BodyPix = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-core"));

var _tfjsConverter = require("@tensorflow/tfjs-converter");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
    * @license
    * Copyright 2019 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */
var extendStatics = function (e, t) {
  return (extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
  })(e, t);
};

function __extends(e, t) {
  function n() {
    this.constructor = e;
  }

  extendStatics(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}

var __assign = function () {
  return (__assign = Object.assign || function (e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);

    return e;
  }).apply(this, arguments);
};

function __awaiter(e, t, n, r) {
  return new (n || (n = Promise))(function (o, i) {
    function a(e) {
      try {
        d(r.next(e));
      } catch (e) {
        i(e);
      }
    }

    function s(e) {
      try {
        d(r.throw(e));
      } catch (e) {
        i(e);
      }
    }

    function d(e) {
      e.done ? o(e.value) : new n(function (t) {
        t(e.value);
      }).then(a, s);
    }

    d((r = r.apply(e, t || [])).next());
  });
}

function __generator(e, t) {
  var n,
      r,
      o,
      i,
      a = {
    label: 0,
    sent: function () {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return i = {
    next: s(0),
    throw: s(1),
    return: s(2)
  }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
    return this;
  }), i;

  function s(i) {
    return function (s) {
      return function (i) {
        if (n) throw new TypeError("Generator is already executing.");

        for (; a;) try {
          if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;

          switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
            case 0:
            case 1:
              o = i;
              break;

            case 4:
              return a.label++, {
                value: i[1],
                done: !1
              };

            case 5:
              a.label++, r = i[1], i = [0];
              continue;

            case 7:
              i = a.ops.pop(), a.trys.pop();
              continue;

            default:
              if (!(o = (o = a.trys).length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
                a = 0;
                continue;
              }

              if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                a.label = i[1];
                break;
              }

              if (6 === i[0] && a.label < o[1]) {
                a.label = o[1], o = i;
                break;
              }

              if (o && a.label < o[2]) {
                a.label = o[2], a.ops.push(i);
                break;
              }

              o[2] && a.ops.pop(), a.trys.pop();
              continue;
          }

          i = t.call(e, a);
        } catch (e) {
          i = [6, e], r = 0;
        } finally {
          n = o = 0;
        }

        if (5 & i[0]) throw i[1];
        return {
          value: i[0] ? i[1] : void 0,
          done: !0
        };
      }([i, s]);
    };
  }
}

function toFlattenedOneHotPartMap(e) {
  var t = e.shape[2],
      n = e.argMax(2).reshape([-1]);
  return (0, tf.oneHot)(n, t);
}

function clipByMask2d(e, t) {
  return e.mul(t);
}

function toMaskTensor(e, t) {
  return (0, tf.tidy)(function () {
    return e.greater((0, tf.scalar)(t)).toInt();
  });
}

function decodePartSegmentation(e, t) {
  var n = t.shape,
      r = n[0],
      o = n[1],
      i = n[2];
  return (0, tf.tidy)(function () {
    var n = toFlattenedOneHotPartMap(t),
        a = (0, tf.range)(0, i, 1, "int32").expandDims(1);
    return clipByMask2d(n.matMul(a).toInt().reshape([r, o]).add((0, tf.scalar)(1, "int32")), e).sub((0, tf.scalar)(1, "int32"));
  });
}

function decodeOnlyPartSegmentation(e) {
  var t = e.shape,
      n = t[0],
      r = t[1],
      o = t[2];
  return (0, tf.tidy)(function () {
    var t = toFlattenedOneHotPartMap(e),
        i = (0, tf.range)(0, o, 1, "int32").expandDims(1);
    return t.matMul(i).toInt().reshape([n, r]);
  });
}

var BaseModel = function () {
  function e(e, t) {
    this.model = e, this.outputStride = t;
    var n = this.model.inputs[0].shape;
    tf.util.assert(-1 === n[1] && -1 === n[2], function () {
      return "Input shape [" + n[1] + ", " + n[2] + "] must both be equal to or -1";
    });
  }

  return e.prototype.predict = function (e) {
    var t = this;
    return (0, tf.tidy)(function () {
      var n = t.preprocessInput(e.toFloat()).expandDims(0),
          r = t.model.predict(n).map(function (e) {
        return e.squeeze([0]);
      }),
          o = t.nameOutputResults(r);
      return {
        heatmapScores: o.heatmap.sigmoid(),
        offsets: o.offsets,
        displacementFwd: o.displacementFwd,
        displacementBwd: o.displacementBwd,
        segmentation: o.segmentation,
        partHeatmaps: o.partHeatmaps,
        longOffsets: o.longOffsets,
        partOffsets: o.partOffsets
      };
    });
  }, e.prototype.dispose = function () {
    this.model.dispose();
  }, e;
}(),
    MobileNet = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }

  return __extends(t, e), t.prototype.preprocessInput = function (e) {
    return (0, tf.tidy)(function () {
      return (0, tf.div)(e, 127.5).sub(1);
    });
  }, t.prototype.nameOutputResults = function (e) {
    return {
      offsets: e[0],
      segmentation: e[1],
      partHeatmaps: e[2],
      longOffsets: e[3],
      heatmap: e[4],
      displacementFwd: e[5],
      displacementBwd: e[6],
      partOffsets: e[7]
    };
  }, t;
}(BaseModel),
    PART_NAMES = ["nose", "leftEye", "rightEye", "leftEar", "rightEar", "leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"],
    NUM_KEYPOINTS = PART_NAMES.length,
    PART_IDS = PART_NAMES.reduce(function (e, t, n) {
  return e[t] = n, e;
}, {}),
    CONNECTED_PART_NAMES = [["leftHip", "leftShoulder"], ["leftElbow", "leftShoulder"], ["leftElbow", "leftWrist"], ["leftHip", "leftKnee"], ["leftKnee", "leftAnkle"], ["rightHip", "rightShoulder"], ["rightElbow", "rightShoulder"], ["rightElbow", "rightWrist"], ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"], ["leftShoulder", "rightShoulder"], ["leftHip", "rightHip"]],
    POSE_CHAIN = [["nose", "leftEye"], ["leftEye", "leftEar"], ["nose", "rightEye"], ["rightEye", "rightEar"], ["nose", "leftShoulder"], ["leftShoulder", "leftElbow"], ["leftElbow", "leftWrist"], ["leftShoulder", "leftHip"], ["leftHip", "leftKnee"], ["leftKnee", "leftAnkle"], ["nose", "rightShoulder"], ["rightShoulder", "rightElbow"], ["rightElbow", "rightWrist"], ["rightShoulder", "rightHip"], ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"]],
    CONNECTED_PART_INDICES = CONNECTED_PART_NAMES.map(function (e) {
  var t = e[0],
      n = e[1];
  return [PART_IDS[t], PART_IDS[n]];
});

function getScale(e, t, n) {
  var r = e[0],
      o = e[1],
      i = t[0],
      a = t[1],
      s = n.top,
      d = n.bottom;
  return [a / (n.left + n.right + o), i / (s + d + r)];
}

function getOffsetPoint(e, t, n, r) {
  return {
    y: r.get(e, t, n),
    x: r.get(e, t, n + NUM_KEYPOINTS)
  };
}

function getImageCoords(e, t, n) {
  var r = getOffsetPoint(e.heatmapY, e.heatmapX, e.id, n),
      o = r.y,
      i = r.x;
  return {
    x: e.heatmapX * t + i,
    y: e.heatmapY * t + o
  };
}

function clamp(e, t, n) {
  return e < t ? t : e > n ? n : e;
}

function squaredDistance(e, t, n, r) {
  var o = n - e,
      i = r - t;
  return o * o + i * i;
}

function addVectors(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}

function computeDistance(e, t, n) {
  void 0 === n && (n = .3);

  for (var r = 0, o = 0, i = 0; i < e.length; i++) t.keypoints[i].score > n && (o += 1, r += Math.pow(e[i].x - t.keypoints[i].position.x, 2) + Math.pow(e[i].y - t.keypoints[i].position.y, 2));

  return 0 === o ? r = 1 / 0 : r /= o, r;
}

function convertToPositionInOuput(e, t, n, r) {
  var o = t[0],
      i = t[1],
      a = n[0],
      s = n[1],
      d = Math.round(((o + e.y + 1) * s - 1) / r);
  return {
    x: Math.round(((i + e.x + 1) * a - 1) / r),
    y: d
  };
}

function getEmbedding(e, t, n, r, o, i, a) {
  for (var s = a[0], d = a[1], u = n(e), l = u.y * r + u.x, f = o[NUM_KEYPOINTS * (2 * l) + t], c = o[NUM_KEYPOINTS * (2 * l + 1) + t], p = e.y + f, h = e.x + c, m = 0; m < i; m++) {
    p = Math.min(p, s - 1);
    var g = n({
      x: h = Math.min(h, d - 1),
      y: p
    }),
        v = g.y * r + g.x;
    p += f = o[NUM_KEYPOINTS * (2 * v) + t], h += c = o[NUM_KEYPOINTS * (2 * v + 1) + t];
  }

  return {
    x: h,
    y: p
  };
}

function matchEmbeddingToInstance(e, t, n, r, o, i, a, s, d, u) {
  for (var l = o[0], f = o[1], c = i[0], p = i[1], h = s[0], m = s[1], g = [], v = function (e) {
    return convertToPositionInOuput(e, [l, f], [c, p], d);
  }, S = 0; S < r; S++) {
    var _ = getEmbedding(e, S, v, a, t, u, [h, m]);

    g.push(_);
  }

  for (var w = -1, I = 1 / 0, E = 0; E < n.length; E++) {
    var T = computeDistance(g, n[E]);
    T < I && (w = E, I = T);
  }

  return w;
}

function getOutputResolution(e, t) {
  var n = e[0],
      r = e[1];
  return [Math.round((r - 1) / t + 1), Math.round((n - 1) / t + 1)];
}

function decodeMultipleMasksCPU(e, t, n, r, o, i, a, s, d, u) {
  var l = a[0],
      f = a[1];
  void 0 === u && (u = 5);

  for (var c = n.map(function (e) {
    return new Uint8Array(r * o).fill(0);
  }), p = s.top, h = s.left, m = getScale([r, o], [l, f], s), g = m[0], v = m[1], S = getOutputResolution([l, f], i)[0], _ = 0; _ < r; _ += 1) for (var w = 0; w < o; w += 1) {
    var I = _ * o + w;

    if (1 === e[I]) {
      var E = matchEmbeddingToInstance({
        x: w,
        y: _
      }, t, n, u, [p, h], [g, v], S, [r, o], i, d);
      E >= 0 && (c[E][I] = 1);
    }
  }

  return c;
}

function decodeMultiplePartMasksCPU(e, t, n, r, o, i, a, s, d, u, l) {
  var f = s[0],
      c = s[1];
  void 0 === l && (l = 5);

  for (var p = r.map(function (e) {
    return new Int32Array(o * i).fill(-1);
  }), h = d.top, m = d.left, g = getScale([o, i], [f, c], d), v = g[0], S = g[1], _ = getOutputResolution([f, c], a)[0], w = 0; w < o; w += 1) for (var I = 0; I < i; I += 1) {
    var E = w * i + I;

    if (1 === e[E]) {
      var T = matchEmbeddingToInstance({
        x: I,
        y: w
      }, t, r, l, [h, m], [v, S], _, [o, i], a, u);
      T >= 0 && (p[T][E] = n[E]);
    }
  }

  return p;
}

function decodeMultipleMasksWebGl(e, t, n, r, o, i, a, s, d, u, l) {
  for (var f = a[0], c = a[1], p = e.shape, h = p[0], m = p[1], g = t.shape.slice(0, 2), v = g[0], S = g[1], _ = t.reshape([v, S, 2, NUM_KEYPOINTS]), w = new Float32Array(l * NUM_KEYPOINTS * 3).fill(0), I = 0; I < n.length; I++) for (var E = I * NUM_KEYPOINTS * 3, T = n[I], A = 0; A < NUM_KEYPOINTS; A++) {
    var N = T.keypoints[A],
        P = E + 3 * A;
    w[P] = N.score, w[P + 1] = N.position.y, w[P + 2] = N.position.x;
  }

  var y = getScale([r, o], [f, c], s),
      O = y[0],
      M = y[1],
      b = (0, tf.tensor)(w, [l, NUM_KEYPOINTS, 3]),
      R = s.top,
      C = s.left,
      x = {
    variableNames: ["segmentation", "longOffsets", "poses"],
    outputShape: [h, m],
    userCode: "\n    int convertToPositionInOutput(int pos, int pad, float scale, int stride) {\n      return round(((float(pos + pad) + 1.0) * scale - 1.0) / float(stride));\n    }\n\n    float convertToPositionInOutputFloat(\n        int pos, int pad, float scale, int stride) {\n      return ((float(pos + pad) + 1.0) * scale - 1.0) / float(stride);\n    }\n\n    float dist(float x1, float y1, float x2, float y2) {\n      return pow(x1 - x2, 2.0) + pow(y1 - y2, 2.0);\n    }\n\n    float sampleLongOffsets(float h, float w, int d, int k) {\n      float fh = fract(h);\n      float fw = fract(w);\n      int clH = int(ceil(h));\n      int clW = int(ceil(w));\n      int flH = int(floor(h));\n      int flW = int(floor(w));\n      float o11 = getLongOffsets(flH, flW, d, k);\n      float o12 = getLongOffsets(flH, clW, d, k);\n      float o21 = getLongOffsets(clH, flW, d, k);\n      float o22 = getLongOffsets(clH, clW, d, k);\n      float o1 = mix(o11, o12, fw);\n      float o2 = mix(o21, o22, fw);\n      return mix(o1, o2, fh);\n    }\n\n    int findNearestPose(int h, int w) {\n      float prob = getSegmentation(h, w);\n      if (prob < 1.0) {\n        return -1;\n      }\n\n      // Done(Tyler): convert from output space h/w to strided space.\n      float stridedH = convertToPositionInOutputFloat(\n        h, " + R + ", " + M + ", " + i + ");\n      float stridedW = convertToPositionInOutputFloat(\n        w, " + C + ", " + O + ", " + i + ");\n\n      float minDist = 1000000.0;\n      int iMin = -1;\n      for (int i = 0; i < " + l + "; i++) {\n        float curDistSum = 0.0;\n        int numKpt = 0;\n        for (int k = 0; k < " + NUM_KEYPOINTS + "; k++) {\n          float dy = sampleLongOffsets(stridedH, stridedW, 0, k);\n          float dx = sampleLongOffsets(stridedH, stridedW, 1, k);\n\n          float y = float(h) + dy;\n          float x = float(w) + dx;\n\n          for (int s = 0; s < " + d + "; s++) {\n            int yRounded = round(min(y, float(" + (r - 1) + ")));\n            int xRounded = round(min(x, float(" + (o - 1) + ")));\n\n            float yStrided = convertToPositionInOutputFloat(\n              yRounded, " + R + ", " + M + ", " + i + ");\n            float xStrided = convertToPositionInOutputFloat(\n              xRounded, " + C + ", " + O + ", " + i + ");\n\n            float dy = sampleLongOffsets(yStrided, xStrided, 0, k);\n            float dx = sampleLongOffsets(yStrided, xStrided, 1, k);\n\n            y = y + dy;\n            x = x + dx;\n          }\n\n          float poseScore = getPoses(i, k, 0);\n          float poseY = getPoses(i, k, 1);\n          float poseX = getPoses(i, k, 2);\n          if (poseScore > " + u + ") {\n            numKpt = numKpt + 1;\n            curDistSum = curDistSum + dist(x, y, poseX, poseY);\n          }\n        }\n        if (numKpt > 0 && curDistSum / float(numKpt) < minDist) {\n          minDist = curDistSum / float(numKpt);\n          iMin = i;\n        }\n      }\n      return iMin;\n    }\n\n    void main() {\n        ivec2 coords = getOutputCoords();\n        int nearestPose = findNearestPose(coords[0], coords[1]);\n        setOutput(float(nearestPose));\n      }\n  "
  };
  return (0, tf.backend)().compileAndRun(x, [e, _, b]);
}

function toPersonKSegmentation(e, t) {
  return (0, tf.tidy)(function () {
    return e.equal((0, tf.scalar)(t)).toInt();
  });
}

function toPersonKPartSegmentation(e, t, n) {
  return (0, tf.tidy)(function () {
    return e.equal((0, tf.scalar)(n)).toInt().mul(t.add(1)).sub(1);
  });
}

function isWebGlBackend() {
  return "webgl" === (0, tf.getBackend)();
}

function decodePersonInstanceMasks(e, t, n, r, o, i, a, s, d, u, l, f) {
  var c = a[0],
      p = a[1];
  return void 0 === d && (d = .2), void 0 === u && (u = 8), void 0 === l && (l = .3), void 0 === f && (f = 10), __awaiter(this, void 0, void 0, function () {
    var a, h, m, g, v;
    return __generator(this, function (S) {
      switch (S.label) {
        case 0:
          return a = n.filter(function (e) {
            return e.score >= d;
          }), isWebGlBackend() ? (m = (0, tf.tidy)(function () {
            var n = decodeMultipleMasksWebGl(e, t, a, r, o, i, [c, p], s, u, l, f);
            return a.map(function (e, t) {
              return toPersonKSegmentation(n, t);
            });
          }), [4, Promise.all(m.map(function (e) {
            return e.data();
          }))]) : [3, 2];

        case 1:
          return h = S.sent(), m.forEach(function (e) {
            return e.dispose();
          }), [3, 5];

        case 2:
          return [4, e.data()];

        case 3:
          return g = S.sent(), [4, t.data()];

        case 4:
          v = S.sent(), h = decodeMultipleMasksCPU(g, v, a, r, o, i, [c, p], s, u), S.label = 5;

        case 5:
          return [2, h.map(function (e, t) {
            return {
              data: e,
              pose: a[t],
              width: o,
              height: r
            };
          })];
      }
    });
  });
}

function decodePersonInstancePartMasks(e, t, n, r, o, i, a, s, d, u, l, f, c) {
  var p = s[0],
      h = s[1];
  return void 0 === u && (u = .2), void 0 === l && (l = 8), void 0 === f && (f = .3), void 0 === c && (c = 10), __awaiter(this, void 0, void 0, function () {
    var s, m, g, v, S, _;

    return __generator(this, function (w) {
      switch (w.label) {
        case 0:
          return s = r.filter(function (e) {
            return e.score >= u;
          }), isWebGlBackend() ? (g = (0, tf.tidy)(function () {
            var r = decodeMultipleMasksWebGl(e, t, s, o, i, a, [p, h], d, l, f, c);
            return s.map(function (e, t) {
              return toPersonKPartSegmentation(r, n, t);
            });
          }), [4, Promise.all(g.map(function (e) {
            return e.data();
          }))]) : [3, 2];

        case 1:
          return m = w.sent(), g.forEach(function (e) {
            return e.dispose();
          }), [3, 6];

        case 2:
          return [4, e.data()];

        case 3:
          return v = w.sent(), [4, t.data()];

        case 4:
          return S = w.sent(), [4, n.data()];

        case 5:
          _ = w.sent(), m = decodeMultiplePartMasksCPU(v, S, _, s, o, i, a, [p, h], d, l), w.label = 6;

        case 6:
          return [2, m.map(function (e, t) {
            return {
              pose: s[t],
              data: e,
              height: o,
              width: i
            };
          })];
      }
    });
  });
}

function half(e) {
  return Math.floor(e / 2);
}

var MaxHeap = function () {
  function e(e, t) {
    this.priorityQueue = new Array(e), this.numberOfElements = -1, this.getElementValue = t;
  }

  return e.prototype.enqueue = function (e) {
    this.priorityQueue[++this.numberOfElements] = e, this.swim(this.numberOfElements);
  }, e.prototype.dequeue = function () {
    var e = this.priorityQueue[0];
    return this.exchange(0, this.numberOfElements--), this.sink(0), this.priorityQueue[this.numberOfElements + 1] = null, e;
  }, e.prototype.empty = function () {
    return -1 === this.numberOfElements;
  }, e.prototype.size = function () {
    return this.numberOfElements + 1;
  }, e.prototype.all = function () {
    return this.priorityQueue.slice(0, this.numberOfElements + 1);
  }, e.prototype.max = function () {
    return this.priorityQueue[0];
  }, e.prototype.swim = function (e) {
    for (; e > 0 && this.less(half(e), e);) this.exchange(e, half(e)), e = half(e);
  }, e.prototype.sink = function (e) {
    for (; 2 * e <= this.numberOfElements;) {
      var t = 2 * e;
      if (t < this.numberOfElements && this.less(t, t + 1) && t++, !this.less(e, t)) break;
      this.exchange(e, t), e = t;
    }
  }, e.prototype.getValueAt = function (e) {
    return this.getElementValue(this.priorityQueue[e]);
  }, e.prototype.less = function (e, t) {
    return this.getValueAt(e) < this.getValueAt(t);
  }, e.prototype.exchange = function (e, t) {
    var n = this.priorityQueue[e];
    this.priorityQueue[e] = this.priorityQueue[t], this.priorityQueue[t] = n;
  }, e;
}();

function scoreIsMaximumInLocalWindow(e, t, n, r, o, i) {
  for (var a = i.shape, s = a[0], d = a[1], u = !0, l = Math.max(n - o, 0), f = Math.min(n + o + 1, s), c = l; c < f; ++c) {
    for (var p = Math.max(r - o, 0), h = Math.min(r + o + 1, d), m = p; m < h; ++m) if (i.get(c, m, e) > t) {
      u = !1;
      break;
    }

    if (!u) break;
  }

  return u;
}

function buildPartWithScoreQueue(e, t, n) {
  for (var r = n.shape, o = r[0], i = r[1], a = r[2], s = new MaxHeap(o * i * a, function (e) {
    return e.score;
  }), d = 0; d < o; ++d) for (var u = 0; u < i; ++u) for (var l = 0; l < a; ++l) {
    var f = n.get(d, u, l);
    f < e || scoreIsMaximumInLocalWindow(l, f, d, u, t, n) && s.enqueue({
      score: f,
      part: {
        heatmapY: d,
        heatmapX: u,
        id: l
      }
    });
  }

  return s;
}

var parentChildrenTuples = POSE_CHAIN.map(function (e) {
  var t = e[0],
      n = e[1];
  return [PART_IDS[t], PART_IDS[n]];
}),
    parentToChildEdges = parentChildrenTuples.map(function (e) {
  return e[1];
}),
    childToParentEdges = parentChildrenTuples.map(function (e) {
  return e[0];
});

function getDisplacement(e, t, n) {
  var r = n.shape[2] / 2;
  return {
    y: n.get(t.y, t.x, e),
    x: n.get(t.y, t.x, r + e)
  };
}

function getStridedIndexNearPoint(e, t, n, r) {
  return {
    y: clamp(Math.round(e.y / t), 0, n - 1),
    x: clamp(Math.round(e.x / t), 0, r - 1)
  };
}

function traverseToTargetKeypoint(e, t, n, r, o, i, a, s) {
  void 0 === s && (s = 2);

  for (var d = r.shape, u = d[0], l = d[1], f = getDisplacement(e, getStridedIndexNearPoint(t.position, i, u, l), a), c = addVectors(t.position, f), p = 0; p < s; p++) {
    var h = getStridedIndexNearPoint(c, i, u, l),
        m = getOffsetPoint(h.y, h.x, n, o);
    c = addVectors({
      x: h.x * i,
      y: h.y * i
    }, {
      x: m.x,
      y: m.y
    });
  }

  var g = getStridedIndexNearPoint(c, i, u, l),
      v = r.get(g.y, g.x, n);
  return {
    position: c,
    part: PART_NAMES[n],
    score: v
  };
}

function decodePose(e, t, n, r, o, i) {
  var a = t.shape[2],
      s = parentToChildEdges.length,
      d = new Array(a),
      u = e.part,
      l = e.score,
      f = getImageCoords(u, r, n);
  d[u.id] = {
    score: l,
    part: PART_NAMES[u.id],
    position: f
  };

  for (var c = s - 1; c >= 0; --c) {
    var p = parentToChildEdges[c],
        h = childToParentEdges[c];
    d[p] && !d[h] && (d[h] = traverseToTargetKeypoint(c, d[p], h, t, n, r, i));
  }

  for (c = 0; c < s; ++c) {
    p = childToParentEdges[c], h = parentToChildEdges[c];
    d[p] && !d[h] && (d[h] = traverseToTargetKeypoint(c, d[p], h, t, n, r, o));
  }

  return d;
}

function withinNmsRadiusOfCorrespondingPoint(e, t, n, r) {
  var o = n.x,
      i = n.y;
  return e.some(function (e) {
    var n = e.keypoints[r].position;
    return squaredDistance(i, o, n.y, n.x) <= t;
  });
}

function getInstanceScore(e, t, n) {
  return n.reduce(function (n, r, o) {
    var i = r.position,
        a = r.score;
    return withinNmsRadiusOfCorrespondingPoint(e, t, i, o) || (n += a), n;
  }, 0) / n.length;
}

var kLocalMaximumRadius = 1;

function decodeMultiplePoses(e, t, n, r, o, i, a, s) {
  void 0 === a && (a = .5), void 0 === s && (s = 20);

  for (var d = [], u = buildPartWithScoreQueue(a, kLocalMaximumRadius, e), l = s * s; d.length < i && !u.empty();) {
    var f = u.dequeue();

    if (!withinNmsRadiusOfCorrespondingPoint(d, l, getImageCoords(f.part, o, t), f.part.id)) {
      var c = decodePose(f, e, t, o, n, r),
          p = getInstanceScore(d, l, c);
      d.push({
        keypoints: c,
        score: p
      });
    }
  }

  return d;
}

var _a,
    imageNetMean = [-123.15, -115.9, -103.06],
    ResNet = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }

  return __extends(t, e), t.prototype.preprocessInput = function (e) {
    return e.add(imageNetMean);
  }, t.prototype.nameOutputResults = function (e) {
    var t = e[0],
        n = e[1],
        r = e[2],
        o = e[3],
        i = e[4],
        a = e[5];
    return {
      offsets: i,
      segmentation: e[6],
      partHeatmaps: a,
      longOffsets: o,
      heatmap: r,
      displacementFwd: n,
      displacementBwd: t,
      partOffsets: e[7]
    };
  }, t;
}(BaseModel),
    RESNET50_BASE_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/resnet50/",
    MOBILENET_BASE_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/mobilenet/";

function resNet50SavedModel(e, t) {
  var n = "model-stride" + e + ".json";
  return 4 === t ? RESNET50_BASE_URL + "float/" + n : RESNET50_BASE_URL + "quant" + t + "/" + n;
}

function mobileNetSavedModel(e, t, n) {
  var r = {
    1: "100",
    .75: "075",
    .5: "050"
  },
      o = "model-stride" + e + ".json";
  return 4 === n ? MOBILENET_BASE_URL + "float/" + r[t] + "/" + o : MOBILENET_BASE_URL + "quant" + n + "/" + r[t] + "/" + o;
}

function getInputSize(e) {
  if (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) {
    if (0 !== e.offsetHeight && 0 !== e.offsetWidth) return [e.offsetHeight, e.offsetWidth];
    if (null != e.height && null != e.width) return [e.height, e.width];
    throw new Error("HTMLImageElement must have height and width attributes set.");
  }

  if (e instanceof ImageData) return [e.height, e.width];
  if (e instanceof HTMLVideoElement) return null != e.height && null != e.width ? [e.height, e.width] : [e.videoHeight, e.videoWidth];
  if (e instanceof tf.Tensor) return [e.shape[0], e.shape[1]];
  throw new Error("error: Unknown input type: " + e + ".");
}

function isValidInputResolution(e, t) {
  return (e - 1) % t == 0;
}

function toValidInputResolution(e, t) {
  return isValidInputResolution(e, t) ? e : Math.floor(e / t) * t + 1;
}

var INTERNAL_RESOLUTION_STRING_OPTIONS = {
  low: "low",
  medium: "medium",
  high: "high",
  full: "full"
},
    INTERNAL_RESOLUTION_PERCENTAGES = ((_a = {})[INTERNAL_RESOLUTION_STRING_OPTIONS.low] = .25, _a[INTERNAL_RESOLUTION_STRING_OPTIONS.medium] = .5, _a[INTERNAL_RESOLUTION_STRING_OPTIONS.high] = .75, _a[INTERNAL_RESOLUTION_STRING_OPTIONS.full] = 1, _a);

function toInternalResolutionPercentage(e) {
  if ("string" == typeof e) {
    var t = INTERNAL_RESOLUTION_PERCENTAGES[e];
    return tf.util.assert("number" == typeof t, function () {
      return "string value of inputResolution must be one of " + Object.values(INTERNAL_RESOLUTION_STRING_OPTIONS).join(",") + " but was " + e + ".";
    }), t;
  }

  return tf.util.assert("number" == typeof e && e < 1 && e > 0, function () {
    return "inputResolution must be a string or number between 0 and 1, but was " + e;
  }), e;
}

function toInputResolutionHeightAndWidth(e, t, n) {
  var r = n[0],
      o = n[1],
      i = toInternalResolutionPercentage(e);
  return [toValidInputResolution(r * i, t), toValidInputResolution(o * i, t)];
}

function toInputTensor(e) {
  return e instanceof tf.Tensor ? e : tf.browser.fromPixels(e);
}

function resizeAndPadTo(e, t, n) {
  var r = t[0],
      o = t[1];
  void 0 === n && (n = !1);
  var i,
      a,
      s,
      d,
      u,
      l,
      f = e.shape,
      c = f[0],
      p = f[1] / c;

  if (p > o / r) {
    i = o;
    var h = r - (a = Math.ceil(i / p));
    s = 0, d = 0, u = Math.floor(h / 2), l = r - (a + u);
  } else {
    a = r;
    var m = o - (i = Math.ceil(r * p));
    s = Math.floor(m / 2), d = o - (i + s), u = 0, l = 0;
  }

  return {
    resizedAndPadded: (0, tf.tidy)(function () {
      var t;
      return t = n ? e.reverse(1).resizeBilinear([a, i]) : e.resizeBilinear([a, i]), (0, tf.pad3d)(t, [[u, l], [s, d], [0, 0]]);
    }),
    paddedBy: [[u, l], [s, d]]
  };
}

function scaleAndCropToInputTensorShape(e, t, n, r, o) {
  var i = t[0],
      a = t[1],
      s = n[0],
      d = n[1],
      u = r[0],
      l = u[0],
      f = u[1],
      c = r[1],
      p = c[0],
      h = c[1];
  return void 0 === o && (o = !1), (0, tf.tidy)(function () {
    var t = e.resizeBilinear([s, d], !0);
    return o && (t = t.sigmoid()), removePaddingAndResizeBack(t, [i, a], [[l, f], [p, h]]);
  });
}

function removePaddingAndResizeBack(e, t, n) {
  var r = t[0],
      o = t[1],
      i = n[0],
      a = i[0],
      s = i[1],
      d = n[1],
      u = d[0],
      l = d[1];
  return (0, tf.tidy)(function () {
    return tf.image.cropAndResize(e.expandDims(), [[a / (r + a + s - 1), u / (o + u + l - 1), (a + r - 1) / (r + a + s - 1), (u + o - 1) / (o + u + l - 1)]], [0], [r, o]).squeeze([0]);
  });
}

function padAndResizeTo(e, t) {
  var n = t[0],
      r = t[1],
      o = getInputSize(e),
      i = o[0],
      a = o[1],
      s = r / n,
      d = [0, 0, 0, 0],
      u = d[0],
      l = d[1],
      f = d[2],
      c = d[3];
  return a / i < s ? (u = 0, l = 0, f = Math.round(.5 * (s * i - a)), c = Math.round(.5 * (s * i - a))) : (u = Math.round(.5 * (1 / s * a - i)), l = Math.round(.5 * (1 / s * a - i)), f = 0, c = 0), {
    resized: (0, tf.tidy)(function () {
      var t = toInputTensor(e);
      return (t = (0, tf.pad3d)(t, [[u, l], [f, c], [0, 0]])).resizeBilinear([n, r]);
    }),
    padding: {
      top: u,
      left: f,
      right: c,
      bottom: l
    }
  };
}

function toTensorBuffers3D(e) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (t) {
      return [2, Promise.all(e.map(function (e) {
        return e.buffer();
      }))];
    });
  });
}

function scalePose(e, t, n, r, o) {
  return void 0 === r && (r = 0), void 0 === o && (o = 0), {
    score: e.score,
    keypoints: e.keypoints.map(function (e) {
      var i = e.score,
          a = e.part,
          s = e.position;
      return {
        score: i,
        part: a,
        position: {
          x: s.x * n + o,
          y: s.y * t + r
        }
      };
    })
  };
}

function scalePoses(e, t, n, r, o) {
  return void 0 === r && (r = 0), void 0 === o && (o = 0), 1 === n && 1 === t && 0 === r && 0 === o ? e : e.map(function (e) {
    return scalePose(e, t, n, r, o);
  });
}

function flipPoseHorizontal(e, t) {
  return {
    score: e.score,
    keypoints: e.keypoints.map(function (e) {
      var n = e.score,
          r = e.part,
          o = e.position;
      return {
        score: n,
        part: r,
        position: {
          x: t - 1 - o.x,
          y: o.y
        }
      };
    })
  };
}

function flipPosesHorizontal(e, t) {
  return t <= 0 ? e : e.map(function (e) {
    return flipPoseHorizontal(e, t);
  });
}

function scaleAndFlipPoses(e, t, n, r, o) {
  var i = t[0],
      a = t[1],
      s = n[0],
      d = n[1],
      u = scalePoses(e, (i + r.top + r.bottom) / s, (a + r.left + r.right) / d, -r.top, -r.left);
  return o ? flipPosesHorizontal(u, a) : u;
}

var APPLY_SIGMOID_ACTIVATION = !0,
    FLIP_POSES_AFTER_SCALING = !1,
    MOBILENET_V1_CONFIG = {
  architecture: "MobileNetV1",
  outputStride: 16,
  quantBytes: 4,
  multiplier: .75
},
    VALID_ARCHITECTURE = ["MobileNetV1", "ResNet50"],
    VALID_STRIDE = {
  MobileNetV1: [8, 16, 32],
  ResNet50: [32, 16]
},
    VALID_MULTIPLIER = {
  MobileNetV1: [.5, .75, 1],
  ResNet50: [1]
},
    VALID_QUANT_BYTES = [1, 2, 4];

function validateModelConfig(e) {
  if (null == (e = e || MOBILENET_V1_CONFIG).architecture && (e.architecture = "MobileNetV1"), VALID_ARCHITECTURE.indexOf(e.architecture) < 0) throw new Error("Invalid architecture " + e.architecture + ". Should be one of " + VALID_ARCHITECTURE);
  if (null == e.outputStride && (e.outputStride = 16), VALID_STRIDE[e.architecture].indexOf(e.outputStride) < 0) throw new Error("Invalid outputStride " + e.outputStride + ". Should be one of " + VALID_STRIDE[e.architecture] + " for architecture " + e.architecture + ".");
  if (null == e.multiplier && (e.multiplier = 1), VALID_MULTIPLIER[e.architecture].indexOf(e.multiplier) < 0) throw new Error("Invalid multiplier " + e.multiplier + ". Should be one of " + VALID_MULTIPLIER[e.architecture] + " for architecture " + e.architecture + ".");
  if (null == e.quantBytes && (e.quantBytes = 4), VALID_QUANT_BYTES.indexOf(e.quantBytes) < 0) throw new Error("Invalid quantBytes " + e.quantBytes + ". Should be one of " + VALID_QUANT_BYTES + " for architecture " + e.architecture + ".");
  return e;
}

var PERSON_INFERENCE_CONFIG = {
  flipHorizontal: !1,
  internalResolution: "medium",
  segmentationThreshold: .7,
  maxDetections: 10,
  scoreThreshold: .4,
  nmsRadius: 20
},
    MULTI_PERSON_INSTANCE_INFERENCE_CONFIG = {
  flipHorizontal: !1,
  internalResolution: "medium",
  segmentationThreshold: .7,
  maxDetections: 10,
  scoreThreshold: .4,
  nmsRadius: 20,
  minKeypointScore: .3,
  refineSteps: 10
};

function validatePersonInferenceConfig(e) {
  var t = e.segmentationThreshold,
      n = e.maxDetections,
      r = e.scoreThreshold,
      o = e.nmsRadius;
  if (t < 0 || t > 1) throw new Error("segmentationThreshold " + t + ". Should be in range [0.0, 1.0]");
  if (n <= 0) throw new Error("Invalid maxDetections " + n + ". Should be > 0");
  if (r < 0 || r > 1) throw new Error("Invalid scoreThreshold " + r + ". Should be in range [0.0, 1.0]");
  if (o <= 0) throw new Error("Invalid nmsRadius " + o + ".");
}

function validateMultiPersonInstanceInferenceConfig(e) {
  var t = e.segmentationThreshold,
      n = e.maxDetections,
      r = e.scoreThreshold,
      o = e.nmsRadius,
      i = e.minKeypointScore,
      a = e.refineSteps;
  if (t < 0 || t > 1) throw new Error("segmentationThreshold " + t + ". Should be in range [0.0, 1.0]");
  if (n <= 0) throw new Error("Invalid maxDetections " + n + ". Should be > 0");
  if (r < 0 || r > 1) throw new Error("Invalid scoreThreshold " + r + ". Should be in range [0.0, 1.0]");
  if (o <= 0) throw new Error("Invalid nmsRadius " + o + ".");
  if (i < 0 || i > 1) throw new Error("Invalid minKeypointScore " + i + ".Should be in range [0.0, 1.0]");
  if (a <= 0 || a > 20) throw new Error("Invalid refineSteps " + a + ".Should be in range [1, 20]");
}

var BodyPix = function () {
  function e(e) {
    this.baseModel = e;
  }

  return e.prototype.predictForPersonSegmentation = function (e) {
    var t = this.baseModel.predict(e);
    return {
      segmentLogits: t.segmentation,
      heatmapScores: t.heatmapScores,
      offsets: t.offsets,
      displacementFwd: t.displacementFwd,
      displacementBwd: t.displacementBwd
    };
  }, e.prototype.predictForPersonSegmentationAndPart = function (e) {
    var t = this.baseModel.predict(e);
    return {
      segmentLogits: t.segmentation,
      partHeatmapLogits: t.partHeatmaps,
      heatmapScores: t.heatmapScores,
      offsets: t.offsets,
      displacementFwd: t.displacementFwd,
      displacementBwd: t.displacementBwd
    };
  }, e.prototype.predictForMultiPersonInstanceSegmentationAndPart = function (e) {
    var t = this.baseModel.predict(e);
    return {
      segmentLogits: t.segmentation,
      longOffsets: t.longOffsets,
      heatmapScores: t.heatmapScores,
      offsets: t.offsets,
      displacementFwd: t.displacementFwd,
      displacementBwd: t.displacementBwd,
      partHeatmaps: t.partHeatmaps
    };
  }, e.prototype.segmentPersonActivation = function (e, t, n) {
    var r = this;
    void 0 === n && (n = .5);
    var o = getInputSize(e),
        i = o[0],
        a = o[1],
        s = toInputResolutionHeightAndWidth(t, this.baseModel.outputStride, [i, a]),
        d = padAndResizeTo(e, s),
        u = d.resized,
        l = d.padding,
        f = (0, tf.tidy)(function () {
      var e = r.predictForPersonSegmentation(u),
          t = e.segmentLogits,
          o = e.heatmapScores,
          s = e.offsets,
          d = e.displacementFwd,
          f = e.displacementBwd,
          c = u.shape,
          p = c[0],
          h = c[1];
      return {
        segmentation: toMaskTensor(scaleAndCropToInputTensorShape(t, [i, a], [p, h], [[l.top, l.bottom], [l.left, l.right]], APPLY_SIGMOID_ACTIVATION).squeeze(), n),
        heatmapScores: o,
        offsets: s,
        displacementFwd: d,
        displacementBwd: f
      };
    }),
        c = f.segmentation,
        p = f.heatmapScores,
        h = f.offsets,
        m = f.displacementFwd,
        g = f.displacementBwd;
    return u.dispose(), {
      segmentation: c,
      heatmapScores: p,
      offsets: h,
      displacementFwd: m,
      displacementBwd: g,
      padding: l,
      internalResolutionHeightAndWidth: s
    };
  }, e.prototype.segmentPerson = function (e, t) {
    return void 0 === t && (t = PERSON_INFERENCE_CONFIG), __awaiter(this, void 0, void 0, function () {
      var n, r, o, i, a, s, d, u, l, f, c, p, h, m, g, v, S, _;

      return __generator(this, function (w) {
        switch (w.label) {
          case 0:
            return validatePersonInferenceConfig(t = __assign({}, PERSON_INFERENCE_CONFIG, t)), n = this.segmentPersonActivation(e, t.internalResolution, t.segmentationThreshold), r = n.segmentation, o = n.heatmapScores, i = n.offsets, a = n.displacementFwd, s = n.displacementBwd, d = n.padding, u = n.internalResolutionHeightAndWidth, l = r.shape, f = l[0], c = l[1], [4, r.data()];

          case 1:
            return p = w.sent(), r.dispose(), [4, toTensorBuffers3D([o, i, a, s])];

          case 2:
            return h = w.sent(), m = h[0], g = h[1], v = h[2], S = h[3], _ = scaleAndFlipPoses(_ = decodeMultiplePoses(m, g, v, S, this.baseModel.outputStride, t.maxDetections, t.scoreThreshold, t.nmsRadius), [f, c], u, d, FLIP_POSES_AFTER_SCALING), o.dispose(), i.dispose(), a.dispose(), s.dispose(), [2, {
              height: f,
              width: c,
              data: p,
              allPoses: _
            }];
        }
      });
    });
  }, e.prototype.segmentMultiPerson = function (e, t) {
    return void 0 === t && (t = MULTI_PERSON_INSTANCE_INFERENCE_CONFIG), __awaiter(this, void 0, void 0, function () {
      var n,
          r,
          o,
          i,
          a,
          s,
          d,
          u,
          l,
          f,
          c,
          p,
          h,
          m,
          g,
          v,
          S,
          _,
          w,
          I,
          E,
          T = this;

      return __generator(this, function (A) {
        switch (A.label) {
          case 0:
            return validateMultiPersonInstanceInferenceConfig(t = __assign({}, MULTI_PERSON_INSTANCE_INFERENCE_CONFIG, t)), n = getInputSize(e), r = n[0], o = n[1], i = toInputResolutionHeightAndWidth(t.internalResolution, this.baseModel.outputStride, [r, o]), a = padAndResizeTo(e, i), s = a.resized, d = a.padding, u = (0, tf.tidy)(function () {
              var e,
                  n = T.predictForMultiPersonInstanceSegmentationAndPart(s),
                  a = n.segmentLogits,
                  u = n.longOffsets,
                  l = n.heatmapScores,
                  f = n.offsets,
                  c = n.displacementFwd,
                  p = n.displacementBwd;
              return e = u, {
                segmentation: toMaskTensor(scaleAndCropToInputTensorShape(a, [r, o], i, [[d.top, d.bottom], [d.left, d.right]], APPLY_SIGMOID_ACTIVATION).squeeze(), t.segmentationThreshold),
                longOffsets: e,
                heatmapScoresRaw: l,
                offsetsRaw: f,
                displacementFwdRaw: c,
                displacementBwdRaw: p
              };
            }), l = u.segmentation, f = u.longOffsets, c = u.heatmapScoresRaw, p = u.offsetsRaw, h = u.displacementFwdRaw, m = u.displacementBwdRaw, [4, toTensorBuffers3D([c, p, h, m])];

          case 1:
            return g = A.sent(), v = g[0], S = g[1], _ = g[2], w = g[3], I = scaleAndFlipPoses(I = decodeMultiplePoses(v, S, _, w, this.baseModel.outputStride, t.maxDetections, t.scoreThreshold, t.nmsRadius), [r, o], i, d, FLIP_POSES_AFTER_SCALING), [4, decodePersonInstanceMasks(l, f, I, r, o, this.baseModel.outputStride, i, d, t.scoreThreshold, t.refineSteps, t.minKeypointScore, t.maxDetections)];

          case 2:
            return E = A.sent(), s.dispose(), l.dispose(), f.dispose(), c.dispose(), p.dispose(), h.dispose(), m.dispose(), [2, E];
        }
      });
    });
  }, e.prototype.segmentPersonPartsActivation = function (e, t, n) {
    var r = this;
    void 0 === n && (n = .5);
    var o = getInputSize(e),
        i = o[0],
        a = o[1],
        s = toInputResolutionHeightAndWidth(t, this.baseModel.outputStride, [i, a]),
        d = padAndResizeTo(e, s),
        u = d.resized,
        l = d.padding,
        f = (0, tf.tidy)(function () {
      var e = r.predictForPersonSegmentationAndPart(u),
          t = e.segmentLogits,
          o = e.partHeatmapLogits,
          s = e.heatmapScores,
          d = e.offsets,
          f = e.displacementFwd,
          c = e.displacementBwd,
          p = u.shape,
          h = p[0],
          m = p[1],
          g = scaleAndCropToInputTensorShape(t, [i, a], [h, m], [[l.top, l.bottom], [l.left, l.right]], APPLY_SIGMOID_ACTIVATION),
          v = scaleAndCropToInputTensorShape(o, [i, a], [h, m], [[l.top, l.bottom], [l.left, l.right]], APPLY_SIGMOID_ACTIVATION);
      return {
        partSegmentation: decodePartSegmentation(toMaskTensor(g.squeeze(), n), v),
        heatmapScores: s,
        offsets: d,
        displacementFwd: f,
        displacementBwd: c
      };
    }),
        c = f.partSegmentation,
        p = f.heatmapScores,
        h = f.offsets,
        m = f.displacementFwd,
        g = f.displacementBwd;
    return u.dispose(), {
      partSegmentation: c,
      heatmapScores: p,
      offsets: h,
      displacementFwd: m,
      displacementBwd: g,
      padding: l,
      internalResolutionHeightAndWidth: s
    };
  }, e.prototype.segmentPersonParts = function (e, t) {
    return void 0 === t && (t = PERSON_INFERENCE_CONFIG), __awaiter(this, void 0, void 0, function () {
      var n, r, o, i, a, s, d, u, l, f, c, p, h, m, g, v, S, _;

      return __generator(this, function (w) {
        switch (w.label) {
          case 0:
            return validatePersonInferenceConfig(t = __assign({}, PERSON_INFERENCE_CONFIG, t)), n = this.segmentPersonPartsActivation(e, t.internalResolution, t.segmentationThreshold), r = n.partSegmentation, o = n.heatmapScores, i = n.offsets, a = n.displacementFwd, s = n.displacementBwd, d = n.padding, u = n.internalResolutionHeightAndWidth, l = r.shape, f = l[0], c = l[1], [4, r.data()];

          case 1:
            return p = w.sent(), r.dispose(), [4, toTensorBuffers3D([o, i, a, s])];

          case 2:
            return h = w.sent(), m = h[0], g = h[1], v = h[2], S = h[3], _ = scaleAndFlipPoses(_ = decodeMultiplePoses(m, g, v, S, this.baseModel.outputStride, t.maxDetections, t.scoreThreshold, t.nmsRadius), [f, c], u, d, FLIP_POSES_AFTER_SCALING), o.dispose(), i.dispose(), a.dispose(), s.dispose(), [2, {
              height: f,
              width: c,
              data: p,
              allPoses: _
            }];
        }
      });
    });
  }, e.prototype.segmentMultiPersonParts = function (e, t) {
    return void 0 === t && (t = MULTI_PERSON_INSTANCE_INFERENCE_CONFIG), __awaiter(this, void 0, void 0, function () {
      var n,
          r,
          o,
          i,
          a,
          s,
          d,
          u,
          l,
          f,
          c,
          p,
          h,
          m,
          g,
          v,
          S,
          _,
          w,
          I,
          E,
          T,
          A = this;

      return __generator(this, function (N) {
        switch (N.label) {
          case 0:
            return validateMultiPersonInstanceInferenceConfig(t = __assign({}, MULTI_PERSON_INSTANCE_INFERENCE_CONFIG, t)), n = getInputSize(e), r = n[0], o = n[1], i = toInputResolutionHeightAndWidth(t.internalResolution, this.baseModel.outputStride, [r, o]), a = padAndResizeTo(e, i), s = a.resized, d = a.padding, u = (0, tf.tidy)(function () {
              var e = A.predictForMultiPersonInstanceSegmentationAndPart(s),
                  n = e.segmentLogits,
                  a = e.longOffsets,
                  u = e.heatmapScores,
                  l = e.offsets,
                  f = e.displacementFwd,
                  c = e.displacementBwd,
                  p = e.partHeatmaps,
                  h = scaleAndCropToInputTensorShape(n, [r, o], i, [[d.top, d.bottom], [d.left, d.right]], APPLY_SIGMOID_ACTIVATION),
                  m = scaleAndCropToInputTensorShape(p, [r, o], i, [[d.top, d.bottom], [d.left, d.right]], APPLY_SIGMOID_ACTIVATION),
                  g = a;
              return {
                segmentation: toMaskTensor(h.squeeze(), t.segmentationThreshold),
                longOffsets: g,
                heatmapScoresRaw: u,
                offsetsRaw: l,
                displacementFwdRaw: f,
                displacementBwdRaw: c,
                partSegmentation: decodeOnlyPartSegmentation(m)
              };
            }), l = u.segmentation, f = u.longOffsets, c = u.heatmapScoresRaw, p = u.offsetsRaw, h = u.displacementFwdRaw, m = u.displacementBwdRaw, g = u.partSegmentation, [4, toTensorBuffers3D([c, p, h, m])];

          case 1:
            return v = N.sent(), S = v[0], _ = v[1], w = v[2], I = v[3], E = scaleAndFlipPoses(E = decodeMultiplePoses(S, _, w, I, this.baseModel.outputStride, t.maxDetections, t.scoreThreshold, t.nmsRadius), [r, o], i, d, FLIP_POSES_AFTER_SCALING), [4, decodePersonInstancePartMasks(l, f, g, E, r, o, this.baseModel.outputStride, i, d, t.scoreThreshold, t.refineSteps, t.minKeypointScore, t.maxDetections)];

          case 2:
            return T = N.sent(), s.dispose(), l.dispose(), f.dispose(), c.dispose(), p.dispose(), h.dispose(), m.dispose(), g.dispose(), [2, T];
        }
      });
    });
  }, e.prototype.dispose = function () {
    this.baseModel.dispose();
  }, e;
}();

exports.BodyPix = BodyPix;

function loadMobileNet(e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, r, o, i, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          if (t = e.outputStride, n = e.quantBytes, r = e.multiplier, null == tf) throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");
          return o = mobileNetSavedModel(t, r, n), [4, (0, _tfjsConverter.loadGraphModel)(e.modelUrl || o)];

        case 1:
          return i = s.sent(), a = new MobileNet(i, t), [2, new BodyPix(a)];
      }
    });
  });
}

function loadResNet(e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, r, o, i;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (t = e.outputStride, n = e.quantBytes, null == tf) throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");
          return r = resNet50SavedModel(t, n), [4, (0, _tfjsConverter.loadGraphModel)(e.modelUrl || r)];

        case 1:
          return o = a.sent(), i = new ResNet(o, t), [2, new BodyPix(i)];
      }
    });
  });
}

function load(e) {
  return void 0 === e && (e = MOBILENET_V1_CONFIG), __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (t) {
      return "ResNet50" === (e = validateModelConfig(e)).architecture ? [2, loadResNet(e)] : "MobileNetV1" === e.architecture ? [2, loadMobileNet(e)] : [2, null];
    });
  });
}

function cpuBlur(e, t, n) {
  for (var r = e.getContext("2d"), o = 0, i = 1 / (2 * Math.PI * 5 * 5), a = n < 3 ? 1 : 2, s = -n; s <= n; s += a) for (var d = -n; d <= n; d += a) {
    o += i * Math.exp(-(d * d + s * s) / 50);
  }

  for (s = -n; s <= n; s += a) for (d = -n; d <= n; d += a) r.globalAlpha = i * Math.exp(-(d * d + s * s) / 50) / o * n, r.drawImage(t, d, s);

  r.globalAlpha = 1;
}

var offScreenCanvases = {};

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function assertSameDimensions(e, t, n, r) {
  var o = e.width,
      i = e.height,
      a = t.width,
      s = t.height;
  if (o !== a || i !== s) throw new Error("error: dimensions must match. " + n + " has dimensions " + o + "x" + i + ", " + r + " has dimensions " + a + "x" + s);
}

function flipCanvasHorizontal(e) {
  var t = e.getContext("2d");
  t.scale(-1, 1), t.translate(-e.width, 0);
}

function drawWithCompositing(e, t, n) {
  e.globalCompositeOperation = n, e.drawImage(t, 0, 0);
}

function createOffScreenCanvas() {
  return document.createElement("canvas");
}

function ensureOffscreenCanvasCreated(e) {
  return offScreenCanvases[e] || (offScreenCanvases[e] = createOffScreenCanvas()), offScreenCanvases[e];
}

function drawAndBlurImageOnCanvas(e, t, n) {
  var r = e.height,
      o = e.width,
      i = n.getContext("2d");
  n.width = o, n.height = r, i.clearRect(0, 0, o, r), i.save(), isSafari() ? cpuBlur(n, e, t) : (i.filter = "blur(" + t + "px)", i.drawImage(e, 0, 0, o, r)), i.restore();
}

function drawAndBlurImageOnOffScreenCanvas(e, t, n) {
  var r = ensureOffscreenCanvasCreated(n);
  return 0 === t ? renderImageToCanvas(e, r) : drawAndBlurImageOnCanvas(e, t, r), r;
}

function renderImageToCanvas(e, t) {
  var n = e.width,
      r = e.height;
  t.width = n, t.height = r, t.getContext("2d").drawImage(e, 0, 0, n, r);
}

function renderImageDataToCanvas(e, t) {
  t.width = e.width, t.height = e.height, t.getContext("2d").putImageData(e, 0, 0);
}

function renderImageDataToOffScreenCanvas(e, t) {
  var n = ensureOffscreenCanvasCreated(t);
  return renderImageDataToCanvas(e, n), n;
}

function toMask(e, t, n, r, o) {
  if (void 0 === t && (t = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }), void 0 === n && (n = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  }), void 0 === r && (r = !1), void 0 === o && (o = [1]), Array.isArray(e) && 0 === e.length) return null;
  var i,
      a = (i = Array.isArray(e) ? e : [e])[0],
      s = a.width,
      d = a.height,
      u = new Uint8ClampedArray(s * d * 4);

  function l(e, t, n, r, o, i) {
    void 0 === i && (i = {
      r: 0,
      g: 255,
      b: 255,
      a: 255
    });

    for (var a = -o; a <= o; a++) for (var s = -o; s <= o; s++) if (0 !== a && 0 !== s) {
      var d = (t + a) * r + (n + s);
      e[4 * d + 0] = i.r, e[4 * d + 1] = i.g, e[4 * d + 2] = i.b, e[4 * d + 3] = i.a;
    }
  }

  function f(e, t, n, r, o, i) {
    void 0 === o && (o = [1]), void 0 === i && (i = 1);

    for (var a = 0, s = -i; s <= i; s++) for (var d = function (i) {
      if (0 !== s && 0 !== i) {
        var d = (t + s) * r + (n + i);
        o.some(function (t) {
          return t === e[d];
        }) || (a += 1);
      }
    }, u = -i; u <= i; u++) d(u);

    return a > 0;
  }

  for (var c = 0; c < d; c += 1) for (var p = function (e) {
    var a = c * s + e;
    u[4 * a + 0] = n.r, u[4 * a + 1] = n.g, u[4 * a + 2] = n.b, u[4 * a + 3] = n.a;

    for (var p = function (n) {
      if (o.some(function (e) {
        return e === i[n].data[a];
      })) {
        u[4 * a] = t.r, u[4 * a + 1] = t.g, u[4 * a + 2] = t.b, u[4 * a + 3] = t.a;
        var p = f(i[n].data, c, e, s, o);
        r && c - 1 >= 0 && c + 1 < d && e - 1 >= 0 && e + 1 < s && p && l(u, c, e, s, 1);
      }
    }, h = 0; h < i.length; h++) p(h);
  }, h = 0; h < s; h += 1) p(h);

  return new ImageData(u, s, d);
}

var RAINBOW_PART_COLORS = [[110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167], [238, 67, 149], [255, 78, 125], [255, 94, 99], [255, 115, 75], [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64], [175, 240, 91], [135, 245, 87], [96, 247, 96], [64, 243, 115], [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213], [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195]];

function toColoredPartMask(e, t) {
  if (void 0 === t && (t = RAINBOW_PART_COLORS), Array.isArray(e) && 0 === e.length) return null;

  for (var n, r = (n = Array.isArray(e) ? e : [e])[0], o = r.width, i = r.height, a = new Uint8ClampedArray(o * i * 4), s = 0; s < i * o; ++s) {
    var d = 4 * s;
    a[d + 0] = 255, a[d + 1] = 255, a[d + 2] = 255, a[d + 3] = 255;

    for (var u = 0; u < n.length; u++) {
      var l = n[u].data[s];

      if (-1 !== l) {
        var f = t[l];
        if (!f) throw new Error("No color could be found for part id " + l);
        a[d + 0] = f[0], a[d + 1] = f[1], a[d + 2] = f[2], a[d + 3] = 255;
      }
    }
  }

  return new ImageData(a, o, i);
}

var CANVAS_NAMES = {
  blurred: "blurred",
  blurredMask: "blurred-mask",
  mask: "mask",
  lowresPartMask: "lowres-part-mask"
};

function drawMask(e, t, n, r, o, i) {
  void 0 === r && (r = .7), void 0 === o && (o = 0), void 0 === i && (i = !1);
  var a = getInputSize(t),
      s = a[0],
      d = a[1];
  e.width = d, e.height = s;
  var u = e.getContext("2d");

  if (u.save(), i && flipCanvasHorizontal(e), u.drawImage(t, 0, 0), u.globalAlpha = r, n) {
    assertSameDimensions({
      width: d,
      height: s
    }, n, "image", "mask");
    var l = drawAndBlurImageOnOffScreenCanvas(renderImageDataToOffScreenCanvas(n, CANVAS_NAMES.mask), o, CANVAS_NAMES.blurredMask);
    u.drawImage(l, 0, 0, d, s);
  }

  u.restore();
}

function drawPixelatedMask(e, t, n, r, o, i, a) {
  void 0 === r && (r = .7), void 0 === o && (o = 0), void 0 === i && (i = !1), void 0 === a && (a = 10);
  var s = getInputSize(t),
      d = s[0];
  assertSameDimensions({
    width: s[1],
    height: d
  }, n, "image", "mask");
  var u = drawAndBlurImageOnOffScreenCanvas(renderImageDataToOffScreenCanvas(n, CANVAS_NAMES.mask), o, CANVAS_NAMES.blurredMask);
  e.width = u.width, e.height = u.height;
  var l = e.getContext("2d");
  l.save(), i && flipCanvasHorizontal(e);
  var f = ensureOffscreenCanvasCreated(CANVAS_NAMES.lowresPartMask),
      c = f.getContext("2d");
  f.width = u.width * (1 / a), f.height = u.height * (1 / a), c.drawImage(u, 0, 0, u.width, u.height, 0, 0, f.width, f.height), l.imageSmoothingEnabled = !1, l.drawImage(f, 0, 0, f.width, f.height, 0, 0, e.width, e.height);

  for (var p = 0; p < f.width; p++) l.beginPath(), l.strokeStyle = "#ffffff", l.moveTo(a * p, 0), l.lineTo(a * p, e.height), l.stroke();

  for (p = 0; p < f.height; p++) l.beginPath(), l.strokeStyle = "#ffffff", l.moveTo(0, a * p), l.lineTo(e.width, a * p), l.stroke();

  l.globalAlpha = 1 - r, l.drawImage(t, 0, 0, u.width, u.height), l.restore();
}

function createPersonMask(e, t) {
  var n = renderImageDataToOffScreenCanvas(toMask(e, {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  }, {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }), CANVAS_NAMES.mask);
  return 0 === t ? n : drawAndBlurImageOnOffScreenCanvas(n, t, CANVAS_NAMES.blurredMask);
}

function drawBokehEffect(e, t, n, r, o, i) {
  void 0 === r && (r = 3), void 0 === o && (o = 3), void 0 === i && (i = !1);
  var a = drawAndBlurImageOnOffScreenCanvas(t, r, CANVAS_NAMES.blurred);
  e.width = a.width, e.height = a.height;
  var s = e.getContext("2d");
  if (Array.isArray(n) && 0 === n.length) s.drawImage(a, 0, 0);else {
    var d = createPersonMask(n, o);
    s.save(), i && flipCanvasHorizontal(e);
    var u = getInputSize(t),
        l = u[0],
        f = u[1];
    s.drawImage(t, 0, 0, f, l), drawWithCompositing(s, d, "destination-in"), drawWithCompositing(s, a, "destination-over"), s.restore();
  }
}

function createBodyPartMask(e, t, n) {
  var r = renderImageDataToOffScreenCanvas(toMask(e, {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }, {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  }, !0, t), CANVAS_NAMES.mask);
  return 0 === n ? r : drawAndBlurImageOnOffScreenCanvas(r, n, CANVAS_NAMES.blurredMask);
}

function blurBodyPart(e, t, n, r, o, i, a) {
  void 0 === r && (r = [0, 1]), void 0 === o && (o = 3), void 0 === i && (i = 3), void 0 === a && (a = !1);
  var s = drawAndBlurImageOnOffScreenCanvas(t, o, CANVAS_NAMES.blurred);
  e.width = s.width, e.height = s.height;
  var d = e.getContext("2d");
  if (Array.isArray(n) && 0 === n.length) d.drawImage(s, 0, 0);else {
    var u = createBodyPartMask(n, r, i);
    d.save(), a && flipCanvasHorizontal(e);
    var l = getInputSize(t),
        f = l[0],
        c = l[1];
    d.drawImage(t, 0, 0, c, f), drawWithCompositing(d, u, "destination-in"), drawWithCompositing(d, s, "destination-over"), d.restore();
  }
}

var PART_CHANNELS = ["left_face", "right_face", "left_upper_arm_front", "left_upper_arm_back", "right_upper_arm_front", "right_upper_arm_back", "left_lower_arm_front", "left_lower_arm_back", "right_lower_arm_front", "right_lower_arm_back", "left_hand", "right_hand", "torso_front", "torso_back", "left_upper_leg_front", "left_upper_leg_back", "right_upper_leg_front", "right_upper_leg_back", "left_lower_leg_front", "left_lower_leg_back", "right_lower_leg_front", "right_lower_leg_back", "left_feet", "right_feet"];
exports.PART_CHANNELS = PART_CHANNELS;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","@tensorflow/tfjs-converter":"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js"}],"index.js":[function(require,module,exports) {
"use strict";

var bodyPix = _interopRequireWildcard(require("@tensorflow-models/body-pix"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// @author : Vishal Srinivas
const state = {
  video: null,
  stream: null,
  net: null,
  videoConstraints: {},
  changingArchitecture: false,
  changingMultiplier: false,
  changingStride: false,
  changingResolution: false,
  changingQuantBytes: false
};
const NNProperties = {
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    internalResolution: 'medium',
    multiplier: 0.50,
    quantBytes: 4
  },
  segmentation: {
    segmentationThreshold: 0.7,
    effect: 'mask',
    maskBackground: true,
    opacity: 0.7,
    backgroundBlurAmount: 3,
    maskBlurAmount: 0,
    edgeBlurAmount: 3
  }
};

async function getDeviceIdForLabel(cameraLabel) {
  const videoInputs = await getVideoInputs();

  for (let i = 0; i < videoInputs.length; i++) {
    const videoInput = videoInputs[i];

    if (videoInput.label === cameraLabel) {
      return videoInput.deviceId;
    }
  }

  return null;
}

async function getConstraints(cameraLabel) {
  let deviceId;
  let facingMode;

  if (cameraLabel) {
    deviceId = await getDeviceIdForLabel(cameraLabel);
    facingMode = 'user';
  }

  ;
  return {
    deviceId,
    facingMode
  };
}

function stopExistingVideoCapture() {
  if (state.video && state.video.srcObject) {
    state.video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    state.video.srcObject = null;
  }
}

async function setupCamera(cameraLabel) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Device API not available');
  }

  const videoElement = document.getElementById('video');
  stopExistingVideoCapture();
  const videoConstraints = await getConstraints(cameraLabel);
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': videoConstraints
  });
  videoElement.srcObject = stream;
  return new Promise(resolve => {
    videoElement.onloadedmetadata = () => {
      videoElement.width = videoElement.videoWidth;
      videoElement.height = videoElement.videoHeight;
      resolve(videoElement);
    };
  });
}

async function loadVideo(cameraLabel) {
  try {
    state.video = await setupCamera(cameraLabel);
  } catch (e) {
    console.log(e);
  }

  state.video.play();
}

function toggleLoadingUI(showLoadingUI, loadingDivId = 'loading', mainDivId = 'main') {
  if (showLoadingUI) {
    document.getElementById(loadingDivId).style.display = 'block';
    document.getElementById(mainDivId).style.display = 'none';
  } else {
    document.getElementById(loadingDivId).style.display = 'none';
    document.getElementById(mainDivId).style.display = 'block';
  }
}

async function loadBodyPix() {
  toggleLoadingUI(true);
  state.net = await bodyPix.load({
    architecture: NNProperties.input.architecture,
    outputStride: NNProperties.input.outputStride,
    multiplier: NNProperties.input.multiplier,
    quantBytes: NNProperties.input.quantBytes
  });
  console.log(state.net);
  toggleLoadingUI(false);
  console.log("model loaded");
}

async function estimateSegmentation() {
  return await state.net.segmentPerson(state.video, {
    internalResolution: NNProperties.input.internalResolution,
    segmentationThreshold: NNProperties.segmentation.segmentationThreshold,
    maxDetections: 2,
    scoreThreshold: 0.3,
    nmsRadius: 10
  });
}

async function segmentBodyInRealTime() {
  let canvas = document.getElementById('output');
  let PersonSegmentation = await estimateSegmentation();

  if (PersonSegmentation != undefined) {
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.save();
    const foregroundColor = {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    };
    const backgroundColor = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
    const mask = bodyPix.toMask(PersonSegmentation, foregroundColor, backgroundColor, true);
    console.log(mask);
    ctx.drawImage(state.video, 0, 0, 640, 480);
    let frame = ctx.getImageData(0, 0, 640, 480);
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      frame.data[i * 4 + 0] = frame.data[i * 4 + 0] * mask.data[i * 4 + 0];
      frame.data[i * 4 + 1] = frame.data[i * 4 + 1] * mask.data[i * 4 + 1];
      frame.data[i * 4 + 2] = frame.data[i * 4 + 2] * mask.data[i * 4 + 2];
      frame.data[i * 4 + 3] = frame.data[i * 4 + 3] * mask.data[i * 4 + 3];
    }

    ctx.putImageData(frame, 0, 0); // bodyPix.drawMask(canvas, state.video, mask, NNProperties.segmentation.opacity,NNProperties.segmentation.maskBlurAmount, false);
  }
}

loadBodyPix().then(function () {
  loadVideo().then(function () {
    setInterval(function () {
      segmentBodyInRealTime();
    }, 0);
  });
});
},{"@tensorflow-models/body-pix":"node_modules/@tensorflow-models/body-pix/dist/body-pix.esm.js"}]},{},["index.js"], null)
//# sourceMappingURL=/Zoom-BodyPix.e31bb0bc.js.map