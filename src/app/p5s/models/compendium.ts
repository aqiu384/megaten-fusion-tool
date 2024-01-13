import { Compendium as ICompendium, NamePair, FusionEntry } from '../../compendium/models';
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
  private _allDemons: Demon[];
  private _allSkills: Skill[];

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
    const resistCodes: { [code: string]: number } = {};

    for (let [i, code] of 'drns-w'.split('').entries()) {
      resistCodes[code] = (i + 1 << 12) + (this.compConfig.resistCodes[code] / 5 << 4);
    }

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          race:       json['race'],
          lvl:        json['lvl'],
          currLvl:    json['lvl'],
          price:      Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          inherits:   parseInt(((json['affinities'] || [-10]).map(a => a > -10 ? '1' : '0')).join(''), 2),
          affinities: json['affinities'],
          stats:      json['stats'],
          resists:    json['resists'].split('').map(x => resistCodes[x]),
          eresists:   (json['riskyrs'] || json['resists']).split('').map(x => resistCodes[x]),
          area:       json['location'] || '',
          combos:     json['combos'],
          skills:     json['skills'],
          fusion:     json['fusion'] || 'normal',
          prereq:     json['prereq'] || ''
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
          rank:      json['rank'] || 99,
          target:    json['target'] || 'Self',
          effect:    json['effect'],
          learnedBy: [],
          transfer:  json['transfer'] ? [{ demon: json['transfer'], level: -100 }] : [],
          level:     0
        };
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
          if (invertedSpecials[ingred].indexOf(name) === -1) {
            invertedSpecials[ingred].push(name);
          }
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

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      if (demon.fusion !== 'party') {
        inverses[demon.race][demon.lvl] = demon.name;
      }

      for (const [skill, level] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: demon.name, level });
      }

      for (let i = 0; i < demon.combos.length; i++) {
        const skill = demon.combos[i];

        if (skills[skill].element !== 'pas') {
          skills[skill].learnedBy.push({ demon: demon.name, level: 3517 + i })
        }
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
    this.specialNameEntries = specialNameEntries;
    this.specialNamePairs = specialNamePairs;
    this.invertedSpecials = invertedSpecials;
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

  updateFusionSettings(config: { [setting: string]: boolean; }) { }
}
