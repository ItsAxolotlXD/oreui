import React from 'react';

const PANORAMA_IMAGES = [
  'https://minecraft.wiki/images/thumb/EDU_26.30_panorama_0.png/800px-EDU_26.30_panorama_0.png?e0b05',
  'https://minecraft.wiki/images/thumb/EDU_26.30_panorama_1.png/800px-EDU_26.30_panorama_1.png?e0b05',
  'https://minecraft.wiki/images/thumb/EDU_26.30_panorama_2.png/800px-EDU_26.30_panorama_2.png?e0b05',
  'https://minecraft.wiki/images/thumb/EDU_26.30_panorama_3.png/800px-EDU_26.30_panorama_3.png?e0b05',
];

export const MinecraftPanorama: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#101113]">
      {/* Seamless Scrolling Track */}
      <div className="flex h-full w-max animate-panorama">
        {/* Set 1 */}
        {PANORAMA_IMAGES.map((src, i) => (
          <img
            key={`p1-${i}`}
            src={src}
            alt="Minecraft Panorama"
            referrerPolicy="no-referrer"
            className="h-screen min-h-full w-auto object-cover flex-shrink-0 filter brightness-90 scale-105"
          />
        ))}
        {/* Set 2 for loop */}
        {PANORAMA_IMAGES.map((src, i) => (
          <img
            key={`p2-${i}`}
            src={src}
            alt="Minecraft Panorama"
            referrerPolicy="no-referrer"
            className="h-screen min-h-full w-auto object-cover flex-shrink-0 filter brightness-90 scale-105"
          />
        ))}
      </div>

      {/* Classic Minecraft Menu Dark Tint Overlay & Vignette */}
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
};
