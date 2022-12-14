import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProvedoresComponent } from './pages/provedores/provedores.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { MispedidosComponent } from './pages/mispedidos/mispedidos.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { HomeComponent } from './pages/home/home.component';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { map } from 'rxjs/operators';

const isAdmin = (next: any) => map((user: any) => !!user && 'WyzHWEB4kZdAU7vk93NazFkXKHA2' === user.uid);

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'set-productos', component: SetProductosComponent, ...canActivate(isAdmin)},
  { path: 'pedidos', component: PedidosComponent, ...canActivate(isAdmin)},
  { path: 'provedores', component: ProvedoresComponent, ...canActivate(isAdmin)},
  { path: 'dashboard', component: DashboardComponent, ...canActivate(isAdmin)},
  { path: 'perfil', component: PerfilComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'mis-pedidos', component: MispedidosComponent },
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
