// ======================
// CANVAS
// ======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ======================
// PANEL LEVEL
// ======================
const levelPanel = document.getElementById("levelPanel");
const levelText = document.getElementById("levelText");
const scoreText = document.getElementById("scoreText");
const nextLevelBtn = document.getElementById("nextLevelBtn");

// ======================
// SNAKE
// ======================
let snake = [{ x: 200, y: 200 }];

let dx = 20;
let dy = 0;

// ======================
// FOOD
// ======================
let food = generateFood();

// ======================
// SCORE
// ======================
let score = 0;

// ======================
// LEVEL
// ======================
let level = "Level 1";

// speed game
let gameSpeed = 200;

// pause level
let pauseLevel = false;

// game over
let gameOver = false;

// ======================
// GENERATE FOOD
// ======================
function generateFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

// ======================
// DRAW SNAKE
// ======================
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, 20, 20);
    });
}

// ======================
// DRAW FOOD
// ======================
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// ======================
// DRAW SCORE
// ======================
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";

    ctx.fillText("Score : " + score, 10, 20);
    ctx.fillText("Level : " + level, 300, 20);
}

// ======================
// MOVE SNAKE
// ======================
function moveSnake() {

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // EASY & MEDIUM = TEMBUS DINDING
    if (level !== "Hard") {

        // kanan
        if (head.x >= canvas.width) {
            head.x = 0;
        }

        // kiri
        if (head.x < 0) {
            head.x = canvas.width - 20;
        }

        // bawah
        if (head.y >= canvas.height) {
            head.y = 0;
        }

        // atas
        if (head.y < 0) {
            head.y = canvas.height - 20;
        }

    }

    // HARD MODE = MATI KENA DINDING
    else {

        if (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height
        ) {
            gameOver = true;
        }

    }

    // tambah kepala
    snake.unshift(head);

    // hapus ekor
    snake.pop();
}

// ======================
// CHECK FOOD
// ======================
function checkFood() {

    if (
        snake[0].x === food.x &&
        snake[0].y === food.y
    ) {

        // tambah panjang snake
        snake.push({});

        // food baru
        food = generateFood();

        // tambah score
        score += 1;

        // update level
        updateLevel();
    }

}

// ======================
// UPDATE LEVEL
// ======================
function updateLevel() {

    // Level 1
    if (score <= 25) {

        if (level !== "Level 1") {
            showLevelTransition("Level 1");
        }

        level = "Level 1";
        gameSpeed = 250;
    }

    // Level 2
    else if (score <= 50) {

        if (level !== "Level 2") {
            showLevelTransition("Level 2");
        }

        level = "Level 2";
        gameSpeed = 200;
    }

    // Level 3
    else if (score <= 75) {

        if (level !== "Level 3") {
            showLevelTransition("Level 3");
        }

        level = "Level 3";
        gameSpeed = 150;
    }

    // Level 4
    else if (score <= 100) {

        if (level !== "Level 4") {
            showLevelTransition("Level 4");
        }

        level = "Level 4";
        gameSpeed = 100;
    }
    
    // Level 5
    else {

        if (level !== "Level 5") {
            showLevelTransition("Level 5");
        }

        level = "Level 5";
        gameSpeed = 50;
    }

}

// ======================
// LEVEL TRANSITION
// ======================
function showLevelTransition(newLevel) {

    pauseLevel = true;

    levelPanel.classList.remove("hidden");

    levelText.innerText = "LEVEL " + newLevel;

    scoreText.innerText =
        "Score kamu : " + score;

}

// ======================
// NEXT LEVEL BUTTON
// ======================
nextLevelBtn.addEventListener("click", () => {

    pauseLevel = false;

    levelPanel.classList.add("hidden");

    gameLoop();

});

// ======================
// COLLISION BODY
// ======================
function checkCollision() {

    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            gameOver = true;

        }

    }

}

// ======================
// GAME OVER
// ======================
function drawGameOver() {

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";

    ctx.fillText(
        "GAME OVER",
        100,
        200
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Score : " + score,
        150,
        240
    );

}

// ======================
// KEYBOARD
// ======================
document.addEventListener("keydown", (event) => {

    const key = event.key;

    // atas
    if (key === "ArrowUp" && dy === 0) {

        dx = 0;
        dy = -20;

    }

    // bawah
    else if (key === "ArrowDown" && dy === 0) {

        dx = 0;
        dy = 20;

    }

    // kiri
    else if (key === "ArrowLeft" && dx === 0) {

        dx = -20;
        dy = 0;

    }

    // kanan
    else if (key === "ArrowRight" && dx === 0) {

        dx = 20;
        dy = 0;

    }

    // restart game
    if (gameOver && key === "Enter") {
        location.reload();
    }

});

// ======================
// MOUSE CONTROL
// ======================
canvas.addEventListener("click", function (event) {

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const head = snake[0];

    const diffX = mouseX - head.x;
    const diffY = mouseY - head.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {

        dx = diffX > 0 ? 20 : -20;
        dy = 0;

    } else {

        dx = 0;
        dy = diffY > 0 ? 20 : -20;

    }

});

// ======================
// GAME LOOP
// ======================
function gameLoop() {

    // pause level
    if (pauseLevel) return;

    // bersihkan canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // game over
    if (gameOver) {

        drawGameOver();
        return;

    }

    // logic game
    moveSnake();
    checkFood();
    checkCollision();

    // gambar object
    drawSnake();
    drawFood();
    drawScore();

    // ulang loop
    setTimeout(gameLoop, gameSpeed);

}

// ======================
// START GAME
// ======================
gameLoop();