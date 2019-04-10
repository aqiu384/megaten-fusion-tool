import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { DesuCompendium as Compendium } from '../desu/models/compendium';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import REC_DEMON_DATA_JSON from './data/rec-demon-data.json';
import REC_SPECIAL_RECIPES_JSON from './data/rec-special-recipes.json';
import REC_SKILL_DATA_JSON from './data/rec-skill-data.json';

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
    const demonDataJsons: any[] = [VAN_DEMON_DATA_JSON];
    const skillDataJsons: any[] = [VAN_SKILL_DATA_JSON];
    const specRecipesJsons: any[] = [VAN_SPECIAL_RECIPES_JSON];

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
