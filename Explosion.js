/**
 * To Do:
 * Fix first explosion error DONE 
 */

class Explosion extends PIXI.Sprite {
    constructor(x, y) {
        super(PIXI.Texture.from("./assets/explosion.png"));

        this.texture.baseTexture.width = 250;
        this.texture.baseTexture.height = 250;

        this.container = new PIXI.Container();
        this.container.addChild(this);

        this.container.x = x;
        this.container.y = y + 30;
        this.container.scale.set(1.2);

        this.rect = new PIXI.Rectangle(0, 0, 62, 62);
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
        log(this.container._zIndex);
        this.explodeSound.play();
        let frames = 0;
        let me = this;

        me.rect.y = 0;
        me.rect.x = 0;
        app.ticker.add(function animation() {
            if (frames < 12) {
                if (frames % 3 === 0 && frames !== 0) {
                    me.rect.y += 62;
                    me.rect.x = 0;
                } else {
                    me.rect.x += 62;
                }
                me.texture.frame = me.rect;
                frames++;
            } else {
                me.app.ticker.remove(animation);
                me.app.stage.removeChild(me.container);
            }
        })
    }
}