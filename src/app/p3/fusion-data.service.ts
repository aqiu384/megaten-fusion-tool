import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { Races, RaceOrder, P3_NORMAL_FISSION_CALCULATOR, P3_NORMAL_FUSION_CALCULATOR } from './constants';
import { P3_TRIPLE_FISSION_CALCULATOR, P3_TRIPLE_FUSION_CALCULATOR } from '../compendium/constants';

import * as VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import * as FES_DEMON_DATA_JSON from './data/fes-demon-data.json';
import * as ANS_DEMON_DATA_JSON from './data/ans-demon-data.json';
import * as P3P_DEMON_DATA_JSON from './data/p3p-demon-data.json';
import * as ORPHEUS_TELOS_JSON from './data/orpheus-telos.json';

import * as VAN_ENEMY_DATA_JSON from './data/van-enemy-data.json';
import * as ANS_ENEMY_DATA_JSON from './data/ans-enemy-data.json';

import * as VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import * as FES_SKILL_DATA_JSON from './data/fes-skill-data.json';
import * as P3P_SKILL_DATA_JSON from './data/p3p-skill-data.json';

import * as PAIR_SPECIAL_RECIPES from './data/pair-special-recipes.json';
import * as VAN_SPECIAL_RECIPES from './data/van-special-recipes.json';
import * as FES_SPECIAL_RECIPES from './data/fes-special-recipes.json';

import * as VAN_FUSION_CHART_JSON from './data/van-fusion-chart.json';
import * as FES_FUSION_CHART_JSON from './data/fes-fusion-chart.json';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;
  appName = 'Persona 3';
  skillsHaveFuse = false;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: PersonaFusionChart;
  private _fusionChart$: BehaviorSubject<PersonaFusionChart>;
  fusionChart: Observable<PersonaFusionChart>;

  private _tripleChart: PersonaFusionChart;
  private _squareChart$: BehaviorSubject<SquareChart>;
  squareChart: Observable<SquareChart>;

  constructor(private router: Router) {
    const game = router.url.split('/')[1];
    const demonDataJsons = [VAN_DEMON_DATA_JSON];
    const enemyDataJsons = game !== 'p3aeg' ? [VAN_ENEMY_DATA_JSON] : [ANS_ENEMY_DATA_JSON];
    const skillDataJsons = [VAN_SKILL_DATA_JSON];
    let specialRecipes = [PAIR_SPECIAL_RECIPES, VAN_SPECIAL_RECIPES];
    let fusionChart = VAN_FUSION_CHART_JSON;

    if (game !== 'p3') {
      this.appName = 'Persona 3 FES';
      demonDataJsons.push(FES_DEMON_DATA_JSON);
      demonDataJsons.push(ORPHEUS_TELOS_JSON);
      skillDataJsons.push(FES_SKILL_DATA_JSON);
      specialRecipes.push(FES_SPECIAL_RECIPES);
      fusionChart = FES_FUSION_CHART_JSON;

      if (game === 'p3aeg') {
        this.appName = 'Persona 3 FES: The Answer';
        demonDataJsons.pop();
        demonDataJsons.push(ANS_DEMON_DATA_JSON);
        specialRecipes = [PAIR_SPECIAL_RECIPES];
      } else if (game === 'p3p') {
        this.appName = 'Persona 3 Portable';
        this.skillsHaveFuse = true;
        demonDataJsons.push(P3P_DEMON_DATA_JSON);
        skillDataJsons.push(P3P_SKILL_DATA_JSON);
      }
    }

    this._compendium = new Compendium(demonDataJsons, enemyDataJsons, skillDataJsons, specialRecipes);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new PersonaFusionChart(fusionChart, []);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new PersonaFusionChart(fusionChart, [], true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: this._fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: RaceOrder
    });

    this.squareChart = this._squareChart$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
