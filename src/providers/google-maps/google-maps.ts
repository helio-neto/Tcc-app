import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';

import { ConnectivityService } from './../connectivity-service/connectivity-service';
import { PubProvider } from '../../providers/pub/pub';

declare var google;

@Injectable()
export class GoogleMapsProvider {
  
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  
  markers: any = [];
  pubs: any[];
  erro: any;
  constructor(public splashScreen: SplashScreen, public http: HttpClient, public connectivityService: ConnectivityService, 
    private pubProv: PubProvider, public geoLocation: Geolocation,private toastCtrl: ToastController) {
      console.log('Hello GoogleMapsProvider Provider');
    }
    //
    init(mapElement: any, pleaseConnect: any): Promise<any> {
      
      this.mapElement = mapElement;
      this.pleaseConnect = pleaseConnect;
      
      return this.loadGoogleMaps();
      
    }
    //
    loadGoogleMaps(): Promise<any> {
      
      return new Promise((resolve) => {
        
        if(this.connectivityService.isOnline()){
          this.initMap().then(() => {
            resolve(true);
          });
          this.enableMap();
        }else {
          this.disableMap();
          this.splashScreen.hide();
        }       
        this.addConnectivityListeners();   
      });
      
    }
    //
    initMap(): Promise<any> {
      
      this.mapInitialised = true;
      
      return new Promise((resolve) => {
        // alert("Begin process...");
        let opt = {maximumAge: 30000, timeout: 10000, enableHighAccuracy: true};
        this.geoLocation.getCurrentPosition(opt).then((position) => {
          alert("Init Native Geo...");
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          
          this.splashScreen.hide();
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          let meMarker = new google.maps.Marker({
            position: latLng,
            title: "Eu"
          });
          meMarker.setMap(this.map);
          this.getPubs();
          resolve(true);
        }).catch((error) => {
          alert("Init fixed geo...");
          // navigator.geolocation.getCurrentPosition((data)=>{
          //   alert(data.coords.latitude+" - "+data.coords.longitude);
          // });
          let latLng = new google.maps.LatLng(-30.0989177,-51.2469273);
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          this.splashScreen.hide();
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          let meMarker = new google.maps.Marker({
            position: latLng,
            title: "Eu"
          });
          meMarker.setMap(this.map);
          this.getPubs();
          resolve(true);
          console.log('Error getting location - '+ error);
        });
      });
    }
    //
    disableMap(): void {
      if(this.pleaseConnect){
        this.pleaseConnect.nativeElement.style.display = "block";
      } 
    }
    //
    enableMap(): void {
      if(this.pleaseConnect){
        this.pleaseConnect.nativeElement.style.display = "none";
      }
    }
    //
    addConnectivityListeners(): void { 
      this.connectivityService.watchOnline().subscribe(() => { 
        setTimeout(() => {
          this.displayNetworkUpdate("Online");
          if(typeof google == "undefined" || typeof google.maps == "undefined"){
            this.loadGoogleMaps();
          }else {
            if(!this.mapInitialised){
              this.initMap();
            }   
            this.enableMap();
          }
        }, 3000);
      });    
      this.connectivityService.watchOffline().subscribe(() => {    
        this.displayNetworkUpdate("Offline");
        this.disableMap();      
      });     
    }
    //
    displayNetworkUpdate(message){     
      this.toastCtrl.create({
        message: `Você está ${message} agora.`,
        duration: 3000,
        position: "bottom"
      }).present();
    }
    //
    addMarker(lat: number, lng: number): void {      
      let latLng = new google.maps.LatLng(lat, lng);
      
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });    
      this.markers.push(marker);     
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
            //this.end = pubGeo;
            //this.calculateAndDisplayRoute();
            //console.log(pub.name);
          });
          pubMarker.setMap(this.map);
        }
      });
    }
  }
  