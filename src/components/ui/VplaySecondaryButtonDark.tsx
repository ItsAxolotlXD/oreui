import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySecondaryButtonDarkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
  active?: boolean;
}

export const VplaySecondaryButtonDark: React.FC<VplaySecondaryButtonDarkProps> = ({
  children = 'Secondary button dark',
  forcedState,
  fullWidth = true,
  size = 'normal',
  active = false,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let layer1Bg = 'bg-[#313437]';
  let layer3Bg = 'bg-[#52565a]';
  let textColor = 'text-white';

  if (active && state === 'normal') {
    layer1Bg = 'bg-[#383d41]';
    layer3Bg = 'bg-[#6bc34b]'; // Green active highlight
    textColor = 'text-white';
  } else {
    switch (state) {
      case 'hovered':
        layer1Bg = 'bg-[#42464a]';
        layer3Bg = 'bg-[#676c72]';
        textColor = 'text-white';
        break;
      case 'pressed':
        layer1Bg = active ? 'bg-[#1c2022]' : 'bg-[#181a1c]';
        layer3Bg = active ? 'bg-[#2d581c]' : 'bg-[#2a2c2e]';
        textColor = 'text-white';
        break;
      case 'disabled':
        layer1Bg = 'bg-[#282a2c]';
        layer3Bg = 'bg-[#3c3e41]';
        textColor = 'text-[#73777b]';
        break;
      case 'normal':
      default:
        layer1Bg = 'bg-[#313437]';
        layer3Bg = 'bg-[#52565a]';
        textColor = 'text-white';
        break;
    }
  }

  const handleMouseDown = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playPopSound();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effectiveDisabled) return;
    onClick?.(e);
  };

  const handleTouchStart = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playPopSound();
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPressed(false), 120);
  };

  const isSmall = size === 'sm' || size === 'compact';
  const fontClasses = isSmall
    ? 'text-[11px] font-bold'
    : 'text-xs sm:text-sm font-semibold';
  const padClasses = isSmall ? 'px-3 py-1' : 'px-4 py-1.5';
  const heightClass = isSmall ? 'h-8' : 'h-11';

  const isHoveredState = state === 'hovered';

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      onClick={handleClick}
      data-state={state}
      data-dark-btn="true"
      style={{
        outline: isHoveredState && !effectiveDisabled ? '2px solid #ffffff' : undefined,
        outlineOffset: '0px',
        transition: 'none',
      }}
      /* LAYER 4: Outer 2px dark border frame with white outline on hover (no cross dissolve) */
      className={`
        relative select-none font-montserrat overflow-visible !p-0 inline-flex flex-col
        border-2 border-[#141414] bg-[#141414] rounded-none cursor-pointer
        ore-dark-btn !transition-none
        ${heightClass}
        ${isHoveredState && !effectiveDisabled ? 'outline-2 outline-white z-20' : 'hover:outline-2 hover:outline-white hover:z-20'}
        ${effectiveDisabled ? 'cursor-not-allowed opacity-80 !outline-none' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Top & Side frame - no bottom bevel line on dark button */}
      <div className={`relative w-full h-full flex flex-col p-[2px] ${state === 'pressed' ? 'translate-y-[2px]' : ''} ${layer3Bg} !transition-none`}>
        {/* Main face containing text */}
        <div
          className={`
            relative z-10 w-full h-full flex-1 flex items-center justify-center gap-2
            ${padClasses} ${fontClasses} ${layer1Bg} ${textColor}
            !transition-none
          `}
        >
          <div className="flex items-center justify-center gap-2 w-full h-full truncate -translate-y-[1px]">
            {children}
          </div>
        </div>
      </div>
    </button>
  );
};
