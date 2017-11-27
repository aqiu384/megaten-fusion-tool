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
import * as VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import * as OVE_DEMON_DATA_JSON from './data/ove-demon-data.json';
import * as OVE_SKILL_DATA_JSON from './data/ove-skill-data.json';
import * as SPECIAL_RECIPES_JSON from './data/special-recipes.json';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  appName = 'Devil Survivor';

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

    if (game === 'dso') {
      this.appName = 'Devil Surivor Overclocked';
      demonDataJsons.push(OVE_DEMON_DATA_JSON);
      skillDataJsons.push(OVE_SKILL_DATA_JSON);
    }

    this._compendium = new Compendium(demonDataJsons, skillDataJsons, [SPECIAL_RECIPES_JSON], {});
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
