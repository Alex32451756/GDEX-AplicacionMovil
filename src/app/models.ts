

export interface Producto{
    id: string;
    nombre: string;
    precioNormal: number;
    precioReducido: number;
    foto: string;
    fecha: Date;
}

export interface Cliente{
    uid: string;
    email: string;
    nombre: string;
    celular: string;
    foto: string;
    referencia: string;
    ubicacion: any;
}

export interface Pedido{
    uid: string;
    cliente: Cliente;
    productos: ProductoPedido [];
    precioTotal: number;
    estado: EstadoPedido;
    fecha: any;
    valoracion: number;
}

export interface ProductoPedido{
    producto: Producto;
    cantidad: number;
}

export type EstadoPedido = 'enviado' | 'visto' | 'en camino' | 'entregado';

export interface Provedor{
    id: string;
    nombre: string;
    correo: string;
    telefono: string;
    idCategoria: string;
    descripcion: string;
    facebook: string;
    ubicacion: string;
    foto: string;
    fecha: Date;
}
