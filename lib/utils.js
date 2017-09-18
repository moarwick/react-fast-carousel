'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.trimFloat = trimFloat;
exports.shortUID = shortUID;
exports.isMsBrowser = isMsBrowser;
/*
 * Clamp a number within the specified min-max range
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/*
 * Round a float to 2 decimal places
 */
function trimFloat(value) {
  return Math.round(value * 100) / 100;
}

/*
 * Generate a short UID (4 chars)
 * http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
 */
function shortUID() {
  return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
}

/*
 * Determine if Microsoft browser (IE8+ or Edge)
 */
function isMsBrowser() {
  return Boolean(document.documentMode || /Edge/.test(navigator.userAgent));
}