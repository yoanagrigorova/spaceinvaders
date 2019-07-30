/**
 * To Do:
 * Explosion when enemy is hit DONE
 * Movement of enemy DONE
 * Enemy shooting at shooter?
 */

class Enemy extends PIXI.Sprite {
    constructor(app, parent, index, y = 0) {
        super(PIXI.Texture.from("./assets/target.png"));

        this.height = 50;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;

        this.parentContainer = parent;
        this.app = app;

        if (parent) {
            parent.addChild(this);
        }

        // this.stopShooting = setInterval(() => {
        //     this.shoot();
        // }, 2000);
    }

    remove() {
        this.parentContainer.removeChild(this);
        this.explode();
        // clearInterval(this.stopShooting);
    }

    explode() {
        let explosion = new Explosion(this.app, this.x + this.parentContainer.x, this.y);
        explosion.explode();
    }

    shoot() {
        let bullet = new Bullet(this.app.stage, this.x + (this.width / 2), this.y + this.height);
        this.app.ticker.add(function shoot() {
            bullet.enemyShoot();
        })
    }

}