class Item extends Entity{

    constructor(x, y, radius, color, speedX, speedY){
        super(speedX, speedY);
        this.shape = new Circle(x, y, radius, color);
    }

    checkCollisionsWithWalls(w, h){
        let shape = this.shape;
        // tester Collisions avec les murs
        if ((shape.x + shape.radius) > w) {
            this.speedX = -this.speedX;
            shape.x = w-shape.radius;
        }
        else if((shape.x-shape.radius) < 0) {
            this.speedX = -this.speedX;
            shape.x = shape.radius;
        }
        if ((shape.y + shape.radius) > h) {
            this.speedY = -this.speedY;
            shape.y = h - shape.radius;
        } else if ((shape.y - shape.radius) < 0) {
            this.speedY = -this.speedY;
            shape.y = shape.radius;
        }
    }

    
    testItemObstacle(obstacle){
        if (obstacle instanceof ObstacleSwamp) {
            return; // Les items traversent les swamps
        }

        var o = obstacle.shape;
        var shape = this.shape;
        
        if(shape.circRectsOverlap(o)){
            // si la balle est plus bas que l'obstacle, ou plus haut, alors collision
            // avec les côtés haut et bas
            // On inversera que speedY
            if((shape.y < o.y) || (shape.y > o.y + o.height)) {
                
                // est-ce qu'on monte ou on descend?
                if(this.speedY < 0) {
                // collision avec le bas
                shape.y = o.y + o.height + shape.radius;
                } else {
                // collision avec le haut
                shape.y = o.y - shape.radius;
                }
                this.speedY = -this.speedY;
            } else {
                // La balle entre en collision avec
                // un des deux côtés verticaux
                // on inverse speedX
                    // est-ce que la balle allait de droite à gauche ?
            
            if(this.speedX < 0){
                shape.x = o.x + o.width + shape.radius;
            }
            
            else{ 
                shape.x = o.x - shape.radius;
            }
            this.speedX = -this.speedX;
            }
        }
        return;
    }

    draw(ctx) {
        this.shape.draw(ctx);
        ctx.save();
        ctx.translate(this.shape.x, this.shape.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
  
/*
circleCollide(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
   }
*/
   

}