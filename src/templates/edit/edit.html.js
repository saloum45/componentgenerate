"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_html_content = void 0;
// 🔹 Fonction utilitaire pour formater les noms des champs
function formatFieldName(field) {
    return field
        .split("_") // Séparer par "_"
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Mettre la première lettre en majuscule
        .join(" "); // Réassembler avec un espace
}
function get_html_content(table) {
    let all_colonne = table.table_descriptions.les_colonnes
        .map((une_colonne) => {
        switch (une_colonne.Key) {
            case "PRI":
                return ""; // Ignorer la clé primaire
            case "MUL":
                if (une_colonne.referenced_table) {
                    return `<!-- Champs ${formatFieldName(une_colonne.Field)} avec un contrôle de validité : clé étrangère liée à la colonne ${une_colonne.Field} de la table ${une_colonne.referenced_table.table_name} -->
            <div class="form-group col-sm-6">
              <label>${formatFieldName(une_colonne.referenced_table.table_name)}</label>
              <select [ngClass]="{ 'is-invalid': submitted && f.${une_colonne.Field}.errors }" class="form-select" formControlName="${une_colonne.Field}">
                <option value="">Sélectionnez un(e) ${formatFieldName(une_colonne.referenced_table.table_name)}</option>
                @for (one_${une_colonne.referenced_table.table_name} of form_details?.${une_colonne.referenced_table.table_name}; track $index) {
                  <option [value]="one_${une_colonne.referenced_table.table_name}.${une_colonne.referenced_table.cle_primaire.Field}">
                    {{"${formatFieldName(une_colonne.referenced_table.table_name)} N°" + one_${une_colonne.referenced_table.table_name}.${une_colonne.referenced_table.cle_primaire.Field}}}
                  </option>
                }
              </select>
              @if (submitted && f.${une_colonne.Field}.errors) {
                <div class="invalid-feedback">
                  @if (f.${une_colonne.Field}.errors.required) {
                    <div>Ce champ est obligatoire</div>
                  }
                </div>
              }
            </div>`;
                }
                else {
                    return `<!-- Erreur ${table.table}! Cette clé étrangère ${une_colonne.Field} n'est pas référencée à une table -->`;
                }
            default:
                if (une_colonne["Field"] === "created_at" && une_colonne["Default"] === "CURRENT_TIMESTAMP") {
                    return ""; // Ignorer les champs timestamp auto-générés
                }
                else {
                    return `<!-- ${formatFieldName(une_colonne.Field)} field avec un contrôle de validité -->
            <div class="form-group col-sm-6">
              <label>${formatFieldName(une_colonne.Field)}</label>
              <input class="form-control" type="text" formControlName="${une_colonne.Field}" placeholder="${formatFieldName(une_colonne.Field)}" [ngClass]="{ 'is-invalid': submitted && f.${une_colonne.Field}.errors }"/>
              @if (submitted && f.${une_colonne.Field}.errors) {
                <div class="invalid-feedback">
                  @if (f.${une_colonne.Field}.errors.required) {
                    <div>Ce champ est obligatoire</div>
                  }
                </div>
              }
            </div>`;
                }
        }
    })
        .join("\n");
    return `<div class="modal-header" data-bs-theme="ligth">
        <h1 class="modal-title fs-5">Modifier ${table.table}</h1>
        <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="reactiveForm_edit_${table.table}" (ngSubmit)="onSubmit_edit_${table.table}()" #form_edit_${table.table}="ngForm" class="row">
        ${all_colonne}
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary m-2" [disabled]="loading_edit_${table.table} ||
      loading_get_details_edit_${table.table}_form ||reactiveForm_edit_${table.table}.pristine" (click)="form_edit_${table.table}.ngSubmit.emit()">
          {{ loading_edit_${table.table} ? "En cours ..." : "Valider" }}
      </button>
      <button type="button" class="btn btn-outline-danger" (click)="activeModal.close()">Fermer</button>
    </div>`;
}
exports.get_html_content = get_html_content;
//# sourceMappingURL=edit.html.js.map