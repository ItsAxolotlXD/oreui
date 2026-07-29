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
    playPopSound();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="bg-[#383b3e] border-2 border-[#787b7f] w-full max-w-md shadow-2xl text-white font-montserrat overflow-hidden select-none">
        
        {/* Header Bar with light gray border frame */}
        <div className="bg-[#2d3033] border-b-2 border-[#787b7f] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="text-gray-300 hover:text-white font-bold text-sm px-1.5 py-0.5 cursor-pointer"
            title="Back"
          >
            ‹
          </button>
          
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-jura">
            Submit Feedback
          </h2>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="text-gray-300 hover:text-white font-bold text-xs px-1.5 py-0.5 cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Subtitle / Description Section */}
        <div className="p-4 bg-[#383b3e] border-b border-[#2d3033]">
          <p className="text-xs text-gray-200 leading-relaxed font-normal">
            We would love to hear what do you think of this brand new design experience. Feel free to share your thoughts with us
          </p>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-4 bg-[#383b3e]">
          {/* Label + Input Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-200 font-jura uppercase">
              Feedback / Description
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full bg-[#222426] text-white p-3 text-xs sm:text-sm font-normal font-montserrat border-2 border-[#141414] focus:outline-none focus:border-[#418a28] shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] placeholder:text-gray-400 resize-none cursor-pointer"
            />
            <p className="text-[10px] text-gray-400">
              Please avoid sharing sensitive personal information.
            </p>
          </div>

          {/* Action Buttons Stacked using Vplay Design System Components */}
          <div className="space-y-2.5 pt-2 border-t-2 border-[#2d3033]">
            <VplayPrimaryButton
              disabled={isSubmitted}
              onClick={handleSubmit}
            >
              {isSubmitted ? 'Submitting...' : 'Submit'}
            </VplayPrimaryButton>

            <VplaySecondaryButton
              onClick={() => {
                playPopSound();
                onClose();
              }}
            >
              Close
            </VplaySecondaryButton>
          </div>
        </div>

      </div>
    </div>
  );
};
