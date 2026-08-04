import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert('Vui lòng nhập ý kiến đóng góp của bạn trước khi gửi.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText('');
      onClose();
      alert('Cảm ơn bạn đã gửi đóng góp ý kiến cho đội ngũ Vplay!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
      <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-md shadow-2xl text-white font-montserrat select-none flex flex-col h-[80vh] max-h-[580px] my-auto overflow-hidden">
        
        {/* PHẦN 1: HEADER (Title not uppercase, enlarged pixel buttons) */}
        <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
            title="Back"
          >
            ‹
          </button>
          
          <h2 className="text-sm sm:text-base font-bold text-white font-montserrat text-center flex-1 tracking-tight">
            Submit feedback
          </h2>

          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono font-bold text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] transition-all"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* PHẦN 2: PHẦN CHÍNH (Nền tối hơn #222426, luôn scrollable) */}
        <div className="p-4 space-y-4 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar text-xs">
          
          <p className="text-xs text-gray-200 leading-relaxed font-normal">
            We would love to hear what you think of this brand new design experience. Feel free to share your thoughts with us.
          </p>

          {/* Label + Input Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Ghi chú / Ý kiến đóng góp
            </label>
            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập ý kiến của bạn tại đây..."
              className="w-full bg-[#18191a] text-white p-3 text-xs sm:text-sm font-normal font-montserrat border-2 border-[#101112] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.5)] placeholder:text-gray-400 resize-none cursor-pointer"
            />
            <p className="text-[10px] text-gray-400">
              Vui lòng không chia sẻ thông tin cá nhân nhạy cảm.
            </p>
          </div>
        </div>

        {/* Divider style like SettingsView */}
        <div className="w-full flex flex-col select-none pointer-events-none flex-shrink-0">
          <div className="w-full h-[1px] bg-[#18191b]" />
          <div className="w-full h-[1px] bg-[#5e6266]" />
        </div>

        {/* PHẦN 3: PHẦN NÚT (Mỗi nút 1 dòng) */}
        <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
          {isSubmitted ? (
            <VplaySecondaryButton size="normal" fullWidth={true} disabled={true}>
              Đang gửi...
            </VplaySecondaryButton>
          ) : (
            <VplayPrimaryButton size="normal" fullWidth={true} onClick={handleSubmit}>
              Gửi ý kiến
            </VplayPrimaryButton>
          )}

          <VplaySecondaryButton size="normal" fullWidth={true} onClick={onClose}>
            Đóng
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
