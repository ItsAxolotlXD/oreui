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

  // Sync fullscreen state from document/video element
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isVideoFS = document.fullscreenElement === videoRef.current || !!(document as any).webkitFullscreenElement;
      setIsFullscreen(isVideoFS);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  // Fullscreen specifically for video element (luồng m3u8 đang xem)
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* GRID CONTAINER: PLAYER & CONTROLS ON LEFT, CHANNEL INFO ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* LEFT COLUMN: SHRUNK CHANNEL PLAYER & CONTROLS (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* TV SCREEN / VIDEO PLAYER FRAME */}
          <div className="relative bg-[#0d0e0f] border-4 border-[#141414] shadow-2xl overflow-hidden w-full aspect-video max-h-[380px] sm:max-h-[420px]">
            {/* Background Stream Player */}
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
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
          </div>

          {/* CONTROL BAR BELOW PLAYER (3 SEPARATE ROWS) */}
          <div className="bg-[#1e2022] border-4 border-[#141414] p-3 flex flex-col gap-3 z-30 font-montserrat shadow-xl">
            {/* ROW 1: PLAY / PAUSE BUTTON */}
            <div className="w-full">
              <VplayHeroButton onClick={togglePlay} className="w-full text-center justify-center py-2.5">
                {isPlaying ? '⏸ TẠM DỪNG' : '▶ PHÁT'}
              </VplayHeroButton>
            </div>

            {/* ROW 2: VOLUME SLIDER (WITHOUT "Âm lượng" TEXT) & FAVORITE CHECKBOX */}
            <div className="w-full flex items-center justify-between gap-3 bg-[#282a2c] p-2 sm:p-2.5 border border-[#141414]">
              {/* Mute Button & Volume Slider */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-[#3a3c3f] border border-[#141414] hover:bg-[#4d5055] text-white active:translate-y-[1px] cursor-pointer flex-shrink-0"
                  title="Tắt/Mở tiếng"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-[#89dc69]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <VplaySlider
                    label=""
                    value={isMuted ? 0 : volume}
                    min={0}
                    max={10}
                    onChange={(v) => {
                      setVolume(v);
                      if (v > 0) setIsMuted(false);
                    }}
                    noBackground
                    className="!p-0"
                  />
                </div>
              </div>

              {/* Favorite Checkbox */}
              <div className="bg-[#1f2123] px-3 py-2 border border-[#141414] flex items-center flex-shrink-0">
                <VplayCheckbox
                  checked={isFavorite}
                  onChange={setIsFavorite}
                  label="Yêu thích"
                />
              </div>
            </div>

            {/* ROW 3: FULL SCREEN BUTTON (USES DESIGN SYSTEM SECONDARY BUTTON) */}
            <div className="w-full">
              <VplaySecondaryButton
                onClick={toggleFullscreen}
                fullWidth
                className="w-full"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c1d1f] flex-shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#1c1d1f]">
                  {isFullscreen ? 'THOÁT TOÀN MÀN HÌNH (EXIT FULLSCREEN)' : 'PHÓNG TO MÀN HÌNH (FULL SCREEN)'}
                </span>
              </VplaySecondaryButton>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHANNEL INFORMATION & DETAILS (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Header Card for Channel */}
          <div className="bg-[#292a2c] border-4 border-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#3e4145] pb-3">
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain bg-[#1a1c1e] p-1 border border-[#141414]"
                />
              ) : (
                <div className="w-12 h-12 bg-[#1a1c1e] border border-[#141414] flex items-center justify-center font-bold text-xs text-[#89dc69]">
                  TV
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black text-white truncate font-montserrat">{channel.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#1c1d1f] text-[#89dc69] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                    {channel.groupTitle}
                  </span>
                  <span className="bg-[#ffe866] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                    {channel.resolution}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
