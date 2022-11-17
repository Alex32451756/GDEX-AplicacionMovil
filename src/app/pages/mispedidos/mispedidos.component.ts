import { Pedido } from './../../models';
import { Subscription } from 'rxjs';
import { FirebaseauthService } from './../../services/firebaseauth.service';
//import { CarritoService } from './../../services/carrito.service';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit, OnDestroy {

  nuevoSuscriber: Subscription;
  entregadoSuscriber: Subscription;
  pedidos: Pedido[] = [];

  constructor(public menucontroller: MenuController,
    public firestoreService: FirestoreService,
   // public carritoService: CarritoService,
    public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }

  ngOnDestroy(): void {
    if(this.nuevoSuscriber){
      this.nuevoSuscriber.unsubscribe();
    }
    if(this.entregadoSuscriber){
      this.entregadoSuscriber.unsubscribe();
    }
  }

  openMenu(){
    console.log('open Menu');
    this.menucontroller.toggle('principal');
  }

  changeSegment(ev: any){

    const opc = ev.detail.value;
    if(opc === 'culminados'){
      this.getPedidosCulminados();
    }
    if(opc === 'nuevos'){
      this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos(){
    console.log('estamos en nuevos');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevoSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'visto').subscribe(res => {
      if(res.length){
        this.pedidos = res;
      }
    });
  }

  async getPedidosCulminados(){
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.entregadoSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe(res => {
      if(res.length){
        this.pedidos = res;
      }
    });
  }

}
