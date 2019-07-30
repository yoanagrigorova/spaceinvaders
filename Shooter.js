class Shooter extends PIXI.Sprite {
    constructor(parent) {
        super(PIXI.Texture.from("./assets/shooter.png"));

        this.width = 60;
        this.height = 60;
        this.anchor.set(0.5);
        this.vx = 6;

        this.y = parent.screen.height - (this.height / 2);
        this.x = parent.screen.width / 2;
        parent.stage.addChild(this);
    }

    moveRight() {
        this.x += this.vx;
    }

    moveLeft() {
        this.x -= this.vx;
    }
}