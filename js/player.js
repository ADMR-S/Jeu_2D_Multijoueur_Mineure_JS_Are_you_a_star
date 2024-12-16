class Player extends Entity{
    constructor(playerNumber){
        super();
        this.debug = false; // Variable de débogage
        this.playerNumber = playerNumber;
        switch(playerNumber){
            case 1:
                this.originalColor = 'red';
                this.bonusColor = 'pink';
                this.malusColor = 'darkRed'; 
                this.originalCommands = { up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD" };
                break;
            case 2:
                this.originalColor = 'blue';
                this.bonusColor = 'cyan';
                this.malusColor = 'grey';
                this.originalCommands = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
                break;
            case 3:
                this.originalColor = 'green';
                this.bonusColor = 'lavender';
                this.malusColor = 'purple';
                this.originalCommands = { up: "KeyG", down: "KeyV", left: "KeyC", right: "KeyB" };
                break;
            case 4:
                this.originalColor = 'yellow';
                this.bonusColor = 'orange';
                this.malusColor = 'peru';
                this.originalCommands = { up: "Minus", down: "BracketLeft", left: "KeyP", right: "BracketRight" };
                break;
            default:
                console.log("Invalid player number");
                break;
        }
        this.commands = structuredClone(this.originalCommands); //On copie les commandes pour pouvoir les inverser si besoin
        this.shape = new Rectangle(10, 10, 20, 20, this.originalColor);
        this.score = 0;
        this.speedX = 0; 
        this.speedY = 0; 
        this.speed = 200; // pixels/s
        this.isSlowed = false; //Zones de ralentissement
        this.hasBonus = false; //Bonus si item de même couleur
        this.hasMalus = false; //Ralentir le joueur si malus (désactivé actuellement)
        this.score = new Score();
    }

    updateScore(timeElapsed, position, totalPlayers) {
        this.score.updateScore(timeElapsed, position, totalPlayers);
    }

    getCurrentScore() {
        return this.score.getCurrentScore();
    }

    getTotalScore() {
        return this.score.getTotalScore();
    }

    getPreviewScore(timeElapsed, position, totalPlayers) {
        return this.score.getPreviewScore(timeElapsed, position, totalPlayers);
    }

    checkCollisionWithObstacle(obstacles, entryPoint) {
        var overlaps = false;
        for (var i = 0; i < obstacles.length; i++) {
            var o = obstacles[i];

            if (o.shape instanceof Rectangle) {
                if (this.shape.rectsOverlap(o.shape)) {
                    if (this.debug) {
                        console.log("collision with obstacle");
                    }
                    overlaps = true;
                    if (o instanceof ObstacleMur) {
                        o.handleCollision(this);
                    } else if (o instanceof ObstacleSwamp) {
                        o.handleCollision(this);
                    } else if (o instanceof ObstacleElectrifiedWall) {
                        o.handleCollision(this, entryPoint);
                    }
                }
            }
        }
        if(overlaps === false){
            this.isSlowed = false;
        }
    }
    pushPlayer(player) {
        var diffX = this.shape.x - player.shape.x;
        var diffY = this.shape.y - player.shape.y;

        if(this.debug){
            console.log("Collision : vitesses initiales : " + this.speedX + " " + this.speedY + " " + player.speedX + " " + player.speedY);
        }

        if(diffX>0 && diffX < this.shape.width*2){ //Il y a overlap et je suis à droite
            if(this.speedX < 0){//Si je vais vers la gauche
                if(player.speedX <= 0 && this.speedX < player.speedX) { //Si l'autre joueur aussi et que je vais plus vite
                    console.log("L'autre va aussi a gauche ou est immobile. Je vais plus vite, l'autre joueur prend ma vitesse");
                    player.speedX = this.speedX; //A VOIR
                }
                if(player.speedX>0){ //Si l'autre joueur va vers la droite, on se pousse mutuellement
                    console.log("L'autre va a droite. On se pousse mutuellement");
                    var temp = player.speedX;
                    player.speedX -= ((-this.speedX)/2); //A TWEAKER
                    this.speedX += temp/2;
                }
            }
        }
        if(diffX<0 && -diffX < this.shape.width){ //Il y a overlap et je suis à gauche
            if(this.speedX > 0){//Si je vais vers la droite
                if(player.speedX >= 0 && this.speedX > player.speedX) { //Si l'autre joueur aussi et que je vais plus vite
                    console.log("L'autre va aussi a droite. Je vais plus vite, l'autre joueur prend ma vitesse");
                    player.speedX = this.speedX; //A VOIR
                }
                if(player.speedX<0){ //Si l'autre joueur va vers la gauche, on se pousse mutuellement
                    console.log("L'autre va a gauche. On se pousse mutuellement");
                    var temp = player.speedX;
                    player.speedX += ((this.speedX)/2); //A TWEAKER
                    this.speedX -= (-temp)/2;
                }
            }
        }

        //Idem pour Y

        if(diffY>0 && diffY < this.shape.height){ //Il y a overlap et je suis en bas
            if(this.speedY < 0){//Si je vais vers le haut
                if(player.speedY <= 0 && this.speedY < player.speedY) { //Si l'autre joueur aussi et que je vais plus vite
                    player.speedY = this.speedY; //A VOIR
                }
                if(player.speedY>0){ //Si l'autre joueur va vers le bas, on se pousse mutuellement
                    var temp = player.speedY;
                    player.speedY -= ((-this.speedY)/2); //A TWEAKER
                    this.speedY += temp/2;
                }
            }
        }
        if(diffY<0 && -diffY < this.shape.height){ //Il y a overlap et je suis en haut
            if(this.speedY > 0){//Si je vais vers le bas
                if(player.speedY >= 0 && this.speedY > player.speedY) { //Si l'autre joueur aussi et que je vais plus vite
                    player.speedY = this.speedY; //A VOIR
                }
                if(player.speedY<0){ //Si l'autre joueur va vers le haut, on se
                    var temp = player.speedY;
                    player.speedY += ((this.speedY)/2); //A TWEAKER
                    this.speedY -= (-temp)/2;
                }
            }
        }
        if(this.debug){
            console.log("collision : vitesses finales : " + this.speedX + " " + this.speedY + " " + player.speedX + " " + player.speedY);
        }
    }

    calculateVelocity(inputStates, level) {
        this.speedX = this.speedY = 0;
        // check inputStates
        if (inputStates[this.commands.left]) {
            this.speedX -= this.speed;
        }
        if (inputStates[this.commands.up]) {
            this.speedY -= this.speed;
        }
        if (inputStates[this.commands.right]) {
            this.speedX += this.speed;
        }  
        if (inputStates[this.commands.down]) {
            this.speedY += this.speed;
        }
        
        //Actualisation des vitesses si collision
        this.checkCollisionWithObstacle(level.obstacles, level.entryPoint);
        
        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        if(this.isSlowed){
            this.speedX = this.speedX / 2;
            this.speedY = this.speedY / 2;
        }
        if(this.hasMalus){
            this.speedX = this.speedX / 2;
            this.speedY = this.speedY / 2;
        }
        if(this.hasBonus){ //On pourrait autoriser le cumul de bonus
            this.speedX = this.speedX * 2;
            this.speedY = this.speedY * 2;
        }        
    }

    checkCollisionWithPlayerAndPushThem(players){
        for (var j = 0; j < players.length; j++) {
            var p = players[j];
            if (p !== this && this.shape.rectsOverlap(p.shape)) {
                if (this.debug) {
                    console.log("collision with player");
                }
                this.pushPlayer(p);
            }
        }
    }

    invertCommands(){
        var temp = this.commands.up;
        this.commands.up = this.commands.down;
        this.commands.down = temp;
        temp = this.commands.left;
        this.commands.left = this.commands.right;
        this.commands.right = temp;
    }

    move(timer, canvasWidth, canvasHeight) {
        this.shape.x += timer.calcDistanceToMove(this.speedX);
        this.shape.y += timer.calcDistanceToMove(this.speedY);

        // Vérifier les collisions avec les bords du canvas
        if (this.shape.x < 0) {
            this.shape.x = 0;
            this.speedX = 0;
        } else if (this.shape.x + this.shape.width > canvasWidth) {
            this.shape.x = canvasWidth - this.shape.width;
            this.speedX = 0;
        }

        if (this.shape.y < 0) {
            this.shape.y = 0;
            this.speedY = 0;
        } else if (this.shape.y + this.shape.height > canvasHeight) {
            this.shape.y = canvasHeight - this.shape.height;
            this.speedY = 0;
        }
    }
}