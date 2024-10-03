const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 640;

class Game {
    constructor() {
        this.mspacman = { x: 180, y: 320, direction: 'right' };
        this.dots = this.generateDots();
        this.ghosts = this.generateGhosts();
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.startGame = false;

        this.startScreen();
        this.addKeyboardControls();
    }

    generateDots() {
        let dots = [];
        for (let i = 0; i < 100; i++) {
            dots.push({ x: Math.random() * 380 + 10, y: Math.random() * 620 + 10 });
        }
        return dots;
    }

    generateGhosts() {
        return [
            { x: 50, y: 50, color: 'red' },
            { x: 350, y: 50, color: 'pink' },
            { x: 50, y: 590, color: 'cyan' },
            { x: 350, y: 590, color: 'orange' },
        ];
    }

    startScreen() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Press Enter to Start', 70, 320);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.startGame = true;
                this.gameLoop();
            }
        });
    }

    addKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.mspacman.direction = 'up';
                    break;
                case 'ArrowDown':
                    this.mspacman.direction = 'down';
                    break;
                case 'ArrowLeft':
                    this.mspacman.direction = 'left';
                    break;
                case 'ArrowRight':
                    this.mspacman.direction = 'right';
                    break;
            }
        });
    }

    moveMsPacMan() {
        switch (this.mspacman.direction) {
            case 'up':
                this.mspacman.y -= 3;
                break;
            case 'down':
                this.mspacman.y += 3;
                break;
            case 'left':
                this.mspacman.x -= 3;
                break;
            case 'right':
                this.mspacman.x += 3;
                break;
        }
    }

    moveGhosts() {
        this.ghosts.forEach(ghost => {
            const directions = ['up', 'down', 'left', 'right'];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];

            switch (randomDirection) {
                case 'up':
                    ghost.y -= 3;
                    break;
                case 'down':
                    ghost.y += 3;
                    break;
                case 'left':
                    ghost.x -= 3;
                    break;
                case 'right':
                    ghost.x += 3;
                    break;
            }
        });
    }

    checkCollisions() {
        // Check dot collision
        this.dots = this.dots.filter(dot => {
            const distance = Math.hypot(this.mspacman.x - dot.x, this.mspacman.y - dot.y);
            if (distance < 15) {
                this.score += 10;
                return false;
            }
            return true;
        });

        // Check ghost collision
        this.ghosts.forEach(ghost => {
            const distance = Math.hypot(this.mspacman.x - ghost.x, this.mspacman.y - ghost.y);
            if (distance < 15) {
                this.lives -= 1;
                if (this.lives === 0) {
                    this.gameOverScreen();
                }
                this.resetMsPacMan();
            }
        });
    }

    resetMsPacMan() {
        this.mspacman.x = 180;
        this.mspacman.y = 320;
        this.mspacman.direction = 'right';
    }

    drawMsPacMan() {
        const openMouth = (Math.floor(Date.now() / 100) % 2) === 0;
        const mouthAngle = openMouth ? 0.2 : 0.05;

        ctx.beginPath();
        ctx.arc(this.mspacman.x, this.mspacman.y, 15, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
        ctx.lineTo(this.mspacman.x, this.mspacman.y);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }

    drawGhosts() {
        this.ghosts.forEach(ghost => {
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, 15, 0, 2 * Math.PI);
            ctx.fillStyle = ghost.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    drawDots() {
        this.dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        });
    }

    drawScoreAndLives() {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${this.score}`, 10, 20);
        ctx.fillText(`Lives: ${this.lives}`, 320, 20);
    }

    gameOverScreen() {
        this.gameOver = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', 100, 300);
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${this.score}`, 130, 350);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                window.location.reload();
            }
        });
    }

    gameLoop() {
        if (!this.gameOver && this.startGame) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.moveMsPacMan();
            this.moveGhosts();
            this.checkCollisions();

            this.drawMsPacMan();
            this.drawGhosts();
            this.drawDots();
            this.drawScoreAndLives();

            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

const game = new Game();