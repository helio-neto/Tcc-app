import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { PubProvider } from '../../providers/pub/pub';

@IonicPage()
@Component({
  selector: 'page-list2page',
  templateUrl: 'list2page.html',
})
export class List2pagePage {

  afterSearch: any = [];
  originData: any = [];
  pubs: any;
  erro: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean = true;
  cancelText: string = "Cancelar";
  searching: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMapsProvider, 
              public events: Events, public pubProvider: PubProvider) {
  }
  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad List2pagePage');
    this.pubs = this.googleMaps.pubsAfter;
    this.originData = this.pubs;
    console.log(this.pubs);
  }
  //
  openPubDetails(pub) {
    console.log(pub);
    this.events.publish("PubPage",pub);
  }
  
  onInput(event){
    //console.log("Search Event",event);
    //console.log("Query",this.query);
    if(this.query == ''){
      this.pubs = this.originData;
    }else{
      this.pubProvider.searchByBeer(this.query).subscribe(
        (data) => {
          this.places = data.result;
          this.afterSearch = [];
          this.pubs.forEach((e1)=>this.places.forEach((e2)=> {
            if(e1.pubname.toLowerCase() == e2.pubname.toLowerCase()){
              console.log(e1.pubname);
              this.afterSearch.push(e1);
            }
          }));
          this.pubs = this.afterSearch;
          //console.log("SEARCH RESULT ->",this.afterSearch);
          
        },
        (erro) => this.erro = erro
      );
    }
    
  }
  onCancel(event){
    this.pubs = this.originData;
    console.log("Cancel Event",event);
  }
}