import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NavController, Platform, ViewController } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsProvider } from '../google-maps/google-maps';

@Injectable()
export class LocationsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LocationsProvider Provider');
  }


//   let meMarker = new google.maps.Marker({
//     position: this.userPos,
//     title: "Eu"
// });
// let infoMe = new google.maps.InfoWindow({
//   content: "Estou aqui!"
// });
// google.maps.event.addListener(meMarker, 'click', () => {
//   infoMe.open(this.map, meMarker);
// });
// meMarker.setMap(this.map);
// this.getPubs();


}
