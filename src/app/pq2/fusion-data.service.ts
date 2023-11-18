import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { 
  COMPENDIUM_CONFIG,
  P3_NORMAL_FISSION_CALCULATOR,
  P3_NORMAL_FUSION_CALCULATOR,
  P3_TRIPLE_FISSION_CALCULATOR,
  P3_TRIPLE_FUSION_CALCULATOR 
} from '../compendium/constants';
import { CompendiumConfig } from './models';

import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { fuseWithDiffRace } from '../compendium/fusions/smt-nonelem-fusions';
import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;

  compConfig: CompendiumConfig;
  appName: string;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: PersonaFusionChart;
  private _fusionChart$: BehaviorSubject<PersonaFusionChart>;
  fusionChart: Observable<PersonaFusionChart>;

  private _tripleChart: PersonaFusionChart;
  private _squareChart$: BehaviorSubject<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;
  squareChart: Observable<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this._compendium = new Compendium(this.compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new PersonaFusionChart(compConfig.normalTable, compConfig.races);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new PersonaFusionChart(compConfig.normalTable, compConfig.races, true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: this._fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: compConfig.raceOrder
    });
    this.squareChart = this._squareChart$.asObservable();

    if (compConfig.appCssClasses.includes('p5t')) {
      this.fissionCalculator = new NormalFusionCalculator([splitWithDiffRace], []);
      this.fusionCalculator = new NormalFusionCalculator([fuseWithDiffRace], []);
    }

    const settings = JSON.parse(localStorage.getItem(compConfig.settingsKey));

    if (settings && settings.version && settings.version >= compConfig.settingsVersion) {
      this.nextDlcDemons(settings.dlcDemons);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
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
