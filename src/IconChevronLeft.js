import React from 'react'
import SvgIcon, { DEFAULT_COLOR, iconPropTypes } from './SvgIcon'

const IconChevronLeft = ({ color = DEFAULT_COLOR, width = 24, ...rest }) => (
  <SvgIcon {...rest} viewBox="0 0 512 512" width={width}>
    <g fill={color}>
      <polygon points="158.11,256 308.95,106 321.89,118.87 183.99,256 321.89,393.13 308.95,406" />
      <path d="M510,256c0,140.28-113.72,254-254,254S2,396.28,2,256S115.72,2,256,2S510,115.72,510,256z M256,20 C125.66,20,20,125.66,20,256s105.66,236,236,236s236-105.66,236-236S386.34,20,256,20z" />
    </g>
  </SvgIcon>
)

IconChevronLeft.propTypes = iconPropTypes

export default IconChevronLeft
