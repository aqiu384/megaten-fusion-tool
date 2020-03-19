import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { SpeciesFusionChart } from './models/species-fusion-chart';
import { CompendiumConfig } from './models';

import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import {
  COMPENDIUM_CONFIG,
  SMT_NORMAL_FUSION_CALCULATOR,
  SMT_NES_NORMAL_FUSION_CALCULATOR,
  SMT_NORMAL_FISSION_CALCULATOR
} from '../compendium/constants';

import { splitWithDiffRace, splitWithElement } from '../compendium/fusions/smt-nonelem-fissions';
import { splitElement } from '../compendium/fusions/smt-element-fissions';
import {
  splitNormal as splitEntityNormal,
  splitTriple as splitEntityTriple
} from '../compendium/fusions/dssh-entity-fissions';

import { splitWithDiffRace as splitTripleDR, splitWithElementPair } from '../compendium/fusions/per-triple-fissions';
import { splitWithDiffRace as splitElementDR, splitWithSameRace } from '../compendium/fusions/tri-element-fissions';
import { fuseInElementPair } from '../compendium/fusions/tri-element-fusions';
import {
  fuseT1WithDiffRace,
  fuseN1WithDiffRace,
  fuseWithSameRace,
  fuseWithElementPair
} from '../compendium/fusions/per-triple-fusions';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  triFusionCalculator = new TripleFusionCalculator([fuseN1WithDiffRace, fuseT1WithDiffRace], []);
  triFissionCalculator = new TripleFusionCalculator([splitTripleDR], []);

  compConfig: CompendiumConfig;
  appName: string;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>
  squareChart: Observable<SquareChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this.compendium = new BehaviorSubject(new Compendium(compConfig)).asObservable();

    const normalChart = new FusionChart(compConfig);
    let doubleChart, tripleChart;

    if (compConfig.useSpeciesFusion) {
      doubleChart = new SpeciesFusionChart(compConfig);
      tripleChart = doubleChart;
    } else {
      doubleChart = normalChart;
      tripleChart = new FusionChart(compConfig, true);
    }

    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
    this.squareChart = new BehaviorSubject({ 
      normalChart: doubleChart,
      tripleChart,
      raceOrder: compConfig.raceOrder
    }).asObservable();

    if (compConfig.darknessRecipes) {
      this.fusionCalculator = SMT_NES_NORMAL_FUSION_CALCULATOR;
    }

    if (compConfig.tripleElementTable) {
      this.triFissionCalculator = new TripleFusionCalculator([splitTripleDR, splitWithElementPair], []);
    }

    if (compConfig.appTitle.indexOf('Soul Hackers') !== -1) {
      this.fissionCalculator = new NormalFusionCalculator(
        [ splitWithDiffRace, splitWithElement, splitEntityNormal ],
        [ splitElement ]
      );
      this.triFusionCalculator = new TripleFusionCalculator(
        [ fuseN1WithDiffRace, fuseT1WithDiffRace, fuseWithSameRace, fuseWithElementPair ],
        [ fuseInElementPair ]
      );
      this.triFissionCalculator = new TripleFusionCalculator(
        [ splitTripleDR, splitWithElementPair, splitEntityTriple ],
        [ splitElementDR, splitWithSameRace ]
      );
    }
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
