import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';

@IonicPage()
@Component({
  selector: 'page-list2page',
  templateUrl: 'list2page.html',
})
export class List2pagePage {

  pubs: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMapsProvider, 
              public events: Events) {
  }
  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad List2pagePage');
    this.pubs = this.googleMaps.pubsAfter;
    console.log(this.pubs);
  }
  //
  openPubDetails(pub) {
    console.log(pub);
    this.events.publish("PubPage",pub);
  }
}
