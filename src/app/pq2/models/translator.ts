import { CompendiumConfig } from '../models';
import { translateDemonData, translateSkillData, translateSpecialRecipes, translateFusionChart, translateDemonUnlocks } from '../../compendium/models/translator';

export function translateCompConfig(compConfig: CompendiumConfig, lang: string): CompendiumConfig {
  const langInd = compConfig.translations.en.indexOf(lang);
  if (langInd === -1) { return compConfig; }
  const langNames = Object.entries(compConfig.translations).reduce((acc, [en, langs]) => { acc[en] = langs[langInd]; return acc; }, {});
  const translate = (x: string) => langNames[x] || x;
  const races = compConfig.races.map(translate);
  const skillElems = compConfig.skillElems.map(translate)

  return {
    appTitle: translate(compConfig.appTitle),
    translations: compConfig.translations,
    lang,
    races,
    raceOrder: compConfig.raceOrder,
    appCssClasses: compConfig.appCssClasses,

    skillData: translateSkillData(compConfig.skillData, langNames),
    skillElems,
    ailmentElems: compConfig.ailmentElems,
    elemOrder: compConfig.elemOrder,
    resistCodes: compConfig.resistCodes,

    demonData: translateDemonData(compConfig.demonData, langNames),
    baseStats: compConfig.baseStats.map(translate),
    resistElems: compConfig.resistElems,
    inheritTypes: compConfig.inheritTypes,
    inheritElems: compConfig.inheritElems,

    demonUnlocks: translateDemonUnlocks(compConfig.demonUnlocks, langNames),
    enemyData: translateDemonData(compConfig.enemyData, langNames),
    enemyStats: compConfig.enemyStats.map(translate),

    normalTable: translateFusionChart(compConfig.normalTable, langNames),
    hasTripleFusion: compConfig.hasTripleFusion,
    hasDemonResists: compConfig.hasDemonResists,
    hasSkillRanks: compConfig.hasSkillRanks,
    hasEnemies: compConfig.hasEnemies,
    hasQrcodes: compConfig.hasQrcodes,
    specialRecipes: translateSpecialRecipes(compConfig.specialRecipes, langNames),

    defaultDemon: translate(compConfig.defaultDemon),
    settingsKey: `${compConfig.settingsKey}-${lang}`,
    settingsVersion: compConfig.settingsVersion
  };
}
