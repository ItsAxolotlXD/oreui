import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (val: number) => void;
  forcedState?: ComponentState;
  disabled?: boolean;
  noBackground?: boolean;
  className?: string;
}

export const VplaySlider: React.FC<VplaySliderProps> = ({
  label,
  min = 0,
  max = 10,
  step = 1,
  value = 3,
  onChange,
  forcedState,
  disabled,
  noBackground = false,
  className = '',
}) => {
  const displayLabel = label !== undefined ? label : 'States demonstration';
  const [val, setVal] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const currentValue = forcedState !== undefined ? value : val;
  const totalSegments = 10;
  const activeSegmentsCount = Math.round(((currentValue - min) / (max - min)) * totalSegments);

  const handleStepClick = (segmentIndex: number) => {
    if (effectiveDisabled) return;
    playPopSound();
    const newVal = Math.round(min + (segmentIndex / totalSegments) * (max - min));
    setVal(newVal);
    onChange?.(newVal);
  };

  let activeSegmentBg = 'bg-[#418a28] shadow-[inset_0_1px_0_#6bc34b]';
  let thumbBg = 'bg-[#cdd1d4] shadow-[inset_0_1px_0_#ffffff,inset_0_-2px_0_#9ea2a6]';

  switch (state) {
    case 'hovered':
      activeSegmentBg = 'bg-[#51a233] shadow-[inset_0_1px_0_#89dc69]';
      thumbBg = 'bg-[#f4f6f8] shadow-[inset_0_1px_0_#ffffff,inset_0_-2px_0_#b5b9bd]';
      break;
    case 'pressed':
      activeSegmentBg = 'bg-[#2b611a] shadow-[inset_0_2px_0_#18370d]';
      thumbBg = 'bg-[#abafb3] shadow-[inset_0_2px_0_#898d91]';
      break;
    case 'disabled':
      activeSegmentBg = 'bg-[#9da1a5] shadow-none';
      thumbBg = 'bg-[#c8cbce] shadow-none cursor-not-allowed';
      break;
    case 'normal':
    default:
      break;
  }

  return (
    <div
      className={`w-full rounded-none ${
        noBackground ? '' : 'bg-[#36383b] p-2.5 sm:p-3 border border-[#232527]'
      } ${className}`}
    >
      {displayLabel !== '' && (
        <div className="flex items-center justify-between font-montserrat text-xs font-semibold mb-2 select-none">
          <span className={state === 'disabled' ? 'text-[#8c9196]' : 'text-white'}>
            {displayLabel}
          </span>
          <span className={state === 'disabled' ? 'text-[#8c9196]' : 'text-[#89dc69]'}>
            {currentValue}
          </span>
        </div>
      )}

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className="relative flex items-center h-8 select-none outline-none cursor-pointer"
      >
        <div className="w-full h-3 border-2 border-[#141414] bg-[#4e5256] grid grid-cols-10 gap-[1px] p-[1px]">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isActive = idx < activeSegmentsCount;
            return (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStepClick(idx + 1);
                }}
                className={`h-full transition-colors duration-75 ${
                  isActive ? activeSegmentBg : 'bg-[#4e5256]'
                }`}
              />
            );
          })}
        </div>

        <div
          style={{
            left: `calc(${(activeSegmentsCount / totalSegments) * 100}% - 8px)`,
          }}
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-75"
        >
          <div className={`w-4 h-6 border-2 border-[#141414] ${thumbBg}`} />
        </div>
      </div>
    </div>
  );
};
