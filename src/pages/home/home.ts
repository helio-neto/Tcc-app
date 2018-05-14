import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PubProvider } from '../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  
  viewMode: string = "list";
  
  // directionsService = new google.maps.DirectionsService;
  // directionsDisplay = new google.maps.DirectionsRenderer;
  
  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
              public googleMaps: GoogleMapsProvider) {
        
    }
    // 
    ionViewDidLoad(){
      this.platform.ready().then(() => {
        let mapLoaded = this.googleMaps.init(this.mapElement, this.pleaseConnect);
      });
    }
    // // 
    // getPubs(){
    //   this.pubProv.getPubs().subscribe(
    //     data => {
    //       this.pubs = data;
    //       this.pinPubs();
    //       //console.log(this.pubs);
    //     },
    //     erro => this.erro = erro
    //   );
    // }
    // //
    // loadGoogleMaps(){
    //   alert("begin");     
    //   if(this.connectivityService.isOnline()){
    //     alert("showing map");
    //     this.initMap();
    //     this.enableMap();
    //   }
    //   else {
    //     alert("disabling map");
    //     this.disableMap();
    //   }
      
    // }
    //
    // initMap(){
    //   let opt = {maximumAge: 30000, timeout: 5000, enableHighAccuracy: false};
    //   alert("Init map :: Begin");
    //   alert("Is Device :: "+this.connectivityService.isDevice());
    //     this.geoLocation.getCurrentPosition(opt).then((position) => {
    //       alert("Init Native Geo...");
    //       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
    //       let mapOptions = {
    //         center: latLng,
    //         zoom: 15,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //       }
          
    //       this.splashScreen.hide();
    //       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //       this.mapInitialised = true;
    //       this.getPubs();
    //     }).catch((error) => {
    //       alert("Init Fixed Position Map...");
    //       let latLng = new google.maps.LatLng(-30.0987043,-51.2489956);
    //       let mapOptions = {
    //         center: latLng,
    //         zoom: 15,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //       }
    //       this.splashScreen.hide();
    //       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //       this.mapInitialised = true;
    //       this.getPubs();
    //       console.log('Error getting location - '+ error);
    //     }); 
    // }
    //
    // enableMap(): void{
    //   if(this.pc){
    //     this.pc.style.display = "none";
    //   }
    // }
    // //
    // disableMap(): void{
    //   if(this.pc){
    //     this.pc.style.display = "block";
    //   }
    // }
    // //
    // pinPubs(){
    //   this.pubs.forEach(pub =>{
    //     if(pub.address.geo.lat, pub.address.geo.lng){
    //       let pubGeo = new google.maps.LatLng(pub.address.geo.lat, pub.address.geo.lng);
    //       let pubMarker = new google.maps.Marker({
    //         position: pubGeo,
    //         title: pub.name,
    //         animation: google.maps.Animation.DROP
    //       });
    //       let infoWindow = new google.maps.InfoWindow({
    //         content: pub.name
    //       });
    //       google.maps.event.addListener(pubMarker, 'click', () => {
    //         //this.openPubDetails(pub);
    //         infoWindow.open(this.map, pubMarker);
    //         this.end = pubGeo;
    //         //this.calculateAndDisplayRoute();
    //         //console.log(pub.name);
    //       });
    //       pubMarker.setMap(this.map);
    //     }
    //   });
    // }
    // 
    // calculateAndDisplayRoute() {
    //     this.directionsService.route({
    //       origin: this.start,
    //       destination: this.end,
    //       travelMode: 'DRIVING'
    //     }, (response, status) => {
    //       if (status === 'OK') {
    //         this.directionsDisplay.setDirections(response);
    //       } else {
    //         window.alert('Directions request failed due to ' + status);
    //       }
    //     });
    // }
    
  }