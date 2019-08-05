/**
 * To Do:
 * Change score DONE
 * Shoot 3 bullets when you hit 3 consequential enemies DONE
 * Shooter lives? DONE
 * Restart game DONE
 */

const log = console.log;

let app = new PIXI.Application(900, 700);

document.body.appendChild(app.view);

let background = new PIXI.Sprite.from("./assets/background.jpg");
app.stage.addChild(background);

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
})

let restart = null;

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

// renderGame();

function renderGame() {
    document.getElementById("scoreContainer").style.visibility = "visible";
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

    let threeBullets = false;

    let left = keyboard(37),
        right = keyboard(39),
        space = keyboard(32);

    left.press = () => {
        shooter.vx = -10;
        // app.ticker.add(shooter.moveLeft);

    }

    left.release = () => {
        shooter.vx = 0;
        // app.ticker.remove(shooter.moveLeft);

    }

    right.press = () => {
        shooter.vx = 10;
        // app.ticker.add(shooter.moveRight);

    }

    right.release = () => {
        shooter.vx = 0;
        // app.ticker.remove(shooter.moveRight);

    }

    space.press = () => {
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

    state = play;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));


    function gameLoop(delta) {
        //Update the current game state:
        state(delta);
    }

    function play(delta) {
        shooter.x += shooter.vx;
    }

    // var pkeys = [];
    // window.onkeydown = function(e) {
    //     var code = e.keyCode ? e.keyCode : e.which;
    //     pkeys[code] = true;
    //     animate();
    // }

    // window.onkeyup = function(e) {
    //     var code = e.keyCode ? e.keyCode : e.which;
    //     pkeys[code] = false;
    // };



    // function animate() {
    //     if (pkeys[39]) {
    //         shooter.moveRight();
    //     }
    //     if (pkeys[37]) {
    //         shooter.moveLeft();
    //     }

    //     if (pkeys[32] && shooter.lives > 0) {
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
    // }

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

        document.getElementById("restartWon").addEventListener("mouseup", restartWon);

    }

    function restartWon() {
        container.children.length = 0;
        shooter.lostGame = false;
        winTl
            .fromTo("#win", 1, { opacity: 1, scale: 1 }, {
                opacity: 0,
                scale: 0
            })
        shooter.score = 0;
        threeBullets = false;
        enemies.length = 0;
        tl.to("#score", 0.5, { text: shooter.score.toString() });
        renderEnemies(shooter);
        shooter.restart();
        shields.forEach(shield => shield.remove());
        shields.length = 0;
        for (let i = 0; i < 4; i++) {
            let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
            shields.push(shield);
        }
        document.getElementById("restartWon").removeEventListener("mouseup", restartWon);
    }

    restart = restartWon;

    function renderEnemies(shooter) {
        let rowCount = 6;
        let rows = 3;
        for (let i = 0; i < rows * rowCount; i++) {
            let row = Math.floor(i / rowCount);
            let enemy = new Enemy(app, container, i % rowCount, row * 60, shooter, shields);
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

    function keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };
        //The `upHandler`
        key.upHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }
}