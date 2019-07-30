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

        this.lives = [];

        for (let i = 0; i < 3; i++) {
            let live = new Live(app, parent, this.x + (i * 15), this.y + this.height)
            this.lives.push(live);
        }

        // this.livebar = new Livebar(app, parent, this.x + 5, this.y + this.height);
        if (parent) {
            parent.addChild(this);
        }


        // this.stopShooting = setInterval(() => {
        //     this.shoot();
        // }, 2000);
    }

    hit() {
        if (this.lives.length > 1) {
            let live = this.lives.splice(this.lives.length - 1, 1);
            live[0].remove();
        } else if (this.lives.length === 1) {
            this.remove();
            if (this.lives[0]) {
                this.lives[0].remove();
                this.lives.splice(0, 1);
            }
        }

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