import { ComentariosComponent } from './../../pages/comentarios/comentarios.component';
import { CarritoService } from './../../services/carrito.service';
import { Producto } from './../../models';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;
  loading: any;

  constructor( public carritoService: CarritoService,
                public loadingController: LoadingController,
                public toastController: ToastController,
                public alertController: AlertController,
               public modalController: ModalController) { }

  ngOnInit() {

  }

  addCarrito(){
    this.carritoService.addProducto(this.producto);
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ComentariosComponent,
      componentProps: {producto: this.producto}
    });

    return await modal.present();
  }

  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Agragado...',
    });

    await this.loading.present();
   // await loading.onDidDismiss();
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
