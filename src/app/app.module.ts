import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { NormasScreenComponent } from './screens/normas-screen/normas-screen.component';
import { PreguntasScreenComponent } from './screens/preguntas-screen/preguntas-screen.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { FooterComponent } from './partials/footer/footer.component';
import { SesionScreenComponent } from './screens/sesion-screen/sesion-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    RegistroScreenComponent,
    LoginScreenComponent,
    NormasScreenComponent,
    SesionScreenComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PreguntasScreenComponent,
    NavbarComponent,
    FooterComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
