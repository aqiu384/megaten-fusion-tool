import { CompendiumConfig } from '../models';

export function translateCompConfig(compConfig: CompendiumConfig): CompendiumConfig {
  const engNames = compConfig.engNames;
  const races = compConfig.races.map(r => engNames[r] || r);

  return {
    appTitle: engNames[compConfig.appTitle] || compConfig.appTitle,
    races,
    raceOrder: getEnumOrder(races),
    appCssClasses: compConfig.appCssClasses,

    lang: 'ja',
    engNames: compConfig.engNames,
    affinityElems: compConfig.affinityElems,
    skillData: translateSkillData(compConfig.skillData, engNames),
    skillElems: compConfig.skillElems,
    elemOrder: compConfig.elemOrder,
    resistCodes: compConfig.resistCodes,
    affinityBonuses: compConfig.affinityBonuses,

    demonData: translateDemonData(compConfig.demonData, engNames),
    evolveData: {},
    dlcDemons: compConfig.dlcDemons.map(dlist => dlist.split(',').map(d => engNames[d] || d).join(',')),
    baseStats: compConfig.baseStats.map(s => engNames[s] || s),
    resistElems: compConfig.resistElems,
    ailmentElems: compConfig.ailmentElems.map(a => engNames[a] || a),

    normalTable: translateFusionChart(compConfig.normalTable, engNames),
    elementTable: translateFusionChart(compConfig.elementTable, engNames),
    specialRecipes: translateSpecialRecipes(compConfig.specialRecipes, engNames),

    settingsKey: compConfig.settingsKey.replace('-ja', '') + '-ja',
    settingsVersion: compConfig.settingsVersion
  }
}

function getEnumOrder(target: string[]): { [key: string]: number } {
  return target.reduce((acc, val, i) => { acc[val] = i; return acc }, {});
}

function translateDemonData(oldDemons: any, engNames: { [name: string]: string }): any {
  const newDemons = {};

  for (const [dname, entry] of Object.entries(oldDemons)) {
    const newEntry = Object.assign({}, entry);
    const newSkills = {};

    for (const [sname, lvl] of Object.entries(entry['skills'])) {
      newSkills[engNames[sname] || sname] = lvl;
    }

    newEntry['race'] = engNames[newEntry['race']] || newEntry['race'];
    newEntry['skills'] = newSkills;
    newDemons[engNames[dname] || dname] = newEntry;
  }

  return newDemons;
}

function translateSkillData(oldSkills: any, engNames: { [name: string]: string }): any {
  const newSkills = {};

  for (const [sname, entry] of Object.entries(oldSkills)) {
    const newEntry = Object.assign({}, entry);
    const target = newEntry['target'] || 'Self';
    newEntry['target'] = engNames[target] || target;
    newSkills[engNames[sname] || sname] = newEntry;
  }

  return newSkills;
}

function translateSpecialRecipes(oldRecipes: { [name: string]: string[] }, engNames: { [name: string]: string }): any {
  const newRecipes = {};

  for (const [dname, recipe] of Object.entries(oldRecipes)) {
    newRecipes[engNames[dname] || dname] = recipe.map(ingred => engNames[ingred] || ingred);
  }

  return newRecipes;
}

function translateFusionChart(oldChart: any, engNames: { [name: string]: string }): any {
  const newChart = {
    races: oldChart['races'].map(race => engNames[race] || race),
    table: oldChart['table'].map(row => row.map(race => engNames[race] || race))
  };

  if (oldChart['elems']) {
    newChart['elems'] = oldChart['elems'].map(race => engNames[race] || race);
    newChart['table'] = oldChart['table'];
  }

  return newChart;
}
