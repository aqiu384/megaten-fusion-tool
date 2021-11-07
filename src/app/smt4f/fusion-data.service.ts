import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { translateCompConfig } from './models/translator';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { COMPENDIUM_CONFIG, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { CompendiumConfig } from './models';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  compConfig: CompendiumConfig;
  appName: string;

  private smt5DataBaseUrl = 'https://raw.githubusercontent.com/aqiu384/smt5-data/main/docs/';
  private smt5DataFiles: { [name: string]: any } = {
    'demon-data.js': null,
    'skill-data.js': null,
    'fusion-chart.js': null,
    'element-chart.js': null,
    'special-recipes.js': null,
    'affinity-bonuses.js': null,
    'fusion-prereqs.js': null
  }

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) config: CompendiumConfig, httpClient: HttpClient, router: Router) {
    this.compConfig = !router.url.includes('/ja/') ? config : translateCompConfig(config);
    this.appName =  this.compConfig.appTitle + (this.compConfig.lang !== 'ja' ? ' Fusion Calculator' : ' 合体アプリ');

    this._compendium = new Compendium(this.compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(this.compConfig);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    const settings = JSON.parse(localStorage.getItem(this.compConfig.settingsKey));

    if (settings && settings.version && settings.version >= this.compConfig.settingsVersion) {
      this.nextDlcDemons(settings.dlcDemons);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));

    // if (this.compConfig.appCssClasses.includes('smt5')) {
    //   for (const dataKey of Object.keys(this.smt5DataFiles)) {
    //     httpClient.get(this.smt5DataBaseUrl + dataKey, { responseType: 'text' })
    //       .subscribe(data => this.updateSmt5CompConfig(dataKey, JSON.parse(data.substring(data.indexOf('=') + 1))));
    //   }
    // }
  }

  updateSmt5CompConfig(dataKey: string, data: string) {
    this.smt5DataFiles[dataKey] = data;

    if (!Object.values(this.smt5DataFiles).every(Boolean)) { return; }

    const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };
    const affinityLookup = this.smt5DataFiles['affinity-bonuses.js'];
    const demons = this.smt5DataFiles['demon-data.js'];

    for (const elem of this.compConfig.affinityElems) {
      const bonusElem = affinityLookup['elements'][elem];
      affinityBonuses.costs.push(affinityLookup['costs'][bonusElem]);
      affinityBonuses.upgrades.push(affinityLookup['upgrades'][bonusElem]);
    }

    for (const demon of Object.values(demons)) {
      demon['price'] = demon['lvl'] * demon['lvl'];
    }

    for (const skill of Object.values(this.smt5DataFiles['skill-data.js'])) {
      if (skill['rank']) { continue; }
      if (skill['cost']) { skill['rank'] = Math.ceil((skill['cost'] - 1000) / 5); }
      else { skill['rank'] = 1; }
    }

    for (const [name, prereq] of Object.entries(this.smt5DataFiles['fusion-prereqs.js'])) {
      demons[name].prereq = prereq;
    }

    this.compConfig.demonData = this.smt5DataFiles['demon-data.js'];
    this.compConfig.skillData = this.smt5DataFiles['skill-data.js'];
    this.compConfig.normalTable = this.smt5DataFiles['fusion-chart.js'];
    this.compConfig.elementTable = this.smt5DataFiles['element-chart.js'];
    this.compConfig.specialRecipes = this.smt5DataFiles['special-recipes.js'];
    this.compConfig.affinityBonuses = affinityBonuses;

    this.compConfig = this.compConfig.lang !== 'ja' ? this.compConfig : translateCompConfig(this.compConfig);

    this._compendium = new Compendium(this.compConfig);
    this._compendium$.next(this._compendium);

    this._fusionChart = new FusionChart(this.compConfig);
    this._fusionChart$.next(this._fusionChart);

    const settings = JSON.parse(localStorage.getItem(this.compConfig.settingsKey));

    if (settings && settings.version && settings.version >= this.compConfig.settingsVersion) {
      this.nextDlcDemons(settings.dlcDemons);
    }
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) {
    localStorage.setItem(this.compConfig.settingsKey, JSON.stringify({ version: this.compConfig.settingsVersion, dlcDemons }));
    this._compendium.dlcDemons = dlcDemons;
    this._compendium$.next(this._compendium);
  }

  onStorageUpdated(e) {
    switch (e.key) {
      case this.compConfig.settingsKey:
        this._compendium.dlcDemons = JSON.parse(e.newValue).dlcDemons;
        this._compendium$.next(this._compendium);
        break;
      default:
        break;
    }
  }
}
