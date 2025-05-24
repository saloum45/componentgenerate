"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const schematics_1 = require("@angular-devkit/schematics");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function api(_options) {
  let { projectName, tafConfig } = _options;
  let serviceName = "api";
  return (tree) => {
    // Le composant existe dèja
    let c_path = `/src/app/service/${serviceName}/${serviceName}.service.ts`;
    let c_path_idb = `/src/app/service/idb/idb.service.ts`;
    if (tree.exists(c_path) && tree.exists(c_path_idb)) {
      console.warn(`Le service ${serviceName} && IdbService existe dèja : ${c_path}`);
      return tree;
    }
    // le composant n'existe pas encore
    return (0, schematics_1.chain)([
      // création du service
      (0, schematics_1.externalSchematic)("@schematics/angular", "service", { project: projectName, name: `service/${serviceName}/${serviceName}` }),
      // modification des fichiers
      (tree) => {
        // modifier le fichier TS
        tree.overwrite(`src/app/service/${serviceName}/${serviceName}.service.ts`, // service/api/api.service.ts
          get_ts_content(projectName, tafConfig));
      },
      // création du service
      (0, schematics_1.externalSchematic)("@schematics/angular", "service", { project: projectName, name: `service/idb/idb` }),
      // modification des fichiers
      (tree) => {
        // modifier le fichier TS
        tree.overwrite(`src/app/service/idb/idb.service.ts`, // service/api/api.service.ts
          get_ts_content_idb(projectName));
      }
    ]);
  };
}
exports.api = api;
function get_ts_content(projectName, tafConfig) {
  let taf_base_url = tafConfig.taf_base_url;
  return `import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdbService } from '../idb/idb.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "${projectName}";
  taf_base_url = "${taf_base_url}";

  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token: null,
    // token_decoded: null,
    user_connected: null,
    // is_expired: null,
    // date_expiration: null
  }

  constructor(private http: HttpClient, private route: Router, private idb: IdbService,public _location: Location) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.idb.get_from_indexedDB(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.idb.save_on_indexedDB(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.idb.delete_from_indexedDB(key);
  }


  async get_token() {
    // //le token n'est pas encore chargé
    // if (this.network.token == undefined) {
    //   this.network.token = await this.get_from_local_storage("token").token
    //   if (this.network.token != undefined && this.network.token != null) {// token existant
    //     this.update_data_from_token()// mise a jour du token
    //   }
    // } else {// token dèja chargé
    //   this.update_data_from_token()// mise a jour du token
    // }
    // console.warn((await this.get_from_local_storage("token")).token)
       if (this.token.token == null) {
      this.update_data_from_token();
    }
    return (await this.get_from_local_storage("token"))?.token
  }
  async get_token_profil() {
    return (await this.get_from_local_storage("token"))?.data
  }
  //les requetes http
    async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_delete(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.delete(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_put(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.put(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;

    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = (await this.get_from_local_storage("token"))
    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(token_key);
    // const expirationDate = helper.getTokenExpirationDate(token_key);
    // const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token: token_key.token,
      // token_decoded: decodedToken,
      user_connected: token_key.data,
      // is_expired: isExpired,
      // date_expiration: expirationDate
    }
    if (this.token.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      title: title,
      icon: "success",
      timer:700
    });
    return succes
  }

  Swal_error(title: any) {
    let error = Swal.fire({
      title: title,
      icon: "error",
      timer:700
    });
    return error
  }
  Swal_info(title: any) {
    let info = Swal.fire({
      title: title,
      icon: "info",
      timer:700
    });
    return info
  }
  is_already_selected(id: any, form: any, condition: string) {//la fonction désactive les options déja sélectionné dans le select
    let is_in=form.filter((one_detail: any) => one_detail[condition] == id)[0]?.[condition];
    return is_in;
  }

  format_date(date_string: string) {
    return {
      full: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment(date_string).locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment(date_string).locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment(date_string).locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment(date_string).locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment(date_string).locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }
  format_current_date() {
    return {
      full: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment().locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment().locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment().locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment().locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment().locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }

    les_droits: any = {
    // Gestion de la parti commerciale
    "produit.add": [1, 5, 6, 8],
    "produit.edit": [1, 5, 6, 8],
  };


  can(action: string) {
    let id_privilege = this.token?.user_connected?.id_privilege || 0
    if (this.les_droits[action] && this.les_droits[action].indexOf(id_privilege) != -1) {
      return true
    } else {
      return false
    }
  }

  full_menu: any[] = [
    {
      menu_header: "Solener",
      items: [
        {
          text: "Dashboard",
          path: "/home/dashboard",
          icone: "bi bi-speedometer",
          privileges: [1, 2],
          items: []
        }
      ]
    },];


custom_menu() {
    // console.log("agent", this.token.token_decoded.taf_data)
    let id_privilege = this.token.user_connected?.id_privilege
    // let id_privilege = 1;
    console.warn('id_privi', id_privilege)
    this.menu = this.full_menu.map((one: any) => {
      let res = Object.assign({}, one)
      res.items = one.items.filter((one_item: any) => {
        let is_vide = one_item.privileges.length == 0
        let es_dans_privileges = one_item.privileges.indexOf(id_privilege) != -1
        return is_vide || (es_dans_privileges)
      }).map((one_item: any) => {
        let res2 = Object.assign({}, one_item)
        res2.items = one_item.items.filter((one_sub_item: any) => {
          let is_vide = one_sub_item.privileges.length == 0
          let es_dans_privileges = one_sub_item.privileges.indexOf(id_privilege) != -1
          return is_vide || es_dans_privileges
        })
        return res2
      })
      return res
    }).filter((one: any) => one.items.length > 0)
    console.log("full_menu= ", this.full_menu, " menu= ", this.menu)
  }

    retour() {
    this._location.back()
  }

    formatNumber(value: any): string {
    if (!value || isNaN(Number(value))) {
      return value; // Retourne la valeur telle quelle si elle est null, vide ou non numérique
    }
    return Number(value).toLocaleString('fr-FR'); // Utilise Number.toLocaleString pour formater le nombre
  }

}`;
}
function get_ts_content_idb(projectName) {
  return `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdbService {
    private dbName = '${projectName}';
    private storeName = 'db';
    private local_storage_prefixe = 'jt_';

    constructor() {
      this.initDB();
    }

    // Initialiser IndexedDB
    private initDB(): void {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Crée une object store s'il n'existe pas déjà
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };

      request.onerror = (event) => {
        console.error('Erreur lors de l’ouverture d’IndexedDB :', event);
      };

      request.onsuccess = (event) => {
        console.log('IndexedDB initialisé avec succès');
      };
    }

    // Récupérer une valeur par clé
    async get_from_indexedDB(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);

          const getRequest = store.get(prefixedKey);
          getRequest.onsuccess = () => {
            resolve(getRequest.result ? getRequest.result.value : null);
          };
          getRequest.onerror = () => {
            console.error('Erreur de récupération depuis IndexedDB');
            reject(getRequest.error);
          };
        };

        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }

    // Sauvegarder une valeur
    async save_on_indexedDB(key: string, value: any): Promise<void> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const putRequest = store.put({ key: prefixedKey, value });
          putRequest.onsuccess = () => {
            resolve();
          };
          putRequest.onerror = () => {
            console.error('Erreur lors de la sauvegarde dans IndexedDB');
            reject(putRequest.error);
          };
        };

        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }

    // Supprimer une valeur par clé
    async delete_from_indexedDB(key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const deleteRequest = store.delete(prefixedKey);
          deleteRequest.onsuccess = () => {
            resolve();
          };
          deleteRequest.onerror = () => {
            console.error('Erreur lors de la suppression dans IndexedDB');
            reject(deleteRequest.error);
          };
        };

        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }

  }`;
}
//# sourceMappingURL=index.js.map
