import { Demon as BaseDemon, Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private pairRecipes: { [result: string]: NamePair[] };
  private invertedRecipes: { [ingredient: string]: { result: string, recipe: string }[] };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: BaseDemon[];
  private _allSkills: Skill[];
  private _inheritTypes: { [inherti: string]: number[] };

  dlcDemons: { [name: string]: boolean } = {};

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons:   { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};
    const pairRecipes: { [result: string]: NamePair[] } = {};
    this._inheritTypes = {};

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          race:    json['race'],
          lvl:     json['lvl'],
          price:   Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          inherit: json['inherits'],
          stats:   json['stats'],
          resists: json['resists'].split('').map(char => this.compConfig.resistCodes[char]),
          skills:  json['skills'],
          fusion:  json['fusion'] || 'normal'
        };
      }
    }

    for (const skillData of this.compConfig.skillData) {
      for (const [name, json] of Object.entries(skillData)) {
        skills[name] = {
          name,
          element:   json['element'],
          cost:      json['cost'] || 0,
          rank:      json['cost'] / 100 || 0,
          effect:    json['effect'],
          learnedBy: [],
          transfer:  [],
          level:     0
        };
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.specialRecipes)) {
      specials[name] = <string[]>json;
      demons[name].fusion = 'special';
    }

    for (const [nameR, recipes] of Object.entries(this.compConfig.pairRecipes)) {
      pairRecipes[nameR] = [];
      for (const recipe of recipes) {
        const [name1, name2] = recipe.split(' x ');
        pairRecipes[nameR].push({ name1, name2 });
      }
    }

    for (const race of this.compConfig.races) {
      inverses[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      if (demon.fusion !== 'party') {
        inverses[demon.race][demon.lvl] = name;
      }

      for (const [skill, level] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level });
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
    this.pairRecipes = pairRecipes;
    this._inheritTypes = this.compConfig.inheritTypes;
  }

  updateDerivedData() {
    const ingredients: { [race: string]: number[] } = {};
    const results:     { [race: string]: number[] } = {};
    const invertedRecipes: { [result: string]: { result: string, recipe: string }[] } = {};
    const skills: Skill[] = [];

    for (const skill of Object.values(this.skills)) {
      if (skill.learnedBy.length < 1) {
        skill.rank = 99;
      } else {
        skills.push(skill);
      }
    }

    for (const [nameR, recipes] of Object.entries(this.pairRecipes)) {
      for (const recipe of recipes) {
        if (!invertedRecipes[recipe.name1]) {
          invertedRecipes[recipe.name1] = [];
        } if (!invertedRecipes[recipe.name2]) {
          invertedRecipes[recipe.name2] = [];
        }

        const invRec = { result: nameR, recipe: recipe.name1 + ' x ' + recipe.name2 };
        invertedRecipes[recipe.name1].push(invRec);
        invertedRecipes[recipe.name2].push(invRec);
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (demon.fusion !== 'party') {
        ingredients[demon.race].push(demon.lvl);

        if (!this.specialRecipes.hasOwnProperty(name)) {
          results[demon.race].push(demon.lvl);
        }
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    this._allDemons = Object.keys(this.demons).map(name => this.demons[name]);
    this._allSkills = skills;
    this.allIngredients = ingredients;
    this.allResults = results;
    this.invertedRecipes = invertedRecipes;
  }

  get allDemons(): BaseDemon[] {
    return this._allDemons;
  }

  get allSkills(): Skill[] {
    return this._allSkills;
  }

  get specialDemons(): Demon[] {
    return Object.keys(this.specialRecipes).map(name => this.demons[name]);
  }

  get inheritHeaders(): string[] {
    return this.compConfig.inheritElems;
  }

  getDemon(name: string): BaseDemon {
    return this.demons[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const elemOrder = this.compConfig.elemOrder;
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (elemOrder[d1.element] - elemOrder[d2.element]) * 10000 + d1.rank - d2.rank);
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
    return this.pairRecipes[name] || [];
  }

  getInheritElems(inheritType: string): number[] {
    return this._inheritTypes[inheritType];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return this.invertedRecipes[ingredient] || [];
  }

  isElementDemon(name: string): boolean {
    return false;
  }
}
