"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_html_content = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
function get_html_content(table) {
  
  // Ne garder que 'nom' et 'libelle' dans la carte
  let colonnes_carte = table.description.filter(col => ['nom', 'libelle'].includes(col.toLowerCase()));

  return `
<div
  class="d-flex align-items-center justify-content-between  bg-white shadow-sm p-4 rounded rounded-2 mb-4 border border-1">
  <div class="d-flex  align-items-center">
    <i class="bi bi-arrow-left text-secondary fs-3 me-2" (click)="api.retour()"></i>
    <div class="fs-5">${(0, strings_1.classify)(table.table)}  - {{les_${table.table}s.length}}</div>
  </div>
  <div class="d-flex">
    <button class="btn btn-primary" (click)="openModal_add_${table.table}()"><i class="bi bi-plus-square-dotted"></i>
      ${(0, strings_1.classify)(table.table)}</button>
  </div>
</div>
<!-- Liste des éléments -->
<!-- Loading state -->
<ng-container *ngIf="loading_get_${table.table}">
  <div class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Chargement en cours...</span>
    </div>
    <p class="mt-2 text-muted fs-5">Chargement en cours...</p>
  </div>
</ng-container>

<!-- contenu sous format carte -->
<div class="row g-4" *ngIf="!loading_get_${table.table} && les_${table.table}s.length > 0">
  @for (one_${table.table} of les_${table.table}s; track one_${table.table}) {
  <ng-container>
    <div class="col-sm-6 col-md-4 col-lg-4">
      <div class="card shadow-sm h-100 border-0 rounded-3 transition-hover position-relative">
        <div class="card-body p-4">
          <!-- Menu trois points (actions) -->
          <div class="position-absolute top-0 end-0 m-2">
            <div class="dropdown">
              <button type="button" class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm rounded-3">
                <li>
                  <button class="dropdown-item d-flex align-items-center" type="button"
                    (click)="openModal_edit_${table.table}(one_${table.table})">
                    <i class="bi bi-pencil me-2 text-primary"></i> Modifier
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center" type="button">
                    <i class="bi bi-eye me-2 text-primary"></i> Détails
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Contenu de la carte -->
          ${colonnes_carte.length === 0
      ? `<h5 class="card-title text-start fw-semibold text-dark mb-3">
                   Aucun champ affichable
                 </h5>`
      : colonnes_carte.map(col => `
                  <h5 class="card-title text-start fw-semibold text-dark mb-3">
                    {{ one_${table.table}.${col} || '${col} indisponible' }}
                  </h5>`).join('\n')
    }

        </div>
      </div>
    </div>
  </ng-container>
  }
</div>

<!-- Empty state -->
<div *ngIf="!loading_get_${table.table} && les_${table.table}s.length === 0" class="text-center py-5">
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6c757d" class="bi bi-info-circle mb-3"
    viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path
      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
  <p class="fs-5 text-muted">Pas de données</p>
</div>
`;
}
exports.get_html_content = get_html_content;
//# sourceMappingURL=list.html.js.map