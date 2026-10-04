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
    <div className="sticky top-0 z-50 w-full bg-[#dedede] text-[#141414] border-b-4 border-[#5a5a5c] px-3 py-1 sm:py-1.5 flex items-center justify-between font-montserrat select-none">
      {/* Left controls: Chevron Left (<) */}
      <div className="flex items-center gap-0.5 sm:gap-1 min-w-[36px]">
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

      {/* Center: Craftmine Logo in the middle */}
      <div className="flex items-center justify-center gap-2 flex-1 mx-2">
        <img
          src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
          alt="The Craftmine"
          referrerPolicy="no-referrer"
          className="h-6 sm:h-7 md:h-8 w-auto max-w-[200px] sm:max-w-[280px] object-contain [image-rendering:pixelated] select-none filter drop-shadow-sm"
          style={{ imageRendering: 'pixelated' }}
        />
        {title && title !== 'HOME' && title !== 'TRANG CHỦ' && (
          <span className="hidden md:inline-block bg-[#1c1d1f] text-[#89dc69] text-[10px] font-bold font-montserrat px-2 py-0.5 border border-[#141414] uppercase shadow-sm">
            {title}
          </span>
        )}
      </div>

      {/* Right controls: Custom Search Icon or Info */}
      <div className="flex items-center gap-1 min-w-[36px] justify-end">
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
