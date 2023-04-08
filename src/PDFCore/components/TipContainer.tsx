import React, { Component, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { LTWHP } from "../types";

interface State {
  height: number;
  width: number;
}

interface InterTipContainerProps {
  children: JSX.Element | null;
  style: { top: number; left: number; bottom: number };
  scrollTop: number;
  pageBoundingRect: LTWHP;
}

const clamp = (value: number, left: number, right: number) =>
  Math.min(Math.max(value, left), right);

const TipContainer:React.FC<InterTipContainerProps> = (props) => {
  const {children, style, scrollTop, pageBoundingRect} = props;
  const _nodeRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState({
    height: 0,
    width: 0,
  });
  
  useLayoutEffect(()=>{
    updatePosition();
  }, [styles.height, styles.width]);

  const updatePosition = () => {
    if (!_nodeRef) {
      return;
    }

    const { offsetHeight, offsetWidth } = _nodeRef.current!;

    setStyles({
      height: offsetHeight,
      width: offsetWidth,
    });
  };

  const isStyleCalculationInProgress = styles.width === 0 && styles.height === 0;

  const shouldMove = style.top - styles.height - 5 < scrollTop;

  const top = shouldMove ? style.bottom + 5 : style.top - styles.height - 5;

  const left = clamp(
    style.left - styles.width / 2,
    0,
    pageBoundingRect.width - styles.width
  );

  const childrenWithProps = React.Children.map(children, (child) =>
    // @ts-ignore
    React.cloneElement(child, {
      onUpdate: () => {
        setStyles({
          height:0,
          width:0
        })
      },
      popup: {
        position: shouldMove ? "below" : "above",
      },
    })
  );

  return (
    <div
      className="PdfHighlighter__tip-container"
      style={{
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left,
      }}
      ref={_nodeRef}
    >
      {childrenWithProps}
    </div>
  );
}
export default TipContainer;
