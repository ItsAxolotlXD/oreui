import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayTabProps {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  forcedState?: ComponentState;
  forcedActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VplayTab: React.FC<VplayTabProps> = ({
  children = 'First tab',
  active = false,
  onClick,
  forcedState,
  forcedActive,
  disabled,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isActive = forcedActive !== undefined ? forcedActive : active;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let tabBg = 'bg-[#3a3c3f] text-white';
  let lineClass = 'bg-[#89dc69]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      tabBg = 'bg-[#4d5055] text-white';
      break;
    case 'pressed':
      tabBg = 'bg-[#292a2c] text-white';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      tabBg = 'bg-[#3a3c3f] text-[#8c9196] cursor-not-allowed';
      lineClass = 'bg-[#8c9196]';
      break;
    case 'normal':
    default:
      tabBg = 'bg-[#3a3c3f] text-white';
      break;
  }

  const handleClick = () => {
    if (effectiveDisabled) return;
    playPopSound();
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => { if (!effectiveDisabled) { setIsPressed(true); playPopSound(); } }}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative px-5 py-2.5 min-w-[120px] flex flex-col items-center justify-center font-montserrat font-bold text-xs sm:text-sm select-none
        border-2 border-[#141414] rounded-none outline-none cursor-pointer btn-press-effect active:translate-y-[2px] transition-colors duration-75
        ${tabBg} ${transformClass} ${className}
      `}
    >
      <span className="truncate">{children}</span>

      {/* Bottom green bar indicator for "On" / Active state */}
      <div className={`h-[3px] w-12 mt-1.5 transition-opacity ${isActive ? `opacity-100 ${lineClass}` : 'opacity-0 bg-transparent'}`} />
    </div>
  );
};
