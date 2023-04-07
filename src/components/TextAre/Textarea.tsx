import React, { } from 'react';
import './Textarea.css'


export interface BaseElementAttrProps {
  style: React.CSSProperties,
  className:string,
  children: JSX.Element,
  height: number,
}

interface InterButtonProps extends Partial<BaseElementAttrProps> {
  onChange?: (e:React.ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder?: string,
  type?:"primary" | 'guest'
} 

const TextArea:React.FC<InterButtonProps> = (props) => {
  const { className, style, type = 'primary', placeholder, onChange = () => {}, height } = props
  return  (
    <div className={`textarea-warp ${className}`} style={style}>
       <textarea 
       style={{height:height }}
        onChange={onChange} 
        placeholder={placeholder}  
        className={`textarea ${type}`} ></textarea>
    </div>
  )
}

export default TextArea