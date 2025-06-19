/* eslint-disable consistent-return */
import React from 'react';
import { useAppState } from '@components/common/context/app';
import './LoadingBar.scss';

const LoadingBar = function LoadingBar() {
  const { fetching } = useAppState();
  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef(0);

  React.useEffect(() => {
    widthRef.current = width;

    if (fetching === true) {
      const step = Math.random() * (3 - 1) + 1;
      const peak = Math.random() * (95 - 85) + 85;

      if (widthRef.current < peak) {
        const timer = setTimeout(() => setWidth(widthRef.current + step), 100);
        return () => clearTimeout(timer);
      }
    } else if (widthRef.current !== 0 && widthRef.current < 100) {
      setWidth(100);
    } else if (widthRef.current === 100) {
      const timer = setTimeout(() => {
        setWidth(0);
        widthRef.current = 0;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fetching, width]);

  const isVisible = width > 0 && width < 100;

  return isVisible ? (
    <div className="custom-spin-overlay">
      <div className="custom-spinner" />
    </div>
  ) : null;
};

export default LoadingBar;
