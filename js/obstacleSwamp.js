class ObstacleSwamp extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height, "green");
    }

    handleCollision(player) {
        // Ralentir le joueur
        player.isSlowed = true;
    }
}