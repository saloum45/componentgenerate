"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const schematics_1 = require("@angular-devkit/schematics");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function auth(_options) {
    let { projectName } = _options;
    let guardName = "auth";
    return (tree) => {
        // Le composant existe dèja
        let c_path = `/src/app/guard/${guardName}/${guardName}.guard.ts`;
        if (tree.exists(c_path)) {
            console.warn(`Le guard ${guardName} existe dèja : ${c_path}`);
            return tree;
        }
        // le composant n'existe pas encore
        return (0, schematics_1.chain)([
            // création du guard
            (0, schematics_1.externalSchematic)("@schematics/angular", "guard", { project: projectName, name: `guard/${guardName}/${guardName}`, implements: ["CanActivate"] }),
            // modification des fichiers
            (tree) => {
                // modifier le fichier TS
                tree.overwrite(`src/app/guard/${guardName}/${guardName}.guard.ts`, // guard/api/api.guard.ts
                get_ts_content());
            }
        ]);
    };
}
exports.auth = auth;
function get_ts_content() {
    return `import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private api:ApiService,private routage:Router) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // var token= await this.api.get_token()
    var token= await this.api.get_token()
    console.log("token on guard= ",token)
    if (token!=undefined && token!=null) {
      console.log("Utilisateur connecté")
      // await this.api.update_data_from_token()
      this.api.custom_menu();
      return true
    } else {
      console.log("Utilisateur non connecté")
      // this.routage.navigate(['/public/login'])
      this.routage.navigate(['/public/login'], { queryParams: { returnUrl: state.url } });
      return false
    }
  }
  
}`;
}
//# sourceMappingURL=index.js.map