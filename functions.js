let start = new TimelineMax();

start.fromTo("#start", 0.5, {
    scale: 0,
    opacity: 0,
}, {
    scale: 1,
    opacity: 0.7,
    onStart: function() {
        document.getElementById("scoreContainer").style.visibility = "hidden";
    },
    onComplete: () => {
        document.getElementById("start").addEventListener("mouseover", zoomIn);
        document.getElementById("start").addEventListener("mouseout", zoomOut);
    }
});

function zoomIn() {
    start.to("#start", 0.5, {
        scale: 1.5,
        opacity: 1
    })
}

function zoomOut() {
    start.to("#start", 0.5, {
        scale: 1,
        opacity: 0.7
    })
}

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
        x: -800,
        onStart: () => {
            document.getElementById("start").removeEventListener("mouseover", zoomIn);
            document.getElementById("start").removeEventListener("mouseout", zoomOut);
        },
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

    if (enemy.getLives() <= 0) enemies.splice(index, 1);

    shooter.increaseScore(enemy.getPoints());
    tl.to("#score", 0.1, { text: shooter.score.toString() });

    if (!enemies.length) {
        renderWin(winTl, shooter);
    }
}

function hitShield(bullet) {
    let hit = false;
    shields.forEach((shield, index) => {
        if ((bullet.getY() >= shield.getY() && bullet.getY() <= shield.getY() + shield.getHeight()) &&
            (bullet.getX() >= shield.getX() && bullet.getX() <= shield.getX() + shield.getWidth())) {
            bullet.remove();
            shield.updateHealth();
            if (shield.getHealth() === 0) {
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
            if ((bullet.getY() >= enemy.getY() && bullet.getY() <= enemy.getY() + enemy.getHeight()) &&
                (bullet.getX() >= enemy.getX() + container.x && bullet.getX() <= enemy.getX() + enemy.getWidth() + container.x)) {

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
    let middleBullet = new Bullet(app.stage, shooter.getX(), shooter.getY() - (shooter.getHeight() / 2));
    let leftBullet = new Bullet(app.stage, shooter.getX() - (shooter.getWidth() / 2) + 3, shooter.getY());
    let rightBullet = new Bullet(app.stage, shooter.getX() + (shooter.getWidth() / 2) - 3, shooter.getY());

    let bullets = [leftBullet, middleBullet, rightBullet];

    shoot.play();

    bullets.forEach((bullet) => {
        app.ticker.add(function hitTarget() {
            bullet.shoot();

            if (hitShield(bullet)) {
                app.ticker.remove(hitTarget);
            }

            enemies.forEach((enemy, index) => {
                if ((bullet.getY() >= enemy.getY() && bullet.getY() <= enemy.getY() + enemy.getHeight()) &&
                    (bullet.getX() >= enemy.getX() + container.x && bullet.getX() <= enemy.getX() + enemy.getWidth() + container.x)) {

                    renderHitTarget(shooter, bullet, enemy, index);
                    app.ticker.remove(hitTarget);
                }
            })

            if (bullet.getY() <= 0) {
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