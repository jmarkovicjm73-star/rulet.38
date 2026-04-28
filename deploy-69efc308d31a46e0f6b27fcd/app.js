const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

// ===== TRANSLATIONS =====
const translations = {
  en: {
    playerDefault: (i) => `Player ${i + 1}`,
    startGame: 'Start Game',
    gameRules: 'How to Play',
    hybridGame: 'Hybrid Game',
    hybridDesc: 'A combination of classic card game with a digital revolver',
    forPlayers: 'For 2-6 players',
    forPlayersDesc: 'Perfect for groups of friends',
    fastAndExciting: 'Fast & Exciting',
    fastDesc: 'Each round lasts only a few minutes',
    clickRules: 'Click "How to Play" for detailed instructions',
    rulesPlayers: '2–6 players sitting around a tablet',
    rulesCards: 'The deck contains 8 cards of each suit and 2 jokers. Each player receives 5 cards after the deck is shuffled.',
    rulesTok: 'The game is played in rounds. The system randomly selects which player starts and draws a leading card. Play goes clockwise. Each player places at least 1 card face down on the table and declares which card they are playing — they may bluff.',
    rulesCheck: "The next player decides whether to trust the previous player or not. If they trust, they play their cards. If not, they reveal the previous player's cards. If the cards match the leading card (joker counts as any card), the doubting player loses the round. If the cards were false, the one who played them loses.",
    rulesRevolver: 'The loser presses their name and uses the revolver — Click (safe, game continues) or Bang (player is eliminated).',
    rulesNewRound: 'The next round starts from the loser — if eliminated, from the next player clockwise.',
    rulesWin: 'The last surviving player wins.',
    setupTitle: 'Set Up Game',
    setupSubtitle: 'Configuration for a new game',
    numPlayers: 'Number of Players',
    players: (n) => `${n} players`,
    settings: 'Settings',
    lives: (n) => `${n} lives`,
    sound: (on) => `Sound ${on ? 'ON' : 'OFF'}`,
    playerNames: 'Player Names',
    playerLabel: (i) => `Player ${i + 1}`,
    playerPlaceholder: 'Enter name',
    back: '← Back',
    startBtn: 'Start Game',
    round: (n) => `Round ${n}`,
    backToMenu: '← Back to Menu',
    drawCard: 'Draw Card',
    spinning: 'SPINNING...',
    winner: (name) => `🏆 ${name}`,
    eliminated: (name) => `${name} is eliminated`,
    subtitle: 'Hybrid Card Game',
    loading: 'Loading revolver...',
  },
  sr: {
    playerDefault: (i) => `Igrač ${i + 1}`,
    startGame: 'Pokreni igru',
    gameRules: 'Pravila igre',
    hybridGame: 'Hibridna igra',
    hybridDesc: 'Kombinacija klasičnog kartanja sa digitalnim revolverom',
    forPlayers: 'Za 2-6 igrača',
    forPlayersDesc: 'Idealna za grupe prijatelja',
    fastAndExciting: 'Brzo i uzbudljivo',
    fastDesc: 'Svaka runda traje samo nekoliko minuta',
    clickRules: 'Kliknite na "Pravila igre" za detaljne upute',
    rulesPlayers: '2–6 igrača u krugu oko tableta',
    rulesCards: 'Špil sadrži od svake vrste po 8 karata i 2 džokera. Svaki igrač dobija 5 karata nakon što se špil promiješa.',
    rulesTok: 'Igra se odvija u rundama. Sistem nasumično bira koji igrač počinje i izvlači vodeću kartu. Igra se u smjeru kazaljke na satu. Svaki igrač baca najmanje 1 kartu licem prema dolje na sto i izjavljuje koju kartu igra — može blefirati.',
    rulesCheck: 'Sljedeći igrač odlučuje da li vjeruje prethodnom igraču ili ne. Ako vjeruje, igra svoje karte. Ako ne vjeruje, otkriva karte prethodnog igrača. Ako su karte iste kao vodeća karta (džoker vrijedi kao bilo koja karta), igrač koji nije vjerovao gubi rundu. Ako su karte bile lažne, gubi onaj ko ih je bacio.',
    rulesRevolver: 'Gubitnik pritiska svoje ime i koristi revolver — Click (siguran, igra se nastavlja) ili Bang (igrač ispada).',
    rulesNewRound: 'Runda počinje od gubitnika — ako je ispao, od sljedećeg igrača u smjeru kazaljke na satu.',
    rulesWin: 'Posljednji preživjeli igrač pobjeđuje.',
    setupTitle: 'Pripremi igru',
    setupSubtitle: 'Konfiguracija za novu partiju',
    numPlayers: 'Broj igrača',
    players: (n) => `${n} igrača`,
    settings: 'Postavke',
    lives: (n) => `${n} života`,
    sound: (on) => `Zvuk ${on ? 'ON' : 'OFF'}`,
    playerNames: 'Imena igrača',
    playerLabel: (i) => `Igrač ${i + 1}`,
    playerPlaceholder: 'Unesi ime',
    back: '← Nazad',
    startBtn: 'Pokreni igru',
    round: (n) => `Runda ${n}`,
    backToMenu: '← Nazad na meni',
    drawCard: 'Vuci kartu',
    spinning: 'SPINNING...',
    winner: (name) => `🏆 ${name}`,
    eliminated: (name) => `${name} je eliminisan`,
    subtitle: 'Hibridna društvena igra',
    loading: 'Revolver se učitava...',
  }
};

function t(key, ...args) {
  const lang = state ? state.language : 'en';
  const val = translations[lang][key];
  return typeof val === 'function' ? val(...args) : val;
}

// ===== DECK =====
const TOTAL_CARDS = 16;
let cardDeck = [];

function buildShuffledDeck() {
  const deck = [];
  for (let i = 1; i <= TOTAL_CARDS; i++) deck.push(i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawNextCard() {
  if (cardDeck.length === 0) cardDeck = buildShuffledDeck();
  return cardDeck.pop();
}

// ===== STATE =====
let state = {
  screen: 'landing',
  language: 'en',
  playerCount: MIN_PLAYERS,
  playerNames: Array.from({ length: MAX_PLAYERS }, (_, i) => `Player ${i + 1}`),
  infoPanel: null,
  pendingBangReveal: false,
  drawnCard: null,
  cardVisible: false,
  settings: { soundEnabled: true, startingLives: 6 },
  players: [],
  activeShotPlayerId: null,
  chamberCount: 6,
  bulletIndices: [],
  currentSpin: null,
  lastResult: null,
  spinning: false,
  roundNumber: 1,
  winnerId: null
};

const app = document.getElementById('app');

// ===== PRELOADER — runs exactly once =====
let assetsPreloaded = false;

function showLoadingScreen() {
  const loadText = state.language === 'sr' ? translations.sr.loading : translations.en.loading;
  app.innerHTML = `
    <div id="loading-screen">
      <img src="./pictures/Logo.png" alt="rulet.38" id="loading-logo" />
      <div id="loading-bar-wrap">
        <div id="loading-bar"></div>
      </div>
      <div id="loading-text">${loadText}</div>
    </div>
  `;
}

function preloadAssets() {
  showLoadingScreen();
  const images = [
    './pictures/Logo.png',
    './pictures/Revolver.png',
    './pictures/Tot.png',
    './pictures/Karte_Back.png',
    ...Array.from({ length: 16 }, (_, i) => `./pictures/karte_${i + 1}.png`)
  ];
  const sounds = [
    './sound/spin.mp3',
    './sound/click.mp3',
    './sound/shot.mp3',
    './sound/card.mp3',
    './sound/card_close.mp3'
  ];
  const total = images.length + sounds.length;
  let loaded = 0;

  function onProgress() {
    loaded++;
    const pct = Math.round((loaded / total) * 100);
    const bar = document.getElementById('loading-bar');
    if (bar) bar.style.width = pct + '%';
    if (loaded >= total) {
      setTimeout(() => {
        const screen = document.getElementById('loading-screen');
        if (screen) {
          screen.style.opacity = '0';
          screen.style.transition = 'opacity 0.5s ease';
          setTimeout(() => render(), 500);
        }
      }, 300);
    }
  }

  images.forEach(src => {
    const img = new Image();
    img.onload = onProgress;
    img.onerror = onProgress;
    img.src = src;
  });

  sounds.forEach(src => {
    const audio = new Audio();
    audio.oncanplaythrough = onProgress;
    audio.onerror = onProgress;
    audio.preload = 'auto';
    audio.src = src;
  });
}

// ===== SOUND =====
const soundFx = {
  spin: new Audio('./sound/spin.mp3'),
  click: new Audio('./sound/click.mp3'),
  bang: new Audio('./sound/shot.mp3'),
  card: new Audio('./sound/card.mp3'),
  cardClose: new Audio('./sound/card_close.mp3')
};
Object.values(soundFx).forEach(a => { a.preload = 'auto'; });
soundFx.spin.volume = 0.65;
soundFx.click.volume = 0.85;
soundFx.bang.volume = 1.0;
soundFx.card.volume = 0.8;
soundFx.cardClose.volume = 0.8;

function playAudioSafe(audio) {
  if (!audio) return;
  try { audio.pause(); audio.currentTime = 0; const p = audio.play(); if (p && p.catch) p.catch(() => {}); } catch(e) {}
}
function playSpinSound() { playAudioSafe(soundFx.spin); }
function playClickSound() { playAudioSafe(soundFx.click); }
function playBangSound() { playAudioSafe(soundFx.bang); }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function renderLifeFraction(p) { return `(${p.lives}/${p.maxLives})`; }

// ===== LANGUAGE =====
function setLanguage(lang) {
  state.language = lang;
  state.playerNames = Array.from({ length: MAX_PLAYERS }, (_, i) => translations[lang].playerDefault(i));
  render();
}

function renderLanguageDropdown() {
  return `
    <div class="lang-dropdown-wrap">
      <select class="lang-dropdown" onchange="setLanguage(this.value)">
        <option value="en" ${state.language === 'en' ? 'selected' : ''}>english</option>
        <option value="sr" ${state.language === 'sr' ? 'selected' : ''}>srpski</option>
      </select>
    </div>`;
}

// ===== HELPERS =====
function getConfiguredPlayers() {
  return state.playerNames.slice(0, state.playerCount).map((name, i) => {
    const trimmed = String(name || '').trim();
    return trimmed || t('playerDefault', i);
  });
}
function canStartGame() { return getConfiguredPlayers().every(Boolean); }
function getAlivePlayers() { return state.players.filter(p => p.alive); }
function setScreen(screen) { state.screen = screen; render(); }
function setInfoPanel(panel) { state.infoPanel = state.infoPanel === panel ? null : panel; render(); }
function setPlayerCount(count) { state.playerCount = count; render(); }
function setPlayerName(index, value) { state.playerNames[index] = value; }
function setStartingLives(lives) { state.settings.startingLives = lives; render(); }
function toggleSound() { state.settings.soundEnabled = !state.settings.soundEnabled; render(); }

function escapeHtml(text) {
  return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

// ===== CARD OVERLAY =====
function toggleCardOverlay() {
  const existing = document.getElementById('card-overlay-root');
  if (existing) {
    existing.remove();
    state.cardVisible = false;
    state.drawnCard = null;
    if (state.settings.soundEnabled) playAudioSafe(soundFx.cardClose);
    return;
  }
  state.drawnCard = drawNextCard();
  state.cardVisible = true;
  if (state.settings.soundEnabled) playAudioSafe(soundFx.card);

  const overlay = document.createElement('div');
  overlay.id = 'card-overlay-root';
  overlay.className = 'card-overlay';
  overlay.onclick = toggleCardOverlay;
  overlay.innerHTML = `
    <div class="card-overlay-inner">
      <img src="./pictures/karte_${state.drawnCard}.png"
           alt="Card ${state.drawnCard}"
           class="card-overlay-img"
           onerror="this.src='./pictures/karte_${state.drawnCard}';this.onerror=null;" />
    </div>`;
  document.getElementById('overlay-portal').appendChild(overlay);
}

// ===== GAME LOGIC =====
function backToMenu() {
  state.screen = 'landing';
  state.spinning = false;
  state.activeShotPlayerId = null;
  state.pendingBangReveal = false;
  state.drawnCard = null;
  state.cardVisible = false;
  const existing = document.getElementById('card-overlay-root');
  if (existing) existing.remove();
  render();
}

function generateBulletIndices() {
  const indices = [];
  while (indices.length < 1) {
    const value = randomInt(0, state.chamberCount - 1);
    if (!indices.includes(value)) indices.push(value);
  }
  state.bulletIndices = indices;
}

function startLoadedGame() {
  if (!canStartGame()) return;
  state.players = getConfiguredPlayers().map((name, i) => ({
    id: i + 1, name,
    lives: state.settings.startingLives,
    maxLives: state.settings.startingLives,
    alive: true
  }));
  state.activeShotPlayerId = null;
  state.currentSpin = null;
  state.lastResult = null;
  state.spinning = false;
  state.roundNumber = 1;
  state.winnerId = null;
  state.pendingBangReveal = false;
  state.drawnCard = null;
  state.cardVisible = false;
  cardDeck = buildShuffledDeck();
  generateBulletIndices();
  setScreen('game');
  startIntroSpin();
}

function startIntroSpin() {
  state.spinning = true;
  state.activeShotPlayerId = 'intro';
  state.lastResult = null;
  state.pendingBangReveal = false;
  if (state.settings.soundEnabled) playSpinSound();
  render();
  setTimeout(() => { state.spinning = false; state.activeShotPlayerId = null; render(); }, 2000);
}

function triggerPlayerShot(playerId) {
  if (state.spinning || state.winnerId) return;
  const selectedPlayer = state.players.find(p => p.id === playerId);
  if (!selectedPlayer || !selectedPlayer.alive) return;
  state.activeShotPlayerId = playerId;
  state.lastResult = null;
  state.pendingBangReveal = false;
  state.spinning = true;
  if (state.settings.soundEnabled) playSpinSound();
  render();

  setTimeout(() => {
    state.currentSpin = randomInt(0, state.chamberCount - 1);
    const hit = state.bulletIndices.includes(state.currentSpin);

    const finalizeResult = (resultHit, cause = 'bullet') => {
      state.pendingBangReveal = false;
      state.lastResult = {
        hit: resultHit, cause,
        playerId: selectedPlayer.id,
        loserName: selectedPlayer.name,
        chamber: state.currentSpin + 1,
        bulletChambers: state.bulletIndices.map(i => i + 1),
        remainingLives: selectedPlayer.lives,
        maxLives: selectedPlayer.maxLives,
        eliminated: !selectedPlayer.alive
      };
      const alivePlayers = getAlivePlayers();
      if (alivePlayers.length === 1) {
        state.winnerId = alivePlayers[0].id;
      } else {
        state.roundNumber += 1;
      }
      state.activeShotPlayerId = null;
      generateBulletIndices();
      state.spinning = false;
      render();
      if (!state.winnerId) {
        setTimeout(() => { state.lastResult = null; render(); }, resultHit ? 4000 : 3000);
      }
    };

    const revealBang = (cause = 'bullet') => {
      state.pendingBangReveal = true;
      if (state.settings.soundEnabled) playBangSound();
      render();
      setTimeout(() => { selectedPlayer.lives = 0; selectedPlayer.alive = false; finalizeResult(true, cause); }, 2000);
    };

    if (hit) { revealBang('bullet'); return; }

    setTimeout(() => {
      selectedPlayer.lives = Math.max(0, selectedPlayer.lives - 1);
      if (selectedPlayer.lives === 0) selectedPlayer.alive = false;
      if (!selectedPlayer.alive) { revealBang('attrition'); return; }
      if (state.settings.soundEnabled) playClickSound();
      finalizeResult(false, 'safe');
    }, 500);
  }, 1400);
}

// ===== RENDER LANDING =====
function renderLanding() {
  return `
    <div class="shell">
      <div class="landing-topbar">
        <div class="landing-brand">rulet<span class="title-accent">.38</span></div>
        ${renderLanguageDropdown()}
      </div>
      <div class="landing-container">
        <div class="landing-left">
          <div style="text-align: center; margin-bottom: 40px;">
            <img src="./pictures/Logo.png" alt="rulet.38 Logo" style="width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
            <div class="logo-badge" style="justify-content: center; margin-bottom: 16px;">${t('subtitle')}</div>
          </div>
          <div class="cta-buttons">
            <button class="btn-primary" onclick="setScreen('setup')">${t('startGame')}</button>
            <button class="btn-secondary" onclick="setInfoPanel('rules')">${t('gameRules')}</button>
          </div>
        </div>
        <div class="landing-right">
          <div class="info-section">
            <div class="info-title">${t('gameRules')}</div>
            <div class="info-content">
              ${state.infoPanel === 'rules' ? `
                <p><strong>${state.language === 'en' ? 'Players' : 'Igrači'}:</strong> ${t('rulesPlayers')}</p>
                <p><strong>${state.language === 'en' ? 'Cards' : 'Karte'}:</strong> ${t('rulesCards')}</p>
                <p><strong>${state.language === 'en' ? 'Gameplay' : 'Tok'}:</strong> ${t('rulesTok')}</p>
                <p><strong>${state.language === 'en' ? 'Challenge' : 'Provjera'}:</strong> ${t('rulesCheck')}</p>
                <p><strong>Revolver:</strong> ${t('rulesRevolver')}</p>
                <p><strong>${state.language === 'en' ? 'New Round' : 'Nova runda'}:</strong> ${t('rulesNewRound')}</p>
                <p><strong>${state.language === 'en' ? 'Winner' : 'Pobjeđuje'}:</strong> ${t('rulesWin')}</p>
              ` : `
                <p><strong>${t('hybridGame')}:</strong> ${t('hybridDesc')}</p>
                <p><strong>${t('forPlayers')}:</strong> ${t('forPlayersDesc')}</p>
                <p><strong>${t('fastAndExciting')}:</strong> ${t('fastDesc')}</p>
                <p>${t('clickRules')}</p>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ===== RENDER SETUP =====
function renderSetup() {
  let playerButtons = '';
  for (let count = MIN_PLAYERS; count <= MAX_PLAYERS; count++) {
    playerButtons += `<button class="option-btn ${state.playerCount === count ? 'active' : ''}" onclick="setPlayerCount(${count})">${t('players', count)}</button>`;
  }
  let nameInputs = '';
  for (let i = 0; i < state.playerCount; i++) {
    nameInputs += `
      <div class="input-group">
        <label class="input-label">${t('playerLabel', i)}</label>
        <input type="text" value="${escapeHtml(state.playerNames[i] || '')}"
          placeholder="${t('playerPlaceholder')}" oninput="setPlayerName(${i}, this.value)" />
      </div>`;
  }
  return `
    <div class="shell">
      <div class="setup-container">
        <div class="setup-header">
          <h2 class="setup-title">${t('setupTitle')}</h2>
          <p class="setup-subtitle">${t('setupSubtitle')}</p>
        </div>
        <div class="setup-section">
          <div class="section-header">
            <div class="section-number">1</div>
            <div class="section-title">${t('numPlayers')}</div>
          </div>
          <div class="option-grid">${playerButtons}</div>
        </div>
        <div class="setup-section">
          <div class="section-header">
            <div class="section-number">2</div>
            <div class="section-title">${t('settings')}</div>
          </div>
          <div class="option-grid">
            <button class="option-btn ${state.settings.startingLives === 4 ? 'active' : ''}" onclick="setStartingLives(4)">${t('lives', 4)}</button>
            <button class="option-btn ${state.settings.startingLives === 5 ? 'active' : ''}" onclick="setStartingLives(5)">${t('lives', 5)}</button>
            <button class="option-btn ${state.settings.startingLives === 6 ? 'active' : ''}" onclick="setStartingLives(6)">${t('lives', 6)}</button>
            <button class="option-btn ${state.settings.soundEnabled ? 'active' : ''}" onclick="toggleSound()">${t('sound', state.settings.soundEnabled)}</button>
          </div>
        </div>
        <div class="setup-section">
          <div class="section-header">
            <div class="section-number">3</div>
            <div class="section-title">${t('playerNames')}</div>
          </div>
          ${nameInputs}
        </div>
        <div class="setup-actions">
          <button class="btn-secondary" onclick="setScreen('landing')">${t('back')}</button>
          <button class="btn-primary" onclick="startLoadedGame()" ${canStartGame() ? '' : 'disabled'}>${t('startBtn')}</button>
        </div>
      </div>
    </div>`;
}

// ===== RENDER GAME =====
function renderGame() {
  const winner = state.winnerId ? state.players.find(p => p.id === state.winnerId) : null;

  let centerHtml = `<div class="center-status">${t('drawCard')}</div>`;
  if (state.pendingBangReveal) {
    centerHtml = `<div class="center-status">click...</div>`;
  } else if (state.spinning && state.activeShotPlayerId) {
    centerHtml = `<div class="center-status revolver-spin">${t('spinning')}</div>`;
  } else if (state.lastResult) {
    centerHtml = state.lastResult.hit
      ? `<div class="center-status" style="color:#ff6b6b;">💥 BANG</div>`
      : `<div class="center-status">click...</div>`;
  }
  if (winner) {
    centerHtml = `<div class="center-status" style="color:#ffd700;">${t('winner', escapeHtml(winner.name))}</div>`;
  }

  const highlightedPlayerId = state.spinning ? state.activeShotPlayerId : state.lastResult ? state.lastResult.playerId : null;
  const spinningPlayerId = state.spinning ? state.activeShotPlayerId : null;

  return `
    <div class="game-container">
      <div class="game-header">
        <div class="game-title">rulet<span class="title-accent">.38</span></div>
        <div class="game-round">${t('round', state.roundNumber)}</div>
      </div>
      <div class="game-content">
        ${renderPlayerRing(state.players, centerHtml, highlightedPlayerId, spinningPlayerId)}
      </div>
      <div class="game-footer">
        <button class="menu-button" onclick="backToMenu()">${t('backToMenu')}</button>
      </div>
    </div>`;
}

// ===== RENDER PLAYER RING =====
function renderPlayerRing(players, centerHtml, activeId = null, spinningId = null) {
  if (!players.length) return '';
  const slots = players.map((player, index) => {
    const angle = (index / players.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 45;
    const top = 50 + radius * Math.sin(angle);
    const left = 50 + radius * Math.cos(angle);
    const angleDeg = angle * (180 / Math.PI) + 90;
    const isActive = activeId === player.id;
    const isSpinning = spinningId === player.id || spinningId === 'intro';
    const gunElement = player.alive
      ? `<button onclick="triggerPlayerShot(${player.id})"
           class="radial-gun ${isSpinning ? 'spin-gun' : ''} ${isActive ? 'gun-active' : ''}"
           ${state.spinning || state.winnerId ? 'disabled' : ''}>
           <img src="./pictures/Revolver.png" alt="Revolver" />
         </button>`
      : `<div class="radial-gun gun-dead">
           <img src="./pictures/Tot.png" alt="${escapeHtml(player.name)}" />
         </div>`;
    return `
      <div class="player-slot" style="top:${top}%; left:${left}%;">
        <div style="transform: rotate(${angleDeg}deg); display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <div class="radial-name ${!player.alive ? 'dead' : ''}">${escapeHtml(player.name)}</div>
          ${gunElement}
          <div class="player-lives">${renderLifeFraction(player)}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="ring-wrap">
      <div class="ring-dashed"></div>
      <div class="ring-center">
        ${centerHtml}
        <button class="center-card-btn" onclick="toggleCardOverlay()"></button>
      </div>
      ${slots}
    </div>`;
}

// ===== RENDER =====
function render() {
  if (state.screen === 'landing') { app.innerHTML = renderLanding(); return; }
  if (state.screen === 'setup') { app.innerHTML = renderSetup(); return; }
  if (state.screen === 'game') { app.innerHTML = renderGame(); }
}

// ===== BOOT — preload once, then render =====
preloadAssets();