import { CarritoService } from './../../services/carrito.service';
import { ProductoPedido } from './../../models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemcarrito',
  templateUrl: './itemcarrito.component.html',
  styleUrls: ['./itemcarrito.component.scss'],
})
export class ItemcarritoComponent implements OnInit {

  @Input() productoPedido: ProductoPedido;
  @Input() botones = true;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}

  addCarrito(){
    this.carritoService.addProducto(this.productoPedido.producto);
  }

  removeCarrito(){
    this.carritoService.removeProducto(this.productoPedido.producto);
  }
}
