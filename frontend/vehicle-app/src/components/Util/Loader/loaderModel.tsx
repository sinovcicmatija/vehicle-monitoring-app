import { useEffect, useState } from "react";

type LoaderProps = {
  type?: 'spinner' | 'bar' | 'dots';
  fullScreen?: boolean;
  delay?: number; 
};

const Loader = ({ type = 'spinner', fullScreen = false, delay = 300 }: LoaderProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout); 
  }, [delay]);

  if (!show) return null;

  const wrapperClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    : "inline-flex";

  if (type === 'spinner') {
    return (
      <div className={wrapperClass}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={wrapperClass}>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className={wrapperClass + " w-full h-1"}>
        <div className="bg-primary h-1 animate-pulse w-1/2"></div>
      </div>
    );
  }

  return null;
};

export default Loader;
