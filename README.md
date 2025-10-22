<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Eder Tic Tac Toe</title>
<style>
  * { box-sizing: border-box; font-family: "Poppins", sans-serif; }
  body {
    margin: 0;
    height: 100vh;
    background: radial-gradient(circle at top, #0f2027, #203a43, #2c5364);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    overflow: hidden;
    transition: background 0.5s ease;
  }

  .screen {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    animation: fadeIn 0.6s ease;
    text-align: center;
  }
  .active { display: flex; }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  h1, h2 {
    text-shadow: 0 0 15px #00f0ff;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  button {
    background: linear-gradient(90deg, #00f0ff, #00ff88);
    color: #000;
    font-weight: 600;
    padding: 12px 28px;
    margin: 8px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 0 15px #00f0ff;
    transition: all 0.3s ease;
  }

  button:hover {
    transform: scale(1.08);
    background: linear-gradient(90deg, #00ff88, #00f0ff);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    gap: 12px;
    margin-top: 20px;
  }

  .cell {
    width: 100px;
    height: 100px;
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0,255,255,0.3);
  }

  .cell:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

  .cell.taken { cursor: not-allowed; }

  .winner { animation: glow 1s infinite; }

  @keyframes glow {
    0%,100% { box-shadow: 0 0 10px #00f0ff; }
    50% { box-shadow: 0 0 25px #00f0ff; }
  }

  .scoreboard {
    display: flex;
    justify-content: space-between;
    width: 320px;
    margin-top: 15px;
  }

  .score {
    background: rgba(255,255,255,0.1);
    padding: 8px 18px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,255,255,0.3);
  }

  #status { margin-top: 15px; font-size: 1.2em; }

  .nav { position: absolute; top: 15px; right: 15px; }
  .nav button { padding: 6px 14px; font-size: 0.9em; }

  .toggle {
    background: rgba(255,255,255,0.1);
    color: #00f0ff;
    border-radius: 15px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .toggle:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

  .dark {
    background: radial-gradient(circle at top, #000000, #121212, #1a1a1a);
    color: #00ffcc;
  }

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .board { grid-template-columns: repeat(3, 80px); gap: 10px; }
    .cell { width: 80px; height: 80px; font-size: 2em; }
    .scoreboard { width: 250px; }
  }
</style>
</head>
<body>

<!-- HOME -->
<div id="home" class="screen active">
  <h1>🎮 Eder Tic Tac Toe</h1>
  <p style="opacity:0.8;">Smart, Stylish & Fun Game</p>
  <button onclick="showScreen('dashboard')">Start Game</button>
  <button onclick="showScreen('settings')">Settings ⚙️</button>
</div>

<!-- DASHBOARD -->
<div id="dashboard" class="screen">
  <div class="nav"><button onclick="showScreen('home')">🏠 Home</button></div>
  <h2>Select Game Mode</h2>
  <button onclick="startGame('single')">1 Player (vs Computer)</button>
  <button onclick="startGame('multi')">2 Player (Local)</button>
</div>

<!-- GAME -->
<div id="game" class="screen">
  <div class="nav"><button onclick="showScreen('dashboard')">⬅ Back</button></div>
  <h2 id="gameModeTitle">Game Mode</h2>
  <div class="scoreboard">
    <div class="score">X: <span id="xScore">0</span></div>
    <div class="score">O: <span id="oScore">0</span></div>
  </div>
  <div id="status">Player X's Turn</div>
  <div class="board" id="board"></div>
  <button onclick="resetBoard()">🔄 Reset Board</button>
</div>

<!-- SETTINGS -->
<div id="settings" class="screen">
  <div class="nav"><button onclick="showScreen('home')">🏠 Home</button></div>
  <h2>Settings ⚙️</h2>
  <div class="toggle" onclick="toggleTheme()">🌗 Toggle Theme</div>
  <button onclick="resetScores()">Reset Scores</button>
  <p style="margin-top:20px;opacity:0.7;">Made by Eder Team © 2025</p>
</div>

<!-- Confetti Canvas -->
<canvas id="confetti"></canvas>

<script>
// ---- Global Variables ----
let screens = document.querySelectorAll('.screen');
let board = document.getElementById('board');
let cells = [];
let boardState = Array(9).fill("");
let currentPlayer = "X";
let running = true;
let gameMode = "multi";
let xScore = 0, oScore = 0;
let darkMode = false;

const statusText = document.getElementById('status');
const xScoreText = document.getElementById('xScore');
const oScoreText = document.getElementById('oScore');
const gameModeTitle = document.getElementById('gameModeTitle');
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");
let particles = [];

// ---- Sounds ----
const clickSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_775b31f6b1.mp3?filename=click-124467.mp3");
const winSound = new Audio("https://cdn.pixabay.com/download/audio/2021/08/09/audio_9a57b87b4d.mp3?filename=success-fanfare-trumpets-6185.mp3");
const drawSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_15281df54a.mp3?filename=game-over-arcade-6435.mp3");

// ---- Win Patterns ----
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ---- Initialize ----
function initBoard() {
  board.innerHTML = "";
  cells = [];
  for(let i=0; i<9; i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", cellClicked);
    board.appendChild(cell);
    cells.push(cell);
  }
}
initBoard();
loadScores();

// ---- Screen Handling ----
function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ---- Game Logic ----
function startGame(mode){
  gameMode = mode;
  resetBoard();
  gameModeTitle.textContent = mode === "single" ? "🎯 1 Player Mode" : "👥 2 Player Mode";
  showScreen("game");
}

function cellClicked(){
  const index = this.dataset.index;
  if(boardState[index] !== "" || !running) return;
  clickSound.play();
  boardState[index] = currentPlayer;
  this.textContent = currentPlayer;
  this.classList.add('taken');
  checkWinner();

  if(gameMode === "single" && running && currentPlayer === "O"){
    setTimeout(aiMove, 600);
  }
}

function aiMove(){
  const empty = boardState.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const move = empty[Math.floor(Math.random()*empty.length)];
  boardState[move] = "O";
  cells[move].textContent = "O";
  cells[move].classList.add('taken');
  checkWinner();
}

function checkWinner(){
  let roundWon = false;
  for(const pattern of winPatterns){
    const [a,b,c] = pattern.map(i => boardState[i]);
    if(a && a===b && a===c){
      roundWon = true;
      pattern.forEach(i=>cells[i].classList.add("winner"));
      break;
    }
  }
  if(roundWon){
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    running = false;
    if(currentPlayer === "X") xScore++; else oScore++;
    saveScores();
    updateScore();
    winSound.play();
    launchConfetti();
  } else if(!boardState.includes("")){
    statusText.textContent = "😐 It's a Draw!";
    running = false;
    drawSound.play();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function resetBoard(){
  boardState.fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner","taken");
  });
  currentPlayer = "X";
  running = true;
  statusText.textContent = "Player X's Turn";
}

function resetScores(){
  xScore = 0; oScore = 0;
  saveScores();
  updateScore();
  alert("Scores reset!");
}

function updateScore(){
  xScoreText.textContent = xScore;
  oScoreText.textContent = oScore;
}

// ---- Local Storage ----
function saveScores(){
  localStorage.setItem("ederScores", JSON.stringify({x:xScore, o:oScore}));
}

function loadScores(){
  const saved = JSON.parse(localStorage.getItem("ederScores"));
  if(saved){ xScore = saved.x; oScore = saved.o; updateScore(); }
}

// ---- Theme Toggle ----
function toggleTheme(){
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
}

// ---- Confetti ----
function launchConfetti(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  particles = [];
  for(let i=0;i<100;i++){
    particles.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*confettiCanvas.height - confettiCanvas.height,
      r: Math.random()*4+1,
      d: Math.random()*50,
      color: `hsl(${Math.random()*360},100%,50%)`,
      tilt: Math.random()*10
    });
  }
  animateConfetti();
}

function animateConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  for(let i=0;i<particles.length;i++){
    const p=particles[i];
    ctx.beginPath();
    ctx.fillStyle=p.color;
    ctx.fillRect(p.x,p.y,p.r,p.r);
    ctx.closePath();
    p.y += Math.cos(p.d)+1+p.r/2;
    p.x += Math.sin(p.d);
    if(p.y>confettiCanvas.height) p.y=0;
  }
  if(!running) requestAnimationFrame(animateConfetti);
}
</script>

</body>
</html>
