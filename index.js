/**
 * To Do:
 * Change score DONE
 * Shoot 3 bullets when you hit 3 consequential enemies DONE
 * Shooter lives?
 */

const log = console.log;

let app = new PIXI.Application(900, 700);

document.body.appendChild(app.view);

let background = new PIXI.Sprite.from("./assets/background.jpg");
app.stage.addChild(background);

let container = new PIXI.Container();
container.x = 0;
app.stage.addChild(container);
let shooter = new Shooter(app);

let enemies = [];

for (let i = 0; i < 8; i++) {
    let enemy = new Enemy(app, container, i, 30);
    enemies.push(enemy);
}

for (let i = 0; i < 8; i++) {
    let enemy = new Enemy(app, container, i, 84);
    enemies.push(enemy);
}
for (let i = 0; i < 8; i++) {
    let enemy = new Enemy(app, container, i, 2 * 64);
    enemies.push(enemy);
}
for (let i = 0; i < 8; i++) {
    let enemy = new Enemy(app, container, i, 3 * 64);
    enemies.push(enemy);
}

let score = 0;
let tl = new TimelineLite({
    repeat: 0
});

let tlContainer = new TimelineMax({
    repeat: -1,
    yoyo: true
})

let winTl = new TimelineLite({
    repeat: 0
});

tlContainer.to(container, 5, {
    x: app.screen.width - container.width,
})


tl.set("#score", { text: score.toString() });

let numOfHits = 0;

let stoppedTicker = false;

let threeBullets = false;

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


function animate() {
    // start the timer for the next animation loop
    let animation = requestAnimationFrame(animate);

    if (pkeys[39]) { //up key
        shooter.moveRight();
        cancelAnimationFrame(animation);
    }
    if (pkeys[37]) { //down key
        shooter.moveLeft();
        cancelAnimationFrame(animation);
    }

    if (pkeys[32]) {
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

        cancelAnimationFrame(animation);


    }
}

// window.addEventListener("keydown", (event) => {
//     if (event.which === 39) {
//         shooter.moveRight();
//     }

//     if (event.which === 37) {
//         shooter.moveLeft();
//     }

//     if (event.which === 32) {
//         let hit = false;

//         if (threeBullets) {
//             shootThreeBullets()
//         } else {
//             shootOneBullet(hit, (numOfHits) => {
//                 if (numOfHits >= 3) {
//                     threeBullets = true;
//                 } else {
//                     threeBullets = false;
//                 }
//             });
//         }

//     }
// })

function shootOneBullet(hit, callback) {
    let bullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
    app.ticker.add(function hitTarget() {
        bullet.shoot();

        enemies.forEach((enemy, index) => {
            if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {
                hit = true;
                stoppedTicker = true;
                bullet.remove();
                enemy.remove();
                enemies.splice(index, 1);
                score += 40;
                tl.to("#score", 0.5, { text: score.toString() });
                if (!enemies.length) {
                    renderWin();
                }
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

            enemies.forEach((enemy, index) => {
                if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                    (bullet.x >= enemy.x + container.x && bullet.x <= enemy.x + enemy.width + container.x)) {
                    bullet.remove();
                    enemy.remove();
                    enemies.splice(index, 1);
                    score += 40;
                    tl.to("#score", 0.5, { text: score.toString() });
                    if (!enemies.length) {
                        renderWin();
                    }
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
        .set("#winScore", { text: score.toString() })
        .fromTo("#win", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 })
}