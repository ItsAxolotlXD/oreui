import React, { useState } from 'react';

interface MinecraftPanoramaProps {
  disablePanorama?: boolean;
  lockPanoramaScroll?: boolean;
  panoramaScrollSpeed?: number;
}

export interface PanoramaSet {
  id: string;
  name: string;
  location: string;
  image: string;
}

const PANORAMA_SETS: PanoramaSet[] = [
  {
    id: 'hoguom',
    name: 'Hồ Gươm Hà Nội',
    location: 'Hà Nội',
    image: 'https://cdn3.ivivu.com/2022/09/h%E1%BB%93-g%C6%B0%C6%A1m.jpg',
  },
  {
    id: 'muicamau',
    name: 'Mũi Cà Mau',
    location: 'Cà Mau',
    image: 'https://image.vietgoing.com/editor/image_lss1637812569.jpg',
  },
  {
    id: 'vtv',
    name: 'Đài Truyền Hình Việt Nam (VTV)',
    location: 'Hà Nội',
    image: 'https://vtv.gov.vn/uploads/ketnoi/422/vtvnet/2024/vtv/dai-truyen-hinh-viet-nam-2.jpg',
  },
  {
    id: 'cotcolungcu',
    name: 'Cột Cờ Lũng Cú',
    location: 'Hà Giang',
    image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/6/27/1209800/Cot-Co-Lung-Cu.jpeg',
  },
];

export const MinecraftPanorama: React.FC<MinecraftPanoramaProps> = ({
  disablePanorama = false,
  lockPanoramaScroll = false,
  panoramaScrollSpeed = 5,
}) => {
  // Randomly select one panorama set per page refresh
  const [selectedSetIndex] = useState(() =>
    Math.floor(Math.random() * PANORAMA_SETS.length)
  );

  const currentSet = PANORAMA_SETS[selectedSetIndex];

  if (disablePanorama) {
    return (
      <div className="fixed inset-0 -z-10 bg-[#16171a] pointer-events-none select-none" />
    );
  }

  // Calculate duration based on speed 1 (slow, 120s) to 10 (fast, 15s)
  const animDuration = `${Math.max(5, 120 - (panoramaScrollSpeed || 5) * 10)}s`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#101113]">
      {/* Seamless Scrolling Track with single continuous panorama image */}
      <div
        className="flex h-full w-max animate-panorama transform-gpu"
        style={{
          animationDuration: animDuration,
          animationPlayState: lockPanoramaScroll ? 'paused' : 'running',
        }}
      >
        {[0, 1].map((idx) => (
          <img
            key={`p-${idx}`}
            src={currentSet.image}
            alt={currentSet.name}
            referrerPolicy="no-referrer"
            className="h-screen min-h-full w-auto object-cover flex-shrink-0 filter brightness-90 scale-105 transform-gpu"
          />
        ))}
      </div>

      {/* Classic Menu Dark Tint Overlay & Vignette without heavy backdrop-blur */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
};
