class Shooter extends PIXI.Sprite {
    constructor(parent) {
        super(PIXI.Texture.from("./assets/shooter.png"));

        this.width = 60;
        this.height = 60;
        this.anchor.set(0.5);
        this.vx = 10;
        this.score = 0;
        this.lostGame = false;

        this.lives = 5;
        this.livebar = [];
        this.parentContainer = parent.stage;

        this.y = parent.screen.height - (this.height / 2);
        this.x = parent.screen.width / 2;
        parent.stage.addChild(this);

        this.renderLives();
    }

    moveRight() {
        this.x += this.vx;
    }

    moveLeft() {
        this.x -= this.vx;
    }

    updateLives() {
        if (this.lives > 0) {
            this.lives--;
            let live = this.livebar.splice(this.lives, 1);
            live[0].remove();
        }
    }

    isHit(bullet, callback) {
        let hit = false;
        if ((bullet.x >= this.x - (this.width / 2) && bullet.x <= this.x + (this.width / 2)) &&
            bullet.y >= this.y - (this.height / 2) && bullet.y <= this.y + (this.height / 2)) {
            hit = true;
        }

        return callback(hit);
    }


    renderLives() {
        let container = new PIXI.Container();
        container.x = 260;
        container.y = 5;
        this.parentContainer.addChild(container);
        for (let i = 0; i < this.lives; i++) {
            let live = new Live(app, container, container.x + (20 * i), 0);
            this.livebar.push(live);
        }
    }

    remove() {
        this.parentContainer.removeChild(this);
    }
}