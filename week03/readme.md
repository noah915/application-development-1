# Week 3 — Node Project

Ce dépôt contient le projet de la semaine 3. Les fichiers importants sont dans le dossier `week03/`.

## Comment j'ai réalisé le travail

Ressources utilisées:

- Node.js process documentation: https://nodejs.org/api/process.html
- npm scripts documentation: https://docs.npmjs.com/cli/v9/commands/npm-start
- MDN Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

J'ai aussi utilisé l'assistant GitHub Copilot (via conversation) pour automatiser la création des fichiers et commits dans une branche `add-week03`.

## Description des fichiers

- `index.js`: programme Node qui affiche l'entête d'identification, les informations d'exécution, les variables d'environnement (PORT et NODE_ENV), et un objet `appConfig` affiché au format JSON.
- `package.json`: contient les scripts `start` et `dev`.

## Réponses aux questions demandées

1) Qu'est-ce que `package.json` fait?

`package.json` contient les métadonnées du projet Node (nom, version, scripts, dépendances, etc.). Il permet à npm de savoir comment exécuter des tâches (via `npm run <script>`), d'installer des dépendances et de partager le paquet.

2) Qu'est-ce que `process.env`?

`process.env` est un objet fourni par Node.js qui contient les variables d'environnement de l'environnement d'exécution. On y lit et on peut définir des variables comme `PORT` ou `NODE_ENV`.

3) Qu'est-ce que `npm start` exécute?

`npm start` exécute le script `start` défini dans `package.json`. Ici il lance `node index.js`.

4) Bugs / erreurs rencontrés et résolution

Aucun bug majeur n'a été rencontré lors de la création des fichiers. Si vous utilisez Windows et que la commande `npm run dev` ne définit pas correctement la variable d'environnement `NODE_ENV`, utilisez la variante Windows dans `package.json` ou installez `cross-env` pour une compatibilité multiplateforme.

## Commandes Git utilisées

From repository root:

```
git status
git add week03
git commit -m "Initialize Week 3 Node project and runtime configuration"
git push --set-upstream origin add-week03
```
