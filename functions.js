let start = new TimelineMax();

start.fromTo("#start", 1.5, {
    scale: 0,
    opacity: 0
}, {
    scale: 1,
    opacity: 1,
    onStart: function() {
        document.getElementById("scoreContainer").style.visibility = "hidden";
    },
});

let enemies = [];

function renderEnemies() {
    let rowCount = 6;
    let rows = 3;
    for (let i = 0; i < rows * rowCount; i++) {
        let row = Math.floor(i / rowCount);
        if (row === 0) {
            let enemy = new Boss(container, i % rowCount, row * 60);
            enemies.push(enemy);
        } else {
            let enemy = new Enemy(container, i % rowCount, row * 60);
            enemies.push(enemy);
        }

    }
}

document.getElementById("start").addEventListener("mouseup", (event) => {
    start.fromTo("#start", 1, {
        scale: 1,
        opacity: 1
    }, {
        scale: 0,
        opacity: 0,
        onComplete: renderGame
    })
})

function renderWin(winTl, shooter, restartWon) {
    winTl
        .set("#result", { text: "YOU WIN" })
        .set("#score", { text: shooter.score.toString() })
        .fromTo("#resultContainer", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restart").addEventListener("mouseup", restart);
}

function renederLostGame(winTl, shooter, restartWon) {
    winTl
        .set("#result", { text: "YOU LOSE" })
        .set("#score", { text: shooter.score.toString() })
        .fromTo("#resultContainer", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restart").addEventListener("mouseup", restartWon);
}

function renderHitTarget(shooter, bullet, enemy, index) {
    bullet.remove();
    enemy.hit();

    if (enemy.lives.length <= 0) enemies.splice(index, 1);

    shooter.score += enemy.points;
    tl.to("#score", 0.1, { text: shooter.score.toString() });

    if (!enemies.length) {
        renderWin(winTl, shooter, restart);
    }
}

function hitShield(bullet) {
    let hit = false;
    shields.forEach((shield, index) => {
        if ((bullet.y >= shield.y && bullet.y <= shield.y + shield.height) &&
            (bullet.x >= shield.x && bullet.x <= shield.x + shield.width)) {
            bullet.remove();
            shield.updateHealth();
            if (shield.health === 0) {
                shields.splice(index, 1);
            }

            hit = true;
        }
    });
    return hit;
}