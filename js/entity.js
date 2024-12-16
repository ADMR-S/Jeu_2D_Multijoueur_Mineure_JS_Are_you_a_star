class Entity{
    constructor(speedX, speedY){
        this.speedX = speedX;
        this.speedY = speedY;
    }
    move(timer){
        this.shape.x += timer.calcDistanceToMove(this.speedX);
        this.shape.y += timer.calcDistanceToMove(this.speedY);
    }
    draw(ctx){
        this.shape.draw(ctx);
    }
}