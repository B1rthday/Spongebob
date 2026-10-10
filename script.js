(() => {
  "use strict";

  /* ---------- Constants ---------- */
  const TRANSITION_LOCK_MS = 380;
  const PAW_STEP_MS = 90;
  const PAW_TRAIL_COUNT = 8;
  const MAX_FLOAT_PAWS = 14;
  const ENDING_DELAY_MS = 2000;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PAW_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<ellipse cx="12" cy="15.5" rx="5.2" ry="4.6"/>' +
    '<circle cx="5.4" cy="9.8" r="2.2"/>' +
    '<circle cx="9.6" cy="5.2" r="2.2"/>' +
    '<circle cx="14.4" cy="5.2" r="2.2"/>' +
    '<circle cx="18.6" cy="9.8" r="2.2"/>' +
    "</svg>";

  const ANIMALS = {
    cat: {
      name: "Cat",
      line: "Professional nap expert. Zero responsibilities, maximum cozy.",
      svg:
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<path d="M92 84 Q112 70 104 52" fill="none" stroke="#d9a977" stroke-width="7" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="86" rx="34" ry="24" fill="#e8c39a"/>' +
        '<polygon points="38,40 42,14 58,30" fill="#e8c39a"/>' +
        '<polygon points="82,40 78,14 62,30" fill="#e8c39a"/>' +
        '<polygon points="42,36 44,22 52,31" fill="#f1c9c4"/>' +
        '<polygon points="78,36 76,22 68,31" fill="#f1c9c4"/>' +
        '<circle cx="60" cy="52" r="24" fill="#e8c39a"/>' +
        '<path d="M44 46 Q48 42 52 46" fill="none" stroke="#4a3f3a" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M68 46 Q72 42 76 46" fill="none" stroke="#4a3f3a" stroke-width="2.4" stroke-linecap="round"/>' +
        '<polygon points="57,56 63,56 60,60" fill="#c9776f"/>' +
        '<path d="M60 60 Q57 64 53 62 M60 60 Q63 64 67 62" fill="none" stroke="#4a3f3a" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path d="M32 54 L16 50 M32 60 L15 62 M88 54 L104 50 M88 60 L105 62" stroke="#b58a5e" stroke-width="1.2"/>' +
        "</svg>",
    },
    bunny: {
      name: "Bunny",
      line: "Tiny ears, enormous amounts of cuteness.",
      svg:
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<ellipse cx="46" cy="28" rx="8" ry="22" fill="#f4f0ea"/>' +
        '<ellipse cx="74" cy="28" rx="8" ry="22" fill="#f4f0ea"/>' +
        '<ellipse cx="46" cy="30" rx="4" ry="15" fill="#f1c9c4"/>' +
        '<ellipse cx="74" cy="30" rx="4" ry="15" fill="#f1c9c4"/>' +
        '<ellipse cx="60" cy="92" rx="30" ry="20" fill="#f4f0ea"/>' +
        '<circle cx="60" cy="64" r="24" fill="#f4f0ea"/>' +
        '<circle cx="51" cy="62" r="2.6" fill="#4a3f3a"/>' +
        '<circle cx="69" cy="62" r="2.6" fill="#4a3f3a"/>' +
        '<ellipse cx="60" cy="70" rx="3" ry="2.2" fill="#e09a94"/>' +
        '<circle cx="44" cy="72" r="4" fill="#f1c9c4" opacity="0.7"/>' +
        '<circle cx="76" cy="72" r="4" fill="#f1c9c4" opacity="0.7"/>' +
        "</svg>",
    },
    puppy: {
      name: "Puppy",
      line: "A walking bundle of happiness, and very proud of it.",
      svg:
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<ellipse cx="60" cy="94" rx="30" ry="18" fill="#d9b48a"/>' +
        '<ellipse cx="36" cy="60" rx="11" ry="20" fill="#b98a5c" transform="rotate(12 36 60)"/>' +
        '<ellipse cx="84" cy="60" rx="11" ry="20" fill="#b98a5c" transform="rotate(-12 84 60)"/>' +
        '<circle cx="60" cy="56" r="27" fill="#d9b48a"/>' +
        '<ellipse cx="60" cy="72" rx="13" ry="9" fill="#f5e6d3"/>' +
        '<circle cx="60" cy="68" r="4" fill="#4a3f3a"/>' +
        '<circle cx="50" cy="52" r="3" fill="#4a3f3a"/>' +
        '<circle cx="70" cy="52" r="3" fill="#4a3f3a"/>' +
        '<path d="M56 78 Q60 82 64 78" fill="none" stroke="#4a3f3a" stroke-width="1.6" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="84" rx="4" ry="2.5" fill="#e09a94" opacity="0.8"/>' +
        "</svg>",
    },
    fox: {
      name: "Fox",
      line: "Clever, a little mischievous, and probably up to something.",
      svg:
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<path d="M100 90 Q116 72 98 58 Q90 78 78 86 Z" fill="#e07a4f"/>' +
        '<ellipse cx="60" cy="92" rx="28" ry="18" fill="#e07a4f"/>' +
        '<polygon points="36,48 40,14 60,38" fill="#e07a4f"/>' +
        '<polygon points="84,48 80,14 60,38" fill="#e07a4f"/>' +
        '<polygon points="40,40 41,26 52,38" fill="#4a3f3a"/>' +
        '<polygon points="80,40 79,26 68,38" fill="#4a3f3a"/>' +
        '<path d="M34 50 Q60 36 86 50 Q80 84 60 90 Q40 84 34 50 Z" fill="#e07a4f"/>' +
        '<path d="M50 70 Q60 96 70 70 Q60 80 50 70 Z" fill="#fffaf3"/>' +
        '<circle cx="48" cy="56" r="3" fill="#4a3f3a"/>' +
        '<circle cx="72" cy="56" r="3" fill="#4a3f3a"/>' +
        '<circle cx="60" cy="72" r="3" fill="#4a3f3a"/>' +
        "</svg>",
    },
    goat: {
      name: "Goat",
      line: "BAAA-day legend detected.",
      svg:
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<ellipse cx="60" cy="94" rx="30" ry="19" fill="#efe6d8"/>' +
        '<path d="M46 40 Q40 22 46 12" fill="none" stroke="#c9b48f" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M74 40 Q80 22 74 12" fill="none" stroke="#c9b48f" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="34" cy="48" rx="9" ry="5" fill="#d9c7a8" transform="rotate(-25 34 48)"/>' +
        '<ellipse cx="86" cy="48" rx="9" ry="5" fill="#d9c7a8" transform="rotate(25 86 48)"/>' +
        '<ellipse cx="60" cy="52" rx="22" ry="24" fill="#efe6d8"/>' +
        '<circle cx="51" cy="48" r="2.6" fill="#4a3f3a"/>' +
        '<circle cx="69" cy="48" r="2.6" fill="#4a3f3a"/>' +
        '<path d="M56 60 Q60 64 64 60" fill="none" stroke="#4a3f3a" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path d="M60 74 L58 84 L62 84 Z" fill="#c9b48f"/>' +
        '<ellipse cx="60" cy="62" rx="4" ry="3" fill="#e09a94" opacity="0.6"/>' +
        "</svg>",
    },
  };

  /* ---------- Elements ---------- */
  const scenes = {};
  document.querySelectorAll("[data-scene]").forEach((el) => {
    scenes[el.dataset.scene] = el;
  });

  const pawLayer = document.getElementById("paw-layer");
  const stage = document.getElementById("stage");
  const artEl = document.getElementById("animal-art");
  const nameEl = document.getElementById("animal-name");
  const lineEl = document.getElementById("animal-line");
  const norwayFig = document.getElementById("norway");
  const norwayImg = document.getElementById("norway-img");
  const oneMoreBtn = document.getElementById("one-more-btn");
  const oneMoreText = document.getElementById("one-more-text");
  const video = document.getElementById("birthday-video");
  const videoSource = video.querySelector("source");
  const videoPlaceholder = document.getElementById("video-placeholder");
  const videoContinue = document.getElementById("video-continue");
  const videoSkip = document.getElementById("video-skip");
  const envelope = document.querySelector(".envelope");
  const letter = document.getElementById("letter");
  const envelopeLabel = document.querySelector(".envelope-label");

  /* ---------- State ---------- */
  let current = "a";
  let transitionLock = false;
  let transitionTimer = null;
  let trailBusy = false;
  let trailTimers = [];
  let endingTimer = null;
  let videoFailed = false;

  /* ---------- Scene transitions ---------- */
  function showScene(key) {
    const prev = scenes[current];
    const next = scenes[key];
    if (!next || next === prev) return;

    if (current === "f") {
      pauseVideo();
      clearTimeout(endingTimer);
    }

    if (prev) {
      prev.classList.remove("is-active");
      prev.hidden = true;
    }

    current = key;
    next.hidden = false;
    void next.offsetWidth; // restart the enter animation
    next.classList.add("is-active");

    const heading = next.querySelector("h1, h2");
    if (heading) heading.focus({ preventScroll: true });
    if (!reduceMotion) window.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo(0, 0);
  }

  function goTo(key) {
    if (transitionLock || key === current) return;
    transitionLock = true;
    showScene(key);
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      transitionLock = false;
    }, TRANSITION_LOCK_MS);
  }

  /* ---------- Paw effects ---------- */
  function makePaw(extraClass) {
    const paw = document.createElement("span");
    paw.className = extraClass;
    paw.innerHTML = PAW_SVG;
    return paw;
  }

  function pawTrail(onDone) {
    if (reduceMotion) {
      onDone();
      return;
    }
    trailBusy = true;
    for (let i = 0; i < PAW_TRAIL_COUNT; i++) {
      const timer = setTimeout(() => {
        const side = i % 2 === 0 ? "left" : "right";
        const paw = makePaw("paw " + side);
        // Walk diagonally from lower-left toward the center of the screen.
        paw.style.left = 8 + i * 9 + "%";
        paw.style.top = 78 - i * 5 + "%";
        pawLayer.appendChild(paw);
        setTimeout(() => paw.remove(), 2600);
      }, i * PAW_STEP_MS);
      trailTimers.push(timer);
    }
    const doneTimer = setTimeout(() => {
      trailBusy = false;
      onDone();
    }, PAW_TRAIL_COUNT * PAW_STEP_MS + 260);
    trailTimers.push(doneTimer);
  }

  function floatPaws() {
    if (reduceMotion) return;
    const existing = stage.querySelectorAll(".float-paw");
    if (existing.length > MAX_FLOAT_PAWS) {
      existing[0].remove();
    }
    for (let i = 0; i < 3; i++) {
      const paw = makePaw("float-paw");
      paw.style.left = 30 + Math.random() * 40 + "%";
      paw.style.bottom = "20%";
      paw.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      paw.style.setProperty("--rot", (Math.random() * 40 - 20) + "deg");
      stage.appendChild(paw);
      paw.addEventListener("animationend", () => paw.remove(), { once: true });
    }
  }

  /* ---------- Animal garden ---------- */
  function selectAnimal(key) {
    const animal = ANIMALS[key];
    if (!animal) return;

    artEl.innerHTML = animal.svg;
    nameEl.textContent = animal.name;
    lineEl.textContent = animal.line;

    document.querySelectorAll("[data-animal]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.animal === key));
    });

    artEl.classList.remove("bounce");
    void artEl.offsetWidth;
    if (!reduceMotion) artEl.classList.add("bounce");

    floatPaws();
  }

  function renderZoo() {
    document.querySelectorAll(".zoo-art[data-svg]").forEach((slot) => {
      const animal = ANIMALS[slot.dataset.svg];
      if (animal) slot.innerHTML = animal.svg;
    });
  }

  function resetZoo() {
    artEl.innerHTML = "";
    artEl.classList.remove("bounce");
    nameEl.textContent = "Pick a friend";
    lineEl.textContent = "Every visitor here has a little personality. Let's see yours.";
    document.querySelectorAll("[data-animal]").forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
    });
    stage.querySelectorAll(".float-paw").forEach((p) => p.remove());
  }

  // The Norway photo is optional: it only appears if the file really exists.
  norwayImg.addEventListener("load", () => {
    norwayFig.hidden = false;
  });
  norwayImg.addEventListener("error", () => {
    norwayFig.hidden = true;
  });

  /* ---------- Video ---------- */
  function pauseVideo() {
    if (!video.paused) video.pause();
  }

  function showVideoFallback() {
    if (videoFailed) return;
    videoFailed = true;
    video.hidden = true;
    videoPlaceholder.hidden = false;
    videoSkip.hidden = false;
  }

  videoSource.addEventListener("error", showVideoFallback);
  video.addEventListener("error", showVideoFallback);

  video.addEventListener("ended", () => {
    videoContinue.hidden = false;
    clearTimeout(endingTimer);
    endingTimer = setTimeout(() => {
      if (current === "f") goTo("g");
    }, ENDING_DELAY_MS);
  });

  /* ---------- Envelope & reveals ---------- */
  function toggleEnvelope() {
    const open = envelope.getAttribute("aria-expanded") === "true";
    envelope.setAttribute("aria-expanded", String(!open));
    letter.hidden = open;
    envelopeLabel.textContent = open ? "Tap to open" : "Tap to close";
  }

  function revealWish(btn) {
    if (btn.getAttribute("aria-expanded") === "true") return;
    btn.setAttribute("aria-expanded", "true");
    btn.querySelector(".wish-hint").hidden = true;
    btn.querySelector(".wish-text").hidden = false;
  }

  function revealOneMore() {
    oneMoreText.hidden = false;
    oneMoreBtn.hidden = true;
  }

  /* ---------- Reset ---------- */
  function resetAll() {
    // Cancel anything still pending so no stale timers fire after reset.
    trailTimers.forEach(clearTimeout);
    trailTimers = [];
    clearTimeout(transitionTimer);
    clearTimeout(endingTimer);
    transitionLock = false;
    trailBusy = false;

    pawLayer.innerHTML = "";
    pauseVideo();
    try {
      video.currentTime = 0;
    } catch (e) {
      /* metadata may not be loaded yet; ignore */
    }
    videoContinue.hidden = true;

    resetZoo();

    oneMoreText.hidden = true;
    oneMoreBtn.hidden = false;

    letter.hidden = true;
    envelope.setAttribute("aria-expanded", "false");
    envelopeLabel.textContent = "Tap to open";

    document.querySelectorAll(".wish").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      btn.querySelector(".wish-hint").hidden = false;
      btn.querySelector(".wish-text").hidden = true;
    });

    // Return to scene A without the lock so reset always works.
    const prev = scenes[current];
    if (prev) {
      prev.classList.remove("is-active");
      prev.hidden = true;
    }
    current = "a";
    scenes.a.hidden = false;
    void scenes.a.offsetWidth;
    scenes.a.classList.add("is-active");
    window.scrollTo(0, 0);
    scenes.a.querySelector("h1").focus({ preventScroll: true });
  }

  /* ---------- Event handling (single delegated listener) ---------- */
  function handleAction(action, el) {
    switch (action) {
      case "open-surprise":
        if (trailBusy || transitionLock) return;
        el.disabled = true;
        pawTrail(() => {
          el.disabled = false;
          goTo("b");
        });
        break;

      case "go-c": goTo("c"); break;
      case "go-d": goTo("d"); break;
      case "go-e": goTo("e"); break;
      case "go-f": goTo("f"); break;
      case "go-g": goTo("g"); break;

      case "one-more": revealOneMore(); break;
      case "toggle-envelope": toggleEnvelope(); break;
      case "reveal-wish": revealWish(el); break;
      case "reset": resetAll(); break;
    }
  }

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action], [data-animal]");
    if (!el) return;

    if (el.dataset.animal) {
      selectAnimal(el.dataset.animal);
      return;
    }
    handleAction(el.dataset.action, el);
  });

  /* ---------- Init ---------- */
  renderZoo();
  scenes.a.querySelector("h1").focus({ preventScroll: true });
})();
