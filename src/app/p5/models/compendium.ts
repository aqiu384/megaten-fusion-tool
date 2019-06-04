import { Races, ElementOrder, ResistCodes } from './constants';
import { Demon, Enemy, Skill } from '../models';
import { Demon as BaseDemon, Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import PARTY_DATA_JSON from '../data/party-data.json';
import ENEMY_DATA_JSON from '../data/enemy-data.json';
import SUBBOSS_DATA_JSON from '../data/subboss-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import DLC_DEMONS from '../data/dlc-demons.json';
import INHERITANCE_TYPES from '../data/inheritance-types.json';

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
  private _inheritTypes: { [inherti: string]: boolean[] };

  constructor() {
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
    this._inheritTypes = {};

    for (const [name, json] of Object.entries(PARTY_DATA_JSON)) {
      json.race += ' P';
      json['item'] = '-';
      json['fusion'] = 'party';
      DEMON_DATA_JSON[name] = json;
    }

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = {
        name,
        item:    json.item,
        race:    json.race,
        lvl:     json.lvl,
        skills:  json.skills,
        price:   Math.pow(json.stats.reduce((acc, stat) => stat + acc, 0), 2) + 2000,
        stats:   json.stats,
        resists: json.resists.split('').map(char => ResistCodes[char]),
        fusion:  json['fusion'] || 'normal'
      };

      demons[name].inherit = json.inherits;
      delete demons[name].inherits;
    }

    for (const jsonfile of [ENEMY_DATA_JSON, SUBBOSS_DATA_JSON]) {
      for (const [name, enemy] of Object.entries(jsonfile)) {
        const drops = enemy['drops'] || [];

        if (enemy.card && enemy.card != '-') {
          drops.push(enemy.card);
        } if (!drops.length) {
          drops.push('-');
        }

        enemies[name] = {
          name,
          persona: enemy.persona,
          trait:   enemy.trait,
          exp:     enemy.exp,
          race:    enemy.race,
          lvl:     enemy.lvl,
          price:   enemy.yen,
          stats:   enemy.stats.slice(0, 2),
          estats:  enemy.stats.slice(2),
          resists: enemy.resists.split('').map(char => ResistCodes[char]),
          fusion:  'normal',
          skills:  (enemy.skills || []).reduce((acc, s) => { acc[s] = 0; return acc }, {}),
          area:    enemy.area.join(', '),
          drop:    drops.join(', '),
          isEnemy: true
        };
      }
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name,
        element: json.element,
        effect:  json.effect,
        rank:    json.cost / 100 || 0,
        cost:    json.cost || 0,
        talk:    json.talk || '',
        fuse:    json.fuse || '',
        learnedBy: [],
        level: 0
      };

      if (json.unique) {
        skills[name].rank = 99;
      }
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      const demon = demons[name];

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

    for (const race of Races) {
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

    for (const dlcDemon of Object.values(DLC_DEMONS)) {
      dlcDemons[dlcDemon] = false;
    }

    for (let i = 0; i < INHERITANCE_TYPES['inherits'].length; i++) {
      this._inheritTypes[INHERITANCE_TYPES['inherits'][i]] = INHERITANCE_TYPES['ratios'][i]
        .split('').map(char => char === 'O');
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

    for (const race of Races) {
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

    for (const race of Races) {
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

  get inheritHeaders(): string[] {
    return INHERITANCE_TYPES['elems'];
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

  getInheritElems(inheritType: string): boolean[] {
    return this._inheritTypes[inheritType];
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
