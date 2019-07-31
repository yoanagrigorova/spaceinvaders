/**
 * To Do:
 * Explosion when enemy is hit DONE
 * Movement of enemy DONE
 * Enemy shooting at shooter? DONE
 * Render lost game text
 */

class Enemy extends PIXI.Sprite {
    constructor(app, parent, index, y = 0, shooter, shields) {
        super(PIXI.Texture.from("./assets/target.png"));

        this.height = 50;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;
        this.shooter = shooter;
        this.shields = shields;

        this.parentContainer = parent;
        this.app = app;

        this.lives = [];

        for (let i = 0; i < 3; i++) {
            let live = new Live(app, parent, this.x + (i * 15), this.y + this.height)
            this.lives.push(live);
        }

        if (parent) {
            parent.addChild(this);
        }

        this.stopShooting = setInterval(() => {
            this.shoot();
        }, (Math.random() * 9000) + 2000);
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

    getPosition() {
        return {
            x: (this.x + (this.width / 2)) + this.parent.x,
            y: this.y + this.height
        }
    }

    remove() {
        this.parentContainer.removeChild(this);
        this.explode();
        clearInterval(this.stopShooting);
    }

    explode() {
        let explosion = new Explosion(this.app, this.x + this.parentContainer.x, this.y);
        explosion.explode();
    }

    shoot() {
        const { x, y } = this.getPosition();
        let me = this;
        let bullet = new Bullet(this.app.stage, x, y);

        this.app.ticker.add(function shoot() {
            bullet.enemyShoot();

            me.shields.forEach((shield) => {
                if ((bullet.y >= shield.y && bullet.y <= shield.y + shield.height) &&
                    (bullet.x >= shield.x && bullet.x <= shield.x + shield.width)) {
                    bullet.remove();
                    me.app.ticker.remove(shoot);
                }
            })

            me.shooter.isHit(bullet, (hit) => {
                if (hit) {
                    me.app.ticker.remove(shoot);
                    me.shooter.updateLives();
                    bullet.remove();
                }
                if (me.shooter.lives === 0) {
                    shooter.lostGame = true;
                    me.shooter.lives--;
                    bullet.remove();
                    me.app.ticker.remove(shoot);

                    let tl = new TimelineMax();
                    tl
                        .set("#loseScore", { text: me.shooter.score.toString() })
                        .fromTo("#lose", 2, {
                            opacity: 0,
                            scale: 0
                        }, { opacity: 1, scale: 1 });

                    me.shooter.remove();

                }
            });

            if (me.shooter.lostGame) {
                bullet.remove();
                clearInterval(me.stopShooting);
            }
        })

    }

}