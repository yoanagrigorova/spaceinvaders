/**
 * To Do:
 * Explosion when enemy is hit DONE
 * Movement of enemy DONE
 * Enemy shooting at shooter? DONE
 * Render lost game text DONE
 */

class Boss extends Enemy {
    constructor(parent, index, y = 0, picture = "boss", liveCount = 4) {
        super(parent, index, y, picture, liveCount);

        this.height = 35;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;
        this.points = 100;
    }

}