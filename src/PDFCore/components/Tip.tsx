import React, { Component, useLayoutEffect, useState } from "react";
import "../style/Tip.css";

interface InterData {
  compact: boolean;
  text: string;
  emoji: string;
}

interface InterTipProps {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

const Tip:React.FC<InterTipProps> = (props) => {
  const {onUpdate, onOpen, onConfirm} = props;
  const [data, setData] = useState<InterData>({
    compact: true,
    text: "",
    emoji: "",
  });

  useLayoutEffect(()=>{
    onUpdate && onUpdate();
  },[data.compact, data.text, data.emoji]);
  
  return (
    <div className="Tip">
        {data.compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen && onOpen();
              setData({
                ...data,
                compact:false
              })
            }}
          >
            Add highlight
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({
                text:data.text,
                emoji:data.emoji,
              })
            }}
          >
            <div>
              <textarea
                placeholder="Your comment"
                autoFocus
                value={data.text}
                onChange={(event) =>
                  setData({
                    ...data,
                    text:event.target.value
                  })
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
                        setData({
                          ...data,
                          emoji:event.target.value
                        })
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

export { Tip }
export default Tip;
