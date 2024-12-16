class Level{
    constructor(number, nbItems, nbSwamps, nbWalls, nbElectrifiedWalls, entryPoint, canvas){
        this.number = number;
        this.debug = false;
        this.nbItems = nbItems;
        this.items = []; //On crée les items avant de charger le niveau dans le callback de la classe Game
        this.nbSwamps = nbSwamps;
        this.nbWalls = nbWalls;
        this.nbElectrifiedWalls = nbElectrifiedWalls;
        this.obstacles = []; //On crée les obstacles avant de charger le niveau dans le callback de la classe Game
        this.nbPlayersFinished = 0;
        this.entryPoint = entryPoint
        this.exit = this.createExit(canvas.width, canvas.height);
        if(this.debug){
            console.log(this.exit.x + " " + this.exit.y + "Coordonnées de la sortie");
        }
    }
    draw(ctx) {
        this.drawEntry(ctx);
        this.drawExit(ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        this.items.forEach(item => item.draw(ctx));
    }

    drawExit(ctx){
        ctx.save();
        ctx.translate(this.exit.x, this.exit.y);
        ctx.fillStyle = "skyBlue";
        ctx.beginPath();
        ctx.arc(0, 0, this.exit.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }
    drawEntry(ctx){
        ctx.save();
        ctx.translate(this.entryPoint.x, this.entryPoint.y);
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(0, 0, this.entryPoint.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }


    createExit(w, h){ //On crée la sortie à l'opposé de l'entrée
        while(true){
            var x, y;

            if(this.entryPoint.x > w/2) x = w/3 - Math.random() * w/3; // entre 0 et 300
            else x = 2*w/3 + Math.random() * w/3; // entre 600 et 900

            if(this.entryPoint.y > h/2) y = h/3 - Math.random() * h/3; // entre 0 et 300
            else y = 2*h/3 + Math.random() * h/3; // entre 0 et hauteur du canvas

            var exit = new Circle(x, y, 50, "black");

            // Vérifier que la sortie ne se crée pas sur un obstacle
            var valide = true;
            this.obstacles.forEach(obstacle => {
                if (exit.circRectsOverlap(obstacle.shape)) {
                    valide = false;
                }
            });

            if (valide && !exit.checkCollisionsWithWalls(w, h)) {
                return exit;
            }
        }
    }

    createItems(w, h, players) {
        var tabCouleur = ["red", "blue", "green", "yellow"];
        let n = this.nbItems;

        for (var i = 0; i < n; i++) {
            if (this.debug){
                console.log("On essaie de créer un item");
            }
            var x = Math.random() * w; // entre 0 et largeur du canvas
            var y = Math.random() * h; // entre 0 et hauteur du canvas
            var rayon = 10 + 10*Math.random();
            var numCouleur = Math.floor(Math.random() * tabCouleur.length);
            var couleur = tabCouleur[numCouleur];
            var speedX = (Math.random() - 0.5) * 1000; // Vitesse entre -5 et 5
            var speedY = (Math.random() - 0.5) * 1000; // Vitesse entre -5 et 5

            var b = new Item(x, y, rayon, couleur, speedX, speedY);

            if (this.debug){
                console.log("On a créé un item aux coordonnées : " + x + " " + y);
                console.log("Vitesse de l'item : " + b.speedX + " " + b.speedY);
            }
            // Vérifier qu'elle n'est pas sur un obstacle ou un joueur
            var valide = true;
            this.obstacles.forEach(obstacle => {
                if (b.shape.circRectsOverlap(obstacle.shape)) {
                    valide = false;
                    i--;
                }
            });
            players.forEach(player => {
                if (b.shape.circRectsOverlap(player.shape)) {
                    valide = false;
                    i--;
                }
            });
            if (valide) {
                if (this.debug) {
                    console.log("On a réussi !");
                }
                this.items.push(b);
            }
        }
        if(this.debug){
            console.log("Items créés");
        }
    }

    createSwamps(w, h) {
        for (var i = 0; i < this.nbSwamps; i++) {
            if (this.debug) {
                console.log("On essaie de créer un obstacle");
            }
            var x = Math.random() * w; // entre 0 et largeur du canvas
            var y = Math.random() * h; // entre 0 et hauteur du canvas
            var width = 50 + 300 * Math.random(); //Entre 50 et 350px
            var height = 50 + 300 * Math.random();
            var obstacle = new ObstacleSwamp(x, y, width, height);

            if (this.debug) {
                console.log("On a créé un obstacle aux coordonnées : " + x + " " + y);
            }
            // Vérifier qu'il n'est pas sur l'entrée (on autorise les obstacles à se superposer)
            var valide = true;
            if (this.entryPoint.circRectsOverlap(obstacle.shape) ||
                this.exit.circRectsOverlap(obstacle.shape)) {
                valide = false;
                i--;
            }
            if (valide) {
                if (this.debug) {
                    console.log("On a réussi !");
                }
                this.obstacles.push(obstacle);
            }
        }
    }
    createWalls(w, h) {
        for (var i = 0; i < this.nbWalls; i++) {
            if (this.debug) {
                console.log("On essaie de créer un obstacle");
            }
            var x = Math.random() * w; // entre 0 et largeur du canvas
            var y = Math.random() * h; // entre 0 et hauteur du canvas
            var width = 50 + 100 * Math.random(); //Entre 50 et 150px
            var height = 50 + 100 * Math.random(); //Entre 50 et 150px
            var random = Math.round(Math.random());

            var obstacle

            if(random === 0){
                obstacle = new ObstacleMur(x, y, width, height/3); //On veut des murs fins dans les deux directions
            }
            else{
                obstacle = new ObstacleMur(x, y, width/3, height);
            }

            if (this.debug) {
                console.log("On a créé un obstacle aux coordonnées : " + x + " " + y);
            }
            // Vérifier qu'il n'est pas sur l'entrée, la sortie ou un autre mur
            var valide = true;
            if (this.entryPoint.circRectsOverlap(obstacle.shape) ||
                this.exit.circRectsOverlap(obstacle.shape)) {
                valide = false;
                i--;
            }
            this.obstacles.forEach(existingObstacle => {
                if (existingObstacle instanceof ObstacleMur || existingObstacle instanceof ObstacleElectrifiedWall) {
                    if (obstacle.shape.rectsOverlap(existingObstacle.shape)) {
                        valide = false;
                        i--;
                    }
                }
            });
            if (valide) {
                if (this.debug) {
                    console.log("On a réussi !");
                }
                this.obstacles.push(obstacle);
            }
        }
    }
    createElectrifiedWalls(w, h) {
        for (var i = 0; i < this.nbElectrifiedWalls; i++) {
            if (this.debug) {
                console.log("On essaie de créer un obstacle");
            }
            var x = Math.random() * w; // entre 0 et largeur du canvas
            var y = Math.random() * h; // entre 0 et hauteur du canvas
            var width = 50 + 200 * Math.random(); //Entre 50 et 250px
            var height = 50 + 200 * Math.random(); //Entre 50 et 250px
            var obstacle = new ObstacleElectrifiedWall(x, y, width, height);

            if (this.debug) {
                console.log("On a créé un obstacle aux coordonnées : " + x + " " + y);
            }
            // Vérifier qu'il n'est pas sur l'entrée (on autorise les obstacles à se superposer)
            var valide = true;
            if (this.entryPoint.circRectsOverlap(obstacle.shape) ||
                this.exit.circRectsOverlap(obstacle.shape)) {
                valide = false;
                i--;
            }
            this.obstacles.forEach(existingObstacle => {
                if (existingObstacle instanceof ObstacleMur || existingObstacle instanceof ObstacleElectrifiedWall) {
                    if (obstacle.shape.rectsOverlap(existingObstacle.shape)) {
                        valide = false;
                        i--;
                    }
                }
            });
            if (valide) {
                if (this.debug) {
                    console.log("On a réussi !");
                }
                this.obstacles.push(obstacle);
            }
        }
    }
    createObstacles(w, h) {
        if(this.debug){
            console.log("Création des obstacles");
        }
        this.createSwamps(w, h);
        if(this.debug){
            console.log("Swamps créés");
        }
        this.createElectrifiedWalls(w, h);
        if(this.debug){
            console.log("Murs électrifiés créés");
        }
        this.createWalls(w, h);
        if(this.debug){
            console.log("Murs créés");
        }
    }
}
