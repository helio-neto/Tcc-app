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
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  
  userPos: any = null;
  markers: any = [];
  pubs: any[];
  originData: any = [];
  afterSearch: any = [];
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
          resolve(true);
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

          let image = {
            url: 'assets/imgs/mapicons/user.png',
            scaledSize: new google.maps.Size(40, 40)
          };
          let meMarker = new google.maps.Marker({
            position: this.userPos,
            title: "Eu",
            map: this.map,
            icon: image
          });
          let infoMe = new google.maps.InfoWindow({
            content: "Estou aqui!"
          });
          google.maps.event.addListener(meMarker, 'click', () => {
            infoMe.open(this.map, meMarker);
          });
          
          resolve(true);
          
        }).catch((error) => {
          // alert((error.message));
          alert("Não conseguimos coletar sua localização atual.Por favor verifique se seu gps está habilitado");
          navigator.geolocation.getCurrentPosition((data)=>{
            alert(data.coords.latitude+" - "+data.coords.longitude);
          });
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
          let image = {
            url: 'assets/imgs/mapicons/user.png',
            scaledSize: new google.maps.Size(40, 40)
          };
          let meMarker = new google.maps.Marker({
            position: this.userPos,
            title: "Eu",
            map: this.map,
            icon: image
          });
          let infoMe = new google.maps.InfoWindow({
            content: "Estou aqui!"
          });
          google.maps.event.addListener(meMarker, 'click', () => {
            infoMe.open(this.map, meMarker);
          });
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
    createMarker(place) {
      let placeLoc = place.geometry.location;
      var image = {
        url: 'assets/imgs/mapicons/beer-icon1-1.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(40, 40)
      };
      
      let placeMarker = new google.maps.Marker({
        position: placeLoc,
        title: place.name,
        map: this.map,
        icon: image
      });
      
      let infoPlace = new google.maps.InfoWindow({
        content: '<div><strong>' + place.name + '</strong><br>' +
        place.vicinity + '</div>'
      });
      google.maps.event.addListener(placeMarker, 'click', () => {
        infoPlace.open(this.map, placeMarker);
      });
      
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
    //
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
            this.originData = this.pubsAfter;
            resolve(this.pubsAfter);
          });
      });
    }
    //
    searchMap(query){
      if(query == ''){
        this.pubs = this.originData;
        return Promise.resolve(this.pubs);     
      }else{
        return new Promise(resolve => {
          this.pubProv.searchByBeer(query).subscribe(
            (data) => {
              this.pubs = data.result;
              this.afterSearch = [];
              this.pubsAfter.forEach((e1)=>this.pubs.forEach((e2)=> {
                if(e1.pubname.toLowerCase() == e2.pubname.toLowerCase()){
                  console.log(e1.pubname);
                  this.afterSearch.push(e1);
                }
              }));
              resolve(this.afterSearch);
              //console.log("SEARCH RESULT ->",this.afterSearch);
              
            },
            (erro) => this.erro = erro
          );;
        });
        
      }
    }
    //
    pinPubs(pubs){
        pubs.forEach(pub =>{
          if(pub.location.lat, pub.location.lng){
            let pubLocation = new google.maps.LatLng(pub.location.lat, pub.location.lng);
            let image = {
              url: 'assets/imgs/mapicons/beer-cup1-1.svg',
              scaledSize: new google.maps.Size(40, 40)
            };
            let pubMarker = new google.maps.Marker({
              position: pubLocation,
              title: pub.pubname,
              animation: google.maps.Animation.DROP,
              map: this.map,
              icon: image
            });
            
            let info2 = '<div id="iw-content">'+
            '<h1 id="iw-title" class="iw-title">' + pub.pubname + '</h1>'+
            '<p id = "myid' + pub.pubname + '">Ver detalhes</p>'+
            '</div>';
            
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
    
    //
    loadPlaces(){
      let service = new google.maps.places.PlacesService(this.map);
          service.nearbySearch({
            location: this.userPos,
            radius: 1000,
            type: ['bar']
          }, (results,status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                this.createMarker(results[i]);
              }
            }
          });
    }
      
      
    }
    //
    