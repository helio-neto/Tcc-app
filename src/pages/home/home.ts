import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PubProvider } from '../../providers/pub/pub';

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
    pubs: any[];
    erro : any;
    viewMode: string = "list";

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    constructor(public navCtrl: NavController, public splashScreen: SplashScreen, private pubProv: PubProvider) {

    }
    // 
    ionViewDidLoad(){
      this.initMap();
      this.getPubs();
    }
    // 
    getPubs(){
        this.pubProv.getPubs().subscribe(
          data => {
            this.pubs = data;
            this.pinPubs();
            //console.log(this.pubs);
          },
          erro => this.erro = erro
        );
    }
    // 
    showMap() {
        setTimeout(() => {
            this.initMap();
        });
    }
    // 
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
    // 
    pinPubs(){
      this.pubs.forEach(pub =>{
        if(pub.address.geo.lat, pub.address.geo.lng){
          let pubGeo = new google.maps.LatLng(pub.address.geo.lat, pub.address.geo.lng);
          let pubMarker = new google.maps.Marker({
            position: pubGeo,
            title: pub.name,
            animation: google.maps.Animation.DROP
          });
          let infoWindow = new google.maps.InfoWindow({
            content: pub.name
          });
          google.maps.event.addListener(pubMarker, 'click', () => {
            //this.openPubDetails(pub);
            infoWindow.open(this.map, pubMarker);
            this.end = pubGeo;
            //this.calculateAndDisplayRoute();
            //console.log(pub.name);
          });
          pubMarker.setMap(this.map);
        }
      });
    }
    // 
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