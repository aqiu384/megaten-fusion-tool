import { CompendiumConfig } from '../models';
import { translateDemonData, translateSkillData, translateSpecialRecipes, translateFusionChart } from '../../compendium/models/translator';

export function translateCompConfig(compConfig: CompendiumConfig): CompendiumConfig {
  const enNames = Object.entries(compConfig.jaNames).reduce((acc, [ja, en]) => { acc[en] = ja; return acc; }, {});
  const races = compConfig.races.map(r => enNames[r] || r);

  return {
    appTitle: enNames[compConfig.appTitle] || compConfig.appTitle,
    races,
    raceOrder: races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: compConfig.appCssClasses,

    lang: 'ja',
    jaNames: compConfig.jaNames,
    affinityElems: compConfig.affinityElems,
    skillData: translateSkillData(compConfig.skillData, enNames),
    skillElems: compConfig.skillElems,
    elemOrder: compConfig.elemOrder,
    resistCodes: compConfig.resistCodes,
    affinityBonuses: compConfig.affinityBonuses,
    lvlModifier: compConfig.lvlModifier,

    demonData: translateDemonData(compConfig.demonData, enNames),
    evolveData: translateEvolutions(compConfig.evolveData, enNames),
    dlcDemons: compConfig.dlcDemons.map(dlist => dlist.split(',').map(d => enNames[d] || d).join(',')),
    baseStats: compConfig.baseStats.map(s => enNames[s] || s),
    resistElems: compConfig.resistElems,
    ailmentElems: compConfig.ailmentElems.map(a => enNames[a] || a),

    demonUnlocks: compConfig.demonUnlocks,
    normalTable: translateFusionChart(compConfig.normalTable, enNames),
    elementTable: translateFusionChart(compConfig.elementTable, enNames),
    specialRecipes: translateSpecialRecipes(compConfig.specialRecipes, enNames),

    settingsKey: compConfig.settingsKey.replace('-ja', '') + '-ja',
    settingsVersion: compConfig.settingsVersion,
    defaultRecipeDemon: enNames[compConfig.defaultRecipeDemon] || compConfig.defaultRecipeDemon,
    elementRace: enNames[compConfig.elementRace] || compConfig.elementRace
  }
}

function translateEvolutions(oldEvolves: any, enNames: { [name: string]: string }): any {
  const newEvolves = {};

  for (const [dname, recipe] of Object.entries(oldEvolves)) {
    newEvolves[enNames[dname] || dname] = {
      lvl: recipe['lvl'],
      result: enNames[recipe['result']] || recipe['result']
    };
  }

  return newEvolves;
}
