import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { DesuCompendium as Compendium } from '../desu/models/compendium';

import * as VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import * as VAN_SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import * as VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import * as REC_DEMON_DATA_JSON from './data/rec-demon-data.json';
import * as REC_SPECIAL_RECIPES_JSON from './data/rec-special-recipes.json';
import * as REC_SKILL_DATA_JSON from './data/rec-skill-data.json';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  appName = 'Devil Survivor 2';

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart = new FusionChart();
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  constructor(private router: Router) {
    const game = router.url.split('/')[1];
    const demonDataJsons = [VAN_DEMON_DATA_JSON];
    const skillDataJsons = [VAN_SKILL_DATA_JSON];
    const specRecipesJsons = [VAN_SPECIAL_RECIPES_JSON];

    if (game === 'ds2br') {
      this.appName = 'Devil Survivor 2 Record Breaker';
      demonDataJsons.push(REC_DEMON_DATA_JSON);
      skillDataJsons.push(REC_SKILL_DATA_JSON);
      specRecipesJsons.push(REC_SPECIAL_RECIPES_JSON);
    }

    this._compendium = new Compendium(demonDataJsons, skillDataJsons, specRecipesJsons, {});
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
