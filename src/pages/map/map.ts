import { Component, ViewChild, ElementRef } from '@angular/core';
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

  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
    public pubProvider: PubProvider, public googleMaps: GoogleMapsProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.platform.ready().then(() => {
      let mapLoaded = this.googleMaps.init(this.mapElement, this.pleaseConnect);
      let locationsLoaded = this.googleMaps.justGet();

      Promise.all([
        mapLoaded,
        locationsLoaded
      ]).then((result) => {
        let locations = result[1];
        this.googleMaps.pinPubs(locations);
      });
  });
  }

}
