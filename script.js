const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameStarted = false;
let score = 0;
let lives = 3;
let msPacMan = { x: 180, y: 320, direction: 'right' };
let ghosts = [
    { x: 50, y: 50, color: 'red' },
    { x: 310, y: 50, color: 'pink' },
    { x: 50, y: 590, color: 'cyan' },
    { x: 310, y: 590, color: 'orange' }
];
let dots = [];
const dotRadius = 3;
const dotSpacing = 20;

// Start screen function
function startScreen() {
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Arial';
    ctx.fillText('Press Enter to Start', 50, canvas.height / 2);
}

// Reset Ms. Pac-Man's position
function resetMsPacMan() {
    msPacMan.x = 180;
    msPacMan.y = 320;
    msPacMan.direction = 'right';
}

// Populate dots
function populateDots() {
    for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
        for (let y = dotSpacing; y < canvas.height; y += dotSpacing) {
            dots.push({ x, y });
        }
    }
}

// Draw dots
function drawDots() {
    ctx.fillStyle = 'white';
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw Ms. Pac-Man
function drawMsPacMan() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(msPacMan.x, msPacMan.y, 15, 0.2 * Math.PI, 1.8 * Math.PI, false);
    ctx.lineTo(msPacMan.x, msPacMan.y);
    ctx.fill();
}

// Move Ms. Pac-Man based on direction
function moveMsPacMan() {
    switch (msPacMan.direction) {
        case 'up':
            msPacMan.y -= 2;
            break;
        case 'down':
            msPacMan.y += 2;
            break;
        case 'left':
            msPacMan.x -= 2;
            break;
        case 'right':
            msPacMan.x += 2;
            break;
    }
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Move ghosts randomly
function moveGhosts() {
    ghosts.forEach(ghost => {
        let direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: ghost.x += 2; break; // right
            case 1: ghost.x -= 2; break; // left
            case 2: ghost.y += 2; break; // down
            case 3: ghost.y -= 2; break; // up
        }
    });
}

// Check collisions with dots
function checkCollisions() {
    dots = dots.filter(dot => {
        const dist = Math.hypot(msPacMan.x - dot.x, msPacMan.y - dot.y);
        if (dist < 15) {
            score += 10;
            return false; // remove dot
        }
        return true; // keep dot
    });
}

// Check collisions with ghosts
function checkGhostCollisions() {
    ghosts.forEach(ghost => {
        const dist = Math.hypot(msPacMan.x - ghost.x, msPacMan.y - ghost.y);
        if (dist < 15) {
            lives--;
            resetMsPacMan();
        }
    });
}

// Draw score and lives
function drawScoreAndLives() {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 20);
}

// Game over screen
function gameOverScreen() {
    ctx.fillStyle = 'red';
    ctx.font = '32px Arial';
    ctx.fillText('Game Over', 90, canvas.height / 2 - 20);
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, 100, canvas.height / 2 + 20);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (lives <= 0) {
        gameOverScreen();
        return;
    }

    drawMsPacMan();
    moveMsPacMan();
    drawGhosts();
    moveGhosts();
    drawDots();
    checkCollisions();
    checkGhostCollisions();
    drawScoreAndLives();

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': msPacMan.direction = 'up'; break;
        case 'ArrowDown': msPacMan.direction = 'down'; break;
        case 'ArrowLeft': msPacMan.direction = 'left'; break;
        case 'ArrowRight': msPacMan.direction = 'right'; break;
        case 'Enter':
            if (!gameStarted) {
                gameStarted = true;
                populateDots();
                gameLoop();
            }
            break;
    }
});

// Initial display
startScreen();