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

    updateHealth() {
        this.health--;
        if (this.health === 0) {
            this.remove();
        }
    }

    remove() {
        this.parentContainer.removeChild(this);
    }

    restart() {
        this.health = 20;
        this.parentContainer.removeChild(this);
        this.parentContainer.addChild(this);
    }

}