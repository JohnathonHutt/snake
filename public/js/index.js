//jshint esversion: 6

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const gst = {
  score: 0,
  h: 10,
  w: 10,
  x: canvas.width / 2,
  y: canvas.height - 30,
  dir: "u",
  snake: [{
    x: canvas.width / 2,
    y: canvas.height - 30
  }],
  pellet: {
    x: canvas.width / 2,
    y: canvas.height - 150
  },
  time: 150,
  interval: null,
  paused: false
};

document.addEventListener('keydown', function(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    if (gst.dir == 'u' || gst.dir == 'd') {
      gst.dir = 'r';
    }
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    if (gst.dir == 'u' || gst.dir == 'd') {
      gst.dir = 'l';
    }
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    if (gst.dir == 'l' || gst.dir == 'r') {
      gst.dir = 'u';
    }
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    if (gst.dir == 'l' || gst.dir == 'r') {
      gst.dir = 'd';
    }
  }
});

document.getElementById('a').addEventListener("click", pause);

document.getElementById("u").addEventListener("click", function() {
  gst.dir = 'u';
});

document.getElementById("l").addEventListener("click", function() {
  gst.dir = 'l';
});

document.getElementById("r").addEventListener("click", function() {
  gst.dir = 'r';
});

document.getElementById("d").addEventListener("click", function() {
  gst.dir = 'd';
});

function u() {
  gst.snake.unshift({
    x: gst.snake[0].x,
    y: gst.snake[0].y - 10
  });
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function d() {
  gst.snake.unshift({
    x: gst.snake[0].x,
    y: gst.snake[0].y + 10
  });
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function l() {
  gst.snake.unshift({
    x: gst.snake[0].x - 10,
    y: gst.snake[0].y
  });
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function r() {
  gst.snake.unshift({
    x: gst.snake[0].x + 10,
    y: gst.snake[0].y
  });
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function checkForGameOver() {
  if (gst.snake[0].x === canvas.width || gst.snake[0].x === -gst.w || gst.snake[0].y === canvas.height || gst.snake[0].y === -gst.h) {
    drawGameOver();
  }
  gst.snake.slice(1).forEach(s => {
    if (s.x === gst.snake[0].x && s.y === gst.snake[0].y) {
      drawGameOver();
    }
  });
}

function makeNewPellet() {
  let x;
  let y;
  let inSnake = false;
  do {
    console.log(gst.snakeHeightUnit);
    x = Math.floor(Math.random() * (canvas.width / gst.w)) * 10;
    console.log(x);
    console.log(gst.snakeHeightUnit);
    y = Math.floor(Math.random() * (canvas.height / gst.h)) * 10;
    console.log(y);
    gst.snake.forEach(s => {
      if (s.x === x && s.y === y) {
        inSnake = true;
      }
    });
  }
  while (inSnake);

  gst.pellet.x = x;
  gst.pellet.y = y;
}

function isTherePellet() {
  //conditional under directions if coordiantes of new snake squar === pellet coordinates dont pop
  if (gst.pellet.x === gst.snake[0].x && gst.pellet.y === gst.snake[0].y) {
    gst.score += 10;
    makeNewPellet();
    resetTime();
    // gst.pellet.x = 50;
    // gst.pellet.y = 50;
    return true;
  }
}

function drawGameOver() {
  //stop GAME
  clearInterval(gst.interval);
  //add Game over text
  ctx.font = "32px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("GAME OVER", 50, canvas.height / 2);
  ctx.font = "28px Arial";
  ctx.fillText("SCORE: " + gst.score, 70, canvas.height/2 + 34);
  //hit a to restart
  document.getElementById('b').addEventListener('click', restartGame);
  document.getElementById('canvas').addEventListener('click', restartGame);
  document.addEventListener('keydown', restartGame);
}

function restartGame() {
  //used in drawGameOver
  document.location.reload();
}

function drawStartScreen() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("PRESS B TO START", 36, canvas.height / 2);
  let options = {
    once: true
  };
  document.getElementById('b').addEventListener('click', startGame, options);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'b') {
      startGame();
    }
  }, options);
}

function startGame() {
  //used in drawStartScreen()
  if (gst.interval === null) {
    gst.interval = setInterval(draw, gst.time);
  }
}

function drawSnake() {
  gst.snake.forEach(s => {
    ctx.beginPath();
    ctx.rect(s.x, s.y, gst.h, gst.w);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "rgb(148, 193, 30)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  });
}

function drawPellet() {
  ctx.beginPath();
  ctx.rect(gst.pellet.x, gst.pellet.y, 10, 10);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPellet();
  if (gst.dir === 'u') {
    u();
  }
  if (gst.dir === 'd') {
    d();
  }
  if (gst.dir === 'l') {
    l();
  }
  if (gst.dir === 'r') {
    r();
  }
  drawSnake();
}

function resetTime() {
  clearInterval(gst.interval);
  if (gst.time > 100) {
    gst.time -= 5;
  }
  gst.interval = setInterval(draw, gst.time);
}

function pause() {
  if (gst.paused === false) {
    clearInterval(gst.interval);
    gst.paused = true;
  } else if (gst.paused === true) {
    gst.interval = setInterval(draw, gst.time);
    gst.paused = false;
  }
}

drawStartScreen();
