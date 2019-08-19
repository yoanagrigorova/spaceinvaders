class Shield extends PIXI.Sprite {
    constructor(app = null, parent, x, y) {
        super(PIXI.Texture.from("./assets/shield.png"));

        this.width = 80;
        this.height = 80;
        this.x = x;
        this.y = y;

        this.health = 20;

        this.parentContainer = parent;
        this.app = app;

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

    getHealth() {
        return this.health;
    }

    updateHealth() {
        this.health--;
        if (this.health === 0) {
            this.remove();
        }
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    remove() {
        this.parentContainer.removeChild(this);
    }
}