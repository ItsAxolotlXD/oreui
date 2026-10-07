import React, { useState, useMemo, useRef, useEffect } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { ArrowLeft, Calendar, AlertTriangle, Play } from 'lucide-react';

export interface ReleaseArticle {
  id: string;
  title: string;
  versionTag: string;
  editionBadge: string;
  date: string;
  thumbnail: string;
  summary: string;
  editionId?: 'lovable' | 'base64' | 'studio';
  features: {
    category: string;
    items: string[];
  }[];
  bugFixes: string[];
  knownIssues: string[];
}

export const ARTICLES_LIST: ReleaseArticle[] = [
  {
    id: 'snapshot-26w05x',
    title: 'Snapshot 26w05x',
    versionTag: 'SNAPSHOT 26w05x',
    editionBadge: 'Exclusive to Lovable Edition',
    date: '10/07/2026',
    thumbnail: 'https://static.wikia.nocookie.net/ep-deo/images/9/9a/Craftmine_26w05x.png/revision/latest/scale-to-width-down/1000?cb=20261007153456',
    summary: 'The latest experimental snapshot for Lovable Edition introduces massive underground cave systems down to layer -64 with huge lava lakes, all Minecraft decorative blocks & items with X-cross model rendering, new Spectator mode, and Creative Fly/Walk mode.',
    editionId: 'lovable',
    features: [
      {
        category: 'CAVES SYSTEM',
        items: [
          'Added cave systems underground and cave entrances randomly appear on the surface',
          'Added massively large cave systems with huge lava lakes',
          'Caves can generate down to layer level -64',
        ],
      },
      {
        category: 'BLOCKS & ITEMS',
        items: [
          "Every single blocks and items from Minecraft were added, only for decorative, didn't have any specific functions ywt",
          'Plants, flowers, torches, cobwebs, stalagmites and stalactites now render using an X-shaped cross model, which consists of two intersecting diagonal planes with a texture applied to both side',
        ],
      },
      {
        category: 'QUALITY OF LIFE',
        items: [
          'Added new Spectator mode helps player clip through blocks for moving more convenient',
          'Added Fly mode and Walk mode for Creative mode (by pressing the F key)',
        ],
      },
    ],
    bugFixes: [],
    knownIssues: [
      'Caves generation and lava lakes are way too massive, causing performance issues',
      'There are no water lakes, ores, deepslates, decorative stone blocks or mobs spawning in the caves, only regular stone blocks',
      'Bottom texture lightning of stone blocks inside caves do not render correctly',
      'To fly down / crounch, instead of Shift key, you have to press Left Ctrl key',
      'Game watermark should not display on screen',
      "The hotbar HUD does not reflect the block you're holding",
      'The world is missing grass, bushes, flowers, plants and especially biome varirants',
      'Some blocks still do not render correctly',
      'Mountain tops generate kind of weird-looking',
    ],
  },
  {
    id: 'snapshot-24w04z',
    title: 'Snapshot 24w04z',
    versionTag: 'SNAPSHOT 24w04z',
    editionBadge: 'Exclusive to Base44 Edition',
    date: '10/06/2026',
    thumbnail: 'https://static.wikia.nocookie.net/ep-deo/images/2/28/Update_thumb.png/revision/latest/scale-to-width-down/1000?cb=20261006103204',
    summary: 'The latest experimental snapshot exclusively for Base 44 Edition introduces a brand-new set of decorative blocks, an expanded cave system, Desert & Oak Forest biomes, and multiple render transparency fixes.',
    editionId: 'base64',
    features: [
      {
        category: 'NEW ADDITIONS',
        items: [
          'Added brand-new set of decorative blocks',
          'Added Desert biome (hot temperature, still broken)',
          'Added Oak Forest biome (regular temperature, broken)',
          'Player swimming in liquid blocks now slides slowly',
          'New particles when breaking blocks',
        ],
      },
      {
        category: 'THE SIFT',
        items: [
          'Now spawn less trees but more creatures',
          'Willow Leaves transparency are now rendered correctly',
          'Willow Bushes now has a correct X cross texture rendering',
          'Cactus Flowers now spawn in the Sift',
        ],
      },
      {
        category: 'CAVES SYSTEM',
        items: [
          'Expanded caves system',
          'Caves now generated natural lava and waterfalls (which looks broken rn)',
          'Ores are now generated more frequently',
        ],
      },
    ],
    bugFixes: [
      'Leaves transparency are now rendered correctly',
      'Some Mangrove Swamp biome related block textures are now rendered correctly',
      'Creatures can now be killed, again',
      'Cave entrances are now connected perfectly',
    ],
    knownIssues: [
      'Ability to see-through transparency blocks',
      'Top grass block texture overlay does not render correctly',
      'Water texture overlay does not render correctly',
      'Granite/diorite/andesite shows static unknown image instead of textures',
      'Plant blocks spawn underwater',
      'Leaves randomly floating in the air',
      'Wild mushrooms not spawning in caves and Fall Forests',
    ],
  },
];

const SettingsDivider = () => (
  <div className="w-full flex flex-col select-none pointer-events-none">
    <div className="w-full h-[1px] bg-[#18191b]" />
    <div className="w-full h-[1px] bg-[#5e6266]" />
  </div>
);

interface ReleaseNotesViewProps {
  onPlayEdition?: (editionId: string) => void;
  initialArticleId?: string | null;
  activeArticleId?: string | null;
  onActiveArticleChange?: (id: string | null) => void;
}

export const ReleaseNotesView: React.FC<ReleaseNotesViewProps> = ({
  onPlayEdition,
  initialArticleId = null,
  activeArticleId,
  onActiveArticleChange,
}) => {
  const [internalArticleId, setInternalArticleId] = useState<string | null>(initialArticleId);
  const selectedArticleId = activeArticleId !== undefined ? activeArticleId : internalArticleId;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<'default' | 'xyz' | 'zyx'>('default');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Sync internal state if initialArticleId changes
  useEffect(() => {
    if (initialArticleId !== undefined) {
      setInternalArticleId(initialArticleId);
    }
  }, [initialArticleId]);

  // Click outside to close filter menu
  useEffect(() => {
    if (!isFilterMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isFilterMenuOpen]);

  const selectedArticle = ARTICLES_LIST.find((a) => a.id === selectedArticleId);

  const handleSelectArticle = (id: string) => {
    if (onActiveArticleChange) {
      onActiveArticleChange(id);
    } else {
      setInternalArticleId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSnapshotVersionKey = (article: ReleaseArticle): string => {
    const match = article.title.match(/[0-9]+w[0-9]+([xyz])/i) || article.id.match(/([xyz])$/i);
    if (match) return match[1].toLowerCase();
    if (article.editionId === 'lovable') return 'x';
    if (article.editionId === 'studio') return 'y';
    if (article.editionId === 'base64') return 'z';
    return 'z';
  };

  // Filter articles by search query
  const filteredArticles = useMemo(() => {
    return ARTICLES_LIST.filter((article) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = article.title.toLowerCase().includes(q);
      const versionMatch = article.versionTag.toLowerCase().includes(q);
      const badgeMatch = article.editionBadge.toLowerCase().includes(q);
      const summaryMatch = article.summary.toLowerCase().includes(q);
      const featuresMatch = article.features.some(
        (f) =>
          f.category.toLowerCase().includes(q) ||
          f.items.some((item) => item.toLowerCase().includes(q))
      );
      const fixesMatch = article.bugFixes.some((fix) => fix.toLowerCase().includes(q));
      const issuesMatch = article.knownIssues.some((issue) => issue.toLowerCase().includes(q));

      return (
        titleMatch ||
        versionMatch ||
        badgeMatch ||
        summaryMatch ||
        featuresMatch ||
        fixesMatch ||
        issuesMatch
      );
    });
  }, [searchQuery]);

  // Sort articles by snapshot version XYZ / ZYX / Default
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      if (sortMode === 'xyz') {
        const vA = getSnapshotVersionKey(a);
        const vB = getSnapshotVersionKey(b);
        return vA.localeCompare(vB);
      }
      if (sortMode === 'zyx') {
        const vA = getSnapshotVersionKey(a);
        const vB = getSnapshotVersionKey(b);
        return vB.localeCompare(vA);
      }
      return 0;
    });
  }, [filteredArticles, sortMode]);

  return (
    <div className="w-full space-y-4 font-minecraft-seven">
      {/* YELLOW NOTE: SNAPSHOT NAMING EXPLANATION (EMOJI REMOVED, VERSION EXCLUSIVE TO REMOVED) */}
      <div className="relative w-full bg-[#ffe866] overflow-hidden select-none border-2 border-[#141414] shadow-md">
        <div className="relative z-10 py-2 px-3 sm:px-4 text-[#141414] font-minecraft-seven text-xs leading-relaxed space-y-1">
          <div className="font-bold uppercase tracking-wider">
            Snapshot naming explaination:
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-[11px] sm:text-xs">
            <span>• <strong>X</strong> = Lovable Edition</span>
            <span>• <strong>Y</strong> = Studios Edition</span>
            <span>• <strong>Z</strong> = Base 44 Edition</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR WITH PIXELATED FILTER ICON TO SORT SNAPSHOT VERSIONS XYZ */}
      <div className="w-full select-none flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
            alt="Search Icon"
            referrerPolicy="no-referrer"
            className="absolute left-3 w-5 h-5 object-contain pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Search for snapshots or releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#222426] text-white pl-10 pr-8 text-xs font-minecraft-seven border-2 border-[#141414] focus:outline-none focus:border-[#89dc69] placeholder:text-gray-400 shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
          />
          {searchQuery && (
            <button
              onMouseDown={() => playPopSound()}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-gray-400 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
              title="Clear query"
            >
              ✕
            </button>
          )}
        </div>

        {/* PIXELATED FILTER ICON BUTTON ON THE RIGHT SIDE TO SORT SNAPSHOT VERSIONS XYZ */}
        <div ref={filterMenuRef} className="relative flex items-center flex-shrink-0">
          <button
            type="button"
            onMouseDown={() => playPopSound()}
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            className={`h-10 px-3 bg-[#2a2c2f] hover:bg-[#34373b] active:bg-[#1a1b1d] border-2 border-[#141414] text-xs font-minecraft-seven flex items-center gap-1.5 cursor-pointer ore-dark-btn !transition-none hover:outline-2 hover:outline-white select-none ${
              sortMode !== 'default' ? 'text-[#89dc69] ring-1 ring-[#89dc69]' : 'text-gray-300'
            }`}
            title="Sort snapshot versions XYZ"
            aria-label="Sort snapshot versions XYZ"
          >
            {/* Pixelated Filter / Funnel Icon */}
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 fill-current [image-rendering:pixelated]"
              style={{ shapeRendering: 'crispEdges' }}
            >
              <rect x="1" y="2" width="14" height="2" />
              <rect x="3" y="4" width="10" height="2" />
              <rect x="5" y="6" width="6" height="2" />
              <rect x="7" y="8" width="2" height="5" />
              <rect x="6" y="11" width="4" height="2" />
            </svg>
            <span className="font-minecraft-ten text-[11px] hidden sm:inline">
              {sortMode === 'xyz' ? 'XYZ' : sortMode === 'zyx' ? 'ZYX' : 'SORT XYZ'}
            </span>
          </button>

          {/* FILTER / SORT DROPDOWN POPOVER */}
          {isFilterMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1.5 w-56 bg-[#2b2d30] border-2 border-[#141414] shadow-2xl z-40 text-xs font-minecraft-seven divide-y divide-[#1c1d1f]"
              style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.85), inset 1px 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <div className="px-3 py-1.5 text-[10px] text-gray-400 font-minecraft-ten uppercase bg-[#222426]">
                Sort Snapshot Versions XYZ
              </div>
              <button
                type="button"
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  setSortMode('xyz');
                  setIsFilterMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#393d41] cursor-pointer !transition-none ${
                  sortMode === 'xyz' ? 'bg-[#35383b] text-[#89dc69] font-bold' : 'text-white'
                }`}
              >
                <span>Sort XYZ (X → Y → Z)</span>
                {sortMode === 'xyz' && <span className="text-[#89dc69]">✓</span>}
              </button>
              <button
                type="button"
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  setSortMode('zyx');
                  setIsFilterMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#393d41] cursor-pointer !transition-none ${
                  sortMode === 'zyx' ? 'bg-[#35383b] text-[#89dc69] font-bold' : 'text-white'
                }`}
              >
                <span>Sort ZYX (Z → Y → X)</span>
                {sortMode === 'zyx' && <span className="text-[#89dc69]">✓</span>}
              </button>
              <button
                type="button"
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  setSortMode('default');
                  setIsFilterMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#393d41] cursor-pointer !transition-none ${
                  sortMode === 'default' ? 'bg-[#35383b] text-[#89dc69] font-bold' : 'text-gray-300'
                }`}
              >
                <span>Default (Latest first)</span>
                {sortMode === 'default' && <span className="text-[#89dc69]">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FULL ARTICLE DETAIL VIEW */}
      {selectedArticle ? (
        <div className="space-y-4 animate-fade-in">
          {/* ARTICLE MAIN CONTAINER */}
          <article className="bg-[#2e3134] border-2 border-[#141414] shadow-2xl p-4 sm:p-6 md:p-8 space-y-6 text-white font-minecraft-seven">
            {/* ARTICLE HEADER */}
            <div className="space-y-3 border-b-2 border-[#3d4145] pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#89dc69] text-[#141414] px-2.5 py-0.5 text-[11px] font-minecraft-ten border border-[#141414] uppercase">
                  {selectedArticle.versionTag}
                </span>
                <span className="bg-[#0074d9] text-white px-2.5 py-0.5 text-[11px] font-minecraft-seven border border-[#141414] shadow-sm">
                  {selectedArticle.editionBadge}
                </span>
                <span className="text-gray-400 font-minecraft-seven text-xs flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-minecraft-ten text-white uppercase tracking-wide leading-tight">
                {selectedArticle.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 font-medium italic leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            {/* HERO THUMBNAIL BANNER */}
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] max-h-[380px] bg-[#1b1c1e] border-2 border-[#141414] overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={selectedArticle.thumbnail}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover [image-rendering:pixelated] shadow-md"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* ARTICLE BODY SECTIONS (REDUCED SPACE BETWEEN CATEGORIES) */}
            <div className="space-y-4 pt-1">
              {/* SECTION: FEATURES */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-[#418a28] pb-1">
                  <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
                  <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                    FEATURES
                  </h2>
                </div>

                <div className="space-y-2.5 pl-2 sm:pl-3">
                  {selectedArticle.features.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5 bg-[#25272a] p-3 border border-[#141414]">
                      <h3 className="text-xs sm:text-sm text-[#89dc69] font-minecraft-ten uppercase tracking-wider flex items-center gap-1.5">
                        <span>{cat.category}</span>
                      </h3>
                      <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#89dc69]">
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: BUG FIXES */}
              {selectedArticle.bugFixes.length > 0 && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 border-b-2 border-[#38bdf8] pb-1">
                    <span className="w-3 h-3 bg-[#38bdf8] inline-block border border-[#141414]" />
                    <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                      BUG FIXES
                    </h2>
                  </div>

                  <div className="bg-[#25272a] p-3 border border-[#141414] pl-2 sm:pl-3">
                    <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#38bdf8]">
                      {selectedArticle.bugFixes.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* SECTION: KNOWN ISSUES */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-[#f59e0b] pb-1">
                  <span className="w-3 h-3 bg-[#f59e0b] inline-block border border-[#141414]" />
                  <h2 className="text-lg sm:text-xl font-minecraft-ten tracking-wider text-white">
                    KNOWN ISSUES
                  </h2>
                </div>

                <div className="bg-[#25272a] p-3 border border-[#141414] pl-2 sm:pl-3">
                  <p className="text-xs text-amber-300 font-minecraft-seven mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reported issues being resolved in upcoming snapshots:</span>
                  </p>
                  <ul className="space-y-1 pl-4 sm:pl-6 text-xs sm:text-sm text-gray-200 list-disc marker:text-[#f59e0b]">
                    {selectedArticle.knownIssues.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </article>
        </div>
      ) : (
        /* ARTICLES LIST VIEW */
        <div className="space-y-4">
          {/* HEADER BANNER */}
          <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#89dc69] inline-block border border-[#141414]" />
              <h1 className="text-base sm:text-lg text-white uppercase tracking-wider font-minecraft-ten">
                RELEASE NOTES & CHANGELOGS
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-minecraft-seven">
              Follow all updates, experimental snapshots, new features, and bug fixes for The Craftmine. Click any article to read the full changelog.
            </p>
          </div>

          {/* ARTICLES LIST */}
          {sortedArticles.length === 0 ? (
            <div className="bg-[#292a2c] p-8 text-center border-2 border-[#141414] space-y-3">
              <p className="text-sm text-white font-minecraft-seven">
                We found nothing :(
              </p>
              <p className="text-xs text-gray-300 font-minecraft-seven">
                No results found for {searchQuery ? `"${searchQuery}"` : 'your query'}. Refine your search query.
              </p>
              <div className="w-56 mx-auto pt-2">
                <VplaySecondaryButton
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search for snapshots"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.focus();
                      searchInput.select();
                    }
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/c/c8/MagnifyingGlass-52f96e5f47f42e682a00.png/revision/latest?cb=20260723030208"
                    alt="Search"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-contain filter brightness-0 inline-block mr-1.5"
                  />
                  <span>Refine search</span>
                </VplaySecondaryButton>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedArticles.map((article) => {
                const isLatest = article.id === 'snapshot-26w05x';
                return (
                  <div
                    key={article.id}
                    onMouseDown={() => playPopSound()}
                    onClick={() => handleSelectArticle(article.id)}
                    className={`
                      group relative bg-[#313437] hover:bg-[#393d41] border-2 cursor-pointer transition-all duration-150 p-4 sm:p-5 shadow-lg select-none btn-press-effect overflow-hidden
                      ${isLatest ? 'border-[#89dc69]' : 'border-[#141414] hover:border-[#89dc69]'}
                    `}
                  >
                    {/* 3D bevel overlay */}
                    <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_2px_2px_0_rgba(255,255,255,0.15),inset_-2px_-3px_0_rgba(0,0,0,0.5)]" />

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 relative z-10">
                      {/* Thumbnail Image */}
                      <div className="w-full md:w-56 h-36 bg-[#1b1c1e] border-2 border-[#141414] flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover [image-rendering:pixelated] group-hover:scale-105 transition-transform duration-200"
                          style={{ imageRendering: 'pixelated' }}
                        />
                        {isLatest && (
                          <div className="absolute top-1 left-1 bg-[#89dc69] text-[#141414] text-[9px] font-minecraft-ten px-1.5 py-0.5 border border-[#141414]">
                            LATEST
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#0074d9] text-white px-2 py-0.5 text-[10px] font-minecraft-seven border border-[#141414] shadow-sm">
                            {article.editionBadge}
                          </span>
                          <span className="text-gray-400 font-minecraft-seven text-[11px] ml-auto">
                            {article.date}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg md:text-xl text-white group-hover:text-[#89dc69] font-minecraft-ten tracking-wide">
                          {article.title}
                        </h2>

                        <p className="text-xs text-gray-300 font-minecraft-seven leading-relaxed line-clamp-2">
                          {article.summary}
                        </p>

                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-minecraft-seven">
                            <span>{article.features.reduce((acc, f) => acc + f.items.length, 0)} Features</span>
                            <span>•</span>
                            <span>{article.bugFixes.length} Fixes</span>
                            <span>•</span>
                            <span>{article.knownIssues.length} Issues</span>
                          </div>

                          <span className="text-xs text-[#89dc69] font-minecraft-seven group-hover:underline flex items-center gap-1">
                            <span>READ</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
