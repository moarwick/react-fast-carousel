'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextTween = getNextTween;
exports.throttleEvent = throttleEvent;
/*
 * Apply easing to "tweened" value
 * Given the from-to range, duration, and an easing function, calculates the next tween value (~60fps)
 * Returns an object containing the result as both linear and eased values, plus current progress (0-1)
 * Adapted from https://github.com/moarwick/react-svg-kit/blob/master/src/tweenUtils.js
 */
function getNextTween(val, from, to, duration, easingFn) {
  var result = {
    linear: to,
    eased: to,
    progress: null

    // skip calcs if from and to vals are the same (nothing to interpolate)
  };if (from !== to) {
    var dir = to > from ? 1 : -1;
    var range = Math.abs(to - from);
    var step = range / (duration / 16.66); // assume ~60fps

    var nextVal = val + step * dir;
    var pct = Math.min(1, Math.abs(nextVal - from) / range);

    var easedPct = typeof easingFn === 'function' ? easingFn(pct) : pct;

    var newVal = range * pct;
    var newValEased = range * easedPct;

    result.linear = pct < 1 ? from + dir * newVal : to;
    result.eased = pct < 1 ? from + dir * newValEased : to;
    result.progress = pct;
  }

  return result;
}

/**
 * Set up a "throttled" event
 * from https://developer.mozilla.org/en-US/docs/Web/Events/scroll
 *
 * Example Usage:
 *    componentDidMount:
 *      if ( this._el ) {
 *        throttleEvent( "scroll", "throttledScroll", this._el );
 *        this._el.addEventListener( "throttledScroll", this._handleScroll );
 *        this._handleScroll();
 *
 *    componentWillUnmount:
 *      if ( this._el ) {
 *        this._el.removeEventListener( "throttledScroll", this._handleScroll );
 *
 * Used in: https://gist.github.com/moarwick/74ec6841426759564a8ea2210d306abb
 */
function throttleEvent(type, name, obj) {
  var running = false;
  var func = function func() {
    if (running) {
      return;
    }
    running = true;
    window.requestAnimationFrame(function () {
      obj.dispatchEvent(new window.CustomEvent(name));
      running = false;
    });
  };
  obj = obj || window;
  obj.addEventListener(type, func);
}