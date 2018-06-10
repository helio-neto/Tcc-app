import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController, NavController, Events } from 'ionic-angular';
import { App } from 'ionic-angular';

import { ConnectivityService } from './../connectivity-service/connectivity-service';
import { PubProvider } from '../../providers/pub/pub';

declare var google;

@Injectable()
export class GoogleMapsProvider {
  
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  
  userPos: any = null;
  markers: any = [];
  pubs: any[];
  erro: any;
  pubsAfter: any[];

  constructor(public splashScreen: SplashScreen, public http: HttpClient, public connectivityService: ConnectivityService, 
              private pubProv: PubProvider, public geoLocation: Geolocation, public app: App, public events: Events,
              private toastCtrl: ToastController) {
      
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
      // this.mapInitialised = true;
      return new Promise((resolve) => {
       
        let opt = {maximumAge: 30000, timeout: 20000, enableHighAccuracy: true};

        this.geoLocation.getCurrentPosition(opt).then((position) => {
          alert("Estamos carregando sua posição...");
          this.userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let mapOptions = {
            center: this.userPos,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          
          this.mapInitialised = true;  
          this.splashScreen.hide();
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

          let meMarker = new google.maps.Marker({
              position: this.userPos,
              title: "Eu"
          });
          let infoMe = new google.maps.InfoWindow({
            content: "Estou aqui!"
          });
          google.maps.event.addListener(meMarker, 'click', () => {
            infoMe.open(this.map, meMarker);
          });
          meMarker.setMap(this.map);
          this.getPubs();
          resolve(true);
        }).catch((error) => {
          // alert((error.message));
          alert("Não conseguimos coletar sua localização atual.Por favor verifique se seu gps está habilitado");
          // navigator.geolocation.getCurrentPosition((data)=>{
          //    alert(data.coords.latitude+" - "+data.coords.longitude);
          // });
          let latLng = new google.maps.LatLng(-30.0989177,-51.2469273);
          this.userPos = latLng
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          this.mapInitialised = true;  
          this.splashScreen.hide();
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

          let meMarker = new google.maps.Marker({
              position: latLng,
              title: "Eu"
          });
          let infoMe = new google.maps.InfoWindow({
            content: "Estou aqui!"
          });
          google.maps.event.addListener(meMarker, 'click', () => {
            infoMe.open(this.map, meMarker);
          });
          meMarker.setMap(this.map);
          this.getPubs();
          resolve(true);
          console.log('Not possible to use native geolocation - reason -> - '+ error);
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
    // 
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
    // 
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
          (data) => {
            this.pubs = data;
            this.pubsAfter = this.applyHaversine(data);
            this.pubsAfter.sort((locationA, locationB) => {
              return locationA.distance - locationB.distance;
            });
            console.log("Pubs After SORT by distance- ",this.pubsAfter);

            this.pinPubs(this.pubsAfter);
          },
          (erro) => this.erro = erro
     );
  }
  justGet(){ 
    if(this.pubsAfter){
        return Promise.resolve(this.pubsAfter);
    }
    return new Promise(resolve => {
      this.pubProv.getPubs().subscribe(
                data => {
                this.pubsAfter = this.applyHaversine(data);
                this.pubsAfter.sort((locationA, locationB) => {
                    return locationA.distance - locationB.distance;
                });
            resolve(this.pubsAfter);
        });
    });
  }
  //
  pinPubs(pubs){
      pubs.forEach(pub =>{
          if(pub.location.lat, pub.location.lng){
            let pubLocation = new google.maps.LatLng(pub.location.lat, pub.location.lng);
            let pubMarker = new google.maps.Marker({
              position: pubLocation,
              title: pub.pubname,
              animation: google.maps.Animation.DROP
            });
            //let infocontent =  `<p id = "myid` + pub.pubname + `">Click</p>`;
            let info2 = '<div id="iw-content">'+
                          '<h1 id="iw-title" class="iw-title">' + pub.pubname + '</h1>'+
                          '<p id = "myid' + pub.pubname + '">Ver detalhes</p>'+
                        '</div>';
            // let content = '<div id="iw-container">' +
            //             '<div class="iw-title">'+pub.pubname+'</div>' +
            //             '<div class="iw-content">' +
            //               '<div class="iw-subTitle">History</div>' +
            //               '<img src="'+ pub.photo +'" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
            //               '<p ion-text color="secondary" id = "myid' + pub.pubname + '">Ver detalhes</p>'+
            //               '<div class="iw-subTitle">Contacts</div>' +
            //               '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
            //               '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
            //             '</div>' +
            //             '<div class="iw-bottom-gradient"></div>' +
            //           '</div>';
            let infoWindow = new google.maps.InfoWindow({
              content: info2
            });

            google.maps.event.addListener(pubMarker, 'click', () => {
              infoWindow.open(this.map, pubMarker);
            });
            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
              document.getElementById('myid' + pub.pubname).addEventListener('click', () => {
                //this.navCtrl.push('PubPage', pub);
                this.events.publish("PubPage",pub);
              });
            });        
            pubMarker.setMap(this.map);
          }
    });
  }
  // DEPRECATED
  get navCtrl(): NavController {
    return this.app.getActiveNav();
  }
  // 
  applyHaversine(pubs){
 
    let usersLocation = {
        lat: this.userPos.lat(),
        lng: this.userPos.lng()
    };
  
    pubs.map((pub) => {
        let placeLocation = {
            lat: pub.location.lat,
            lng: pub.location.lng
        };

        pub.distance = this.getDistanceBetweenPoints(
          usersLocation,
            placeLocation,
            'km'
        ).toFixed(2);
    });

    return pubs;
  }
  // 
  getDistanceBetweenPoints(start, end, units){
  
    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units || 'km'];
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
  //
  toRad(x){
    return x * Math.PI / 180;
  }

  

}
  