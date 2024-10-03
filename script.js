// Constants
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gridSize = 20; // Size of the grid cells
const rowCount = 20; // Number of rows in the maze
const colCount = 20; // Number of columns in the maze

// Maze layout (1 = wall, 0 = path)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Game Objects
class PacMan {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 'right'; // Initial direction
    }

    draw() {
        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(this.x + gridSize / 2, this.y + gridSize / 2, gridSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI); // Pac-Man shape
        context.lineTo(this.x + gridSize / 2, this.y + gridSize / 2);
        context.fill();
    }

    move() {
        const oldX = this.x;
        const oldY = this.y;

        switch (this.direction) {
            case 'up':
                this.y -= gridSize;
                break;
            case 'down':
                this.y += gridSize;
                break;
            case 'left':
                this.x -= gridSize;
                break;
            case 'right':
                this.x += gridSize;
                break;
        }

        // Check for wall collision
        if (!this.canMove(this.x, this.y)) {
            this.x = oldX;
            this.y = oldY;
        } else {
            // Check if the player collected a pellet
            this.checkPelletCollision();
        }
    }

    canMove(newX, newY) {
        const newRow = newY / gridSize;
        const newCol = newX / gridSize;
        return maze[newRow][newCol] === 0; // Check if the new position is a path
    }

    checkPelletCollision() {
        const pelletIndex = Math.floor(this.y / gridSize) * colCount + Math.floor(this.x / gridSize);
        if (maze[Math.floor(this.y / gridSize)][Math.floor(this.x / gridSize)] === 0) {
            score += 10; // Increase score
            maze[Math.floor(this.y / gridSize)][Math.floor(this.x / gridSize)] = 2; // Mark pellet as collected
        }
    }
}

class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = this.randomDirection(); // Random initial direction
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, gridSize, gridSize); // Draw ghost as a square
    }

    move() {
        const oldX = this.x;
        const oldY = this.y;

        switch (this.direction) {
            case 'up':
                this.y -= gridSize;
                break;
            case 'down':
                this.y += gridSize;
                break;
            case 'left':
                this.x -= gridSize;
                break;
            case 'right':
                this.x += gridSize;
                break;
        }

        // Check for wall collision
        if (!this.canMove(this.x, this.y)) {
            this.x = oldX;
            this.y = oldY;
            this.direction = this.randomDirection(); // Change direction if it hits a wall
        }
    }

    canMove(newX, newY) {
        const newRow = newY / gridSize;
        const newCol = newX / gridSize;
        return maze[newRow] && maze[newRow][newCol] === 0; // Check if the new position is a path and within bounds
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
                context.fillStyle = 'yellow'; // Pellet color
                context.beginPath();
                context.arc(col * gridSize + gridSize / 2, row * gridSize + gridSize / 2, 3, 0, Math.PI * 2);
                context.fill();
            }
        }
    }
}

// Handle Key Presses
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

// Start the Game
initGame();