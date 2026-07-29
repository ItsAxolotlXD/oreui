import React, { useState } from 'react';
import { ComponentState } from '../../types';

interface VplayInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  forcedState?: ComponentState;
  disabled?: boolean;
  className?: string;
}

export const VplayInputBox: React.FC<VplayInputBoxProps> = ({
  label = 'Label',
  description = 'Description',
  forcedState,
  disabled,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) => {
  const [internalVal, setInternalVal] = useState(value || '');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let inputBg = 'bg-[#222426] text-white';
  let borderClass = 'border-2 border-[#141414]';

  switch (state) {
    case 'hovered':
      inputBg = 'bg-[#2a2c2f] text-white';
      break;
    case 'pressed':
      inputBg = 'bg-[#1a1b1d] text-white';
      break;
    case 'disabled':
      inputBg = 'bg-[#c8cbce] text-[#5e6266] cursor-not-allowed';
      break;
    case 'normal':
    default:
      inputBg = 'bg-[#222426] text-white';
      break;
  }

  return (
    <div className={`w-full max-w-lg bg-[#36383b] p-3 border border-[#232527] rounded-none ${className}`}>
      {label && (
        <label className={`block font-montserrat font-medium text-xs mb-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </label>
      )}

      <input
        disabled={effectiveDisabled}
        value={value !== undefined ? value : internalVal}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange?.(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        placeholder={placeholder}
        className={`
          w-full h-9 px-3 font-montserrat text-xs sm:text-sm outline-none rounded-none transition-colors duration-75 cursor-pointer
          shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] placeholder:text-gray-400 focus:outline-none focus:border-[#418a28]
          ${borderClass} ${inputBg}
        `}
        {...props}
      />

      {description && (
        <p className={`font-montserrat text-[11px] mt-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-[#a0a5aa]'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
