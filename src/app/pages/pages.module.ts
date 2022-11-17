import { ProvedoresComponent } from './provedores/provedores.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { MispedidosComponent } from './mispedidos/mispedidos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ComponentsModule } from './../components/components.module';
import { PerfilComponent } from './perfil/perfil.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    CarritoComponent,
    MispedidosComponent,
    PedidosComponent,
    ComentariosComponent,
    ProvedoresComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    ComponentsModule
  ]
})
export class PagesModule { }
