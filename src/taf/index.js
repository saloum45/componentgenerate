"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taf = void 0;
const schematics_1 = require("@angular-devkit/schematics");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function taf(options) {
    // exemple de configuration
    let tafConfig = {
        "projectName": "projet1.angular",
        "style": "css",
        "decription": "Fichier de configuration de Taf",
        "taf_base_url": "localhost/my_backend/taf/",
        "les_modules": [
            {
                "module": "home",
                "les_tables": [
                    { "table": "auteur" },
                ]
            },
            {
                "module": "public",
                "les_tables": [
                    { "table": "login" },
                ]
            },
        ]
    };
    return (tree) => {
        if (options.test) { // nous sommes en test
            console.warn("Phase de test");
            console.log("Details= ", get_details(tree));
            return;
        }
        let tc = tree.get("taf.config.json"); // lire le fichier taf.config.json qui se trouve dans ton projet
        if (!tc) {
            console.error("Le fichier de configuration (taf.config.json) est inexistant!");
            console.log("Générez le avec votre backend TAF");
            return;
        }
        else {
            tafConfig = JSON.parse(tc.content.toString());
            //console.log("taf.config.json= ", tafConfig)
            let details = get_details(tree);
            // mise à jour du style
            tafConfig.style = details.style;
            // mise à jour du nom du projet
            tafConfig.projectName = details.projectName;
        }
        // pas de module précisé
        if (!options.module) {
            return (0, schematics_1.chain)([
                // création de tous les modules du fichier de configuration
                ...tafConfig.les_modules.map((un_module) => {
                    return (0, schematics_1.schematic)("module", { module: un_module.module, projectName: tafConfig.projectName, les_tables: un_module.les_tables, tafConfig: tafConfig });
                }),
                // mise en place de ApiService
                (0, schematics_1.schematic)("service/api", { projectName: tafConfig.projectName, tafConfig: tafConfig }),
                // mise en place de AuthGuard
                (0, schematics_1.schematic)("guard/auth", { projectName: tafConfig.projectName })
            ]);
        }
        // module précisé
        let module = options.module;
        // recupération des details du module dans le fichier de configuration
        let selected_module = tafConfig.les_modules.find((un_module) => { return un_module.module == module; });
        //console.log("selected_module= ", selected_module)
        if (!selected_module) { // module introuvable
            console.error("Module introuvable dans le fichier de configuration taf.config.json");
            let les_modules = tafConfig.les_modules.map((un_module) => { return un_module.module; }).join(" , ");
            console.log("Voici les modules disponibles : ", les_modules);
            return;
        }
        // pas de table précisée donc toutes les tables
        if (!options.table) {
            // génération du module précisé et de toutes ses table
            return (0, schematics_1.chain)([
                (0, schematics_1.schematic)("module", { module: module, projectName: tafConfig.projectName, les_tables: selected_module.les_tables, tafConfig: tafConfig }),
                // mise en place de ApiService
                (0, schematics_1.schematic)("service/api", { projectName: tafConfig.projectName, tafConfig: tafConfig }),
                // mise en place de AuthGuard
                (0, schematics_1.schematic)("guard/auth", { projectName: tafConfig.projectName })
            ]);
        }
        // table précisée
        let table = options.table;
        // récupération de la table précisée
        let selected_table = selected_module.les_tables.find((une_table) => { return une_table.table == table; });
        if (!selected_table) { // table non retrouvée
            console.error("Table inexistante dans le fichier de configuration taf.config.json");
            let les_tables = tafConfig.les_modules
                .map((un_module) => { return "Module " + un_module.module + " => " + un_module.les_tables.map((une_table) => { return une_table.table; }).join(" , "); })
                .join("\n\t");
            console.log("Voici les tables disponibles : \n\t", les_tables);
            return;
        }
        // table retrouvée
        // type de composant non précisé, donc tous les types ( add, edit, list, details)
        if (!options.type) {
            // génération du module précisé , de la table précisée et de tous le types
            return (0, schematics_1.chain)([
                (0, schematics_1.schematic)("module", { module: module, projectName: tafConfig.projectName, les_tables: [selected_table], tafConfig: tafConfig }),
                // mise en place de ApiService
                (0, schematics_1.schematic)("service/api", { projectName: tafConfig.projectName, tafConfig: tafConfig }),
                // mise en place de AuthGuard
                (0, schematics_1.schematic)("guard/auth", { projectName: tafConfig.projectName })
            ]);
        }
        // type de composant précisé
        let type = options.type;
        let selected_type = selected_table.les_types.find((un_type) => { return un_type == type; });
        // le type de composant est introuvable parmi ceux autorisés pour cette table
        if (!selected_type) {
            console.error("Type introuvable pour la table " + selected_table.table);
            let les_types_tables = selected_table.les_types.join(" , ");
            console.log("Voici les types disponibles : ", les_types_tables);
            return;
        }
        // type trouvé
        // génération du module précisé , de la table précisée et types précisé
        selected_table.les_types = [selected_type];
        return (0, schematics_1.chain)([
            (0, schematics_1.schematic)("module", { module: module, projectName: tafConfig.projectName, les_tables: [selected_table], tafConfig: tafConfig }),
            // mise en place de ApiService
            (0, schematics_1.schematic)("service/api", { projectName: tafConfig.projectName, tafConfig: tafConfig }),
            // mise en place de AuthGuard
            (0, schematics_1.schematic)("guard/auth", { projectName: tafConfig.projectName })
        ]);
    };
}
exports.taf = taf;
function get_details(tree) {
    var _a;
    let resultat = { style: "css", projectName: "" };
    const angularJsonContent = tree.read('angular.json');
    if (angularJsonContent) {
        //console.log("contenu angularJSON")
        // Convertir le contenu en objet JSON
        const angularJson = JSON.parse(angularJsonContent.toString('utf-8'));
        let les_projets = angularJson.projects;
        resultat.projectName = Object.keys(les_projets)[0];
        const un_projet = les_projets[resultat.projectName];
        //console.log(un_projet)
        if (un_projet.schematics && un_projet.schematics['@schematics/angular:component']) {
            //console.log("resultat= ", resultat)
            resultat.style = ((_a = un_projet.schematics['@schematics/angular:component']) === null || _a === void 0 ? void 0 : _a.style) || "css";
        }
        else {
            resultat.style = "css";
        }
    }
    return resultat;
}
;
//# sourceMappingURL=index.js.map