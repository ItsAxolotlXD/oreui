import React, { useState } from 'react';
import { UserSettings } from '../types';
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
}

const SettingsDivider = () => (
  <div className="w-full flex flex-col select-none pointer-events-none">
    <div className="w-full h-[1px] bg-[#18191b]" />
    <div className="w-full h-[1px] bg-[#5e6266]" />
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onChangeLiveSettings,
  onOpenDesignSystem,
  isDeveloperUnlocked = false,
  onToggleDeveloperUnlocked,
}) => {
  const [temp, setTemp] = useState<UserSettings>({
    disablePanorama: true,
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

  const handleToggleDisablePanorama = () => {
    setTemp((prev) => ({ ...prev, disablePanorama: !prev.disablePanorama }));
  };

  const handleToggleLockPanorama = () => {
    setTemp((prev) => ({ ...prev, lockPanoramaScroll: !prev.lockPanoramaScroll }));
  };

  const handleToggleReduceMotion = () => {
    setTemp((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  };

  const handleResetDefault = () => {
    const def: UserSettings = {
      autoPlay: true,
      subtitles: true,
      hdQuality: true,
      soundVolume: 7,
      qualityOption: '1080p',
      preferredCategory: 'all',
      themeMode: 'dark',
      notifications: true,
      searchQuery: 'Craftmine Player',
      disablePanorama: true,
      lockPanoramaScroll: false,
      panoramaScrollSpeed: 5,
      reduceMotion: false,
    };
    setTemp(def);
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
    <div className="w-full my-2 sm:my-4 bg-[#4c4f52] border-2 border-[#141414] text-white font-minecraft-seven shadow-2xl rounded-none overflow-hidden select-none">
      
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
            className="w-full h-9.5 bg-[#222426] text-white pl-10 pr-8 text-xs font-minecraft-seven border-2 border-[#141414] focus:outline-none focus:border-[#89dc69] placeholder:text-gray-400 shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
          />
          {settingSearch && (
            <button
              onMouseDown={() => playPopSound()}
              onClick={() => setSettingSearch('')}
              className="absolute right-3 text-gray-400 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <SettingsDivider />

      {/* SUBHEADING 1: INTERFACE & CUSTOMIZATION */}
      {(matchesSearch('Disable panorama') ||
        matchesSearch('Lock panorama scroll') ||
        matchesSearch('Panorama scroll speed') ||
        matchesSearch('Reduce motion') ||
        matchesSearch('INTERFACE & CUSTOMIZATION')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="text-xs sm:text-sm uppercase text-gray-200 font-minecraft-ten tracking-wide">
              INTERFACE & CUSTOMIZATION
            </h3>
          </div>

          <SettingsDivider />

          {/* Item 1: Disable panorama */}
          {matchesSearch('Disable panorama', 'Change app background to dark charcoal instead of space panorama.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">Disable panorama</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Change app background to dark charcoal instead of space panorama.
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
          {matchesSearch('Lock panorama scroll', 'Lock the space panorama background in place instead of rotating.') && (
            <>
              <div className={`px-3 sm:px-4 py-3 transition-colors flex items-center justify-between gap-3 ${
                temp.disablePanorama ? 'opacity-60 bg-[#3f4245]' : 'hover:bg-[#525559]'
              }`}>
                <div>
                  <div className={`text-xs font-minecraft-seven ${temp.disablePanorama ? 'text-gray-400' : 'text-white'}`}>
                    Lock panorama scroll
                  </div>
                  <div className="text-[10px] text-gray-400 font-minecraft-seven">
                    Lock the space panorama background in place instead of rotating.
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
          {matchesSearch('Panorama scroll speed', 'Adjust how fast or slow the space panorama rotates.') && (
            <>
              <div className={`px-3 sm:px-4 py-3 transition-colors space-y-2 ${
                temp.disablePanorama ? 'opacity-60 bg-[#3f4245]' : 'hover:bg-[#525559]'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-minecraft-seven ${temp.disablePanorama ? 'text-gray-400' : 'text-white'}`}>
                      Panorama scroll speed
                    </div>
                    <div className="text-[10px] text-gray-400 font-minecraft-seven">
                      Adjust how fast or slow the space panorama rotates.
                    </div>
                  </div>
                  <span className={`font-mono text-xs ${temp.disablePanorama ? 'text-gray-400' : 'text-gray-200'}`}>
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
          {matchesSearch('Reduce motion', 'Disable transition motion effects between pages.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">Reduce motion</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Disable transition motion effects between pages.
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

      {/* SUBHEADING: ACCOUNT & SIGN IN (Player Gamertag removed as requested) */}
      {(matchesSearch('Sign in with Craftmine account') ||
        matchesSearch('ACCOUNT')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="text-xs sm:text-sm uppercase text-gray-200 font-minecraft-ten tracking-wide">
              ACCOUNT
            </h3>
          </div>

          <SettingsDivider />

          {/* Sign in with Craftmine account */}
          {matchesSearch('Sign in with Craftmine account', 'Experience all the best things of The Craftmine with an official account.') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">
                    Sign in with Craftmine account
                  </div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Experience all the best things of The Craftmine with an official account.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => setShowComingSoonModal(true)}
                    className="w-full text-center"
                  >
                    Sign in
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}

      {/* SUBHEADING: DEVELOPER OPTIONS (Export settings removed as requested) */}
      {(matchesSearch('Performance test') ||
        matchesSearch('Ore UI design components') ||
        matchesSearch('Design components') ||
        matchesSearch('Unlock restricted features') ||
        matchesSearch('Enter password') ||
        matchesSearch('Disable features') ||
        matchesSearch('Reset settings to default') ||
        matchesSearch('DEVELOPER OPTIONS')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="text-xs sm:text-sm uppercase text-gray-200 font-minecraft-ten tracking-wide">
              DEVELOPER OPTIONS
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
                  <div className="text-xs text-white font-minecraft-seven">Unlock restricted features</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Enables experimental features currently under active development.
                  </div>
                </div>
                <div className="w-36 flex-shrink-0">
                  {isDeveloperUnlocked ? (
                    <VplaySecondaryButton
                      size="sm"
                      onClick={() => onToggleDeveloperUnlocked?.(false)}
                    >
                      Disable features
                    </VplaySecondaryButton>
                  ) : (
                    <VplaySecondaryButton
                      size="sm"
                      onClick={() => setShowDevKeyModal(true)}
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
          {(matchesSearch('Performance test') ||
            matchesSearch('Performance') ||
            matchesSearch('Stress test') ||
            matchesSearch('Test')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">Performance test</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Test GPU/CPU performance, FPS, frame latency and memory with full-screen stress test.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => setShowPerfTestModal(true)}
                  >
                    Test
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 3: Ore UI design components */}
          {(matchesSearch('Ore UI design components') ||
            matchesSearch('Design components')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">Ore UI design components</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Explore component matrix and state guidelines of The Craftmine Ore UI.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
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

          {/* Item 4: Reset settings to default */}
          {matchesSearch('Reset settings to default') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-minecraft-seven">Reset settings to default</div>
                  <div className="text-[10px] text-gray-300 font-minecraft-seven">
                    Restore all above options to their original default values.
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
          <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-sm sm:max-w-md shadow-2xl text-white font-minecraft-seven select-none flex flex-col h-[65vh] max-h-[380px] my-auto overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => setShowComingSoonModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
                title="Back"
              >
                ‹
              </button>

              <h2 className="text-sm sm:text-base text-white font-minecraft-seven text-center flex-1 tracking-tight">
                Coming soon
              </h2>

              <button
                onMouseDown={() => playPopSound()}
                onClick={() => setShowComingSoonModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar flex flex-col items-center justify-center text-center">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                This feature is currently under active development & testing. Please check back soon!
              </p>
            </div>

            <SettingsDivider />

            {/* BUTTON */}
            <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => setShowComingSoonModal(false)}
              >
                Got it
              </VplaySecondaryButton>
            </div>

          </div>
        </div>
      )}

      {/* DEVELOPER KEY REQUIRED MODAL */}
      {showDevKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
          <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-md shadow-2xl text-white font-minecraft-seven select-none flex flex-col h-[75vh] max-h-[480px] my-auto overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
                title="Back"
              >
                ‹
              </button>

              <h2 className="text-sm sm:text-base text-white font-minecraft-seven text-center flex-1 tracking-tight">
                A developer key is required
              </h2>

              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-4 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar text-xs">
              <p className="text-xs text-gray-200 leading-relaxed font-normal">
                This feature is locked behind a developer access key. Please enter the 6-digit key if you are the developer.
              </p>

              <div className="space-y-2 bg-[#2b2d30] p-3.5 border border-[#141414]">
                <label className="block text-xs text-white uppercase tracking-wider font-minecraft-seven">
                  Developer Key (6 digits)
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
                  placeholder="Enter 6 digits..."
                  className="w-full h-10 bg-[#18191a] text-white px-3 text-xs sm:text-sm font-minecraft-seven border-2 border-[#101112] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.5)] placeholder:text-gray-400 cursor-pointer tracking-widest text-center"
                />
                {devKeyStatus && (
                  <p className={`text-[11px] font-minecraft-seven text-center ${devKeyStatus.includes('successfully') || devKeyStatus.includes('Unlocked') ? 'text-green-400' : 'text-red-400'}`}>
                    {devKeyStatus}
                  </p>
                )}
              </div>
            </div>

            <SettingsDivider />

            {/* BUTTONS */}
            <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
              <VplayPrimaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
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
                Unlock features
              </VplayPrimaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  setShowDevKeyModal(false);
                  setDevKeyInput('');
                  setDevKeyStatus(null);
                }}
              >
                Close
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
