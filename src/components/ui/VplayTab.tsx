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
    effectiveDisabled ? 'disabled' : (
      isPressed ? 'pressed' : (
        isHovered ? 'hovered' : 'normal'
      )
    )
  );

  let tabBg = isActive
    ? 'bg-[#2d2f31] text-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.65)]'
    : 'bg-[#3f4246] text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.18),inset_-2px_-2px_0_rgba(0,0,0,0.5)]';
  let lineClass = 'bg-white';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      tabBg = isActive
        ? 'bg-[#333639] text-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.65)]'
        : 'bg-[#484c50] text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.25),inset_-2px_-2px_0_rgba(0,0,0,0.4)]';
      break;
    case 'pressed':
      tabBg = 'bg-[#222426] text-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.75)]';
      break;
    case 'disabled':
      tabBg = 'bg-[#313336] text-[#7a7e82] cursor-not-allowed shadow-none';
      lineClass = 'bg-[#7a7e82]';
      break;
    case 'normal':
    default:
      break;
  }

  const handleClick = () => {
    if (effectiveDisabled) return;
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
        relative px-4 py-2 min-w-[90px] sm:min-w-[120px] flex items-center justify-center text-center font-montserrat font-bold text-xs sm:text-sm select-none
        border-2 border-[#141414] rounded-none outline-none cursor-pointer btn-press-effect transition-colors duration-75
        ${tabBg} ${transformClass} ${className}
      `}
    >
      <div className="relative inline-flex flex-col items-center max-w-full">
        <span className={`truncate transition-transform ${state === 'pressed' ? 'translate-y-[1px]' : (!isActive ? '-translate-y-[1px]' : '')}`}>
          {children}
        </span>

        {/* Bottom line indicator */}
        <div
          className={`absolute -bottom-2 left-0 right-0 h-[2px] transition-opacity pointer-events-none ${
            isActive ? `opacity-100 ${lineClass}` : 'opacity-0 bg-transparent'
          }`}
        />
      </div>
    </div>
  );
};
