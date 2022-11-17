import { Cliente } from './../models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from './firestore.service';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  suscriberUserInfo: Subscription;
  datosCliente: Cliente = {
    uid: '',
    email: '',
    nombre: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null,
  };

  constructor(public auth: AngularFireAuth,
              public firestoreService: FirestoreService) {
    this.stateUser();
   }

   stateUser(){
    this.stateAuth().subscribe( res => {
      if(res !== null){
        this.getInfoUser();
      }
    });
   }


  login(email: string, password: string){
   return  this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
   return this.auth.signOut();
  }
  register(email: string, password: string){
   return  this.auth.createUserWithEmailAndPassword(email, password);
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if(user === null){
      return null;
    }else{
      return user.uid;
    }
  }

  stateAuth(){
   return this.auth.authState;
  }


  async getInfoUser(){
    const uid = await this.getUid();
    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res => {
        if(res !== undefined){
          this.datosCliente = res as Cliente;
        }
    });
  }
}
