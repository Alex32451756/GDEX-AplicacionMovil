import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  creatDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    //this.afs.collection('users'), ref => ref.limit(1).orderBy('date','desc')).valueChanges();
    return collection.doc(id).set(data);
  }

  getDoc<Tipo>(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId(){
    return this.database.createId();
  }

  getCollection<Tipo>(path: string){
    const collection = this.database.collection<Tipo>(path);
    return collection.valueChanges();

  }

  getCollectionQuery<Tipo>(path: string, parametro: string, condicion: any, busquedad: string){
    const collection = this.database.collection<Tipo>(path, ref => ref.where(parametro, condicion, busquedad));
    return collection.valueChanges();

  }

  getCollectionAll<Tipo>(path: string, parametro: string, condicion: any, busquedad: string, startAt: any){

    if(startAt === null){
      startAt = new Date();
    }
    const collection = this.database.collectionGroup<Tipo>(path, ref => ref.where(parametro, condicion, busquedad)
                        .orderBy('fecha', 'desc')
                        .limit(2)
                        .startAfter(startAt)
                        );
    return collection.valueChanges();
  }

  getCollectionVendidos<Tipo>(path: string){

    const collection = this.database.collectionGroup<Tipo>(path, ref => ref.where('estado', '==', 'entregado')
                        .limit(5)
                        );
                        console.log(collection);
    return collection.valueChanges();
  }

  getCollectionPaginada<Tipo>(path: string, limit: number, startAt: any){

    if(startAt === null){
      startAt = new Date();
    }
    const collection = this.database.collection<Tipo>(path, ref => ref.orderBy('fecha', 'desc')
                        .limit(limit)
                        .startAfter(startAt)
                        );
    return collection.valueChanges();
  }

}
