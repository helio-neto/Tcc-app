import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pub',
  templateUrl: 'pub.html',
})
export class PubPage {

  pub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pub = navParams.data.pub;
    console.log(this.pub);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PubPage');
  }
  // 
  openMenu(){
    this.navCtrl.push('ListPage', { 'beers': this.pub.beers });
  }
}
