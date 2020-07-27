import { Demon as BaseDemon, Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';
import { JsonPipe } from '@angular/common';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: BaseDemon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: BaseDemon[];
  private _allSkills: Skill[];
  private _inheritTypes: { [inherti: string]: number[] };

  dlcDemons: { [name: string]: boolean } = {};

  constructor(private compConfig: CompendiumConfig, private gameAbbr: string) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons:   { [name: string]: Demon } = {};
    const enemies:  { [name: string]: BaseDemon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};
    this._inheritTypes = {};

    for (const demonDataJson of this.compConfig.demonData[this.gameAbbr]) {
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

    for (const enemyDataJson of this.compConfig.enemyData[this.gameAbbr]) {
      for (const [name, enemy] of Object.entries(enemyDataJson)) {
        let drops = []
        
        if (enemy['material'] && enemy['material'] !== '-') {
          drops.push(enemy['material']);
        } if (enemy['gem'] && enemy['gem'] !== '-') {
          drops.push(enemy['gem']);
        } if (enemy['drops']) {
          drops = drops.concat(enemy['drops']);
        } if (!drops.length) {
          drops.push('-');
        }

        enemies[name] = {
          name,
          race:    enemy['race'],
          lvl:     enemy['lvl'],
          price:   0,
          stats:   enemy['stats'].slice(0, 2),
          estats:  enemy['stats'].slice(2),
          resists: enemy['resists'].toLowerCase().split('').map(char => this.compConfig.resistCodes[char]),
          skills:  enemy['skills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {}),
          fusion:  'normal',
          area:    enemy['area'],
          drop:    drops.join(', '),
          isEnemy: true
        };
      }
    }

    for (const skillData of this.compConfig.skillData[this.gameAbbr]) {
      for (const [name, json] of Object.entries(skillData)) {
        const power = json['power'] || 0;
        const damage = json['damage'];
        const target = json['target'] || '';
        const beffect = json['effect'];
        let effect = json['effect'];

        if (power) {
          effect = power ? damage + ' (' + power.toString() + ') dmg' : '';
          effect += target ? ' to ' + target.toLowerCase() : '';
          effect += beffect ? ', ' + beffect : '';
        } else if (target) {
          effect += (json['element'] === 'support' ? ' for ' : ' to ') + target.toLowerCase();
        }

        skills[name] = {
          name,
          element:   json['element'],
          cost:      json['cost'] || 0,
          rank:      json['rank'] || 99,
          effect:    effect,
          learnedBy: [],
          transfer:  [],
          level:     0
        };

        if (json['card']) {
          skills[name].transfer = json['card'].split(', ').map(d => ({ demon: d, level: demons[d] ? 0 : -100 }));
        }
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.specialRecipes[this.gameAbbr])) {
      specials[name] = <string[]>json;
      demons[name].fusion = 'special';
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
    this.enemies = enemies;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
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

    const allies = Object.keys(this.demons).map(name => this.demons[name]);
    const enemies = Object.keys(this.enemies).map(name => this.enemies[name]);
    this._allDemons = enemies.concat(allies);
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
}
