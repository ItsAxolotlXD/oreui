import React, { useState } from 'react';
import { ChevronLeft, Menu, Search, X } from 'lucide-react';
import { playPopSound } from '../utils/sound';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  onToggleMenu?: () => void;
  onSearchClick?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'HOME',
  onBack,
  onToggleMenu,
  onSearchClick,
  searchValue = '',
  onSearchChange,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleBack = () => {
    playPopSound();
    onBack?.();
  };

  const handleToggleMenu = () => {
    playPopSound();
    onToggleMenu?.();
  };

  const handleSearchToggle = () => {
    playPopSound();
    setIsSearching(!isSearching);
    onSearchClick?.();
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#dedede] text-[#141414] border-b-4 border-[#2b2d30] px-3 py-1 flex items-center justify-between font-montserrat select-none shadow-sm">
      {/* Left controls: Chevron Left (<) & Hamburger Menu (☰) */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Quay lại"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/ab/ArrowLeft.png/revision/latest?cb=20260728033445"
            alt="Back"
            referrerPolicy="no-referrer"
            className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] object-contain [image-rendering:pixelated]"
            style={{ imageRendering: 'pixelated' }}
          />
        </button>

        <button
          onClick={handleToggleMenu}
          aria-label="Menu"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none"
          title="Danh mục Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Center: Title or Search Bar */}
      {isSearching ? (
        <div className="flex-1 max-w-md mx-3">
          <div className="relative flex items-center">
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
              alt="Search Icon"
              referrerPolicy="no-referrer"
              className="absolute left-2.5 w-4 h-4 object-contain pointer-events-none z-10"
            />
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search Vplay"
              className="w-full h-7 bg-[#222426] text-white pl-8 pr-7 text-[11px] sm:text-xs font-normal font-montserrat border-2 border-[#141414] focus:outline-none placeholder:text-gray-400 shadow-[inset_0_2px_0_rgba(0,0,0,0.4)]"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-2 text-gray-400 hover:text-white font-bold text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center font-black text-xs sm:text-sm tracking-widest text-[#141414] uppercase">
          {title}
        </div>
      )}

      {/* Right control: Custom Search Magnifying Glass Icon */}
      <div className="flex items-center">
        <button
          onClick={handleSearchToggle}
          aria-label="Search"
          className={`p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none ${
            isSearching ? 'bg-[#cecece]' : ''
          }`}
          title="Tìm kiếm"
        >
          {isSearching ? (
            <X className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
              alt="Search"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain filter brightness-0"
            />
          )}
        </button>
      </div>
    </div>
  );
};


