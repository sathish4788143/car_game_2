const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('scoreVal');
const startBtn = document.getElementById('startBtn');
const bgMusic = new Audio('music.mp3'); 
bgMusic.loop = true;

canvas.width = Math.min(window.innerWidth, 500);
canvas.height = window.innerHeight;

let score = 0;
let gameSpeed = 6;
let isGameRunning = false;
let obstacles = [];
let frame = 0;

const player = { x: canvas.width / 2 - 25, y: canvas.height - 150, w: 50, h: 80 };

// Controls Logic
const moveLeft = () => { if (player.x > 10) player.x -= 40; };
const moveRight = () => { if (player.x < canvas.width - 60) player.x += 40; };

document.getElementById('leftBtn').addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); });
document.getElementById('rightBtn').addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); });
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
});

function spawnObject() {
    frame++;
    if (frame % 60 === 0) { // Normal Coffee
        obstacles.push({ x: Math.random() * (canvas.width - 40), y: -50, type: '☕', speed: gameSpeed });
    }
    if (frame % 200 === 0) { // HARD PIVOT COUCH
        obstacles.push({ 
            x: Math.random() * (canvas.width - 150), 
            y: -100, type: '🛋️', 
            speed: gameSpeed + 1, 
            isPivot: true,
            dir: Math.random() > 0.5 ? 3 : -3 
        });
    }
}

function update() {
    if (!isGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Road Lines
    ctx.setLineDash([20, 20]);
    ctx.strokeStyle = "white";
    ctx.lineDashOffset = -frame * gameSpeed;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();

    ctx.font = "50px Arial";
    ctx.fillText("🚕", player.x, player.y);

    obstacles.forEach((obj, i) => {
        obj.y += obj.speed;
        if (obj.isPivot) {
            obj.x += obj.dir; // Couch slides!
            if (obj.x < 0 || obj.x > canvas.width - 100) obj.dir *= -1;
            ctx.font = "bold 20px Arial";
            ctx.fillStyle = "yellow";
            ctx.fillText("PIVOT!!", obj.x, obj.y - 10);
            ctx.font = "100px Arial";
        } else {
            ctx.font = "40px Arial";
        }
        
        ctx.fillText(obj.type, obj.x, obj.y);

        // Collision
        let hitBox = obj.isPivot ? 100 : 35;
        if (player.x < obj.x + hitBox && player.x + 40 > obj.x && player.y - 40 < obj.y && player.y > obj.y - 40) {
            gameOver();
        }

        if (obj.y > canvas.height + 100) {
            obstacles.splice(i, 1);
            score++;
            scoreVal.innerText = score;
            if (score % 10 === 0) gameSpeed += 0.5;
        }
    });

    spawnObject();
    requestAnimationFrame(update);
}

function gameOver() {
    isGameRunning = false;
    bgMusic.pause();
    alert("Game Over! Score: " + score);
    location.reload();
}

startBtn.onclick = () => {
    startBtn.style.display = 'none';
    isGameRunning = true;
    bgMusic.play().catch(() => console.log("Music blocked by browser until interaction"));
    update();
};