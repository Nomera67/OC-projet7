# Projet 7 d'OpenClassrooms : Mon Vieux Grimoire

Bienvenue sur mon repository GitHub destiné à la réalisation du projet 7 de la formation de développeur web OpenClassrooms : « Développez le back-end d'un site de notation de livres »

## Contexte

Ce projet consiste à créer le back-end du site Mon Vieux Grimoire et de l'utiliser sur un front-end déjà configuré en React fourni

### Choix techniques

Ce back-end est fait en Node.js et plusieurs choix ont dû être faits. Des demandes notamment sur l'encryption d'un mot de passe, l'utilisation d'un environnement de développement, l'utilisation de Mongo DB Atlas ou encore de JSON Web Token et de l'optimisation d'une image m'ont fait utiliser : 

- Express : 4.19.2
- Mongoose : 8.3.1
- Dotenv : 16.4.5
- CORS : 2.8.5
- Bcrypt : 5.1.1
- Multer : 1.4.5
- Sharp : 0.33.3

Comme demandé dans les différents documents techniques, toutes les routes ont été créées avec les points d'accès spécifiques fournis pour permettre une utilisation sans modification du front-end.

### Remarques

Des commentaires ont été rajoutés dans tous les fichiers pour permettre à toute personne de les réutiliser tout en comprenant la base du projet et l'articulation de celui-ci. Lors de l'utilisation plusieurs retours en console sont prévus pour le débug mais aussi pour permettre à l'utilisateur de comprendre le fonctionnement de l'application.

### Arborescence

L'arborescence des projets Node pouvant être propre à chacun, j'ai essayé d'en créer une logique qui permettrait de s'y retrouver même sans forcément connaître ma méthode. On retrouve dans le dossier racine, dans l'ordre alphabétique :

- Config : Dossier contenant les variables d'environnement avec url MongoDB et phrase de hash JSON Web Token
- Controllers : Contient les deux controllers principaux de l'application à savoir authControllers et booksControllers
- Images : Dossier où sont stockées les images liées aux livres présents dans la base de données
- Middleware : Contient les trois middlewares de l'application à savoir celui d'authentification, authMiddleware, d'optimisation d'image, optimization, et de vérification de l'upload des images, upload
- Models : Contient les models spécifiques à l'envoie de données à la base de données, ici Book et User
- Node_modules : Contient toutes les extensions et fichiers utilisés pour le back-end (et bien plus, c'est node_modules après tout)
- Routes : Contient les routes utilisées par l'application dans auth, pour l'authentification, et books, pour la gestion des livres

Le dossier racine comprend également le fichier index avec l'initialisation du projet, l'utilisation de CORS, la définition du port utilisé et les préfixes de connexion

## Auteur

- [@Nomera67 / Yan Rechtenstein](https://www.github.com/Nomera67)

