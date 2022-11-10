import { Races, ElementOrder, ResistCodes } from '../models/constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import FUSION_PREREQS_JSON from '../data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import MAGATAMA_DATA_JSON from '../data/magatama-data.json';
import EVOLUTIONS_JSON from '../data/evolutions.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private pairRecipes: { [name: string]: NamePair[] } = {};
  private entryRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  dlcDemons: { [name: string]: boolean } = {};

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  static estimateBasePrice(stats: number[]): number {
    return 100 * Math.floor(Math.pow(stats.slice(2).reduce((acc, stat) => stat + acc, 0), 2) / 20);
  }

  constructor() {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const pairRecipes: { [name: string]: NamePair[] } = {};
    const entryRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = {
        name: name,
        race: json.race,
        lvl: json.lvl,
        currLvl: json.lvl,
        price: Compendium.estimateBasePrice(json.stats),
        inherits: 0,
        stats: json.stats,
        resists: json.resists.split('').map(char => ResistCodes[char]),
        affinities: json.inherits.split('').map(char => char === 'o' ? 1 : 0),
        skills: json.skills,
        fusion: 'normal',
        prereq: FUSION_PREREQS_JSON[name] || ''
      };
    }

    for (const [name, json] of Object.entries(MAGATAMA_DATA_JSON)) {
      demons[name] = {
        name: name,
        race: 'Magatama',
        lvl: json.lvl,
        currLvl: json.lvl,
        price: Compendium.estimateBasePrice(json.stats),
        inherits: 0,
        stats: [0, 0].concat(json.stats),
        resists: json.resists.split('').map(char => ResistCodes[char]),
        affinities: 'oo-oo-oo-'.split('').map(char => char === 'o' ? 1 : 0),
        skills: json.skills,
        fusion: 'magatama',
        prereq: json.prereq
      };
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name,
        rank:    json['rank'],
        element: json['element'],
        effect:  json['effect'],
        cost:    json['cost'] || 0,
        damage:  json['damage'] || '',
        target:  json['target'] || '',
        requires: json['requires'] || '',
        learnedBy: [],
        level: 0
      };

      skills[name].inherit = skills[name].requires || 'None';

      if (!skills[name].rank) {
        skills[name].rank = 99;
      }
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      for (const name of Object.keys(demon.skills)) {
        skills[name].learnedBy.push({
          demon: demon.name,
          level: demon.skills[name]
        });
      }
    }

    for (const [name, recipeList] of Object.entries(SPECIAL_RECIPES_JSON)) {
      const entry = demons[name];
      entryRecipes[name] = [];
      pairRecipes[name] = [];

      entry.fusion = recipeList.length > 0 ? 'special' : 'accident';

      for (const ingred of recipeList) {
        if (ingred.includes(' x ')) {
          const [race1, race2] = ingred.split(' x ');
          const leftNames = demons[race1] ? [race1] : Object.values(inversions[race1]);
          const rightNames = demons[race2] ? [race2] : Object.values(inversions[race2]);

          for (const name1 of leftNames) {
            for (const name2 of rightNames) {
              if (name1 !== name2) {
                pairRecipes[name].push({ name1, name2 });
              }
            }
          }
        } else {
          if (demons[ingred]) {
            entryRecipes[name].push(ingred);
          } else {
            for (const name1 of Object.values(inversions[ingred])) {
              entryRecipes[name].push(name1);
            }
          }
        }
      }
    }

    for (const [name, json] of Object.entries(EVOLUTIONS_JSON)) {
      const fromDemon = demons[name];
      const toDemon = demons[json.result];

      demons[fromDemon.name].evolvesTo = {
        price: toDemon.price,
        race1: toDemon.race,
        lvl1: json.lvl,
        name1: toDemon.name
      }

      demons[toDemon.name].evolvesFrom = {
        price: fromDemon.price,
        race1: fromDemon.race,
        lvl1: json.lvl,
        name1: fromDemon.name
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.pairRecipes = pairRecipes;
    this.entryRecipes = entryRecipes;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills = Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of Races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (!this.isElementDemon(name) && !this.isOverlappingResult(name)) {
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

    this._allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
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
    return this.demons[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(skills: { [skill: string]: number }): Skill[] {
    const retSkills = [];

    for (const [name, lvl] of Object.entries(skills)) {
      retSkills.push(this.skills[name]);
      this.skills[name].level = lvl;
    }

    retSkills.sort((d1, d2) => (d1.level - d2.level) * 100 + ElementOrder[d1.element] - ElementOrder[d2.element]);
    return retSkills;
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

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.demons[name] && this.demons[name].race === 'Element';
  }

  isOverlappingResult(name: string) {
    return false;
  }
}
