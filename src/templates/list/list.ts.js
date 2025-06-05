"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_ts_content = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
function get_ts_content(table, componentName_class, componentName, tafConfig) {
    const componentName_class_add = "Add" + (0, strings_1.classify)(table.table); //"AddLivreComponent"
    const componentName_class_edit = "Edit" + (0, strings_1.classify)(table.table); //"AddLivreComponent"
    const componentName_add = (0, strings_1.dasherize)(componentName_class_add);
    const componentName_edit = (0, strings_1.dasherize)(componentName_class_edit);
    return `import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { ${componentName_class_add}Component } from '../${componentName_add}/${componentName_add}.component';
  import { ${componentName_class_edit}Component } from '../${componentName_edit}/${componentName_edit}.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgIf } from '@angular/common';
  @Component({
    selector: 'app-${componentName}',
    standalone: true, // Composant autonome
    imports: [NgIf], // Dépendances importées
    templateUrl: './${componentName}.component.html',
    styleUrls: ['./${componentName}.component.${tafConfig.style}']
  })
  export class ${componentName_class}Component {
    loading_get_${table.table} = false
    ${table.table}: any[] = []
    selected_${table.table}: any = undefined
    ${table.table}_to_edit: any = undefined
    loading_delete_${table.table} = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_${table.table}()
    }
    get_${table.table}() {
      this.loading_get_${table.table} = true;
      this.api.taf_get("${table.table}", (reponse: any) => {
        if (reponse.status) {
          this.${table.table} = reponse.data
          console.log("Opération effectuée avec succés sur la table ${table.table}. Réponse= ", reponse);
        } else {
          console.log("L\'opération sur la table ${table.table} a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_${table.table} = false;
      }, (error: any) => {
        this.loading_get_${table.table} = false;
      })
    }
  
    voir_plus(one_${table.table}: any) {
      this.selected_${table.table} = one_${table.table}
    }
    on_click_edit(one_${table.table}: any) {
      this.${table.table}_to_edit = one_${table.table}
    }
    on_close_modal_edit(){
      this.${table.table}_to_edit=undefined
    }
    delete_${table.table} (${table.table} : any){
      this.loading_delete_${table.table} = true;
      this.api.taf_delete("${table.table}/"+${table.table}.id_${table.table},(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table ${table.table} . Réponse = ",reponse)
          this.get_${table.table}()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L\'opération sur la table ${table.table}  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_${table.table} = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_${table.table} = false;
      })
    }
    openModal_add_${table.table}() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(${componentName_class_add}Component, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_${table.table}()
        } else {

        }
      })
    }
    openModal_edit_${table.table}(one_${table.table}: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(${componentName_class_edit}Component, { ...options, backdrop: 'static', })
      modalRef.componentInstance.${table.table}_to_edit = one_${table.table};
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_${table.table}()
        } else {

        }
      })
    }
  }`;
}
exports.get_ts_content = get_ts_content;
//# sourceMappingURL=list.ts.js.map