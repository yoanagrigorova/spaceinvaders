class Enemy extends PIXI.Sprite {
    constructor(parent, index, y = 0, picture = "target", liveCount = 2) {
        super(PIXI.Texture.from("./assets/" + picture + ".png"));

        this.height = 50;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;
        this.points = 50;

        this.shooter = shooter;
        this.shields = shields;

        this.parentContainer = parent;
        this.app = app;

        this.lives = [];

        for (let i = 0; i < liveCount; i++) {
            let live = new Live(app, parent, liveCount === 2 ? this.x + (i * 15) + 7 : this.x + (i * 15) - 3, this.y + this.height)
            this.lives.push(live);
        }

        if (parent) {
            parent.addChild(this);
        }

        this.interval = (Math.random() * 12000) + 2000;

        this.stopShooting = setInterval(() => {
            this.shoot();
        }, this.interval);

        this.explodeSound = new Howl({
            src: ['./assets/sounds/invaderkilled.wav'],
            volume: 0.25,
        });
    }

    hit() {
        if (this.lives.length > 1) {
            let live = this.lives.splice(this.lives.length - 1, 1);
            live[0].remove();
            // this.explodeSound.play();
            this.explode();
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
        this.lives.forEach(live => live.remove());
        clearInterval(this.stopShooting);
    }

    explode() {
        this.explodeSound.play();
        let explosion = new Explosion(this.x + this.parentContainer.x, this.y + this.parentContainer.y);
        explosion.explode();
    }

    shoot() {
        const { x, y } = this.getPosition();
        let me = this;
        let bullet = new Bullet(this.app.stage, x, y);

        this.app.ticker.add(function shoot() {
            bullet.enemyShoot();

            if (hitShield(bullet)) {
                bullet.remove();
                app.ticker.remove(shoot);
            }

            if (me.shooter.isHit(bullet)) {
                me.app.ticker.remove(shoot);
                me.shooter.updateLives();
                bullet.remove();
            }

            if (me.shooter.lives === 0) {
                me.shooter.lostGame = true;
                me.shooter.lives--;

                bullet.remove();
                me.app.ticker.remove(shoot);
                me.shooter.remove();
                let killed = new Howl({
                    src: ['./assets/sounds/explosion.wav'],
                    volume: 0.25,
                });
                killed.play();
                renederLostGame(winTl, me.shooter, restart);
            }

            if (me.shooter.lostGame) {
                bullet.remove();
                clearInterval(me.stopShooting);
            }

            if (bullet.y > app.screen.height) {
                bullet.remove();
            }
        })
    }
}