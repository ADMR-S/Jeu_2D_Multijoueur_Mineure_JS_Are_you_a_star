//Idees
//Le premier commence en dernier ?
//Désactiver scrolling latéral avec les flèches?
//Répartir les balles équitablement ?
//Visuels (tower climb)
//Relancer le jeu sur une input après game Over ?

//TODO
//Musique de fond, sound effect lors des décomptes + son de victoire
//Ennemis qui poursuivent (font reprendre à l'entrée et despawn si collision)
//Interrupteurs

window.onload = function init(){
    const canvas = document.querySelector("#myCanvas");
    

    let levels = new Array(20); 
    for(var i = 0; i < levels.length; i++){
        if(i===0){
            levels[0] = new Level(1, 4, 1, 2, 0, new Circle(50, 50, 50, 'black'), canvas);
        }
        else if(i>=1 && i<4){
            levels[i] = new Level(i+1, 6, i+3, i-1, i-1, levels[i-1].exit, canvas); //La sortie du niveau précédent est l'entrée du prochain
        }
        else if(i>=4 && i<9){
            levels[i] = new Level(i+1, i, i+1, i, i-4, levels[i-1].exit, canvas); //La sortie du niveau précédent est l'entrée du prochain
        }
        else if(i>=9 && i<15){
            levels[i] = new Level(i+1, i, i-8, i-8, i%2, levels[i-1].exit, canvas); //La sortie du niveau précédent est l'entrée du prochain
        }
        else if(i>=15 && i<20){
            levels[i] = new Level(i+1, i, i-12, i-10, i-14, levels[i-1].exit, canvas); //La sortie du niveau précédent est l'entrée du prochain
        }
        else{ //Dernier niveau
            levels[i] = new Level(i+1, i, 5, 10, 5, levels[i-1].exit, canvas); //La sortie du niveau précédent est l'entrée du prochain
        }
        
    }
    // Load the sounds and start the game only when the backgroundMusic has been loaded
    ballEatenSound = new Howl({
        urls: ['https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3'],
    });
    gameEnded = new Howl({
        urls: ['sounds/gameEnded.mp3']
    });
    backgroundMusic = new Howl({
        urls: ['sounds/backgroundMusic.mp3'],
        loop: true,

        onload: function () {
            let sounds = {};
            sounds["ballEatenSound"] = ballEatenSound;
            sounds["backgroundMusic"] = backgroundMusic;
            sounds["gameEnded"] = gameEnded;
        
            let game = new Game(canvas, levels, sounds);
            game.startGame();
        }
    });
}