import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValuesComponent } from './values/values.component';
import { LightComponent } from './lights/lights.component';
import { SmartHomeComponent } from './smart-home/smart-home.component';
import { MyfitComponent } from './myfit/myfit.component';


const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'values', component: ValuesComponent },
  { path: 'lights', component: LightComponent },
  { path: 'smarthome', component: SmartHomeComponent },
  { path: 'myfit', component: MyfitComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
