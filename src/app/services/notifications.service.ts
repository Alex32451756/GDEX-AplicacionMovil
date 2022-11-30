import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public platform: Platform) { }

  inicializar()
  {
    if(this.platform.is('capacitor')){
      PushNotifications.requestPermissions().then( result => {
        console.log('PushNotifications.requestPermission()');
        if(result.receive === 'granted'){
          PushNotifications.register();
          this.addListeners();
        }else{

        }
      });
    }else{
      console.log('PushNotifications.requestPermission() -> no es movil');
    }
  }

  addListeners(){
        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
        (token: Token) => {
          //this.guadarToken(token.value);
          alert('Push registration success, token: ' + token.value);
        }
      );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
        (error: any) => {
          alert('Error on registration: ' + JSON.stringify(error));
        }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push received en 1er plano: ', notification);
          alert('Push received: ' + JSON.stringify(notification));
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
          //this.router.navigate([/pedidos]);
        }
      );
  }




}
