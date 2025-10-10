import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { CompendiumConfig } from './models';

import {
  FusionDataService as IFusionDataService,
  NamePair,
  Compendium as ICompendium,
  FusionChart as IFusionChart
} from '../compendium/models';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import {
  COMPENDIUM_CONFIG,
  SMT_NORMAL_FUSION_CALCULATOR
} from '../compendium/constants';

import { FusionSettings } from '../compendium/models/fusion-settings';

function kmtSplitWithDiffRace(name: string, compendium: ICompendium, fusionChart: IFusionChart): NamePair[] {
  const recipes: NamePair[] = [];

  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  if (targetLvlIndex === -1) {
    return [ ];
  }

  for (const [raceA, raceBs] of Object.entries(fusionChart.getRaceFissions(name))) {
    for (const lvlA of compendium.getIngredientDemonLvls(raceA)) {
      for (const raceB of raceBs) {
        for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceA, lvlA),
            name2: compendium.reverseLookupDemon(raceB, lvlB)
          });
        }
      }
    }
  }

  return recipes;
}

@Injectable()
export class FusionDataService implements IFusionDataService {
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  fissionCalculator = new NormalFusionCalculator(
      [ kmtSplitWithDiffRace ],
      []
    );
  lang = 'en';

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings: Observable<FusionSettings>;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this.compendium = new BehaviorSubject(new Compendium(compConfig)).asObservable();
    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { return {}; }
}
