// Audio player for Ore UI interactions
// 1. Snes Pop: ONLY for toggle switches, sliders, white button
//    https://static.wikia.nocookie.net/ep-deo/images/9/93/Snes_pop.ogg/revision/latest?cb=20261007104214
// 2. Deep: ONLY for green button
//    https://static.wikia.nocookie.net/ep-deo/images/5/57/Deep.ogg/revision/latest?cb=20261007104243
// 3. Minecraft button click: for other UI buttons
//    https://static.wikia.nocookie.net/ep-deo/images/6/69/Minecraft_button_click.ogg/revision/latest?cb=20261006123224

const SNES_POP_LOCAL = '/sounds/Snes_pop.ogg';
const SNES_POP_REMOTE = 'https://static.wikia.nocookie.net/ep-deo/images/9/93/Snes_pop.ogg/revision/latest?cb=20261007104214';

const DEEP_LOCAL = '/sounds/Deep.ogg';
const DEEP_REMOTE = 'https://static.wikia.nocookie.net/ep-deo/images/5/57/Deep.ogg/revision/latest?cb=20261007104243';

const MINECRAFT_CLICK_LOCAL = '/sounds/Minecraft_button_click.ogg';
const MINECRAFT_CLICK_REMOTE = 'https://static.wikia.nocookie.net/ep-deo/images/6/69/Minecraft_button_click.ogg/revision/latest?cb=20261006123224';

let sharedAudioCtx: AudioContext | null = null;
let snesPopBuffer: AudioBuffer | null = null;
let deepBuffer: AudioBuffer | null = null;
let minecraftClickBuffer: AudioBuffer | null = null;
let isFetchingBuffers = false;

let lastSnesPlayTime = 0;
let lastDeepPlayTime = 0;
let lastMinecraftPlayTime = 0;

// Pools of HTML5 Audio elements as instant fallbacks
const snesAudioPool: HTMLAudioElement[] = [];
const deepAudioPool: HTMLAudioElement[] = [];
const minecraftAudioPool: HTMLAudioElement[] = [];
const POOL_SIZE = 4;

const initAudioPool = (pool: HTMLAudioElement[], localUrl: string, remoteUrl: string) => {
  if (typeof window === 'undefined' || pool.length > 0) return;
  for (let i = 0; i < POOL_SIZE; i++) {
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = localUrl;
      audio.onerror = () => {
        audio.src = remoteUrl;
      };
      audio.volume = 0.85;
      pool.push(audio);
    } catch {
      // Audio element not supported
    }
  }
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioContextClass();
  }
  return sharedAudioCtx;
};

// Pre-load audio into AudioBuffers via Web Audio API for 0ms latency playback
const loadAllAudioBuffers = async () => {
  if (isFetchingBuffers || typeof window === 'undefined') return;
  isFetchingBuffers = true;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const fetchBuffer = async (localUrl: string, remoteUrl: string): Promise<AudioBuffer | null> => {
      let arrayBuffer: ArrayBuffer | null = null;
      try {
        const resp = await fetch(localUrl, { cache: 'force-cache' });
        if (resp.ok) {
          arrayBuffer = await resp.arrayBuffer();
        }
      } catch {
        // Local fetch failed, fallback to remote
      }

      if (!arrayBuffer) {
        try {
          const resp = await fetch(remoteUrl, { cache: 'force-cache' });
          if (resp.ok) {
            arrayBuffer = await resp.arrayBuffer();
          }
        } catch {
          // Remote fetch failed
        }
      }

      if (arrayBuffer && ctx) {
        try {
          return await ctx.decodeAudioData(arrayBuffer);
        } catch {
          return null;
        }
      }
      return null;
    };

    if (!snesPopBuffer) {
      snesPopBuffer = await fetchBuffer(SNES_POP_LOCAL, SNES_POP_REMOTE);
    }
    if (!deepBuffer) {
      deepBuffer = await fetchBuffer(DEEP_LOCAL, DEEP_REMOTE);
    }
    if (!minecraftClickBuffer) {
      minecraftClickBuffer = await fetchBuffer(MINECRAFT_CLICK_LOCAL, MINECRAFT_CLICK_REMOTE);
    }
  } finally {
    isFetchingBuffers = false;
  }
};

// Initialize listeners on first user gesture
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    initAudioPool(snesAudioPool, SNES_POP_LOCAL, SNES_POP_REMOTE);
    initAudioPool(deepAudioPool, DEEP_LOCAL, DEEP_REMOTE);
    initAudioPool(minecraftAudioPool, MINECRAFT_CLICK_LOCAL, MINECRAFT_CLICK_REMOTE);
    loadAllAudioBuffers();
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  };
  window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
  window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });
}

const playBufferOrPool = (
  buffer: AudioBuffer | null,
  pool: HTMLAudioElement[],
  localUrl: string,
  remoteUrl: string
) => {
  try {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (buffer && ctx.state === 'running') {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.85, ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      }
    }

    if (pool.length === 0) {
      initAudioPool(pool, localUrl, remoteUrl);
    }
    const available = pool.find((a) => a.paused || a.ended) || pool[0];
    if (available) {
      available.currentTime = 0;
      available.play().catch(() => {});
      return;
    }

    const singleAudio = new Audio(localUrl);
    singleAudio.volume = 0.85;
    singleAudio.onerror = () => {
      singleAudio.src = remoteUrl;
      singleAudio.play().catch(() => {});
    };
    singleAudio.play().catch(() => {});
  } catch {
    // Audio playback blocked or not available
  }
};

/**
 * Play authentic Minecraft button click sound.
 * Used for all standard/dark UI buttons across the app.
 * URL: https://static.wikia.nocookie.net/ep-deo/images/6/69/Minecraft_button_click.ogg/revision/latest?cb=20261006123224
 */
export const playMinecraftClickSound = () => {
  const nowTime = Date.now();
  if (nowTime - lastMinecraftPlayTime < 90) return;
  lastMinecraftPlayTime = nowTime;

  playBufferOrPool(minecraftClickBuffer, minecraftAudioPool, MINECRAFT_CLICK_LOCAL, MINECRAFT_CLICK_REMOTE);
};

// Aliased as playPopSound so all other UI buttons automatically play the authentic Minecraft button click sound
export const playPopSound = playMinecraftClickSound;
export const playClickSound = playMinecraftClickSound;

/**
 * Play SNES Pop sound.
 * ONLY for toggle switches, sliders, and white buttons.
 * URL: https://static.wikia.nocookie.net/ep-deo/images/9/93/Snes_pop.ogg/revision/latest?cb=20261007104214
 */
export const playSnesPopSound = () => {
  const nowTime = Date.now();
  if (nowTime - lastSnesPlayTime < 90) return;
  lastSnesPlayTime = nowTime;

  playBufferOrPool(snesPopBuffer, snesAudioPool, SNES_POP_LOCAL, SNES_POP_REMOTE);
};

/**
 * Play Deep sound.
 * ONLY for green buttons (VplayHeroButton, VplayPrimaryButton).
 * URL: https://static.wikia.nocookie.net/ep-deo/images/5/57/Deep.ogg/revision/latest?cb=20261007104243
 */
export const playGreenButtonSound = () => {
  const nowTime = Date.now();
  if (nowTime - lastDeepPlayTime < 90) return;
  lastDeepPlayTime = nowTime;

  playBufferOrPool(deepBuffer, deepAudioPool, DEEP_LOCAL, DEEP_REMOTE);
};
