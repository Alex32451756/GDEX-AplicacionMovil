import { FirestorageService } from './../../services/firestorage.service';
import { FirestoreService } from './../../services/firestore.service';
import { FirebaseauthService } from './../../services/firebaseauth.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './../../models';
import { Subscription, UnsubscriptionError } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  cliente: Cliente = {
    uid: '',
    email: '',
    nombre: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null,
  };

  newFile: any;
  uid = '';
  ingresaEnable = false;

  suscriberUserInfo: Subscription;
  constructor(public menucontroller: MenuController,
              public firebaseauthServices: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService) {

                this.firebaseauthServices.stateAuth().subscribe( res => {
                  if(res !== null){
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  }else{
                    this.initCliete();
                  }
                });
              }

  async ngOnInit() {
    const uid = await this.firebaseauthServices.getUid();
    console.log(uid);
  }

  initCliete(){
    this.uid = null;
    this. cliente = {
      uid: '',
      email: '',
      nombre: '',
      celular: '',
      foto: '',
      referencia: '',
      ubicacion: null,
    };
  }

  openMenu(){
    console.log('open Menu');
    this.menucontroller.toggle('principal');
  }

  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.cliente.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

 async registrarse(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular
    };
   const res =  await this.firebaseauthServices.register(credenciales.email, credenciales.password).catch(error => {
    console.log(error);
   });
   const uid = await this.firebaseauthServices.getUid();
   this.cliente.uid = uid;
   this.guardarUser();
   console.log(uid);
  }

  async salir(){
    this.firebaseauthServices.logout();
    this.suscriberUserInfo.unsubscribe();

  }

  async guardarUser(){
    const path = 'Clientes';
    const name = this.cliente.nombre;
    if(this.newFile !== undefined){
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.cliente.foto = res;
    }
    console.log('entro');
    this.firestoreService.creatDoc(this.cliente, path, this.cliente.uid)
          .then(resp =>{
            console.log('Guardado con exito');
           }).catch(error=>{

           });
  }

  getUserInfo(uid: string){
    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res => {
      this.cliente = res as Cliente;
    });
  }

  ingresar(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };
    this.firebaseauthServices.login(credenciales.email, credenciales.password).then(res => {
      console.log('Ingreso correctamente');
    });
  }

}
