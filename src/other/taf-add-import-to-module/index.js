"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tafAddImportToModule = void 0;
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
function tafAddImportToModule(_options) {
    let modulePath = "src/app/home/home.module.ts";
    return (tree, context) => {
        const appModulePath = modulePath;
        const sourceFile = appModulePath;
        const importText = `import { ReactiveFormsModule } from '@angular/forms';`;
        const change = (0, ast_utils_1.addImportToModule)(sourceFile, importText, 'ReactiveFormsModule', appModulePath);
        const declarationRecorder = tree.beginUpdate(sourceFile);
        declarationRecorder.insertLeft(change.pos, change.toAdd);
        tree.commitUpdate(declarationRecorder);
        context.logger.info(`"${importText}" added to ${appModulePath}.`);
        return tree;
    };
}
exports.tafAddImportToModule = tafAddImportToModule;
//# sourceMappingURL=index.js.map