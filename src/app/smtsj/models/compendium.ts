import { Races, SkillElementOrder, ResistCodes, Ailments } from './constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import BOSS_DATA_JSON from '../data/boss-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import FUSION_PREREQS_JSON from '../data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';

import REDUX_DEMON_DATA_JSON from '../data/redux-demon-data.json';
import REDUX_SKILL_DATA_JSON from '../data/redux-skill-data.json';
import REDUX_FUSION_PREREQS_JSON from '../data/redux-fusion-prereqs.json';
import REDUX_SPECIAL_RECIPES_JSON from '../data/redux-special-recipes.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private bosses: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private pairRecipes: { [name: string]: NamePair[] } = {};
  private entryRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  static estimateBasePrice(stats: number[], pcoeff: number): number {
    const x = stats.slice(2).reduce((acc, stat) => stat + acc, 0);
    return Math.floor((Math.floor(pcoeff * Math.pow(x, 3) / 1000) + 1300) * 0.75);
  }

  constructor(importRedux: boolean) {
    this.initImportedData(importRedux);
    this.updateDerivedData();
  }

  initImportedData(importRedux: boolean) {
    const demons: { [name: string]: Demon } = {};
    const bosses: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const pairRecipes: { [name: string]: NamePair[] } = {};
    const entryRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    const demonDataJsons: any = [DEMON_DATA_JSON];
    const skillDataJsons: any = [SKILL_DATA_JSON];
    const specialRecipesJsons: any = [SPECIAL_RECIPES_JSON];
    const fusionReqsJsons: { [name: string]: string }[] = [FUSION_PREREQS_JSON];

    const knownDemonCodes: { [code: number]: string } = {};
    const ailmentResists: { [lvl: string]: Skill[] } = { 1125: [], 50: [], 0: [] };

    for (const [lvl, prefix]  of Object.entries({ 1125: 'Weak', 50: 'Resist', 0: 'Null' })) {
      for (const ail of Ailments) {
        ailmentResists[lvl].push({
          name:     prefix + ' ' + ail,
          code:     -1,
          element:  'pas',
          effect:   'Innate resistance',
          power:    0,
          accuracy: 0,
          cost:     0,
          inherit:  'non',
          rank:     99,
          learnedBy: [],
          transfer: [],
          level: 0
        });
      }
    }

    if (importRedux) {
      demonDataJsons.push(REDUX_DEMON_DATA_JSON);
      skillDataJsons.push(REDUX_SKILL_DATA_JSON);
      fusionReqsJsons.push(REDUX_FUSION_PREREQS_JSON);
      specialRecipesJsons.push(REDUX_SPECIAL_RECIPES_JSON);
    } else {
      fusionReqsJsons.push({ 'Alciel': 'Password Only' });
      specialRecipesJsons.push({ 'Alciel': [], 'Demonee-ho': [] });
    }

    for (const demonDataJson of demonDataJsons) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          lvl:      json['lvl'],
          currLvl:  json['lvl'],
          hpmod:    json['hpmod'] || 1,
          pcoeff:   json['pcoeff'],
          race:     json['race'],
          code:     json['code'],
          align:    json['align'],
          fusion:   'normal',
          stats:    json['stats'],
          price:    Compendium.estimateBasePrice(json['stats'], json['pcoeff']),
          resists:  json['resists'].split('').map(char => ResistCodes[char]),
          ailments: (json['ailments'] || '---------').split('').map(char => ResistCodes[char]),
          inherits: json['inherits'].split('').map(char => char === 'o'),
          skills:   json['skills'].reduce((acc, skill, i) => { acc[skill] = i - 3; return acc; }, {}),
          source:   json['source'].reduce((acc, skill, i) => { acc[skill] = i - 3; return acc; }, {}),
        };

        if (demons[name].ailments) {
          const ailLvls = demons[name].ailments;
          for (let i = 0; i < ailLvls.length; i++) {
            if (ailmentResists[ailLvls[i]]) {
              ailmentResists[ailLvls[i]][i].learnedBy.push({ demon: name, level: 0 });
            }
          }
        }

        knownDemonCodes[json['code']] = name;
      }
    }

    const defaultStats = [100, 100, 1, 1, 1, 1, 1];
    const defaultDemon: Demon = {
      name,
      lvl:      1,
      currLvl:  1,
      hpmod:    1,
      pcoeff:   96,
      race:     'Unknown',
      code:     0,
      align:    'Neutral-Neutral',
      fusion:   'password',
      stats:    defaultStats,
      price:    Compendium.estimateBasePrice(defaultStats, 96),
      resists:  '--------'.split('').map(char => ResistCodes[char]),
      ailments: '---------'.split('').map(char => ResistCodes[char]),
      inherits: '---------------'.split('').map(char => char === 'o'),
      skills:   {},
      source:   {},
      isEnemy:  true
    }

    if (!importRedux) {
      for (const [name, json] of Object.entries(BOSS_DATA_JSON)) {
        const stats = [100, 100, 1, 1, 1, 1, 1];
        bosses[name] = Object.assign({}, defaultDemon, {
          name,
          race: json.race,
          code: json.code
        });

        knownDemonCodes[json.code] = name;
      }
    }

    for (let code = 1; code < 512; code++) {
      if (!knownDemonCodes[code]) {
        const name = `Code ${code}`;
        bosses[name] = Object.assign({}, defaultDemon, {
          name,
          code: code
        });
      }
    }

    for (const skillDataJson of skillDataJsons) {
      for (const [name, json] of Object.entries(skillDataJson)) {
        skills[name] = {
          name,
          code:     json['code'],
          element:  json['element'],
          effect:   json['effect'],
          power:    json['power'] || 0,
          accuracy: json['accuracy'] || 0,
          cost:     json['cost'] || 0,
          inherit:  json['inherit'] || json['element'],
          rank:     json['rank'] || 99,
          learnedBy: [],
          transfer: [],
          level: 0
        }
      }
    }

    for (const sentries of Object.values(ailmentResists)) {
      for (const sentry of sentries) {
        skills[sentry.name] = sentry;
      }
    }

    for (const fusionReqsJson of fusionReqsJsons) {
      for (const [name, prereq] of Object.entries(fusionReqsJson)) {
        demons[name].prereq = prereq;
        demons[name].fusion = prereq.includes('Fusion Accident') || prereq.includes('Password Only') ? 'accident' : 'normal';
      }
    }

    for (const specialRecipesJson of specialRecipesJsons) {
      for (const [name, recipe] of Object.entries(specialRecipesJson)) {
        const recipeList = <string[]>recipe;
        const entryList: string[] = [];
        const pairList: NamePair[] = [];
        const entry = demons[name];

        entry.fusion = recipeList.length > 1 ? 'special' : 'accident';
        entryRecipes[name] = entryList;
        pairRecipes[name] = pairList;

        for (const ingred of recipeList) {
          if (ingred.includes(' x ')) {
            const [name1, name2] = ingred.split(' x ');
            pairList.push({ name1, name2 });
          } else {
            entryList.push(ingred);
          }
        }
      }
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level: lvl });
      }

      for (const [skill, lvl] of Object.entries(demon.source)) {
        skills[skill].transfer.push({ demon: name, level: lvl });
      }
    }

    this.demons = demons;
    this.bosses = bosses;
    this.skills = skills;
    this.pairRecipes = pairRecipes;
    this.entryRecipes = entryRecipes;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};
    const skills = Object.keys(this.skills)
      .map(name => this.skills[name])
      .filter(skill => skill.learnedBy.length !== 0 || skill.transfer.length !== 0);

    for (const race of Races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (!this.isElementDemon(name)) {
        ingredients[demon.race].push(demon.lvl);
      }

      if (!this.pairRecipes[name] && !this.entryRecipes[name]) {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const race of Races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    const allies = Object.keys(demonEntries).map(name => demonEntries[name]);
    const enemies = Object.keys(this.bosses).map(name => this.bosses[name]);
    this._allDemons = enemies.concat(allies);
    this._allSkills = skills;
    this.allIngredients = ingredients;
    this.allResults = results;
  }

  get allDemons(): Demon[] {
    return this._allDemons;
  }

  get allSkills(): Skill[] {
    return this._allSkills;
  }

  get specialDemons(): Demon[] {
    return [];
  }

  getDemon(name: string): Demon {
    return this.demons[name] || this.bosses[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
    return skills;
  }

  getIngredientDemonLvls(race: string): number[] {
    return this.allIngredients[race] || [];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race] || [];
  }

  getSpecialNameEntries(name: string): string[] {
    return this.entryRecipes[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return this.pairRecipes[name] || [];
  }

  getFusionRequirements(name: string): string[] {
    return [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.demons[name] && this.demons[name].race === 'Prime';
  }
}
