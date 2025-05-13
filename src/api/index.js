"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const schematics_1 = require("@angular-devkit/schematics");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function api(options) {
    const tafConfig = options.tafConfig;
    const projectName = options.projectName;
    const parent = options.parent;
    const table = options.table;
    //console.log("les_types= ",table)
    return (0, schematics_1.chain)([
        ...table.les_types.map((un_type) => { return (0, schematics_1.schematic)(un_type, { projectName: projectName, parent: parent + "/", table: table, tafConfig: tafConfig }); })
    ]);
}
exports.api = api;
//# sourceMappingURL=index.js.map