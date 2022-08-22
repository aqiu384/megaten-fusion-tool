import { Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private specialPairRecipes: { [name: string]: NamePair[] };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private _dlcDemons: { [name: string]: boolean } = {
    'Cleopatra': false,
    'Mephisto': false
  };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const specialPairRecipes: { [name: string]: NamePair[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    const blankAils = Array<number>(this.compConfig.ailmentElems.length).fill(100);
    const ailmentResists: { [lvl: string]: Skill[] } = { 1125: [], 50: [], 0: [] };
    const langEn = this.compConfig.lang !== 'ja';
    const ailEffect = langEn ? 'Innate resistance' : '';
    const ailTarget = langEn ? 'Self' : '自身';
    const ailLvls = langEn ? { 1125: 'Weak ', 50: 'Resist ', 0: 'Null ' } : { 1125: '弱', 50: '強', 0: '無' };

    for (const [lvl, prefix]  of Object.entries(ailLvls)) {
      for (const ail of this.compConfig.ailmentElems) {
        ailmentResists[lvl].push({
          name:     prefix + ail,
          element:  'pas',
          effect:   ailEffect,
          target:   ailTarget,
          cost:     0,
          rank:     99,
          learnedBy: [],
          level: 0
        });
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.demonData)) {
      demons[name] = {
        name,
        race:       json['race'],
        lvl:        json['lvl'],
        currLvl:    json['currLvl'] || json['lvl'],
        skills:     json['skills'],
        price:      json['price'] * 2,
        stats:      json['stats'],
        resists:    json['resists'].split('').map(e => this.compConfig.resistCodes[e]),
        affinities: json['affinities'],
        ailments:   json['ailments'] ? json['ailments'].split('').map(e => this.compConfig.resistCodes[e]) : blankAils,
        fusion:     json['fusion'] || 'normal',
        prereq:     json['prereq'] || ''
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.skillData)) {
      skills[name] = {
        name,
        element: json['element'],
        rank:    json['rank'],
        effect:  json['effect'],
        damage:  json['damage'] || '',
        target:  json['target'] || 'Self',
        hits:    json['hits'] || '',
        cost:    json['cost'] || 0,
        learnedBy: [],
        level: 0
      };

      if (!skills[name].rank) {
        skills[name].rank = 99;
      }
    }

    for (const sentries of Object.values(ailmentResists)) {
      for (const sentry of sentries) {
        skills[sentry.name] = sentry;
      }
    }

    for (const [name, ojson] of Object.entries(this.compConfig.specialRecipes)) {
      const nameEntries: string[] = [];
      const namePairs: NamePair[] = [];

      for (const ingred of <string[]>ojson) {
        if (ingred.includes(' x' )) {
          const [name1, name2] = ingred.split(' x ');
          namePairs.push({ name1, name2 });
        } else {
          nameEntries.push(ingred);
        }
      }

      if (nameEntries.length > 0) {
        specialRecipes[name] = nameEntries;
      } if (namePairs.length > 0) {
        specialPairRecipes[name] = namePairs;
      }

      if (demons[name].fusion === 'normal') {
        demons[name].fusion = 'special';
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.evolveData)) {
      const result = json['result'];

      demons[name].evolvesTo = {
        price: demons[result].price,
        race1: demons[result].race,
        lvl1:  json['lvl'],
        name1: result
      };

      demons[result].evolvesFrom = {
        price: demons[name].price,
        race1: demons[name].race,
        lvl1:  json['lvl'],
        name1: name
      };
    }

    for (const race of this.compConfig.races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;
    }

    for (const demon of Object.values(demons).sort((a, b) => a.currLvl - b.currLvl)) {
      if (demon.fusion !== 'enemy') {
        for (const name of Object.keys(demon.skills)) {
          skills[name].learnedBy.push({
            demon: demon.name,
            level: demon.skills[name]
          });
        }

        for (let i = 0; i < demon.ailments.length; i++) {
          if (ailmentResists[demon.ailments[i]]) {
            ailmentResists[demon.ailments[i]][i].learnedBy.push({ demon: demon.name, level: 0 });
          }
        }
      }
    }

    this._dlcDemons = this.compConfig.dlcDemons.reduce((acc, d) => { acc[d] = false; return acc }, {});
    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.specialPairRecipes = specialPairRecipes;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills = Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (!this.isElementDemon(name) && !this.isOverlappingResult(name)) {
        ingredients[demon.race].push(demon.lvl);
      }

      if (!this.specialRecipes.hasOwnProperty(name)) {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    for (const race of this.compConfig.races) {
      const currIngreds = ingredients[race];
      const currResults = results[race];
      const ingredsLen = currIngreds.length;
      const resultsLen = currResults.length;

      if (ingredsLen && resultsLen && currIngreds[ingredsLen - 1] !== currResults[resultsLen - 1]) {
        currResults.push(100);
      }
    }

    for (const [names, included] of Object.entries(this._dlcDemons)) {
      for (const ename of names.split(',')) {
        if (!this.demons[ename]) { continue; }

        if (!included) {
          const { race, lvl } = this.demons[ename];
          delete demonEntries[ename];

          ingredients[race] = ingredients[race].filter(l => l !== lvl);
          results[race] = results[race].filter(l => l !== lvl);
        }

        this.demons[ename].fusion = included ? 'special' : 'excluded';
      }
    }

    this._allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
    this._allSkills = skills.filter(skill => skill.rank < 99 || skill.learnedBy.length > 0);
    this.allIngredients = ingredients;
    this.allResults = results;
  }

  get dlcDemons(): { [name: string]: boolean } {
    return this._dlcDemons;
  }

  set dlcDemons(dlcDemons: { [name: string]: boolean }) {
    this._dlcDemons = dlcDemons;
    this.updateDerivedData();
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
    return this.specialRecipes[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return this.specialPairRecipes[name] || [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.demons[name].race === 'Element';
  }

  isOverlappingResult(name: string) {
    return false;
  }
}
