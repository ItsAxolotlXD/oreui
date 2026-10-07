import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playGreenButtonSound } from '../../utils/sound';

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

  switch (state) {
    case 'hovered':
      layer1Bg = 'bg-[#51a233]';
      layer2Bg = 'bg-[#285718]';
      layer3Bg = 'bg-[#89dc69]';
      textColor = 'text-white';
      break;
    case 'pressed':
      layer1Bg = 'bg-[#214a13]';
      layer2Bg = 'bg-[#0b1a05]';
      layer3Bg = 'bg-[#2a5d19]';
      textColor = 'text-white';
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

  // ONLY play sound on button press down, NEVER on button release
  const handleMouseDown = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playGreenButtonSound();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effectiveDisabled) return;
    onClick?.(e);
  };

  const handleTouchStart = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playGreenButtonSound();
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPressed(false), 120);
  };

  const isSmall = size === 'sm' || size === 'compact';
  const fontClasses = isSmall
    ? 'text-xs sm:text-sm'
    : 'text-sm sm:text-base';
  const padClasses = isSmall ? 'px-3 py-1' : 'px-4 py-1.5';
  const heightClass = isSmall ? 'h-8' : 'h-11';

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
      /* LAYER 4: Outer 2px dark border frame */
      className={`
        relative select-none font-minecraft-ten uppercase tracking-wider overflow-hidden !p-0 inline-flex flex-col
        border-2 border-[#141414] bg-[#141414] rounded-none cursor-pointer
        ${heightClass}
        ${effectiveDisabled ? 'cursor-not-allowed opacity-80' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* LAYER 3: Top & Side highlight frame with 4px bottom bevel allowance */}
      <div className={`relative w-full h-full flex flex-col px-[2px] pt-[2px] pb-[4px] ${state === 'pressed' ? 'translate-y-[4px]' : ''} ${layer3Bg}`}>
        {/* LAYER 2: Bottom dark bevel bar (2 layers thick = 4px) */}
        <div className={`absolute inset-x-0 bottom-0 h-[4px] ${layer2Bg} pointer-events-none`} />

        {/* LAYER 1: Center main face containing text */}
        <div
          className={`
            relative z-10 w-full h-full flex-1 flex items-center justify-center gap-2
            ${padClasses} ${fontClasses} ${layer1Bg} ${textColor}
          `}
        >
          <span className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] flex items-center justify-center gap-2 w-full truncate -translate-y-[4px]">
            {children}
          </span>
        </div>
      </div>
    </button>
  );
};
