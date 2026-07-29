import React from 'react';
import { playPopSound } from '../utils/sound';

export type SidebarMenuItem = 'home' | 'live_tv' | 'search' | 'settings' | 'design_system';

interface SidebarProps {
  activeItem: SidebarMenuItem;
  onSelectItem: (item: SidebarMenuItem) => void;
  onOpenFeedback?: () => void;
  className?: string;
  channelCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onSelectItem,
  className = '',
  channelCount = 98,
}) => {
  const menuItems: { id: SidebarMenuItem; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'live_tv', label: 'Live TV', badge: `(${channelCount})` },
    { id: 'design_system', label: 'Ore UI' },
  ];

  // Navigate left/right with bumper brackets
  const handlePrevTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    onSelectItem(menuItems[prevIndex].id);
  };

  const handleNextTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    onSelectItem(menuItems[nextIndex].id);
  };

  return (
    <nav className={`w-full select-none ${className}`}>
      {/* Horizontal Tab Bar Container matching Minecraft Realm Hub layout */}
      <div className="bg-[#2a2c2e] border-2 border-[#141414] p-1 shadow-lg flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        
        {/* Left Bumper Bracket [ */}
        <button
          onClick={handlePrevTab}
          title="Previous Tab"
          aria-label="Previous Tab"
          className="hidden sm:flex items-center justify-center bg-[#1d1e20] hover:bg-[#34373a] text-gray-300 font-bold font-mono text-xs px-2 py-1 border border-[#141414] flex-shrink-0 cursor-pointer active:translate-y-[1px]"
        >
          [
        </button>

        {/* Tab Items */}
        <div className="flex-1 flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => {
            const isSelected = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playPopSound();
                  onSelectItem(item.id);
                }}
                className={`
                  flex-1 min-w-[90px] sm:min-w-0 py-1 px-2 sm:px-3 font-montserrat text-xs font-bold
                  flex items-center justify-center gap-1.5 transition-all duration-75 cursor-pointer
                  border border-[#141414] active:translate-y-[1px] relative
                  ${
                    isSelected
                      ? 'bg-[#43464a] text-white border-[#5f6368] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                      : 'bg-[#222426] text-gray-300 hover:bg-[#313336] hover:text-white border-[#141414]'
                  }
                `}
              >
                <div className="relative inline-flex items-center gap-1.5 max-w-full pb-0.5">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] hidden md:inline-block ${isSelected ? 'text-[#89dc69]' : 'text-gray-400'}`}>
                      {item.badge}
                    </span>
                  )}

                  {/* White Underline Bar for Active Tab matching text length */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Bumper Bracket ] */}
        <button
          onClick={handleNextTab}
          title="Next Tab"
          aria-label="Next Tab"
          className="hidden sm:flex items-center justify-center bg-[#1d1e20] hover:bg-[#34373a] text-gray-300 font-bold font-mono text-xs px-2 py-1 border border-[#141414] flex-shrink-0 cursor-pointer active:translate-y-[1px]"
        >
          ]
        </button>

      </div>
    </nav>
  );
};
