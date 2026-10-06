import React from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { ExternalLink } from 'lucide-react';

interface Base44ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Base44ExperienceModal: React.FC<Base44ExperienceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleJoinExperience = () => {
    playPopSound();
    window.open('https://craftmine-preview.base44.app/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleClose = () => {
    playPopSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 font-minecraft-seven select-none">
      <div className="bg-[#484a4c] border-2 border-[#141414] w-full max-w-md shadow-2xl text-white flex flex-col overflow-hidden relative">
        {/* 3D BEVEL OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-3px_0_rgba(0,0,0,0.5)]" />

        {/* MODAL HEADER */}
        <div className="bg-[#383a3d] border-b-2 border-[#1c1d1f] px-4 py-3 flex items-center justify-between gap-3 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#89dc69] inline-block border border-[#141414]" />
            <h2 className="text-sm sm:text-base text-white font-minecraft-ten uppercase tracking-wider">
              Unlock full experience
            </h2>
          </div>

          <button
            type="button"
            onMouseDown={() => playPopSound()}
            onClick={handleClose}
            className="w-7 h-7 bg-[#252729] hover:bg-[#343639] active:bg-[#1c1d1e] text-gray-300 hover:text-white border border-[#141414] flex items-center justify-center cursor-pointer btn-press-effect text-sm"
            title="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 bg-[#25272a] space-y-3 relative z-10 text-xs sm:text-sm text-gray-200 leading-relaxed font-minecraft-seven">
          <p>
            The Base44 Edition of Craftmine is not supported playing directly on Craftmine.net or any kind of browsers due to privacy and security reasons. You can however, play this version at its original address for the best experience.
          </p>
          <p className="text-white font-minecraft-seven pt-1">
            Do you want to play Craftmine: Base44 Edition?
          </p>
        </div>

        {/* 3D DIVIDER */}
        <div className="w-full flex flex-col select-none pointer-events-none relative z-10">
          <div className="w-full h-[1px] bg-[#18191b]" />
          <div className="w-full h-[1px] bg-[#5e6266]" />
        </div>

        {/* ACTION BUTTONS: GREEN BUTTON FOR JOIN, WHITE BUTTON FOR NOT YET */}
        <div className="p-3.5 sm:p-4 bg-[#3d4043] flex flex-col gap-2.5 w-full relative z-10 flex-shrink-0">
          <VplayPrimaryButton
            size="normal"
            fullWidth={true}
            onClick={handleJoinExperience}
            className="!flex !items-center !justify-center !gap-2"
          >
            <span>JOIN EXPERIENCE</span>
            <ExternalLink className="w-4 h-4 ml-1 inline-block" />
          </VplayPrimaryButton>

          <VplaySecondaryButton
            size="normal"
            fullWidth={true}
            onClick={handleClose}
          >
            Not yet
          </VplaySecondaryButton>
        </div>
      </div>
    </div>
  );
};
