import { NgModule } from '@angular/core';
import { Route, Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import Translations from './compendium/data/translations.json';
import FusionTools from './compendium/data/fusion-tools.json';

const LANGS = Translations.Languages.Languages;
const appRoutesLookup: { [path: string]: Route } = {};
const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'smt1',   loadChildren: () => import('./smt1/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt2',   loadChildren: () => import('./smt2/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smtif',  loadChildren: () => import('./smtif/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt9',   loadChildren: () => import('./smt9/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smtim',  loadChildren: () => import('./smtim/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt3',   loadChildren: () => import('./smt3/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smtsj',  loadChildren: () => import('./smtsj/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smtdsj', loadChildren: () => import('./smtsj/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt4',   loadChildren: () => import('./smt4/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt4f',  loadChildren: () => import('./smt4f/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt5',   loadChildren: () => import('./smt5/compendium.module').then(m => m.CompendiumModule) },
  { path: 'smt5v',  loadChildren: () => import('./smt5/compendium.module').then(m => m.CompendiumModule) },
  { path: 'dsum',   loadChildren: () => import('./dsum/compendium.module').then(m => m.CompendiumModule) },
  { path: 'dssh',   loadChildren: () => import('./dssh/compendium.module').then(m => m.CompendiumModule) },
  { path: 'krch',   loadChildren: () => import('./krch/compendium.module').then(m => m.CompendiumModule) },
  { path: 'rrch',   loadChildren: () => import('./rrch/compendium.module').then(m => m.CompendiumModule) },
  { path: 'krao',   loadChildren: () => import('./krao/compendium.module').then(m => m.CompendiumModule) },
  { path: 'sh2',    loadChildren: () => import('./sh2/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p1',     loadChildren: () => import('./p1/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p2t',    loadChildren: () => import('./p2t/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p2b',    loadChildren: () => import('./p2b/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3',     loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3f',    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3a',    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3p',    loadChildren: () => import('./p3/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3r',    loadChildren: () => import('./p3r/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p3e',    loadChildren: () => import('./p3r/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p4',     loadChildren: () => import('./p4/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p4g',    loadChildren: () => import('./p4/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p5',     loadChildren: () => import('./p5/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p5r',    loadChildren: () => import('./p5/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p5s',    loadChildren: () => import('./p5s/compendium.module').then(m => m.CompendiumModule) },
  { path: 'p5t',    loadChildren: () => import('./p5t/compendium.module').then(m => m.CompendiumModule) },
  { path: 'pq',     loadChildren: () => import('./pq/compendium.module').then(m => m.CompendiumModule) },
  { path: 'pq2',    loadChildren: () => import('./pq2/compendium.module').then(m => m.CompendiumModule) },
  { path: 'mjn1',   loadChildren: () => import('./mjn1/compendium.module').then(m => m.CompendiumModule) },
  { path: 'mjn2',   loadChildren: () => import('./mjn2/compendium.module').then(m => m.CompendiumModule) },
  { path: 'ds1',    loadChildren: () => import('./desu1/compendium.module').then(m => m.CompendiumModule) },
  { path: 'dso',    loadChildren: () => import('./desu1/compendium.module').then(m => m.CompendiumModule) },
  { path: 'ds2',    loadChildren: () => import('./desu2/compendium.module').then(m => m.CompendiumModule) },
  { path: 'ds2br',  loadChildren: () => import('./desu2/compendium.module').then(m => m.CompendiumModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

for (const route of appRoutes) {
  if (route.loadChildren) {
    appRoutesLookup[route.path] = route;
  }
}

for (const [tool, appNames] of Object.entries(FusionTools)) {
  appRoutesLookup[tool].data = { appName: appNames[0], lang: LANGS[0] };
}

for (let i = 1; i < LANGS.length; i++) {
  const lang = LANGS[i];
  const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
  ];

  for (const [tool, appNames] of Object.entries(FusionTools)) {
    if (appNames[i] && appNames[i] !== '-') {
      routes.push({
        path: tool,
        loadChildren: appRoutesLookup[tool].loadChildren,
        data: { appName: appNames[i], lang }
      });
    }
  }

  routes.push({ path: '**', redirectTo: 'home', pathMatch: 'full' });
  appRoutes.splice(2, 0, {
    path: lang,
    data: { lang },
    children: routes
  });
}

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
