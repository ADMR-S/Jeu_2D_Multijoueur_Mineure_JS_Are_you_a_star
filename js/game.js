// Possible Game states
var gameStates = {
    mainMenu: 0,
    gameRunning: 1,
    gameOver: 2
};

class Game {
    constructor(canvas, levels, sounds) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.levels = levels;
        this.players = [];
        this.currentLevelNb = 1;
        this.maxLevel = 20;
        this.isFinished = false;
        this.inputStates = {};
        this.debug = false;
        this.gameState = gameStates.mainMenu;
        this.sounds = sounds;
    }

    startGame() {
        window.addEventListener('keydown', (event) => Utility.handleKeyDown(event, this.inputStates));
        window.addEventListener('keyup', (event) => Utility.handleKeyUp(event, this.inputStates));
        requestAnimationFrame((time) => this.gameLoop(new Timer(time, this.players.length), time)); 
        //On initialise tout de même le timer sur le menu uniquement pour afficher le nombre de FPS dès le départ
    }

    gameLoop(timer, lastTime) { //Boucle principale qui gère les différents états du jeu
        if(this.debug){
            console.log("Début Callback");
        }
        switch(this.gameState){
            case gameStates.mainMenu:
                this.runMainMenu(timer, lastTime);
                break;
            case gameStates.gameRunning:
                this.runGame(timer, lastTime);
                break;
            case gameStates.gameOver:
                this.drawGameOver(timer, lastTime);
                break;
            default:
                console.log("Invalid game state");
                break;
        }
    }

    //---------------------------------
    //METHODES PRINCIPALES ETATS DE JEU
    //---------------------------------

    drawMainMenu(){
        this.ctx.save();
        this.ctx.translate(0, 0);
        this.ctx.fillStyle = 'black';
        this.ctx.font = "30px Arial";
        this.ctx.fillText("ARE YOU  A* ?", this.w/2 - 115, this.h/2);
        this.ctx.fillText("Please choose the number of players then press <ENTER> to start", 5, this.h/2 + 150);
        this.ctx.restore();
    }

    runMainMenu(timer, lastTime){ //Fonction de l'état "menu"
        timer.measureFPSAndSetDelta(lastTime);

        Utility.resetCanvas(this.canvas);
        this.drawMainMenu();

        if(this.inputStates["Enter"]){ //Détection du début de la partie
            let nbPlayers = document.querySelector("#nbPlayers").value;
            let players = [];
            for (let i=1; i<=nbPlayers; i++){
                let player = new Player(i);
                players.push(player);
            }
            this.players = players;
            let level = this.levels[this.currentLevelNb-1];
            level.createItems(this.w, this.h, this.players);
            level.createObstacles(this.w, this.h);
            this.sounds["backgroundMusic"].play();
            this.gameState = gameStates.gameRunning;
            requestAnimationFrame((time) => this.gameLoop(new Timer(time, this.levels[this.currentLevelNb - 1].timeLimit), time));
        } else {
            requestAnimationFrame((time) => this.gameLoop(timer, time));
        }
    }

    runGame(timer, lastTime){  //Fonction de l'état "gameRunning"
        timer.measureFPSAndSetDelta(lastTime);
        timer.removeBonusesOrMalusesIfTimeElapsed(this.players);

        let level = this.levels[this.currentLevelNb-1];

        Utility.resetCanvas(this.canvas);

        level.draw(this.ctx);
        if (timer.checkForDelay()) { //Si on attend la fin du délai
            this.players.forEach(player => player.draw(this.ctx));
            this.printTimeRemainingBeforeStart(timer);
            requestAnimationFrame((time) => this.gameLoop(timer, time));
        }

        else{//Sinon le jeu tourne
            level.nbPlayersFinished += this.drawThenMoveEachPlayerAndCountHowManyFinished(timer, level);
            
            this.moveItemsAndCheckCollisions(level, timer);

            if(this.debug){
                console.log("Nombre de joueurs ayant fini : " + level.nbPlayersFinished);
                console.log("Nombre de joueurs : " + this.players.length);
            }

            if (level.nbPlayersFinished === this.players.length) { //Si tous les jours ont fini le niveau
                this.currentLevelNb++; //On passera au suivant en relançant la boucle
                this.players.forEach(player => player.hasFinished = false); //On réinitialise les joueurs
                if (this.currentLevelNb > this.maxLevel) {//Si c'était le dernier niveau
                    this.isFinished = true;
                    this.sounds["gameEnded"].play();
                    this.gameState = gameStates.gameOver; //La partie est finie
                    requestAnimationFrame((time) => this.gameLoop(timer, time));
                }
                else {
                    //On crée un nouveau timer si on change de niveau
                    let nextLevel = this.levels[this.currentLevelNb-1];
                    nextLevel.createItems(this.w, this.h, this.players);
                    nextLevel.createObstacles(this.w, this.h);
                    requestAnimationFrame((time) => this.gameLoop(new Timer(time, this.players.length), time));
                }
            }
            else {
                requestAnimationFrame((time) => this.gameLoop(timer, time));
            }
        }
    }
    
    drawGameOver(timer, lastTime){
        timer.measureFPSAndSetDelta(lastTime);
        Utility.resetCanvas(this.canvas);

        if(this.isFinished){
            this.ctx.save();
            this.ctx.translate(0, 0);
            this.ctx.fillStyle = 'black';
            this.ctx.font = "30px Arial";
            this.ctx.fillText("SUCCESS", this.w/2 - 80, this.h/2);
            this.ctx.fillText(`Winner: Player ${this.leader.playerNumber} with ${this.leader.getTotalScore().toFixed(0)} points. You are a star !`, 0, this.h/2 + 80);
            this.ctx.fillText(`Rechargez la page pour rejouer`, 0, this.h/2 + 160);
            this.ctx.restore();
        }
        //else si l'on souhaite implémenter un game over sans forcément aller au bout du jeu
        requestAnimationFrame((time) => this.gameLoop(timer, time));
    }

    //---------------------------------
    //FONCTIONS APPELEES DANS L'ETAT GAME RUNNING
    //---------------------------------

    drawThenMoveEachPlayerAndCountHowManyFinished(timer, level){
        let nbPlayersFinished=0;

        this.players.forEach(player => {
            if(!player.hasFinished){
                player.draw(this.ctx);
                player.calculateVelocity(this.inputStates, level);
            }
        });
        this.players.forEach(player => {
            if(!player.hasFinished){
                player.checkCollisionWithPlayerAndPushThem(this.players);
            }
        });
        this.players.forEach(player => {
            if(!player.hasFinished){
                player.move(timer, this.w, this.h);
                if(level.exit.circRectsOverlap(player.shape)){ //Si le joueur vient d'arriver sur la sortie
                    player.hasFinished = true;
                    nbPlayersFinished++;
                    player.updateScore(timer.getElapsedTime() - 3000, level.nbPlayersFinished+1, this.players.length); // Décrémenter le score après 3 secondes
                }
            }
        });

        this.updateScoreDisplay(timer, level);

        return nbPlayersFinished;
    }

    updateScoreDisplay(timer, level) {
        const scoreList = document.getElementById('scoreList');
        scoreList.innerHTML = '';
        let highestScore = 0;
        let leader = null;

        this.players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `Player ${player.playerNumber}: ${player.getTotalScore().toFixed(0)}`;
            scoreList.appendChild(li);

            if (player.getTotalScore() > highestScore) {
                highestScore = player.getTotalScore();
                leader = player;
            }
        });

        const levelScore = document.createElement('p');
        const previewScore = this.players[0].getPreviewScore(timer.getElapsedTime()-3000, level.nbPlayersFinished + 1, this.players.length);
        levelScore.textContent = `Level Score: ${previewScore.toFixed(0)}`;
        scoreList.appendChild(levelScore);

        this.leader = leader;
    }

    moveItemsAndCheckCollisions(level, timer) {
        var players = this.players;
        var w = this.w; // Utiliser la largeur du canvas
        var h = this.h; // Utiliser la hauteur du canvas
        var collision = new Array(players.length);
        level.items.forEach((item, itemIndex) => {
            if(this.debug){
                console.log("On bouge un item");
                console.log("Position de l'item : " + item.shape.x + " " + item.shape.y);
                console.log("Vitesse de l'item : " + item.speedX + " " + item.speedY);
            }
            item.move(timer); //On déplace chaque item
            if(this.debug){
                console.log("Nouvelle position de l'item : " + item.shape.x + " " + item.shape.y);
            }
            item.checkCollisionsWithWalls(w, h); //S'il y a des collisions avec les bords du canva, on corrige le déplacement et on inverse les vitesses
            
            level.obstacles.forEach(obstacle => {  //S'il y a des collisions avec les obstacles, on corrige le déplacement et on inverse les vitesses                  
                if(item.testItemObstacle(obstacle)) {
                console.log(" ###### COLLISION");
                }  
            });

            // Test de collision avec les joueurs
            players.forEach((player, index) => {
                if (item.shape.circRectsOverlap(player.shape)) {
                    console.log("Collision avec le joueur " + player.playerNumber);
                    collision[index] = true;
                    if(item.shape.color === player.originalColor){
                        player.shape.color = player.bonusColor;
                        player.hasBonus = true;
                        player.hasMalus = false;
                        timer.malusTimer[index] = 0; //On remet le timer du malus à 0
                        //timer.bonusTimer[index] = 3; //Durée du bonus en secondes
                    }
                    else{
                        player.shape.color = player.malusColor;
                        //player.hasMalus = true; Activer cette ligne pour ralentir le joueur en plus
                        player.hasBonus = false; //On perd notre bonus si on prend un malus
                        player.invertCommands();
                        player.reversed = true;
                        //timer.bonusTimer[index] = 0; //On remet le timer du bonus à 0
                        timer.malusTimer[index] = 3; //Durée du malus en secondes
                    }
                    level.items.splice(itemIndex, 1); //On retire l'objet de la liste des objets
                    this.sounds["ballEatenSound"].play();
                }
            });
        });
    }
    
    printTimeRemainingBeforeStart(timer){
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'white';
        const text = `Starting in ${Math.ceil(3 - timer.getElapsedTime()/1000)}`;
        this.ctx.strokeText(text, this.w / 2, this.h / 2);
        this.ctx.fillText(text, this.w / 2, this.h / 2);
        this.ctx.restore();
    }
}
