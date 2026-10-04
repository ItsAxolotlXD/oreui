import React, { useState, useRef } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySecondaryButtonDark } from './ui/VplaySecondaryButtonDark';
import { ExternalLink, Maximize2, RotateCw, Play, Monitor, Sparkles, Cpu, Layers } from 'lucide-react';

export interface CraftmineEdition {
  id: string;
  name: string;
  engineName: string;
  engineType: string;
  url: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  features: string[];
  bannerUrl?: string;
}

export const CRAFTMINE_EDITIONS: CraftmineEdition[] = [
  {
    id: 'lovable',
    name: 'Craftmine Lovable Edition',
    engineName: 'Lovable WebGL Engine',
    engineType: 'Three.js / WebGL 3D Voxel',
    url: 'https://boundless-block-worlds.lovable.app/',
    tagline: 'Boundless 3D Block Worlds with dynamic lighting & terrain',
    description: 'Phiên bản đồ họa 3D hiện đại trên nền tảng Lovable WebGL, tích hợp tạo thế giới khối vô hạn, chu kỳ ánh sáng mặt trời/mặt trăng và vật lý tương tác khối linh hoạt.',
    badge: 'LOVABLE ENGINE',
    accentColor: '#89dc69',
    features: ['Infinite Voxel Terrain', 'Dynamic Sunlight & Shadows', 'Block Physics', 'Smooth FPS 60+'],
  },
  {
    id: 'base64',
    name: 'Craftmine Base 64 Edition',
    engineName: 'Base44 Engine',
    engineType: 'Base44 High-Speed Voxel Canvas',
    url: 'https://craftmine-preview.base44.app/',
    tagline: 'Ultra-fast loading & lightweight creative block sandbox',
    description: 'Phiên bản xây dựng trên Base44 tối ưu hóa hiệu năng cực cao, tải siêu nhanh, dung lượng bộ nhớ tối thiểu, lý tưởng cho trải nghiệm sandbox sáng tạo mượt mà.',
    badge: 'BASE 64 ENGINE',
    accentColor: '#38bdf8',
    features: ['Instant Chunk Streaming', 'Low Latency Input', 'Creative Building', 'Lightweight Footprint'],
  },
  {
    id: 'studio',
    name: 'Craftmine Studio Edition',
    engineName: 'Studio Vercel Engine',
    engineType: 'Next-Gen Full Voxel Architecture',
    url: 'https://the-craftmine.vercel.app/',
    tagline: 'The flagship full-featured Craftmine experience',
    description: 'Phiên bản hoàn chỉnh và toàn diện nhất của The Craftmine với hệ thống tính năng phong phú, sảnh thế giới, giao diện Bedrock và khả năng tùy biến đa dạng.',
    badge: 'STUDIO EDITION',
    accentColor: '#f59e0b',
    features: ['Full Gameplay Suite', 'World Customization', 'Lobby & Skins', 'Ore UI Integration'],
  },
];

export const PlayCraftmineView: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState<CraftmineEdition>(CRAFTMINE_EDITIONS[0]);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoadingFrame, setIsLoadingFrame] = useState<boolean>(true);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectEdition = (edition: CraftmineEdition) => {
    playPopSound();
    if (edition.id !== selectedEdition.id) {
      setIsLoadingFrame(true);
      setSelectedEdition(edition);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleReloadFrame = () => {
    playPopSound();
    setIsLoadingFrame(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    playPopSound();
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* HEADER BAR: PLAY CRAFTMINE TITLE & EDITION SELECTOR */}
      <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2d3033] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
              <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-jura flex items-center gap-2">
                <span>PLAY CRAFTMINE (3 GAME ENGINES)</span>
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-montserrat mt-0.5">
              Chọn một trong 3 phiên bản được phát triển trên các engine khác nhau để trải nghiệm The Craftmine.
            </p>
          </div>

          {/* Quick External Link to current engine */}
          <a
            href={selectedEdition.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playPopSound()}
            className="flex items-center gap-2 bg-[#89dc69] hover:bg-[#9ded7e] text-[#141414] font-montserrat font-bold text-xs px-3.5 py-1.5 border-2 border-[#141414] shadow-[inset_1px_1px_0_#ffffff] transition-all cursor-pointer flex-shrink-0 active:translate-y-[1px]"
          >
            <span>Mở Trang Gốc</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 ENGINE SWITCHER TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {CRAFTMINE_EDITIONS.map((edition, idx) => {
            const isSelected = selectedEdition.id === edition.id;
            return (
              <button
                key={edition.id}
                onClick={() => handleSelectEdition(edition)}
                className={`
                  relative p-2.5 sm:p-3 text-left border-2 cursor-pointer transition-all duration-100 flex flex-col justify-between overflow-hidden select-none btn-press-effect
                  ${isSelected
                    ? 'bg-[#292b2d] border-[#89dc69] shadow-[inset_2px_2px_0_rgba(255,255,255,0.2)]'
                    : 'bg-[#3e4246] hover:bg-[#484c50] border-[#141414]'
                  }
                `}
              >
                {/* 3D bevel overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none z-20 ${
                    isSelected
                      ? 'shadow-[inset_2px_2px_0_rgba(0,0,0,0.6)]'
                      : 'shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-3px_0_rgba(0,0,0,0.4)]'
                  }`}
                />

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase border border-[#141414]"
                    style={{ backgroundColor: isSelected ? edition.accentColor : '#222426', color: isSelected ? '#141414' : '#d1d5db' }}
                  >
                    #{idx + 1} {edition.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[9px] text-[#89dc69] font-bold font-mono">
                      <span className="w-1.5 h-1.5 bg-[#89dc69] rounded-full animate-ping" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-white font-montserrat truncate mt-1">
                  {edition.name}
                </div>

                <div className="text-[10px] text-gray-300 font-mono truncate mt-0.5">
                  {edition.engineName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EMBEDDED GAME VIEWPORT CONTAINER */}
      <div
        ref={playerContainerRef}
        className="bg-[#292b2d] border-2 border-[#141414] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* PLAYER CONTROL TOOLBAR */}
        <div className="bg-[#1e2022] border-b-2 border-[#141414] px-3 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-montserrat select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-full" />
            <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
              {selectedEdition.name}
            </span>
            <span className="hidden md:inline-block bg-[#141414] text-gray-300 text-[10px] px-2 py-0.5 border border-[#383a3d] font-mono">
              {selectedEdition.engineType}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReloadFrame}
              title="Tải lại game"
              className="bg-[#3e4246] hover:bg-[#4d5156] active:bg-[#252729] text-white p-1.5 border border-[#141414] cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải lại</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              title="Toàn màn hình"
              className="bg-[#3e4246] hover:bg-[#4d5156] active:bg-[#252729] text-white p-1.5 border border-[#141414] cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phóng to</span>
            </button>

            <a
              href={selectedEdition.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playPopSound()}
              title="Mở trong tab mới"
              className="bg-[#418a28] hover:bg-[#52a634] active:bg-[#2e681c] text-white px-2.5 py-1.5 border border-[#141414] cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tab Mới</span>
            </a>
          </div>
        </div>

        {/* IFRAME GAME CANVAS */}
        <div className="relative w-full aspect-[16/10] min-h-[460px] sm:min-h-[560px] md:min-h-[640px] bg-[#121315]">
          {isLoadingFrame && (
            <div className="absolute inset-0 z-10 bg-[#16181a] flex flex-col items-center justify-center p-6 text-center space-y-3">
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/7/7a/Craftmine.png/revision/latest/scale-to-width-down/1000?cb=20261004160440"
                alt="Loading Craftmine"
                referrerPolicy="no-referrer"
                className="h-12 sm:h-14 object-contain [image-rendering:pixelated] animate-pulse"
              />
              <div className="space-y-1">
                <div className="text-sm font-bold text-white font-montserrat">
                  Đang khởi tạo {selectedEdition.name}...
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Engine: {selectedEdition.engineName}
                </div>
              </div>
              <div className="w-48 bg-[#252729] h-2.5 border border-[#141414] p-0.5 overflow-hidden">
                <div className="bg-[#89dc69] h-full w-3/4 animate-pulse" />
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={selectedEdition.url}
            title={selectedEdition.name}
            onLoad={() => setIsLoadingFrame(false)}
            allow="fullscreen; gamepad; accelerometer; gyroscope; cross-origin-isolated; autoplay"
            className="w-full h-full border-0 relative z-20"
          />
        </div>

        {/* BOTTOM HELPER BAR: CONTROLS & ENGINE SPECS */}
        <div className="bg-[#1e2022] border-t-2 border-[#141414] p-3 text-xs font-montserrat flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-gray-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#89dc69] uppercase font-mono">Phím điều khiển:</span>
            <span className="bg-[#141414] px-1.5 py-0.5 font-mono text-white text-[11px] border border-[#383a3d]">W A S D</span>
            <span>Di chuyển</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 font-mono text-white text-[11px] border border-[#383a3d]">Space</span>
            <span>Nhảy</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 font-mono text-white text-[11px] border border-[#383a3d]">Chuột Trái</span>
            <span>Phá khối</span>
            <span className="text-gray-500">•</span>
            <span className="bg-[#141414] px-1.5 py-0.5 font-mono text-white text-[11px] border border-[#383a3d]">Chuột Phải</span>
            <span>Đặt khối</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
            <span>Direct URL:</span>
            <a
              href={selectedEdition.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#89dc69] hover:underline truncate max-w-[200px]"
            >
              {selectedEdition.url}
            </a>
          </div>
        </div>
      </div>

      {/* THREE EDITIONS DETAILED COMPARISON MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CRAFTMINE_EDITIONS.map((edition) => {
          const isSelected = selectedEdition.id === edition.id;
          return (
            <div
              key={`detail-${edition.id}`}
              className={`
                bg-[#35383b] border-2 p-4 shadow-lg space-y-3 flex flex-col justify-between
                ${isSelected ? 'border-[#89dc69]' : 'border-[#141414]'}
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 border border-[#141414]"
                    style={{ backgroundColor: edition.accentColor, color: '#141414' }}
                  >
                    {edition.badge}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">ONLINE</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white font-montserrat">
                  {edition.name}
                </h3>

                <p className="text-xs text-gray-300 font-montserrat leading-relaxed">
                  {edition.description}
                </p>

                {/* Features Pill List */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {edition.features.map((feat, i) => (
                    <span
                      key={i}
                      className="bg-[#242628] text-gray-300 px-2 py-0.5 text-[10px] font-mono border border-[#141414]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#2d3033]">
                {isSelected ? (
                  <div className="w-full bg-[#242628] text-[#89dc69] text-center py-2 text-xs font-bold font-mono border border-[#418a28]">
                    ▶ ĐANG CHƠI PHIÊN BẢN NÀY
                  </div>
                ) : (
                  <VplayHeroButton fullWidth onClick={() => handleSelectEdition(edition)}>
                    CHUYỂN SANG PHIÊN BẢN NÀY
                  </VplayHeroButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
