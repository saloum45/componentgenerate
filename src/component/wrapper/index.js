"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapper = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function wrapper(options) {
    const { name, projectName, tafConfig } = options;
    // console.log("options = ", options)
    const componentName = (0, strings_1.dasherize)(name);
    const fullComponentName = name + "/" + componentName; // home/home
    // console.log("fullComponentName= ", fullComponentName)
    return (tree) => {
        // Le composant existe dèja
        let c_path = `/src/app/${fullComponentName}/${componentName}.component.ts`;
        // console.log("c_path= ", c_path)
        if (tree.exists(c_path)) {
            console.warn(`Le composant ${componentName} existe dèja : ${c_path}`);
            return tree;
        }
        // le composant n'existe pas encore
        return (0, schematics_1.chain)([
            // création du composant
            (0, schematics_1.externalSchematic)("@schematics/angular", "component", { project: projectName, name: fullComponentName, style: tafConfig.style, standalone: true }),
            // modification des fichiers
            (tree) => {
                // modifier le fichier HTML
                tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.html`, // home/auteur/lis-auteur/list-auteur.component.html
                get_html_content(name));
                // modifier le fichier ts
                tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.ts`, // home/auteur/lis-auteur/list-auteur.component.ts
                get_ts_content(tafConfig, name));
            }
        ]);
    };
}
exports.wrapper = wrapper;
function get_html_content(module) {
    return `<div class="d-flex align-items-center justify-content-between">
  <div class="fs-1">
        Module ${module}
  </div>
  <div class="d-flex">
       <div ngbDropdown class="d-inline-block">
            <button type="button" class="btn btn-outline-primary" id="dropdownBasic1" ngbDropdownToggle>
                  Menu
            </button>
            <div ngbDropdownMenu aria-labelledby="dropdownBasic1">
                  @for (one_menu of menu.items; track $index) {
                  <button ngbDropdownItem [routerLink]="[one_menu.path]"> {{one_menu.libelle}}</button>
                  }
            </div>
      </div>
  </div>
</div>
<div class="container">
      <router-outlet></router-outlet>
</div>`;
}
function get_ts_content(tafConfig, module) {
    let les_tables = tafConfig.les_modules.find((un_module) => un_module.module == module).les_tables;
    let items = les_tables.map((une_table) => {
        return `{libelle:"${(0, strings_1.classify)(une_table.table)}",path:"/${module}/${une_table.table}"}`;
    }).join(",\n");
    return `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-${module}',
  standalone: true, // Composant autonome
  imports: [RouterModule,NgbDropdownModule],
  templateUrl: './${module}.component.html',
  styleUrls: ['./${module}.component.${tafConfig.style}']
})
export class ${(0, strings_1.classify)(module)}Component {
  menu:any={
    titre:"Menu",
    items:[
      ${items}
    ]
  }
}
`;
}
//# sourceMappingURL=index.js.map