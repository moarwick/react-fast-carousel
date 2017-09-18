import React from 'react'

import FastCarousel from '../index.js'

import image0 from './img/image-00.jpeg'
import image1 from './img/image-01.jpeg'
import image2 from './img/image-02.jpeg'
import image3 from './img/image-03.jpeg'
import image4 from './img/image-04.jpeg'
import image5 from './img/image-05.jpeg'
import image6 from './img/image-06.jpeg'
import image7 from './img/image-07.jpeg'
import image8 from './img/image-08.jpeg'
import image9 from './img/image-09.jpeg'

const images = {
  0: image0,
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
  7: image7,
  8: image8,
  9: image9
}

function rescaleNum(a, aMin, aMax, bMin, bMax) {
  return (a - aMin) / ((aMax - aMin) / (bMax - bMin)) + bMin
}

/**
 * Individual Slide
 */
const DemoSlide = ({ index, total }) => {
  const imageKey = index % 10
  const opacity = rescaleNum(index, 0, total, 0.25, 1)
  const bgColor = `rgba(0, 0, 0, ${opacity})`
  const slideStyles = { ...styles.demoSlide, backgroundColor: bgColor }

  return (
    <div style={slideStyles}>
      <img src={images[imageKey]} style={styles.demoSlideImage} />
      <p>Slide {index}</p>
    </div>
  )
}

/**
 * Label + Input
 */
const Input = ({ checkbox, checked, label, value, onChange }) => {
  return (
    <label style={styles.inputWrapper}>
      <div style={styles.label}>{label}</div>
      {!checkbox && <input type="number" value={value} onChange={onChange} style={styles.input} />}
      {checkbox && (
        <input
          type="checkbox"
          checked={checked}
          value={value}
          onChange={onChange}
          style={styles.input}
        />
      )}
    </label>
  )
}

/**
 * React-Fast-Carousel Demo
 */
export default class CarouselDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      navInset: true,
      navSize: 10,
      slidesTotal: 30,
      slidesShown: 3,
      slideNum: 5
    }
  }

  render() {
    const { navInset, navSize, slidesTotal, slidesShown, slideNum } = this.state
    const slides = [...Array(slidesTotal || 1)].map((v, i) => (
      <DemoSlide key={i} index={i} total={slidesTotal} />
    ))

    return (
      <div>
        <div style={styles.container}>
          <a href='https://github.com/moarwick/react-fast-carousel' style={styles.headerLink}>
            <h1 style={styles.header}>REACT FAST CAROUSEL</h1>
          </a>

          <div style={styles.controls}>
            <Input
              value={slidesTotal}
              label="Num of Slides"
              onChange={this.handleInputChange('slidesTotal', 1, 100)}
            />
            <Input
              value={slidesShown}
              label="Slides Shown"
              onChange={this.handleInputChange('slidesShown', 1, 10)}
            />
            <Input
              value={slideNum}
              label="Slide Num"
              onChange={this.handleInputChange('slideNum', 0, slidesTotal)}
            />
            <Input
              value={navSize}
              label="Nav Size"
              onChange={this.handleInputChange('navSize', 1, 50)}
            />
            <Input
              checkbox
              checked={navInset}
              value="navInset"
              label="Inset Nav"
              onChange={this.handleInputChange('navInset', 0, slidesTotal, true)}
            />
          </div>

          <FastCarousel
            navInset={navInset}
            navSize={navSize}
            slides={slides}
            slidesShown={slidesShown || 1}
            slideNum={slideNum || 0}
          />
        </div>
      </div>
    )
  }

  handleInputChange = (key, min, max, isCheckbox) => e => {
    let value = isCheckbox ? e.target.checked : e.target.value

    if (!isCheckbox && value !== '') {
      const num = parseInt(e.target.value, 10) || 0
      value = Math.max(min, Math.min(num, max))
    }

    this.setState({ [key]: value })
  }
}

/* ----- STYLES ----- */

const COLOR_PRIMARY = '#4636bc'
const COLOR_ACCENT = '#d1cdec'

const styles = {
  container: {
    width: '100%',
    minWidth: 480,
    maxWidth: 960,
    margin: '0 auto',
    textAlign: 'center'
  },
  headerLink: {
    textDecoration: 'none'
  },
  header: {
    color: COLOR_PRIMARY,
    fontSize: 48,
    fontWeight: 'normal'
  },
  controls: {
    backgroundColor: COLOR_ACCENT,
    borderRadius: 5,
    marginBottom: 30,
    padding: '10px 10px 20px',
  },
  inputWrapper: {
    color: COLOR_PRIMARY,
    display: 'inline-block',
    textAlign: 'center',
    width: '20%'
  },
  input: {
    border: '1px solid gray',
    borderRadius: 4,
    fontSize: 20,
    height: 20,
    maxWidth: '90%',
    padding: '10px 0',
    textAlign: 'center'
  },
  demoSlide: {
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    height: '100%',
    width: '100%'
  },
  demoSlideImage: {
    width: '100%'
  }
}
