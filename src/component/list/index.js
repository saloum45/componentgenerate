"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const list_html_1 = require("../../templates/list/list.html");
const list_ts_1 = require("../../templates/list/list.ts");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function list(options) {
    const { table, projectName, parent, tafConfig } = options;
    //console.log("table = ", table)
    const componentType = "list";
    const componentName_class = (0, strings_1.classify)(componentType) + (0, strings_1.classify)(table.table); //"ListLivre"
    const componentName = (0, strings_1.dasherize)(componentName_class);
    const fullComponentName = parent + (0, strings_1.dasherize)(table.table) + "/" + componentName; // /home/auteur/list-auteur
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
                (0, list_html_1.get_html_content)(table));
                // modifier le fichier TS
                tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.ts`, // home/auteur/lis-auteur/list-auteur.component.ts
                (0, list_ts_1.get_ts_content)(table, componentName_class, componentName, tafConfig));
            }
        ]);
    };
}
exports.list = list;
//# sourceMappingURL=index.js.map