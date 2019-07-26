let app = new PIXI.Application(900, 700);

document.body.appendChild(app.view);

let container = new PIXI.Container();
app.stage.addChild(container);

let shooter = new PIXI.Sprite.fromImage("./assets/shooter.png");

// shooter.scale.set(0.15);
shooter.width = 60;
shooter.height = 60;
shooter.anchor.set(0.5);

shooter.y = app.screen.height - (shooter.height / 2);
shooter.x = app.screen.width / 2;
app.stage.addChild(shooter);

let enemies = [];

for (let i = 0; i < 13; i++) {
    let enemy = new PIXI.Sprite.fromImage("./assets/target.png");

    enemy.height = 50;
    enemy.width = 50;

    enemy.x = i * (enemy.width + 20);

    app.stage.addChild(enemy);
    enemies.push(enemy);
}

let score = 0;
let tl = new TimelineMax();

tl.set("#score", { text: score.toString() });

let vx = 6;
let bulletVY = 7;

window.addEventListener("keydown", (event) => {
    if (event.which === 39) {
        shooter.x += vx;
    }

    if (event.which === 37) {
        shooter.x -= vx;
    }

    if (event.which === 32) {
        let bullet = new PIXI.Sprite.fromImage("./assets/bullet.png");
        bullet.width = 70;
        bullet.height = 70;
        bullet.anchor.set(0.5);
        bullet.y = shooter.y - (shooter.height / 2);
        bullet.x = shooter.x;
        app.stage.addChild(bullet);

        app.ticker.add(() => {
            bullet.y -= bulletVY;

            if (bullet.y <= 0) {
                app.stage.removeChild(bullet);
            }

            enemies.forEach((enemy, index) => {
                if ((bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) &&
                    (bullet.x >= enemy.x && bullet.x <= enemy.x + enemy.width)) {
                    app.stage.removeChild(enemy);
                    app.stage.removeChild(bullet);
                    enemies.splice(index, 1);
                    score += 40;
                    tl.to("#score", { text: score.toString() });
                }
            })
        })
    }
})