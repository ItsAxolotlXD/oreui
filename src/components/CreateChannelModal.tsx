import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayInputBox } from './ui/VplayInputBox';
import { VplayDropdown } from './ui/VplayDropdown';
import { TvChannel } from '../types';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: TvChannel) => void;
  categories: string[];
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
  categories,
}) => {
  const [channelName, setChannelName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  
  const defaultCategory = categories[0] || 'Kênh tự chọn';
  const [category, setCategory] = useState(defaultCategory);

  if (!isOpen) return null;

  const dropdownOptions = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  if (!dropdownOptions.some((opt) => opt.value === 'Kênh tự chọn')) {
    dropdownOptions.push({ value: 'Kênh tự chọn', label: 'Kênh tự chọn' });
  }

  const handleCreate = () => {
    if (!channelName.trim()) {
      alert('Vui lòng nhập tên kênh.');
      return;
    }
    if (!streamUrl.trim()) {
      alert('Vui lòng nhập URL luồng kênh.');
      return;
    }

    const newChannel: TvChannel = {
      id: `custom-${Date.now()}`,
      name: channelName.trim(),
      groupTitle: category || 'Kênh tự chọn',
      logo: '',
      streamUrl: streamUrl.trim(),
      badge: 'Custom',
      currentProgram: 'Luồng tự tạo',
      nextProgram: 'Đang phát sóng',
      viewers: '1',
      rating: '5.0',
      videoBg: '',
      isLive: true,
      resolution: 'HD 1080p',
      language: 'Tiếng Việt',
      summary: 'Luồng truyền hình tùy chỉnh được tạo bởi người dùng.',
    };

    onAddChannel(newChannel);
    setChannelName('');
    setStreamUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
      <div className="bg-[#484a4c] border-2 border-[#6c6e70] w-full max-w-md shadow-2xl text-white font-montserrat select-none flex flex-col h-[85vh] max-h-[600px] my-auto overflow-hidden">
        
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
            Create custom channel
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
            Tự tạo và thêm một luồng kênh tùy chỉnh vào danh sách kênh Live TV của ứng dụng.
          </p>

          <div className="space-y-3 bg-[#2b2d30] p-3.5 border border-[#141414]">
            {/* Input 1: Tên kênh */}
            <VplayInputBox
              label="Tên kênh"
              description="Tên hiển thị của kênh truyền hình"
              placeholder="Nhập tên kênh..."
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="!max-w-none !p-2.5"
            />

            {/* Input 2: URL luồng kênh */}
            <VplayInputBox
              label="URL luồng kênh"
              description="Đường dẫn luồng HLS (.m3u8) hoặc nguồn video"
              placeholder="https://... hoặc URL stream M3U8"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="!max-w-none !p-2.5"
            />

            {/* Dropdown: Thể loại kênh */}
            <VplayDropdown
              label="Thể loại kênh"
              options={dropdownOptions}
              value={category}
              onChange={(val) => setCategory(val)}
              className="!max-w-none !p-2.5"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex flex-col select-none pointer-events-none flex-shrink-0">
          <div className="w-full h-[1px] bg-[#18191b]" />
          <div className="w-full h-[1px] bg-[#5e6266]" />
        </div>

        {/* PHẦN 3: PHẦN NÚT (Mỗi nút 1 dòng) */}
        <div className="p-3.5 sm:p-4 bg-[#424446] flex flex-col gap-2.5 w-full flex-shrink-0">
          <VplayPrimaryButton size="normal" fullWidth={true} onClick={handleCreate}>
            Tạo kênh
          </VplayPrimaryButton>

          <VplaySecondaryButton size="normal" fullWidth={true} onClick={onClose}>
            Đóng
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
