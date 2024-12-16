class ObstacleElectrifiedWall extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height, "yellow");
        this.isElectrified = true;
    }

    handleCollision(player, entryPoint) {
        // Renvoi le joueur au point d'entrée
        player.shape.x = entryPoint.x;
        player.shape.y = entryPoint.y;
        player.speedX = 0;
        player.speedY = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.shape.x, this.shape.y);
        ctx.fillStyle = this.shape.color;
        ctx.fillRect(0, 0, this.shape.width, this.shape.height);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, this.shape.width, this.shape.height);
        ctx.restore();
    }
}