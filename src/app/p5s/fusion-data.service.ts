import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { FusionTrioService as IFusionTrioService, ElementTableData } from '../compendium/models';
import { splitWithSameRace, fuseWithSameRace, splitWithDiffRace, fuseWithDiffRace } from '../compendium/fusions/p5s-nonelem-fusions';
import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { CompendiumConfig } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = new NormalFusionCalculator([splitWithSameRace], [ ]);
  fusionCalculator = new NormalFusionCalculator([fuseWithSameRace], [ ]);
  triFissionCalculator = new TripleFusionCalculator([splitWithDiffRace], [ ]);
  triFusionCalculator = new TripleFusionCalculator([fuseWithDiffRace], [ ]);

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings: Observable<FusionSettings>;

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
    this.appName = compConfig.appTitle + ' Fusion Calculator';
    this.compConfig = compConfig;

    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();
    const elemTableData: ElementTableData = { elems: [], races: [], table: [] };

    this._fusionChart = new PersonaFusionChart(compConfig.normalTable, elemTableData);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new PersonaFusionChart(compConfig.normalTable, elemTableData, true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: this._fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: compConfig.raceOrder
    });
    this.squareChart = this._squareChart$.asObservable();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
