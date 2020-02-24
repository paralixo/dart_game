# TP Dart Game
## Installation
A la racine du projet

    yarn install

## Lancement
### API 

    yarn api
    
Aller sur `localhost:3000`

### CLI 

    yarn cli

## Utilisation du CLI
### Mode de jeu
Saisir le mode de jeu souhaité au dabut de l'application :

    0 - Around The World
    1 - 301
    2 - Cricket
    
### Joueurs
Après avoir choisi le mode de jeu, il vous faut saisir le nombre de joueurs
(au moins 2), puis assigner un nom à chaque joueur.

### Tour d'un joueur
A chaque lancer, un tableau récapitulatif des scores s'affiche avec le nombre
de coups restants.
Il faut saisir le tir du joueur sous la forme :

    [secteur]*[multiplicateur]
    
Note: la saisie du multiplicateur n'est pas obligatoire (valeur de 1 par défaut).

## Utilisation Web
### Accueil (`localhost:3000`)
Vous avez la possibilité de gérer les joueurs en base, 
de créer une nouvelle partie, de visualiser et/ou supprimer les parties déjà
 en base.
 
### Gestion des joueurs (`localhost:3000/players`)
Visualisation de tous les joueurs disponibles avec possibilité de les modifier/supprimer.
Il est possible de créer un nouveau joueurs.

### Création de joueur (`localhost:3000/players/new`)
Ajout d'un nom et d'un email obligatoire.

### Modification de joueur (`localhost:3000/players/:id/edit`)
Modification possible du nom et de l'email.

### Création de partie (`localhost:3000/games/new`)
Ajout du nom et sélection du mode de jeu obligatoire

### Visualisation de partie (`localhost:3000/games/:id`)
#### Général
Visualisation de la partie et des joueurs. 

#### Statut: en cours de préparation
Possibilité d'ajouter des joueurs.
Possibilité de lancer la partie si il y a plus de 2 joueurs.

#### Statut: Lancée
Visualisation du joueur courant (nom, tirs restants et score).
Possibilité de saisir le tir du joueur.
Visualisation de l'historique de la partie (les tirs).

#### Statut: Terminée
Visualisation des places des joueurs.
Visualisation de l'historique de la partie (les tirs).

### Modification des joueurs d'une partie (`localhost:3000/games/:id/players`)
Possibilité d'ajouter ou supprimer un joueur de la partie si celle-ci est en cours de préparation.

## API (vues web incluses)
Routes disponibles: 
- GET /
- GET /players
- POST /players
- GET /players/new
- GET /players/{id}
- GET /players/{id}/edit
- PATCH /players/{id}
- DELETE /players/{id}
- GET /games
- GET /games/new
- POST /games
- GET /games/{id}
- GET /games/{id}/edit
- PATCH /games/{id}
- DELETE /games/{id}
- GET /games/{id}/players
- POST /games/{id}/players
- DELETE /games/{id}/players
- POST /games/{id}/shots
- DELETE /games/{id}/shots/previous
- GET /*

## Notes de l'auteur
- Je m'excuse d'avance quant à la propreté du code : j'ai agi précipitemment sur la fin du projet.
- Pour la même raison qu'au-dessus, le typescript n'a pas toujours été bien utilisé.
- N'ayant pas compris comment joindre l'engine et l'API via des EventEmitters, j'ai directement intégré 
le code de l'engine dans l'API (je suis très intéressé par cette partie de la correction!)
- Le mode de jeu cricket ne fonctionne pas (uniquement un début de recherche)
- Dans le mode Tour du monde, le score représente le secteur à atteindre (21 signifie que le joueur a gagné)

*Réalisé par **Florian Lafuente***
