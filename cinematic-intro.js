(() => {
  "use strict";

  // Show the intro on a fresh visit or manual refresh, but not after
  // navigating between pages inside the same website.
  const NAVIGATION_SKIP_KEY = "hamad-town-cinematic-navigation-skip-v1";
  const navigationEntry = window.performance?.getEntriesByType?.("navigation")?.[0];
  let skipIntro = navigationEntry?.type === "back_forward";

  try {
    if (sessionStorage.getItem(NAVIGATION_SKIP_KEY) === "1") {
      sessionStorage.removeItem(NAVIGATION_SKIP_KEY);
      skipIntro = true;
    }
  } catch (_) {}

  let internalNavigationPending = false;
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = target?.closest?.("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target.toLowerCase() !== "_self")) return;

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }

    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
    internalNavigationPending = true;
  }, true);

  window.addEventListener("pagehide", () => {
    if (!internalNavigationPending) return;
    try {
      sessionStorage.setItem(NAVIGATION_SKIP_KEY, "1");
    } catch (_) {}
  }, { once: true });

  // Keep tracking internal navigation even on pages where the intro is skipped.
  if (skipIntro) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const particlePositions = [
    [12,24,3,"#e5c37b"],[20,70,2,"#a9dff0"],[29,16,2,"#ffffff"],[36,83,3,"#e5c37b"],
    [43,25,2,"#a9dff0"],[54,13,3,"#ffffff"],[62,76,2,"#e5c37b"],[70,28,3,"#a9dff0"],
    [78,57,2,"#ffffff"],[87,20,3,"#e5c37b"],[92,76,2,"#a9dff0"],[7,52,2,"#ffffff"],
    [17,87,3,"#e5c37b"],[32,42,2,"#ffffff"],[67,43,2,"#e5c37b"],[84,88,3,"#a9dff0"],
    [47,91,2,"#ffffff"],[58,7,2,"#e5c37b"],[4,9,2,"#a9dff0"],[96,40,2,"#ffffff"]
  ];

  const particles = particlePositions.map(([x,y,size,color],index) =>
    '<i class="cinema-particle" style="--px:' + x + '%;--py:' + y +
    '%;--ps:' + size + 'px;--pc:' + color + ';--delay:' + ((index % 7) * -.63) +
    's;--pd:' + (3.8 + (index % 4) * .45) + 's;--drift:' + (index % 2 ? "-22px" : "24px") +
    '" aria-hidden="true"></i>'
  ).join("");

  const markup = `
    <section class="cinema-intro" id="cinematicIntro" role="dialog" aria-modal="true" aria-label="Hamad Town School cinematic welcome">
      <div class="cinema-letterbox cinema-letterbox-top"></div>
      <div class="cinema-letterbox cinema-letterbox-bottom"></div>
      <div class="cinema-frame" aria-hidden="true">
        <i class="cinema-frame-corner cinema-frame-corner-one"></i>
        <i class="cinema-frame-corner cinema-frame-corner-two"></i>
        <i class="cinema-frame-corner cinema-frame-corner-three"></i>
        <i class="cinema-frame-corner cinema-frame-corner-four"></i>
        <span class="cinema-frame-topline"></span>
      </div>
      <div class="cinema-topline" aria-hidden="true">
        <span class="cinema-topline-mark">HT</span>
        <span class="cinema-topline-copy" data-cinema="topline">A SCHOOL OF POSSIBILITY</span>
        <span class="cinema-topline-index">01 <i></i> 01</span>
      </div>
      <div class="cinema-atmosphere" aria-hidden="true">
        <span class="cinema-shooting-star cinema-shooting-star-one"></span>
        <span class="cinema-shooting-star cinema-shooting-star-two"></span>
        <span class="cinema-shooting-star cinema-shooting-star-three"></span>
      </div>
      <div class="cinema-aperture" aria-hidden="true">
        <span class="cinema-aperture-ring cinema-aperture-ring-one"></span>
        <span class="cinema-aperture-ring cinema-aperture-ring-two"></span>
        <span class="cinema-aperture-core"></span>
      </div>
      <div class="cinema-stars" aria-hidden="true"></div>
      <div class="cinema-aurora cinema-aurora-blue" aria-hidden="true"></div>
      <div class="cinema-aurora cinema-aurora-gold" aria-hidden="true"></div>
      <div class="cinema-light-beam" aria-hidden="true"></div>
      <div class="cinema-light-beam cinema-light-beam-secondary" aria-hidden="true"></div>
      <div class="cinema-orbit cinema-orbit-one" aria-hidden="true"></div>
      <div class="cinema-orbit cinema-orbit-two" aria-hidden="true"></div>
      <div class="cinema-orbit cinema-orbit-three" aria-hidden="true"></div>
      <div class="cinema-particles" aria-hidden="true">${particles}</div>
      <div class="cinema-content">
        <p class="cinema-eyebrow" data-cinema="eyebrow">A PLACE TO LEARN · A FUTURE TO SHAPE</p>
        <div class="cinema-emblem-stage">
          <span class="cinema-stage-ring cinema-stage-ring-outer" aria-hidden="true"></span>
          <span class="cinema-stage-ring cinema-stage-ring-inner" aria-hidden="true"></span>
          <span class="cinema-stage-crosshair" aria-hidden="true"></span>
          <span class="cinema-emblem-halo" aria-hidden="true"></span>
          <span class="cinema-emblem-light" aria-hidden="true"></span>
          <span class="cinema-logo-floor" aria-hidden="true"></span>
          <img class="cinema-emblem" src="assets/hamad-town-logo.svg" alt="Hamad Town School emblem" fetchpriority="high">
          <span class="cinema-emblem-sweep" aria-hidden="true"></span>
          <span class="cinema-logo-glint" aria-hidden="true"></span>
        </div>
        <div class="cinema-title-wrap">
          <span class="cinema-school-label" data-cinema="schoolLabel">HAMAD TOWN SCHOOL</span>
          <h1 class="cinema-school-name" data-cinema="schoolName">HAMAD TOWN</h1>
          <div class="cinema-title-rule" aria-hidden="true"></div>
          <p class="cinema-tagline" data-cinema="tagline">Grow together. Dream beyond.</p>
          <div class="cinema-values" data-cinema="values">LEARN · LEAD · SHINE</div>
        </div>
        <div class="cinema-ornament" aria-hidden="true"><i></i><span></span><span></span><span></span><i></i></div>
      </div>
      <div class="cinema-controls">
        <button class="cinema-sound-button" id="cinemaSoundButton" type="button">
          <span class="cinema-sound-icon" aria-hidden="true">♫</span>
          <span data-cinema="soundLabel">Play cinematic sound</span>
        </button>
        <button class="cinema-skip-button" id="cinemaSkipButton" type="button" data-cinema="skipLabel">Skip intro</button>
      </div>
      <div class="cinema-progress" aria-hidden="true"></div>
    </section>
  `;

  document.body.insertAdjacentHTML("afterbegin", markup);
  document.body.classList.add("cinema-intro-active");

  const intro = document.getElementById("cinematicIntro");
  const soundButton = document.getElementById("cinemaSoundButton");
  const skipButton = document.getElementById("cinemaSkipButton");
  let audioContext = null;
  let masterGain = null;
  let soundStarted = false;
  let finished = false;
  let finishTimer = null;

  function isEnglish() {
    return document.documentElement.lang === "en";
  }

  function updateCopy() {
    const en = isEnglish();
    const copy = {
      eyebrow: en ? "A PLACE TO LEARN · A FUTURE TO SHAPE" : "هنا يبدأ التعلّم · وهنا يُصنع المستقبل",
      topline: en ? "A SCHOOL OF POSSIBILITY" : "مدرسة تصنع الإمكانات",
      schoolLabel: en ? "HAMAD TOWN SCHOOL" : "مدرسة مدينة حمد",
      schoolName: en ? "HAMAD TOWN" : "مدينة حمد",
      tagline: en ? "Grow together. Dream beyond." : "ننمو معًا… ونحلم بلا حدود.",
      values: en ? "LEARN · LEAD · SHINE" : "نتعلّم · نقود · نتألّق",
      soundLabel: soundStarted
        ? (en ? "Cinematic music is playing" : "الموسيقى السينمائية تعمل")
        : (en ? "Play cinematic sound" : "تشغيل الموسيقى السينمائية"),
      skipLabel: en ? "Skip intro" : "تخطي المقدمة"
    };
    Object.entries(copy).forEach(([key,value]) => {
      const node = intro.querySelector('[data-cinema="' + key + '"]');
      if (node) node.textContent = value;
    });
    soundButton.setAttribute("aria-label", copy.soundLabel);
    skipButton.setAttribute("aria-label", copy.skipLabel);
    const emblem = intro.querySelector(".cinema-emblem");
    if (emblem) emblem.alt = en ? "Hamad Town School emblem" : "شعار مدرسة مدينة حمد";
    intro.setAttribute("aria-label", en ? "Hamad Town School cinematic welcome" : "المقدمة السينمائية لمدرسة مدينة حمد");
  }

  function midiFrequency(note) {
    return 440 * Math.pow(2,(note - 69) / 12);
  }

  function createReverb(context) {
    const length = Math.floor(context.sampleRate * 1.65);
    const impulse = context.createBuffer(2,length,context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length,3.2);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    const convolver = context.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  function playScore() {
    if (soundStarted || finished) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      soundButton.querySelector("[data-cinema='soundLabel']").textContent =
        isEnglish() ? "Audio is not supported here" : "الصوت غير مدعوم في هذا المتصفح";
      return;
    }

    try {
      audioContext = new AudioContextClass();
      const context = audioContext;
      const now = context.currentTime;
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18,now);
      compressor.knee.setValueAtTime(18,now);
      compressor.ratio.setValueAtTime(3.2,now);
      compressor.attack.setValueAtTime(.012,now);
      compressor.release.setValueAtTime(.28,now);

      masterGain = context.createGain();
      masterGain.gain.setValueAtTime(.0001,now);
      masterGain.gain.exponentialRampToValueAtTime(.48,now + 1.25);
      masterGain.connect(compressor);
      compressor.connect(context.destination);

      const dry = context.createGain();
      dry.gain.setValueAtTime(.84,now);
      const wet = context.createGain();
      wet.gain.setValueAtTime(.24,now);
      const reverb = createReverb(context);
      dry.connect(masterGain);
      reverb.connect(wet);
      wet.connect(masterGain);

      function route(node) {
        node.connect(dry);
        node.connect(reverb);
      }

      function voice(note,start,duration,options = {}) {
        const osc = context.createOscillator();
        const amp = context.createGain();
        const filter = context.createBiquadFilter();
        const peak = options.volume ?? .035;
        const attack = options.attack ?? .28;
        const release = options.release ?? .45;
        const end = start + duration;
        osc.type = options.wave ?? "sine";
        osc.frequency.setValueAtTime(midiFrequency(note),start);
        if (options.detune) osc.detune.setValueAtTime(options.detune,start);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(options.cutoff ?? 5200,start);
        filter.Q.setValueAtTime(.65,start);
        amp.gain.setValueAtTime(.0001,start);
        amp.gain.exponentialRampToValueAtTime(peak,start + attack);
        amp.gain.setValueAtTime(peak,end - release);
        amp.gain.exponentialRampToValueAtTime(.0001,end);
        osc.connect(filter);
        filter.connect(amp);
        route(amp);
        osc.start(start);
        osc.stop(end + .04);
      }

      function impact(start,volume = .12) {
        const osc = context.createOscillator();
        const amp = context.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(94,start);
        osc.frequency.exponentialRampToValueAtTime(39,start + .42);
        amp.gain.setValueAtTime(.0001,start);
        amp.gain.exponentialRampToValueAtTime(volume,start + .025);
        amp.gain.exponentialRampToValueAtTime(.0001,start + .75);
        osc.connect(amp);
        route(amp);
        osc.start(start);
        osc.stop(start + .8);
      }

      // A warm low-register foundation gives the opening reveal more cinematic weight.
      voice(38,now + .08,3.7,{
        wave:"sine",volume:.082,attack:.8,release:1.25,cutoff:180
      });

      const chords = [
        {at:.1,notes:[50,57,62,66,69]},
        {at:2.05,notes:[47,54,59,62,66]},
        {at:4.0,notes:[43,50,55,59,62]},
        {at:5.95,notes:[45,52,57,61,64]}
      ];
      chords.forEach((chord,index) => {
        chord.notes.forEach((note,noteIndex) => {
          const start = now + chord.at + noteIndex * .105;
          voice(note,start,2.15,{
            wave:noteIndex % 2 ? "triangle" : "sine",
            volume:noteIndex === 0 ? .046 : .027,
            attack:.52,
            release:.55,
            cutoff:noteIndex > 2 ? 2800 : 1500
          });
          if (noteIndex === 0) {
            voice(note - 12,start,1.92,{volume:.068,attack:.3,release:.55,cutoff:460});
          }
        });
        impact(now + chord.at,.09 + index * .012);
      });

      const melody = [
        [74,.78],[78,1.27],[81,1.78],[86,2.46],
        [83,3.12],[81,3.61],[78,4.22],[74,4.78],
        [76,5.58],[81,6.2],[86,6.72],[90,7.24]
      ];
      melody.forEach(([note,at],index) => {
        voice(note,now + at,.88,{
          wave:"sine",
          volume:index > 9 ? .067 : .052,
          attack:.035,
          release:.64,
          cutoff:7200
        });
        if (index % 2 === 0) {
          voice(note - 12,now + at + .04,.78,{
            wave:"triangle",volume:.018,attack:.05,release:.58,cutoff:3100
          });
        }
      });

      const noiseLength = Math.floor(context.sampleRate * 2.6);
      const noiseBuffer = context.createBuffer(1,noiseLength,context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i=0;i<noiseLength;i++) noiseData[i] = (Math.random()*2-1) * (1-i/noiseLength);
      const noise = context.createBufferSource();
      const highpass = context.createBiquadFilter();
      const noiseGain = context.createGain();
      noise.buffer = noiseBuffer;
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(520,now);
      highpass.frequency.exponentialRampToValueAtTime(4800,now + 2.25);
      noiseGain.gain.setValueAtTime(.0001,now);
      noiseGain.gain.exponentialRampToValueAtTime(.038,now + 1.45);
      noiseGain.gain.exponentialRampToValueAtTime(.0001,now + 2.55);
      noise.connect(highpass);
      highpass.connect(noiseGain);
      route(noiseGain);
      noise.start(now + .05);
      noise.stop(now + 2.6);

      masterGain.gain.setValueAtTime(.48,now + 7.7);
      masterGain.gain.exponentialRampToValueAtTime(.0001,now + 9.05);
      soundStarted = true;
      soundButton.classList.add("is-playing");
      soundButton.querySelector(".cinema-sound-icon").textContent = "♫";
      updateCopy();
      context.resume().catch(() => {
        soundButton.classList.remove("is-playing");
        soundButton.querySelector("[data-cinema='soundLabel']").textContent =
          isEnglish() ? "Tap to enable sound" : "اضغط لتفعيل الصوت";
      });
      clearTimeout(finishTimer);
      finishTimer = window.setTimeout(finishIntro,9900);
    } catch (error) {
      console.warn("Cinematic intro audio could not start.",error);
      soundButton.querySelector("[data-cinema='soundLabel']").textContent =
        isEnglish() ? "Sound could not be started" : "تعذر تشغيل الصوت";
    }
  }

  function finishIntro() {
    if (finished) return;
    finished = true;
    clearTimeout(finishTimer);
    if (masterGain && audioContext && audioContext.state !== "closed") {
      const now = audioContext.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value,.0001),now);
      masterGain.gain.exponentialRampToValueAtTime(.0001,now + .38);
      window.setTimeout(() => audioContext?.close().catch(() => {}),520);
    }
    intro.classList.add("is-exiting");
    document.body.classList.remove("cinema-intro-active");
    document.removeEventListener("keydown",onIntroKeydown,true);
    window.setTimeout(() => intro.remove(),1100);
  }

  function onIntroKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      finishIntro();
    }
  }

  soundButton.addEventListener("click",playScore);
  skipButton.addEventListener("click",finishIntro);
  document.addEventListener("keydown",onIntroKeydown,true);
  window.addEventListener("hamad-language-change",updateCopy);
  updateCopy();

  finishTimer = window.setTimeout(finishIntro,reduceMotion ? 2300 : 9600);
})();
