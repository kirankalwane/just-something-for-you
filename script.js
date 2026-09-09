// ==========================================================================
// 🎵 CUSTOM SONG CONFIGURATION
// ==========================================================================
// To use your own song for Scene 5 (The Rhythm):
// Put your audio file into this project folder (e.g. named "song.mp3")
const SONG_CONFIG = {
  src: 'song.mp3', // Supported formats: .mp3, .m4a, .wav, .ogg
  title: 'Afreen Afreen', // Title displayed on the music card
  subtitle: "There's a song that reminds me of you.", // Subtitle displayed
  volume: 0.85 // Default volume (0.0 to 1.0)
};

// ==========================================================================
// 🎶 BACKGROUND MUSIC CONFIGURATION ("Vaaroon.mp3")
// ==========================================================================
// Plays continuously in the background across all scenes,
// except when the dedicated song (song.mp3) is playing in Scene 5.
const BG_MUSIC_CONFIG = {
  src: 'Vaaroon.mp3', // Background audio filename in project folder
  volume: 0.35,        // Background volume level (0.0 to 1.0)
  loop: true           // Repeat continuously
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Canvas and Audio
  const starfield = new Starfield('star-canvas');
  const soundEngine = new SoundEngine();

  // DOM Elements
  const progressBar = document.getElementById('progress-bar');
  const soundToggle = document.getElementById('sound-toggle');
  const iconSoundOn = document.getElementById('sound-icon-on');
  const iconSoundOff = document.getElementById('sound-icon-off');
  const cursorGlow = document.getElementById('cursor-glow');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const musicTitleEl = document.getElementById('music-title-text');
  const musicSubtitleEl = document.getElementById('music-subtitle-text');

  // Apply custom song labels if configured
  if (musicTitleEl && SONG_CONFIG.title) musicTitleEl.textContent = SONG_CONFIG.title;
  if (musicSubtitleEl && SONG_CONFIG.subtitle) musicSubtitleEl.textContent = SONG_CONFIG.subtitle;

  // Theme Switcher (Twilight Moon <-> Pastel Cotton-Candy Dream)
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      const isPastel = document.body.classList.toggle('theme-pastel');
      if (themeIcon) {
        themeIcon.textContent = isPastel ? '🌙' : '🌸';
      }
      const rect = themeToggle.getBoundingClientRect();
      starfield.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
    });
  }

  // Scenes list (7-scene flow: 0 through 6)
  const scenes = [
    document.getElementById('scene-0'),
    document.getElementById('scene-1'),
    document.getElementById('scene-2'),
    document.getElementById('scene-3'),
    document.getElementById('scene-4'),
    document.getElementById('scene-5'),
    document.getElementById('scene-6')
  ];

  let currentSceneIndex = 0;
  const totalScenes = scenes.length;

  // Custom Cursor Glow Follower
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  // Custom Song Audio Track Support
  const customAudio = new Audio(SONG_CONFIG.src);
  let hasCustomAudio = false;

  customAudio.addEventListener('loadedmetadata', () => { hasCustomAudio = true; });
  customAudio.addEventListener('canplay', () => { hasCustomAudio = true; });
  customAudio.addEventListener('canplaythrough', () => { hasCustomAudio = true; });
  customAudio.addEventListener('error', () => {
    hasCustomAudio = false;
    console.log(`[Audio Info] "${SONG_CONFIG.src}" not loaded; using built-in acoustic music-box synthesizer.`);
  });

  // Background Music Track Support ("Vaaroon.mp3")
  const bgAudio = new Audio(BG_MUSIC_CONFIG.src);
  bgAudio.loop = BG_MUSIC_CONFIG.loop !== false;
  let hasBgAudio = false;

  bgAudio.addEventListener('loadedmetadata', () => { hasBgAudio = true; });
  bgAudio.addEventListener('canplay', () => { hasBgAudio = true; });
  bgAudio.addEventListener('canplaythrough', () => { hasBgAudio = true; });
  bgAudio.addEventListener('error', () => {
    hasBgAudio = false;
    console.log(`[Audio Info] "${BG_MUSIC_CONFIG.src}" not loaded; using celestial drone.`);
  });

  function startBgMusic() {
    if (hasBgAudio) {
      bgAudio.volume = BG_MUSIC_CONFIG.volume || 0.35;
      bgAudio.play().catch(() => {
        soundEngine.startAmbient();
      });
    } else {
      soundEngine.startAmbient();
    }
  }

  function pauseBgMusic() {
    if (hasBgAudio && !bgAudio.paused) {
      bgAudio.pause();
    }
  }

  function resumeBgMusic() {
    if (hasBgAudio && bgAudio.paused) {
      bgAudio.play().catch(() => {});
    } else if (!hasBgAudio) {
      soundEngine.startAmbient();
    }
  }

  // Sound Toggle Interaction
  soundToggle.addEventListener('click', () => {
    const isMuted = soundEngine.toggleMute();
    if (customAudio) customAudio.muted = isMuted;
    if (bgAudio) bgAudio.muted = isMuted;
    if (isMuted) {
      iconSoundOn.style.display = 'none';
      iconSoundOff.style.display = 'block';
    } else {
      iconSoundOn.style.display = 'block';
      iconSoundOff.style.display = 'none';
    }
  });

  // Update Progress Bar
  function updateProgress(index) {
    const pct = Math.min(100, Math.round((index / (totalScenes - 1)) * 100));
    progressBar.style.width = `${pct}%`;
  }

  // Scene Switcher with Cinema Transitions
  function goToScene(targetIndex, buttonEl = null) {
    if (targetIndex < 0 || targetIndex >= totalScenes) return;

    // Star burst at button click location
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect();
      starfield.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    } else {
      starfield.burst(window.innerWidth / 2, window.innerHeight / 2, 16);
    }

    soundEngine.playChime(targetIndex);

    const currentScene = scenes[currentSceneIndex];
    const nextScene = scenes[targetIndex];

    currentScene.classList.add('leaving');
    setTimeout(() => {
      currentScene.classList.remove('active', 'leaving');
      nextScene.classList.add('active');
      currentSceneIndex = targetIndex;
      updateProgress(currentSceneIndex);

      // Trigger scene-specific choreography
      handleSceneEnter(currentSceneIndex);
    }, 600);
  }

  // Orchestrations for each scene
  function handleSceneEnter(index) {
    switch (index) {
      case 1:
        choreographScene1();
        break;
      case 2:
        choreographScene2();
        break;
      case 3:
        choreographScene3();
        break;
      case 4:
        choreographScene4();
        break;
      case 5:
        choreographScene5();
        break;
      case 6:
        choreographScene6();
        break;
    }
  }

  // --- SCENE 0 -> 1: Initial Hook & Audio Unlock ---
  const btnStart = document.getElementById('btn-start');
  btnStart.addEventListener('click', (e) => {
    startBgMusic();
    // Prime the custom audio on user gesture so mobile browsers allow playback in Scene 4
    if (customAudio) {
      customAudio.load();
    }
    goToScene(1, btnStart);
  });

  // --- SCENE 1: Favorite Distraction (College & Ordinary Days) ---
  function choreographScene1() {
    const lines = [
      document.getElementById('line-1-1'),
      document.getElementById('line-1-2'),
      document.getElementById('line-1-3'),
      document.getElementById('line-1-4'),
      document.getElementById('line-1-5'),
      document.getElementById('line-1-6')
    ];
    const btn = document.getElementById('btn-scene-1');

    const delays = [400, 1600, 2900, 4400, 5600, 6900];
    lines.forEach((line, i) => {
      if (line) setTimeout(() => line.classList.add('revealed'), delays[i]);
    });

    setTimeout(() => {
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => btn.style.opacity = '1');
      }
    }, 8200);
  }

  const btnScene1 = document.getElementById('btn-scene-1');
  if (btnScene1) {
    btnScene1.addEventListener('click', () => goToScene(2, btnScene1));
  }

  // --- SCENE 2: The Honest Part (Cinematic Breathing Room) ---
  function choreographScene2() {
    const l1 = document.getElementById('line-2-1');
    const p1 = document.getElementById('pause-1');
    const l2 = document.getElementById('line-2-2');
    const l3 = document.getElementById('line-2-3');
    const p2 = document.getElementById('pause-2');
    const l4 = document.getElementById('line-2-4');
    const l5 = document.getElementById('line-2-5');
    const l6 = document.getElementById('line-2-6');
    const btn = document.getElementById('btn-scene-2');

    // Moment 1: Sometimes I just want to talk to you.
    setTimeout(() => { if (l1) l1.classList.add('revealed'); }, 500);
    setTimeout(() => { if (p1) p1.classList.add('revealed'); }, 1800);

    // Pause... Moment 2: Then I wonder… Am I bothering you?
    setTimeout(() => { if (l2) l2.classList.add('revealed'); }, 3800);
    setTimeout(() => { if (l3) l3.classList.add('revealed'); }, 5100);
    setTimeout(() => { if (p2) p2.classList.add('revealed'); }, 6400);

    // Pause... Moment 3: Sometimes you don't notice me. I pretend it's okay. Sometimes… it isn't.
    setTimeout(() => { if (l4) l4.classList.add('revealed'); }, 8800);
    setTimeout(() => { if (l5) l5.classList.add('revealed'); }, 10200);
    setTimeout(() => {
      if (l6) l6.classList.add('revealed');
      soundEngine.playChime(1);
    }, 11800);

    // Continue button
    setTimeout(() => {
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => btn.style.opacity = '1');
      }
    }, 13200);
  }

  const btnScene2 = document.getElementById('btn-scene-2');
  if (btnScene2) {
    btnScene2.addEventListener('click', () => goToScene(3, btnScene2));
  }

  // --- SCENE 3: The Little Things (Replaces the Quiz) ---
  function choreographScene3() {
    const l1 = document.getElementById('line-3-1');
    const l2 = document.getElementById('line-3-2');
    const l3 = document.getElementById('line-3-3');
    const l4 = document.getElementById('line-3-4');
    const l5 = document.getElementById('line-3-5');
    const l6 = document.getElementById('line-3-6');
    const btn = document.getElementById('btn-scene-3');

    // It's weird… how the little things about you stay in my head.
    setTimeout(() => { if (l1) l1.classList.add('revealed'); }, 400);
    setTimeout(() => { if (l2) l2.classList.add('revealed'); }, 1600);
    setTimeout(() => { if (l3) l3.classList.add('revealed'); }, 2800);

    // Your smile. (Soft photo highlight + chime)
    setTimeout(() => {
      if (l4) l4.classList.add('revealed');
      soundEngine.playChime(2);
      const photo1 = document.querySelector('.c-photo-1');
      if (photo1) {
        photo1.style.opacity = '0.65';
        photo1.style.transform = 'translateY(-16px) rotate(-2deg) scale(1.06)';
        photo1.style.boxShadow = '0 0 50px rgba(244, 114, 182, 0.65)';
        setTimeout(() => {
          photo1.style.opacity = '';
          photo1.style.transform = '';
          photo1.style.boxShadow = '';
        }, 3600);
      }
    }, 4200);

    // Your way of talking.
    setTimeout(() => {
      if (l5) l5.classList.add('revealed');
      soundEngine.playChime(3);
    }, 5600);

    // Just… you. ✨ (Star burst + shooting star)
    setTimeout(() => {
      if (l6) l6.classList.add('revealed');
      starfield.triggerShootingStar();
      starfield.burst(window.innerWidth / 2, window.innerHeight / 2, 26);
      soundEngine.playChime(4);
    }, 7200);

    // Button
    setTimeout(() => {
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => btn.style.opacity = '1');
      }
    }, 8600);
  }

  const btnScene3 = document.getElementById('btn-scene-3');
  if (btnScene3) {
    btnScene3.addEventListener('click', () => goToScene(4, btnScene3));
  }

  // --- SCENE 4: The Rhythm & The Song ---
  const heartIcon = document.getElementById('heart-icon');
  const heartRipple1 = document.getElementById('heart-ripple-1');
  const heartRipple2 = document.getElementById('heart-ripple-2');
  const heartText = document.getElementById('heart-text');
  const heartSubtext = document.getElementById('heart-subtext');
  const musicCard = document.getElementById('music-card');
  const musicDisk = document.getElementById('music-disk');
  const soundwaveBars = document.getElementById('soundwave-bars');
  const musicMemoryNote = document.getElementById('music-memory-note');
  const btnScene4 = document.getElementById('btn-scene-4');

  // Synchronize visual pulse with Web Audio heartbeat
  soundEngine.onHeartbeatBeat = () => {
    if (!heartIcon) return;
    heartIcon.classList.add('heart-thump-active');
    heartRipple1.classList.remove('pulse');
    void heartRipple1.offsetWidth; // trigger reflow
    heartRipple1.classList.add('pulse');

    setTimeout(() => {
      heartRipple2.classList.remove('pulse');
      void heartRipple2.offsetWidth;
      heartRipple2.classList.add('pulse');
    }, 130);

    setTimeout(() => {
      heartIcon.classList.remove('heart-thump-active');
    }, 220);
  };

  function choreographScene4() {
    // Start tactile heartbeat loop
    soundEngine.startHeartbeatLoop(64);
    setTimeout(() => { if (heartText) heartText.classList.add('revealed'); }, 600);
    setTimeout(() => { if (heartSubtext) heartSubtext.classList.add('revealed'); }, 1600);

    // Fade in music card and play Afreen motif after 3.2s
    setTimeout(() => {
      if (musicCard) {
        musicCard.style.opacity = '1';
        musicCard.style.transform = 'translateY(0)';
      }
      if (musicMemoryNote) musicMemoryNote.classList.add('revealed');

      startPlayingAfreen();
    }, 3200);

    setTimeout(() => {
      if (btnScene4) {
        btnScene4.style.display = 'inline-flex';
        btnScene4.style.opacity = '0';
        btnScene4.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => btnScene4.style.opacity = '1');
      }
    }, 6500);
  }

  customAudio.addEventListener('ended', () => {
    if (musicDisk) musicDisk.classList.remove('spinning');
    if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
    resumeBgMusic();
  });

  function startPlayingAfreen() {
    pauseBgMusic();
    if (musicDisk) musicDisk.classList.add('spinning');
    if (soundwaveBars) soundwaveBars.classList.add('music-playing');

    if (hasCustomAudio) {
      customAudio.currentTime = 0;
      customAudio.volume = SONG_CONFIG.volume || 0.85;
      const playPromise = customAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio Info] Custom audio play restricted by browser, using acoustic fallback:', err);
          soundEngine.playAfreenMelody(() => {
            if (musicDisk) musicDisk.classList.remove('spinning');
            if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
            resumeBgMusic();
          });
        });
      }
    } else {
      soundEngine.playAfreenMelody(() => {
        if (musicDisk) musicDisk.classList.remove('spinning');
        if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
        resumeBgMusic();
      });
    }
  }

  function toggleAfreenMusic() {
    if (hasCustomAudio && !customAudio.paused) {
      customAudio.pause();
      if (musicDisk) musicDisk.classList.remove('spinning');
      if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
      resumeBgMusic();
    } else if (soundEngine.isMelodyPlaying) {
      soundEngine.stopAfreenMelody();
      if (musicDisk) musicDisk.classList.remove('spinning');
      if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
      resumeBgMusic();
    } else {
      startPlayingAfreen();
    }
  }

  function stopAllMusic() {
    soundEngine.stopAfreenMelody();
    if (hasCustomAudio && !customAudio.paused) {
      const fadeInterval = setInterval(() => {
        if (customAudio.volume > 0.15) {
          customAudio.volume -= 0.15;
        } else {
          customAudio.pause();
          customAudio.volume = 0.85;
          clearInterval(fadeInterval);
        }
      }, 70);
    }
    if (musicDisk) musicDisk.classList.remove('spinning');
    if (soundwaveBars) soundwaveBars.classList.remove('music-playing');
  }

  if (musicDisk) musicDisk.addEventListener('click', toggleAfreenMusic);

  if (btnScene4) {
    btnScene4.addEventListener('click', () => {
      soundEngine.stopHeartbeatLoop();
      stopAllMusic();
      goToScene(5, btnScene4);
    });
  }

  // --- SCENE 5: The Climax Thoughts & Joke ---
  function choreographScene5() {
    // Deep blackout
    starfield.setDimmed(true, 0.05);
    soundEngine.stopHeartbeatLoop();
    soundEngine.stopAfreenMelody();
    soundEngine.fadeAmbient(0.001, 1.2);
    pauseBgMusic();

    const nameEl = document.getElementById('blackout-name');
    const bo1 = document.getElementById('bo-1');
    const bo2 = document.getElementById('bo-2');
    const bo3 = document.getElementById('bo-3');
    const bo4 = document.getElementById('bo-4');
    const bo5 = document.getElementById('bo-5');
    const bo6 = document.getElementById('bo-6');
    const bo7 = document.getElementById('bo-7');
    const boConc = document.getElementById('bo-conclusion');
    const btn5 = document.getElementById('btn-scene-5');

    setTimeout(() => {
      if (nameEl) nameEl.style.opacity = '1';
    }, 700);

    setTimeout(() => { if (bo1) bo1.classList.add('revealed'); }, 2000);
    setTimeout(() => { if (bo2) bo2.classList.add('revealed'); }, 3400);

    // Heartbeat phrases with single realistic thud each
    setTimeout(() => {
      soundEngine.playSingleHeartbeat();
      if (bo3) bo3.classList.add('revealed');
    }, 5200);

    setTimeout(() => {
      soundEngine.playSingleHeartbeat();
      if (bo4) bo4.classList.add('revealed');
    }, 7000);

    setTimeout(() => {
      soundEngine.playSingleHeartbeat();
      if (bo5) bo5.classList.add('revealed');
    }, 8800);

    // Resolution: I don't actually want anything from you. I just wanted you to know. ❤️
    setTimeout(() => { if (bo6) bo6.classList.add('revealed'); }, 10800);
    setTimeout(() => { if (bo7) bo7.classList.add('revealed'); }, 12400);

    // Stars return softly, ambient music restores softly, joke & Take Care button appear
    setTimeout(() => {
      starfield.setDimmed(false, 0.02);
      soundEngine.fadeAmbient(0.28, 3.0);
      resumeBgMusic();
      if (boConc) boConc.style.opacity = '1';
      if (btn5) {
        btn5.style.display = 'inline-flex';
        btn5.style.opacity = '0';
        btn5.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => btn5.style.opacity = '1');
      }
    }, 14200);
  }

  const btnScene5 = document.getElementById('btn-scene-5');
  if (btnScene5) {
    btnScene5.addEventListener('click', () => {
      goToScene(6, btnScene5);
    });
  }

  // --- SCENE 6: The Closure (Take Care & Reaction Buttons) ---
  function choreographScene6() {
    starfield.setDimmed(false, 0.02);
    soundEngine.fadeAmbient(0.35, 2.5);
    resumeBgMusic();
    starfield.burst(window.innerWidth / 2, window.innerHeight * 0.45, 28);
    soundEngine.playChime(4);
  }

  // --- MODAL DIALOGUES FOR FINAL REACTION BUTTONS ---
  const modal = document.getElementById('reaction-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const prefilledBox = document.getElementById('prefilled-box');
  const prefilledText = document.getElementById('prefilled-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalWhatsAppBtn = document.getElementById('modal-whatsapp-btn');

  function openModal(title, msg, prefill = null, whatsappUrl = null) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = msg;

    if (prefill) {
      prefilledBox.style.display = 'block';
      prefilledText.textContent = prefill;
    } else {
      prefilledBox.style.display = 'none';
    }

    if (whatsappUrl) {
      modalWhatsAppBtn.style.display = 'inline-flex';
      modalWhatsAppBtn.onclick = () => {
        window.open(whatsappUrl, '_blank');
      };
    } else {
      modalWhatsAppBtn.style.display = 'none';
    }

    modal.classList.add('active');
    starfield.burst(window.innerWidth / 2, window.innerHeight / 2, 25);
  }

  modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Reaction 1: Keep it between us
  document.getElementById('btn-secret').addEventListener('click', () => {
    soundEngine.playChime(1);
    openModal(
      "Our Little Secret 🤫",
      "Deal. Not a single word to anyone else.<br>Just between these stars and you."
    );
  });

  // Reaction 2: Pretend you never saw this
  document.getElementById('btn-pretend').addEventListener('click', () => {
    soundEngine.playChime(2);
    openModal(
      "Saw what? 👀",
      "I have zero recollection of making any website.<br>Must have been a glitch in the universe. 😉"
    );
  });

  // Reaction 3: Did this make you smile?
  document.getElementById('btn-smile-reply').addEventListener('click', () => {
    soundEngine.playChime(4);
    const textMsg = "Hey... I saw your website. And yes, I smiled :)";
    const encoded = encodeURIComponent(textMsg);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    openModal(
      "Did this make you smile? ✨",
      "If it did, that's literally all I wanted.<br>If you feel like letting me know:",
      `“${textMsg}”`,
      waUrl
    );
  });

  // --- AESTHETIC POLAROID MEMORY SHOWCASE ---
  const galleryModal = document.getElementById('gallery-modal');
  const galleryToggle = document.getElementById('gallery-toggle');
  const galleryCloseBtn = document.getElementById('gallery-close-btn');
  const btnMemories = document.getElementById('btn-memories');
  const polaroidImg = document.getElementById('polaroid-img');
  const polaroidCaption = document.getElementById('polaroid-caption');
  const polaroidCounter = document.getElementById('polaroid-counter');
  const polaroidPrev = document.getElementById('polaroid-prev');
  const polaroidNext = document.getElementById('polaroid-next');
  const polaroidDots = document.getElementById('polaroid-dots');

  const memoriesList = [
    {
      src: 'photo1.jpg',
      caption: "The smile that makes ordinary days less ordinary ✨"
    },
    {
      src: 'photo2.jpg',
      caption: "Graceful, effortless, always 🌸"
    },
    {
      src: 'photo3.jpg',
      caption: "My favorite distraction in a world full of noise 🌙"
    },
    {
      src: 'photo4.jpg',
      caption: "Warmth in every quiet moment 💛"
    },
    {
      src: 'photo5.jpg',
      caption: "Actually… I notice when you're happy :)"
    }
  ];

  let currentMemoryIdx = 0;

  function renderMemory(idx) {
    if (idx < 0) idx = memoriesList.length - 1;
    if (idx >= memoriesList.length) idx = 0;
    currentMemoryIdx = idx;

    if (polaroidImg) {
      polaroidImg.style.opacity = '0';
      setTimeout(() => {
        polaroidImg.src = memoriesList[currentMemoryIdx].src;
        if (polaroidCaption) polaroidCaption.textContent = memoriesList[currentMemoryIdx].caption;
        if (polaroidCounter) polaroidCounter.textContent = `${currentMemoryIdx + 1} / ${memoriesList.length}`;
        polaroidImg.style.opacity = '1';

        if (polaroidDots) {
          const dots = polaroidDots.querySelectorAll('.p-dot');
          dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentMemoryIdx);
          });
        }
      }, 180);
    }
  }

  function openGallery(startIdx = 0) {
    renderMemory(startIdx);
    if (galleryModal) {
      galleryModal.classList.add('active');
      soundEngine.playChime(2);
      starfield.burst(window.innerWidth / 2, window.innerHeight / 2, 28);
    }
  }

  function closeGallery() {
    if (galleryModal) galleryModal.classList.remove('active');
  }

  if (galleryToggle) {
    galleryToggle.addEventListener('click', () => openGallery(0));
  }

  if (btnMemories) {
    btnMemories.addEventListener('click', () => openGallery(0));
  }

  if (galleryCloseBtn) {
    galleryCloseBtn.addEventListener('click', closeGallery);
  }

  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeGallery();
    });
  }

  if (polaroidPrev) {
    polaroidPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playChime(1);
      renderMemory(currentMemoryIdx - 1);
    });
  }

  if (polaroidNext) {
    polaroidNext.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playChime(3);
      renderMemory(currentMemoryIdx + 1);
    });
  }

  if (polaroidDots) {
    const dots = polaroidDots.querySelectorAll('.p-dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEngine.playChime(i);
        renderMemory(i);
      });
    });
  }

  // Keyboard navigation for Polaroid modal
  window.addEventListener('keydown', (e) => {
    if (!galleryModal || !galleryModal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') renderMemory(currentMemoryIdx - 1);
    if (e.key === 'ArrowRight') renderMemory(currentMemoryIdx + 1);
    if (e.key === 'Escape') closeGallery();
  });
});
