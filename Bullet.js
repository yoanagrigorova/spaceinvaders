class Bullet extends PIXI.Sprite {
    constructor(parent, x, y) {
        super(PIXI.Texture.from("./assets/bullet.png"));

        this.width = 70;
        this.height = 70;
        this.anchor.set(0.5);
        this.y = y;
        this.x = x;
        this.vy = 10;
        this.parentContainer = parent;

        if (parent) {
            parent.addChild(this);
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    shoot() {
        this.y -= this.vy;

        if (this.y <= 0) {
            this.remove();
        }
    }

    enemyShoot() {
        this.y += (this.vy - 3);

        if (this.y >= app.screen.height) {
            this.remove();
        }
    }

    remove() {
        this.parentContainer.removeChild(this);
    }
}