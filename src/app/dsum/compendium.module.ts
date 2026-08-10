import { createCompendiumRoutes } from '../smt1/compendium-routing.module';
import { Demon, CompendiumConfig } from '../smt1/models';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/norm-chart.json';
import DARK_CHART_JSON from './data/dark-chart.json';
import TRIPLE_CHART_JSON from './data/norm-triple-chart.json';
import DARK_TRIPLE_CHART_JSON from './data/dark-triple-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import INHERIT_SKILLS_JSON from './data/inherit-skills.json';

function getInheritSkills(result: Demon, ingreds: Demon[], compConfig: CompendiumConfig): string[] {
  const inherits: { [skill: string]: number } = Object.keys(result.skills)
   .reduce((acc, s) => { acc[s] = -1; return acc; }, {});
  const maxSkills = 6 - Object.keys(result.skills).length;
  const normSkills = compConfig.inheritSkills[result.inherits];
  const elemSkills = compConfig.inheritSkills[compConfig.inheritSkills.length - 1];
  const ingredOrder = ingreds.slice().sort((a, b) =>
    1000 * compConfig.raceOrder[a.race] + (a.inherits === result.inherits ? 0 : 100) + a.lvl -
    1000 * compConfig.raceOrder[b.race] + (b.inherits === result.inherits ? 0 : 100) + b.lvl
  );

  for (const [i, ingred] of ingredOrder.entries()) {
    const skillSet = ingred.inherits === result.inherits ? elemSkills : normSkills;
    for (const skill of Object.keys(ingred.skills)) {
      if (skillSet[skill] > -1 && !(inherits[skill] > -2)) {
        inherits[skill] = skillSet[skill] + 100 * i;
      }
    }
  }

  return Object.entries(inherits)
    .filter(s => s[1] > -1).sort((a, b) => a[1] - b[1])
    .map(s => s[0]).slice(0, maxSkills);
}

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON['resistElems'];
  const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);

  const raceAligns = {};
  const species = {};
  const speciesLookup = {};
  const DEITIES = [];
  const BEASTS = [];
  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
    entry['cost'] = cost ? cost + costType: 0;
  }

  const normalTable = {
    races: FUSION_CHART_JSON['races'].concat(['Mitama']),
    table: FUSION_CHART_JSON['table'].concat(['-']),
  }

  const tripleTable = {
    races: TRIPLE_CHART_JSON['races'].concat(['Mitama']),
    table: TRIPLE_CHART_JSON['table'].concat(['-']),
  }

  const normalElemChart = {
    elems: ELEMENT_CHART_JSON['elems'].slice(0, 4),
    races: ELEMENT_CHART_JSON['races'],
    table: ELEMENT_CHART_JSON['table'].map(row => row.slice(0, 4))
  }

  const tripleElemChart = {
    elems: ELEMENT_CHART_JSON['elems'].slice(4, 10),
    races: ELEMENT_CHART_JSON['races'],
    table: ELEMENT_CHART_JSON['table'].map(row => row.slice(4, 10))
  };

  for (const rs of COMP_CONFIG_JSON['species']) {
    const spec = rs[0];
    species[spec] = [];

    for (const pair of rs.slice(1)) {
      const [race, align] = pair.split('|');
      raceAligns[race] = align;
      species[spec].push(race);
      speciesLookup[race] = spec;
    }
  }

  for (const [name, demon] of Object.entries(DEMON_DATA_JSON)) {
    demon['resists'] = demon['resists'].slice(0, 15);

    switch (demon.race) {
      case 'Deity':
      case 'Megami':
        DEITIES.push(name);
        break;
      case 'Avatar':
      case 'Holy':
      case 'Beast':
      case 'Wilder':
        BEASTS.push(name);
        break;
      case 'Enigma':
        SPECIAL_RECIPES_JSON[name] = {
          fusion: 'accident',
          prereq: 'Trigger fusion accident using one of the following ingredients during new moon',
          special: DEITIES
        }
        break;
      case 'UMA':
        SPECIAL_RECIPES_JSON[name] = {
          fusion: 'accident',
          prereq: 'Trigger fusion accident using one of the following ingredients during full moon',
          special: BEASTS
        };
        break;
      default:
        break;
    }
  }

  const inheritOrder = INHERIT_SKILLS_JSON[INHERIT_SKILLS_JSON.length - 1]
    .reduce((acc, x, i) => { acc[x] = i; return acc; }, {});
  const inheritSkills: { [skill: string]: number }[] = INHERIT_SKILLS_JSON
    .map(slist => slist.reduce((acc, x) => { acc[x] = inheritOrder[x]; return acc; }, {}));
  inheritSkills.map(slist => Object.assign(slist, inheritSkills[0]));

  return {
    appTitle: 'Shin Megami Tensei: Devil Summoner',
    appCssClasses: ['smtnes', 'dsum'],
    races: COMP_CONFIG_JSON['races'],
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],

    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: COMP_CONFIG_JSON['races'].reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    useSpeciesFusion: false,
    inheritTypes: COMP_CONFIG_JSON['inheritTypes'],
    inheritSkills,
    getInheritSkills,

    normalLvlModifier: 2.5,
    tripleLvlModifier: 3.25,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: { races: raceAligns },
    specialRecipes: SPECIAL_RECIPES_JSON,

    normalTable,
    darkTable: DARK_CHART_JSON,
    elementTable: normalElemChart,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],

    tripleTable,
    tripleDarkTable: DARK_TRIPLE_CHART_JSON,
    tripleElementTable: tripleElemChart,
    tripleMitamaTable: ELEMENT_CHART_JSON['triples']
  };
}

export const CompendiumRoutes = createCompendiumRoutes(createCompConfig());
