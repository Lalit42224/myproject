let level = 1;
let traps = [];
let coinsCollected = 0;
const coinsPerLevel = 5;

function draw() {
  container.innerHTML = "";

  // Draw snake
  snake.forEach((part) => {
    const div = document.createElement("div");
    div.className = "snake";
    div.style.left = part.x * boxSize + "px";
    div.style.top = part.y * boxSize + "px";
    container.appendChild(div);
  });

  // Draw coin
  const coinDiv = document.createElement("div");
  coinDiv.className = "coin";
  coinDiv.style.left = coin.x * boxSize + "px";
  coinDiv.style.top = coin.y * boxSize + "px";
  container.appendChild(coinDiv);

  // Draw walls
  walls.forEach((wall) => {
    const wallDiv = document.createElement("div");
    wallDiv.className = "wall";
    wallDiv.style.left = wall.x * boxSize + "px";
    wallDiv.style.top = wall.y * boxSize + "px";
    container.appendChild(wallDiv);
  });

  // Draw traps
  traps.forEach((trap) => {
    const trapDiv = document.createElement("div");
    trapDiv.className = "wall"; // reuse wall class, or make a new "trap" style
    trapDiv.style.backgroundColor = "purple";
    trapDiv.style.left = trap.x * boxSize + "px";
    trapDiv.style.top = trap.y * boxSize + "px";
    container.appendChild(trapDiv);
  });
}

function move() {
  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  // Wall or boundary collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= gridSize || head.y >= gridSize ||
    walls.some(w => w.x === head.x && w.y === head.y) ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    health--;
    updateHealth();
    if (health <= 0) return endGame();
    return;
  }

  // Trap collision
  if (traps.some(t => t.x === head.x && t.y === head.y)) {
    health--;
    updateHealth();
    if (health <= 0) return endGame();
  }

  snake.unshift(head);

  // Coin collection
  if (head.x === coin.x && head.y === coin.y) {
    score++;
    coinsCollected++;
    scoreDisplay.textContent = "Score: " + score;
    if (coinsCollected >= coinsPerLevel) {
      levelUp();
    }
    placeCoin();
  } else {
    snake.pop();
  }

  draw();
}

function levelUp() {
  level++;
  coinsCollected = 0;
  document.getElementById("level").textContent = "Level: " + level;
  createMaze(level);
  placeCoin();
  // You can also increase speed here if you want
  clearInterval(interval);
  interval = setInterval(move, Math.max(80, 200 - level * 20));
}

function createMaze(level) {
  walls = [];
  traps = [];
  const wallCount = 10 + level * 5;
  const trapCount = 3 + level * 2;

  for (let i = 0; i < wallCount; i++) {
    walls.push({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    });
  }

  for (let i = 0; i < trapCount; i++) {
    traps.push({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    });
  }
}

function startGame() {
  snake = [{ x: 5, y: 5 }];
  direction = { x: 1, y: 0 };
  score = 0;
  health = 3;
  level = 1;
  coinsCollected = 0;
  document.getElementById("level").textContent = "Level: 1";
  scoreDisplay.textContent = "Score: 0";
  updateHealth();
  createMaze(level);
  placeCoin();
  draw();
  gameOverText.style.display = "none";
  restartBtn.style.display = "none";
  clearInterval(interval);
  interval = setInterval(move, 200);
}
