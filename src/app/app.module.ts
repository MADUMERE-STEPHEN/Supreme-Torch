import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    // ...your components
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase), // <-- This line is required!
    AngularFirestoreModule, // <-- This line is required!
    // ...other modules
  ],
  providers: [],
  bootstrap: [/* your root component */]
})
export class AppModule { }