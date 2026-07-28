import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TvChannel, UserSettings } from './types';
import { TV_CHANNELS } from './data/mockTvData';
import { DesignSystemViewer } from './components/DesignSystemViewer';
import { TvPlayer } from './components/TvPlayer';
import { SettingsView } from './components/SettingsView';
import { SearchChannelsView } from './components/SearchChannelsView';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { MinecraftPanorama } from './components/MinecraftPanorama';
import { HomeBannerSlider } from './components/HomeBannerSlider';
import { playPopSound } from './utils/sound';

import { VplayHeroButton } from './components/ui/VplayHeroButton';
import { VplayPrimaryButton } from './components/ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './components/ui/VplaySecondaryButton';
import { VplayInputBox } from './components/ui/VplayInputBox';
import { VplayTab } from './components/ui/VplayTab';

import { Settings, Trophy, Flame, Menu, X, Radio, Pencil } from 'lucide-react';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState<SidebarMenuItem>('home');
  const [selectedChannel, setSelectedChannel] = useState<TvChannel>(TV_CHANNELS[0]);
  const [recentlyWatched, setRecentlyWatched] = useState<TvChannel[]>([TV_CHANNELS[0], TV_CHANNELS[1], TV_CHANNELS[2]]);
  const [selectedGroup, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const triggerTabLoading = () => {
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 2000);
  };

  const [settings, setSettings] = useState<UserSettings>({
    autoPlay: true,
    subtitles: true,
    hdQuality: true,
    soundVolume: 7,
    qualityOption: '1080p',
    preferredCategory: 'all',
    themeMode: 'dark',
    notifications: true,
    searchQuery: '',
  });

  const handleSelectChannel = (channel: TvChannel) => {
    setSelectedChannel(channel);
    setRecentlyWatched((prev) => [channel, ...prev.filter((c) => c.id !== channel.id)].slice(0, 10));
  };

  // Extract unique group titles from parsed channels
  const groupsList = ['all', ...Array.from(new Set(TV_CHANNELS.map(c => c.groupTitle)))];

  // Filter channels based on search and selected group
  const filteredChannels = TV_CHANNELS.filter((ch) => {
    const matchGroup = selectedGroup === 'all' || ch.groupTitle === selectedGroup;
    const matchSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ch.groupTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ch.currentProgram.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  const handleSidebarSelect = (item: SidebarMenuItem) => {
    playPopSound();
    if (item !== sidebarItem || isSettingsOpen) {
      triggerTabLoading();
    }
    if (item === 'settings') {
      setIsSettingsOpen(true);
      setSidebarItem('settings');
    } else {
      setIsSettingsOpen(false);
      setSidebarItem(item);
    }
    setIsMobileSidebarOpen(false);
  };

  const getHeaderTitle = () => {
    if (isSettingsOpen) return 'CÀI ĐẶT';
    switch (sidebarItem) {
      case 'home': return 'TRANG CHỦ';
      case 'live_tv': return 'TRUYỀN HÌNH';
      case 'search': return 'SEARCH FOR CHANNELS';
      case 'settings': return 'CÀI ĐẶT';
      case 'design_system': return 'DESIGN SYSTEM';
      default: return 'CÀI ĐẶT';
    }
  };

  const handleHeaderBack = () => {
    if (isSettingsOpen || sidebarItem !== 'home') {
      triggerTabLoading();
    }
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      setSidebarItem('home');
    } else if (sidebarItem !== 'home') {
      setSidebarItem('home');
    }
  };

  return (
    <div className="relative min-h-screen text-white font-jura antialiased selection:bg-[#418a28] selection:text-white flex flex-col">
      {/* Minecraft Panorama Animated Background */}
      <MinecraftPanorama />
      
      {/* STICKY TOP CONTAINER FOR HEADER BAR + HORIZONTAL TAB BAR */}
      <div className="sticky top-0 z-50 w-full bg-[#242424]/95 backdrop-blur-md border-b-2 border-[#141414] shadow-lg">
        <HeaderBar
          title={getHeaderTitle()}
          onBack={handleHeaderBack}
          onToggleMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onSettingsClick={() => {
            if (!isSettingsOpen) triggerTabLoading();
            setIsSettingsOpen(true);
            setSidebarItem('settings');
          }}
          onSearchClick={() => {
            if (sidebarItem !== 'search' || isSettingsOpen) triggerTabLoading();
            setIsSettingsOpen(false);
            setSidebarItem('search');
          }}
          searchValue={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setIsSettingsOpen(false);
            if (sidebarItem !== 'search') {
              triggerTabLoading();
              setSidebarItem('search');
            }
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-1">
          <Sidebar
            activeItem={sidebarItem}
            onSelectItem={handleSidebarSelect}
            channelCount={TV_CHANNELS.length}
          />
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-2 pb-6 lg:pb-8 relative">
        <main className="w-full min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              <motion.div
                key="loading"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 1, transition: { duration: 0 } }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <div className="w-full min-h-[380px] bg-black/50 border-2 border-[#141414] shadow-2xl flex items-center justify-center p-8 text-center select-none my-2 rounded-none">
                  <img
                    src="https://i.ibb.co/YF4Q2tmz/animation-074ed0ba8c16bb30e36c.gif"
                    alt="Loading..."
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-contain [image-rendering:pixelated]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isSettingsOpen ? 'settings' : sidebarItem}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ x: '-100%', opacity: 1 }}
                transition={{
                  opacity: { duration: 0.5, ease: 'easeInOut' },
                  x: { duration: 0.22, ease: 'easeInOut' },
                }}
              >
                {sidebarItem === 'settings' || isSettingsOpen ? (
                  <SettingsView
                  settings={settings}
                  onSave={(newSet) => {
                    setSettings(newSet);
                    setIsSettingsOpen(false);
                    triggerTabLoading();
                    setSidebarItem('live_tv');
                  }}
                  onCancel={() => {
                    setIsSettingsOpen(false);
                    triggerTabLoading();
                    setSidebarItem('live_tv');
                  }}
                />
              ) : sidebarItem === 'design_system' ? (
                  <DesignSystemViewer />
                ) : sidebarItem === 'search' ? (
                  <SearchChannelsView
                    channels={TV_CHANNELS}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelectChannel={(ch) => {
                      handleSelectChannel(ch);
                      triggerTabLoading();
                      setSidebarItem('live_tv');
                    }}
                    recentlyWatched={recentlyWatched}
                  />
                ) : sidebarItem === 'home' ? (
                  /* HOME DASHBOARD VIEW */
                  <div className="space-y-3">
                    {/* YELLOW TIP PANEL BANNER */}
                    <div className="relative w-full bg-[#ffe866] overflow-hidden select-none">
                      <div className="relative z-10 py-1 px-3 text-center text-[#141414] font-jura font-bold text-[11px] sm:text-xs">
                        You are previewing a test version of Vplay.{' '}
                        <a
                          href="https://vplay-refresh.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-black hover:text-black/80"
                        >
                          Click here
                        </a>{' '}
                        to go to official version.
                      </div>
                    </div>

                    {/* SLIDING BANNER */}
                    <HomeBannerSlider
                      onExploreDesignSystem={() => {
                        triggerTabLoading();
                        setSidebarItem('design_system');
                      }}
                      onWatchNow={() => {
                        triggerTabLoading();
                        setSidebarItem('live_tv');
                      }}
                    />

                  {/* VIP ANNOUNCEMENT HERO BANNER */}
                  <div className="bg-gradient-to-r from-[#212f1e] via-[#292a2c] to-[#1e2022] border-2 border-[#418a28] p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
                      <Trophy className="w-64 h-64 text-[#89dc69]" />
                    </div>

                    <div className="space-y-3 z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 bg-[#418a28] text-white px-3 py-1 text-xs font-bold border border-[#141414]">
                        <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" /> VPLAY TV VIP 4K MULTI-STREAM
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                        HỆ THỐNG TRUYỀN HÌNH TRỰC TUYẾN CHẤT LƯỢNG CAO
                      </h2>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Trải nghiệm {TV_CHANNELS.length} Kênh TV Bản Quyền (VTV, HTV, SCTV, VTVcab, Kênh Địa Phương & Quốc Tế) với font Jura hiện đại và nút nhấn hiệu ứng lún độc đáo.
                      </p>
                    </div>

                    <div className="w-full lg:w-56 z-10">
                      <VplayHeroButton onClick={() => setSidebarItem('live_tv')}>
                        ▶ XEM LIVE TV NGAY
                      </VplayHeroButton>
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE TV FULL VIEW */
                <div className="space-y-8">
                  
                  {/* LIVE TV PLAYER */}
                  <section className="space-y-3">
                    <TvPlayer
                      channel={selectedChannel}
                      onSelectChannel={handleSelectChannel}
                      channels={TV_CHANNELS}
                      settings={settings}
                      onUpdateSettings={setSettings}
                    />
                  </section>

              {/* GROUP FILTER TABS & CHANNELS GRID */}
              <section className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      DANH MỤC CÁC KÊNH TRUYỀN HÌNH ({filteredChannels.length})
                    </span>
                    {selectedGroup !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="text-xs text-[#89dc69] hover:underline cursor-pointer"
                      >
                        [Xem tất cả nhóm]
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scrollable Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2d3033]">
                    {groupsList.map((grp) => (
                      <VplayTab
                        key={grp}
                        active={selectedGroup === grp}
                        onClick={() => setSelectedCategory(grp)}
                      >
                        {grp === 'all' ? `Tất cả (${TV_CHANNELS.length})` : grp}
                      </VplayTab>
                    ))}
                  </div>
                </div>

                {/* Channels Grid: 3 columns on mobile, 5 columns on desktop */}
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {filteredChannels.map((channel) => {
                    const isSelected = selectedChannel.id === channel.id;
                    return (
                      <div
                        key={channel.id}
                        onClick={() => {
                          playPopSound();
                          handleSelectChannel(channel);
                        }}
                        className={`
                          group relative bg-[#4c4f52] border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-xl select-none active:translate-y-[2px] btn-press-effect rounded-none
                          ${isSelected ? 'border-[#418a28] shadow-[0_0_15px_rgba(65,138,40,0.4)]' : 'border-[#141414] hover:border-[#89dc69]'}
                        `}
                      >
                        {/* TOP IMAGE AREA: Channel Logo with Wavy Background */}
                        <div className="relative aspect-[16/10] bg-[#1a1c1e] border-b-2 border-[#141414] flex items-center justify-center p-1.5 sm:p-3 overflow-hidden">
                          {/* Background Wavy Lines Pattern */}
                          <svg
                            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none text-[#45494e]"
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                          >
                            <defs>
                              <pattern
                                id={`wavy-pattern-${channel.id}`}
                                x="0"
                                y="0"
                                width="32"
                                height="12"
                                patternUnits="userSpaceOnUse"
                              >
                                <path
                                  d="M 0 6 Q 8 0, 16 6 T 32 6"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#wavy-pattern-${channel.id})`} />
                          </svg>

                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200 z-10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/150/1c1d1f/89dc69?text=${encodeURIComponent(channel.name)}`;
                              }}
                            />
                          ) : (
                            <span className="font-extrabold text-xs sm:text-sm text-[#89dc69] tracking-wider font-mono uppercase z-10">{channel.name}</span>
                          )}

                          {/* Live Indicator Badge on top right */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-[#418a28] text-white px-1 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold border border-[#141414] font-mono shadow z-10">
                              ● LIVE
                            </div>
                          )}
                        </div>

                        {/* MIDDLE CONTENT: Title & Tags */}
                        <div className="p-2 sm:p-3 bg-[#4c4f52] flex flex-col justify-between gap-1.5 sm:gap-2 flex-1">
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-white truncate tracking-tight font-montserrat">
                              {channel.name}
                            </h3>
                            <p className="text-[9px] sm:text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                              {channel.currentProgram || 'Đang phát sóng'}
                            </p>
                          </div>

                          {/* Tag Badges Row (Survival, Creative, Experimental style) */}
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
                            {/* Black Badge (Group/Category) */}
                            <span className="bg-[#1c1d1f] text-white px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-mono border border-[#141414] shadow-sm truncate max-w-[70px] sm:max-w-none">
                              {channel.groupTitle}
                            </span>

                            {/* Yellow Badge (Badge / Status / Experimental style) */}
                            {channel.badge ? (
                              <span className="bg-[#ffe866] text-[#141414] px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-mono border border-[#141414] shadow-sm">
                                {channel.badge}
                              </span>
                            ) : isSelected ? (
                              <span className="bg-[#ffe866] text-[#141414] px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-mono border border-[#141414] shadow-sm">
                                Đang xem
                              </span>
                            ) : (
                              <span className="bg-[#ffe866] text-[#141414] px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-mono border border-[#141414] shadow-sm">
                                HD
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BOTTOM DIVIDER & EDIT BUTTON BAR */}
                        <div className="border-t-2 border-[#1c1d1f]">
                          <div className="bg-[#3e4144] group-hover:bg-[#484b4e] transition-colors py-1.5 sm:py-2 px-1.5 sm:px-3 flex items-center justify-center gap-1 sm:gap-2 text-center text-white cursor-pointer select-none">
                            <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            <span className="font-bold text-[9px] sm:text-xs uppercase tracking-wider text-white font-montserrat">
                              {isSelected ? 'Đang xem' : 'Xem ngay'}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {filteredChannels.length === 0 && (
                  <div className="bg-[#292a2c] p-8 text-center border-2 border-[#141414] space-y-3">
                    <p className="text-sm font-bold text-yellow-400">KHÔNG TÌM THẤY KÊNH NÀO MATCH TỪ KHÓA</p>
                    <p className="text-xs text-gray-300">Thử tìm từ khóa khác hoặc bấm nút bên dưới để chọn lại toàn bộ kênh.</p>
                    <div className="w-48 mx-auto pt-2">
                      <VplaySecondaryButton onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                        XÓA TÌM KIẾM
                      </VplaySecondaryButton>
                    </div>
                  </div>
                )}

              </section>

            </div>
          )}
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
