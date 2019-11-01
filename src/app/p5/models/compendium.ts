import { Demon, Enemy, Skill } from '../models';
import { Demon as BaseDemon, Compendium as ICompendium, NamePair } from '../../compendium/models';
import { CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Enemy };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private _dlcDemons: { [name: string]: boolean };
  private normalExceptions: { [name: string]: string };

  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: BaseDemon[];
  private _allSkills: Skill[];

  constructor(private compConfig: CompendiumConfig, private gameAbbr: string) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const enemies: { [name: string]: Enemy } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string [] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const dlcDemons: { [name: string]: boolean } = {};
    const normalExceptions: { [name: string]: string } = {};

    for (const demonDataJson of this.compConfig.demonData[this.gameAbbr]) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          item:    json['item'],
          race:    json['race'],
          lvl:     json['lvl'],
          skills:  json['skills'],
          price:   Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          stats:   json['stats'],
          resists: json['resists'].split('').map(char => this.compConfig.resistCodes[char]),
          fusion:  json['fusion'] || 'normal'
        };

        demons[name].inherit = json['inherits'];
      }
    }

    for (const enemyDataJson of this.compConfig.enemyData[this.gameAbbr]) {
      for (const [name, enemy] of Object.entries(enemyDataJson)) {
        const drops = enemy['drops'] || [];

        if (enemy['card'] && enemy['card'] != '-') {
          drops.push(enemy['card']);
        } if (!drops.length) {
          drops.push('-');
        }

        enemies[name] = {
          name,
          persona: enemy['persona'],
          trait:   enemy['trait'],
          exp:     enemy['exp'],
          race:    enemy['race'],
          lvl:     enemy['lvl'],
          price:   enemy['yen'],
          stats:   enemy['stats'].slice(0, 2),
          estats:  enemy['stats'].slice(2),
          resists: enemy['resists'].split('').map(char => this.compConfig.resistCodes[char]),
          fusion:  'normal',
          skills:  (enemy['skills'] || []).reduce((acc, s) => { acc[s] = 0; return acc }, {}),
          area:    enemy['area'].join(', '),
          drop:    drops.join(', '),
          isEnemy: true
        };
      }
    }

    for (const skillDataJson of this.compConfig.skillData[this.gameAbbr]) {
      for (const [name, json] of Object.entries(skillDataJson)) {
        skills[name] = {
          name,
          element: json['element'],
          effect:  json['effect'],
          rank:    json['cost'] / 100 || 0,
          cost:    json['cost'] || 0,
          talk:    json['talk'] || '',
          fuse:    json['fuse'] || '',
          learnedBy: [],
          level: 0
        };

        if (json['unique']) {
          skills[name].rank = 99;
        }
      }
    }

    if (this.gameAbbr === 'p5r') {
      for (const [name, json] of Object.entries(this.compConfig.traitData)) {
        const ename = json['ename'];

        skills[ename] = {
          name: ename,
          element: 'trait',
          effect: json['edesc'],
          rank: 0,
          cost: 0,
          talk: '',
          fuse: '',
          learnedBy: json['demons'],
          level: 0
        };

        for (const demon of json['demons']) {
          if (demons[demon]) {
            demons[demon].skills[ename] = 99;
          }
        }
      }
    }

    for (const [name, recipe] of Object.entries(this.compConfig.specialRecipes[this.gameAbbr])) {
      const demon = demons[name];
      const json = <string[]>recipe;

      demon.fusion = 'special';
      specialRecipes[name] = json;

      if (json.length === 2) {
        normalExceptions[json[0]] = json[1];
        normalExceptions[json[1]] = json[0];
      }

      if (json.length === 0) {
        demon.prereq = 'Recruitment only';
        demon.fusion = 'recruit';
      }
    }

    for (const race of this.compConfig.races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      if (demon.fusion !== 'party') {
        inversions[demon.race][demon.lvl] = name;
      }
    }

    for (const demon of Object.values(demons)) {
      for (const name of Object.keys(demon.skills)) {
        skills[name].learnedBy.push({
          demon: demon.name,
          level: demon.skills[name]
        });
      }
    }

    for (const dlcDemon of this.compConfig.dlcDemons[this.gameAbbr]) {
      dlcDemons[dlcDemon] = false;
    }

    this.demons = demons;
    this.enemies = enemies;
    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.invertedDemons = inversions;
    this._dlcDemons = dlcDemons;
    this.normalExceptions = normalExceptions;
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
      if (demon.fusion !== 'party') {
        if (!this.isElementDemon(name)) {
          ingredients[demon.race].push(demon.lvl);
        }

        if (!this.specialRecipes.hasOwnProperty(name)) {
          results[demon.race].push(demon.lvl);
        }
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

    const allies = Object.keys(demonEntries).map(name => <BaseDemon>demonEntries[name]);
    const enemies = Object.keys(this.enemies).map(name => <BaseDemon>this.enemies[name]);
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

  get allDemons(): BaseDemon[] {
    return this._allDemons;
  }

  get allSkills(): Skill[] {
    return this._allSkills;
  }

  get specialDemons(): Demon[] {
    return Object.keys(this.specialRecipes)
      .filter(name => !this.isElementDemon(name))
      .map(name => this.demons[name]);
  }

  getDemon(name: string): BaseDemon {
    return this.demons[name] || this.enemies[name];
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

    retSkills.sort((d1, d2) =>
      (d1.level - d2.level) * 100 +
      this.compConfig.elemOrder[d1.element] -
      this.compConfig.elemOrder[d2.element]
    );

    return retSkills;
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

  getElementDemons(name: string) {
    return Object.keys(this.specialRecipes).filter(demon => this.isElementDemon(demon) && demon !== name);
  }

  getNormalException(name: string): string {
    return this.normalExceptions[name];
  }

  getInheritElems(inheritType: string): number[] {
    return this.compConfig.inheritTypes[inheritType];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.specialRecipes.hasOwnProperty(name) && this.specialRecipes[name].length === 0;
  }

  isRecruitmentOnly(name: string) {
    return this.isElementDemon(name);
  }

  isExcludedDemon(name: string) {
    const { race, lvl } = this.getDemon(name);
    return this.allIngredients[race].indexOf(lvl) === -1;
  }
}
