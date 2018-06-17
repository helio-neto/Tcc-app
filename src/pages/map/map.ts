import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PubProvider } from '../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any; 
  cancelText: string = "Cancelar";

  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
              public pubProvider: PubProvider, public googleMaps: GoogleMapsProvider, 
              public navParams: NavParams) {

              this.searchDisabled = true;
              this.saveDisabled = true;
  }
  
  // On View Load
  // Check Platform, Load GoogleMaps, Load Pubs, Pin User, Pin Pubs
  ionViewDidLoad() {
      console.log('ionViewDidLoad MapPage');
      this.platform.ready().then(() => {
        let mapLoaded = this.googleMaps.init(this.mapElement, this.pleaseConnect).then(() => {
          let locationsLoaded = this.googleMaps.justGet().then((data)=>{
            this.googleMaps.pinPubs(data);
              //this.googleMaps.loadPlaces();
          }).catch((error)=>{
            console.log(error)
          });
        });
      });
  }
  // SearchBar Input Event     
  onInput(event){
      let sm = this.googleMaps.searchMap(this.query).then((data)=>{
        console.log("DATA SEARCH MAP -> ",data);
        this.googleMaps.pinPubs(data);
      });      
    //console.log(event);
  }
  // SearchBar Cancel Event
  onCancel(event){
      console.log(event);
  }
  
}
  