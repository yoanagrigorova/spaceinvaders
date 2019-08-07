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

function renderEnemies(shooter, shields) {
    let rowCount = 6;
    let rows = 4;
    for (let i = 0; i < rows * rowCount; i++) {
        let row = Math.floor(i / rowCount);
        let enemy = new Enemy(app, container, i % rowCount, row * 60, shooter, shields);
        enemies.push(enemy);
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
        .set("#winScore", { text: shooter.score.toString() })
        .fromTo("#win", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restartWon").addEventListener("mouseup", restart);
}

function renederLostGame(winTl, shooter, restartWon) {
    winTl
        .set("#result", { text: "YOU LOSE" })
        .set("#winScore", { text: shooter.score.toString() })
        .fromTo("#win", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restartWon").addEventListener("mouseup", restartWon);
}

function renderHitTarget(shooter, bullet, enemy, index) {
    bullet.remove();
    enemy.hit();

    if (enemy.lives.length <= 0) enemies.splice(index, 1);

    shooter.score += 40;
    tl.to("#score", 0.1, { text: shooter.score.toString() });

    if (!enemies.length) {
        renderWin(winTl, shooter, restartWon);
    }
}