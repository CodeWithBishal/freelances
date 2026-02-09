import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsHovering(true);
    const onMouseUp = () => setIsHovering(false);

    const onMouseEnterLink = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
            setIsHovering(true);
        }
    };
    
    const onMouseLeaveLink = () => setIsHovering(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Add listeners to clickable elements dynamically
    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterLink as any);
        el.addEventListener('mouseleave', onMouseLeaveLink as any);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      clickables.forEach(el => {
          el.removeEventListener('mouseenter', onMouseEnterLink as any);
          el.removeEventListener('mouseleave', onMouseLeaveLink as any);
      });
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null; // Hide on touch devices

  return (
    <div 
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
        style={{ 
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
    >
        <div 
            className={`
                relative -top-3 -left-3 rounded-full bg-white transition-all duration-300 ease-out
                ${isHovering ? 'w-12 h-12 -top-6 -left-6 opacity-50' : 'w-6 h-6'}
            `}
        />
    </div>
  );
};

export default CustomCursor;