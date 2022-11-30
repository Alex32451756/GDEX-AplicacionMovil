import { GraficasComponent } from './../graficas/graficas.component';
import { Pedido } from './../../models';
import { Subscription } from 'rxjs';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  nuevoSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntrgados: Pedido[] = [];

  constructor(public menucontroller: MenuController,
              public firestoreService: FirestoreService,
              public modalController: ModalController) { }

  ngOnInit() {}

  openMenu(){
    console.log('open Menu');
    this.menucontroller.toggle('principal');
    }

    async openModal(){
      const modal = await this.modalController.create({
        component: GraficasComponent,
        //componentProps: {producto: this.producto}
      });
      return await modal.present();
    }



}
