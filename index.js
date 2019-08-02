/**
 * To Do:
 * Change score DONE
 * Shoot 3 bullets when you hit 3 consequential enemies DONE
 * Shooter lives? DONE
 * Restart game ALMOST DONE
 */

const log = console.log;

let app = new PIXI.Application(900, 700);

document.body.appendChild(app.view);

let background = new PIXI.Sprite.from("./assets/background.jpg");
app.stage.addChild(background);

let container = new PIXI.Container();
container.x = 0;
container.y = 30;
app.stage.addChild(container);
let shooter = new Shooter(app);
let shields = [];

for (let i = 0; i < 4; i++) {
    let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
    shields.push(shield);
}

let enemies = [];

renderEnemies(shooter);

let tl = new TimelineLite({
    repeat: 0
});

let tlContainer = new TimelineMax({
    repeat: -1,
    yoyo: true
})

let winTl = new TimelineLite();

tlContainer.to(container, 10, {
    x: app.screen.width - container.width
})

tl.set("#score", { text: shooter.score.toString() });

var pkeys = [];
window.onkeydown = function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    pkeys[code] = true;
    animate();
}

window.onkeyup = function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    pkeys[code] = false;
    animate();
};


let threeBullets = false;

function animate() {

    if (pkeys[39]) {
        shooter.moveRight();
    }
    if (pkeys[37]) {
        shooter.moveLeft();
    }

    if (pkeys[32] && shooter.lives > 0) {
        let hit = false;
        if (threeBullets) {
            shootThreeBullets()
        } else {
            shootOneBullet(hit, (numOfHits) => {
                if (numOfHits >= 3) {
                    threeBullets = true;
                } else {
                    threeBullets = false;
                }
            });
        }
    }
}

let numOfHits = 0;
let stoppedTicker = false;

function shootOneBullet(hit, callback) {
    let bullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
    app.ticker.add(function hitTarget() {
        bullet.shoot();

        shields.forEach((shield, index) => {
            if ((bullet.y >= shield.y && bullet.y <= shield.y + shield.height) &&
                (bullet.x >= shield.x && bullet.x <= shield.x + shield.width)) {
                bullet.remove();
                shield.updateHealth();
                if (shield.health === 0) {
                    shields.splice(index, 1);
                }
                app.ticker.remove(hitTarget);
            }
        })

        enemies.forEach((enemy, index) => {
            if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {

                hit = true;
                stoppedTicker = true;

                renderHitTarget(bullet, enemy, index);
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
        }

        callback(numOfHits);
    })
}


function shootThreeBullets() {
    let middleBullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
    let leftBullet = new Bullet(app.stage, shooter.x - (shooter.width / 2) + 3, shooter.y);
    let rightBullet = new Bullet(app.stage, shooter.x + (shooter.width / 2) - 3, shooter.y);

    let bullets = [leftBullet, middleBullet, rightBullet];

    bullets.forEach((bullet) => {
        app.ticker.add(function hitTarget() {
            bullet.shoot();

            shields.forEach((shield, index) => {
                if ((bullet.y >= shield.y && bullet.y <= shield.y + shield.height) &&
                    (bullet.x >= shield.x && bullet.x <= shield.x + shield.width)) {
                    shield.updateHealth();
                    if (shield.health === 0) {
                        shields.splice(index, 1);
                    }
                    bullet.remove();
                    app.ticker.remove(hitTarget);
                }
            })

            enemies.forEach((enemy, index) => {
                if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                    (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {

                    renderHitTarget(bullet, enemy, index);
                    app.ticker.remove(hitTarget);
                }
            })

            if (bullet.y <= 0) {
                app.ticker.remove(hitTarget);
            }


        })

    })
}


function renderWin() {
    winTl
        .set("#result", { text: "YOU WIN" })
        .set("#winScore", { text: shooter.score.toString() })
        .fromTo("#win", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restartWon").addEventListener("click", restartWon);

}

function restartWon() {
    winTl
        .fromTo("#win", 1, { opacity: 1, scale: 1 }, {
            opacity: 0,
            scale: 0
        })

    shooter.score = 0;
    threeBullets = false;
    enemies.forEach(e => e.remove());
    enemies = [];
    tl.to("#score", 0.5, { text: shooter.score.toString() });
    renderEnemies();
    shooter.restart();
    shields = [];
    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
        shields.push(shield);
    }
    document.getElementById("restartWon").removeEventListener("click", restartWon);
}

function renderEnemies() {
    let rowCount = 6;
    for (let i = 0; i < rowCount; i++) {
        let enemy = new Enemy(app, container, i, 0, shooter, shields);
        enemies.push(enemy);
    }

    for (let i = 0; i < rowCount; i++) {
        let enemy = new Enemy(app, container, i, 60, shooter, shields);
        enemies.push(enemy);
    }

    for (let i = 0; i < rowCount; i++) {
        let enemy = new Enemy(app, container, i, 2 * 60, shooter, shields);
        enemies.push(enemy);
    }
}

function renderHitTarget(bullet, enemy, index) {
    bullet.remove();
    enemy.hit();

    if (enemy.lives.length <= 0) enemies.splice(index, 1);

    shooter.score += 40;
    tl.to("#score", 0.1, { text: shooter.score.toString() });

    if (!enemies.length) {
        renderWin();
    }

}