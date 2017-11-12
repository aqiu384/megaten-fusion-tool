import { Races, ResistanceElements, BaseStats, ElementOrder, ResistCodes } from './constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import * as DLC_DEMONS from '../data/dlc-demons.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private _dlcDemons: { [name: string]: boolean };
  private normalExceptions: { [name: string]: string };

  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  constructor() {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string [] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const dlcDemons: { [name: string]: boolean } = {};
    const normalExceptions: { [name: string]: string } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = Object.assign({}, json, {
        name,
        stats:   json.stats,
        resists: json.resists.split('').map(char => ResistCodes[char]),
        fusion: 'normal'
      });

      demons[name].inherit = json.inherits;
      delete demons[name].inherits;
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = Object.assign(json, {
        name,
        rank: json.cost / 100 || 0,
        cost: json.cost || 0,
        learnedBy: [],
        talk: json.talk ? json.talk.split(', ') : [],
        fuse: json.fuse ? json.fuse.split(', ') : []
      });

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
      inversions[demon.race][demon.lvl] = name;
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

    this.demons = demons;
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
      if (!this.isElementDemon(name)) {
        ingredients[demon.race].push(demon.lvl);
      }

      if (!this.specialRecipes.hasOwnProperty(name)) {
        results[demon.race].push(demon.lvl);
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

    this._allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
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
    return Object.keys(this.specialRecipes)
      .filter(name => !this.isElementDemon(name))
      .map(name => this.demons[name]);
  }

  getDemon(name: string): Demon {
    return this.demons[name];
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
