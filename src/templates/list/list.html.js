"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_html_content = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
function get_html_content(table) {
    let entete = table.description.map((une_colonne) => {
        return `<th scope="col">${une_colonne}</th>`;
    }).join("\n") + `<th scope="col">actions</th>`;
    let body = table.description.map((une_colonne) => {
        return `<td>{{one_${table.table}.${une_colonne}}}</td>`;
    }).join("\n") + `<td>
    <i style="cursor: pointer;" class="bi bi-pencil-square me-2" (click)="openModal_edit_${table.table}(one_${table.table})"></i>
    <i style="cursor: pointer;" class="bi bi-trash" (click)="delete_${table.table}(one_${table.table})"></i>
</td>`;
    return `<!-- entete -->
  <div class="d-flex align-items-center justify-content-between">
    <div class="fs-1">${(0, strings_1.classify)(table.table)}  - {{les_${table.table}s.length}}</div>
    <div class="d-flex">
      <button class="btn btn-primary" (click)="openModal_add_${table.table}()">Ajouter ${(0, strings_1.classify)(table.table)}</button>
    </div>
  </div>
  <!-- Liste des éléments -->
  <div class="table-responsive">
    <table class="table table-striped">
      <thead>
        <tr>
          ${entete}
        </tr>
      </thead>
      <tbody>
        @for (one_${table.table} of les_${table.table}s; track one_${table.table}) {
          <tr>
            ${body}
          </tr>
        }
      </tbody>
    </table>
  </div>`;
}
exports.get_html_content = get_html_content;
//# sourceMappingURL=list.html.js.map