import { ElementOrder, Races, ResistCodes } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  constructor(demonDataJsons: any[], skillDataJsons: any[], specialRecipeJsons: any[]) {
    this.initImportedData(demonDataJsons, skillDataJsons, specialRecipeJsons);
    this.updateDerivedData();
  }

  initImportedData(demonDataJsons: any[], skillDataJsons: any[], specialRecipeJsons: any[]) {
    const demons:   { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};

    for (const demonDataJson of demonDataJsons) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          race:    json.race,
          lvl:     json.lvl,
          price:   3 * Math.pow(json.stats.reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          inherit: json.inherits,
          stats:   json.stats,
          resists: json.resists.split('').map(char => ResistCodes[char]),
          skills:  json.skills,
          fusion:  'normal'
        };
      }
    }

    for (const skillData of skillDataJsons) {
      for (const [name, json] of Object.entries(skillData)) {
        skills[name] = {
          name,
          element:   json.element,
          cost:      json.cost ? json.cost : 0,
          rank:      json.rank,
          effect:    json.effect,
          learnedBy: [],
          fuse:      json.card ? json.card.split(', ') : [],
          level:     0
        };

        if (json.unique) {
          skills[name].rank = 99;
        }
      }
    }

    for (const recipeJson of specialRecipeJsons) {
      for (const [name, json] of Object.entries(recipeJson)) {
        specials[name] = json;
        demons[name].fusion = 'special';
      }
    }

    for (const race of Races) {
      inverses[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inverses[demon.race][demon.lvl] = name;

      for (const [skill, level] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level });
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills =       Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients:   { [race: string]: number[] } = {};
    const results:       { [race: string]: number[] } = {};

    for (const race of Races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      ingredients[demon.race].push(demon.lvl);

      if (!this.specialRecipes.hasOwnProperty(name)) {
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
    return Object.keys(this.specialRecipes).map(name => this.demons[name]);
  }

  getDemon(name: string): Demon {
    return this.demons[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
    return skills;
  }

  getIngredientDemonLvls(race: string): number[] {
    return this.allIngredients[race] || [];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race] || [];
  }

  getSpecialNameEntries(name: string): string[] {
    return this.specialRecipes[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return [];
  }

  isElementDemon(name: string): boolean {
    return false;
  }
}
