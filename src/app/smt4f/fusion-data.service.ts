import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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

  private _smt5DemonData: any;
  private _smt5SkillData: any;
  private _smt5AffinityData: any;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig, private httpClient: HttpClient) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(compConfig);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    const settings = JSON.parse(localStorage.getItem(compConfig.settingsKey));

    if (settings && settings.version && settings.version >= compConfig.settingsVersion) {
      this.nextDlcDemons(settings.dlcDemons);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));

    if (compConfig.appTitle === 'Shin Megami Tensei V') {
      this.fetchSmt5Data(httpClient);
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

  fetchSmt5Data(httpClient: HttpClient) {
    const parseSmt5Data = this.parseSmt5Data.bind(this);
    const baseDataUrl = 'https://raw.githubusercontent.com/aqiu384/smt5-data/main/';

    httpClient.get(baseDataUrl + 'demon-data.json').subscribe(parseSmt5Data);
    httpClient.get(baseDataUrl + 'skill-data.json').subscribe(parseSmt5Data);
    httpClient.get(baseDataUrl + 'affinity-bonuses.json').subscribe(parseSmt5Data);
  }

  parseSmt5Data(data: any) {
    if (data['Jack Frost']) { this._smt5DemonData = data; }
    if (data['Jack Bufula']) { this._smt5SkillData = data; }
    if (data['upgrades']) { this._smt5AffinityData = data; }

    if (this._smt5DemonData && this._smt5SkillData && this._smt5AffinityData) {
      this.loadSmt5Data();
    }
  }

  loadSmt5Data() {
    const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };

    for (const elem of this.compConfig.affinityElems) {
      const bonusElem = this._smt5AffinityData.elements[elem];
      affinityBonuses.costs.push(this._smt5AffinityData.costs[bonusElem]);
      affinityBonuses.upgrades.push(this._smt5AffinityData.upgrades[bonusElem]);
    }

    for (const demon of Object.values(this._smt5DemonData)) {
      demon['price'] = demon['lvl'] * demon['lvl'];
    }

    for (const skill of Object.values(this._smt5SkillData)) {
      if (skill['rank']) { continue; }
      if (skill['cost']) { skill['rank'] = Math.ceil((skill['cost'] - 1000) / 10); }
      else { skill['rank'] = 1; }
    }

    this.compConfig.demonData = this._smt5DemonData;
    this.compConfig.skillData = this._smt5SkillData;
    this.compConfig.affinityBonuses = affinityBonuses;

    this._compendium = new Compendium(this.compConfig);
    this._compendium$.next(this._compendium);
  }
}
