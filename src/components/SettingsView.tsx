import React, { useState } from 'react';
import { UserSettings, TvChannel } from '../types';
import { ExternalLink, Search } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySlider } from './ui/VplaySlider';
import { PerformanceTestModal } from './PerformanceTestModal';

interface SettingsViewProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onCancel: () => void;
  onChangeLiveSettings?: (newSettings: UserSettings) => void;
  onOpenFeedback?: () => void;
  onOpenDesignSystem?: () => void;
  isDeveloperUnlocked?: boolean;
  onToggleDeveloperUnlocked?: (unlocked: boolean) => void;
  channels?: TvChannel[];
}

const SettingsDivider = () => (
  <div className="w-full flex flex-col select-none pointer-events-none">
    <div className="w-full h-[1px] bg-[#18191b]" />
    <div className="w-full h-[1px] bg-[#5e6266]" />
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSave,
  onCancel,
  onChangeLiveSettings,
  onOpenFeedback,
  onOpenDesignSystem,
  isDeveloperUnlocked = false,
  onToggleDeveloperUnlocked,
  channels = [],
}) => {
  const [initialSettings] = useState<UserSettings>(settings);
  const [temp, setTemp] = useState<UserSettings>({
    disablePanorama: false,
    lockPanoramaScroll: false,
    panoramaScrollSpeed: 5,
    reduceMotion: false,
    ...settings,
  });

  // Apply live settings preview to App as user adjusts options
  React.useEffect(() => {
    onChangeLiveSettings?.(temp);
  }, [temp, onChangeLiveSettings]);

  const [settingSearch, setSettingSearch] = useState('');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showDevKeyModal, setShowDevKeyModal] = useState(false);
  const [showPerfTestModal, setShowPerfTestModal] = useState(false);
  const [devKeyInput, setDevKeyInput] = useState('');
  const [devKeyStatus, setDevKeyStatus] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const handleExportChannels = () => {
    playPopSound();
    let m3u8Content = '#EXTM3U\n';
    channels.forEach((ch) => {
      const stream = ch.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
      m3u8Content += `#EXTINF:-1 tvg-id="${ch.id}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="${ch.groupTitle}",${ch.name}\n${stream}\n\n`;
    });

    const blob = new Blob([m3u8Content], { type: 'audio/x-mpegurl;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'Vplay_channels.m3u8');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleToggleSubtitles = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, subtitles: !prev.subtitles }));
  };

  const handleToggleAutoPlay = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, autoPlay: !prev.autoPlay }));
  };

  const handleToggleNotifications = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const handleToggleDisablePanorama = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, disablePanorama: !prev.disablePanorama }));
  };

  const handleToggleLockPanorama = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, lockPanoramaScroll: !prev.lockPanoramaScroll }));
  };

  const handleToggleReduceMotion = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  };

  const handleResetDefault = () => {
    playPopSound();
    setTemp({
      soundVolume: 7,
      qualityOption: '1080p',
      subtitles: true,
      autoPlay: true,
      searchQuery: 'Vplay Member',
      notifications: true,
      preferredCategory: 'all',
      themeMode: 'dark',
      hdQuality: true,
      disablePanorama: false,
      lockPanoramaScroll: false,
      panoramaScrollSpeed: 5,
      reduceMotion: false,
    });
  };

  const handleSaveClick = () => {
    playPopSound();
    onSave(temp);
  };

  const handleCancelClick = () => {
    playPopSound();
    onChangeLiveSettings?.(initialSettings);
    onCancel();
  };

  // Helper filter function for search term
  const matchesSearch = (title: string, subtitle?: string) => {
    if (!settingSearch.trim()) return true;
    const term = settingSearch.toLowerCase();
    return (
      title.toLowerCase().includes(term) ||
      (subtitle && subtitle.toLowerCase().includes(term))
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-2 sm:my-4 bg-[#4c4f52] border-2 border-[#141414] text-white font-montserrat shadow-2xl rounded-none overflow-hidden select-none">
      
      {/* SEARCH BAR AT THE TOP OF SETTINGS */}
      <div className="p-3 sm:p-4 bg-[#35383b]">
        <div className="relative flex items-center w-full">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search Icon"
            referrerPolicy="no-referrer"
            className="absolute left-3 w-5 h-5 object-contain pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Search for settings"
            value={settingSearch}
            onChange={(e) => setSettingSearch(e.target.value)}
            className="w-full h-9.5 bg-[#222426] text-white pl-10 pr-8 text-xs font-medium font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white placeholder:text-gray-400 shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
          />
          {settingSearch && (
            <button
              onClick={() => setSettingSearch('')}
              className="absolute right-3 text-gray-400 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <SettingsDivider />



      {/* SUBHEADING 1: GIAO DIỆN VÀ TÙY BIẾN */}
      {(matchesSearch('Disable panorama') ||
        matchesSearch('Lock panorama scroll') ||
        matchesSearch('Panorama scroll speed') ||
        matchesSearch('Reduce motion') ||
        matchesSearch('GIAO DIỆN VÀ TÙY BIẾN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              GIAO DIỆN VÀ TÙY BIẾN
            </h3>
          </div>

          <SettingsDivider />

          {/* Item 1: Disable panorama */}
          {matchesSearch('Disable panorama', 'Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Disable panorama</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.disablePanorama || false}
                  onChange={handleToggleDisablePanorama}
                />
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: Lock panorama scroll */}
          {matchesSearch('Lock panorama scroll', 'Khóa nền không gian đứng yên thay vì quay.') && (
            <>
              <div className={`px-3 sm:px-4 py-3 transition-colors flex items-center justify-between gap-3 ${
                temp.disablePanorama ? 'opacity-60 bg-[#3f4245]' : 'hover:bg-[#525559]'
              }`}>
                <div>
                  <div className={`font-bold text-xs ${temp.disablePanorama ? 'text-gray-400' : 'text-white'}`}>
                    Lock panorama scroll
                  </div>
                  <div className="text-[10px] text-gray-400 font-normal">
                    Khóa nền không gian đứng yên thay vì quay.
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.lockPanoramaScroll || false}
                  disabled={temp.disablePanorama}
                  forcedState={temp.disablePanorama ? 'disabled' : undefined}
                  onChange={handleToggleLockPanorama}
                />
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 3: Panorama scroll speed */}
          {matchesSearch('Panorama scroll speed', 'Tùy chỉnh độ quay nền không gian nhanh hay chậm.') && (
            <>
              <div className={`px-3 sm:px-4 py-3 transition-colors space-y-2 ${
                temp.disablePanorama ? 'opacity-60 bg-[#3f4245]' : 'hover:bg-[#525559]'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-bold text-xs ${temp.disablePanorama ? 'text-gray-400' : 'text-white'}`}>
                      Panorama scroll speed
                    </div>
                    <div className="text-[10px] text-gray-400 font-normal">
                      Tùy chỉnh độ quay nền không gian nhanh hay chậm.
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-xs ${temp.disablePanorama ? 'text-gray-400' : 'text-gray-200'}`}>
                    {temp.panoramaScrollSpeed || 5}
                  </span>
                </div>

                <VplaySlider
                  label=""
                  value={temp.panoramaScrollSpeed || 5}
                  min={1}
                  max={10}
                  disabled={temp.disablePanorama}
                  forcedState={temp.disablePanorama ? 'disabled' : undefined}
                  onChange={(v) => !temp.disablePanorama && setTemp({ ...temp, panoramaScrollSpeed: v })}
                  noBackground
                  className="!p-0"
                />
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 4: Reduce motion */}
          {matchesSearch('Reduce motion', 'Loại bỏ toàn bộ hiệu ứng khi di chuyển giữa các trang.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Reduce motion</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Loại bỏ toàn bộ hiệu ứng khi di chuyển giữa các trang.
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.reduceMotion || false}
                  onChange={handleToggleReduceMotion}
                />
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}

      {/* SUBHEADING: TÀI KHOẢN & THÔNG BÁO */}
      {(matchesSearch('Tên người dùng') ||
        matchesSearch('Sign in with Vplay account') ||
        matchesSearch('Thông báo sự kiện thể thao trực tiếp') ||
        matchesSearch('TÀI KHOẢN & THÔNG BÁO')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÀI KHOẢN & THÔNG BÁO
            </h3>
          </div>

          <SettingsDivider />

          {/* Sign in with Vplay account */}
          {matchesSearch('Sign in with Vplay account', 'Experience all the best things of Vplay with an official account.') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">
                    Sign in with Vplay account
                  </div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Experience all the best things of Vplay with an official account.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
                      playPopSound();
                      setShowComingSoonModal(true);
                    }}
                    className="w-full text-center"
                  >
                    Sign in
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Gamertag / User Name */}
          {matchesSearch('Biệt danh người dùng', 'Gamertag / User') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-xs text-white">Biệt danh người dùng</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Tên danh xưng hiển thị trong ứng dụng.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={temp.searchQuery}
                    onChange={(e) => setTemp({ ...temp, searchQuery: e.target.value })}
                    className="w-40 h-8 bg-[#222426] text-white px-2.5 py-1 text-xs font-normal font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
                  />
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Notifications Toggle removed as requested */}
        </div>
      )}

      {/* SUBHEADING 5: TÙY CHỌN NHÀ PHÁT TRIỂN */}
      {(matchesSearch('Performance test') ||
        matchesSearch('Ore UI design components') ||
        matchesSearch('Design components') ||
        matchesSearch('Unlock restricted features') ||
        matchesSearch('Enter password') ||
        matchesSearch('Disable features') ||
        matchesSearch('Reset settings to default') ||
        matchesSearch('TÙY CHỌN NHÀ PHÁT TRIỂN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÙY CHỌN NHÀ PHÁT TRIỂN
            </h3>
          </div>

          <SettingsDivider />

          {/* Item 1: Unlock restricted features */}
          {(matchesSearch('Unlock restricted features', 'Enables features that are currently under development.') ||
            matchesSearch('Enter password') ||
            matchesSearch('Disable features')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Unlock restricted features</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Enables features that are currently under development.
                  </div>
                </div>
                <div className="w-36 flex-shrink-0">
                  {isDeveloperUnlocked ? (
                    <VplaySecondaryButton
                      size="sm"
                      onClick={() => {
                        playPopSound();
                        onToggleDeveloperUnlocked?.(false);
                      }}
                    >
                      Disable features
                    </VplaySecondaryButton>
                  ) : (
                    <VplaySecondaryButton
                      size="sm"
                      onClick={() => {
                        playPopSound();
                        setShowDevKeyModal(true);
                      }}
                    >
                      Enter password
                    </VplaySecondaryButton>
                  )}
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: Performance test */}
          {(matchesSearch('Performance test', 'Kiểm tra hiệu năng GPU/CPU, FPS, độ trễ khung hình & bộ nhớ với stress test toàn màn hình.') ||
            matchesSearch('Performance') ||
            matchesSearch('Stress test') ||
            matchesSearch('Test')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Performance test</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Kiểm tra hiệu năng GPU/CPU, FPS, độ trễ khung hình & bộ nhớ với stress test toàn màn hình.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
                      playPopSound();
                      setShowPerfTestModal(true);
                    }}
                  >
                    Test
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: Ore UI design components */}
          {(matchesSearch('Ore UI design components', 'Hệ thống ngôn ngữ thiết kế giao diện của Vplay.') ||
            matchesSearch('Design components')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Ore UI design components</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Hệ thống ngôn ngữ thiết kế giao diện Ore UI của Vplay.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
                      playPopSound();
                      if (onOpenDesignSystem) onOpenDesignSystem();
                    }}
                  >
                    Open
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 3: Export channels (.m3u8) */}
          {(matchesSearch('Export channels (.m3u8)', 'Tải file m3u8 danh sách các kênh.') ||
            matchesSearch('Export channels') ||
            matchesSearch('m3u8')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Export channels (.m3u8)</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Tải file danh sách toàn bộ {channels.length} kênh Vplay dưới dạng .m3u8.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={handleExportChannels}
                  >
                    {exported ? 'Exported!' : 'Export'}
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 4: Reset settings to default */}
          {matchesSearch('Reset settings to default', 'Restore all above options to their original values.') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Reset settings to default</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Restore all above options to their original values.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={handleResetDefault}
                  >
                    Reset
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}



      <SettingsDivider />

      {/* Footer Diagnostic Info */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#383b3e] text-[10px] font-mono text-gray-400 space-y-0.5">
        <div>DDUI: cf4bef566256457eb1391a01b5b02e2c</div>
        <div>VCID: 28601FFA239DADCE</div>
        <div>VERSION: release-preview</div>
      </div>
      <SettingsDivider />

      {/* COMING SOON MODAL */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
          <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-sm sm:max-w-md shadow-2xl text-white font-montserrat select-none flex flex-col h-[65vh] max-h-[380px] my-auto overflow-hidden">
            
            {/* PHẦN 1: HEADER (Title not uppercase, enlarged pixel buttons) */}
            <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowComingSoonModal(false);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
                title="Back"
              >
                ‹
              </button>

              <h2 className="text-sm sm:text-base font-bold text-white font-montserrat text-center flex-1 tracking-tight">
                Coming soon
              </h2>

              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowComingSoonModal(false);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* PHẦN 2: PHẦN CHÍNH (Nền tối hơn #222426, luôn scrollable) */}
            <div className="p-6 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar flex flex-col items-center justify-center text-center">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                Tính năng này đang trong quá trình phát triển & thử nghiệm. Vui lòng quay lại sau!
              </p>
            </div>

            {/* Divider */}
            <SettingsDivider />

            {/* PHẦN 3: PHẦN NÚT */}
            <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  setShowComingSoonModal(false);
                }}
              >
                Đã hiểu
              </VplaySecondaryButton>
            </div>

          </div>
        </div>
      )}

      {/* DEVELOPER KEY REQUIRED MODAL */}
      {showDevKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
          <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-md shadow-2xl text-white font-montserrat select-none flex flex-col h-[75vh] max-h-[480px] my-auto overflow-hidden">
            
            {/* PHẦN 1: HEADER (Title not uppercase, enlarged pixel buttons) */}
            <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
                title="Back"
              >
                ‹
              </button>

              <h2 className="text-sm sm:text-base font-bold text-white font-montserrat text-center flex-1 tracking-tight">
                A developer key is required
              </h2>

              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* PHẦN 2: PHẦN CHÍNH (Nền tối hơn #222426, luôn scrollable) */}
            <div className="p-4 space-y-4 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar text-xs">
              <p className="text-xs text-gray-200 leading-relaxed font-normal">
                This feature is locked behind a developer access key. Please enter a 6-digits key if you are the developer.
              </p>

              <div className="space-y-2 bg-[#2b2d30] p-3.5 border border-[#141414]">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Mã Developer Key (6 chữ số)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={devKeyInput}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 6);
                    setDevKeyInput(val);
                    if (devKeyStatus) setDevKeyStatus(null);
                  }}
                  placeholder="Nhập 6 chữ số..."
                  className="w-full h-10 bg-[#18191a] text-white px-3 text-xs sm:text-sm font-normal font-montserrat border-2 border-[#101112] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.5)] placeholder:text-gray-400 cursor-pointer tracking-widest text-center"
                />
                {devKeyStatus && (
                  <p className={`text-[11px] font-medium text-center ${devKeyStatus.includes('successfully') || devKeyStatus.includes('Unlocked') ? 'text-green-400' : 'text-red-400'}`}>
                    {devKeyStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <SettingsDivider />

            {/* PHẦN 3: PHẦN NÚT (Mỗi nút 1 dòng) */}
            <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
              <VplayPrimaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  if (devKeyInput.trim() === '366761') {
                    setDevKeyStatus('Unlocked restricted features successfully!');
                    onToggleDeveloperUnlocked?.(true);
                    setTimeout(() => {
                      setShowDevKeyModal(false);
                      setDevKeyInput('');
                      setDevKeyStatus(null);
                    }, 800);
                  } else {
                    setDevKeyStatus('Developer key is invalid. Please try again.');
                  }
                }}
              >
                Mở khóa tính năng
              </VplayPrimaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
              >
                Đóng
              </VplaySecondaryButton>
            </div>

          </div>
        </div>
      )}

      {/* PERFORMANCE STRESS TEST MODAL */}
      <PerformanceTestModal
        isOpen={showPerfTestModal}
        onClose={() => setShowPerfTestModal(false)}
      />

    </div>
  );
};
