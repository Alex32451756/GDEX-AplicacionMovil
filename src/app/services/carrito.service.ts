import { LoadingController, ToastController } from '@ionic/angular';
import { FirestoreService } from './firestore.service';
import { FirebaseauthService } from './firebaseauth.service';
import { Producto, Pedido, Cliente, ProductoPedido } from './../models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

path = 'carrito/';
uid = '';
cliente: Cliente;
pedido$ = new Subject<Pedido>();
carritoSuscriber: Subscription;
clienteSuscriber: Subscription;
loading: any;
private pedido: Pedido;


  constructor( public firebaseauthServices: FirebaseauthService,
                public firestoreService: FirestoreService,
                public loadingController: LoadingController,
                public toastController: ToastController,
                public router: Router) {
    this.initCarrito();
    this.firebaseauthServices.stateAuth().subscribe( res => {
      if(res !== null){
        this.uid = res.uid;
        this.loadCliente();
      }
    });
  }

  loadCarrito(){
    const path = 'Clientes/' + this.uid + '/' + this.path;
    if(this.carritoSuscriber){
      this.carritoSuscriber.unsubscribe();
    }
    this.carritoSuscriber = this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe(res => {
      if(res){
        this.pedido = res as Pedido;
        this.pedido$.next(this.pedido);

      }else{

        this.initCarrito();
      }
    });
  }

  initCarrito(){
    this.pedido = {
      uid: this.uid,
      cliente: this.cliente,
      productos:  [],
      precioTotal: null,
      estado: 'visto',
      fecha: new Date(),
      valoracion: null,
    };
    this.pedido$.next(this.pedido);
  }

  loadCliente(){

    const path = 'Clientes';
    this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe(res => {

      this.cliente = res as Cliente;
      });
    this.loadCarrito();
  }

  getCarrito(): Observable<Pedido>{
    setTimeout(() => {
      this.pedido$.next(this.pedido);
    }, 100);
   return this.pedido$.asObservable();
  }

  addProducto(producto: Producto){

    if(this.uid.length){
      const item = this.pedido.productos.find( productoPedido => (productoPedido.producto.id === producto.id));
      if(item !== undefined){
        item.cantidad ++;
      }else{
       const add: ProductoPedido = {
        cantidad: 1,
        producto,
       };
        this.pedido.productos.push(add);
      }
    }else{
      this.router.navigate(['/perfil']);
      return;
    }

    this.pedido$.asObservable();
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.creatDoc(this.pedido, path, this.pedido.uid).then( res => {
      this.presentToast('Producto agregado', 'success');
    });
  }

  removeProducto(producto: Producto){
    if(this.uid.length){
      let position = 0;
      const item = this.pedido.productos.find(( productoPedido, index) => {
        position = index;
        return (productoPedido.producto.id === producto.id);
      });
      if(item !== undefined){
        item.cantidad --;
        if (item.cantidad === 0){
          this.pedido.productos.splice(position, 1);
        }
        const path = 'Clientes/' + this.uid + '/' + this.path;
        this.firestoreService.creatDoc(this.pedido, path, this.pedido.uid).then( res => {
          this.presentToast('Producto Removido', 'warning');
        });
      }
    }

  }

  realizarPedido(){

  }

  limpiarCarrito(){
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.deleteDoc(path, this.uid).then( () => {
      this.initCarrito();
    });
  }

  async presentLoading(mensaje: string){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: mensaje,
    });

    await this.loading.present();
  // await this.loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }



  async presentToast(msg: string, colorp: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      cssClass: 'normal',
      position: 'top',
      color: colorp
    });

    await toast.present();
  }

}
