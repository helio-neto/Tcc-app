import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  pubForm : FormGroup;
  submitAttempt: boolean = false;
  addressConfirm: boolean = false;
  pub: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
              private formBuilder: FormBuilder,public googleMapsProvider: GoogleMapsProvider ) {
    this.pubForm = this.formBuilder.group({
      pubname: ['', Validators.required],
      location: formBuilder.group({
        street: ['', Validators.required],
        hood: [''],
        lat: [''],
        lng: [''],
        city: [''],
        uf: ['']
      }),
      ownername: ['',Validators.required],
      phone: [''],
      celphone: ['', Validators.required],
      info: [''],
      email: ['',Validators.email],
      photo: ['']
    });
  }
  // 
  presentConfirmAddress(address) {
    let alert = this.alertCtrl.create({
      title: 'Você confirma este endereço?',
      message:  `<p>Endereço: ${address.street}</p>
                  <p>Bairro: ${address.hood}</p>
                  <p>Cidade: ${address.city}</p>
                  <p>Uf: ${address.uf}</p>`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.pubForm.get("location.street").setErrors({
              'incorrect': true
            });
            this.addressConfirm = false;
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.addressConfirm = true;
            this.pubForm.get("location.street").updateValueAndValidity();
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  // 
  getPubAddress(){
    let address = this.pubForm.get("location.street").value;
    console.log("Address ->",address)
    this.googleMapsProvider.getAddressGeoCode(address).then((result)=>{
      this.presentConfirmAddress(result);
      console.log("Get Address ->",result);
    }).catch((error)=>{
      console.log("Erro coletando endereço ->",error);
    });
  }
  // 
  save(){

    if(!this.pubForm.valid){
        console.log("Formulário inválido");   
        this.submitAttempt = true; 
    }
    else {
      this.submitAttempt = false;
        console.log("success!")
        console.log("Form ->",this.pubForm.value);
    }
  }
  
}
