/**
 * To Do:
 * Fix first explosion error DONE 
 */

class Explosion extends PIXI.Sprite {
    constructor(app, x, y) {
        super(PIXI.Texture.from("./assets/explosion.png"));

        //give width and height of the original spritesheet in order to not have an error on first explosion
        this.texture.baseTexture.width = 250;
        this.texture.baseTexture.height = 250;

        this.container = new PIXI.Container();
        this.container.addChild(this);

        this.container.x = x;
        this.container.y = y + 30;

        this.rect = new PIXI.Rectangle(0, 0, 62, 62);
        this.texture.frame = this.rect;
        this.app = app;

        if (app) {
            app.stage.addChild(this.container);
        }
    }

    explode() {
        let frames = 0;
        let me = this;
        app.ticker.add(function animation() {
            if (frames < 3) {
                me.rect.x += 62;
                me.texture.frame = me.rect;
                frames++;
            } else {
                me.app.ticker.remove(animation);
                me.app.stage.removeChild(me.container);
            }
        })
    }
}