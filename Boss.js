class Boss extends Enemy {
    constructor(parent, index, y = 0, picture = "boss", liveCount = 4) {
        super(parent, index, y, picture, liveCount);

        this.height = 40;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;
        this.points = 40;
    }

}