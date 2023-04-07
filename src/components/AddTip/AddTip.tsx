import React, { Component, useEffect, useState } from "react";

import "./AddTip.css";

interface State {
  compact: boolean;
  text: string;
  emoji: string;
}

interface InterAddTpsProps {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

// ColorModal 
interface InterColorModalProps {
  isShow:boolean,
  onSelect: (string:string) => any
}

const ColorModal: React.FC<InterColorModalProps> = (props) => {
  const { isShow, onSelect } = props
  const colors = [
    '#FFFF00',
    '#FF0000',
    '#00CA79',
    '#FF5E00',
    '#82FF6B',
    '#007500',
    '#83CBFC',
    '#8E00ED',
    '#F6829D',
    '#F85B6B',
    '#70D7AC',
    '#C7C7C7',
  ];

  return (
    <div className="color-console" style={{
      visibility: !isShow ?  "hidden" : 'unset'
    }} >
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((item,indx) => {
        return (
          <div key={item}  className="item">
            <div  className="colors" style={{backgroundColor: colors[indx]}}></div>
          </div>
          
        )
      })} 
    </div>
  )
}

// HoverModal
const HoverModal = () => {
  return (
    <div className="hover-modal">
      {/* Modal */}
      <ColorModal isShow onSelect={()=>{}}></ColorModal>
      {/* <div></div> */}
      {/* content */}
      <div className="line-content">
        <div className="icon fist-icon">
          <span>笔刷</span>
        </div>

        <div className="icon">
          <span>评论</span>
        </div>

        <div className="icon">
          <span>卡片</span>
        </div>

        <div className="icon">
          <span>复制</span>
        </div>

      </div>
    </div>
  )
}


const AddTip:React.FC<InterAddTpsProps> = (props) => {
  const {
    onConfirm,
    onOpen,
    onUpdate
  } = props

  const [compact, setCompact] = useState(true);
  const [data,setData] = useState({
    text:'',
    emoji:''
  });

  useEffect(() => {
    onUpdate && onUpdate();
  }, [compact])
  
  return  (
      <div className="Tip">
        {compact ? (
          /**
<div
    className="Tip__compact"
    onClick={() => {
      onOpen();
      this.setState({ compact: false });
    }}
  >
    Add highlight
  </div>
           */
          <HoverModal />
        ) : (
          <form
            className="Tip__card"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text:data.text, emoji:data.emoji });
            }}
          >
            <div>
              <textarea
                placeholder="Your comment"
                autoFocus
                value={data.text}
                onChange={(event) =>
                  setData({...data, text: event.target.value})
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              <div>
                {["💩", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => (
                  <label key={_emoji}>
                    <input
                      checked={data.emoji === _emoji}
                      type="radio"
                      name="emoji"
                      value={_emoji}
                      onChange={(event) =>
                        setData({...data, emoji: event.target.value})
                      }
                    />
                    {_emoji}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
  )
}

export default AddTip;
