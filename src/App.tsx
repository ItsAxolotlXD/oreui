import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSettings } from './types';
import { DesignSystemViewer } from './components/DesignSystemViewer';
import { SettingsView } from './components/SettingsView';
import { PlayCraftmineView, CRAFTMINE_EDITIONS } from './components/PlayCraftmineView';
import { FaqSection } from './components/FaqSection';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { MinecraftPanorama } from './components/MinecraftPanorama';
import { HomeBannerSlider } from './components/HomeBannerSlider';
import { FeedbackModal } from './components/FeedbackModal';
import { playPopSound } from './utils/sound';

import { VplayHeroButton } from './components/ui/VplayHeroButton';
import { VplaySecondaryButton } from './components/ui/VplaySecondaryButton';
import { Play, Sparkles, Monitor, Cpu, Layers, ExternalLink } from 'lucide-react';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState<SidebarMenuItem>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isDeveloperUnlocked, setIsDeveloperUnlocked] = useState<boolean>(false);

  const triggerTabLoading = () => {
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 1000);
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
    searchQuery: 'Craftmine Player',
    disablePanorama: false,
    lockPanoramaScroll: false,
    panoramaScrollSpeed: 5,
    reduceMotion: false,
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
  };

  const getHeaderTitle = () => {
    if (isSettingsOpen) return 'CÀI ĐẶT';
    switch (sidebarItem) {
      case 'home': return 'TRANG CHỦ';
      case 'play_craftmine': return 'PLAY CRAFTMINE';
      case 'settings': return 'CÀI ĐẶT';
      case 'design_system': return 'ORE UI';
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
      <MinecraftPanorama
        disablePanorama={settings.disablePanorama}
        lockPanoramaScroll={settings.lockPanoramaScroll}
        panoramaScrollSpeed={settings.panoramaScrollSpeed}
      />
      
      {/* STICKY TOP HEADER BAR WITH CRAFTMINE LOGO */}
      <HeaderBar
        title={getHeaderTitle()}
        onBack={handleHeaderBack}
        onSearchClick={() => {
          setIsFeedbackOpen(true);
        }}
      />

      {/* HORIZONTAL TAB BAR */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-40">
        <Sidebar
          activeItem={sidebarItem}
          onSelectItem={handleSidebarSelect}
        />
      </div>

      {/* MAIN CONTAINER CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 lg:pb-8 relative">
        <main className="w-full min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              <motion.div
                key="loading"
                initial={settings.reduceMotion ? { opacity: 1, x: 0 } : { x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={settings.reduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, transition: { duration: 0 } }}
                transition={settings.reduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeInOut' }}
              >
                <div className="w-full min-h-[380px] bg-black/60 border-2 border-[#141414] shadow-2xl flex flex-col items-center justify-center p-8 text-center select-none my-2 space-y-3">
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
                    alt="Loading The Craftmine..."
                    referrerPolicy="no-referrer"
                    className="h-10 sm:h-12 object-contain [image-rendering:pixelated] animate-pulse"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="w-48 bg-[#1b1c1e] h-3 border border-[#141414] p-0.5 mt-2">
                    <div className="bg-[#418a28] h-full w-2/3 animate-pulse" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono tracking-wider">
                    Đang nạp engine The Craftmine...
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isSettingsOpen ? 'settings' : sidebarItem}
                initial={settings.reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={settings.reduceMotion ? { opacity: 1, x: 0 } : { x: '-100%', opacity: 1 }}
                transition={
                  settings.reduceMotion
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.35, ease: 'easeInOut' },
                        x: { duration: 0.2, ease: 'easeInOut' },
                      }
                }
              >
                {sidebarItem === 'settings' || isSettingsOpen ? (
                  <SettingsView
                    settings={settings}
                    onChangeLiveSettings={(newSet) => setSettings(newSet)}
                    onSave={(newSet) => {
                      setSettings(newSet);
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('home');
                    }}
                    onCancel={() => {
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('home');
                    }}
                    onOpenDesignSystem={() => {
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('design_system');
                    }}
                    onOpenFeedback={() => setIsFeedbackOpen(true)}
                    isDeveloperUnlocked={isDeveloperUnlocked}
                    onToggleDeveloperUnlocked={setIsDeveloperUnlocked}
                  />
                ) : sidebarItem === 'design_system' ? (
                  <DesignSystemViewer onOpenFeedback={() => setIsFeedbackOpen(true)} />
                ) : sidebarItem === 'play_craftmine' ? (
                  <PlayCraftmineView />
                ) : (
                  /* HOME DASHBOARD VIEW */
                  <div className="space-y-4">
                    {/* YELLOW TIP PANEL BANNER */}
                    <div className="relative w-full bg-[#ffe866] overflow-hidden select-none border-2 border-[#141414] shadow-md">
                      <div className="relative z-10 py-1.5 px-3 text-center text-[#141414] font-montserrat font-bold text-[11px] sm:text-xs">
                        ⭐ The Craftmine — An unofficial Minecraft project with Ore UI Design System. The Craftmine is coming soon. Stay tuned!
                      </div>
                    </div>

                    {/* SLIDING BANNER */}
                    <HomeBannerSlider
                      reduceMotion={settings.reduceMotion}
                      onExploreDesignSystem={() => {
                        triggerTabLoading();
                        setSidebarItem('design_system');
                      }}
                      onPlayCraftmine={() => {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }}
                      onOpenFeedback={() => setIsFeedbackOpen(true)}
                    />

                    {/* 3 CRAFTMINE EDITIONS SHOWCASE */}
                    <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-[#2d3033] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-none animate-pulse" />
                          <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                            3 PHIÊN BẢN THE CRAFTMINE (3 GAME ENGINES)
                          </h2>
                        </div>
                        <button
                          onClick={() => {
                            triggerTabLoading();
                            setSidebarItem('play_craftmine');
                          }}
                          className="text-xs text-[#89dc69] font-bold hover:underline cursor-pointer"
                        >
                          [Vào chơi ngay]
                        </button>
                      </div>

                      {/* 3 EDITIONS CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {CRAFTMINE_EDITIONS.map((edition, idx) => (
                          <div
                            key={edition.id}
                            onClick={() => {
                              playPopSound();
                              triggerTabLoading();
                              setSidebarItem('play_craftmine');
                            }}
                            className="group relative bg-[#3f4246] hover:bg-[#484c50] border-2 border-[#141414] hover:border-[#89dc69] cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-md select-none btn-press-effect p-3.5 space-y-3"
                          >
                            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.25),inset_-2px_-4px_0_rgba(0,0,0,0.5)]" />

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[10px] font-bold font-mono px-2 py-0.5 border border-[#141414]"
                                  style={{ backgroundColor: edition.accentColor, color: '#141414' }}
                                >
                                  ENGINE #{idx + 1}
                                </span>
                                <span className="text-[10px] text-gray-300 font-mono flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#89dc69] rounded-full" />
                                  READY
                                </span>
                              </div>

                              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#89dc69] font-montserrat flex items-center gap-1.5">
                                {idx === 0 && <Sparkles className="w-4 h-4 text-[#89dc69]" />}
                                {idx === 1 && <Cpu className="w-4 h-4 text-sky-400" />}
                                {idx === 2 && <Layers className="w-4 h-4 text-amber-400" />}
                                {edition.name}
                              </h3>

                              <div className="text-[11px] text-gray-400 font-mono">
                                {edition.engineName}
                              </div>

                              <p className="text-xs text-gray-300 font-montserrat leading-relaxed line-clamp-3">
                                {edition.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#4e5257] flex items-center justify-between text-[11px]">
                              <span className="text-gray-300 font-mono truncate max-w-[140px]">
                                {edition.engineType}
                              </span>
                              <span className="text-[#89dc69] font-bold group-hover:underline flex items-center gap-1">
                                <span>CHƠI NGAY</span>
                                <Play className="w-3 h-3 fill-current" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FREQUENTLY ASKED QUESTIONS SECTION */}
                    <FaqSection
                      onGoToPlayCraftmine={() => {
                        triggerTabLoading();
                        setSidebarItem('play_craftmine');
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
