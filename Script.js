const splash = document.getElementById("splash");
const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const finalScore = document.getElementById("finalScore");

let gameInstance = null;

/* Splash → Menu */
setTimeout(() => {
    splash.style.display = "none";
    menu.classList.remove("hidden");
}, 2500);

/* Buttons */
startBtn.onclick = () => startGame();
restartBtn.onclick = () => startGame();
menuBtn.onclick = () => {
    gameOverScreen.classList.add("hidden");
    menu.classList.remove("hidden");
};

/* Canvas resize */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

/* Start Game */
function startGame() {
    menu.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    canvas.classList.remove("hidden");

    resizeCanvas();
    gameInstance = createGame();
}

/* =========================
   🎮 GAME LOGIC ONLY HERE
========================= */
function createGame() {

    let player = { x: canvas.width/2, y: canvas.height/2, r: 10 };
    let safeZone = { x: canvas.width/2, y: canvas.height/2, r: 80 };

    let score = 0;
    let speed = 1;
    let running = true;

    function moveSafeZone() {
        safeZone.x += (Math.random() - 0.5) * speed * 10;
        safeZone.y += (Math.random() - 0.5) * speed * 10;
    }

    function update() {
        if (!running) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        moveSafeZone();

        // Draw safe zone
        ctx.beginPath();
        ctx.arc(safeZone.x, safeZone.y, safeZone.r, 0, Math.PI * 2);
        ctx.strokeStyle = "#00ffff";
        ctx.stroke();

        // Draw player
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Distance check
        let dx = player.x - safeZone.x;
        let dy = player.y - safeZone.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > safeZone.r) {
            endGame();
            return;
        }

        score++;
        speed += 0.001;

        ctx.fillText("Score: " + score, 20, 40);

        requestAnimationFrame(update);
    }

    function endGame() {
        running = false;
        canvas.classList.add("hidden");
        gameOverScreen.classList.remove("hidden");
        finalScore.textContent = "Score: " + score;
    }

    /* Touch Control */
    canvas.addEventListener("touchmove", (e) => {
        let rect = canvas.getBoundingClientRect();
        player.x = e.touches[0].clientX - rect.left;
        player.y = e.touches[0].clientY - rect.top;
    });

    /* Mouse fallback */
    canvas.addEventListener("mousemove", (e) => {
        player.x = e.clientX;
        player.y = e.clientY;
    });

    update();

    return {};
}
