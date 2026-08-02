/* ---------- ambient particles ---------- */
  function spawnParticles(mood){
    const container = document.getElementById('particles');
    container.innerHTML = '';
    const sets = {
      default: ['✨','💫','🌙','⭐'],
      happy:   ['💖','💗','✨','🌸'],
      sad:     ['🌧️','💧'],
      cry:     ['💧','😢','🌧️'],
      shy:     ['🌸','💮','😳'],
      hearts:  ['💕','💖','✨','💍'],
      finale:  ['🎵','🎶','💕','✨']
    };
    const emojis = sets[mood] || sets.default;
    for(let i=0;i<20;i++){
      const span = document.createElement('span');
      span.className = 'p';
      span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      span.style.left = (Math.random()*100) + 'vw';
      span.style.fontSize = (16 + Math.random()*20) + 'px';
      span.style.animationDuration = (6 + Math.random()*8) + 's';
      span.style.animationDelay = (Math.random()*8) + 's';
      container.appendChild(span);
    }
  }
  spawnParticles('default');

  /* ---------- envelope opening ---------- */
  function openEnvelope(){
    const env = document.getElementById('envelope');
    env.classList.add('open');
    setTimeout(()=>{ goTo('stage-q1'); }, 1500);
  }

  /* ---------- questions ---------- */
  const noHints = [
    "Please... take a moment 🥺",
    "Are you sure? My heart says otherwise 💔",
    "I'll wait as long as it takes 🕯️",
    "Pretty please? 🥲"
  ];
  const noCounters = {1:0, 2:0, 3:0};

  function pressNo(n){
    document.getElementById('light-red-'+n).classList.add('lit');
    document.getElementById('light-green-'+n).classList.remove('lit');
    const face = document.getElementById('face-'+n);
    face.textContent = '😢';
    face.classList.remove('pop-sad'); void face.offsetWidth; face.classList.add('pop-sad');

    const stage = face.closest('.stage');
    stage.classList.remove('card-shake'); void stage.offsetWidth; stage.classList.add('card-shake');

    document.body.setAttribute('data-mood','sad');
    spawnParticles('sad');

    const hintEl = document.getElementById('hint-'+n);
    hintEl.textContent = noHints[Math.min(noCounters[n], noHints.length-1)];
    noCounters[n]++;
  }

  function pressYes(n, nextStageId, mood){
    document.getElementById('light-green-'+n).classList.add('lit');
    document.getElementById('light-red-'+n).classList.remove('lit');
    const face = document.getElementById('face-'+n);
    face.textContent = '🥰';
    face.classList.remove('pop-happy'); void face.offsetWidth; face.classList.add('pop-happy');
    document.getElementById('hint-'+n).textContent = "Yes! 💖";

    document.body.setAttribute('data-mood', mood);
    spawnParticles(mood);

    setTimeout(()=>{ goTo(nextStageId, mood); }, 1500);
  }

  function goTo(stageId, mood){
    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    document.getElementById(stageId).classList.add('active');
    if(mood){
      document.body.setAttribute('data-mood', mood);
      spawnParticles(mood);
    }
    if(stageId === 'stage-finale'){
      startSadMusic();
    }
  }

  /* ---------- calculator + jar (gated) ---------- */
  function calcLove(){
    const input = document.getElementById('loveInput');
    const val = parseFloat(input.value);
    const resultBox = document.getElementById('calc-result');
    const continueBtn = document.getElementById('continueBtn');
    const jarWrap = document.getElementById('jarWrap');
    const jarFill = document.getElementById('jarFill');
    const jarLabel = document.getElementById('jarLabel');

    if(isNaN(val)){
      resultBox.innerHTML = '<div class="result-msg">Type a number first 💭</div>';
      return;
    }

    let emoji, msg, mood, animClass;

    if(val < 50){
      emoji = '😢'; mood = 'cry'; animClass = 'shake-cry';
      msg = "Try again... let it grow a little more first 🌱";
      jarWrap.style.display = 'none';
      continueBtn.style.display = 'none';
    } else if(val < 90){
      emoji = '😳🌸'; mood = 'shy'; animClass = 'shy-wiggle';
      msg = "It's growing... a little more? 💗";
      jarWrap.style.display = 'flex';
      jarFill.style.height = '0%';
      void jarFill.offsetWidth;
      jarFill.style.height = '55%';
      jarLabel.textContent = 'still filling...';
      addJarBubbles(3);
      continueBtn.style.display = 'none'; // stays locked until 90-100000
    } else {
      emoji = '🥰💕'; mood = 'hearts'; animClass = 'hearts-pulse';
      msg = "That's what I'm talking about! Forever and always 💍✨";
      jarWrap.style.display = 'flex';
      jarFill.style.height = '0%';
      void jarFill.offsetWidth;
      jarFill.style.height = '100%';
      jarLabel.textContent = 'overflowing with love 💗';
      addJarBubbles(6);
      continueBtn.style.display = 'inline-block';
    }

    resultBox.innerHTML = `<div class="result-emoji ${animClass}">${emoji}</div><div class="result-msg">${msg}</div>`;
    document.body.setAttribute('data-mood', mood);
    spawnParticles(mood);
  }

  function addJarBubbles(count){
    const jar = document.getElementById('jar');
    jar.querySelectorAll('.jar-bubble').forEach(b => b.remove());
    for(let i=0;i<count;i++){
      const b = document.createElement('span');
      b.className = 'jar-bubble';
      b.textContent = '💗';
      b.style.left = (10 + Math.random()*55) + 'px';
      b.style.animationDelay = (Math.random()*2) + 's';
      jar.appendChild(b);
    }
  }

  /* ---------- sitting together: switch scene to sunny day + join her + swap to romantic tune ---------- */
  let sat = false;
  function sitTogether(){
    if(sat) return;
    sat = true;
    document.getElementById('natureScene').classList.add('day');
    document.getElementById('herPerson').classList.add('joined');
    document.getElementById('finaleCaption').textContent = "Together, forever. 💍☀️💕";
    document.getElementById('sitRow').style.display = 'none';
    document.body.setAttribute('data-mood','happy');
    spawnParticles('happy');
    startRomanticMusic();
  }

  /* ---------- procedurally generated music (not the copyrighted song) ----------
     A slow, melancholic solo-guitar-style tune plays as soon as the finale loads —
     representing him playing alone, still waiting for an answer. The moment she
     presses "Sit along with me", it swaps to a warmer, romantic duet tune. */
  let audioCtx = null;
  let musicPlaying = false;
  let musicTimer = null;
  let currentMode = null; // 'sad' | 'romantic'

  const sadLoop      = [196.00, 174.61, 155.56, 174.61, 196.00, 220.00, 196.00, 174.61]; // slow minor descent
  const romanticLoop = [196.00, 246.94, 293.66, 246.94, 220.00, 261.63, 329.63, 293.66]; // warm major arpeggio

  function ensureAudio(){
    if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if(audioCtx.state === 'suspended'){ audioCtx.resume(); }
  }

  function startSadMusic(){
    ensureAudio();
    currentMode = 'sad';
    stopMusic();
    playLoop(sadLoop, 1.9, 950, 2);
  }
  function startRomanticMusic(){
    ensureAudio();
    currentMode = 'romantic';
    stopMusic();
    playLoop(romanticLoop, 1.6, 800, 4);
  }
  function playLoop(loop, dur, interval, detuneAmt){
    musicPlaying = true;
    document.getElementById('musicBtn').textContent = '🔇 Pause music';
    let i = 0;
    (function step(){
      if(!musicPlaying) return;
      playNote(loop[i % loop.length], dur, detuneAmt);
      i++;
      musicTimer = setTimeout(step, interval);
    })();
  }
  function stopMusic(){
    musicPlaying = false;
    clearTimeout(musicTimer);
    const btn = document.getElementById('musicBtn');
    if(btn) btn.textContent = '🎵 Resume music';
  }
  function toggleMusic(){
    if(musicPlaying){
      stopMusic();
    } else {
      currentMode === 'romantic' ? startRomanticMusic() : startSadMusic();
    }
  }
  function playNote(freq, dur, detuneAmt){
    const t = audioCtx.currentTime;
    [0, detuneAmt].forEach(detune => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.1, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    });
  }