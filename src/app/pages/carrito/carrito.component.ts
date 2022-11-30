import { Router } from '@angular/router';
import { FirebaseauthService } from './../../services/firebaseauth.service';
import { Subscription } from 'rxjs';
import { CarritoService } from './../../services/carrito.service';
import { Pedido } from './../../models';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController, ToastController, LoadingController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as internal from 'stream';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit, OnDestroy {

  pedidos: Pedido;
  carritoSuscriber: Subscription;
  total: number;
  cantidadTotal: number;
  loading: any;

    constructor(public menucontroller: MenuController,
                public firestoreService: FirestoreService,
                public carritoService: CarritoService,
                public firebaseauthService: FirebaseauthService,
                public toastController: ToastController,
                public router: Router,
                public loadingController: LoadingController ) {
                  this.initCarrito();
                  this.loadPedido();
      }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    if(uid === null)
    {
      this.router.navigate(['/perfil']);
      return;
    }

    console.log(uid);
  }

  ngOnDestroy(){
    if (this.carritoSuscriber){
      this.carritoSuscriber.unsubscribe();
    }
  }

  openMenu(){
  console.log('open Menu');
  this.menucontroller.toggle('principal');
  }

  async loadPedido(){
    this.carritoSuscriber = this.carritoService.getCarrito().subscribe(res => {
      console.log(res.productos.length);
      if(!res.productos.length){
      };
      this.pedidos = res;
      this.getCatidad();
      this.getTotal();
    });

  }

  initCarrito(){
    this.pedidos = {
      uid: '',
      cliente: null,
      productos:  [],
      precioTotal: null,
      estado: 'visto',
      fecha: new Date(),
      valoracion: null,
    };
  }

  getTotal(){
    this.total = 0;
    this.pedidos.productos.forEach(producto => {
      this.total = (producto.producto.precioReducido) * producto.cantidad + this.total;
    });
  }

  getCatidad(){
    this.cantidadTotal = 0;
    this.pedidos.productos.forEach(producto => {
      this.cantidadTotal = producto.cantidad + this.cantidadTotal;
    });
  }

 async pedir(){
  if(!this.pedidos.productos.length){
    this.presentToast('El carrito esta vacio', 'warning');
    return;
  }
    this.pedidos.fecha = new Date();
    this.pedidos.precioTotal = this.total;
    this.pedidos.uid = this.firestoreService.getId();
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    console.log('pedir() => ', this.pedidos, uid, path);
    this.firestoreService.creatDoc(this.pedidos, path, this.pedidos.uid).then(() => {
      this.presentToast('Pedido enviado', 'success');
      this.carritoService.limpiarCarrito();
    });
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

  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'cargando carrito..',
    });

    await this.loading.present();
   // await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }
  async showError() {
    await this.loading.dismiss();
    }

}
