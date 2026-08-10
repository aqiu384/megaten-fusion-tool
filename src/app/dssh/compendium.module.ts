import { createCompendiumRoutes } from '../smt1/compendium-routing.module';
import { Demon, CompendiumConfig } from '../smt1/models';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/norm-chart.json';
import DARK_CHART_JSON from './data/dark-chart.json';
import TRIPLE_CHART_JSON from './data/triple-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import INHERIT_SKILLS_JSON from './data/inherit-skills.json';

function dsshAttacks(stats: number[], lvl: number, matkUps: number[]) {
    const [St, In, Ma, En, Ag, Lu] = stats.slice(4);
    return [
      2*lvl + 2*St,
      1.5*lvl + 1.2*Ag + 0.6*Lu,
      1.875*In + matkUps[Ma],
      2*In + Ma,
      2*lvl + 2*En + 16,
      1.5*lvl + Ag + 0.5*Lu
    ].map(a => Math.floor(a));
}

function getInheritSkills(result: Demon, ingreds: Demon[], compConfig: CompendiumConfig): string[] {
  const inherits: { [skill: string]: number } = Object.keys(result.skills)
   .reduce((acc, s) => { acc[s] = -1; return acc; }, {});
  const maxSkills = 6 - Object.keys(result.skills).length;
  const normSkills = compConfig.inheritSkills[0];
  const elemSkills = compConfig.inheritSkills[result.inherits];
  const ingredOrder = ingreds.slice().sort((a, b) =>
    100 * compConfig.raceOrder[a.race] + a.lvl - 100 * compConfig.raceOrder[b.race] + b.lvl
  );

  for (const [i, ingred] of ingredOrder.entries()) {
    for (const skill of Object.keys(ingred.skills)) {
      if (elemSkills[skill] > -1 && !(inherits[skill] > -2)) {
        inherits[skill] = elemSkills[skill] + 100 * i;
      }
    }
  }

  for (const [i, ingred] of ingredOrder.entries()) {
    for (const skill of Object.keys(ingred.skills)) {
      if (normSkills[skill] > -1 && !(inherits[skill] > -2)) {
        inherits[skill] = normSkills[skill] + 100 * i + 300;
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

  const matkUps = Array<number>(41).fill(0);
  const raceAligns = {};
  const species = {};
  const speciesLookup = {};
  const DEITIES = [];
  const BEASTS = [];
  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;

  for (let i = 1; i < matkUps.length; i++) {
    matkUps[i] = matkUps[i - 1] + COMP_CONFIG_JSON.matkUps[i - 1];
  }

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
    entry['cost'] = cost ? cost + costType: 0;
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
    demon.atks = dsshAttacks(demon.stats, Math.floor(demon.lvl), matkUps);

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
      case 'Entity':
        SPECIAL_RECIPES_JSON[name] = { fusion: 'normal', prereq: 'Perform fusion during new moon' };
        break;
      case 'Zealot':
        SPECIAL_RECIPES_JSON[name] = { fusion: 'normal', prereq: 'Perform fusion during full moon' };
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
      case 'Rumor':
      case 'Ranger':
        if (!SPECIAL_RECIPES_JSON[name]) {
          SPECIAL_RECIPES_JSON[name] = { fusion: 'recruit', prereq: 'Recruitment only' };
        }
        break;
      default:
        break;
    }
  }

  for (const [name, skill] of Object.entries(SKILL_DATA_JSON)) {
    skill['element'] = skill.elem;

    if (skill['unique']) {
      skill['enemy'] = true;
    }
  }

  const inheritSkills: { [skill: string]: number }[] = INHERIT_SKILLS_JSON
    .map((slist, si) => slist.reduce((acc, x, i) => { acc[x] = i + (si > 0 ? 0 : 20); return acc; }, {}));

  return {
    appTitle: 'Devil Summoner: Soul Hackers',
    appCssClasses: ['smtnes', 'dssh'],
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

    normalTable: FUSION_CHART_JSON,
    darkTable: DARK_CHART_JSON,
    elementTable: normalElemChart,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],

    tripleTable: TRIPLE_CHART_JSON,
    tripleDarkTable: DARK_CHART_JSON,
    tripleElementTable: tripleElemChart,
    tripleMitamaTable: ELEMENT_CHART_JSON['triples']
  };
}

export const CompendiumRoutes = createCompendiumRoutes(createCompConfig());
