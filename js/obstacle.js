class Obstacle extends Entity {
    constructor(x, y, width, height, color, speedX, speedY) {
        super(speedX, speedY);
        this.shape = new Rectangle(x, y, width, height, color);
    }

}


