import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  forcedState?: ComponentState;
  forcedChecked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const VplayToggleSwitch: React.FC<VplayToggleSwitchProps> = ({
  checked = false,
  onChange,
  forcedState,
  forcedChecked,
  disabled,
  label,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isChecked = forcedChecked !== undefined ? forcedChecked : internalChecked;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const handleClick = () => {
    if (effectiveDisabled) return;
    playPopSound();
    const next = !isChecked;
    if (forcedChecked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  let leftBox = '';
  let rightBox = '';
  let transformClass = '';

  if (isChecked) {
    switch (state) {
      case 'hovered':
        leftBox = 'bg-[#51a233] text-white shadow-[inset_0_1px_0_#89dc69]';
        rightBox = 'bg-[#ffffff] text-[#141414] shadow-[inset_0_1px_0_#ffffff]';
        break;
      case 'pressed':
        leftBox = 'bg-[#2b611a] text-white shadow-[inset_0_2px_0_#18370d]';
        rightBox = 'bg-[#abafb3] text-[#141414] shadow-[inset_0_2px_0_#898d91]';
        transformClass = 'translate-y-[1px]';
        break;
      case 'disabled':
        leftBox = 'bg-[#8c9196] text-[#5e6266] shadow-none cursor-not-allowed';
        rightBox = 'bg-[#c8cbce] text-[#5e6266] shadow-none cursor-not-allowed';
        break;
      case 'normal':
      default:
        leftBox = 'bg-[#418a28] text-white shadow-[inset_0_1px_0_#6bc34b]';
        rightBox = 'bg-[#cdd1d4] text-[#141414] shadow-[inset_0_1px_0_#ffffff]';
        break;
    }
  } else {
    switch (state) {
      case 'hovered':
        leftBox = 'bg-[#ffffff] text-[#141414] shadow-[inset_0_1px_0_#ffffff]';
        rightBox = 'bg-[#5a5e62] text-white shadow-[inset_0_1px_0_#787d82]';
        break;
      case 'pressed':
        leftBox = 'bg-[#abafb3] text-[#141414] shadow-[inset_0_2px_0_#898d91]';
        rightBox = 'bg-[#3e4144] text-white shadow-[inset_0_2px_0_#282a2b]';
        transformClass = 'translate-y-[1px]';
        break;
      case 'disabled':
        leftBox = 'bg-[#c8cbce] text-[#5e6266] shadow-none cursor-not-allowed';
        rightBox = 'bg-[#8c9196] text-[#5e6266] shadow-none cursor-not-allowed';
        break;
      case 'normal':
      default:
        leftBox = 'bg-[#cdd1d4] text-[#141414] shadow-[inset_0_1px_0_#ffffff]';
        rightBox = 'bg-[#5a5e62] text-white shadow-[inset_0_1px_0_#787d82]';
        break;
    }
  }

  return (
    <label
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`inline-flex items-center gap-3 cursor-pointer select-none active:translate-y-[1px] ${effectiveDisabled ? 'cursor-not-allowed opacity-90' : ''} ${className}`}
    >
      <div
        className={`
          relative w-16 h-8 border-2 border-[#141414] bg-[#222426] flex items-center p-[2px] select-none
          transition-all duration-75 ${transformClass}
        `}
      >
        <div
          className={`
            w-1/2 h-full flex items-center justify-center font-montserrat font-extrabold text-[11px] border border-[#141414]
            transition-colors duration-75 ${leftBox}
          `}
        >
          {isChecked ? 'I' : ''}
        </div>

        <div
          className={`
            w-1/2 h-full flex items-center justify-center font-montserrat font-extrabold text-[11px] border border-[#141414]
            transition-colors duration-75 ${rightBox}
          `}
        >
          {!isChecked ? 'O' : ''}
        </div>
      </div>

      {label && (
        <span className={`font-montserrat font-medium text-xs sm:text-sm ${effectiveDisabled ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </span>
      )}
    </label>
  );
};
