export function translateDemonData(oldDemons: any, enNames: { [name: string]: string }): any {
  const newDemons = {};

  for (const [dname, entry] of Object.entries(oldDemons)) {
    const newEntry = Object.assign({}, entry);
    const newSkills = {};

    for (const [sname, lvl] of Object.entries(entry['skills'])) {
      newSkills[enNames[sname] || sname] = lvl;
    }

    newEntry['race'] = enNames[newEntry['race']] || newEntry['race'];
    newEntry['skills'] = newSkills;
    newDemons[enNames[dname] || dname] = newEntry;
  }

  return newDemons;
}

export function translateSkillData(oldSkills: any, enNames: { [name: string]: string }): any {
  const newSkills = {};

  for (const [sname, entry] of Object.entries(oldSkills)) {
    const newEntry = Object.assign({}, entry);
    const target = newEntry['target'] || 'Self';
    newEntry['target'] = enNames[target] || target;
    newSkills[enNames[sname] || sname] = newEntry;
  }

  return newSkills;
}

export function translateSpecialRecipes(oldRecipes: { [name: string]: string[] }, enNames: { [name: string]: string }): any {
  const newRecipes = {};

  for (const [dname, recipe] of Object.entries(oldRecipes)) {
    newRecipes[enNames[dname] || dname] = recipe.map(ingreds => ingreds.split(' x ').map(ingred => enNames[ingred] || ingred).join(' x '));
  }

  return newRecipes;
}

export function translateFusionChart(oldChart: any, enNames: { [name: string]: string }): any {
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
