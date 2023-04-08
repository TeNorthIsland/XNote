import React, {Component, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {asElement, isHTMLElement} from '../lib/pdfjs-dom';
import '../style/MouseSelection.css';

import type {LTWH} from '../types.js';

interface Coords {
  x: number;
  y: number;
}

interface InterData {
  locked: boolean;
  start: Coords | null;
  end: Coords | null;
}

interface InterMouseSelectionProps {
  onSelection: (startTarget: HTMLElement, boundingRect: LTWH, resetSelection: () => void) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  shouldStart: (event: MouseEvent) => boolean;
  onChange: (isVisible: boolean) => void;
}

const MouseSelection: React.FC<InterMouseSelectionProps> = (props) => {
  const {onDragEnd, onSelection, onDragStart, shouldStart, onChange} = props;

  const _rootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<InterData>({
    locked: false,
    start: null,
    end: null,
  });

  const reset = () => {
    onDragEnd && onDragEnd();
    setData({start: null, end: null, locked: false});
  };

  useEffect(() => {
    const {start, end} = data;
    const isVisible = Boolean(start && end);

    onChange(isVisible);
  }, [data.start, data.end]);

  const cb = (start: any, end: any, event: {target: any}, startTarget: HTMLElement, boundingRect: LTWH) => {
    if (!start || !end) {
      return;
    }

    if (isHTMLElement(event.target)) {
      onSelection(startTarget, boundingRect, reset);

      onDragEnd();
    }
  };

  const getBoundingRect = (start: Coords, end: Coords): LTWH => {
    return {
      left: Math.min(end.x, start.x),
      top: Math.min(end.y, start.y),

      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
  };

  useLayoutEffect(() => {
    if (!_rootRef.current) {
      return;
    }

    const container = asElement(_rootRef.current.parentElement);

    if (!isHTMLElement(container)) {
      return;
    }

    let containerBoundingRect: DOMRect | null = null;

    const containerCoords = (pageX: number, pageY: number) => {
      if (!containerBoundingRect) {
        containerBoundingRect = container.getBoundingClientRect();
      }

      return {
        x: pageX - containerBoundingRect.left + container.scrollLeft,
        y: pageY - containerBoundingRect.top + container.scrollTop - window.scrollY,
      };
    };

    container.addEventListener('mousemove', (event: MouseEvent) => {
      const {start, locked} = data;

      if (!start || locked) {
        return;
      }

      setData({
        ...data,
        end: containerCoords(event.pageX, event.pageY),
      });
    });

    container.addEventListener('mousedown', (event: MouseEvent) => {
      if (!shouldStart(event)) {
        reset();
        return;
      }

      const startTarget = asElement(event.target);
      if (!isHTMLElement(startTarget)) {
        return;
      }

      onDragStart();

      setData({
        start: containerCoords(event.pageX, event.pageY),
        end: null,
        locked: false,
      });

      const onMouseUp = (event: MouseEvent): void => {
        // emulate listen once
        event.currentTarget?.removeEventListener('mouseup', onMouseUp as EventListener);

        const {start} = data;

        if (!start) {
          return;
        }

        const end = containerCoords(event.pageX, event.pageY);

        const boundingRect = getBoundingRect(start, end);

        if (
          !isHTMLElement(event.target) ||
          !container.contains(asElement(event.target)) ||
          !shouldRender(boundingRect)
        ) {
          reset();
          return;
        }

        setData({
          ...data,
          end,
          locked: true,
        });

        cb(start, end, event, startTarget, boundingRect);
      };

      const {ownerDocument: doc} = container;
      if (doc.body) {
        doc.body.addEventListener('mouseup', onMouseUp);
      }
    });
  }, []);

  const shouldRender = (boundingRect: LTWH) => {
    return boundingRect.width >= 1 && boundingRect.height >= 1;
  };

  return (
    <div className="MouseSelection-container" ref={_rootRef}>
      {data.start && data.end ? <div className="MouseSelection" style={getBoundingRect(data.start, data.end)} /> : null}
    </div>
  );
};

export {MouseSelection};

export default MouseSelection;
