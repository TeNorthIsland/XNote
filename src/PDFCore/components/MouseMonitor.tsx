import React, {useRef, useEffect} from 'react';

interface Props {
  onMoveAway: () => void;
  paddingX: number;
  paddingY: number;
  children: JSX.Element;
}

const MouseMonitor: React.FC<Props> = ({onMoveAway, paddingX, paddingY, children}) => {
  const container = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (event: MouseEvent) => {
    if (!container.current) {
      return;
    }

    const {clientX, clientY} = event;

    const {left, top, width, height} = container.current.getBoundingClientRect();

    const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;
    const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;

    const isNear = inBoundsX && inBoundsY;

    if (!isNear) {
      onMoveAway();
    }
  };

  useEffect(() => {
    const doc = container.current?.ownerDocument;
    doc?.addEventListener('mousemove', onMouseMove);

    return () => {
      doc?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <div ref={container}>{React.cloneElement(children)}</div>;
};

export default MouseMonitor;
