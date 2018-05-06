import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public splashScreen: SplashScreen) {
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
    console.log('WelcomePage loaded!!!');
  }

}
