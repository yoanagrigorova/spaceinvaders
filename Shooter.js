class Shooter extends PIXI.Sprite {
    constructor(parent) {
        super(PIXI.Texture.from("./assets/shooter.png"));

        this.width = 60;
        this.height = 60;
        this.anchor.set(0.5);
        this.vx = 0;
        this.score = 0;
        this.lostGame = false;

        this.lives = 5;
        this.livebar = [];

        this.parentContainer = parent;
        this.container = new PIXI.Container();

        this.y = parent.screen.height - (this.height / 2);
        this.x = parent.screen.width / 2;
        parent.stage.addChild(this);

        this.renderLives();
    }

    moveRight() {
        if (this.x <= this.parentContainer.screen.width) {
            this.x += this.vx;
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.vx;
        }
    }

    updateLives(bullet) {
        let explosion = new Explosion(bullet.x, bullet.y);
        explosion.anchor.set(0.5);
        explosion.explode();
        if (this.lives > 0) {
            this.lives--;
            let live = this.livebar.splice(this.lives, 1);
            live[0].remove();
        }
    }

    isHit(bullet) {
        if ((bullet.x >= this.x - (this.width / 2) && bullet.x <= this.x + (this.width / 2)) &&
            bullet.y >= this.y - (this.height / 2) && bullet.y <= this.y + (this.height / 2)) {
            return true;
        }
        return false;
    }

    renderLives() {
        this.container.x = 260;
        this.container.y = 5;
        this.parentContainer.stage.addChild(this.container);
        for (let i = 0; i < this.lives; i++) {
            let live = new Live(app, this.container, this.container.x + (20 * i), 0);
            this.livebar.push(live);
        }
    }

    remove() {
        this.container.children.length = 0;
        this.parentContainer.stage.removeChild(this);

    }

    restart() {
        this.remove();
        this.lives = 5;
        this.livebar = [];
        this.renderLives();
        this.parentContainer.stage.addChild(this);
    }
}