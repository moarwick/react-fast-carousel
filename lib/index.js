'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils.js');

var _tween = require('tween.js');

var _tween2 = _interopRequireDefault(_tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EASING = {
  ease: _tween2.default.Easing.Quadratic.InOut,
  'ease-in': _tween2.default.Easing.Cubic.In,
  'ease-out': _tween2.default.Easing.Cubic.Out,
  'ease-in-out': _tween2.default.Easing.Cubic.InOut,
  linear: _tween2.default.Easing.Linear.None,
  'step-start': _tween2.default.Easing.Bounce.In, // not quite the same thing ;)
  'step-end': _tween2.default.Easing.Bounce.Out // not quite the same thing ;)
};

var MtSvgLines = function (_React$Component) {
  _inherits(MtSvgLines, _React$Component);

  function MtSvgLines(props) {
    _classCallCheck(this, MtSvgLines);

    var _this = _possibleConstructorReturn(this, (MtSvgLines.__proto__ || Object.getPrototypeOf(MtSvgLines)).call(this, props));

    _this._onTweenUpdate = function () {
      _this._setStrokeDashoffset(_this._pathElems, _this._tweenData);
      _this._animate(); // go again..
    };

    _this._onAnimComplete = function () {
      _this.props.callback();
      _this._animStart = 0;
    };

    _this.state = {
      classKey: 'mt-' + (0, _utils.shortUID)(), // unique class name for the wrapper, an internal "trigger" (re-gen each time anim is to run)
      css: '', // generated CSS
      tweenElapsed: 0, // tween duration so far (ms)
      tweenProgress: 0 // tween completion (pct)
    };

    _this._lastAnimate = '';
    _this._lastClassKey = '';

    _this._animStart = 0; // anim start timestamp

    _this._pathElems = [];
    _this._pathDataFrom = {};
    _this._pathDataTo = {};
    _this._tweenData = {};
    return _this;
  }

  // defaults


  _createClass(MtSvgLines, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.animate !== this._lastAnimate) {
        this._lastAnimate = nextProps.animate;
        this.setState({ classKey: 'mt-' + (0, _utils.shortUID)() });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._animate();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._animate();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // destruct all component-specific props, so '...rest' can be applied to wrapper <span>
      // eslint-disable-next-line no-unused-vars
      var _props = this.props,
          className = _props.className,
          animate = _props.animate,
          duration = _props.duration,
          stagger = _props.stagger,
          timing = _props.timing,
          playback = _props.playback,
          fade = _props.fade,
          jsOnly = _props.jsOnly,
          children = _props.children,
          callback = _props.callback,
          rest = _objectWithoutProperties(_props, ['className', 'animate', 'duration', 'stagger', 'timing', 'playback', 'fade', 'jsOnly', 'children', 'callback']);

      var _state = this.state,
          classKey = _state.classKey,
          css = _state.css;

      var isServer = typeof window === 'undefined';
      var isDelayed = typeof animate === 'number' && animate > 0;
      var isHidden = animate === 'hide';
      var opacity = isServer && isDelayed || isHidden ? 0.01 : 1;

      return _react2.default.createElement(
        'span',
        _extends({
          ref: function ref(c) {
            _this2._svgWrapper = c;
          },
          className: className + ' ' + classKey,
          style: { opacity: opacity }
        }, rest),
        _react2.default.createElement(
          'style',
          null,
          css
        ),
        children
      );
    }

    // ------------------------------------------------------

    /*
     * Main animate handler, called after each render update
     */

  }, {
    key: '_animate',
    value: function _animate() {
      var _this3 = this;

      if (typeof window === 'undefined') {
        return;
      }

      var _props2 = this.props,
          animate = _props2.animate,
          duration = _props2.duration,
          stagger = _props2.stagger,
          timing = _props2.timing,
          playback = _props2.playback,
          jsOnly = _props2.jsOnly;
      var classKey = this.state.classKey;


      var isStartNewAnim = animate !== false && classKey !== this._lastClassKey;
      var isAnimJS = (0, _utils.isMsBrowser)() || jsOnly;

      // >>> STARTING NEW ANIMATION...
      if (isStartNewAnim) {
        // set flags
        this._animStart = Date.now();
        this._lastClassKey = classKey;

        // parse out vars common for both modes
        var startDelay = typeof animate === 'number' ? animate : 0; // if numeric, treat as delay (ms)
        var numOfRepeats = parseInt(playback, 10) || 0;

        /* ----- JS MODE ----- */
        if (isAnimJS) {
          // parse props for use with Tween.js
          if (numOfRepeats > 0) {
            numOfRepeats = numOfRepeats - 1;
          }
          if (playback.includes('infinite')) {
            numOfRepeats = Infinity;
          }
          var isYoYo = playback.includes('alternate');

          // acquire path elems and generate to/from data sets
          this._pathElems = this._selectPathElems();
          var pathData = this._getPathData(this._pathElems);
          this._pathDataFrom = pathData.from;
          this._pathDataTo = pathData.to;

          // TODO: if ( contains( playback, 'reverse' ) ) { ... };

          // init tweener object
          this._tweenData = _extends({}, this._pathDataFrom);

          // set paths' offsets to start positions
          this._setStrokeDasharray(this._pathElems, this._pathDataFrom);
          this._setStrokeDashoffset(this._pathElems, this._tweenData);

          // init the tweener..
          var tween = new _tween2.default.Tween(this._tweenData).to(this._pathDataTo, duration).easing(EASING[timing]).repeat(numOfRepeats).yoyo(isYoYo).onUpdate(this._onTweenUpdate).onComplete(this._onAnimComplete);

          // kick off JS tweening..
          var t = setTimeout(function () {
            tween.start();
            _tween2.default.update();
            clearTimeout(t);
          }, Math.max(1, startDelay));

          /* ----- CSS MODE ----- */
        } else {
          var css = '';

          // 1) determine number of path elems in svg
          var pathLenghts = this._getPathLengths();
          var pathQty = pathLenghts.length || 1;

          // 2) calc all timing values
          var staggerMult = (0, _utils.clamp)(stagger, 0, 100) / 100; // convert pct to 0-1
          var pathStaggerDelay = stagger > 0 ? duration / pathQty * staggerMult : 0;
          var pathDrawDuration = stagger > 0 ? duration - pathStaggerDelay * (pathQty - 1) * (2 - staggerMult) : duration;

          // 3) concat generated CSS, one path at a time..
          pathLenghts.forEach(function (length, index) {
            css += _this3._getPathCSS(index, length, startDelay, pathStaggerDelay, pathDrawDuration);
          });

          // set up on-complete timer
          var _t = setTimeout(function () {
            clearTimeout(_t);
            _this3._onAnimComplete();
          }, startDelay + duration * numOfRepeats);

          // set state (re-render)
          this.setState({ css: css });
        }

        // >>> ONGOING ANIMATION...
      } else if (this._animStart) {
        /* ----- JS MODE ----- */
        if (isAnimJS) {
          window.requestAnimationFrame(_tween2.default.update);

          /* ----- CSS MODE ----- */
        } else {
            // NOTE: nothing to do, browser does its thing...
          }
      }
    }

    /*
     * On each Tween update, set dash offsets to newly tweened values
     */


    /*
     * When animation completes, run callback (if any), clear start timestamp
     */

  }, {
    key: '_selectPathElems',


    /*
     * Acquire selection of SVG 'path' elems contained within
     */
    value: function _selectPathElems() {
      var svgEl = this._svgWrapper.getElementsByTagName('svg')[0];
      return svgEl ? svgEl.querySelectorAll('path') : [];
    }

    /*
     * Generate an object containing 'from' and 'to' sub-objects
     * Each object contains same set of indexed keys, per the path selection
     * The 'from' object values are the paths' lengths
     * The 'to' object values are 0 (unless 'skip' attr is present, then equal path's length)
     */

  }, {
    key: '_getPathData',
    value: function _getPathData(pathElems) {
      var _this4 = this;

      var pathData = { from: {}, to: {} };[].forEach.call(pathElems, function (pathEl, i) {
        if (!_this4._hasSkipAttr(pathEl.attributes)) {
          var pathLengh = (0, _utils.trimFloat)(pathEl.getTotalLength() || 0);
          pathData.to[i] = 0;
          pathData.from[i] = pathLengh;
        }
      });

      return pathData;
    }

    /*
     * Check path's attributes for data-mt="skip"
     */

  }, {
    key: '_hasSkipAttr',
    value: function _hasSkipAttr(attributes) {
      var result = false;

      // path.attributes is an obj with indexed keys, so we must iterate over them
      // { '0': { name: 'd', value: 'M37.063' }, '1': { name: 'data-mt', value: 'skip' }, ... }
      for (var key in attributes) {
        var _attributes$key = attributes[key],
            name = _attributes$key.name,
            value = _attributes$key.value;

        if (!result && name === 'data-mt' && value === 'skip') {
          result = true;
          break;
        }
      }

      return result;
    }

    /*
     * Set style.strokeDasharray on all paths in selection, from the provided key-val object
     */

  }, {
    key: '_setStrokeDasharray',
    value: function _setStrokeDasharray(pathElems, pathData) {
      ;[].forEach.call(pathElems, function (pathEl, i) {
        if (pathData[i]) {
          pathEl.style.strokeDasharray = pathData[i];
        }
      });
    }

    /*
     * Set style.strokeDashoffset on all paths in selection, from the provided key-val object
     */

  }, {
    key: '_setStrokeDashoffset',
    value: function _setStrokeDashoffset(pathElems, pathData) {
      ;[].forEach.call(pathElems, function (pathEl, i) {
        if (pathData[i]) {
          pathEl.style.strokeDashoffset = pathData[i];
        }
      });
    }

    /*
     * Return an array containing lengths of all path elems inside the SVG
     */

  }, {
    key: '_getPathLengths',
    value: function _getPathLengths() {
      var _this5 = this;

      var pathElems = this._selectPathElems();
      return [].map.call(pathElems, function (pathEl) {
        return _this5._hasSkipAttr(pathEl.attributes) ? 0 : (0, _utils.trimFloat)(pathEl.getTotalLength() || 0);
      });
    }

    /*
     * Return CSS for a single path elem (using classKey and path index as the CSS selector)
     */

  }, {
    key: '_getPathCSS',
    value: function _getPathCSS(index, length, startDelay, staggerDelay, duration) {
      var classKey = this.state.classKey;
      var _props3 = this.props,
          timing = _props3.timing,
          playback = _props3.playback,
          fade = _props3.fade;


      var keysId = classKey + '-' + (index + 1);
      var totalDelay = length ? (0, _utils.trimFloat)((startDelay + staggerDelay * index) / 1000) : 0;
      var startOpacity = fade ? 0.01 : 1;

      duration = duration ? (0, _utils.trimFloat)(duration / 1000) : 0;

      return '\n      @-webkit-keyframes ' + keysId + ' {\n        0%   { stroke-dashoffset: ' + length + '; opacity: ' + startOpacity + '; }\n        100% { stroke-dashoffset: 0; opacity: 1; }\n      }\n      @keyframes ' + keysId + ' {\n        0%   { stroke-dashoffset: ' + length + '; opacity: ' + startOpacity + '; }\n        100% { stroke-dashoffset: 0; opacity: 1; }\n      }\n      .' + classKey + ' path:nth-of-type( ' + (index + 1) + ' ) {\n        opacity:                 0.01;\n        stroke-dasharray:        ' + length + ';\n        stroke-dashoffset:       ' + length + ';\n        -webkit-animation:       ' + keysId + ' ' + duration + 's ' + timing + ' ' + playback + ';\n        animation:               ' + keysId + ' ' + duration + 's ' + timing + ' ' + playback + ';\n        -webkit-animation-delay: ' + totalDelay + 's;\n        animation-delay:         ' + totalDelay + 's;\n      }\n    ';
    }
  }]);

  return MtSvgLines;
}(_react2.default.Component);

MtSvgLines.propTypes = {
  className: _propTypes2.default.string, // custom CSS class (applied to svg elem)
  animate: _propTypes2.default.oneOfType([
  // external animation trigger
  _propTypes2.default.string, // - pass a unique string or true to (re)start animation
  _propTypes2.default.number, // - pass a number to specify delay before the animation begins (ms)
  _propTypes2.default.bool // - pass false (or omit) to draw static SVG (no animation)
  ]),
  duration: _propTypes2.default.number, // total anim duration (ms)
  stagger: _propTypes2.default.number, // delay between start times of each path (percentage)
  timing: _react2.default.PropTypes.oneOf([
  // easing type
  'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end']),
  playback: _propTypes2.default.string, // iteration-count || direction || fill-mode (perhaps even play-state)
  fade: _propTypes2.default.bool, // apply a fade-in to each path
  callback: _propTypes2.default.func, // callback fn to run when when anim completes
  jsOnly: _propTypes2.default.bool, // apply JS animation, regardless of browser
  children: _propTypes2.default.node };
MtSvgLines.defaultProps = {
  className: 'mt-svg',
  animate: false,
  duration: 1000,
  stagger: 0,
  timing: 'ease',
  playback: 'forwards',
  fade: false,
  callback: function callback() {},
  jsOnly: false
};
exports.default = MtSvgLines;