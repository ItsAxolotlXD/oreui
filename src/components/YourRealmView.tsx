import React, { useState, useRef } from 'react';
import { Realm, TvChannel, UserSettings } from '../types';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySecondaryButtonDark } from './ui/VplaySecondaryButtonDark';
import { TvPlayer } from './TvPlayer';
import { Edit2, Trash2, Plus, Film, Tv, Upload } from 'lucide-react';

interface YourRealmViewProps {
  realms: Realm[];
  onUpdateRealms: (newRealms: Realm[]) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenCreateChannelModal: () => void;
}

export const YourRealmView: React.FC<YourRealmViewProps> = ({
  realms,
  onUpdateRealms,
  settings,
  onUpdateSettings,
  onOpenCreateChannelModal,
}) => {
  const [activeRealmId, setActiveRealmId] = useState<string>(realms[0]?.id || 'realm-1');
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);

  // File input ref for importing M3U8 files
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Rename Realm modal
  const [renameModalRealmId, setRenameModalRealmId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState<string>('');

  // State for Create Realm modal
  const [showCreateRealmModal, setShowCreateRealmModal] = useState<boolean>(false);
  const [newRealmName, setNewRealmName] = useState<string>('');

  const activeRealm = realms.find((r) => r.id === activeRealmId) || realms[0];

  // Handle M3U/M3U8 file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/);
      const parsedChannels: TvChannel[] = [];
      let currentName = '';
      let currentGroup = 'File M3U8';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {
          const groupMatch = line.match(/group-title="([^"]+)"/i);
          if (groupMatch) {
            currentGroup = groupMatch[1];
          }

          const commaIdx = line.lastIndexOf(',');
          if (commaIdx !== -1) {
            currentName = line.substring(commaIdx + 1).trim();
          } else {
            currentName = `Kênh ${parsedChannels.length + 1}`;
          }
        } else if (!line.startsWith('#')) {
          const url = line;
          const name = currentName || `Kênh ${parsedChannels.length + 1}`;
          parsedChannels.push({
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name,
            groupTitle: currentGroup,
            logo: '',
            streamUrl: url,
            badge: 'M3U',
            currentProgram: 'Luồng từ file m3u8',
            nextProgram: 'Đang phát sóng',
            viewers: '1',
            rating: '5.0',
            videoBg: '',
            isLive: true,
            resolution: 'HD',
            language: 'Tùy chỉnh',
            summary: `Kênh ${name} được nhập từ file ${file.name}`,
          });
          currentName = '';
        }
      }

      if (parsedChannels.length === 0) {
        alert('Không tìm thấy luồng m3u8 hợp lệ trong file đã chọn.');
        return;
      }

      if (!activeRealm) return;

      const updatedRealms = realms.map((r) =>
        r.id === activeRealm.id
          ? { ...r, channels: [...r.channels, ...parsedChannels] }
          : r
      );
      onUpdateRealms(updatedRealms);
      alert(`Đã nhập thành công ${parsedChannels.length} kênh vào ${activeRealm.name}!`);
      if (e.target) e.target.value = '';
    };
    reader.readAsText(file);
  };

  // Create Realm handler
  const handleCreateRealm = () => {
    if (realms.length >= 3) {
      alert('Bạn chỉ có thể tạo tối đa 3 Realms.');
      return;
    }
    const name = newRealmName.trim() || `Realm #${realms.length + 1}`;
    const newRealm: Realm = {
      id: `realm-${Date.now()}`,
      name,
      channels: [],
    };
    const updated = [...realms, newRealm];
    onUpdateRealms(updated);
    setActiveRealmId(newRealm.id);
    setNewRealmName('');
    setShowCreateRealmModal(false);
  };

  // Rename Realm handler
  const handleSaveRename = () => {
    if (!renameModalRealmId) return;
    const name = renameInputValue.trim() || 'Untitled Realm';
    const updated = realms.map((r) => (r.id === renameModalRealmId ? { ...r, name } : r));
    onUpdateRealms(updated);
    setRenameModalRealmId(null);
    setRenameInputValue('');
  };

  // Delete Realm handler
  const handleDeleteRealm = (realmId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    if (realms.length <= 1) {
      alert('Bạn phải giữ ít nhất 1 Realm.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa Realm này không?')) {
      const updated = realms.filter((r) => r.id !== realmId);
      onUpdateRealms(updated);
      if (activeRealmId === realmId) {
        setActiveRealmId(updated[0]?.id || '');
      }
    }
  };

  // Delete channel inside active realm
  const handleDeleteChannel = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    if (!activeRealm) return;
    const updatedChannels = activeRealm.channels.filter((c) => c.id !== channelId);
    const updatedRealms = realms.map((r) =>
      r.id === activeRealm.id ? { ...r, channels: updatedChannels } : r
    );
    onUpdateRealms(updatedRealms);
    if (selectedChannel?.id === channelId) {
      setSelectedChannel(null);
    }
  };

  return (
    <div className="w-full space-y-4 font-montserrat select-none">
      {/* SPLIT LAYOUT: SIDEBAR LEFT + MAIN CONTENT RIGHT */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* LEFT SIDEBAR: REALMS LIST & ACTIONS */}
        <div className="w-full md:w-72 flex-shrink-0 bg-[#2d3033] border-2 border-[#141414] shadow-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#141414] pb-2">
            <div className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-jura">
              Realms list ({realms.length}/3)
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Max 3</span>
          </div>

          {/* ACTION BUTTONS: CREATE REALM (SECONDARY) & NHẬP FILE M3U8 (PRIMARY) */}
          <div className="space-y-2">
            <VplaySecondaryButton
              size="sm"
              onClick={() => {
                playPopSound();
                if (realms.length >= 3) {
                  alert('Tối đa 3 realms. Hãy xóa bớt realm nếu muốn tạo thêm.');
                  return;
                }
                setNewRealmName(`Realm #${realms.length + 1}`);
                setShowCreateRealmModal(true);
              }}
              disabled={realms.length >= 3}
            >
              <Plus className="w-4 h-4" />
              + Create Realm
            </VplaySecondaryButton>

            <VplayPrimaryButton
              size="sm"
              onClick={() => {
                playPopSound();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4" />
              Nhập File m3u8
            </VplayPrimaryButton>

            <input
              type="file"
              ref={fileInputRef}
              accept=".m3u,.m3u8,.txt"
              className="hidden"
              onChange={handleFileImport}
            />
          </div>

          {/* REALM CARDS USING SECONDARY BUTTON DARK TEXTURE */}
          <div className="space-y-2">
            {realms.map((realm) => {
              const isActive = realm.id === activeRealmId;
              return (
                <VplaySecondaryButtonDark
                  key={realm.id}
                  active={isActive}
                  size="compact"
                  fullWidth
                  onClick={() => {
                    playPopSound();
                    setActiveRealmId(realm.id);
                    setSelectedChannel(null);
                  }}
                >
                  <div className="flex items-center justify-between gap-2 w-full py-0.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                      <div
                        className={`w-2 h-2 flex-shrink-0 ${
                          isActive ? 'bg-[#6bc34b]' : 'bg-gray-400'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{realm.name}</div>
                        <div className="text-[10px] text-gray-300 font-normal">
                          {realm.channels.length} {realm.channels.length === 1 ? 'channel' : 'channels'}
                        </div>
                      </div>
                    </div>

                    {/* Realm Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPopSound();
                          setRenameModalRealmId(realm.id);
                          setRenameInputValue(realm.name);
                        }}
                        className="p-1 text-gray-300 hover:text-white hover:bg-[#52565a] rounded cursor-pointer"
                        title="Đổi tên Realm"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {realms.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteRealm(realm.id, e)}
                          className="p-1 text-gray-300 hover:text-red-400 hover:bg-[#52565a] rounded cursor-pointer"
                          title="Xóa Realm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </VplaySecondaryButtonDark>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-[#383d41] border-2 border-[#141414] shadow-xl p-4 sm:p-6 space-y-5">
          {/* Active Realm Header */}
          {activeRealm ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2d3033] pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider font-jura flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#6bc34b] inline-block" />
                    {activeRealm.name}
                  </h3>
                  <p className="text-xs text-gray-300 font-normal">
                    Quản lý và xem các luồng M3U8 tùy chỉnh thuộc về {activeRealm.name}
                  </p>
                </div>

                {/* + CREATE CUSTOM CHANNEL BUTTON */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  <VplayPrimaryButton
                    size="sm"
                    fullWidth={false}
                    onClick={() => {
                      playPopSound();
                      onOpenCreateChannelModal();
                    }}
                  >
                    + Create custom channel
                  </VplayPrimaryButton>
                </div>
              </div>

              {/* Active Playing Video Player */}
              {selectedChannel && (
                <section className="space-y-3 bg-[#2d3033] p-3 border-2 border-[#141414]">
                  <div className="flex items-center justify-between border-b border-[#141414] pb-2">
                    <span className="font-bold text-xs text-white uppercase font-jura flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#6bc34b]" />
                      Đang xem: {selectedChannel.name}
                    </span>
                    <button
                      onClick={() => setSelectedChannel(null)}
                      className="text-xs text-gray-400 hover:text-white px-2 py-0.5 bg-[#1e2022] border border-[#141414] cursor-pointer"
                    >
                      Đóng trình phát
                    </button>
                  </div>

                  <TvPlayer
                    channel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                    channels={activeRealm.channels}
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                  />
                </section>
              )}

              {/* Custom Channels Grid or Empty State */}
              {activeRealm.channels.length > 0 ? (
                <div className="space-y-3">
                  <div className="font-bold text-xs text-gray-200 uppercase tracking-wider font-jura">
                    Danh sách kênh M3U8 ({activeRealm.channels.length})
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeRealm.channels.map((chan) => {
                      const isPlaying = selectedChannel?.id === chan.id;
                      return (
                        <div
                          key={chan.id}
                          onClick={() => {
                            playPopSound();
                            setSelectedChannel(chan);
                          }}
                          className={`p-3 border-2 bg-[#2d3033] transition-all cursor-pointer relative group flex flex-col justify-between space-y-3 ${
                            isPlaying
                              ? 'border-[#6bc34b] bg-[#32363a]'
                              : 'border-[#141414] hover:border-[#6bc34b]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-white truncate">{chan.name}</div>
                              <div className="text-[10px] text-gray-400 truncate">{chan.groupTitle}</div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteChannel(chan.id, e)}
                              className="text-gray-400 hover:text-red-400 p-1 cursor-pointer opacity-80 group-hover:opacity-100"
                              title="Xóa kênh khỏi Realm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="bg-[#1e2022] p-2 border border-[#141414] text-[10px] font-mono text-gray-300 break-all line-clamp-2">
                            {chan.streamUrl || 'https://...m3u8'}
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-gray-300 font-mono border-t border-[#3c4043]">
                            <span className="bg-[#418a28] text-white px-1.5 py-0.5 font-bold">
                              {chan.resolution || 'M3U8'}
                            </span>
                            <span className="text-[#6bc34b] font-bold group-hover:underline flex items-center gap-1">
                              ▶ Xem ngay
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* EMPTY STATE IN REALM */
                <div className="bg-[#2d3033] border-2 border-[#141414] p-8 text-center space-y-4 my-4">
                  <div className="w-16 h-16 mx-auto bg-[#222426] border-2 border-[#141414] flex items-center justify-center">
                    <Tv className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white uppercase tracking-wide">
                      Chưa có kênh M3U8 nào trong {activeRealm.name}
                    </h4>
                    <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto">
                      Hãy nhấn nút <span className="text-[#6bc34b] font-bold">+ Create custom channel</span> bên trên để import link stream m3u8 của bạn vào Realm này.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <VplayPrimaryButton
                      size="sm"
                      fullWidth={false}
                      onClick={() => {
                        playPopSound();
                        onOpenCreateChannelModal();
                      }}
                    >
                      + Create custom channel
                    </VplayPrimaryButton>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* RENAME REALM MODAL */}
      {renameModalRealmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
          <div className="bg-[#383b3e] border-2 border-[#787b7f] w-full max-w-sm shadow-2xl p-4 text-white font-montserrat space-y-4">
            <h3 className="font-bold text-sm text-white uppercase font-jura">
              Đổi tên Realm
            </h3>
            <input
              type="text"
              value={renameInputValue}
              onChange={(e) => setRenameInputValue(e.target.value)}
              placeholder="Nhập tên Realm..."
              className="w-full h-9 bg-[#222426] text-white px-3 text-xs font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.4)]"
            />
            <div className="flex items-center gap-2 pt-2">
              <VplayPrimaryButton size="sm" onClick={handleSaveRename} className="flex-1">
                Lưu
              </VplayPrimaryButton>
              <VplaySecondaryButton
                size="sm"
                onClick={() => setRenameModalRealmId(null)}
                className="flex-1"
              >
                Hủy
              </VplaySecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* CREATE REALM MODAL */}
      {showCreateRealmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
          <div className="bg-[#383b3e] border-2 border-[#787b7f] w-full max-w-sm shadow-2xl p-4 text-white font-montserrat space-y-4">
            <h3 className="font-bold text-sm text-white uppercase font-jura">
              Tạo Realm mới ({realms.length + 1}/3)
            </h3>
            <p className="text-xs text-gray-300">
              Nhập tên cho Realm mới của bạn:
            </p>
            <input
              type="text"
              value={newRealmName}
              onChange={(e) => setNewRealmName(e.target.value)}
              placeholder="Tên Realm (VD: Realm Thể Thao)..."
              className="w-full h-9 bg-[#222426] text-white px-3 text-xs font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.4)]"
            />
            <div className="flex items-center gap-2 pt-2">
              <VplayPrimaryButton size="sm" onClick={handleCreateRealm} className="flex-1">
                Tạo Realm
              </VplayPrimaryButton>
              <VplaySecondaryButton
                size="sm"
                onClick={() => setShowCreateRealmModal(false)}
                className="flex-1"
              >
                Hủy
              </VplaySecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
