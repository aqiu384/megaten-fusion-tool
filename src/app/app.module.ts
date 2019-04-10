import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from './shared/shared.module';
import { SharedCompendiumModule } from './compendium/compendium.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    SharedCompendiumModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
