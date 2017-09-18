import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconChevronRight from './IconChevronRight'
import IconChevronLeft from './IconChevronLeft'
import { getNextTween, throttleEvent } from './utils'

// Easing funs
const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
const easeOutQuad = t => t * (2 - t)

/**
 * NavPane
 */
const NavPane = ({ color, iconColor, left, onClick, size }) => {
  const leftPct = left ? 0 : 100 - size
  const navStyles = {
    ...styles.navPane,
    backgroundColor: color,
    left: `${leftPct}%`,
    width: `${size}%`
  }

  return (
    <a href="" onClick={onClick} style={navStyles}>
      {left && <IconChevronLeft color={iconColor} style={styles.chevronIcon} />}
      {!left && <IconChevronRight color={iconColor} style={styles.chevronIcon} />}
    </a>
  )
}

/**
 * ScrollbarCarousel
 */
export default class ScrollbarCarousel extends Component {
  static propTypes = {
    navColor: PropTypes.string,
    navIconColor: PropTypes.string,
    navInset: PropTypes.bool,
    navSize: PropTypes.number,
    slideNum: PropTypes.number,
    slides: PropTypes.arrayOf(PropTypes.element),
    slidesShown: PropTypes.number,
    style: PropTypes.object
  }

  static defaultProps = {
    navColor: 'rgba(255,255,255,0.8)',
    navIconColor: '#0275d8',
    navInset: false,
    navSize: 10,
    slideNum: 0,
    slides: [],
    slidesShown: 1,
    style: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      slideNum: 0
    }

    this.el = null
    this.slideNum = 0
    this.slideWidth = 0
    this.scrollPos = 0
    this.isTweening = false
    this.reqAnimFrame = null
  }

  componentDidMount() {
    throttleEvent('scroll', 'throttledScroll', this.el)
    this.el.addEventListener('throttledScroll', this.setScrollInfo)
    window.addEventListener('resize', this.setScrollInfo, false)
    this.setScrollInfo()
    this.animateToSlide(this.props.slideNum, true)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.reqAnimFrame)
    this.el.removeEventListener('throttledScroll', this.setScrollInfo)
    window.removeEventListener('resize', this.setScrollInfo, false)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.slideNum !== this.props.slideNum) {
      this.animateToSlide(nextProps.slideNum, true)
    }
  }

  render() {
    if (!this.props.slides || !this.props.slides.length) {
      return null
    }

    const { slideNum } = this.state
    const { navColor, navIconColor, navInset, navSize, slides, slidesShown } = this.props

    const contentStyles = navInset
      ? styles.content
      : { ...styles.content, width: `${100 - navSize * 2}%`, marginLeft: `${navSize}%` }

    const renderedSlides = this.renderSlides()

    const navProps = { color: navColor, iconColor: navIconColor, size: navSize }
    const isLeftNav = slideNum > 0
    const isRightNav = slideNum < slides.length - slidesShown

    return (
      <div style={{ ...styles.container, ...this.props.style }}>
        <div ref={el => (this.el = el)} style={contentStyles}>
          {renderedSlides}
        </div>
        {isLeftNav && <NavPane {...navProps} left onClick={this.handleNavClick(-1)} />}
        {isRightNav && <NavPane {...navProps} onClick={this.handleNavClick(1)} />}
      </div>
    )
  }

  renderSlides() {
    const { slides, slidesShown } = this.props
    const slideWidth = 100 / slidesShown + '%'

    return slides.map((slide, index) => (
      <span key={index} style={{ ...styles.slideWrapper, width: slideWidth }}>
        {slide}
      </span>
    ))
  }

  /* ----- HANDLERS ----- */

  handleNavClick(dir) {
    return e => {
      e.preventDefault()
      const { slidesShown } = this.props
      const addSlides = this.isTweening ? slidesShown : 0 // increment if user keeps clicking in mid-tween
      const toSlideNum = Math.round(this.slideNum + (slidesShown + addSlides - 0.49) * dir)
      this.animateToSlide(toSlideNum)
    }
  }

  /* ----- HELPERS ----- */

  /**
   * Apply "tweening" to el.scrollLeft to smoothly scroll slides to N slide's position
   */
  animateToSlide(slideNum, instant = false) {
    const easingFn = this.isTweening ? easeOutQuad : easeInOutQuad
    const fromPos = this.scrollPos
    const toPos = slideNum * this.slideWidth

    window.cancelAnimationFrame(this.reqAnimFrame)

    if (instant) {
      this.el.scrollLeft = toPos
      return
    }

    let tweenPos = fromPos // init tween value
    const tweenDur = 200 * this.props.slidesShown
    this.isTweening = true

    const animateScroll = () => {
      this.reqAnimFrame = window.requestAnimationFrame(() => {
        const nextTween = getNextTween(tweenPos, fromPos, toPos, tweenDur, easingFn)

        this.el.scrollLeft = nextTween.eased // this also fires a scroll event, thus setScrollInfo()
        tweenPos = nextTween.linear // store linear value for next tween update

        if (nextTween.progress < 1) {
          animateScroll() // call next tween update..
        } else {
          this.isTweening = false // done!
        }
      })
    }

    animateScroll()
  }

  /**
   * Acquire and set carousel sizing & scroll info into instance vars and set state to re-render
   * Gets run on every "scroll" and "resize" event
   */
  setScrollInfo = () => {
    this.slideWidth = this.el.scrollWidth / this.props.slides.length // width of individual slide item
    this.scrollPos = this.el.scrollLeft // current scroll position
    this.slideNum = this.scrollPos / this.slideWidth // current slide num (zero index, float)

    // internal slideNum (float) is used to show/hide chevrons only
    this.setState({
      slideNum: Math.floor(this.slideNum + 0.51) // used as halfway point threshold
    })
  }
}

/* ----- STYLES ----- */

const styles = {
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
}
