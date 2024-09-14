const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startGameBtn = document.getElementById('startGameBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const gridSizeSelect = document.getElementById('gridSize');

let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = true;

highScoreElement.textContent = highScore;

// Game loop
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    setTimeout(gameLoop, 100);
  }
}

function update() {
  const head = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  if (head.x < 0 || head.x >= canvas.width / gridSize ||
    head.y < 0 || head.y >= canvas.height / gridSize ||
    checkCollision(head, snake)) {
    gameOver = true;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }
    setTimeout(() => {
      startGameBtn.textContent = 'Play Again';
      startGameBtn.style.display = 'block';
    }, 500); 
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function checkCollision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'right';
  score = 0;
  scoreElement.textContent = score;
  generateFood();
  gameOver = false;
}

function startGame() {
  startGameBtn.style.display = 'none';
  resetGame();
  gameLoop();
}

startGameBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

document.addEventListener('keydown', e => {
  if (!gameOver) { // Only allow controls when the game is running
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
        break;
    }
  }
});

// Settings Modal Functionality
startGameBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

closeSettings.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', () => {
  gridSize = parseInt(gridSizeSelect.value, 10);
  canvas.width = gridSize * 20;
  canvas.height = gridSize * 20;
  settingsModal.style.display = 'none';
  startGame();
});