const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let player, obstacles, gravity, score, gameRunning;

// Player
class Player {
  constructor() {
    this.x = 100;
    this.y = canvas.height - 50;
    this.size = 20;
    this.velocity = 0;
  }

  update() {
    this.velocity += gravity;
    this.y += this.velocity;

    // Ground & ceiling
    if (this.y > canvas.height - this.size) {
      this.y = canvas.height - this.size;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  draw() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Obstacles
class Obstacle {
  constructor() {
    this.width = 20 + Math.random() * 30;
    this.height = 20 + Math.random() * 150;
    this.x = canvas.width;
    this.y = Math.random() > 0.5 ? 0 : canvas.height - this.height;
    this.speed = 4;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Init
function init() {
  player = new Player();
  obstacles = [];
  gravity = 0.5;
  score = 0;
  gameRunning = true;
}

// Collision
function checkCollision(p, o) {
  return (
    p.x < o.x + o.width &&
    p.x + p.size > o.x &&
    p.y < o.y + o.height &&
    p.y + p.size > o.y
  );
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  player.draw();

  // Spawn obstacles
  if (Math.random() < 0.02) {
    obstacles.push(new Obstacle());
  }

  obstacles.forEach((o, index) => {
    o.update();
    o.draw();

    if (checkCollision(player, o)) {
      endGame();
    }

    if (o.x + o.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // Score display
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Flip gravity
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    gravity *= -1;
    player.velocity *= -1;
  }
});

// End game
function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("scoreText").innerText = "Score: " + score;
}

// Restart
function restart() {
  document.getElementById("gameOver").classList.add("hidden");
  init();
  gameLoop();
}

// Start
init();
gameLoop();
