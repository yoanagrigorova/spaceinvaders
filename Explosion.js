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

        this.explodeSound = new Howl({
            src: ['./assets/sounds/invaderkilled.wav'],
            volume: 0.25,
        });

        this.container._zIndex = 9999;

    }

    explode() {
        this.explodeSound.play();
        let frames = 0;
        let me = this;

        me.rect.y = 0;
        me.rect.x = -me.rect.width;
        app.ticker.add(function animation() {
            if (frames < 16) {
                if (frames % 4 === 0 && frames !== 0) {
                    frames++;
                    me.rect.y += me.rect.height;
                    me.rect.x = 0;
                } else {
                    me.rect.x += me.rect.width;
                    frames++;
                }
                me.texture.frame = me.rect;
            } else {
                me.app.ticker.remove(animation);
                me.app.stage.removeChild(me.container);
            }
        })
    }
}