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
// 🔹 Fonction principale pour générer le contenu HTML
function get_html_content(table) {
  let all_colonne = table.table_descriptions.les_colonnes
    .map((une_colonne) => {
      let formattedField = formatFieldName(une_colonne.Field); // Appliquer la transformation
      switch (une_colonne.Key) {
        case "PRI":
          return "";
        case "MUL":
          if (une_colonne.referenced_table) {
            return `
            <!-- Champ ${formattedField} (Clé étrangère vers ${une_colonne.referenced_table.table_name}) -->
            <div class="form-group col-sm-6">
              <label>${formatFieldName(une_colonne.referenced_table.table_name)} <span class="text-danger">*</span></label>
              <select [ngClass]="{ 'is-invalid': submitted && f.${une_colonne.Field}.errors }" 
                      class="form-select" 
                      formControlName="${une_colonne.Field}">
                <option value="">Sélectionnez un(e) ${formatFieldName(une_colonne.referenced_table.table_name)}</option>
                @for (one_${une_colonne.referenced_table.table_name} of form_details?.${une_colonne.referenced_table.table_name}; track $index) {
                  <option [value]="one_${une_colonne.referenced_table.table_name}.${une_colonne.referenced_table.cle_primaire.Field}">
                    {{ "N°" + one_${une_colonne.referenced_table.table_name}.${une_colonne.referenced_table.cle_primaire.Field} }}
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
            return `<!-- Erreur : La clé étrangère ${une_colonne.Field} de la table ${table.table} n'est pas référencée -->`;
          }
        default:
          if (une_colonne.Field === "created_at" && une_colonne.Default === "CURRENT_TIMESTAMP") {
            return "";
          }
          if (une_colonne.Type === "timestamp" ||une_colonne.Type === "date") {
            return `
            <!-- Champ ${formattedField} -->
            <div class="form-group col-sm-6">
              <label>${formattedField}</label>
              <input class="form-control" 
                     type="date" 
                     formControlName="${une_colonne.Field}" 
                     placeholder="${formattedField}"  
                     [ngClass]="{ 'is-invalid': submitted && f.${une_colonne.Field}.errors }"/>
              @if (submitted && f.${une_colonne.Field}.errors) {
                <div class="invalid-feedback">
                  @if (f.${une_colonne.Field}.errors.required) {
                    <div>Ce champ est obligatoire</div>
                  }
                </div>
              }
            </div>`;
          } else {
            return `
            <!-- Champ ${formattedField} -->
            <div class="form-group col-sm-6">
              <label>${formattedField}</label>
              <input class="form-control" 
                     type="text" 
                     formControlName="${une_colonne.Field}" 
                     placeholder="${formattedField}"  
                     [ngClass]="{ 'is-invalid': submitted && f.${une_colonne.Field}.errors }"/>
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
    .filter((html) => html !== "") // Éviter les valeurs vides
    .join("\n");
  return `<div class="modal-header" data-bs-theme="ligth">
      <h1 class="modal-title fs-5">Ajouter ${table.table}</h1>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="reactiveForm_add_${table.table}" 
            (ngSubmit)="onSubmit_add_${table.table}()" 
            #form_add_${table.table}="ngForm" 
            class="row">
        ${all_colonne}
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary m-2" [disabled]="loading_add_${table.table} || loading_get_details_add_${table.table}_form"
      (click)="form_add_${table.table}.ngSubmit.emit()">
      {{ loading_add_${table.table} ? "En cours ..." : "Valider" }}
      </button>
      <button type="button" class="btn btn-outline-danger" (click)="activeModal.close()">Fermer</button>
    </div>`;
}
exports.get_html_content = get_html_content;
//# sourceMappingURL=add.html.js.map