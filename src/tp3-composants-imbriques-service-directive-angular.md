# TP 3
> Créer une liste d'utilisateurs en ligne

Dans ce TP, nous allons créer un tableau contenant la liste des utilisateurs avec leur statut en ligne. 

Pour rappel, la structure initiale du projet est la suivante :

```
src/app
├── app.component.css
├── app.component.html
├── app.component.spec.ts
├── app.component.ts
├── app.module.ts
```

## Notre 1er Service 

Dans le dossier `src/app`, créer votre 1er service sous le nom UserService.

Pour aller plus vite, vous pouvez utiliser l'outil `@angular/cli` pour créer votre service.

`ng g service user`

```
src/app
├── user.service.spec.ts
├── user.service.ts
```

Ce service retourne la liste de tous les utilisateurs avec leur statut en ligne :
```json
[
    {"id": 1, "email": "john.doe@gmail.com", "status": "online"},
    {"id": 2, "email": "jane.doe@gmail.com", "status": "online"},
    {"id": 3, "email": "jean.dupond@gmail.com", "status": "busy"},
    {"id": 4, "email": "jean.dupont@gmail.com", "status": "offline"},
    {"id": 5, "email": "jeanne.dupond@gmail.com", "status": "offline"},
    {"id": 6, "email": "joe.doe@gmail.com", "status": "online"}
]
```

## Composant tableau des utilisateurs

Dans le dossier `src/app`, créer un dossier `user-table` qui contiendra tout le code source du composant UserTableComponent.

Ce composant UserTableComponent affiche la liste des utilisateurs avec leur statut dans tableau HTML.

Pour aller plus vite, vous pouvez utiliser l'outil `@angular/cli` pour créer votre composant.

`ng g component user-table`

Ajouter les feuilles de style à votre composant pour que :
```
    - les lignes pairs soient en fonds gris clair
    - le texte 'online' soit en vert
    - le texte 'offline' soit en gris clair
    - le texte 'busy' soit en rouge
    - l'entête du tableau soit en fonds bleu clair, avec le texte en blanc
```

Cliquer sur le texte descriptif (balise caption) du tableau pour cacher/afficher les utilisateurs hors ligne.
```
    Le texte du caption est sousligné.
    Chaque clic fait permuter les textes suivants :  
    "Cliquez sur ce texte pour cacher les utilisateurs hors ligne", texte stylisé en gris clair
    "Cliquez sur ce texte pour afficher les utilsateurs en ligne", texte stylisé en bleu foncé
```

Ci-dessous le code source ajouté au projet :

```
src/app
└── user-table
    ├── user-table.component.css
    ├── user-table.component.html
    ├── user-table.component.spec.ts
    └── user-table.component.ts
```

## Composant enfant

Créer un composant UserTableRowComponent représentant une ligne du tableau.

Pour aller plus vite, vous pouvez utiliser l'outil `@angular/cli` pour créer votre composant.

`ng g component user-table-row`

Modifier votre code pour intégrer ce composant dans le composant UserTableComponent.

Ci-dessous le code source ajouté au projet :

```
src/app
└── user-table-row
    ├── user-table-row.component.css
    ├── user-table-row.component.html
    ├── user-table-row.component.spec.ts
    └── user-table-row.component.ts
```

## Conclusion

Ce TP vous aura appris à :

* utiliser les directives intégrées à Angular (*ngIf, *ngFor)
* créer un service Angular et l'injecter dans un composant
* créer des composants avec une relation parent-enfant
* créer et utiliser un template


[Suivant](tp4-formulaire-route.md)

