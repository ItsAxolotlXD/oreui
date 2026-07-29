import React from 'react';
import { Menu } from 'lucide-react';
import { playPopSound } from '../utils/sound';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  onToggleMenu?: () => void;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'HOME',
  onBack,
  onToggleMenu,
  onSearchClick,
  onSettingsClick,
}) => {
  const handleBack = () => {
    playPopSound();
    onBack?.();
  };

  const handleToggleMenu = () => {
    playPopSound();
    onToggleMenu?.();
  };

  const handleSearchClick = () => {
    playPopSound();
    onSearchClick?.();
  };

  const handleSettingsClick = () => {
    playPopSound();
    onSettingsClick?.();
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

      {/* Center: Always Title */}
      <div className="text-center font-bold font-montserrat text-xs sm:text-sm tracking-normal text-[#141414] uppercase">
        {title}
      </div>

      {/* Right controls: Settings & Custom Search Magnifying Glass Icon */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleSettingsClick}
          aria-label="Settings"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Cài đặt"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/ce/Settings%400.5x.icon-768deb134ddeae9ce37ab53735e95ac7.png/revision/latest?cb=20260728073540"
            alt="Settings"
            referrerPolicy="no-referrer"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain filter brightness-0"
          />
        </button>

        <button
          onClick={handleSearchClick}
          aria-label="Search"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Tìm kiếm"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain filter brightness-0"
          />
        </button>
      </div>
    </div>
  );
};


