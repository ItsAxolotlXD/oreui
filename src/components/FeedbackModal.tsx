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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      setToastMessage('Please enter your feedback before submitting.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText('');
      setToastMessage('Thank you for your feedback on The Craftmine!');
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto font-minecraft-seven">
      <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-md shadow-2xl text-white select-none flex flex-col h-[80vh] max-h-[520px] my-auto overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#484a4c] border-b-2 border-[#1c1d1f] px-3.5 py-2.5 flex items-center justify-between flex-shrink-0">
          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-2xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
            title="Back"
          >
            ‹
          </button>
          
          <h2 className="text-sm sm:text-base text-white font-minecraft-ten text-center flex-1 tracking-tight">
            Submit Feedback
          </h2>

          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-white font-mono text-lg sm:text-xl cursor-pointer hover:bg-[#383b3e] active:bg-[#1f2022] border-2 border-transparent hover:border-[#141414] !transition-none ore-dark-btn hover:outline-2 hover:outline-white"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 bg-[#222426] flex-1 overflow-y-scroll custom-scrollbar text-xs">
          <p className="text-xs text-gray-200 leading-relaxed font-normal">
            We would love to hear what you think of The Craftmine experience and Ore UI. Feel free to share your thoughts, report bugs, or request features!
          </p>

          {/* Label + Input Area */}
          <div className="space-y-2">
            <label className="block text-xs text-white uppercase tracking-wider font-minecraft-ten">
              Your Feedback & Suggestions
            </label>
            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback here..."
              className="w-full bg-[#18191a] text-white p-3 text-xs sm:text-sm font-minecraft-seven border-2 border-[#101112] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.5)] placeholder:text-gray-400 resize-none cursor-pointer"
            />
            {toastMessage && (
              <p className="text-[11px] text-yellow-300 font-minecraft-seven">
                {toastMessage}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-minecraft-seven">
              Please do not include sensitive personal information.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex flex-col select-none pointer-events-none flex-shrink-0">
          <div className="w-full h-[1px] bg-[#18191b]" />
          <div className="w-full h-[1px] bg-[#5e6266]" />
        </div>

        {/* BUTTONS */}
        <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
          {isSubmitted ? (
            <VplaySecondaryButton size="normal" fullWidth={true} disabled={true}>
              Sending...
            </VplaySecondaryButton>
          ) : (
            <VplayPrimaryButton size="normal" fullWidth={true} onClick={handleSubmit}>
              Submit Feedback
            </VplayPrimaryButton>
          )}

          <VplaySecondaryButton size="normal" fullWidth={true} onClick={onClose}>
            Cancel
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
