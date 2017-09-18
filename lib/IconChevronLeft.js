'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SvgIcon = require('./SvgIcon');

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IconChevronLeft = function IconChevronLeft(_ref) {
  var _ref$color = _ref.color,
      color = _ref$color === undefined ? _SvgIcon.DEFAULT_COLOR : _ref$color,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 24 : _ref$width,
      rest = _objectWithoutProperties(_ref, ['color', 'width']);

  return _react2.default.createElement(
    _SvgIcon2.default,
    _extends({}, rest, { viewBox: '0 0 512 512', width: width }),
    _react2.default.createElement(
      'g',
      { fill: color },
      _react2.default.createElement('polygon', { points: '158.11,256 308.95,106 321.89,118.87 183.99,256 321.89,393.13 308.95,406' }),
      _react2.default.createElement('path', { d: 'M510,256c0,140.28-113.72,254-254,254S2,396.28,2,256S115.72,2,256,2S510,115.72,510,256z M256,20 C125.66,20,20,125.66,20,256s105.66,236,236,236s236-105.66,236-236S386.34,20,256,20z' })
    )
  );
};

IconChevronLeft.propTypes = _SvgIcon.iconPropTypes;

exports.default = IconChevronLeft;