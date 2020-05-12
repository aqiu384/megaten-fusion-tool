import { Demon as BaseDemon, Compendium as ICompendium, NamePair, FusionEntry } from '../../compendium/models';
import { Demon, Skill, MultiFusionTrio, CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: FusionEntry[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private multiRecipes: { [name: string]: string[][] } = {};

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
    const specials: { [name: string]: FusionEntry[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};
    const multiRecipes: { [name: string]: string[][] } = {};
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
          fusion:  json['fusion'] || 'normal',
          prereq:  json['prereq'] || ''
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

    for (const [name, recipes] of Object.entries(this.compConfig.pairRecipes)) {
      multiRecipes[name] = recipes.map(r => r.split(' x '));
    }

    for (const [name, recipe] of Object.entries(this.compConfig.specialRecipes)) {
      specials[name] = [];
      demons[name].fusion = 'special';

      for (const ingred of recipe) {
        const demon1 = demons[ingred.substring(0, ingred.length - 3)];
        const lvl1 = parseInt(ingred.substring(ingred.length - 3), 10);
        specials[name].push({ price: demon1.price, race1: demon1.race, lvl1, name1: demon1.name });
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
    this.multiRecipes = multiRecipes;
    this._inheritTypes = this.compConfig.inheritTypes;
  }

  updateDerivedData() {
    const ingredients: { [race: string]: number[] } = {};
    const results:     { [race: string]: number[] } = {};
    const skills: Skill[] = [];

    for (const skill of Object.values(this.skills)) {
      if (skill.learnedBy.length < 1) {
        skill.rank = 99;
      } else {
        skills.push(skill);
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
    return [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return [];
  }

  getInheritElems(inheritType: string): number[] {
    return this._inheritTypes[inheritType];
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

  splitSpecialFusion(name: string): FusionEntry[] {
    return this.specialRecipes[name] || [];
  }

  getMultiIngreds(name: string): string[] {
    const { race, lvl } = this.getDemon(name);
    return this.getIngredientDemonLvls(race).filter(l => l <= lvl).map(l => this.reverseLookupDemon(race, l));
  }

  splitMultiFusion(name: string): MultiFusionTrio[] {
    const { race, lvl } = this.getDemon(name);
    const recipes: MultiFusionTrio[] = [];

    const upperIngreds = this.getIngredientDemonLvls(race).filter(l => l > lvl).map(l => this.reverseLookupDemon(race, l));

    if (upperIngreds.length > 0) {
      const names1 = upperIngreds.slice(1).concat(this.compConfig.downRecipes[name] || []);
      const names2 = upperIngreds.slice(0, 1);

      if (names1.length > 0) {
        const demon1 = this.getDemon(names1[0]);
        const demon2 = this.getDemon(names2[0]);

        recipes.push({
          price: demon1.price + demon2.price,
          names1, lvl1: demon1.lvl,
          names2, lvl2: demon2.lvl,
          names3: [], lvl3: 0
        });
      }
    }

    for (const recipe of this.multiRecipes[name] || []) { 
      const demon1 = this.getDemon(recipe[0]);
      const demon2 = this.getDemon(recipe[1]);
      const names3 = recipe.length > 2 ? this.getMultiIngreds(recipe[2]) : [];
      const price3 = recipe.length > 2 ? this.getDemon(recipe[2]).price : 0;
      const lvl3 = recipe.length > 2 ? this.getDemon(recipe[2]).lvl : 0;

      recipes.push({
        price: demon1.price + demon2.price + price3,
        names1: this.getMultiIngreds(demon1.name), lvl1: demon1.lvl,
        names2: this.getMultiIngreds(demon2.name), lvl2: demon2.lvl,
        names3, lvl3
      });
    }

    return recipes;
  }
}
