"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function login(options) {
    const { table, projectName, parent, tafConfig } = options;
    //console.log("table = ", table)
    const componentType = "list";
    const componentName_class = (0, strings_1.classify)(componentType) + (0, strings_1.classify)(table.table); //"Login"
    const componentName = (0, strings_1.dasherize)(componentName_class);
    const fullComponentName = parent + (0, strings_1.dasherize)(table.table) + "/" + componentName; // home/auteur/list-auteur
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
                get_html_content(table));
                // modifier le fichier TS
                tree.overwrite(`src/app/${fullComponentName}/${componentName}.component.ts`, // home/auteur/lis-auteur/list-auteur.component.ts
                get_ts_content(table, componentName_class, componentName, tafConfig));
            }
        ]);
    };
}
exports.login = login;
function get_ts_content(table, componentName_class, componentName, tafConfig) {
    let validators = table.description.map((une_colonne) => {
        return `${une_colonne}: ["", Validators.required]`;
    }).join(",\n");
    return `import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-${componentName}',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.${tafConfig.style}']
})
export class ${componentName_class}Component {
  reactiveForm_login_${table.table} !: FormGroup;
  submitted:boolean=false
  loading_login_${table.table} :boolean=false
  constructor(private formBuilder: FormBuilder,public api:ApiService,private router:Router) { }

  ngOnInit(): void {
      this.init_form()
  }
  init_form() {
      this.reactiveForm_login_${table.table}  = this.formBuilder.group({
          ${validators}
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_login_${table.table} .controls; }
  // validation du formulaire
  onSubmit_login_${table.table} () {
      this.submitted = true;
      console.log(this.reactiveForm_login_${table.table} .value)
      // stop here if form is invalid
      if (this.reactiveForm_login_${table.table} .invalid) {
          return;
      }
      var ${table.table} =this.reactiveForm_login_${table.table} .value
      this.login_${table.table} (${table.table} )
  }
  // vider le formulaire
  onReset_login_${table.table} () {
      this.submitted = false;
      this.reactiveForm_login_${table.table} .reset();
  }
  login_${table.table}(${table.table}: any) {
      this.loading_login_${table.table} = true;
      this.api.taf_post_login("taf_auth/auth", ${table.table}, async (reponse: any) => {
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table ${table.table}. Réponse= ", reponse);
          this.onReset_login_${table.table}()
          await this.api.save_on_local_storage("token", reponse)
          await this.api.update_data_from_token();
          this.api.Swal_success("Opération éffectuée avec succés")
          this.router.navigate(['/home'])
      } else {
          console.log("L\'opération sur la table ${table.table} a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
      this.loading_login_${table.table} = false;
  }, (error: any) => {
      this.loading_login_${table.table} = false;
  });
}
}
`;
}
function get_html_content(table) {
    let all_colonne = table.description.map((une_colonne) => {
        return `<!-- ${une_colonne} field avec un control de validite -->
    <div class="form-group col-sm-6">
      <label >${une_colonne}</label>
      <input class="form-control" type="text"  formControlName="${une_colonne}"  placeholder="${une_colonne}"  [ngClass]="{ 'is-invalid': submitted && f.${une_colonne}.errors }"/>
      @if (submitted && f.${une_colonne}.errors) {
        <div class="invalid-feedback">
          @if (f.${une_colonne}.errors.required) {
            <div>Ce champ est obligatoire</div>
          }
        </div>
      }
    </div>  `;
    })
        .join("\n");
    return `<div class="d-flex align-items-center vh-100">
  <div class="container">
    <form  [formGroup]="reactiveForm_login_${table.table} " (ngSubmit)="onSubmit_login_${table.table} ()" #form_login_${table.table} ="ngForm" class="row">
      ${all_colonne}
    </form>
    <!-- vous pouvez valider votre formulaire n\'importe ou -->

    <div class="text-center m-2">
        <button type="button" class="btn btn-primary m-2" [disabled]="loading_login_${table.table} "
            (click)="form_login_${table.table} .ngSubmit.emit()">{{loading_login_${table.table} ?"En cours ...":"Valider"}}</button>
        <button class="btn btn-secondary m-2" type="reset" (click)="onReset_login_${table.table} ()">Vider</button>
    </div>
  </div>
</div>`;
}
//# sourceMappingURL=index.js.map