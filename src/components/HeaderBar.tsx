import React from 'react';
import { playPopSound } from '../utils/sound';

interface HeaderBarProps {
  onBack?: () => void;
  onSearchClick?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onBack,
  onSearchClick,
}) => {
  const handleBackPress = () => {
    playPopSound();
  };

  const handleSearchPress = () => {
    playPopSound();
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#dedede] text-[#141414] border-b-4 border-[#5a5a5c] px-3 py-1 sm:py-1.5 flex items-center justify-between font-minecraft-seven select-none">
      {/* Left controls: Chevron Left (<) */}
      <div className="flex items-center gap-0.5 sm:gap-1 min-w-[36px]">
        <button
          onMouseDown={handleBackPress}
          onTouchStart={handleBackPress}
          onClick={onBack}
          aria-label="Back"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Back"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/ab/ArrowLeft.png/revision/latest?cb=20260728033445"
            alt="Back"
            referrerPolicy="no-referrer"
            className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] object-contain [image-rendering:pixelated] active:translate-y-[1px]"
            style={{ imageRendering: 'pixelated' }}
          />
        </button>
      </div>

      {/* Center: Craftmine Logo in the middle (Tab name removed as requested) */}
      <div className="flex items-center justify-center flex-1 mx-2">
        <img
          src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
          alt="The Craftmine"
          referrerPolicy="no-referrer"
          className="h-6 sm:h-7 md:h-8 w-auto max-w-[200px] sm:max-w-[280px] object-contain [image-rendering:pixelated] select-none filter drop-shadow-sm"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Right controls: Universal Search Button */}
      <div className="flex items-center gap-1 min-w-[36px] justify-end">
        <button
          onMouseDown={handleSearchPress}
          onTouchStart={handleSearchPress}
          onClick={onSearchClick}
          aria-label="Universal Search"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Search all aspects of Craftmine"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain filter brightness-0 active:translate-y-[1px]"
          />
        </button>
      </div>
    </div>
  );
};
