# TP 1 - Installation de l'environnement

## Prérequis

Vérifier que vous avez les éléments suivants d’installé sur votre poste :

* Node v6 ou plus avec la commande npm –v,
* Git, nous l’utiliserons pour récupérer le projet initial,
* Webstorm (ou un autre IDE)

## Installation
### Initialisation du projet

Nous allons utiliser l'outil `@angular/cli` pour générer le projet. Placez-vous dans votre workspace 
et lancez les commandes suivantes :

```bash
npm install -g @angular/cli
ng new tp-angular
cd tp-angular
```

> Une fois le projet créé vous pouvez l'ouvrir dans votre IDE.

Pour lancer le serveur de développement :

```bash
ng serve
```

## Générer des Composants, Directives, Pipe, etc...

Vous pouvez utiliser la commande `ng generate` (ou `ng g`) pour générer des composants Angular : 

```bash
ng generate component my-new-component
ng g component my-new-component # using the alias

# components support relative path generation
# if in the directory src/app/feature/ and you run
ng g component new-cmp
# your component will be generated in src/app/feature/new-cmp
# but if you were to run
ng g component ../newer-cmp
# your component will be generated in src/app/newer-cmp
```
Voici la liste des commandes possibles pour générer une fonctionnalité d'Angular: 

Génération  | Usage
---       | ---
[Component](https://github.com/angular/angular-cli/wiki/generate-component) | `ng g component my-new-component`
[Directive](https://github.com/angular/angular-cli/wiki/generate-directive) | `ng g directive my-new-directive`
[Pipe](https://github.com/angular/angular-cli/wiki/generate-pipe)           | `ng g pipe my-new-pipe`
[Service](https://github.com/angular/angular-cli/wiki/generate-service)     | `ng g service my-new-service`
[Class](https://github.com/angular/angular-cli/wiki/generate-class)         | `ng g class my-new-class`
[Guard](https://github.com/angular/angular-cli/wiki/generate-guard)         | `ng g guard my-new-guard`
[Interface](https://github.com/angular/angular-cli/wiki/generate-interface) | `ng g interface my-new-interface`
[Enum](https://github.com/angular/angular-cli/wiki/generate-enum)           | `ng g enum my-new-enum`
[Module](https://github.com/angular/angular-cli/wiki/generate-module)       | `ng g module my-module`

[Suivant](https://github.com/NodeAndTyped/labs-typescript/blob/master/tp2-composant.md)
