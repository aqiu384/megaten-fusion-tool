import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { COMPENDIUM_CONFIG, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';
import { CompendiumConfig, CompendiumConfigSet } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { CompendiumTranslator } from '../compendium/models/compendium-translator';
import { translateComp } from '../compendium/models/translator';
import Translations from  '../compendium/data/translations.json';

@Injectable()
export class FusionDataService extends ConfigurableFusionDataService<Compendium, FusionChart> {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  compConfig: CompendiumConfig;
  appName: string;
  lang: string;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfigSet: CompendiumConfigSet, translator: CompendiumTranslator, router: Router) {
    const parts = router.url.split('/');
    const defaultGame = Object.keys(compConfigSet.configs)[0];
    const compConfig =
      compConfigSet.configs[parts[2] || parts[1]] ||
      compConfigSet.configs[parts[1]] ||
      compConfigSet.configs[defaultGame];
    const lang = translator.supportedLanguages.includes(parts[1]) ? parts[1] : 'en';
    const dummyRecipe = { '-': [compConfig.defaultRecipeDemon] };
    const races = translator.translateRaces(compConfig.races, lang);

    const newCompConfig: CompendiumConfig = {
      appTitle: translator.translateAppTitle(compConfig.appTitle, lang),
      lang,
      races,
      raceOrder: races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      appCssClasses: compConfig.appCssClasses,

      affinityElems: compConfig.affinityElems,
      skillData: compConfig.skillData.map(d => translator.translateSkillData(d, lang)),
      skillElems: compConfig.skillElems,
      elemOrder: compConfig.elemOrder,
      resistCodes: compConfig.resistCodes,
      affinityBonuses: compConfig.affinityBonuses,
      lvlModifier: compConfig.lvlModifier,
      maxSkillSlots: compConfig.maxSkillSlots,
      hasLightDark: compConfig.hasLightDark,
      hasSkillRanks: compConfig.hasSkillRanks,
      hasNonelemInheritance: compConfig.hasNonelemInheritance,

      demonData: compConfig.demonData.map(d => translator.translateDemonData(d, lang)),
      fusionSpells: translator.translateFusionSpells(compConfig.fusionSpells, lang),
      evolveData: translator.translateEvolutions(compConfig.evolveData, lang),
      alignments: compConfig.alignments,
      baseStats: translator.translateElems(compConfig.baseStats, lang),
      resistElems: compConfig.resistElems,
      ailmentElems: translator.translateElems(compConfig.ailmentElems, lang),

      demonUnlocks: translator.translateDemonUnlocks(compConfig.demonUnlocks, lang),
      normalTable: translator.translateFusionChart(compConfig.normalTable, lang),
      elementTable: translator.translateFusionChart(compConfig.elementTable, lang),
      specialRecipes: translator.translateSpecialRecipes(compConfig.specialRecipes, lang),

      defaultRecipeDemon: translator.translateSpecialRecipes(dummyRecipe, lang)['-'][0],
      elementRace: translator.translateRaces([compConfig.elementRace], lang)[0],
      settingsKey: translator.translateSettingsKey(compConfig.settingsKey, lang),
      settingsVersion: compConfig.settingsVersion
    };

    const fusionSettings = new FusionSettings(newCompConfig.demonUnlocks, []);

    super(
      new Compendium(newCompConfig, fusionSettings.demonToggles),
      new FusionChart(newCompConfig),
      fusionSettings,
      newCompConfig.settingsKey,
      newCompConfig.settingsVersion
    );
    
    this.lang = lang;
    this.compConfig = newCompConfig;
    this.appName =  newCompConfig.appTitle + translateComp(Translations.CompendiumComponent.FusionCalculator, newCompConfig.lang);
  }
}
