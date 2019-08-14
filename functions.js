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

    let interval = setInterval(() => {
        if (enemies.length) {
            enemies[Math.floor(Math.random() * enemies.length)].shoot();
        } else {
            clearInterval(interval);
        }
    }, 1000);
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

function renderWin(winTl, shooter) {
    winTl
        .set("#result", { text: "YOU WIN" })
        .set("#score", { text: shooter.score.toString() })
        .fromTo("#resultContainer", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restart").addEventListener("mouseup", restartWon);
}

function renederLostGame(winTl, shooter) {
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
        renderWin(winTl, shooter);
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

function shootOneBullet(hit) {
    let bullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
    shoot.play();

    app.ticker.add(function hitTarget() {
        bullet.shoot();

        if (hitShield(bullet)) {
            app.ticker.remove(hitTarget);
        }

        enemies.forEach((enemy, index) => {
            if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {

                hit = true;
                stoppedTicker = true;

                renderHitTarget(shooter, bullet, enemy, index);
                app.ticker.remove(hitTarget);
            }
        })

        if (bullet.y <= 0) {
            stoppedTicker = true;
            app.ticker.remove(hitTarget);
        }

        if (!hit && stoppedTicker) {
            numOfHits = 0;
            stoppedTicker = false;
        } else if (hit && stoppedTicker) {
            numOfHits++;
            hit = false;
            stoppedTicker = false;
            if (numOfHits >= 3) {
                threeBullets = true;
            }
        }
    })
}

function shootThreeBullets() {
    let middleBullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
    let leftBullet = new Bullet(app.stage, shooter.x - (shooter.width / 2) + 3, shooter.y);
    let rightBullet = new Bullet(app.stage, shooter.x + (shooter.width / 2) - 3, shooter.y);

    let bullets = [leftBullet, middleBullet, rightBullet];

    shoot.play();

    bullets.forEach((bullet) => {
        app.ticker.add(function hitTarget() {
            bullet.shoot();

            if (hitShield(bullet)) {
                app.ticker.remove(hitTarget);
            }

            enemies.forEach((enemy, index) => {
                if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                    (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {

                    renderHitTarget(shooter, bullet, enemy, index);
                    app.ticker.remove(hitTarget);
                }
            })

            if (bullet.y <= 0) {
                app.ticker.remove(hitTarget);
            }
        })
    })
}

function restartWon() {
    container.children.length = 0;
    shooter.lostGame = false;
    winTl
        .fromTo("#resultContainer", 1, { opacity: 1, scale: 1 }, {
            opacity: 0,
            scale: 0
        })
    shooter.score = 0;
    threeBullets = false;
    numOfHits = 0;
    enemies.length = 0;
    tl.to("#score", 0.5, { text: shooter.score.toString() });
    renderEnemies(shooter, shields);
    shooter.restart();
    shields.forEach(shield => shield.remove());
    shields.length = 0;
    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
        shields.push(shield);
    }
    document.getElementById("restart").removeEventListener("mouseup", restartWon);
}