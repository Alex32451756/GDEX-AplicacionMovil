import { FirebaseauthService } from './../../services/firebaseauth.service';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController } from '@ionic/angular';
import { Pedido } from './../../models';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit, OnDestroy {

  nuevoSuscriber: Subscription;
  entregadoSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntrgados: Pedido[] = [];
  nuevos = true;

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
      this.nuevos = false;
      this.getPedidosCulminados();
    }
    if(opc === 'nuevos'){
      this.nuevos = true;
      this.getPedidosNuevos();
    }
  }

  async getPedidosCulminados(){
    console.log('estamos en culminados');
    const path = 'pedidos';
    let startAt = null;
    if(this.pedidosEntrgados.length){
      startAt = this.pedidosEntrgados[this.pedidosEntrgados.length - 1].fecha;
    }
    this.nuevoSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt).subscribe(res => {
      if(res.length){
        res.forEach( pedido => {
          this.pedidosEntrgados.push(pedido);
        });
      }
    });
  }

  async getPedidosNuevos(){
    console.log('estamos en nuevos');
    const path = 'pedidos';
    let startAt = null;
    if(this.pedidos.length){
      startAt = this.pedidos[this.pedidos.length - 1].fecha;
    }
    this.nuevoSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'visto', startAt).subscribe(res => {
      if(res.length){
        res.forEach( pedido => {
          this.pedidos.push(pedido);
        });
      }
    });
  }

  cargarMas(){
    if(this.nuevos){
      this.getPedidosNuevos();
    }else{
      this.getPedidosCulminados();
    }
  }

}

