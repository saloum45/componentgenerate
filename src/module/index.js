"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function module(options) {
    const tafConfig = options.tafConfig;
    const projectName = options.projectName;
    const module = options.module;
    const les_tables = options.les_tables;
    return (tree) => {
        // Le module existe dèja
        let module_path = `/src/app/${module}/${module}.module.ts`;
        let routing_module_path = `/src/app/${module}/${module}-routing.module.ts`;
        //console.log('module_path= ',module_path)
        if (tree.exists(module_path)) {
            console.warn(`Le module ${module} existe dèja`);
            return (0, schematics_1.chain)([
                // création de tables
                ...les_tables.map((une_table) => { return (0, schematics_1.schematic)("api", { projectName: projectName, table: une_table, parent: module, tafConfig: tafConfig }); })
            ]);
        }
        // le module n'existe pas encore
        return (0, schematics_1.chain)([
            // crétion du module avec routing s'il n'existe pas encore
            (0, schematics_1.externalSchematic)("@schematics/angular", "module", { name: module, project: projectName, routing: true }),
            (tree) => {
                // modifier le fichier "module"-routing.module.ts
                tree.overwrite(routing_module_path, get_routing_ts_content(tafConfig, module));
                // modifier le fichier "module".module.ts
                tree.overwrite(module_path, get_ts_content(module));
            },
            // création du wrapper
            (0, schematics_1.schematic)("wrapper", { name: module, projectName: projectName, tafConfig: tafConfig }),
            // création de tables
            ...les_tables.map((une_table) => { return (0, schematics_1.schematic)("api", { projectName: projectName, table: une_table, parent: module, tafConfig: tafConfig }); })
        ]);
    };
}
exports.module = module;
function get_routing_ts_content(tafConfig, module) {
    let les_tables = tafConfig.les_modules.find((un_module) => un_module.module == module).les_tables;
    let importations = les_tables.map((une_table) => {
        return `import { List${(0, strings_1.classify)(une_table.table)}Component } from './${(0, strings_1.dasherize)(une_table.table)}/list-${(0, strings_1.dasherize)(une_table.table)}/list-${(0, strings_1.dasherize)(une_table.table)}.component';`;
    }).join("\n");
    let routes = les_tables.map((une_table, index) => {
        if (une_table.les_types.find((un_type) => un_type == "not-found")) { // le composant not-found
            return `{path:"**",component:List${(0, strings_1.classify)(une_table.table)}Component}`;
        }
        else if (index == 0) { // le premier composant
            return `{path:"",component:List${(0, strings_1.classify)(une_table.table)}Component},\n{path:"${une_table.table}",component:List${(0, strings_1.classify)(une_table.table)}Component}`;
        }
        else {
            return `{path:"${une_table.table}",component:List${(0, strings_1.classify)(une_table.table)}Component}`;
        }
    })
        .join(",\n");
    // rajouter not-found
    return `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
${importations}

const routes: Routes = [
  ${routes}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }`;
}
function get_ts_content(module) {
    return `import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  
  import { HomeRoutingModule } from './${module}-routing.module';
  import { ReactiveFormsModule } from '@angular/forms';
  
  
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      HomeRoutingModule,
      ReactiveFormsModule
    ]
  })
  export class ${(0, strings_1.classify)(module)}Module { }
  `;
}
//# sourceMappingURL=index.js.map