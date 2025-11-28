import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a button or interactive element
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('.interactive');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div
        className={`
          relative -top-3 -left-3 transition-all duration-300 ease-out flex items-center justify-center
          ${isHovering ? 'w-12 h-12' : 'w-6 h-6'}
        `}
      >
        <div className={`absolute border border-white rounded-full transition-all duration-300 ${isHovering ? 'w-full h-full opacity-100' : 'w-2 h-2 opacity-50 bg-white'}`} />
        {isHovering && (
           <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default CustomCursor;
