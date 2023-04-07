import React, { } from 'react';

import './Button.css';

export interface BaseElementAttrProps {
  style: React.CSSProperties,
  className:string,
  children: JSX.Element | string
}

interface InterButtonProps extends Partial<BaseElementAttrProps> {
  onClick?: () => void
  type?:"primary" | 'guest'
} 

const Button:React.FC<InterButtonProps> = (props) => {
  const { type = "primary",onClick = () => {}, } = props

  return  (
    <div className='button-wrap' onClick={onClick}>
      <button className={`button ${type}`}>{props.children}</button>
    </div>
  )
}

export default Button