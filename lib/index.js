'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _IconChevronRight = require('./IconChevronRight');

var _IconChevronRight2 = _interopRequireDefault(_IconChevronRight);

var _IconChevronLeft = require('./IconChevronLeft');

var _IconChevronLeft2 = _interopRequireDefault(_IconChevronLeft);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Easing funs
var easeInOutQuad = function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
var easeOutQuad = function easeOutQuad(t) {
  return t * (2 - t);
};

/**
 * NavPane
 */
var NavPane = function NavPane(_ref) {
  var color = _ref.color,
      iconColor = _ref.iconColor,
      left = _ref.left,
      onClick = _ref.onClick,
      size = _ref.size;

  var leftPct = left ? 0 : 100 - size;
  var navStyles = _extends({}, styles.navPane, {
    backgroundColor: color,
    left: leftPct + '%',
    width: size + '%'
  });

  return _react2.default.createElement(
    'a',
    { href: '', onClick: onClick, style: navStyles },
    left && _react2.default.createElement(_IconChevronLeft2.default, { color: iconColor, style: styles.chevronIcon }),
    !left && _react2.default.createElement(_IconChevronRight2.default, { color: iconColor, style: styles.chevronIcon })
  );
};

/**
 * ScrollbarCarousel
 */

var ScrollbarCarousel = function (_Component) {
  _inherits(ScrollbarCarousel, _Component);

  function ScrollbarCarousel(props) {
    _classCallCheck(this, ScrollbarCarousel);

    var _this = _possibleConstructorReturn(this, (ScrollbarCarousel.__proto__ || Object.getPrototypeOf(ScrollbarCarousel)).call(this, props));

    _this.setScrollInfo = function () {
      _this.slideWidth = _this.el.scrollWidth / _this.props.slides.length; // current width of individual slide items
      _this.scrollPos = _this.el.scrollLeft; // current scroll position
      var slideNum = Math.floor(_this.scrollPos / _this.slideWidth + 0.51); // current slide, use halfway point as threshold

      _this.setState({ slideNum: slideNum });
    };

    _this.state = {
      slideNum: 0
    };

    _this.el = null;
    _this.slideWidth = 0;
    _this.scrollPos = 0;
    _this.isTweening = false;
    _this.reqAnimFrame = null;
    return _this;
  }

  _createClass(ScrollbarCarousel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _utils.throttleEvent)('scroll', 'throttledScroll', this.el);
      this.el.addEventListener('throttledScroll', this.setScrollInfo);
      window.addEventListener('resize', this.setScrollInfo, false);
      this.setScrollInfo();
      this.animateToSlide(this.props.slideNum, true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.cancelAnimationFrame(this.reqAnimFrame);
      this.el.removeEventListener('throttledScroll', this.setScrollInfo);
      window.removeEventListener('resize', this.setScrollInfo, false);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (nextProps.slideNum !== this.props.slideNum) {
        this.animateToSlide(nextProps.slideNum, true);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.slides || !this.props.slides.length) {
        return null;
      }

      var slideNum = this.state.slideNum;
      var _props = this.props,
          navColor = _props.navColor,
          navIconColor = _props.navIconColor,
          navInset = _props.navInset,
          navSize = _props.navSize,
          slides = _props.slides,
          slidesShown = _props.slidesShown;


      var contentStyles = navInset ? styles.content : _extends({}, styles.content, { width: 100 - navSize * 2 + '%', marginLeft: navSize + '%' });

      var renderedSlides = this.renderSlides();

      var navProps = { color: navColor, iconColor: navIconColor, size: navSize };
      var isLeftNav = slideNum > 0;
      var isRightNav = slideNum < slides.length - slidesShown;

      return _react2.default.createElement(
        'div',
        { style: _extends({}, styles.container, this.props.style) },
        _react2.default.createElement(
          'div',
          { ref: function ref(el) {
              return _this2.el = el;
            }, style: contentStyles },
          renderedSlides
        ),
        isLeftNav && _react2.default.createElement(NavPane, _extends({}, navProps, { left: true, onClick: this.handleNavClick(-1) })),
        isRightNav && _react2.default.createElement(NavPane, _extends({}, navProps, { onClick: this.handleNavClick(1) }))
      );
    }
  }, {
    key: 'renderSlides',
    value: function renderSlides() {
      var _props2 = this.props,
          slides = _props2.slides,
          slidesShown = _props2.slidesShown;

      var slideWidth = 100 / slidesShown + '%';

      return slides.map(function (slide, index) {
        return _react2.default.createElement(
          'span',
          { key: index, style: _extends({}, styles.slideWrapper, { width: slideWidth }) },
          slide
        );
      });
    }

    /* ----- HANDLERS ----- */

  }, {
    key: 'handleNavClick',
    value: function handleNavClick(dir) {
      var _this3 = this;

      return function (e) {
        e.preventDefault();
        var slidesShown = _this3.props.slidesShown;

        var addSlides = _this3.isTweening ? slidesShown : 0; // increment if user keeps clicking in mid-tween
        var toSlideNum = _this3.state.slideNum + (slidesShown + addSlides) * dir;
        _this3.animateToSlide(toSlideNum);
      };
    }

    /* ----- HELPERS ----- */

    /**
     * Apply "tweening" to el.scrollLeft to smoothly scroll slides to N slide's position
     */

  }, {
    key: 'animateToSlide',
    value: function animateToSlide(slideNum) {
      var _this4 = this;

      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var easingFn = this.isTweening ? easeOutQuad : easeInOutQuad;
      var fromPos = this.scrollPos;
      var toPos = slideNum * this.slideWidth;

      window.cancelAnimationFrame(this.reqAnimFrame);

      if (instant) {
        this.el.scrollLeft = toPos;
        return;
      }

      var tweenPos = fromPos; // init tween value
      var tweenDur = 200 * this.props.slidesShown;
      this.isTweening = true;

      var animateScroll = function animateScroll() {
        _this4.reqAnimFrame = window.requestAnimationFrame(function () {
          var nextTween = (0, _utils.getNextTween)(tweenPos, fromPos, toPos, tweenDur, easingFn);

          _this4.el.scrollLeft = nextTween.eased; // this also fires a scroll event, thus setScrollInfo()
          tweenPos = nextTween.linear; // store linear value for next tween update

          if (nextTween.progress < 1) {
            animateScroll(); // call next tween update..
          } else {
            _this4.isTweening = false; // done!
          }
        });
      };

      animateScroll();
    }

    /**
     * Acquire and set sizing & scroll info into instance vars
     * Set current slideNum to state to re-render nav panes
     * Gets run on every "scroll" and "resize" event
     */

  }]);

  return ScrollbarCarousel;
}(_react.Component);

/* ----- STYLES ----- */

ScrollbarCarousel.propTypes = {
  navColor: _propTypes2.default.string,
  navIconColor: _propTypes2.default.string,
  navInset: _propTypes2.default.bool,
  navSize: _propTypes2.default.number,
  slideNum: _propTypes2.default.number,
  slides: _propTypes2.default.arrayOf(_propTypes2.default.element),
  slidesShown: _propTypes2.default.number,
  style: _propTypes2.default.object
};
ScrollbarCarousel.defaultProps = {
  navColor: 'rgba(255,255,255,0.8)',
  navIconColor: '#0275d8',
  navInset: false,
  navSize: 10,
  slideNum: 0,
  slides: [],
  slidesShown: 1,
  style: {}
};
exports.default = ScrollbarCarousel;
var styles = {
  container: {
    position: 'relative'
  },
  content: {
    overflowX: 'scroll',
    paddingBottom: 15,
    whiteSpace: 'nowrap'
  },
  slideWrapper: {
    display: 'inline-block'
  },
  navPane: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    height: '100%',
    zIndex: 1
  },
  chevronIcon: {
    width: '66.66%'
  }
};