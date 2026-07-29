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

  let bgClass = 'bg-[#cdd1d4] text-[#1c1d1f]';
  let shadowClass = 'shadow-[inset_0_2px_0_#f4f6f8,inset_0_-3px_0_#9ea2a6]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      bgClass = 'bg-[#f4f6f8] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_2px_0_#ffffff,inset_0_-2px_0_#b5b9bd]';
      break;
    case 'pressed':
      bgClass = 'bg-[#abafb3] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_3px_0_#898d91,inset_0_-1px_0_#cdd1d4]';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      bgClass = 'bg-[#cdd1d4] text-[#7c8084] cursor-not-allowed';
      shadowClass = 'shadow-[inset_0_2px_0_#e2e5e8,inset_0_-3px_0_#9ea2a6]';
      break;
    case 'normal':
    default:
      bgClass = 'bg-[#cdd1d4] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_2px_0_#f4f6f8,inset_0_-3px_0_#9ea2a6]';
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
    playPopSound();
    onClick?.(e);
  };

  const isSmall = size === 'sm' || size === 'compact';
  const sizeClasses = isSmall
    ? 'text-xs font-bold py-1 px-3 h-8'
    : 'text-sm sm:text-base font-semibold py-3 px-6 h-12';

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      className={`
        relative select-none font-montserrat
        flex items-center justify-center active:translate-y-[2px] btn-press-effect
        border-2 border-[#181818] rounded-none cursor-pointer transition-colors duration-75
        ${sizeClasses}
        ${bgClass} ${shadowClass} ${transformClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 w-full h-full">
        {children}
      </div>
    </button>
  );
};
