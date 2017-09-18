import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
  block: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  viewBox: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object
}

export const DEFAULT_SIZE = 24
export const DEFAULT_COLOR = '#485461'

/*
 * Universal component wrapper for SVG icons, by @moarwick
 *
 * Renders SVG content within a <span> wrapper and dynamically applies
 * inline styles for extra sizing and positioning control per props.
 * If custom 'width' or 'height' supplied, ensures correct aspect ratio.
 */
function SvgIcon({
  children,
  block = false,
  height,
  width,
  offsetX = 0,
  offsetY = 0,
  viewBox = `0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`,
  onClick,
  style = {}
}) {
  const isStyleWidth = 'width' in style
  const wrapperStyles = getWrapperStyles({ block, isStyleWidth, height, width, viewBox })
  const svgStyles = getSvgStyles(offsetX, offsetY, onClick);

  return (
    <span style={{ ...wrapperStyles, ...style }}>
      <svg viewBox={viewBox}>{/* dummy svg to hold size */}</svg>
      <svg viewBox={viewBox} style={svgStyles} onClick={onClick}>
        {children}
      </svg>
    </span>
  )
}

SvgIcon.propTypes = propTypes

export default SvgIcon

/**
 * Generate inline styles for wrapper span
 */
function getWrapperStyles({ block, isStyleWidth, height, width, viewBox }) {
  const ratio = getViewBoxRatio(viewBox)
  const display = block ? 'block' : 'inline-block'
  const styles = { display, position: 'relative', verticalAlign: 'middle' }

  if (!isStyleWidth) {
    // default icon height to 24
    if (!height && !width) {
      height = DEFAULT_SIZE
    }

    // expect dimensions as numbers, in pixels
    if (width && typeof width !== 'number') {
      width = parseInt(width, 10)
    }

    if (height && typeof height !== 'number') {
      height = parseInt(height, 10)
    }

    // use viewBox ratio to calc missing width or height
    if (height && !width) {
      width = (height * ratio).toFixed(1)
    }

    if (width && !height) {
      height = (width / ratio).toFixed(1)
    }

    styles.width = `${width}px`
    styles.height = `${height}px`
  }

  return styles
}

/**
 * Generate styles for svg tag
 * Positioned absolutely within the wrapper, to allow for X/Y offsetting
 */
function getSvgStyles(offsetX = 0, offsetY = 0, onClick = null) {
  return {
    position: 'absolute',
    zIndex: 1,
    left: offsetX,
    top: offsetY,
    ...(onClick ? { cursor: 'pointer' } : {})
  }
}

/**
 * Calc aspect ratio from the viewBox coords
 */
function getViewBoxRatio(viewBox) {
  const [x1, y1, x2, y2] = viewBox.split(' ').map(el => parseInt(el, 10) || 0)
  return (x2 - x1) / (y2 - y1) || 1
}

/**
 * Common propTypes used by all icons
 */
export const iconPropTypes = {
  color: PropTypes.string,
  block: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  style: PropTypes.object
}
