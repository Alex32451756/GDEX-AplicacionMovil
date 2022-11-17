import { Provedor } from './../../models';
import { FirestorageService } from './../../services/firestorage.service';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provedores',
  templateUrl: './provedores.component.html',
  styleUrls: ['./provedores.component.scss'],
})
export class ProvedoresComponent implements OnInit {

  provedores: Provedor[] = [];

  newProvedor: Provedor;

  enableNewProducto = false;
  loading: any;
  newImage = '';
  newFile = '';
  private path = 'Proveedores/';

  constructor(public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FirestorageService) { }


  ngOnInit() {
    this.getProvedores();
  }
  openMenu(){
    console.log('open Menu');
    this.menucontroler.toggle('principal');
  }

 async guardarProvedor(){
    this.presentLoading();
    const path = 'Proveedores';
    const name = this.newProvedor.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newProvedor.foto = res;


    console.log('entro');
    this.firestoreService.creatDoc(this.newProvedor, this.path, this.newProvedor.id)
          .then(resp =>{
            this.loading.dismiss();
            this.presentToast('Guardado con éxito', 'success');
            this.enableNewProducto = false;
           }).catch(error=>{
            this.presentToast('No se puede guardo', 'danger');
          });
  }

  getProvedores(){
    this.firestoreService.getCollection<Provedor>(this.path).subscribe(res => {
      this.provedores = res;
    });
  }

  async deleteProvedor(provedor: Provedor){
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
              this.firestoreService.deleteDoc(this.path, provedor.id)
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
    this.newProvedor = {
      id:  this.firestoreService.getId(),
      nombre: '',
      correo: '',
      telefono: '',
      idCategoria: '',
      descripcion: '',
      facebook: '',
      ubicacion: '',
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
        this.newProvedor.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }


  }

}
