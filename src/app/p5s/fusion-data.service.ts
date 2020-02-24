import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { COMPENDIUM_CONFIG } from '../compendium/constants';

import { CompendiumConfig } from './models';
import { Compendium } from './models/compendium';

import { splitNormal, fuseNormal } from '../compendium/fusions/p5s-nonelem-fusions';
import { splitWithSameRace } from '../compendium/fusions/per-nonelem-fissions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = new NormalFusionCalculator(
    [ splitWithSameRace, splitNormal ],
    [ ]
  );

  fusionCalculator = new NormalFusionCalculator(
    [ fuseWithSameRace, fuseNormal ],
    [ ]
  );

  compConfig: CompendiumConfig;
  appName: string;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: PersonaFusionChart;
  private _fusionChart$: BehaviorSubject<PersonaFusionChart>;
  fusionChart: Observable<PersonaFusionChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.appName = compConfig.appTitle;
    this.compConfig = compConfig;

    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new PersonaFusionChart(compConfig.normalTable, compConfig.races);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
