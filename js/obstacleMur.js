
class ObstacleMur extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height, "black");
    }

    handleCollision(player) {
        var diffX = this.shape.x - player.shape.x;
        var diffY = this.shape.y - player.shape.y;

        if(diffX>0 && diffX < this.shape.width + player.shape.width){ //Il y a overlap et l'obstacle est à droite
            if(player.speedX>0){ //Si le joueur va à droite
                player.shape.x = player.shape.x - player.shape.width/60;
                player.speedX = 0;
            }
        }//Sinon rien
        

        if(diffX<0 && -diffX < this.shape.width + player.shape.x){ //Il y a overlap et l'obstacle est à gauche
            if(player.speedX<0){ //Si le joueur va vers la gauche
                player.shape.x = player.shape.x + player.shape.width/60
                player.speedX = 0;

            }
        }
        
        //Idem pour Y

        if(diffY>0 && diffY < this.shape.height + player.shape.height){ //Il y a overlap et l'obstacle est en bas
            if(player.speedY>0){ //Si le joueur va vers le bas
                player.shape.y = player.shape.y - player.shape.height/60
                player.speedY = 0;

            }
        }
        if(diffY<0 && -diffY < this.shape.height){ //Il y a overlap et l'obstacle est en haut
            if(player.speedY<0){ //Si le joueur va vers le haut
                player.shape.y = player.shape.y + player.shape.height/60
                player.speedY = 0;
            }
        }
    }
}
