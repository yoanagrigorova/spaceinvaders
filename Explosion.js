class Explosion extends PIXI.Sprite {
    constructor(app = null, x, y) {
        super(PIXI.Texture.from("./assets/explosion.png"));
        this.container = new PIXI.Container();
        this.container.addChild(this);


        this.container.x = x;
        this.container.y = y;

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