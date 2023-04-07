import React, { Component, useEffect, useState } from "react";
import Button from "../Button/Button";
import TextArea from "../TextAre/Textarea";

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


interface InterColorModalProps {
  isShow:boolean,
  onSelect: (string:string) => any
}

interface InterAddCommentProps {
  isShow:boolean,
}
interface InterAddCardProps {
  isShow:boolean,
}

// ColorModal 
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
    <>
    {isShow && 
      (
        <div className="color-console" >
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
    </>
  )
}


// AddComment
const AddComment: React.FC<InterAddCommentProps> = (props) => {
  const { isShow } = props;

  return (
    <>
      {
        isShow && (
          <div className="comment-console">
                <TextArea 
                   placeholder="Common" 
                   className="text-input"
                   height={100}
                   onChange={(e)=>{
                    console.log(e.target.value);
                   }}
                   ></TextArea>
                 <Button onClick={()=>{
                    console.log('Save')
                  }} >SAVE</Button>
          </div>  
        )
      }    
    </>
  )
}

// AddCard
const AddCard: React.FC<InterAddCardProps> = (props) => {
  const { isShow } = props;
  return (
    <>
    {
      isShow && (
      <div className="card-console">
          <TextArea 
                  placeholder="TItle" 
                  className="text-input-title"
                  height={50}
                  onChange={(e)=>{
                  console.log(e.target.value);
                  }}
                  ></TextArea>

              <TextArea 
                  placeholder="Content" 
                  className="text-input"
                  height={100}
                  onChange={(e)=>{
                  console.log(e.target.value);
                  }}
                  ></TextArea>
                <Button   onClick={()=>{
                  console.log('Save')
                }} >SAVE</Button>
        </div>  
      )
    }
    </>
  )
}

// HoverModal
interface InterHoverModalShow {
  showColorConsole: boolean
  showCommentConsole: boolean
  showCardConsole: boolean
}
interface InterHoverModalData {
  colors: string
  comment: string
  card: {
    title: string,
    content: string
  }
}
const HoverModal = (props:any) => {

  const [ consoleShow, setConsoleShow ] = useState<InterHoverModalShow>({
    showCardConsole:false,
    showColorConsole:false,
    showCommentConsole:false
  });

  const [data, setData]= useState<InterHoverModalData>({
    colors:'',
    comment:'',
    card: {
      title: '',
      content: ''
    }
  })

  const changeShowConsole = (type: 'color' | 'comment' | 'card') => {
    switch (type) {
      case 'color':
        setConsoleShow({
          ...consoleShow,
          showColorConsole: !consoleShow.showColorConsole
        })
        break;

        case 'comment':
          setConsoleShow({
            ...consoleShow,
            showCommentConsole: !consoleShow.showCommentConsole
          })
        
        break;

        case 'card':
          setConsoleShow({
            ...consoleShow,
            showCardConsole: !consoleShow.showCommentConsole
          })        
        break;
    
      default:
        break;
    }
  }
  
  return (
    <div className="hover-modal">
      <ColorModal isShow={consoleShow.showColorConsole} onSelect={()=>{}}></ColorModal>
      <AddComment isShow={consoleShow.showCommentConsole}></AddComment>
      <AddCard isShow={consoleShow.showCardConsole}></AddCard>
      
      <div className="line-content">
        <div className="icon fist-icon" onClick={()=> changeShowConsole('color')}>
          <span>笔刷</span>
        </div>

        <div className="icon" onClick={()=> changeShowConsole('comment')}>
          <span>评论</span>
        </div>

        <div className="icon" onClick={()=> changeShowConsole('card')}>
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
