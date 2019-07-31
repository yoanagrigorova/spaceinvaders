class Shield extends PIXI.Sprite {
    constructor(app = null, parent, x, y) {
        super(PIXI.Texture.from("./assets/shield.png"));

        this.width = 80;
        this.height = 80;
        this.x = x;
        this.y = y;

        this.parentContainer = parent;
        this.app = app;

        if (parent) {
            parent.addChild(this);
        }
    }

    remove() {
        this.parentContainer.removeChild(this);
    }

}