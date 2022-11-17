import { FirebaseauthService } from './services/firebaseauth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  admin = false;

  constructor(
    private firebaseauthService: FirebaseauthService,

  ) {
    this.getUid();
  }

    ngOnInit(): void {

    }

  getUid(){
    this.firebaseauthService.stateAuth().subscribe( res => {
      if(res !== null){
        if(res.uid === 'WyzHWEB4kZdAU7vk93NazFkXKHA2'){
          this.admin = true;
        }else{
          this.admin = false;
        }
      }else{
        this.admin = false;
      }
    });
  }
}
