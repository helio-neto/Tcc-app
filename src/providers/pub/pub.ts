import { HttpClient } from '@angular/common/http';
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
  loadLocations(){ 
    if(this.data){
        return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
        this.http.get(this.urlAPI2)
            .map(res => <any[]>res)
            .subscribe(data => {
                this.data = this.applyHaversine(data);
                this.data.sort((locationA, locationB) => {
                    return locationA.distance - locationB.distance;
                });
            resolve(this.data);
        });
    });
  }

  applyHaversine(locations){
  
      let usersLocation = {
          lat: 40.713744,
          lng: -74.009056
      };

      locations.map((location) => {

          let placeLocation = {
              lat: location.latitude,
              lng: location.longitude
          };

          location.distance = this.getDistanceBetweenPoints(
              usersLocation,
              placeLocation,
              'km'
          ).toFixed(2);
      });

      return locations;
  }

  getDistanceBetweenPoints(start, end, units){

      let earthRadius = {
          miles: 3958.8,
          km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return d;

  }

  toRad(x){
      return x * Math.PI / 180;
  }

}
