import { Producto } from './../../models';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  productos: Producto[] = [];
  loading: any;
  private path = 'Productos/';


  constructor(public menucontroller: MenuController,
    public loadingController: LoadingController,
              public firestoreService: FirestoreService ) {
                this.loadProductos();
              }

  ngOnInit() {}

  openMenu(){
    console.log('open Menu');
    this.menucontroller.toggle('principal');
  }

  loadProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos =  res;
    });
  }

  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'cargando Productos...',
    });

    await this.loading.present();
   // await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }

}
