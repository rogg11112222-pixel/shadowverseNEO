
const sounds = {
    bgm: new Audio("/audio/BattleBGM(Lowen).mp3"),
    homeBgm: new Audio("/audio/homeBGM1.mp3"),
    summon: new Audio("/audio/cardput1.mp3"),
    tap: new Audio("/audio/cardtap1.mp3"),
    attack: new Audio("/audio/sordAttack1.mp3"),
    impact: new Audio("/audio/LifeDamege1.mp3"),
    heavyAttack: new Audio("/audio/dagekiAttack1.mp3"),
    magic: new Audio("/audio/spellcard1.mp3"),
    evolve: new Audio("/audio/evolve1.mp3"),
    voiceSummon: new Audio("/audio/syoukan1.mp3")
  };
  
  sounds.bgm.loop = true;
  sounds.homeBgm.loop = true;
  
  sounds.bgm.volume = 0.3;
  sounds.homeBgm.volume = 0.3;
  
  for (const [name, audio] of Object.entries(sounds)) {
    if (name !== "bgm" && name !== "homeBgm") {
      audio.volume = 0.75;
      audio.preload = "auto";
    }
  }
  
  let enabled = true;
  let currentBgm = null;
  let currentTrack = null;
  
  function changeBgm(trackName) {
    if (!enabled) return;
  
    const nextTrack = sounds[trackName];
    if (!nextTrack || (trackName !== "bgm" && trackName !== "homeBgm")) {
      return;
    }
  
    if (currentTrack === trackName && !nextTrack.paused) return;
  
    if (currentBgm && currentBgm !== nextTrack) {
      currentBgm.pause();
      currentBgm.currentTime = 0;
    }
  
    currentBgm = nextTrack;
    currentTrack = trackName;
  
    nextTrack.play().catch(() => {
      // ブラウザが自動再生を制限した場合は、次のクリック時に再試行する
    });
  }
  
  function playSound(name) {
    if (!enabled || !sounds[name] ||
        name === "bgm" || name === "homeBgm") return;
  
    const audio = sounds[name];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
  
  function startBgm() {
    changeBgm(currentTrack || "homeBgm");
  }
  
  function toggleAudio() {
    enabled = !enabled;
  
    if (!enabled) {
      Object.values(sounds).forEach(audio => audio.pause());
    } else {
      // ONに戻したら、現在のゲーム状態に対応するBGMを再生
      changeBgm(currentTrack || "homeBgm");
    }
  
    const button = document.getElementById("audioToggle");
    if (button) {
      button.textContent = enabled ? "🔊 音声 ON" : "🔇 音声 OFF";
    }
  }
  
  window.GameAudio = {
    play: playSound,
    startBgm,
    changeBgm,
    toggle: toggleAudio
  };
  
  // ブラウザの自動再生制限に対応
  document.addEventListener("click", () => {
    if (enabled) startBgm();
  }, { once: true });
  