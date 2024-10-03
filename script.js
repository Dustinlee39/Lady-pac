const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

// Maze layout (1 = wall, 0 = path, 2 = pellet)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 2, 0, 0, 0, 2, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 2, 0, 0, 2, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 2, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Grid size
const gridSize = 20;
const rowCount = maze.length;
const colCount = maze[0].length;

// Pac-Man Class
class PacMan {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 'right'; // Initial direction
        this.speed = 4; // Pac-Man speed
    }

    draw() {
        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(this.x + gridSize / 2, this.y + gridSize / 2, gridSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
        context.lineTo(this.x + gridSize / 2, this.y + gridSize / 2);
        context.fill();
    }

    move() {
        let newX = this.x;
        let newY = this.y;

        switch (this.direction) {
            case 'up':
                newY -= this.speed;
                break;
            case 'down':
                newY += this.speed;
                break;
            case 'left':
                newX -= this.speed;
                break;
            case 'right':
                newX += this.speed;
                break;
        }

        if (this.canMove(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.checkPellet(newX, newY);
        }
    }

    canMove(newX, newY) {
        const newRow = Math.floor(newY / gridSize);
        const newCol = Math.floor(newX / gridSize);
        return maze[newRow] && maze[newRow][newCol] !== 1; // Check if the new position is a path
    }

    checkPellet(newX, newY) {
        const newRow = Math.floor(newY / gridSize);
        const newCol = Math.floor(newX / gridSize);
        if (maze[newRow][newCol] === 2) {
            maze[newRow][newCol] = 0; // Mark pellet as collected
            score += 10; // Increase score
        }
    }
}

// Ghost Class
class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = this.randomDirection();
        this.speed = 2; // Ghost speed
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, gridSize, gridSize);
    }

    move() {
        let newX = this.x;
        let newY = this.y;

        switch (this.direction) {
            case 'up':
                newY -= this.speed;
                break;
            case 'down':
                newY += this.speed;
                break;
            case 'left':
                newX -= this.speed;
                break;
            case 'right':
                newX += this.speed;
                break;
        }

        if (this.canMove(newX, newY)) {
            this.x = newX;
            this.y = newY;
        } else {
            this.direction = this.randomDirection(); // Change direction on wall collision
        }
    }

    canMove(newX, newY) {
        const newRow = Math.floor(newY / gridSize);
        const newCol = Math.floor(newX / gridSize);
        return maze[newRow] && maze[newRow][newCol] !== 1; // Check if the new position is a path
    }

    randomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
}

// Game Variables
let pacman;
let ghosts = [];
let score = 0;
let lives = 3;
let gameOver = false;

// Initialize Game
function initGame() {
    pacman = new PacMan(20, 20); // Starting position
    ghosts = [
        new Ghost(60, 60, 'red'),
        new Ghost(80, 80, 'pink'),
        new Ghost(100, 100, 'cyan'),
        new Ghost(120, 120, 'orange')
    ];
    score = 0;
    lives = 3;
    gameOver = false;

    document.addEventListener('keydown', handleKeyPress);
    gameLoop();
}

// Game Loop
function gameLoop() {
    if (gameOver) return;
    update();
    draw();
    setTimeout(gameLoop, 100); // Game loop runs every 100ms
}

// Update Game State
function update() {
    pacman.move();
    ghosts.forEach(ghost => {
        ghost.move();
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            lives--;
            if (lives <= 0) {
                gameOver = true;
                alert("Game Over! Your Score: " + score);
                initGame(); // Restart the game
            } else {
                pacman.x = 20; // Reset Pac-Man position
                pacman.y = 20; // Reset Pac-Man position
            }
        }
    });
}

// Draw Game Elements
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    pacman.draw();
    ghosts.forEach(ghost => ghost.draw());
    document.getElementById('scoreDisplay').innerText = "Score: " + score;
    document.getElementById('livesDisplay').innerText = "Lives: " + lives;
}

// Draw Maze
function drawMaze() {
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            if (maze[row][col] === 1) {
                context.fillStyle = 'blue'; // Wall color
                context.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            } else if (maze[row][col] === 0) {
                context.fillStyle = 'black'; // Path color
                context.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            } else if (maze[row][col] === 2) {
                context.fillStyle = 'yellow'; // Pellet color
                context.beginPath();
                context.arc(col * gridSize + gridSize / 2, row * gridSize + gridSize / 2, 3, 0, Math.PI * 2);
                context.fill();
            }
    }
}

// Handle Keyboard Input
function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            pacman.direction = 'up';
            break;
        case 'ArrowDown':
            pacman.direction = 'down';
            break;
        case 'ArrowLeft':
            pacman.direction = 'left';
            break;
        case 'ArrowRight':
            pacman.direction = 'right';
            break;
    }
}

// Start the game
initGame();