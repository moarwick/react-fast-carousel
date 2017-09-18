'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconPropTypes = exports.DEFAULT_COLOR = exports.DEFAULT_SIZE = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  children: _propTypes2.default.node,
  block: _propTypes2.default.bool,
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  offsetX: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  offsetY: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  viewBox: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  style: _propTypes2.default.object
};

var DEFAULT_SIZE = exports.DEFAULT_SIZE = 24;
var DEFAULT_COLOR = exports.DEFAULT_COLOR = '#485461';

/*
 * Universal component wrapper for SVG icons, by @moarwick
 *
 * Renders SVG content within a <span> wrapper and dynamically applies
 * inline styles for extra sizing and positioning control per props.
 * If custom 'width' or 'height' supplied, ensures correct aspect ratio.
 */
function SvgIcon(_ref) {
  var children = _ref.children,
      _ref$block = _ref.block,
      block = _ref$block === undefined ? false : _ref$block,
      height = _ref.height,
      width = _ref.width,
      _ref$offsetX = _ref.offsetX,
      offsetX = _ref$offsetX === undefined ? 0 : _ref$offsetX,
      _ref$offsetY = _ref.offsetY,
      offsetY = _ref$offsetY === undefined ? 0 : _ref$offsetY,
      _ref$viewBox = _ref.viewBox,
      viewBox = _ref$viewBox === undefined ? '0 0 ' + DEFAULT_SIZE + ' ' + DEFAULT_SIZE : _ref$viewBox,
      onClick = _ref.onClick,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;

  var isStyleWidth = 'width' in style;
  var wrapperStyles = getWrapperStyles({ block: block, isStyleWidth: isStyleWidth, height: height, width: width, viewBox: viewBox });
  var svgStyles = getSvgStyles(offsetX, offsetY, onClick);

  return _react2.default.createElement(
    'span',
    { style: _extends({}, wrapperStyles, style) },
    _react2.default.createElement('svg', { viewBox: viewBox }),
    _react2.default.createElement(
      'svg',
      { viewBox: viewBox, style: svgStyles, onClick: onClick },
      children
    )
  );
}

SvgIcon.propTypes = propTypes;

exports.default = SvgIcon;

/**
 * Generate inline styles for wrapper span
 */

function getWrapperStyles(_ref2) {
  var block = _ref2.block,
      isStyleWidth = _ref2.isStyleWidth,
      height = _ref2.height,
      width = _ref2.width,
      viewBox = _ref2.viewBox;

  var ratio = getViewBoxRatio(viewBox);
  var display = block ? 'block' : 'inline-block';
  var styles = { display: display, position: 'relative', verticalAlign: 'middle' };

  if (!isStyleWidth) {
    // default icon height to 24
    if (!height && !width) {
      height = DEFAULT_SIZE;
    }

    // expect dimensions as numbers, in pixels
    if (width && typeof width !== 'number') {
      width = parseInt(width, 10);
    }

    if (height && typeof height !== 'number') {
      height = parseInt(height, 10);
    }

    // use viewBox ratio to calc missing width or height
    if (height && !width) {
      width = (height * ratio).toFixed(1);
    }

    if (width && !height) {
      height = (width / ratio).toFixed(1);
    }

    styles.width = width + 'px';
    styles.height = height + 'px';
  }

  return styles;
}

/**
 * Generate styles for svg tag
 * Positioned absolutely within the wrapper, to allow for X/Y offsetting
 */
function getSvgStyles() {
  var offsetX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var onClick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return _extends({
    position: 'absolute',
    zIndex: 1,
    left: offsetX,
    top: offsetY
  }, onClick ? { cursor: 'pointer' } : {});
}

/**
 * Calc aspect ratio from the viewBox coords
 */
function getViewBoxRatio(viewBox) {
  var _viewBox$split$map = viewBox.split(' ').map(function (el) {
    return parseInt(el, 10) || 0;
  }),
      _viewBox$split$map2 = _slicedToArray(_viewBox$split$map, 4),
      x1 = _viewBox$split$map2[0],
      y1 = _viewBox$split$map2[1],
      x2 = _viewBox$split$map2[2],
      y2 = _viewBox$split$map2[3];

  return (x2 - x1) / (y2 - y1) || 1;
}

/**
 * Common propTypes used by all icons
 */
var iconPropTypes = exports.iconPropTypes = {
  color: _propTypes2.default.string,
  block: _propTypes2.default.bool,
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  offsetX: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  offsetY: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  onClick: _propTypes2.default.func,
  style: _propTypes2.default.object
};