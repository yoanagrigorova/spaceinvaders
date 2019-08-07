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

let container = new PIXI.Container();
container.x = 0;
container.y = 30;

// let lostGame = null;
let restart = null;

let winTl = new TimelineLite();

let tl = new TimelineLite({
    repeat: 0
});

let tlContainer = new TimelineMax({
    repeat: -1,
    yoyo: true
})

function renderGame() {
    document.getElementById("scoreContainer").style.visibility = "visible";

    app.stage.addChild(container);
    let shooter = new Shooter(app);
    let shields = [];

    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
        shields.push(shield);
    }

    renderEnemies(shooter, shields);

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
    }

    left.release = () => {
        shooter.vx = 0;
    }

    right.press = () => {
        shooter.vx = 10;
    }

    right.release = () => {
        shooter.vx = 0;
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

    let numOfHits = 0;
    let stoppedTicker = false;

    let shoot = new Howl({
        src: ['./assets/sounds/shoot.wav'],
        volume: 0.25,
    });

    function shootOneBullet(hit, callback) {
        let bullet = new Bullet(app.stage, shooter.x, shooter.y - (shooter.height / 2));
        shoot.play();

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
            }

            callback(numOfHits);
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

    lostGame = renederLostGame;
    restart = restartWon;

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
        document.getElementById("restartWon").removeEventListener("mouseup", restartWon);
    }
}