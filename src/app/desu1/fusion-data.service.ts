import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { DesuCompendium as Compendium } from '../desu/models/compendium';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import OVE_DEMON_DATA_JSON from './data/ove-demon-data.json';
import OVE_SKILL_DATA_JSON from './data/ove-skill-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  appName = 'Devil Survivor Fusion Calculator';

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

    if (game === 'dso') {
      this.appName = 'Devil Surivor Overclocked Fusion Calculator';
      demonDataJsons.push(OVE_DEMON_DATA_JSON);
      skillDataJsons.push(OVE_SKILL_DATA_JSON);
    }

    this._compendium = new Compendium(demonDataJsons, skillDataJsons, [SPECIAL_RECIPES_JSON], {});
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
