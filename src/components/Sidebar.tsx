import React from 'react';
import { Home, Tv, Settings, ExternalLink, Sparkles, Search } from 'lucide-react';
import { playPopSound } from '../utils/sound';

export type SidebarMenuItem = 'home' | 'live_tv' | 'settings' | 'design_system' | 'search';

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
  onOpenFeedback,
  className = '',
  channelCount = 98,
}) => {
  const menuItems: { id: SidebarMenuItem; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'live_tv', label: 'Live TV', icon: <Tv className="w-4 h-4" />, badge: `(${channelCount})` },
    { id: 'search', label: 'Search Channels', icon: <Search className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'design_system', label: 'Design System', icon: <Sparkles className="w-4 h-4" />, badge: 'V2' },
  ];

  return (
    <aside className={`w-full md:w-64 flex-shrink-0 sticky top-12 self-start max-h-[calc(100vh-4rem)] overflow-y-auto bg-[#222427]/70 border-2 border-[#141414] p-3 flex flex-col justify-between select-none ${className}`}>
      
      {/* Top Menu Section */}
      <div className="space-y-1">
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
                w-full text-left px-4 py-3 font-montserrat text-sm font-semibold flex items-center justify-between
                transition-colors duration-75 cursor-pointer rounded-none border border-transparent
                active:translate-y-[2px] btn-press-effect
                ${
                  isSelected
                    ? 'bg-[#3b3d40] text-white border-[#505357] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] font-bold'
                    : 'text-[#d0d3d6] hover:bg-[#282a2d] hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-xs ${isSelected ? 'text-[#89dc69]' : 'text-gray-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Feedback Action Box - Matching exact reference design style */}
      <div className="pt-6 space-y-3">
        <button
          onClick={() => {
            playPopSound();
            if (onOpenFeedback) onOpenFeedback();
            else alert('Cảm ơn bạn đã đóng góp ý kiến về giao diện Vplay!');
          }}
          className={`
            w-full py-3 px-4 bg-[#d0d3d6] text-[#141414] font-montserrat font-extrabold text-sm
            flex items-center justify-center gap-2 border-2 border-[#141414]
            shadow-[inset_0_2px_0_#ffffff,inset_0_-2px_0_#9ea2a6]
            hover:bg-[#e4e7ea] transition-colors cursor-pointer active:translate-y-[2px] btn-press-effect
          `}
        >
          <ExternalLink className="w-4 h-4 text-[#141414]" />
          <span>Give Feedback</span>
        </button>

        <p className="text-[11px] font-montserrat text-center text-gray-400 leading-tight">
          Tell us what you think of this new design!
        </p>
      </div>

    </aside>
  );
};
