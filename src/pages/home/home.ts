import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start: any;
  end: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController, public splashScreen: SplashScreen) {

  }

  ionViewDidLoad(){
    this.initMap();
  }

  initMap() {

    let latLng = new google.maps.LatLng(-30.0987043,-51.2489956);
    this.start = latLng;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: latLng
    });
    this.splashScreen.hide();
    this.directionsDisplay.setMap(this.map);
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}