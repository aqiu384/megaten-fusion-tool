import { createCompendiumRoutes } from '../smt1/compendium-routing.module';
import { Demon } from '../compendium/models';
import { CompendiumConfig } from '../smt1/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ALIGNMENT_JSON from './data/alignments.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import TRIPLE_CHART_JSON from './data/triple-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

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
    if (ingred.inherits === result.inherits) {
      for (const skill of Object.keys(ingred.skills)) {
        if (elemSkills[skill] > -1 && !(inherits[skill] > -2)) {
          inherits[skill] = elemSkills[skill] + 200 * i;
        }
      }

      const ingredNorms = Object.entries(ingred.skills).sort((a, b) => a[1] - b[1]);
      for (const skill of ingredNorms.map(s => s[0])) {
        if (normSkills[skill] > -1 && !(inherits[skill] > -2)) {
          inherits[skill] = normSkills[skill] + 200 * i + 100;
        }
      }
    }
  }

  for (const [i, ingred] of ingredOrder.entries()) {
    if (ingred.inherits !== result.inherits) {
      for (const skill of Object.keys(ingred.skills)) {
        if (normSkills[skill] > -1 && !(inherits[skill] > -2)) {
          inherits[skill] = normSkills[skill] + 100 * i + 600;
        }
      }
    }
  }

  return Object.entries(inherits)
    .filter(s => s[1] > -1).sort((a, b) => a[1] - b[1])
    .map(s => s[0]).slice(0, maxSkills);
}

function createCompConfig(): CompendiumConfig {
  const RECRUIT_RACES = [ 'Messian', 'Gaean' ];
  const ENEMY_RACES = [ 'Fiend', 'Machine', 'Virus', 'Vaccine' ];
  const resistElems = COMP_CONFIG_JSON['resistElems'];
  const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
  const races = [];
  const speciesLookup = {};
  const species = {};

  for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);

    for (const race of rs) {
      races.push(race);
    }

    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }

  for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
    if (RECRUIT_RACES.indexOf(entry.race) !== -1) {
      SPECIAL_RECIPES_JSON[demon] = { fusion: 'recruit', prereq: 'Recruitment only' };
    } else if (ENEMY_RACES.indexOf(entry.race) !== -1) {
      SPECIAL_RECIPES_JSON[demon] = { fusion: 'enemy', prereq: 'Enemy only' };
    }
  }

  const COST_MP = 3 << 10;
  const COST_EX_HP = 8 << 10;
  const COST_EXTRA = 16 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? COST_MP - 1000 : COST_EX_HP;
    entry['cost'] = cost ? cost + costType: COST_EXTRA;
  }

  const inheritSkills: { [skill: string]: number }[] = COMP_CONFIG_JSON['inheritSkills']
    .map((slist, si) => slist.reduce((acc, x, i) => { acc[x] = i + (si > 0 ? 0 : 20); return acc; }, {}));

  return {
    appTitle: 'Shin Megami Tensei II',
    appCssClasses: ['smtnes', 'smt2'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],

    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    useSpeciesFusion: true,
    inheritTypes: COMP_CONFIG_JSON['inheritTypes'],
    inheritSkills,
    getInheritSkills,

    normalLvlModifier: 2.4,
    tripleLvlModifier: -4.75,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: ALIGNMENT_JSON,
    normalTable: FUSION_CHART_JSON,
    tripleTable: TRIPLE_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],
    specialRecipes: SPECIAL_RECIPES_JSON,
    darknessRecipes: FUSION_CHART_JSON['darks']
  };
}

export const CompendiumRoutes = createCompendiumRoutes(createCompConfig());
