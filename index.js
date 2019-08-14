const log = console.log;

let app = new PIXI.Application();

document.body.appendChild(app.view);

let background = new PIXI.Sprite.from("./assets/background.jpg");
app.stage.addChild(background);

let container = new PIXI.Container();
container.x = 0;
container.y = 30;

let restart = null;
let shooter = null;
let enemies = [];
let shields = [];
let numOfHits = 0;
let stoppedTicker = false;
let threeBullets = false;

let winTl = new TimelineLite();

let tl = new TimelineLite({
    repeat: 0
});

let tlContainer = new TimelineMax({
    repeat: -1,
    yoyo: true
});

let shoot = new Howl({
    src: ['./assets/sounds/shoot.wav'],
    volume: 0.25,
});

function renderGame() {
    document.getElementById("scoreContainer").style.visibility = "visible";

    app.stage.addChild(container);
    shooter = new Shooter(app);

    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app, app.stage, (i * 200) + 50, shooter.y - 200);
        shields.push(shield);
    }

    renderEnemies(shooter, shields);

    tlContainer.to(container, 10, {
        x: app.screen.width - container.width,
    })

    tl.set("#score", { text: shooter.score.toString() });

    let left = keyboard(37),
        right = keyboard(39),
        space = keyboard(32);

    left.press = () => {
        if (shooter.x >= 20) {
            shooter.vx = -10;
        } else {
            shooter.vx = 0;
        }
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
        if (shooter.lives > 0) {
            if (threeBullets) {
                shootThreeBullets()
            } else {
                shootOneBullet(hit);
            }
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
        if ((left.isDown && shooter.x - shooter.width / 2 > 0) || (right.isDown && shooter.x + shooter.width / 2 < app.screen.width)) {
            shooter.x += shooter.vx;
        }
    }
}