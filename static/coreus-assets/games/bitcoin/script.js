const funnyQuotes = [
  "To the moon! 🚀",
  "HODL! 💎🙌",
  "When Lambo? 🏎️",
  "Buy the dip! 📉",
  "Wen moon? 🌙",
  "Diamond hands! 💎",
  "NGMI 😔",
  "GLTA ✌️",
  "Bullish! 🐂",
  "Bearish! 🐻",
  "Elon said so! 👽",
  "Satoshi lives! 👻",
  "Number go up! 📈",
  "Trust the process! 🙏",
  "Apes together strong! 🦍",
  "Cope harder! 😤",
  "Seethe! 🔥",
  "Ratioed! 📊",
  "Based! ✅",
  "Cringe! 🤮"
];

const memes = [
  { name: "DOGE", desc: "Much wow, very coin", icon: "🐕", effect: "+69 BTC/sec" },
  { name: "Shiba Inu", desc: "Dogecoin killer", icon: "🐕‍🦺", effect: "+420 BTC/sec" },
  { name: "SafeMoon", desc: "I don't know what this is", icon: "🌙", effect: "+1337 BTC/sec" },
  { name: "Squid Game", desc: "Red light, green light", icon: "🎮", effect: "+666 BTC/sec" },
  { name: "Poopeye", desc: "I am the senate", icon: "🥬", effect: "+80085 BTC/sec" },
  { name: "Rocket", desc: "To the moon indeed", icon: "🚀", effect: "+69420 BTC/sec" },
  { name: "Plastic Coin", desc: "Very stable genius", icon: "💩", effect: "+1M BTC/sec" },
  { name: "Elon Mud", desc: "Elon please notice me", icon: "🧱", effect: "+2M BTC/sec" },
  { name: "Gigachad", desc: "Maximum power", icon: "💪", effect: "+10M BTC/sec" },
  { name: "Skull Oracle", desc: "Buy my course", icon: "💀", effect: "+69M BTC/sec" }
];

const achievements = [
  { id: 'click1', name: 'First Click!', desc: 'Click the mine button', icon: '👆', check: () => game.totalClicks >= 1 },
  { id: 'click100', name: 'Click Master', desc: 'Click 100 times', icon: '💪', check: () => game.totalClicks >= 100 },
  { id: 'click1000', name: 'Finger Warmer', desc: 'Click 1000 times', icon: '🔥', check: () => game.totalClicks >= 1000 },
  { id: 'btc1', name: 'Rich!', desc: 'Own 1 BTC', icon: '🤑', check: () => game.btc >= 1 },
  { id: 'btc100', name: 'Whale', desc: 'Own 100 BTC', icon: '🐋', check: () => game.btc >= 100 },
  { id: 'btc10000', name: 'Whale Investor', desc: 'Own 10,000 BTC', icon: '🌊', check: () => game.btc >= 10000 },
  { id: 'upg1', name: 'First Upgrade', desc: 'Buy your first upgrade', icon: '🛒', check: () => game.upgradesOwned >= 1 },
  { id: 'upg10', name: 'Shopaholic', desc: 'Buy 10 upgrades', icon: '🛍️', check: () => game.upgradesOwned >= 10 },
  { id: 'upg50', name: 'Capitalist', desc: 'Buy 50 upgrades', icon: '💰', check: () => game.upgradesOwned >= 50 },
  { id: 'prestige1', name: 'Fresh Start', desc: 'Prestige once', icon: '🌟', check: () => game.prestigeCount >= 1 },
  { id: 'meme', name: 'Meme Lord', desc: 'Buy a meme upgrade', icon: '😂', check: () => game.memeUpgradesBought >= 1 },
  { id: 'funny', name: 'HODL-er', desc: 'Play for 1 minute', icon: '⏰', check: () => game.timePlayed >= 60 },
  { id: 'farmer', name: 'Bitcoin Farmer', desc: 'Own 100 GPU Miners', icon: '🌾', check: () => getUpgradeOwned('GPU Miner') >= 100 },
  { id: 'quantum', name: 'Future Tech', desc: 'Buy a Quantum Chip', icon: '⚛️', check: () => getUpgradeOwned('Quantum Chip') >= 1 },
  { id: 'moon', name: 'To The Moon!', desc: 'Reach 100M BTC', icon: '🌙', check: () => game.btc >= 100000000 }
];

function getUpgradeOwned(name) {
  const upg = game.upgrades.find(u => u.name === name);
  return upg ? upg.owned : 0;
}

let game = {
  btc: 0,
  totalClicks: 0,
  upgradesOwned: 0,
  memeUpgradesBought: 0,
  prestigeCount: 0,
  prestigeMultiplier: 1,
  timePlayed: 0,
  btcPerClick: 1,
  unlocks: [],
  upgrades: [
    { name: "Better Mouse", desc: "+1 BTC/click", cost: 15, owned: 0, type: "click", value: 1, costScale: 1.5, icon: "🖱️" },
    { name: "GPU Miner", desc: "+1 BTC/sec", cost: 50, owned: 0, type: "auto", value: 1, costScale: 1.6, icon: "🎮" },
    { name: "ASIC Miner", desc: "+5 BTC/sec", cost: 250, owned: 0, type: "auto", value: 5, costScale: 1.65, icon: "🔲" },
    { name: "Mining Farm", desc: "+25 BTC/sec", cost: 1500, owned: 0, type: "auto", value: 25, costScale: 1.7, icon: "🏭" },
    { name: "Nuclear Plant", desc: "+100 BTC/sec", cost: 10000, owned: 0, type: "auto", value: 100, costScale: 1.75, icon: "⚛️" },
    { name: "Quantum Chip", desc: "+500 BTC/sec", cost: 50000, owned: 0, type: "auto", value: 500, costScale: 1.8, icon: "💻" },
    { name: "AI Farm", desc: "+2500 BTC/sec", cost: 300000, owned: 0, type: "auto", value: 2500, costScale: 1.85, icon: "🤖" },
    { name: "Space Station", desc: "+15000 BTC/sec", cost: 2000000, owned: 0, type: "auto", value: 15000, costScale: 1.9, icon: "🛸" },
    { name: "Dyson Sphere", desc: "+100000 BTC/sec", cost: 50000000, owned: 0, type: "auto", value: 100000, costScale: 1.95, icon: "☀️" },
    { name: "Time Machine", desc: "+1M BTC/sec", cost: 1000000000, owned: 0, type: "auto", value: 1000000, costScale: 2, icon: "⏰" },
    { name: "Multiverse Portal", desc: "+50M BTC/sec", cost: 50000000000, owned: 0, type: "auto", value: 50000000, costScale: 2.1, icon: "🌀" },
    { name: "Universe Farm", desc: "+1B BTC/sec", cost: 1000000000000, owned: 0, type: "auto", value: 1000000000, costScale: 2.2, icon: "🌌" },
    { name: "Famous Tweet", desc: "x2 all production", cost: 100000, owned: 0, type: "mult", value: 2, costScale: 2.5, icon: "🐦" },
    { name: "HODL Meme", desc: "x1.5 all production", cost: 1000000, owned: 0, type: "mult", value: 1.5, costScale: 3, icon: "💎" },
    { name: "Diamond Hands", desc: "x3 all production", cost: 50000000, owned: 0, type: "mult", value: 3, costScale: 3.5, icon: "💪" }
  ],
  memeUpgrades: [
    { name: "DOGE", desc: "Much wow, very coin", cost: 1000, owned: 0, type: "auto", value: 69, costScale: 1.8, icon: "🐕" },
    { name: "Shiba Inu", desc: "Dogecoin killer", cost: 5000, owned: 0, type: "auto", value: 420, costScale: 1.9, icon: "🐕‍🦺" },
    { name: "SafeMoon", desc: "I don't even know", cost: 25000, owned: 0, type: "auto", value: 1337, costScale: 2, icon: "🌙" },
    { name: "Squid Game", desc: "Red light, green light", cost: 100000, owned: 0, type: "auto", value: 666, costScale: 2.1, icon: "🎮" },
    { name: "Poopeye", desc: "I am the senate", cost: 500000, owned: 0, type: "auto", value: 80085, costScale: 2.2, icon: "🥬" },
    { name: "Rocket", desc: "To the moon indeed", cost: 2000000, owned: 0, type: "auto", value: 69420, costScale: 2.3, icon: "🚀" },
    { name: "Plastic Coin", desc: "Very stable genius", cost: 10000000, owned: 0, type: "auto", value: 1000000, costScale: 2.4, icon: "💩" },
    { name: "Chocolate Mud", desc: "How to become obese", cost: 50000000, owned: 0, type: "auto", value: 2000000, costScale: 2.5, icon: "🧱" },
    { name: "Gigachad", desc: "Maximum power", cost: 200000000, owned: 0, type: "auto", value: 10000000, costScale: 2.6, icon: "💪" },
    { name: "Skull Oracle", desc: "Buy my course", cost: 1000000000, owned: 0, type: "auto", value: 69000000, costScale: 2.7, icon: "💀" }
  ],
  btcPerSec: 0
};

const btcAmount = document.getElementById("btc-amount");
const btcPerClickElem = document.getElementById("btc-per-click");
const btcPerSecElem = document.getElementById("btc-per-sec");
const shopElem = document.getElementById("shop");
const clickBtn = document.getElementById("click-btn");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const resetBtn = document.getElementById("reset-btn");
const particlesContainer = document.getElementById("particles");
const achievementPopup = document.getElementById("achievement-popup");
const achievementCount = document.getElementById("achievement-count");
const achievementsList = document.getElementById("achievements-list");
const prestigeSection = document.getElementById("prestige-section");
const prestigeBtn = document.getElementById("prestige-btn");
const prestigeBonus = document.getElementById("prestige-bonus");
const floatingMiners = document.getElementById("floating-miners");

function formatNumber(num) {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + "Q";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

function createParticle(x, y, amount) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.innerHTML = `₿${formatNumber(amount)}`;
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particlesContainer.appendChild(particle);
  setTimeout(() => particle.remove(), 1000);
}

function createFloatingMiner() {
  const miner = document.createElement("div");
  miner.className = "floating-miner";
  miner.innerHTML = ["⛏️", "🔲", "💻", "⚛️"][Math.floor(Math.random() * 4)];
  miner.style.left = Math.random() * 100 + "%";
  miner.style.top = "100%";
  miner.style.animationDelay = Math.random() * 2 + "s";
  floatingMiners.appendChild(miner);
  setTimeout(() => miner.remove(), 5000);
}

function spawnRandomMiners() {
  if (Math.random() < 0.3) {
    createFloatingMiner();
  }
}

function showAchievement(achievement) {
  const popup = document.getElementById("achievement-popup");
  popup.innerHTML = `🏆 ${achievement.icon} ${achievement.name} - ${achievement.desc}`;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

function checkAchievements() {
  let count = 0;
  achievements.forEach(ach => {
    if (game.unlocks.includes(ach.id)) count++;
    else if (ach.check()) {
      game.unlocks.push(ach.id);
      showAchievement(ach);
    }
  });
  achievementCount.textContent = `${count}/${achievements.length}`;
  renderAchievements();
}

function renderAchievements() {
  achievementsList.innerHTML = "";
  achievements.forEach(ach => {
    const div = document.createElement("div");
    div.className = "achievement" + (game.unlocks.includes(ach.id) ? " unlocked" : "");
    div.innerHTML = ach.icon;
    div.setAttribute("data-tooltip", ach.name);
    achievementsList.appendChild(div);
  });
}

function getBtcPerSec() {
  let perSec = 0;
  let multiplier = game.prestigeMultiplier;
  game.upgrades.forEach(upg => {
    if (upg.type === "auto") perSec += upg.owned * upg.value;
  });
  game.memeUpgrades.forEach(upg => {
    if (upg.type === "auto") perSec += upg.owned * upg.value;
  });
  game.upgrades.forEach(upg => {
    if (upg.type === "mult" && upg.owned > 0) multiplier *= Math.pow(upg.value, upg.owned);
  });
  return perSec * multiplier;
}

function getBtcPerClick() {
  let perClick = game.btcPerClick;
  let multiplier = game.prestigeMultiplier;
  game.upgrades.forEach(upg => {
    if (upg.type === "click") perClick += upg.owned * upg.value;
  });
  game.upgrades.forEach(upg => {
    if (upg.type === "mult" && upg.owned > 0) multiplier *= Math.pow(upg.value, upg.owned);
  });
  return perClick * multiplier;
}

function renderShop() {
  shopElem.innerHTML = "";
  
  const allUpgrades = [...game.upgrades, ...game.memeUpgrades];
  
  allUpgrades.forEach((upg, i) => {
    const div = document.createElement("div");
    div.className = "upgrade";
    const isMeme = i >= game.upgrades.length;
    const actualIndex = isMeme ? i - game.upgrades.length : i;
    const upgData = isMeme ? game.memeUpgrades[actualIndex] : game.upgrades[actualIndex];
    
    div.innerHTML = `
      <div class="upgrade-info">
        <div class="upgrade-name">${upg.icon} ${upg.name} <span class="upgrade-owned">x${upg.owned}</span></div>
        <div class="upgrade-desc">${upg.desc}</div>
        <div class="upgrade-effect">+${formatNumber(upg.value)} ${upg.type === "auto" ? "BTC/sec" : upg.type === "click" ? "BTC/click" : "x multiplier"}</div>
      </div>
      <div class="upgrade-right">
        <div class="upgrade-cost">💰 ${formatNumber(upg.cost)} BTC</div>
        <button class="upgrade-btn" ${game.btc < upg.cost ? "disabled" : ""} data-type="${isMeme ? "meme" : "normal"}" data-idx="${actualIndex}">
          ${isMeme ? "😂 BUY" : "🛒 Buy"}
        </button>
      </div>
    `;
    shopElem.appendChild(div);
  });

  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isMeme = btn.getAttribute("data-type") === "meme";
      const idx = parseInt(btn.getAttribute("data-idx"));
      buyUpgrade(isMeme ? game.memeUpgrades[idx] : game.upgrades[idx], isMeme, idx);
    });
  });
}

function buyUpgrade(upg, isMeme, idx) {
  if (game.btc >= upg.cost) {
    game.btc -= upg.cost;
    upg.owned++;
    upg.cost *= upg.costScale;
    
    if (isMeme) {
      game.memeUpgradesBought++;
    } else {
      game.upgradesOwned++;
    }
    
    updateDisplay();
    saveGame();
    
    const quote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
    showFloatingText(quote);
  }
}

function showFloatingText(text) {
  const textEl = document.createElement("div");
  textEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    pointer-events: none;
    z-index: 3000;
    animation: particle-fly 2s ease-out forwards;
  `;
  textEl.textContent = text;
  document.body.appendChild(textEl);
  setTimeout(() => textEl.remove(), 2000);
}

function updateDisplay() {
  btcAmount.textContent = formatNumber(game.btc);
  btcPerClickElem.textContent = formatNumber(getBtcPerClick());
  btcPerSecElem.textContent = formatNumber(getBtcPerSec());
  renderShop();
  checkAchievements();
  
  const prestigeThreshold = 1000000;
  if (game.btc >= prestigeThreshold) {
    prestigeSection.style.display = "block";
    const prestigeGain = Math.floor(Math.log10(game.btc) * 10);
    prestigeBonus.textContent = prestigeGain;
  }
}

function mineBitcoin(e) {
  const amount = getBtcPerClick();
  game.btc += amount;
  game.totalClicks++;
  
  const rect = clickBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
  const y = rect.top + (Math.random() - 0.5) * 50;
  createParticle(x, y, amount);
  
  updateDisplay();
  
  if (Math.random() < 0.05) {
    showFloatingText(funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]);
  }
}

function autoMine() {
  const perSec = getBtcPerSec();
  game.btc += perSec / 10;
  updateDisplay();
}

function saveGame() {
  localStorage.setItem("btcClickerSave", JSON.stringify(game));
}

function loadGame() {
  const data = localStorage.getItem("btcClickerSave");
  if (data) {
    const parsed = JSON.parse(data);
    game.btc = parsed.btc || 0;
    game.totalClicks = parsed.totalClicks || 0;
    game.upgradesOwned = parsed.upgradesOwned || 0;
    game.memeUpgradesBought = parsed.memeUpgradesBought || 0;
    game.prestigeCount = parsed.prestigeCount || 0;
    game.prestigeMultiplier = parsed.prestigeMultiplier || 1;
    game.unlocks = parsed.unlocks || [];
    
    if (parsed.upgrades) {
      parsed.upgrades.forEach((upg, i) => {
        if (game.upgrades[i]) {
          game.upgrades[i].owned = upg.owned;
          game.upgrades[i].cost = upg.cost;
        }
      });
    }
    
    if (parsed.memeUpgrades) {
      parsed.memeUpgrades.forEach((upg, i) => {
        if (game.memeUpgrades[i]) {
          game.memeUpgrades[i].owned = upg.owned;
          game.memeUpgrades[i].cost = upg.cost;
        }
      });
    }
    
    updateDisplay();
  }
}

function resetGame() {
  if (confirm("😱 RESET EVERYTHING?! 😱\n\nAll your Bitcoin will be gone forever!\n\nAre you sure you want to do this?")) {
    localStorage.removeItem("btcClickerSave");
    location.reload();
  }
}

function prestige() {
  const prestigeGain = Math.floor(Math.log10(game.btc) * 10);
  if (prestigeGain <= 0) return;
  
  if (confirm(`🌟 PRESTIGE 🌟\n\nReset all progress for +${prestigeGain}% permanent bonus!\n\nAre you sure?`)) {
    game.prestigeCount++;
    game.prestigeMultiplier *= (1 + prestigeGain / 100);
    game.btc = 0;
    game.upgrades.forEach(u => { u.owned = 0; u.cost = u.cost / Math.pow(u.costScale, u.owned); });
    game.memeUpgrades.forEach(u => { u.owned = 0; u.cost = u.cost / Math.pow(u.costScale, u.owned); });
    game.unlocks = [];
    
    saveGame();
    updateDisplay();
    showFloatingText(`🌟 PRESTIGE! +${prestigeGain}% BONUS! 🌟`);
  }
}

clickBtn.addEventListener("click", mineBitcoin);
saveBtn.addEventListener("click", () => { saveGame(); showFloatingText("💾 Game Saved!"); });
loadBtn.addEventListener("click", () => { loadGame(); showFloatingText("📂 Game Loaded!"); });
resetBtn.addEventListener("click", resetGame);
prestigeBtn.addEventListener("click", prestige);

window.addEventListener("beforeunload", saveGame);

setInterval(autoMine, 100);
setInterval(spawnRandomMiners, 2000);
setInterval(() => { game.timePlayed++; }, 1000);

updateDisplay();
renderAchievements();
loadGame();
