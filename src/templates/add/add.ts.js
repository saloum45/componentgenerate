"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_ts_content = void 0;
function get_ts_content(table, componentName_class, componentName, tafConfig) {
    let validators = table.table_descriptions.les_colonnes.map((une_colonne) => {
        if (une_colonne["Key"] != 'PRI' && !(une_colonne["Field"] == "created_at" && une_colonne["Default"] != "")) {
            if (une_colonne["Null"] == "NO") {
                return une_colonne["Field"] + ': ["", Validators.required]';
            }
            else {
                return une_colonne["Field"] + ': [""]';
            }
        }
        return undefined;
    }).filter((une_colonne) => une_colonne != undefined).join(",\n");
    return `
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-${componentName}',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.${tafConfig.style}']
})
export class ${componentName_class}Component {
  reactiveForm_add_${table.table} !: FormGroup;
  submitted:boolean=false
  loading_add_${table.table} :boolean=false
  form_details: any = {}
  loading_get_details_add_${table.table}_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_${table.table}_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_${table.table}  = this.formBuilder.group({
          ${validators}
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_${table.table} .controls; }
  // validation du formulaire
  onSubmit_add_${table.table} () {
      this.submitted = true;
      console.log(this.reactiveForm_add_${table.table} .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_${table.table} .invalid) {
          return;
      }
      var ${table.table} =this.reactiveForm_add_${table.table} .value
      this.add_${table.table} (${table.table} )
  }
  // vider le formulaire
  onReset_add_${table.table} () {
      this.submitted = false;
      this.reactiveForm_add_${table.table} .reset();
  }
  add_${table.table}(${table.table}: any) {
      this.loading_add_${table.table} = true;
      this.api.taf_post("${table.table}", ${table.table}, (reponse: any) => {
      this.loading_add_${table.table} = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table ${table.table}. Réponse= ", reponse);
          this.onReset_add_${table.table}()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L\'opération sur la table ${table.table} a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_${table.table} = false;
    })
  }
  
  get_details_add_${table.table}_form() {
      this.loading_get_details_add_${table.table}_form = true;
      this.api.taf_get("${table.table}/getformdetails", (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table ${table.table}. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table ${table.table} a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_${table.table}_form = false;
      }, (error: any) => {
      this.loading_get_details_add_${table.table}_form = false;
    })
  }
}
`;
}
exports.get_ts_content = get_ts_content;
//# sourceMappingURL=add.ts.js.map