import React, {FC} from 'react';
import {Rnd, RndResizeCallback, RndDragCallback} from 'react-rnd';
import {getPageFromElement} from '../lib/pdfjs-dom';
import '../style/AreaHighlight.css';
import type {LTWHP, ViewportHighlight} from '../types';

interface Props {
  highlight: ViewportHighlight;
  onChange: (rect: LTWHP) => void;
  isScrolledTo: boolean;
}

const AreaHighlight: FC<Props> = ({highlight, onChange, isScrolledTo, ...otherProps}) => {
  const handleDragStop: RndDragCallback = (_, data) => {
    const boundingRect: LTWHP = {
      ...highlight.position.boundingRect,
      top: data.y,
      left: data.x,
    };
    onChange(boundingRect);
  };

  const handleResizeStop: RndResizeCallback = (_mouseEvent, _direction, ref, _delta, position) => {
    const boundingRect: LTWHP = {
      top: position.y,
      left: position.x,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      pageNumber: getPageFromElement(ref)?.number || -1,
    };
    onChange(boundingRect);
  };

  const handleClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div className={`AreaHighlight ${isScrolledTo ? 'AreaHighlight--scrolledTo' : ''}`}>
      <Rnd
        className="AreaHighlight__part"
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        position={{
          x: highlight.position.boundingRect.left,
          y: highlight.position.boundingRect.top,
        }}
        size={{
          width: highlight.position.boundingRect.width,
          height: highlight.position.boundingRect.height,
        }}
        onClick={handleClick}
        {...otherProps}
      />
    </div>
  );
};

export {AreaHighlight};
export default AreaHighlight;
