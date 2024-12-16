Jeu Javascript - Are you A* ?
Devenez vous-même un algorithme de pathfinding !

Implémenté par Adam MIR-SADJADI

-----------------------------------------------------------

-----------------------------------------------------------
JEU

Comment jouer : 
Le jeu se joue de 1 à 4 joueurs sur un même clavier (les inputs sont affichés sur la page, si l'on ajoute un joueur ses inputs s'affichent).
Avant d'appuyer sur entrée comme indiqué sur le menu du jeu, choisissez le nombre de joueurs via le champ prévu à cet effet en haut de la page.
Pour relancer le jeu depuis le début, rechargez la page web.

Règles du jeu :

Il y a 20 niveaux, chacun avec une entrée (un cercle orange), une sortie (un cercle bleu), des obstacles (rectangles) et des objets (cercles en mouvement)
L'objectif de chaque niveau est d'accéder à la sortie le plus rapidement possible
Un système de scoring récompense les joueurs qui arrivent vite, et davantage ceux qui arrivent en premier 
Les objets présents qui rebondissent entre les murs peuvent avoir deux effets :
- Positif :
	Si l'objet ramassé est de la couleur du joueur, ses malus sont annulés et sa vitesse est doublée jusqu'à ce qu'il attrape un malus (même s'il finit l'étage en cours, il conserve son bonus au début du prochain)
- Négatif : 
	Si l'objet ramassé est d'une couleur différente, le joueur perd son bonus s'il en a un et ses commandes sont inversées pendant 3 secondes
	Ramasser plusieurs malus successivement inversera plusieurs fois les touches du joueur et réinitialisera le timer de malus.
Ainsi, la prudence peut être récompensée et on cherchera à inciter les joueurs à emprunter des trajectoires parfaites.
Le but du jeu est d'obtenir le meilleur score, et donc de finir les 20 niveaux le plus rapidement et le mieux classé possible. (Le score max est le même en jeu solo ou à 4, le 1er ayant un multiplicateur de 1,3* le score restant qui s'applique, qui est pris en compte dans l'affichage prévisionnel du score en fonction des places restantes pour le niveau)
Les niveaux du jeu sont générés aléatoirement pour permettre une meilleure rejouabilité et mettre l'accent du gameplay sur la réflexion rapide lors du décompte initial et l'adaptation en temps réel aux déplacements des items. La difficulté est croissante au fil des niveaux (plus d'obstacles dangereux, plus d'items…).

Types d'obstacles :
	
	Swamps :
		Obstacles de couleur verte qui ralentissent le joueur (vitesse divisée de moitié) lorsqu'il les travers
	
	Murs :
		Obstacles de couleur noire que les joueurs ne peuvent pas traverser
	
	Murs électrifiés :
		Obstacle de couleur jaune avec une bordure rouge qui renvoient le joueur à l'entrée du niveau s'il les touche

----------------------------------------------------------------
CONCEPTION

Ayant l'habitude de coder en Java, ce projet a été l'opportunité d'appliquer les principes de la POO dans un projet de développement Web en Javascript.

Classes importantes :

	Game
		La classe principale de jeu est la classe Game, qui contient les informations du canvas, du nombre de joueurs, et tous les niveaux de jeu initialisés avant sa création. Chaque niveau génèrera ses items et obstacles en fonction des paramètres qui lui sont passés lors de l'initialisation du jeu (dans le fichier index.js)
		Cette classe dirige le fonctionnement du jeu en fonction de ses états (menu, jeu en cours ou partie terminée)
		Chaque état possède des méthodes associées, le cœur du jeu se trouvant dans les méthodes appelées lorsque le jeu est dans l'état gameRunning
		La fonction gameLoop est la fonction de callback appelée à chaque rafraîchissement par requestAnimationFrame.
		Dans l'état gameRunning, elle appelle runGame qui contient tout le fonctionnement de la boucle de jeu (actualisation des positions des entités, affichage via le dessin sur le canvas, décompte du nombre de joueurs qui doivent encore finir le niveau…). L'objet Game initialisé au départ contient tous les niveaux du jeu (dont on génère les objets et obstacles avant de les charger).

	Level
		Un niveau représente un étage du jeu. Pour chaque niveau, on définit le nombre d'items et d'obstacles de chaque type. Ces entités seront générées avant que le niveau ne soit chargée dans Game. La sortie d'un niveau est également l'entrée du niveau suivant (pour simuler une progression au travers d'escaliers), la sortie de chaque niveau est générée aléatoirement dans le coin opposé à l'entrée de la carte, en s'assurant qu'elle ne soit pas crée sur un obstacle intraversable. Les versions précédentes du jeu laissaient parfois la possibilité de créer un niveau infaisable (sortie située derrière des murs), mais les paramètres actuels ne m'ont pas fait retomber dans cette situation, sans certitude pour autant. Une amélioration envisageable serait d'empêcher deux obstacles d'être créés s'il ne reste pas un passage dont la taille fasse au moins (par exemple) 2 fois la taille du joueur, pour éliminer définitivement cette possibilité. Donner des conditions trop strictes empêchent cependant parfois la génération de se terminer, donnant lieu à des situations où, après avoir créé un certain nombre d'obstacles, le jeu cherche à placer un obstacle supplémentaire pour atteindre le nombre requis mais essaie indéfiniment car il ne génère jamais un obstacle qu'il parvienne à placer. Les paramètres actuels donnent un version fidèle à mon intention du gameplay. Par ailleurs, les méthodes comprises dans cette classe sont parfois lourdes et redondantes (étant donné que beaucoup d'ajustements ont été effectués) et mériteraient d'être revues pour être factorisées. D'un point de vue fonctionnel, elles s'intègrent bien au reste du code.

	Timer
		La classe Timer permet de gérer les comportements dépendant du temps ou du framerate (afficher le délai avant le début du niveau, gérer la durée des malus, calculer la distance des déplacements à effectuer pour ne pas accélerer le jeu au delà de 60 FPS...). Je me suis inspiré du code almost_real_game proposé car je trouvais son implémentation du calcul du delta (coefficient par lequel diviser chaque déplacement) à chaque rafraîchissement appropriée à une conversion en POO. Je l'ai donc adapté dans une classe ES6 afin d'ajuster chaque déplacement en fonction du nombre de frames qui séparent deux mouvements successifs, comme recommandé dans le cours et dans le documentation de l'API qui contient requestAnimationFrame. Le timer est remplacé à chaque niveau pour calculer le score marqué, mais l'on pourrait également avoir un timer global et d'autres champs à l'intérieur pour garder une trace du moment où l'on a débuté le niveau en cours. Une amélioration envisagée est d'afficher le temps de complétion total à la fin de la partie (une fonction à coder mais qui se situe loin dans la liste de mes priorités sur ce projet, tant on pourrait passer du temps à peaufiner chaque aspect).

	Entité
		La classe "abstraite" dont dérivent les items, les obstacles et les joueurs. Chacun se caractérise par des propriétés propres à sa classe, ainsi qu'à une représentation physique sur le canvas, avec une forme et des coordonnées. Les entités ont également une vitesse de déplacement (qui peut être nulle, c'est notamment le cas des obstacles car les items bougent déjà suffisamment pour ne pas rajouter une difficulté supplémentaire à mon goût). La méthode draw de cette classe est notamment essentielle car elle appelle un timer pour ajuste la distance de déplacement de chaque entité en fonction de sa vitesse et du framerate (le delta calculé précédemment).

	Obstacle
		La classe dont dérive chaque classe concrète d'obstacles qui a sa propre manière (via la surcharge de la méthode handleCollision) d'interagir avec le joueur.
	Item
		Les objets qui rebondissent sur les bordures du canvas, les murs et les murs électrifiés

	Player
		Chaque joueur est un Player, initialisé lorsque le jeu détecte que l'utilisateur a appuyé sur Entrée pour commencer la partie. Les inputs de chaque joueur lui sont assignés en fonction de son numéro de joueur via un switch configuré dans le constructeur de la classe. Un joueur possède un score personnel (classe Score, avec des méthodes de calcul du score qui permettent la prévisualisation en direct des points qu'on va marquer et de leur décrémentation avec le temps qui passe). Les joueurs peuvent se pousser entre eux. La méthode qui calcule les déplacements si un joueur en pousse un autre fonctionnement globalement correctement mais elle a quelques limites et soulève des problèmes connus. Notamment : Je peux pousser le joueur 3 en poussant le joueur 2 avec le joueur 1, mais je ne peux pas pousser le joueur 1 en poussant le joueur 2 avec le joueur 3. Cela vient notamment de l'ordre dans lesquels les déplacements sont calculés. Entre 2 joueurs tout fonctionne mais pour ce genre de cas à 3 joueurs, l'ordre du joueur dans le tableau des joueurs a une importance. Egalement, un joueur peut en pousser un autre au travers d'un mur s'il a suffisamment de vitesse. Le joueur ainsi poussé peut s'extraire du mur, donc cela ne bloque pas la partie et peut donner lieu à des situations amusantes, mais il s'agit d'un bug qui n'est pas encore résolu et qui provient de la gestion des interactions entre joueur/joueur et joueur/mur (c'est un compromis qui a été choisi pour pouvoir repousser le joueur légèrement des murs lorsqu'il entre en collision avec eux, pour éviter de bloquer une direction qui ne devrait pas l'être parce que l'on overlap sur 1 ou 2 pixels avec l'obstacle dans une direction qu'on devrait pouvoir emprunter).

	Les autres classes ont été mentionnées et n'ont pas besoin d'être abordées en détail (Utility, Score...)

Quelques pistes d'amélioration envisagées et pas encore mentionnées (outre encapsuler certains bouts de code et le rendre plus maintenable) :
	- Adapter la taille du canva à la taille de l'écran du joueur (deisgn réactif)
	- Actuellement, la position à laquelle on se trouve à la fin d'un niveau est la position à laquelle on commence le suivant. On pourrait envisager de ne pas faire commencer les joueurs superposés et de faire commencer le premier à être arrivé au niveau précédent plus loin de la sortie que les autres pour rééquilibrer le jeu, ou le faire commencer en tête c'est le cas dans la plupart des jeux de course.
	- La couleur des items créés est choisie aléatoirement à la création. on pourrait rendre la répartition équitable mais je trouve que l'implémentation actuelle pimente les parties.
	- Styliser la page et y ajouter un fond pour mettre dans l'ambiance d'un Tower Climb (briques, escaliers pour la sortie, menu et écran de fin plus graphiques…)
	- Donner la possibilité de relancer une partie via une commande ou un menu contextuel plutôt que devoir recharger la page

