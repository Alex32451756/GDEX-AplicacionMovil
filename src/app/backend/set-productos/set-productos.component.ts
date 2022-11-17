import { Producto } from './../../models';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from './../../services/firestore.service';


@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];

  newProducto: Producto;

  enableNewProducto = false;
  loading: any;
  newImage = '';
  newFile = '';
  private path = 'Productos/';

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos();
  }
  openMenu(){
    console.log('open Menu');
    this.menucontroler.toggle('principal');
  }

 async guardarProducto(){
    this.presentLoading();
    const path = 'Productos';
    const name = this.newProducto.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newProducto.foto = res;


    console.log('entro');
    this.firestoreService.creatDoc(this.newProducto, this.path, this.newProducto.id)
          .then(resp =>{
            this.loading.dismiss();
            this.presentToast('Guardado con éxito', 'success');
            this.enableNewProducto = false;
           }).catch(error=>{
            this.presentToast('No se guardo', 'danger');
          });
  }

  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res;
    });
  }

  async deleteProducto(producto: Producto){
      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Advertencia',
        //subHeader: '',
        message: 'Seguro desea <strong> eliminar</strong> este producto',
        buttons: [
          {
            text: 'cancelar',
            role: 'cancel',
            cssClass: 'normal',
            handler: (blah) =>{
              console.log('Confirm Cancel: bash');
            }
          },
          {
            text: 'ok',
            handler: (blah) =>{
              console.log('Confirm Okay');
              this.firestoreService.deleteDoc(this.path, producto.id)
              .then(res => {
                this.presentToast('Eliminado con éxito', 'light');
                this.alertController.dismiss();
                }).catch(error=>{
                  this.presentToast('No se pudo eliminar', 'danger');
               });
            }
          }
        ],
      });
      await alert.present();
  }

  nuevoPro(){
    this.enableNewProducto = true;
    this.newProducto = {
      id:  this.firestoreService.getId(),
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: '',
      fecha: new Date()
    };
  }

  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...',
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

  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.newProducto.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }


  }
}
