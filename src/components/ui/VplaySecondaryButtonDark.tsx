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
  let layer2Bg = 'bg-[#1e2022]';
  let layer3Bg = 'bg-[#52565a]';
  let textColor = 'text-white';
  let transformClass = '';

  if (active && state === 'normal') {
    layer1Bg = 'bg-[#383d41]';
    layer2Bg = 'bg-[#1e2022]';
    layer3Bg = 'bg-[#6bc34b]'; // Green active highlight
    textColor = 'text-white';
  } else {
    switch (state) {
      case 'hovered':
        layer1Bg = 'bg-[#42464a]';
        layer2Bg = 'bg-[#282a2d]';
        layer3Bg = 'bg-[#676c72]';
        textColor = 'text-white';
        break;
      case 'pressed':
        layer1Bg = 'bg-[#242628]';
        layer2Bg = 'bg-[#313437]';
        layer3Bg = 'bg-[#191a1b]';
        textColor = 'text-white';
        transformClass = 'translate-y-[2px]';
        break;
      case 'disabled':
        layer1Bg = 'bg-[#282a2c]';
        layer2Bg = 'bg-[#191a1b]';
        layer3Bg = 'bg-[#3c3e41]';
        textColor = 'text-[#73777b]';
        break;
      case 'normal':
      default:
        layer1Bg = 'bg-[#313437]';
        layer2Bg = 'bg-[#1e2022]';
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
          <div className="flex items-center justify-center gap-2 w-full h-full truncate">
            {children}
          </div>
        </div>
      </div>
    </button>
  );
};
