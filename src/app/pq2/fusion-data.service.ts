import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Compendium } from './models/compendium';
import { PersonaFusionChart } from './models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { 
  COMPENDIUM_CONFIG,
  P3_NORMAL_FISSION_CALCULATOR,
  P3_NORMAL_FUSION_CALCULATOR,
  P3_TRIPLE_FISSION_CALCULATOR,
  P3_TRIPLE_FUSION_CALCULATOR 
} from '../compendium/constants';
import { CompendiumConfig, CompendiumConfigSet } from './models';

import { fuseWithDiffRace, fuseWithElement } from '../compendium/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult } from '../compendium/fusions/smt-element-fusions';
import { fuseTwoElements } from '../compendium/fusions/per-element-fusions';
import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';
import { splitWithSameRace } from '../compendium/fusions/per-nonelem-fissions';

import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { CompendiumTranslator } from '../compendium/models/compendium-translator';
import { translateComp } from '../compendium/models/translator';
import Translations from  '../compendium/data/translations.json';

@Injectable()
export class FusionDataService extends ConfigurableFusionDataService<Compendium, PersonaFusionChart> implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;

  compConfig: CompendiumConfig;
  appName: string;

  private _tripleChart: PersonaFusionChart;
  private _squareChart$: BehaviorSubject<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;
  squareChart: Observable<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfigSet: CompendiumConfigSet, translator: CompendiumTranslator, router: Router) {
    const parts = router.url.split('/');
    const defaultGame = Object.keys(compConfigSet.configs)[0];
    const compConfig =
      compConfigSet.configs[parts[2] || parts[1]] ||
      compConfigSet.configs[parts[1]] ||
      compConfigSet.configs[defaultGame];
    const lang = translator.supportedLanguages.includes(parts[1]) ? parts[1] : 'en';
    const dummyRecipe = { '-': [compConfig.defaultDemon] };
    const races = translator.translateRaces(compConfig.races, lang);

    const newCompConfig: CompendiumConfig = {
      appTitle: translator.translateAppTitle(compConfig.appTitle, lang),
      lang,
      races,
      raceOrder: races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      appCssClasses: compConfig.appCssClasses,

      skillData: compConfig.skillData.map(d => translator.translateSkillData(d, lang)),
      skillElems: compConfig.skillElems,
      ailmentElems: translator.translateElems(compConfig.ailmentElems, lang),
      elemOrder: compConfig.elemOrder,
      resistCodes: compConfig.resistCodes,

      demonData: compConfig.demonData.map(d => translator.translateDemonData(d, lang)),
      baseStats: translator.translateElems(compConfig.baseStats, lang),
      resistElems: compConfig.resistElems,
      inheritTypes: compConfig.inheritTypes,
      inheritElems: compConfig.inheritElems,

      demonUnlocks: translator.translateDemonUnlocks(compConfig.demonUnlocks, lang),
      enemyData: compConfig.enemyData.map(d => translator.translateEnemyData(d, lang)),
      enemyStats: compConfig.enemyStats,

      normalTable: translator.translateFusionChart(compConfig.normalTable, lang),
      elementTable: translator.translateFusionChart(compConfig.elementTable, lang),
      specialRecipes: translator.translateSpecialRecipes(compConfig.specialRecipes, lang),
      maxSkillSlots: compConfig.maxSkillSlots,
      hasTripleFusion: compConfig.hasTripleFusion,
      hasDemonResists: compConfig.hasDemonResists,
      hasSkillRanks: compConfig.hasSkillRanks,
      hasEnemies: compConfig.hasEnemies,
      hasQrcodes: compConfig.hasQrcodes,
      hasSkillCards: compConfig.hasSkillCards,
      hasManualInheritance: compConfig.hasManualInheritance,

      defaultDemon: translator.translateSpecialRecipes(dummyRecipe, lang)['-'][0],
      settingsKey: translator.translateSettingsKey(compConfig.settingsKey, lang),
      settingsVersion: compConfig.settingsVersion
    };

    const fusionChart = new PersonaFusionChart(newCompConfig, false);
    const fusionSettings = new FusionSettings(newCompConfig.demonUnlocks, []);

    super(
      new Compendium(newCompConfig, fusionSettings.demonToggles),
      fusionChart,
      fusionSettings,
      newCompConfig.settingsKey,
      newCompConfig.settingsVersion
    );

    this.compConfig = newCompConfig;
    this.appName =  newCompConfig.appTitle + translateComp(Translations.CompendiumComponent.FusionCalculator, newCompConfig.lang);

    this._tripleChart = new PersonaFusionChart(newCompConfig, true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: newCompConfig.raceOrder
    });
    this.squareChart = this._squareChart$.asObservable();

    if (newCompConfig.appCssClasses.includes('p5t')) {
      this.fissionCalculator = new NormalFusionCalculator([splitWithDiffRace], []);
      this.fusionCalculator = new NormalFusionCalculator([fuseWithDiffRace], []);
    }

    if (newCompConfig.appCssClasses.includes('p5')) {
      this.fissionCalculator = new NormalFusionCalculator([splitWithDiffRace, splitWithSameRace], []);
      this.fusionCalculator = new NormalFusionCalculator(
        [fuseWithDiffRace, fuseWithSameRace, fuseWithElement],
        [fuseWithNormResult, fuseWithSpecResult, fuseTwoElements]
      );
    }
  }
}
