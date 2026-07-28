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
import { playPopSound } from './utils/sound';

import { VplayHeroButton } from './components/ui/VplayHeroButton';
import { VplayPrimaryButton } from './components/ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './components/ui/VplaySecondaryButton';
import { VplayInputBox } from './components/ui/VplayInputBox';
import { VplayTab } from './components/ui/VplayTab';

import { Settings, Trophy, Flame, Menu, X, Radio } from 'lucide-react';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState<SidebarMenuItem>('home');
  const [selectedChannel, setSelectedChannel] = useState<TvChannel>(TV_CHANNELS[0]);
  const [recentlyWatched, setRecentlyWatched] = useState<TvChannel[]>([TV_CHANNELS[0], TV_CHANNELS[1], TV_CHANNELS[2]]);
  const [selectedGroup, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      setSidebarItem('home');
    } else if (sidebarItem !== 'home') {
      setSidebarItem('home');
    }
  };

  return (
    <div className="relative min-h-screen text-white font-montserrat antialiased selection:bg-[#418a28] selection:text-white flex flex-col">
      {/* Minecraft Panorama Animated Background */}
      <MinecraftPanorama />
      
      {/* SILVER TOP HEADER BAR - Clean single header bar matching reference design style */}
      <HeaderBar
        title={getHeaderTitle()}
        onBack={handleHeaderBack}
        onToggleMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onSearchClick={() => {
          setSidebarItem('search');
        }}
        searchValue={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (sidebarItem !== 'search') {
            setSidebarItem('search');
          }
        }}
      />

      {/* MAIN CONTAINER: SIDEBAR + CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* DESKTOP SIDEBAR (Style matching reference image) */}
        <Sidebar
          activeItem={sidebarItem}
          onSelectItem={handleSidebarSelect}
          channelCount={TV_CHANNELS.length}
          className="hidden md:flex"
        />

        {/* MOBILE SIDEBAR OVERLAY */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex md:hidden">
            <div className="w-72 bg-[#222427]/70 h-full p-4 border-r-2 border-[#141414]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#282a2d]">
                <span className="font-bold text-[#89dc69]">MENU</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400 p-1">✕</button>
              </div>
              <Sidebar
                activeItem={sidebarItem}
                onSelectItem={handleSidebarSelect}
                channelCount={TV_CHANNELS.length}
                className="w-full h-full border-none p-0"
              />
            </div>
          </div>
        )}

        {/* CONTENT AREA BASED ON SIDEBAR SELECTION */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSettingsOpen ? 'settings' : sidebarItem}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {sidebarItem === 'settings' || isSettingsOpen ? (
                <SettingsView
                  settings={settings}
                  onSave={(newSet) => {
                    setSettings(newSet);
                    setIsSettingsOpen(false);
                    setSidebarItem('live_tv');
                  }}
                  onCancel={() => {
                    setIsSettingsOpen(false);
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
                    setSidebarItem('live_tv');
                  }}
                  recentlyWatched={recentlyWatched}
                />
              ) : sidebarItem === 'home' ? (
                /* HOME DASHBOARD VIEW */
                <div className="space-y-8">
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
                        Trải nghiệm {TV_CHANNELS.length} Kênh TV Bản Quyền (VTV, HTV, SCTV, VTVcab, Kênh Địa Phương & Quốc Tế) với font Montserrat hiện đại và nút nhấn hiệu ứng lún độc đáo.
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

                {/* Channels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                          group relative bg-[#292a2c] border-2 p-4 cursor-pointer transition-colors duration-150 flex flex-col justify-between gap-3 active:translate-y-[2px] btn-press-effect
                          ${isSelected ? 'border-[#418a28] shadow-[0_0_15px_rgba(65,138,40,0.3)] bg-[#212c1d]' : 'border-[#141414] hover:border-[#418a28] hover:bg-[#323437]'}
                        `}
                      >
                        {/* Top Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#89dc69] truncate">
                            {channel.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                            {channel.groupTitle}
                          </span>
                        </div>

                        {/* Logo Preview from M3U8 */}
                        <div className="relative aspect-video bg-[#1a1b1d] overflow-hidden border border-[#141414] flex items-center justify-center p-3">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/150/1c1d1f/89dc69?text=${encodeURIComponent(channel.name)}`;
                              }}
                            />
                          ) : (
                            <span className="font-extrabold text-xs text-[#89dc69]">{channel.name}</span>
                          )}
                        </div>

                        {/* Program Title */}
                        <div className="space-y-1">
                          <div className="text-xs text-gray-200 font-semibold line-clamp-2 min-h-[32px]">
                            {channel.currentProgram}
                          </div>
                        </div>

                        {/* Play Button */}
                        <VplayPrimaryButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChannel(channel);
                          }}
                        >
                          {isSelected ? '● ĐANG XEM' : '▶ XEM KÊNH'}
                        </VplayPrimaryButton>

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
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
