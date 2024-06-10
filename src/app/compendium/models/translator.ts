import { DemonUnlock } from '../models/fusion-settings';
import Translations from '../data/translations.json';

type StringDict = { [name: string]: string };

export function translateComp(dict: string[], lang: string): string {
  const i = Translations.Languages.Languages.indexOf(lang);
  return dict[-1 < i && i < dict.length ? i : 0];
}

export function translateDemonData(oldDemons: any, enNames: StringDict): any {
  const newDemons = {};

  for (const [dname, entry] of Object.entries(oldDemons)) {
    const newEntry = Object.assign({}, entry);

    if (entry['skills'] instanceof Array) {
      newEntry['skills'] = entry['skills'].map(s => enNames[s] || s)
    } else {
      newEntry['skills'] = {};
      for (const [sname, lvl] of Object.entries(entry['skills'])) {
        newEntry['skills'][enNames[sname] || sname] = lvl;
      }
    }

    newEntry['race'] = enNames[newEntry['race']] || newEntry['race'];
    newDemons[enNames[dname] || dname] = newEntry;
  }

  return newDemons;
}

export function translateSkillData(oldSkills: any, enNames: StringDict): any {
  const newSkills = {};

  for (const [sname, entry] of Object.entries(oldSkills)) {
    const newEntry = Object.assign({}, entry);
    const target = newEntry['target'] || 'Self';
    newEntry['target'] = enNames[target] || target;
    newSkills[enNames[sname] || sname] = newEntry;
  }

  return newSkills;
}

export function translateSpecialRecipes(oldRecipes: { [name: string]: string[] }, enNames: StringDict): any {
  const newRecipes = {};

  for (const [dname, recipe] of Object.entries(oldRecipes)) {
    newRecipes[enNames[dname] || dname] = recipe.map(ingreds => ingreds.split(' x ').map(ingred => enNames[ingred] || ingred).join(' x '));
  }

  return newRecipes;
}

export function translateFusionChart(oldChart: any, enNames: StringDict): any {
  const newChart = {
    races: oldChart['races'].map(race => enNames[race] || race),
    table: oldChart['table'].map(row => row.map(race => enNames[race] || race))
  };

  if (oldChart['elems']) {
    newChart['elems'] = oldChart['elems'].map(race => enNames[race] || race);
    newChart['table'] = oldChart['table'];
  }

  return newChart;
}

export function translateDemonUnlocks(oldUnlocks: DemonUnlock[], enNames: StringDict): DemonUnlock[] {
  const newUnlocks: DemonUnlock[] = []

  for (const { category, unlocked, conditions } of oldUnlocks) {
    const newConditions = {};
    
    for (const [name, cond] of Object.entries(conditions)) {
      const enName = name.split(',').map(x => enNames[x] || x).join(',');
      newConditions[enName] = cond;
    }

    newUnlocks.push({
      category: enNames[category] || category,
      unlocked,
      conditions: newConditions
    });
  }

  return newUnlocks;
}
