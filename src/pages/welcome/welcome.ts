import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectivityService } from './../../providers/connectivity-service/connectivity-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public splashScreen: SplashScreen, 
              public connectivityService: ConnectivityService) {
               
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
    console.log('WelcomePage loaded!!!');
  }

}
