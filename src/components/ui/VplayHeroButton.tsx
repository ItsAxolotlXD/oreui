import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayHeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
}

export const VplayHeroButton: React.FC<VplayHeroButtonProps> = ({
  children = 'HERO BUTTON',
  forcedState,
  fullWidth = true,
  size = 'normal',
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

  let layer1Bg = 'bg-[#418a28]';
  let layer2Bg = 'bg-[#1e4511]';
  let layer3Bg = 'bg-[#6bc34b]';
  let textColor = 'text-white';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      layer1Bg = 'bg-[#51a233]';
      layer2Bg = 'bg-[#285718]';
      layer3Bg = 'bg-[#89dc69]';
      textColor = 'text-white';
      break;
    case 'pressed':
      layer1Bg = 'bg-[#2b611a]';
      layer2Bg = 'bg-[#418a28]';
      layer3Bg = 'bg-[#18370d]';
      textColor = 'text-white';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      layer1Bg = 'bg-[#c8cbce]';
      layer2Bg = 'bg-[#9ea2a6]';
      layer3Bg = 'bg-[#e2e5e8]';
      textColor = 'text-[#5e6266]';
      break;
    case 'normal':
    default:
      layer1Bg = 'bg-[#418a28]';
      layer2Bg = 'bg-[#1e4511]';
      layer3Bg = 'bg-[#6bc34b]';
      textColor = 'text-white';
      break;
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

  const isSmall = size === 'sm' || size === 'compact';
  const fontClasses = isSmall
    ? 'text-xs font-bold'
    : 'text-sm sm:text-base font-extrabold';
  const padClasses = isSmall ? 'px-3 py-1.5' : 'px-5 py-2';

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      /* LAYER 4: Outer 2px dark border frame */
      className={`
        relative select-none font-montserrat uppercase tracking-wider overflow-hidden !p-0 inline-flex flex-col
        border-2 border-[#141414] bg-[#141414] rounded-none cursor-pointer
        ${effectiveDisabled ? 'cursor-not-allowed opacity-80' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* LAYER 3: Top & Side highlight frame */}
      <div className={`relative w-full h-full flex flex-col ${layer3Bg}`}>
        {/* LAYER 2: Bottom dark bevel bar */}
        <div className={`absolute inset-x-0 bottom-0 h-[4px] ${layer2Bg}`} />

        {/* LAYER 1: Center main face containing text */}
        <div
          className={`
            relative z-10 w-full flex items-center justify-center gap-2
            ${state === 'pressed' ? 'mt-[4px] mb-[2px] mx-[2px]' : 'mt-[2px] mb-[4px] mx-[2px]'}
            ${padClasses} ${fontClasses} ${layer1Bg} ${textColor}
          `}
        >
          <span className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] flex items-center justify-center gap-2 w-full truncate">
            {children}
          </span>
        </div>
      </div>
    </button>
  );
};
