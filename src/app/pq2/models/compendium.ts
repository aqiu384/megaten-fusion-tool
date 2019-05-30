import { Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];
  private _dlcDemons: { [name: string]: boolean };

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons:   { [name: string]: Demon } = {};
    const enemies:  { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};

    this._dlcDemons = {}

    if (this.compConfig.dlcData) {
      Object.assign(this.compConfig.demonData, this.compConfig.dlcData);
      for (const name of Object.keys(this.compConfig.dlcData)) {
        this._dlcDemons[name] = false;
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.demonData)) {
      demons[name] = {
        name,
        race:     json['race'],
        lvl:      json['lvl'],
        price:    json['lvl'] * json['lvl'] * 100,
        stats:    json['stats'].slice(0, 2),
        skills:   json['skills'],
        resists:  [],
        inherit:  json['inherit'],
        code:     json['code'] || 0,
        fusion:   json['fusion'] || 'normal'
      };
    }

    for (const [name, json] of Object.entries(this.compConfig.enemyData)) {
      enemies[name] = {
        name,
        race:     json['race'],
        lvl:      json['lvl'],
        price:    0,
        stats:    json['stats'],
        resists:  json['resists'].split('').map(char => this.compConfig.resistCodes[char]),
        skills:   json['skills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {}),
        area:     json['area'],
        drop:     json['drops'].join(', '),
        code:     0,
        fusion:   'normal',
        isEnemy:  true
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.specialRecipes)) {
      specials[name] = <string[]>json;
      demons[name].fusion = 'special';
    }

    for (const [name, json] of Object.entries(this.compConfig.skillData)) {
      skills[name] = {
        name,
        element:   json['elem'],
        cost:      json['cost'] || 0,
        rank:      json['unique'] ? 91 : json['cost'] / 100 || 1,
        effect:    json['effect'],
        target:    json['target'] || 'Self',
        learnedBy: [],
        fuse:      json['card'] || '',
        code:      json['code'] || 0,
        level:     0
      };
    }

    for (const race of this.compConfig.races) {
      inverses[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inverses[demon.race][demon.lvl] = name;

      for (const [skill, level] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level });
      }
    }

    this.demons = demons;
    this.enemies = enemies;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills:        Skill[] = [];
    const ingredients:   { [race: string]: number[] } = {};
    const results:       { [race: string]: number[] } = {};

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
      ingredients[demon.race].push(demon.lvl);

      if (!this.specialRecipes.hasOwnProperty(name)) {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    for (const [names, included] of Object.entries(this._dlcDemons)) {
      for (const name of names.split(',')) {
        if (!included) {
          const { race, lvl } = this.demons[name];
          delete demonEntries[name];

          ingredients[race] = ingredients[race].filter(l => l !== lvl);
          results[race] = results[race].filter(l => l !== lvl);
        }

        this.demons[name].fusion = included ? 'normal' : 'excluded';
      }
    }

    const allies = Object.keys(demonEntries).map(name => <Demon>demonEntries[name]);
    const enemies = Object.keys(this.enemies).map(name => <Demon>this.enemies[name]);
    this._allDemons = enemies.concat(allies);
    this._allSkills = skills;
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
    return this.demons[name] || this.enemies[name];
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
