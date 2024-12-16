class Timer{
    constructor(time, nbPlayers){
        this.startTime = time;
        this.oldTime = time;
        this.delta = 0;
        this.levelStartTimer = 5; // delay before user inputs are activated (in seconds)
        // vars for counting frames/s, used by the measureFPS function
        this.frameCount = 0;
        this.delayBeforeLevelStart = 3; // delay before user inputs are activated (in seconds)
        this.lastTime;
        this.fpsContainer = document.querySelector("#fpsContainer");
        this.fps;
        this.debug = false;
        //this.bonusTimer = new Array(nbPlayers).fill(0); Pas de timer pour les bonus au final
        this.malusTimer = new Array(nbPlayers).fill(0);
    }

    getElapsedTime(){
        if(this.debug){
            console.log("Old time = " + this.oldTime + " Start time = " + this.startTime);
            console.log("Elapsed time = " + (this.oldTime - this.startTime));
        }
        return this.oldTime - this.startTime;
    }

    measureFPSAndSetDelta(newTime){
        this.measureFPS(newTime);
        this.setDelta(newTime);
    }

    checkForDelay(){
        return this.getElapsedTime()/1000 < this.delayBeforeLevelStart;
    }

    
    measureFPS(newTime){ //Mesurer le nombre de fps depuis le dernier appel

        // test for the very first invocation
        if (this.lastTime === undefined) {
            this.lastTime = newTime;
            return;
        }

        //calculate the difference between last & current frame
        var diffTime = newTime - this.lastTime;

        if (diffTime >= 1000) { //Si plus d'une seconde s'est écoulée
            this.fps = this.frameCount; //On affiche le nombre de frames qu'on a compté
            this.frameCount = 0;
            this.lastTime = newTime;
        }

        //and display it in an element we appended to the 
        // document in the start() function
        this.fpsContainer.innerHTML = 'FPS: ' + this.fps;
        this.frameCount++;

        if(this.debug){
            console.log(this.frameCount);
            console.log(this.fps);
            console.log(diffTime);
        }
    };

    
    getDeltaAndSetOldTime(currentTime) { //Calculer le coefficient à appliquer pour garder la même vitesse/s
        var delta = currentTime - this.oldTime;
        this.oldTime = currentTime;
        return delta;
    }

    setDelta(time){
        this.delta = this.getDeltaAndSetOldTime(time);
    }

    calcDistanceToMove(speed){
        //console.log("#delta = " + delta + " speed = " + speed);
        return (speed * this.delta) / 1000;
    };

    removeBonusesOrMalusesIfTimeElapsed(players){
        for(let i=0; i<players.length; i++){
            /*
            if(this.bonusTimer[i] > 0){
                console.log("Bonus pour le joueur " + i + " : " + this.bonusTimer[i]);
                this.bonusTimer[i] -= this.delta/1000;
            }
            if(this.bonusTimer[i] <= 0){
                console.log("Fin du bonus pour le joueur " + i);
                players[i].hasBonus = false;
                if(this.malusTimer[i] <= 0){
                    players[i].shape.color = players[i].originalColor;
                }
            }
            */
            if(this.malusTimer[i] > 0){
                this.malusTimer[i] -= this.delta/1000;
            }
            if(this.malusTimer[i] <= 0){
                players[i].hasMalus = false;
                players[i].commands = structuredClone(players[i].originalCommands);
                if(!players[i].hasBonus){
                    players[i].shape.color = players[i].originalColor;
                }
            }
        }
    }
}