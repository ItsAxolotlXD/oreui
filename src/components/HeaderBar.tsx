import React from 'react';
import { playPopSound } from '../utils/sound';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  onSearchClick?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'HOME',
  onBack,
  onSearchClick,
}) => {
  const handleBack = () => {
    playPopSound();
    onBack?.();
  };

  const handleSearchClick = () => {
    playPopSound();
    onSearchClick?.();
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#dedede] text-[#141414] border-b-4 border-[#2b2d30] px-3 py-1 flex items-center justify-between font-montserrat select-none shadow-[0_4px_12px_#5a5a5c]">
      {/* Left controls: Chevron Left (<) */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Quay lại"
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

      {/* Center: Always Title */}
      <div className="text-center font-bold font-montserrat text-xs sm:text-sm tracking-normal text-[#141414] uppercase">
        {title}
      </div>

      {/* Right controls: Custom Search Magnifying Glass Icon */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleSearchClick}
          aria-label="Search"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Tìm kiếm"
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


