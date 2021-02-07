import { Demon as BaseDemon, Compendium as ICompendium, NamePair, FusionEntry } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: FusionEntry[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private specialNameEntries: { [name: string]: string[] } = {};
  private specialNamePairs: { [name: string]: NamePair[] } = {};
  private invertedSpecials: { [ingred: string]: string[] } = {}

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
    const specialNameEntries: { [name: string]: string[] } = {};
    const specialNamePairs: { [name: string]: NamePair[] } = {};
    const invertedSpecials: { [ingred: string]: string[] } = {};
    this._inheritTypes = {};

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          race:    json['race'],
          lvl:     json['lvl'],
          currLvl: json['lvl'],
          price:   Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          inherit: json['inherits'],
          stats:   json['stats'],
          resists: json['resists'].split('').map(char => this.compConfig.resistCodes[char]),
          skills:  json['skills'],
          fusion:  json['fusion'] || 'normal',
          prereq:  json['prereq'] || ''
        };

        specialNameEntries[name] = [];
        specialNamePairs[name] = [];
        invertedSpecials[name] = [];
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

        const transfer = [];

        if (json['cardn']) {
          for (const dname of json['cardn'].split(', ')) {
            transfer.push({ demon: dname, level: demons[dname] ? 0 : -100 });
          }
        }

        if (json['cardr']) {
          for (const dname of json['cardr'].split(', ')) {
            if (demons[dname]) {
              transfer.push({ demon: dname, level: 5073 });
            } else {
              transfer.push({ demon: dname + ' (Ri)', level: -100 });
            }
          }
        }

        if (json['cardt']) {
          for (const dname of json['cardt'].split(', ')) {
            transfer.push({ demon: dname === 'Request' ? dname : dname + ' (Tr)', level: -100 });
          }
        }

        if (transfer.length > 0) {
          skills[name].transfer = transfer;
        }
      }
    }

    for (const [name, ingreds] of Object.entries(this.compConfig.downRecipes)) {
      specialNameEntries[name].push('Pithos')
      specialNamePairs[name].push({ name1: ingreds[0], name2: 'Valjean' });
      invertedSpecials[ingreds[0]].push(name);
    }

    for (const [name, recipes] of Object.entries(this.compConfig.pairRecipes)) {
      for (const recipe of recipes) {
        const ingreds = recipe.split(' x ');
        const name3 = ingreds.length > 2 ? ingreds[2] : 'Pithos';
        specialNameEntries[name].push(name3);
        specialNamePairs[name].push({ name1: ingreds[0], name2: ingreds[1] });

        for (const ingred of ingreds) {
          invertedSpecials[ingred].push(name);
        }
      }
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
    this.specialNameEntries = specialNameEntries;
    this.specialNamePairs = specialNamePairs;
    this.invertedSpecials = invertedSpecials;
    this._inheritTypes = this.compConfig.inheritTypes;
  }

  updateDerivedData() {
    const ingredients: { [race: string]: number[] } = {};
    const results:     { [race: string]: number[] } = {};

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
    this._allSkills = Object.values(this.skills);
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
    return this.specialNameEntries[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return this.specialNamePairs[name] || [];
  }

  getInheritElems(inheritType: string): number[] {
    return this._inheritTypes[inheritType];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return this.invertedSpecials[ingredient] || [];
  }

  isElementDemon(name: string): boolean {
    return this.getDemon(name) && this.getDemon(name).race === 'Treasure';
  }

  splitSpecialFusion(name: string): FusionEntry[] {
    return this.specialRecipes[name] || [];
  }
}
