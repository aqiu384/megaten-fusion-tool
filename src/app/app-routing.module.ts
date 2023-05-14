import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'ja',
    data: { lang: 'ja' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'smt4',
        loadChildren: () => import('./smt4/compendium.module').then(m => m.CompendiumModule),
        data: { appName: '真・女神転生IV' }
      },
      {
        path: 'smt4f',
        loadChildren: () => import('./smt4f/compendium.module').then(m => m.CompendiumModule),
        data: { appName: '真・女神転生IV FINAL' }
      },
      {
        path: 'smt5',
        loadChildren: () => import('./smt5/compendium.module').then(m => m.CompendiumModule),
        data: { appName: '真・女神転生V' }
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'smt1',
    loadChildren: () => import('./smt1/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei' }
  },
  {
    path: 'smt2',
    loadChildren: () => import('./smt2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei II' }
  },
  {
    path: 'smtif',
    loadChildren: () => import('./smtif/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei If...' }
  },
  {
    path: 'smt9',
    loadChildren: () => import('./smt9/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei NINE' }
  },
  {
    path: 'smtim',
    loadChildren: () => import('./smtim/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei IMAGINE' }
  },
  {
    path: 'smt3',
    loadChildren: () => import('./smt3/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei III: Nocturne' }
  },
  {
    path: 'smtsj',
    loadChildren: () => import('./smtsj/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei: Strange Journey' }
  },
  {
    path: 'smtdsj',
    loadChildren: () => import('./smtsj/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei: Strange Journey Redux' }
  },
  {
    path: 'smt4',
    loadChildren: () => import('./smt4/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei IV' }
  },
  {
    path: 'smt4f',
    loadChildren: () => import('./smt4f/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei IV Apocalypse' }
  },
  {
    path: 'smt5',
    loadChildren: () => import('./smt5/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei V' }
  },
  {
    path: 'dsum',
    loadChildren: () => import('./dsum/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei: Devil Summoner' }
  },
  {
    path: 'dssh',
    loadChildren: () => import('./dssh/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Devil Summoner: Soul Hackers' }
  },
  {
    path: 'krch',
    loadChildren: () => import('./krch/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Raidou Kuzunoha vs. The Soulless Army' }
  },
  {
    path: 'krao',
    loadChildren: () => import('./krao/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Raidou Kuzunoha vs. King Abaddon' }
  },
  {
    path: 'sh2',
    loadChildren: () => import('./sh2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Soul Hackers 2' }
  },
  {
    path: 'p1',
    loadChildren: () => import('./p1/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Megami Ibunroku Persona' }
  },
  {
    path: 'p3',
    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 3' }
  },
  {
    path: 'p3fes',
    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 3 FES' }
  },
  {
    path: 'p3aeg',
    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 3 FES: The Answer' }
  },
  {
    path: 'p3p',
    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 3 Portable' }
  },
  {
    path: 'p4',
    loadChildren: () => import('./p4/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 4' }
  },
  {
    path: 'p4g',
    loadChildren: () => import('./p4/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 4 Golden' }
  },
  {
    path: 'pq',
    loadChildren: () => import('./pq/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona Q: Shadow of the Labyrinth' }
  },
  {
    path: 'p5',
    loadChildren: () => import('./p5/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 5' }
  },
  {
    path: 'p5r',
    loadChildren: () => import('./p5r/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 5 Royal' }
  },
  {
    path: 'p5s',
    loadChildren: () => import('./p5s/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona 5 Strikers' }
  },
  {
    path: 'pq2',
    loadChildren: () => import('./pq2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Persona Q2: New Cinema Labyrinth' }
  },
  {
    path: 'mjn1',
    loadChildren: () => import('./mjn1/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Majin Tensei' }
  },
  {
    path: 'mjn2',
    loadChildren: () => import('./mjn2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Majin Tensei II: Spiral Nemesis' }
  },
  {
    path: 'ds1',
    loadChildren: () => import('./desu1/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Devil Survivor' }
  },
  {
    path: 'dso',
    loadChildren: () => import('./desu1/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Devil Survivor Overclocked' }
  },
  {
    path: 'ds2',
    loadChildren: () => import('./desu2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Devil Survivor 2' }
  },
  {
    path: 'ds2br',
    loadChildren: () => import('./desu2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Devil Survivor 2 Record Breaker' }
  },
  {
    path: 'dx2',
    loadChildren: () => import('./dx2/compendium.module').then(m => m.CompendiumModule),
    data: { appName: 'Shin Megami Tensei: Dx2 Liberation' }
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
