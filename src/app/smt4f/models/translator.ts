import { CompendiumConfig } from '../models';
import { translateDemonData, translateSkillData, translateSpecialRecipes, translateFusionChart, translateDemonUnlocks } from '../../compendium/models/translator';

export function translateCompConfig(compConfig: CompendiumConfig, lang: string): CompendiumConfig {
  const langInd = compConfig.translations.en.indexOf(lang);
  if (langInd === -1) { return compConfig; }
  const langNames = Object.entries(compConfig.translations).reduce((acc, [en, langs]) => { acc[en] = langs[langInd]; return acc; }, {});
  const translate = (x: string) => langNames[x] || x;
  const races = compConfig.races.map(translate);

  return {
    appTitle: translate(compConfig.appTitle),
    translations: compConfig.translations,
    lang,
    races,
    raceOrder: races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: compConfig.appCssClasses,

    affinityElems: compConfig.affinityElems,
    skillData: compConfig.skillData.map(d => translateSkillData(d, langNames)),
    skillElems: compConfig.skillElems,
    elemOrder: compConfig.elemOrder,
    resistCodes: compConfig.resistCodes,
    affinityBonuses: compConfig.affinityBonuses,
    lvlModifier: compConfig.lvlModifier,
    maxSkillSlots: compConfig.maxSkillSlots,
    hasLightDark: compConfig.hasLightDark,

    demonData: compConfig.demonData.map(d => translateDemonData(d, langNames)),
    fusionSpells: translateSpecialRecipes(compConfig.fusionSpells, langNames),
    evolveData: translateEvolutions(compConfig.evolveData, langNames),
    alignments: compConfig.alignments,
    baseStats: compConfig.baseStats.map(translate),
    resistElems: compConfig.resistElems,
    ailmentElems: compConfig.ailmentElems,

    demonUnlocks: translateDemonUnlocks(compConfig.demonUnlocks, langNames),
    normalTable: translateFusionChart(compConfig.normalTable, langNames),
    elementTable: translateFusionChart(compConfig.elementTable, langNames),
    specialRecipes: translateSpecialRecipes(compConfig.specialRecipes, langNames),

    defaultRecipeDemon: translate(compConfig.defaultRecipeDemon),
    elementRace: translate(compConfig.elementRace),
    settingsKey: `${compConfig.settingsKey}-${lang}`,
    settingsVersion: compConfig.settingsVersion
  };
}

function translateEvolutions(oldEvolves: any, langNames: { [name: string]: string }): any {
  const newEvolves = {};

  for (const [dname, recipe] of Object.entries(oldEvolves)) {
    newEvolves[langNames[dname] || dname] = {
      lvl: recipe['lvl'],
      result: langNames[recipe['result']] || recipe['result']
    };
  }

  return newEvolves;
}
