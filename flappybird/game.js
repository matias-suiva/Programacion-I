const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const GRAVITY = 0.01;
const JUMP_FORCE = -7;
const PIPE_WIDTH = 70;
const PIPE_GAP = 160;
const BASE_PIPE_SPEED = 1.5;
const MAX_PIPE_SPEED = 5;
const PIPE_SPAWN_INTERVAL = 1600;

let bird = {
    x: 80,
    y: CANVAS_HEIGHT / 2,
    width: 34,
    height: 24,
    velocity: 0,
    rotation: 0
};

let pipes = [];
let score = 0;
let bestScore = parseInt(localStorage.getItem('flappyBestScore')) || 0;
let gameRunning = false;
let gameLoop = null;
let lastPipeSpawn = 0;

const scoreEl = document.getElementById('score');
const bestValueEl = document.getElementById('best-value');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

bestValueEl.textContent = bestScore;

function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(bird.width / 4, -bird.height / 6, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.width / 4 + 3, -bird.height / 6 - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.width / 4 + 4, -bird.height / 6 - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(bird.width / 2, 0);
    ctx.lineTo(bird.width / 2 + 10, -5);
    ctx.lineTo(bird.width / 2 + 10, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawPipes() {
    ctx.fillStyle = '#2E8B57';
    ctx.strokeStyle = '#1a5c30';
    ctx.lineWidth = 3;
    
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        
        const bottomY = pipe.topHeight + PIPE_GAP;
        const bottomHeight = CANVAS_HEIGHT - bottomY;
        
        ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
        ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
        
        ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);
        ctx.strokeRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);
    });
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#70c5ce');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
    
    ctx.fillStyle = '#8FBC8F';
    ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 20);
}

function updateBird() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    
    bird.rotation = Math.min(Math.max(bird.velocity * 0.05, -0.5), 1.2);
    
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
    
    if (bird.y + bird.height > CANVAS_HEIGHT - 40) {
        bird.y = CANVAS_HEIGHT - 40 - bird.height;
        gameOver();
    }
}

function spawnPipe() {
    const minHeight = 50;
    const maxHeight = CANVAS_HEIGHT - PIPE_GAP - 50 - 40;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: CANVAS_WIDTH,
        topHeight: topHeight,
        passed: false
    });
}

function getCurrentPipeSpeed() {
    const speedIncrease = Math.floor(score / 5) * 0.3;
    return Math.min(BASE_PIPE_SPEED + speedIncrease, MAX_PIPE_SPEED);
}

function updatePipes() {
    const currentSpeed = getCurrentPipeSpeed();
    pipes.forEach(pipe => {
        pipe.x -= currentSpeed;
        
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            score++;
            scoreEl.textContent = score;
        }
    });
    
    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
}

function checkCollision() {
    for (let pipe of pipes) {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
            if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + PIPE_GAP) {
                return true;
            }
        }
    }
    return false;
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameLoop);
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBestScore', bestScore);
        bestValueEl.textContent = bestScore;
    }
    
    finalScoreEl.textContent = `Puntuación: ${score}`;
    gameOverScreen.classList.remove('hidden');
}

function jump() {
    if (!gameRunning) return;
    bird.velocity = JUMP_FORCE;
}

function resetGame() {
    bird.y = CANVAS_HEIGHT / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes = [];
    score = 0;
    scoreEl.textContent = 0;
    lastPipeSpawn = 0;
}

function startGame() {
    resetGame();
    gameRunning = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameLoop = requestAnimationFrame(loop);
}

function loop(timestamp) {
    if (!gameRunning) return;
    
    drawBackground();
    drawPipes();
    drawBird();
    
    updateBird();
    updatePipes();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (timestamp - lastPipeSpawn > PIPE_SPAWN_INTERVAL) {
        spawnPipe();
        lastPipeSpawn = timestamp;
    }
    
    gameLoop = requestAnimationFrame(loop);
}

function handleInput(e) {
    const isSpace = e.type === 'keydown' && e.code === 'Space';
    const isClick = e.type === 'click' && e.target.tagName !== 'BUTTON';
    
    if (!isSpace && !isClick) return;
    
    e.preventDefault();
    
    if (gameRunning) {
        jump();
    } else if (!startScreen.classList.contains('hidden')) {
        startGame();
    } else if (!gameOverScreen.classList.contains('hidden')) {
        startGame();
    }
}

document.addEventListener('keydown', handleInput);
document.addEventListener('click', handleInput);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

drawBackground();
drawBird();