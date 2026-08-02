import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
}

export const VplaySecondaryButton: React.FC<VplaySecondaryButtonProps> = ({
  children = 'Secondary button',
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

  let layer1Bg = 'bg-[#cdd1d4]';
  let layer2Bg = 'bg-[#5a5a5c]';
  let layer3Bg = 'bg-[#f4f6f8]';
  let textColor = 'text-[#1c1d1f]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      layer1Bg = 'bg-[#f4f6f8]';
      layer2Bg = 'bg-[#5a5a5c]';
      layer3Bg = 'bg-[#ffffff]';
      textColor = 'text-[#1c1d1f]';
      break;
    case 'pressed':
      layer1Bg = 'bg-[#cdd1d4]';
      layer2Bg = 'bg-[#5a5a5c]';
      layer3Bg = 'bg-[#f4f6f8]';
      textColor = 'text-[#1c1d1f]';
      break;
    case 'disabled':
      layer1Bg = 'bg-[#cdd1d4]';
      layer2Bg = 'bg-[#5a5a5c]';
      layer3Bg = 'bg-[#e2e5e8]';
      textColor = 'text-[#7c8084]';
      break;
    case 'normal':
    default:
      layer1Bg = 'bg-[#cdd1d4]';
      layer2Bg = 'bg-[#5a5a5c]';
      layer3Bg = 'bg-[#f4f6f8]';
      textColor = 'text-[#1c1d1f]';
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
    : 'text-sm sm:text-base font-semibold';
  const padClasses = isSmall ? 'px-3 py-1.5' : 'px-4 py-2';

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
        relative select-none font-montserrat overflow-hidden !p-0 inline-flex flex-col
        border-2 border-[#141414] bg-[#141414] rounded-none cursor-pointer
        ${effectiveDisabled ? 'cursor-not-allowed opacity-80' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* LAYER 3: Top & Side highlight frame */}
      <div className={`relative w-full h-full flex flex-col px-[2px] ${layer3Bg}`}>
        {/* LAYER 2: Bottom dark bevel bar */}
        <div className={`absolute inset-x-0 bottom-0 h-[4px] ${layer2Bg} ${state === 'pressed' ? 'hidden' : 'block'}`} />

        {/* LAYER 1: Center main face containing text */}
        <div
          className={`
            relative z-10 w-full flex items-center justify-center gap-2
            ${state === 'pressed' ? 'mt-0 mb-0' : 'mt-0 mb-[4px]'}
            ${padClasses} ${fontClasses} ${layer1Bg} ${textColor}
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
