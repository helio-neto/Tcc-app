import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PubProvider } from '../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { MapPage } from '../../pages/map/map';
import { List2pagePage } from './../../pages/list2page/list2page';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  
  tab1Root: any = MapPage;
  tab2Root: any = List2pagePage;
  
  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
              public pubProvider: PubProvider, public googleMaps: GoogleMapsProvider) {
        
    }
    // 
    ionViewDidLoad(){
      // this.platform.ready().then(() => {
      //     let mapLoaded = this.googleMaps.init(this.mapElement, this.pleaseConnect);
      //     //let locationsLoaded = this.pubProvider.load();

      //     Promise.all([
      //       mapLoaded,
      //       //locationsLoaded
      //     ]).then((result) => {
      //       let locations = result[1];
      //       //console.log("LOCATIONS",locations);
      //       //this.googleMaps.pinPubs(locations);
      //     });
      // });
    }
  }