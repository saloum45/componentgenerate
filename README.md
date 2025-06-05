# JantTaf 
**JantTaf** vous permet de générer une application Angular complète en quelques clics.
**Votre projet** sera composé de:
- Frontend (Angular) → Généré avec la bibliothèque **jant-taf** ( https://www.npmjs.com/package/jant-taf )
- Backend (PHP) → Généré automatiquement à partir d'une base de données avec **Taf Backend** ( https://taf.jant.tech )


# Mise en place du Frontend (Angular) avec jant-taf
## Prérequis
- Créez un fichier **JSON** dans la racine du projet nommé **taf.config.json** avec le contenu suivant
- Vous pouvez copier le contenu complet adapté à votre projet directement depuis votre **Backend (PHP) généré par Taf Backend**
```
{
	"projectName": "projet1.angular",// nom de votre projet angular
	"decription": "Fichier de configuration de Taf",
	"taf_base_url": "http://localhost/backend/taf/taf_angular/",// emplacement de taf backend (plus d'informations https://taf.jant.tech)
	"les_modules": [// tous les modules à générer
		{
			"module": "home",
			"les_tables": [
				// ici les configuration des tables à générer pour le module home
			]
		},
		{
			"module": "public",
			"les_tables": [
				// ici les configuration des tables à générer pour le module public
			]
		}
	]
}
```
- Installer la présente bibliothèque **jant-taf**
```
npm install jant-taf
```
- Installer la bibliothèque **@auth0/angular-jwt**
```
npm install @auth0/angular-jwt
```
- Installer la bibliothèque **SweetAlert2** pour les notifications
```
npm install sweetalert2
```
- Installer la bibliothèque **Momentjs** pour les notifications
```
npm install moment
```
- Installer la bibliothèque **ng-bootstrap** (https://ng-bootstrap.github.io)
```
ng add @ng-bootstrap/ng-bootstrap
```
- Installer la bibliothèque **bootstrap && bootstrap-icons**
```
npm install bootstrap bootstrap-icons
```
- Importez bootstrap (CSS && JS) avec l'aide du fichier **angular.json**
```
"styles": [
	"src/styles.scss",
	"node_modules/bootstrap/dist/css/bootstrap.css",
	"node_modules/bootstrap-icons/font/bootstrap-icons.css"
],
"scripts": [
	"node_modules/bootstrap/dist/js/bootstrap.js"
],
```

- Configurer le **HttpClient** dans le module principal **app.config.ts**
```
.......................................................
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),provideHttpClient()]
};
```

## Générer complètement l'application
```
ng generate jant-taf:taf
```
## générer un module 
Supposons que nous voulons générer le module **public** avec tous ses composants, nous lançons la commande suivante
```
ng generate jant-taf:taf --module public
```
## générer les composants d'une seule table
Supposons que nous voulons générer tous les composants de la table agent, nous lançons la commande suivante
```
ng generate jant-taf:taf --table agent
```
## générer un composant d'une table
Supposons que nous voulons générer le composant qui liste tous les enregistrements de la table agent, nous lançons la commande suivante
```
ng generate jant-taf:taf --table agent --type list
```
## NB: Les types de composant disponibles
- **list**        : liste tous les enregistrements de la table
- **add**         : formulaire d'ajout de la table
- **edit**        : formulaire de modification de la table
- **details**     : affiche les details d'un enregistrement de la table
- **login**       : formulaire de connexion
- **deconnexion** : page de déconnexion à l'application
- **not-found**   : si la page demandée est introuvable

## Exemple de configuration de app.route.ts
```
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './guard/auth/auth.guard';
import { PublicComponent } from './public/public/public.component';

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "public" },
    {
        path: "home",
        component: HomeComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./home/home.module").then((m) => m.HomeModule)
            }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: "public",
        component: PublicComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./public/public.module").then((m) => m.PublicModule)
            }
        ],
    },
];
```