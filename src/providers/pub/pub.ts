import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class PubProvider {

  private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
  private urlAPI2 = "https://tcchasbeeer.herokuapp.com/api/pubs";

  constructor(public http: HttpClient) {
    console.log('PubProvider Brewing!');
  }
  // 
  getPubs(): Observable<any[]>{
    return this.http.get(this.urlAPI2)
      .map(res => <any[]>res)
      .catch((erro:any)=>Observable.throw(erro));
  }
}
