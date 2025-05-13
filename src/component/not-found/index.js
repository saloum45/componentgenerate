"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const schematics_1 = require("@angular-devkit/schematics");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function notFound(_options) {
    const { table, projectName, parent, tafConfig } = _options;
    //console.log("table = ", table)
    const componentType = "list";
    const componentName_class = (0, strings_1.classify)(componentType) + (0, strings_1.classify)(table.table); //"Login"
    const componentName = (0, strings_1.dasherize)(componentName_class);
    const fullComponentName = parent + (0, strings_1.dasherize)(table.table) + "/" + componentName; // home/auteur/list-auteur
    return (tree) => {
        // Le composant existe dèja
        let c_path = `/src/app/${fullComponentName}/${componentName}.component.ts`;
        if (tree.exists(c_path)) {
            console.warn(`Le composant ${componentName} existe dèja dans le module ${parent} : ${c_path}`);
            return tree;
        }
        // le composant n'existe pas encore
        return (0, schematics_1.chain)([
            // création du composant
            (0, schematics_1.externalSchematic)("@schematics/angular", "component", { project: projectName, name: fullComponentName, style: tafConfig.style, standalone: true }),
            // modification des fichiers
            (tree, _context) => {
                // modifier le fichier HTML
                tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.html`, // home/auteur/lis-auteur/list-auteur.component.html
                get_html_content()),
                    // modifier le fichier TS
                    tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.ts`, // home/auteur/lis-auteur/list-auteur.component.ts
                    get_ts_content(componentName, componentName_class, tafConfig));
            }
        ]);
    };
}
exports.notFound = notFound;
function get_html_content() {
    return `<div class="d-flex align-items-center text-center vh-100">
  <div class="container">
      <h1>Page introuvable</h1>
      <button class="btn btn-outline-secondary" (click)="backClicked()">Retourner à la page pécédente</button>
      <br>
      <a [routerLink]="['/']">Retourner à la page d'accueil</a>
  </div>
</div>`;
}
function get_ts_content(componentName, componentName_class, tafConfig) {
    return `import { Component } from '@angular/core';
import {Location} from '@angular/common';
  
@Component({
  selector: 'app-${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.${tafConfig.style}']
})
export class ${componentName_class}Component {
  constructor(private _location: Location){

  }

  backClicked() {
    this._location.back();
  }
}`;
}
//# sourceMappingURL=index.js.map