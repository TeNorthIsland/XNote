import React, { Component, useEffect, useLayoutEffect, useState } from "react";
import Button from "../Button/Button";
import TextArea from "../TextAre/Textarea";
import Popover from '@mui/material/Popover';
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
        <div id="color-console" className="color-console" >
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
          <div id="comment-console" className="comment-console">
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
      <div id="card-console" className="card-console">
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

const AddTip:React.FC<InterAddTpsProps> = (props) => {
  
  const { onOpen } = props
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
  const [height, setHeight] = useState(0);

  const changeShowConsole = (type: 'color' | 'comment' | 'card') => {
    onOpen && onOpen();
    switch (type) {
      case 'color':
        setConsoleShow({
          showCardConsole:false,
          showCommentConsole:false,
          showColorConsole: !consoleShow.showColorConsole
        })
        break;

        case 'comment':
          setConsoleShow({
            showCardConsole:false,
            showCommentConsole: !consoleShow.showCommentConsole,
            showColorConsole: false
          })
        
        break;

        case 'card':
          setConsoleShow({
            showCardConsole: !consoleShow.showCardConsole,
            showCommentConsole:false,
            showColorConsole: false
          })        
        break;
    
      default:
        break;
    }
  }
  
  const getConsoleHeight = () => {
    
    const consoleMap = {
      showColorConsole:document.querySelector('#color-console')!,
      showCommentConsole:document.querySelector('#comment-console')!,
      showCardConsole:document.querySelector('#card-console')!,
    };

    const height = ():number => {
      if(consoleShow?.showCardConsole) {
        return consoleMap?.showCardConsole?.clientHeight || 0
      }
      if(consoleShow?.showColorConsole) {
        return consoleMap?.showColorConsole?.clientHeight || 0
      }
      if(consoleShow?.showCommentConsole) {
        return consoleMap?.showCommentConsole?.clientHeight || 0
      }
      return 0
    };

    setHeight(-(height() + 10 ))
  }
  
  useLayoutEffect(()=>{
    getConsoleHeight()
  },[consoleShow.showCardConsole, consoleShow.showColorConsole, consoleShow.showCommentConsole]);

  return (
    <div className="hover-modal" >
      <div className="console" style={{
        position:'absolute',
        top:height
      }} >
        <ColorModal isShow={consoleShow.showColorConsole} onSelect={()=>{}}></ColorModal>
        <AddComment isShow={consoleShow.showCommentConsole}></AddComment>
        <AddCard isShow={consoleShow.showCardConsole}></AddCard>
      </div>
      
      <div id="line-content" className="line-content">
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

export default AddTip;
