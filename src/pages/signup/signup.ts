import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  pubForm : FormGroup;
  submitAttempt: boolean = false;
  pub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.pubForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: formBuilder.group({
        street: ['', Validators.required],
        hood: ['', Validators.required]
      }),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  save(){
 
    this.submitAttempt = true;
 
    if(!this.pubForm.valid){
        console.log("Formulário inválido");    
    }
    else {
        console.log("success!")
        console.log("Form ->",this.pubForm.value);
    }
  }
  
}
