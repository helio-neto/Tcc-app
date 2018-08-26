import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { ListPage } from './../pages/list/list';
import { List2pagePage } from './../pages/list2page/list2page';
import { WelcomePage } from '../pages/welcome/welcome';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';

import { HttpClientModule } from '@angular/common/http';

import { PubProvider } from '../providers/pub/pub';
import { ConnectivityService } from '../providers/connectivity-service/connectivity-service';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { LocationsProvider } from '../providers/locations/locations';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    MapPage,
    ListPage,
    List2pagePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WelcomePage,
    MapPage,
    ListPage,
    List2pagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Network,
    PubProvider,
    ConnectivityService,
    GoogleMapsProvider,
    LocationsProvider
  ]
})
export class AppModule {}
