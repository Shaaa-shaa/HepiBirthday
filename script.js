/* =========================================================
   LETTERS BETWEEN THE CLOUDS — script.js
   ========================================================= */

/* ---------------------------------------------------------
   1. SCENE MANAGER
   --------------------------------------------------------- */
const SCENE_ORDER = [
  "scene-landing","scene-letter1","scene-letter2","scene-letter3",
  "scene-letter4","scene-letter5","scene-letter6","scene-letter7","scene-final"
];

const cloudTransition = document.getElementById("cloudTransition");
const ctText = document.getElementById("ctText");

function goToScene(targetId, transitionText){
  const current = document.querySelector(".scene.active");
  cloudTransition.classList.add("active");
  ctText.textContent = transitionText || "Drifting to the next cloud…";

  setTimeout(() => {
    if(current) current.classList.remove("active");
    const target = document.getElementById(targetId);
    if(target) target.classList.add("active");
    window.scrollTo({top:0, behavior:"instant"});
  }, 650);

  setTimeout(() => {
    cloudTransition.classList.remove("active");
    onSceneEnter(targetId);
  }, 1500);
}

/* Wire up every [data-next] button */
document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => {
    if(btn.disabled) return;
    goToScene(btn.getAttribute("data-next"));
  });
});

/* Landing: open envelope then transition */
const landingEnvelope = document.getElementById("landingEnvelope");
const openFirstLetterBtn = document.getElementById("openFirstLetterBtn");
openFirstLetterBtn.addEventListener("click", () => {
  landingEnvelope.classList.add("open");
  launchConfetti();
  openFirstLetterBtn.disabled = true;
  setTimeout(() => goToScene("scene-letter1", "Opening your first letter…"), 1300);
});

/* Sky mood + special behaviour per scene */
function onSceneEnter(sceneId){
  switch(sceneId){
    case "scene-letter5":
      document.body.setAttribute("data-sky","calm");
      break;
    case "scene-letter7":
      document.body.setAttribute("data-sky","calm");
      break;
    case "scene-final":
      document.body.setAttribute("data-sky","sunset");
      break;
    default:
      if(document.body.getAttribute("data-sky") !== "night"){
        document.body.setAttribute("data-sky","day");
      }
  }
}

/* ---------------------------------------------------------
   2. LIVING SKY BACKGROUND
   --------------------------------------------------------- */
const cloudsLayer = document.getElementById("cloudsLayer");
const birdsLayer = document.getElementById("birdsLayer");
const planesLayer = document.getElementById("planesLayer");
const balloonsLayer = document.getElementById("balloonsLayer");
const sparklesLayer = document.getElementById("sparklesLayer");
const starsLayer = document.getElementById("stars");

let clickedCloudsCount = 0;
let cloudSeq = 0;

function spawnCloud(){
  const cloud = document.createElement("div");
  cloud.className = "cloud";
  const w = 80 + Math.random()*140;
  const h = w * 0.45;
  cloud.style.width = w+"px";
  cloud.style.height = h+"px";
  cloud.style.top = (5 + Math.random()*55) + "%";
  cloud.style.left = "-220px";
  cloud.style.opacity = 0.55 + Math.random()*0.4;
  const dur = 40 + Math.random()*40;
  cloud.style.transition = `left ${dur}s linear`;
  cloud.dataset.id = "c" + (cloudSeq++);
  cloudsLayer.appendChild(cloud);

  requestAnimationFrame(() => {
    cloud.style.left = "110vw";
  });

  cloud.addEventListener("click", (e) => {
    e.stopPropagation();
    handleCloudClick(cloud);
  });

  setTimeout(() => cloud.remove(), dur*1000 + 500);
}

function handleCloudClick(cloud){
  if(cloud.dataset.clicked) return;
  cloud.dataset.clicked = "1";
  clickedCloudsCount++;
  spawnSparkleBurst(cloud);
  if(clickedCloudsCount === 5){
    rainHearts();
    showEggToast("Blue hearts rain down for you. 🩵");
    clickedCloudsCount = 0;
  }
}

function spawnSparkleBurst(el){
  const rect = el.getBoundingClientRect();
  for(let i=0;i<6;i++){
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = (rect.left + rect.width/2 + (Math.random()*40-20)) + "px";
    s.style.top = (rect.top + rect.height/2 + (Math.random()*30-15)) + "px";
    s.style.position = "fixed";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2500);
  }
}

function rainHearts(){
  for(let i=0;i<40;i++){
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "heart-drop";
      h.textContent = "🩵";
      h.style.left = Math.random()*100 + "vw";
      h.style.fontSize = (1 + Math.random()*1.2) + "rem";
      h.style.animationDuration = (3 + Math.random()*3) + "s";
      document.getElementById("heartsLayer").appendChild(h);
      setTimeout(() => h.remove(), 7000);
    }, i*60);
  }
}

function spawnBird(){
  const bird = document.createElement("div");
  bird.className = "bird";
  bird.textContent = "🐦";
  bird.style.top = (10 + Math.random()*30) + "%";
  const dur = 14 + Math.random()*10;
  bird.style.animationDuration = dur+"s";
  birdsLayer.appendChild(bird);
  setTimeout(() => bird.remove(), dur*1000);
}

function spawnPlane(){
  const plane = document.createElement("div");
  plane.className = "plane";
  plane.textContent = "✈️";
  plane.style.top = (15 + Math.random()*50) + "%";
  const dur = 16 + Math.random()*8;
  plane.style.animationDuration = dur+"s";
  planesLayer.appendChild(plane);

  plane.addEventListener("click", (e) => {
    e.stopPropagation();
    showEggToast("Thank you for choosing me every day. 🩵");
    plane.remove();
  });

  setTimeout(() => plane.remove(), dur*1000);
}

function spawnBalloon(){
  const b = document.createElement("div");
  b.className = "balloon";
  b.textContent = ["🎈","🎈","🩵"][Math.floor(Math.random()*3)];
  b.style.left = (5 + Math.random()*90) + "%";
  const dur = 10 + Math.random()*8;
  b.style.animationDuration = dur+"s";
  balloonsLayer.appendChild(b);
  setTimeout(() => b.remove(), dur*1000);
}

function spawnSparkleAmbient(){
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = Math.random()*100 + "vw";
  s.style.top = Math.random()*100 + "vh";
  s.style.animationDuration = (2+Math.random()*2)+"s";
  sparklesLayer.appendChild(s);
  setTimeout(() => s.remove(), 4500);
}

function buildStars(){
  for(let i=0;i<70;i++){
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random()*100 + "vw";
    s.style.top = Math.random()*70 + "vh";
    s.style.animationDelay = (Math.random()*3)+"s";
    starsLayer.appendChild(s);
  }
}
buildStars();

/* Ambient loops */
setInterval(spawnCloud, 4200);
setInterval(spawnBird, 9000);
setInterval(spawnPlane, 11000);
setInterval(spawnSparkleAmbient, 900);
for(let i=0;i<4;i++) setTimeout(spawnCloud, i*900);

/* Balloons float away only during the final ending */
let balloonInterval = null;
function startBalloons(){
  if(balloonInterval) return;
  balloonInterval = setInterval(spawnBalloon, 900);
  for(let i=0;i<5;i++) setTimeout(spawnBalloon, i*300);
}

/* ---------------------------------------------------------
   3. MOON EASTER EGG
   --------------------------------------------------------- */
document.getElementById("moon").addEventListener("click", () => {
  showEggToast("The moon is beautiful tonight… just like this moment. 🌙");
});

/* ---------------------------------------------------------
   4. EGG TOAST HELPER
   --------------------------------------------------------- */
let toastTimer;
function showEggToast(msg){
  const toast = document.getElementById("eggToast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------------------------------------------------------
   5. IDLE BIRD EASTER EGG
   --------------------------------------------------------- */
let idleTimer;
const idleBird = document.getElementById("idleBird");
function resetIdleTimer(){
  idleBird.classList.remove("show");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    idleBird.classList.add("show");
  }, 10000);
}
["mousemove","keydown","click","touchstart","scroll"].forEach(evt =>
  window.addEventListener(evt, resetIdleTimer, {passive:true})
);
resetIdleTimer();

/* ---------------------------------------------------------
   6. CONFETTI + FIREWORKS (canvas)
   --------------------------------------------------------- */
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksCtx = fireworksCanvas.getContext("2d");

function resizeCanvases(){
  [confettiCanvas, fireworksCanvas].forEach(c => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
}
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

const confettiColors = ["#82CFFF","#FFEBAA","#FFFFFF","#5DB8FF","#B9E0FF"];

function launchConfetti(){
  const pieces = [];
  const count = 90;
  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random()*confettiCanvas.width,
      y: -20 - Math.random()*100,
      w: 6+Math.random()*6,
      h: 8+Math.random()*8,
      color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
      speedY: 2+Math.random()*3,
      speedX: (Math.random()-0.5)*2,
      rot: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*8
    });
  }
  let frames = 0;
  const maxFrames = 220;
  function animate(){
    confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    pieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot*Math.PI/180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      confettiCtx.restore();
    });
    frames++;
    if(frames < maxFrames){
      requestAnimationFrame(animate);
    } else {
      confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    }
  }
  animate();
}

function launchFireworks(){
  const bursts = [];
  const burstCount = 5;
  for(let i=0;i<burstCount;i++){
    setTimeout(() => createBurst(), i*350);
  }
  function createBurst(){
    const cx = fireworksCanvas.width*(0.2+Math.random()*0.6);
    const cy = fireworksCanvas.height*(0.2+Math.random()*0.4);
    const color = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    const particles = [];
    const n = 40;
    for(let i=0;i<n;i++){
      const angle = (Math.PI*2*i)/n;
      const speed = 2+Math.random()*3;
      particles.push({
        x:cx, y:cy,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60+Math.random()*20
      });
    }
    bursts.push({particles, color, age:0});
  }
  let frame = 0;
  function animate(){
    fireworksCtx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    bursts.forEach(b => {
      b.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.life -= 1;
        if(p.life > 0){
          fireworksCtx.globalAlpha = Math.max(p.life/80, 0);
          fireworksCtx.fillStyle = b.color;
          fireworksCtx.beginPath();
          fireworksCtx.arc(p.x, p.y, 2.4, 0, Math.PI*2);
          fireworksCtx.fill();
        }
      });
    });
    fireworksCtx.globalAlpha = 1;
    frame++;
    if(frame < 140){
      requestAnimationFrame(animate);
    } else {
      fireworksCtx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    }
  }
  animate();
}

/* ---------------------------------------------------------
   7. LETTER 2 — MEMORY ENVELOPES
   --------------------------------------------------------- */
const memories = [
  {
    title:"Our First Meeting",
    text:`It all began somewhere I never expected: a temple.<br/><br/>
    Out of all the places in the world, that’s where our paths first crossed. At that moment, neither of us knew that a simple meeting would slowly become one of the most meaningful chapters of our lives.<br/><br/>
    Looking back now, it’s funny how life quietly introduces people into our lives before we even realize how important they’ll become.<br/><br/>
    And honestly… if I could relive that day, I’d still choose it, knowing it would lead me to you.`
  },
  {
    title:"The Tuition Staircase",
    text:`I don’t think anyone else would understand why a simple staircase means so much to me.<br/><br/>
    We used to arrive 30 minutes early just to spend time together before tuition started.<br/>
    That staircase became our little world.<br/><br/>
    We talked about everything and nothing at the same time.<br/>
    Those weren’t just tuition days… they were our quiet little dates.<br/><br/>
    And somehow, the simplest place became one of my favourite places in the world.`
  },
  {
    title:"The First Hug",
    text:`It happened inside a parked car.<br/>
    Nothing planned. Nothing special on the outside.<br/><br/>
    But when you hugged me so tightly, everything inside me felt calm.<br/>
    Safe. Protected. At home.<br/><br/>
    Even now, your hugs still feel like that.<br/>
    And every time we’re apart, I find myself missing that feeling more than I can explain.`
  },
  {
    title:"Our Movie Dates",
    text:`You always think I’m not paying attention during movies.<br/>
    But the truth is… I’m usually paying more attention to you.<br/><br/>
    I notice your small gestures, the way you hold my hand, your reactions, your quiet moments.<br/>
    Most of the movie becomes background noise.<br/><br/>
    Because sitting next to you is always the best part.`
  }
];

const memoryModal = document.getElementById("memoryModal");
const memoryTitle = document.getElementById("memoryTitle");
const memoryText = document.getElementById("memoryText");
const memoryCloseBtn = document.getElementById("memoryCloseBtn");
const letter2ContinueBtn = document.getElementById("letter2ContinueBtn");
let openedMemories = new Set();

document.querySelectorAll(".mini-envelope").forEach(env => {
  env.addEventListener("click", () => {
    const idx = env.dataset.memory;
    memoryTitle.textContent = memories[idx].title;
    memoryText.innerHTML = memories[idx].text;
    memoryModal.classList.add("show");
    memoryModal.dataset.current = idx;
  });
});

memoryCloseBtn.addEventListener("click", () => {
  const idx = memoryModal.dataset.current;
  const env = document.querySelector(`.mini-envelope[data-memory="${idx}"]`);
  if(env){ env.classList.add("opened"); }
  openedMemories.add(idx);
  memoryModal.classList.remove("show");
  if(openedMemories.size === memories.length){
    letter2ContinueBtn.disabled = false;
  }
});

/* ---------------------------------------------------------
   8. LETTER 3 — STICKY NOTES
   --------------------------------------------------------- */
const stickyNotes = document.querySelectorAll(".sticky-note");
const stickyReveal = document.getElementById("stickyReveal");
const letter3ContinueBtn = document.getElementById("letter3ContinueBtn");
let openedStickies = new Set();

stickyNotes.forEach(note => {
  note.addEventListener("click", () => {
    note.classList.add("flipped");
    openedStickies.add(note.dataset.note);
    if(openedStickies.size === stickyNotes.length){
      stickyReveal.classList.add("show");
      letter3ContinueBtn.disabled = false;
      showEggToast("Every wish I make somehow leads back to you. 🩵");
    }
  });
});

/* ---------------------------------------------------------
   9. LETTER 6 — POSTCARDS
   --------------------------------------------------------- */
document.querySelectorAll(".postcard").forEach(pc => {
  pc.addEventListener("click", () => pc.classList.toggle("flipped"));
});

/* ---------------------------------------------------------
   10. LETTER 7 — CAKE / CANDLES
   --------------------------------------------------------- */
const blowCandlesBtn = document.getElementById("blowCandlesBtn");
const candles = document.getElementById("candles");
blowCandlesBtn.addEventListener("click", () => {
  candles.classList.add("blown");
  launchConfetti();
  launchFireworks();
  blowCandlesBtn.disabled = true;
  document.body.setAttribute("data-sky","sunset");
  setTimeout(() => goToScene("scene-final", "The sky begins to change…"), 2600);
});

/* ---------------------------------------------------------
   11. FINAL LETTER — envelope, wax seal, typewriter
   --------------------------------------------------------- */
const finalEnvelope = document.getElementById("finalEnvelope");
const finalEnvelopeWrap = document.getElementById("finalEnvelopeWrap");
const finalPaper = document.getElementById("finalPaper");
const finalTypewriterEl = document.getElementById("finalTypewriter");
const teddyEnding = document.getElementById("teddyEnding");

const finalLetterText =
`Happy Birthday, my bebiiboyyy 🩵

Thank you for walking into my life and making ordinary moments feel extraordinary.

Thank you for every laugh, every hug, every conversation, every movie date and every little gesture that made me appreciate you a little more each day.

I hope this year brings you everything you’ve been working so hard for.
I hope you always find reasons to smile.
I hope life is gentle with you.
I hope you never forget how deeply loved you are.

No matter where life takes us…
One thing will always stay the same.
I’ll always be cheering for you.

Happy Birthday, my favourite person. 🩵`;

finalEnvelope.addEventListener("click", () => {
  if(finalEnvelope.classList.contains("open")) return;
  finalEnvelope.classList.add("open");
  finalEnvelopeWrap.classList.add("open");
  setTimeout(() => {
    finalEnvelopeWrap.classList.add("hide");
    finalPaper.classList.add("show");
    startTypewriter();
  }, 1100);
});

function startTypewriter(){
  let i = 0;
  finalTypewriterEl.textContent = "";
  function type(){
    if(i <= finalLetterText.length){
      finalTypewriterEl.textContent = finalLetterText.slice(0, i);
      i++;
      setTimeout(type, 22);
    } else {
      onFinalLetterComplete();
    }
  }
  type();
}

function onFinalLetterComplete(){
  document.body.setAttribute("data-sky","night");
  startBalloons();
  setTimeout(() => {
    teddyEnding.classList.add("show");
  }, 1200);
}

document.getElementById("readAgainBtn").addEventListener("click", () => {
  cloudTransition.classList.add("active");
  ctText.textContent = "Returning to the sky…";
  setTimeout(() => {
    location.reload();
  }, 1400);
});

/* ---------------------------------------------------------
   12. MUSIC — local audio file (En-Jeevan.mp3)
   --------------------------------------------------------- */
const ourSong = document.getElementById("ourSong");
let musicPlaying = false;
let musicMuted = false;

const musicBackdrop = document.getElementById("musicBackdrop");
const musicController = document.getElementById("musicController");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");
const muteMusicBtn = document.getElementById("muteMusicBtn");

// Surface loading/decoding problems instead of failing silently
ourSong.addEventListener("error", () => {
  const err = ourSong.error;
  let reason = "Unknown error";
  if(err){
    switch(err.code){
      case err.MEDIA_ERR_SRC_NOT_SUPPORTED: reason = "File format not supported or file not found (check that En-Jeevan.mp3 sits in the same folder as index.html)"; break;
      case err.MEDIA_ERR_NETWORK: reason = "Network error while loading the file"; break;
      case err.MEDIA_ERR_DECODE: reason = "The file could not be decoded"; break;
      default: reason = "Playback error (code " + err.code + ")";
    }
  }
  showEggToast("🔇 Audio problem: " + reason);
  console.error("Audio error:", err);
});

function forceAudioAudible(){
  ourSong.muted = false;
  ourSong.volume = 1;
  musicMuted = false;
  muteMusicBtn.textContent = "🔊";
}

document.getElementById("playSongBtn").addEventListener("click", () => {
  musicBackdrop.classList.add("hidden");
  musicController.classList.add("show");
  forceAudioAudible();
  ourSong.currentTime = 0;
  const playPromise = ourSong.play();
  if(playPromise && playPromise.then){
    playPromise.then(() => {
      musicPlaying = true;
      toggleMusicBtn.textContent = "⏸";
    }).catch((err) => {
      musicPlaying = false;
      toggleMusicBtn.textContent = "▶";
      showEggToast("🔇 Couldn't autoplay — tap ▶ to start the song");
      console.error("Play blocked:", err);
    });
  }
});

document.getElementById("silenceBtn").addEventListener("click", () => {
  musicBackdrop.classList.add("hidden");
});

toggleMusicBtn.addEventListener("click", () => {
  forceAudioAudible();
  if(musicPlaying){
    ourSong.pause();
    toggleMusicBtn.textContent = "▶";
    musicPlaying = false;
  } else {
    ourSong.play().then(() => {
      toggleMusicBtn.textContent = "⏸";
      musicPlaying = true;
    }).catch((err) => {
      showEggToast("🔇 Playback blocked by the browser");
      console.error("Play blocked:", err);
    });
  }
});

muteMusicBtn.addEventListener("click", () => {
  musicMuted = !musicMuted;
  ourSong.muted = musicMuted;
  muteMusicBtn.textContent = musicMuted ? "🔈" : "🔊";
});

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
onSceneEnter("scene-landing");
