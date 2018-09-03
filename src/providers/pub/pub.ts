import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class PubProvider {
  
  data : any;
  //private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
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
  // 
  searchByBeer(beer_name){
    return this.http.get(this.urlAPI2+"/search/"+beer_name)
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  register(pub){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI2+"/register",pub,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  login(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI2+"/login", user,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }

}
