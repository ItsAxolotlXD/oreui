import React, { useState, useEffect, useRef } from 'react';
import { TvChannel, UserSettings } from '../types';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayCheckbox } from './ui/VplayCheckbox';
import { VplayDropdown } from './ui/VplayDropdown';
import { VplaySlider } from './ui/VplaySlider';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplayTab } from './ui/VplayTab';
import { Volume2, VolumeX, Maximize2, Radio, Tv, Eye, Play, Pause, AlertCircle } from 'lucide-react';
import Hls from 'hls.js';

interface TvPlayerProps {
  channel: TvChannel;
  onSelectChannel: (channel: TvChannel) => void;
  channels: TvChannel[];
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
}

export const TvPlayer: React.FC<TvPlayerProps> = ({
  channel,
  onSelectChannel,
  channels,
  settings,
  onUpdateSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(settings.soundVolume || 7);
  const [quality, setQuality] = useState(settings.qualityOption || '1080p');
  const [isFavorite, setIsFavorite] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS stream when channel changes
  useEffect(() => {
    setStreamError(false);
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (channel.streamUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(channel.streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) {
            video.play().catch(() => {
              // Auto-play was prevented or CORS blocked
            });
          }
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setStreamError(true);
          }
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channel.streamUrl;
        if (isPlaying) video.play().catch(() => {});
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.id, channel.streamUrl]);

  // Update volume / muted on video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 10;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  const togglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (videoRef.current) {
      if (nextPlay) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-full space-y-6">
      {/* TV SCREEN / VIDEO PLAYER FRAME */}
      <div className={`relative bg-[#0d0e0f] border-4 border-[#141414] shadow-2xl transition-all duration-300 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black flex flex-col justify-center' : 'w-full aspect-video max-h-[560px]'}`}>
        
        {/* Background Stream Player */}
        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
          
          {/* HTML5 Video element with HLS */}
          <video
            ref={videoRef}
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying && !streamError ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          />

          {/* Fallback image when video isn't playing or stream errors out */}
          {(!isPlaying || streamError || !channel.streamUrl) && (
            <img
              src={channel.videoBg}
              alt={channel.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-80 scale-105' : 'opacity-30 blur-sm'}`}
            />
          )}

          {/* CRT Scanline effect */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />

          {/* Animated Broadcast Overlay elements */}
          {isPlaying && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 border border-[#418a28] z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-[#89dc69] font-montserrat font-bold text-[11px] uppercase">
                {channel.badge || 'LIVE'}
              </span>
              <span className="text-gray-300 font-montserrat text-xs ml-2">
                | {channel.resolution}
              </span>
            </div>
          )}

          {/* Channel Logo Watermark */}
          <div className="absolute top-4 right-4 bg-[#1e2022]/90 border border-[#418a28] px-2.5 py-1 text-white font-montserrat font-bold text-xs shadow-md z-10 max-w-[220px] flex items-center gap-2 truncate">
            {channel.logo && (
              <img
                src={channel.logo}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="h-5 w-auto object-contain max-w-[50px] filter drop-shadow"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}
            <span className="truncate">{channel.name}</span>
          </div>

          {/* Stream Error Notice Overlay */}
          {streamError && isPlaying && (
            <div className="absolute top-16 left-4 bg-amber-950/90 border border-amber-600 text-amber-200 px-3 py-1.5 text-xs font-montserrat font-medium z-10 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Đang thử kết nối luồng trực tiếp... (Giới hạn CORS)</span>
            </div>
          )}

          {/* Pause Screen Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-6 space-y-4 z-20">
              <Tv className="w-16 h-16 text-[#89dc69] animate-bounce" />
              <h3 className="text-lg font-montserrat font-bold text-white uppercase">ĐÃ TẠM DỪNG PHÁT SÓNG</h3>
              <p className="text-xs text-gray-300 font-montserrat max-w-md">
                Nhấn nút phát hoặc chọn kênh khác trong danh sách truyền hình Vplay
              </p>
              <div className="w-48">
                <VplayHeroButton onClick={togglePlay}>
                  ▶ PHÁT BÂY GIỜ
                </VplayHeroButton>
              </div>
            </div>
          )}

          {/* Bottom Stream Info Overlay */}
          {isPlaying && (
            <div className="absolute bottom-16 left-4 right-4 bg-black/80 border border-[#3a3c3f] p-3 backdrop-blur-sm hidden sm:flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-[#89dc69] animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white font-montserrat truncate max-w-md">
                    {channel.currentProgram}
                  </div>
                  <div className="text-[11px] text-gray-400 font-montserrat truncate">
                    Nguồn phát: {channel.groupTitle} | {channel.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-montserrat text-gray-300">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-[#89dc69]" /> {channel.viewers}
                </span>
                <span className="text-[#89dc69] font-bold">⭐ {channel.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* PIXEL CONTROL BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1e2022]/95 border-t-2 border-[#141414] p-3 flex flex-wrap items-center justify-between gap-3 z-30">
          
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <div className="w-32">
              <VplayHeroButton onClick={togglePlay}>
                {isPlaying ? '⏸ TẠM DỪNG' : '▶ PHÁT'}
              </VplayHeroButton>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-[#3a3c3f] border border-[#141414] hover:bg-[#4d5055] text-white active:translate-y-[2px] cursor-pointer"
              title="Tắt/Mở tiếng"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-[#89dc69]" />}
            </button>

            {/* Vplay Volume Slider */}
            <div className="hidden lg:block w-48">
              <VplaySlider
                label="Âm lượng"
                value={isMuted ? 0 : volume}
                min={0}
                max={10}
                onChange={(v) => {
                  setVolume(v);
                  if (v > 0) setIsMuted(false);
                }}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#292a2c] px-3 py-1.5 border border-[#141414] flex items-center">
              <VplayCheckbox
                checked={isFavorite}
                onChange={setIsFavorite}
                label="Yêu thích"
              />
            </div>

            <div className="w-36 hidden sm:block">
              <VplayDropdown
                label=""
                value={quality}
                onChange={setQuality}
                options={[
                  { value: '4K', label: '4K Ultra HD' },
                  { value: '1080p', label: '1080p Full HD' },
                  { value: '720p', label: '720p HD' },
                  { value: '480p', label: '480p SD' },
                ]}
              />
            </div>

            <VplaySecondaryButton onClick={toggleFullscreen} fullWidth={false} className="!px-3">
              <Maximize2 className="w-4 h-4" />
            </VplaySecondaryButton>
          </div>
        </div>
      </div>

      {/* CHANNEL DETAILS & EPISODE SCHEDULE TABS */}
      <div className="bg-[#292a2c] border-2 border-[#141414] p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap border-b border-[#3e4145] pb-4">
          {['Lịch phát sóng EPG', 'Thông tin kênh', 'Tùy chỉnh luồng phát', 'Đề xuất kênh khác'].map((tabTitle, idx) => (
            <VplayTab
              key={tabTitle}
              active={activeTab === idx}
              onClick={() => setActiveTab(idx)}
            >
              {tabTitle}
            </VplayTab>
          ))}
        </div>

        {/* Tab 0: Lịch phát sóng (EPG) */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#89dc69] uppercase font-montserrat">
                Lịch Truyền Hình ({channel.name})
              </h3>
              <span className="text-xs text-gray-400 font-montserrat">Múi giờ GMT+7 Việt Nam</span>
            </div>

            <div className="space-y-2">
              {[
                { time: '18:00', title: 'Chuyển động 24h & Tin tức nổi bật', active: false },
                { time: '19:00', title: channel.currentProgram, active: true },
                { time: '20:15', title: channel.nextProgram, active: false },
                { time: '21:30', title: 'Phim truyền hình Việt Nam đặc sắc', active: false },
                { time: '23:00', title: 'Đêm nhạc acoustic & Tổng hợp tin quốc tế', active: false },
              ].map((prog, i) => (
                <div
                  key={i}
                  className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-montserrat text-xs ${
                    prog.active ? 'bg-[#418a28]/20 border-[#418a28] text-white' : 'bg-[#1f2123] border-[#383a3d] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 font-montserrat font-bold text-[10px] ${prog.active ? 'bg-[#418a28] text-white' : 'bg-[#333] text-gray-400'}`}>
                      {prog.time}
                    </span>
                    <span className="font-bold">{prog.title}</span>
                  </div>
                  {prog.active && (
                    <span className="text-[#89dc69] font-montserrat font-bold text-[10px] animate-pulse">
                      ● ĐANG PHÁT TRỰC TIẾP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Thông tin kênh */}
        {activeTab === 1 && (
          <div className="space-y-4 text-xs font-montserrat text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1f2123] p-4 border border-[#383a3d] space-y-2">
                <p><strong className="text-[#89dc69]">Tên kênh:</strong> {channel.name}</p>
                <p><strong className="text-[#89dc69]">Nhóm kênh:</strong> {channel.groupTitle}</p>
                <p><strong className="text-[#89dc69]">Ngôn ngữ:</strong> {channel.language}</p>
                <p><strong className="text-[#89dc69]">Chất lượng:</strong> {channel.resolution}</p>
              </div>
              <div className="bg-[#1f2123] p-4 border border-[#383a3d] space-y-2">
                <p><strong className="text-[#89dc69]">Lượt xem:</strong> {channel.viewers}</p>
                <p><strong className="text-[#89dc69]">Đánh giá:</strong> {channel.rating}</p>
                <p><strong className="text-[#89dc69]">Mô tả:</strong> {channel.summary}</p>
                {channel.streamUrl && (
                  <p className="truncate"><strong className="text-[#89dc69]">Luồng HLS:</strong> <span className="text-gray-400 font-mono text-[10px]">{channel.streamUrl}</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tùy chỉnh luồng phát */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VplayToggleSwitch
              checked={settings.subtitles}
              onChange={(b) => onUpdateSettings({ ...settings, subtitles: b })}
              label="Hiển thị phụ đề tiếng Việt"
            />
            <VplayToggleSwitch
              checked={settings.autoPlay}
              onChange={(b) => onUpdateSettings({ ...settings, autoPlay: b })}
              label="Tự động phát khi chuyển kênh"
            />
          </div>
        )}

        {/* Tab 3: Đề xuất kênh khác */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.slice(0, 9).filter(c => c.id !== channel.id).map((other) => (
              <div
                key={other.id}
                onClick={() => onSelectChannel(other)}
                className="bg-[#1f2123] border-2 border-[#141414] p-3 hover:border-[#418a28] cursor-pointer transition-colors space-y-2 active:translate-y-[2px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-montserrat font-bold text-xs text-[#89dc69] truncate max-w-[150px]">{other.name}</span>
                  <span className="text-[10px] bg-[#333] px-2 py-0.5 text-gray-300 font-montserrat">{other.groupTitle}</span>
                </div>
                <div className="text-xs font-bold font-montserrat text-white truncate">{other.currentProgram}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
