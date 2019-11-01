import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'smt1',
    loadChildren: './smt1/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei' }
  },
  {
    path: 'smt2',
    loadChildren: './smt2/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei II' }
  },
  {
    path: 'smtif',
    loadChildren: './smtif/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei If...' }
  },
  {
    path: 'smt9',
    loadChildren: './smt9/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei NINE' }
  },
  {
    path: 'smtim',
    loadChildren: './smtim/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei IMAGINE' }
  },
  {
    path: 'smt3',
    loadChildren: './smt3/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei III: Nocturne' }
  },
  {
    path: 'smtsj',
    loadChildren: './smtsj/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei: Strange Journey' }
  },
  {
    path: 'smtdsj',
    loadChildren: './smtsj/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei: Strange Journey Redux' }
  },
  {
    path: 'smt4',
    loadChildren: './smt4/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei IV' }
  },
  {
    path: 'smt4f',
    loadChildren: './smt4f/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei IV Apocalypse' }
  },
  {
    path: 'dsum',
    loadChildren: './dsum/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei: Devil Summoner' }
  },
  {
    path: 'dssh',
    loadChildren: './dssh/compendium.module#CompendiumModule',
    data: { appName: 'Devil Summoner: Soul Hackers' }
  },
  {
    path: 'krch',
    loadChildren: './krch/compendium.module#CompendiumModule',
    data: { appName: 'Raidou Kuzunoha vs. The Soulless Army' }
  },
  {
    path: 'krao',
    loadChildren: './krao/compendium.module#CompendiumModule',
    data: { appName: 'Raidou Kuzunoha vs. King Abaddon' }
  },
  {
    path: 'mib',
    loadChildren: './mib/compendium.module#CompendiumModule',
    data: { appName: 'Megami Ibunroku Persona' }
  },
  {
    path: 'p3',
    loadChildren: './p3/compendium.module#CompendiumModule',
    data: { appName: 'Persona 3' }
  },
  {
    path: 'p3fes',
    loadChildren: './p3/compendium.module#CompendiumModule',
    data: { appName: 'Persona 3 FES' }
  },
  {
    path: 'p3aeg',
    loadChildren: './p3/compendium.module#CompendiumModule',
    data: { appName: 'Persona 3 FES: The Answer' }
  },
  {
    path: 'p3p',
    loadChildren: './p3/compendium.module#CompendiumModule',
    data: { appName: 'Persona 3 Portable' }
  },
  {
    path: 'p4',
    loadChildren: './p4/compendium.module#CompendiumModule',
    data: { appName: 'Persona 4' }
  },
  {
    path: 'p4g',
    loadChildren: './p4/compendium.module#CompendiumModule',
    data: { appName: 'Persona 4 Golden' }
  },
  {
    path: 'pq',
    loadChildren: './pq/compendium.module#CompendiumModule',
    data: { appName: 'Persona Q: Shadow of the Labyrinth' }
  },
  {
    path: 'p5',
    loadChildren: './p5/compendium.module#CompendiumModule',
    data: { appName: 'Persona 5' }
  },
  {
    path: 'p5r',
    loadChildren: './p5/compendium.module#CompendiumModule',
    data: { appName: 'Persona 5 Royal' }
  },
  {
    path: 'pq2',
    loadChildren: './pq2/compendium.module#CompendiumModule',
    data: { appName: 'Persona Q2: New Cinema Labyrinth' }
  },
  {
    path: 'mjn1',
    loadChildren: './mjn1/compendium.module#CompendiumModule',
    data: { appName: 'Majin Tensei' }
  },
  {
    path: 'mjn2',
    loadChildren: './mjn2/compendium.module#CompendiumModule',
    data: { appName: 'Majin Tensei 2: Spiral Nemesis' }
  },
  {
    path: 'ds1',
    loadChildren: './desu1/compendium.module#CompendiumModule',
    data: { appName: 'Devil Survivor' }
  },
  {
    path: 'dso',
    loadChildren: './desu1/compendium.module#CompendiumModule',
    data: { appName: 'Devil Survivor Overclocked' }
  },
  {
    path: 'ds2',
    loadChildren: './desu2/compendium.module#CompendiumModule',
    data: { appName: 'Devil Survivor 2' }
  },
  {
    path: 'ds2br',
    loadChildren: './desu2/compendium.module#CompendiumModule',
    data: { appName: 'Devil Survivor 2 Record Breaker' }
  },
  {
    path: 'dx2',
    loadChildren: './dx2/compendium.module#CompendiumModule',
    data: { appName: 'Shin Megami Tensei: Dx2 Liberation' }
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
