import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ExternalLink } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';

interface SettingsViewProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onCancel: (newSettings: UserSettings) => void; // allow pass or fallback
  onOpenFeedback?: () => void;
}

const SettingsDivider = () => (
  <div className="w-full h-[2px] border-t border-[#1c1d1f] border-b border-[#56595d]" />
);

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSave,
  onCancel,
  onOpenFeedback,
}) => {
  const [temp, setTemp] = useState<UserSettings>({ ...settings });

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

  const handleResetDefault = () => {
    playPopSound();
    setTemp({
      soundVolume: 8,
      qualityOption: '1080p',
      subtitles: true,
      autoPlay: true,
      searchQuery: 'Vplay Member',
      notifications: true,
      preferredCategory: 'TẤT CẢ',
      themeMode: 'dark',
    });
  };

  const handleSaveClick = () => {
    playPopSound();
    onSave(temp);
  };

  const handleCancelClick = () => {
    playPopSound();
    onCancel();
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-2 sm:my-4 bg-[#4c4f52] border-2 border-[#141414] text-white font-montserrat shadow-2xl rounded-none overflow-hidden select-none">
      
      {/* Welcome & Feedback Banner Box */}
      <div className="p-3 sm:p-4 bg-[#424548] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] text-gray-300 font-normal leading-normal mb-0.5">
            Welcome to design preview!
          </h2>
          <p className="text-[11px] text-gray-300 font-normal leading-normal">
            We would love to hear what you think of this new design. Keep in mind that it's still work in progress and some functionality might be missing
          </p>
        </div>
        <button
          onClick={() => {
            playPopSound();
            if (onOpenFeedback) onOpenFeedback();
            else alert('Cảm ơn bạn đã đóng góp ý kiến về giao diện Vplay!');
          }}
          className="flex items-center gap-1.5 bg-[#dcdfe2] hover:bg-white text-[#141414] font-bold text-xs px-3 py-1.5 border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Give feedback
        </button>
      </div>

      <SettingsDivider />

      {/* SECTION 1: KEYBOARD & MOUSE / AUDIO */}
      <div>
        <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
          <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
            ÂM THANH & CẤU HÌNH THIẾT BỊ
          </h3>
          <p className="text-[10px] text-gray-300 font-normal">
            Input options, volume levels, and audio output options
          </p>
        </div>

        <SettingsDivider />

        {/* Row: Volume Slider */}
        <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-white">
                Âm lượng mặc định (Sound volume)
              </div>
              <div className="text-[10px] text-gray-300 font-normal">
                Adjust the default volume output level (0 - 100)
              </div>
            </div>
            <span className="font-mono font-bold text-xs text-gray-200">
              {temp.soundVolume * 10}
            </span>
          </div>

          {/* Minecraft Custom Pixel Slider */}
          <div className="relative pt-1 pb-1 flex items-center">
            <div className="relative w-full h-2.5 bg-[#25272a] border border-[#141414] flex items-center">
              {/* Green Progress Fill */}
              <div
                className="h-full bg-[#55b331] transition-all"
                style={{ width: `${(temp.soundVolume / 10) * 100}%` }}
              />
              {/* Range Input on top */}
              <input
                type="range"
                min={0}
                max={10}
                value={temp.soundVolume}
                onChange={(e) => {
                  playPopSound();
                  setTemp({ ...temp, soundVolume: parseInt(e.target.value, 10) });
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Pixel Handle Thumb */}
              <div
                className="absolute w-3.5 h-4 bg-[#dcdfe2] border border-[#141414] pointer-events-none transform -translate-x-1/2 shadow-sm"
                style={{ left: `${(temp.soundVolume / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <SettingsDivider />

      {/* SECTION 2: CHẤT LƯỢNG & PHỤ ĐỀ */}
      <div>
        <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
          <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
            CHẤT LƯỢNG & PHỤ ĐỀ TRUYỀN HÌNH
          </h3>
        </div>

        <SettingsDivider />

        {/* Quality Options */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-bold text-xs text-white">
              Độ phân giải ưu tiên
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Tự động tối ưu chất lượng video theo đường truyền
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['4K', '1080p', '720p', '480p'].map((q) => {
              const isActive = temp.qualityOption === q;
              return (
                <button
                  key={q}
                  onClick={() => {
                    playPopSound();
                    setTemp({ ...temp, qualityOption: q as UserSettings['qualityOption'] });
                  }}
                  className={`
                    px-2.5 py-1 text-[11px] font-bold border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect
                    ${isActive ? 'bg-[#55b331] text-white' : 'bg-[#dcdfe2] text-[#141414] hover:bg-white'}
                  `}
                >
                  {q}
                </button>
              );
            })}
          </div>
        </div>

        <SettingsDivider />

        {/* Toggle: Subtitles */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-white">
              Tự động bật phụ đề tiếng Việt
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Hiển thị phụ đề dịch thuật trên các kênh tin tức & phim truyện
            </div>
          </div>
          <VplayToggleSwitch
            checked={temp.subtitles}
            onChange={handleToggleSubtitles}
          />
        </div>

        <SettingsDivider />

        {/* Toggle: Auto play / Auto jump */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-white">
              Tự động phát khi chuyển kênh (Auto jump)
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Tự động tải luồng truyền hình trực tiếp ngay khi bấm chọn kênh
            </div>
          </div>
          <VplayToggleSwitch
            checked={temp.autoPlay}
            onChange={handleToggleAutoPlay}
          />
        </div>
      </div>

      <SettingsDivider />

      {/* SECTION 3: TÀI KHOẢN & THÔNG BÁO */}
      <div>
        <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
          <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
            TÀI KHOẢN & THÔNG BÁO
          </h3>
        </div>

        <SettingsDivider />

        {/* Gamertag / User Name */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-bold text-xs text-white">
              Tên người dùng (Gamertag / User)
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Tên danh xưng hiển thị trên thiết bị đầu thu Vplay
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temp.searchQuery}
              onChange={(e) => setTemp({ ...temp, searchQuery: e.target.value })}
              className="bg-[#2a2c2e] text-white border-2 border-[#141414] px-2.5 py-1 text-xs font-bold focus:outline-none w-40"
            />
          </div>
        </div>

        <SettingsDivider />

        {/* Notifications Toggle */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-white">
              Thông báo sự kiện thể thao trực tiếp
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Nhận nhắc nhở lịch thi đấu Ngoại hạng Anh & sự kiện trực tiếp
            </div>
          </div>
          <VplayToggleSwitch
            checked={temp.notifications}
            onChange={handleToggleNotifications}
          />
        </div>

        <SettingsDivider />

        {/* Reset Row */}
        <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-white">
              Reset settings to default
            </div>
            <div className="text-[10px] text-gray-300 font-normal">
              Restore all the above options to their original default values
            </div>
          </div>
          <button
            onClick={handleResetDefault}
            className="bg-[#dcdfe2] hover:bg-white text-[#141414] font-bold text-xs px-4 py-1 border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect"
          >
            Reset
          </button>
        </div>
      </div>

      <SettingsDivider />

      {/* Save Action Bar */}
      <div className="p-3 bg-[#3d4043] flex items-center justify-end gap-2.5">
        <button
          onClick={handleCancelClick}
          className="bg-[#323437] hover:bg-[#3d4043] text-gray-200 font-bold text-xs px-4 py-1.5 border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect"
        >
          HỦY BỎ
        </button>
        <button
          onClick={handleSaveClick}
          className="bg-[#55b331] hover:bg-[#62c938] text-white font-extrabold text-xs px-5 py-1.5 border-2 border-[#141414] shadow-[inset_0_1px_0_#89dc69] cursor-pointer active:translate-y-[1px] btn-press-effect"
        >
          LƯU CÀI ĐẶT
        </button>
      </div>

      {/* Footer Diagnostic Info (matching Minecraft Settings screenshot) */}
      <div className="px-3 sm:px-4 py-2 bg-[#383b3e] text-[10px] font-mono text-gray-400 space-y-0.5 border-t border-[#2d3033]">
        <div>DID: cf4bef566256457eb1391a01b5b02e2c</div>
        <div>MCID: 28601FFA239DADCE</div>
        <div>VERSION: Vplay HD v2.4.10-release</div>
      </div>

    </div>
  );
};
