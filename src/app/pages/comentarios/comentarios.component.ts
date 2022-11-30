import { FirebaseauthService } from './../../services/firebaseauth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from './../../services/firestore.service';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Producto} from './../../models';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit, OnDestroy {

  @Input() producto: Producto;
  comentario = '';
  aparace = false;
  suscriber: Subscription;
  suscriberUserInfo: Subscription;
  comentarios: Comentario[] = [];
  loading: any;

  constructor(public modalController: ModalController,
              public firestoreService: FirestoreService,
              public firebaseauthServices: FirebaseauthService,
              public toastController: ToastController,
              public loadingController: LoadingController) { }

  ngOnInit() {
    console.log('produictos', this.producto);
    this.loadComentarios();
  }

  ngOnDestroy(): void {
    if(this.suscriber){
      this.suscriber.unsubscribe();
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }


  loadComentarios(){
    this.presentLoading();
    let startAp = null;
    if(this.comentarios.length){
      startAp = this.comentarios[this.comentarios.length - 1].fecha;
    }
    const path = 'Productos/' + this.producto.id + '/comentarios';
    this.suscriber = this.firestoreService.getCollectionPaginada<Comentario>(path, 2, startAp).subscribe( res => {
      if(res.length){
        this.aparace = true;
        res.forEach(coment => {
          const exist = this.comentarios.find( commentExist => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            commentExist.id === coment.id;
          });
          this.loading.dismiss();
          if(exist === undefined){
            this.comentarios.push(coment);
          }
        });
      }else{
        this.aparace = false;
        this.loading.dismiss();
      }
    });
  }

  async comentar(){
    const comentario = this.comentario;
    console.log('comentario ->', comentario);
    const path = 'Productos/' + this.producto.id + '/comentarios';
    const data: Comentario = {
      autor: this.firebaseauthServices.datosCliente.nombre,
      comentario,
      fecha: new Date(),
      id: this.firestoreService.getId(),
    };

    this.firestoreService.creatDoc(data, path, data.id).then( () => {
      this.presentToast('Comentario Enviado', 'success');
      this.comentario = '';
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
      message: 'cargando comentarios...',
    });

    await this.loading.present();
   // await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }


}

interface Comentario {
  autor: string;
  comentario: string;
  fecha: any;
  id: string;
}
