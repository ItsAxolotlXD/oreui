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
      <div className={`relative group bg-[#0d0e0f] border-4 border-[#141414] shadow-2xl transition-all duration-300 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black flex flex-col justify-center' : 'w-full aspect-video max-h-[560px]'}`}>
        
        {/* Background Stream Player */}
        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
          
          {/* HTML5 Video element with HLS */}
          <video
            ref={videoRef}
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              !streamError ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          />

          {/* Fallback image when stream errors out or url is missing */}
          {(streamError || !channel.streamUrl) && (
            <img
              src={channel.videoBg}
              alt={channel.name}
              className="w-full h-full object-cover opacity-100"
            />
          )}
        </div>

        {/* PIXEL CONTROL BAR - ON HOVER ONLY */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1e2022]/95 border-t-2 border-[#141414] p-3 flex flex-wrap items-center justify-between gap-3 z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
          
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

            <VplaySecondaryButton onClick={toggleFullscreen} fullWidth={false} className="!px-3">
              <Maximize2 className="w-4 h-4" />
            </VplaySecondaryButton>
          </div>
        </div>
      </div>

      {/* CHANNEL DETAILS TABS */}
      <div className="bg-[#292a2c] border-2 border-[#141414] p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap border-b border-[#3e4145] pb-4">
          {['Thông tin kênh', 'Tùy chỉnh luồng phát', 'Đề xuất kênh khác'].map((tabTitle, idx) => (
            <VplayTab
              key={tabTitle}
              active={activeTab === idx}
              onClick={() => setActiveTab(idx)}
            >
              {tabTitle}
            </VplayTab>
          ))}
        </div>

        {/* Tab 0: Thông tin kênh */}
        {activeTab === 0 && (
          <div className="space-y-4 text-xs font-montserrat text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1f2123] p-4 border border-[#383a3d] space-y-2">
                <p><strong className="text-[#89dc69]">Tên kênh:</strong> {channel.name}</p>
                <p><strong className="text-[#89dc69]">Nhóm kênh:</strong> {channel.groupTitle}</p>
                <p><strong className="text-[#89dc69]">Ngôn ngữ:</strong> {channel.language}</p>
                <p><strong className="text-[#89dc69]">Chất lượng:</strong> {channel.resolution}</p>
              </div>
              <div className="bg-[#1f2123] p-4 border border-[#383a3d] space-y-2">
                <p><strong className="text-[#89dc69]">Mô tả:</strong> {channel.summary}</p>
                {channel.streamUrl && (
                  <p className="truncate"><strong className="text-[#89dc69]">Luồng HLS:</strong> <span className="text-gray-400 font-mono text-[10px]">{channel.streamUrl}</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Tùy chỉnh luồng phát */}
        {activeTab === 1 && (
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

        {/* Tab 2: Đề xuất kênh khác */}
        {activeTab === 2 && (
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
