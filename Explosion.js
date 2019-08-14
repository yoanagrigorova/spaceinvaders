class Explosion extends PIXI.Sprite {
    constructor(x, y) {
        super(PIXI.Texture.from("./assets/explosion1.png"));

        this.texture.baseTexture.width = 256;
        this.texture.baseTexture.height = 256;

        this.container = new PIXI.Container();
        this.container.addChild(this);

        this.container.x = x;
        this.container.y = y;
        this.container.scale.set(1.2);

        this.rect = new PIXI.Rectangle(0, 0, 64, 64);
        this.rect.x = 0;
        this.rect.y = 0;
        this.texture.frame = this.rect;
        this.app = app;

        if (app) {
            app.stage.addChild(this.container);
        }

        this.explosionSound = new Howl({
            src: ['./assets/sounds/invaderkilled.wav'],
            volume: 0.25,
        });
    }

    explode() {
        this.explosionSound.play();
        let frames = 0;
        this.rect.y = 0;
        this.rect.x = -this.rect.width;

        app.ticker.add(function animation() {
            if (frames < 16) {
                if (frames % 4 === 0 && frames !== 0) {
                    this.rect.y += this.rect.height;
                    this.rect.x = 0;
                } else {
                    this.rect.x += this.rect.width;
                }
                this.texture.frame = this.rect;
                frames++;
            } else {
                this.app.ticker.remove(animation);
                this.app.stage.removeChild(this.container);
            }
        }, this)
    }
}