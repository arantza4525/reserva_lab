import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import {NormasScreenComponent} from "./screens/normas-screen/normas-screen.component";
import {PreguntasScreenComponent} from "./screens/preguntas-screen/preguntas-screen.component";
import {SesionScreenComponent} from "./screens/sesion-screen/sesion-screen.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent, pathMatch: 'full' },
  { path: 'registro', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'dashboard', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'normas', component: NormasScreenComponent, pathMatch: 'full' },
  { path: 'preguntas', component: PreguntasScreenComponent, pathMatch: 'full' },
  {path: 'sesion', component: SesionScreenComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
