import { Races, ResistanceElements, ShortElements, InverseShortElements, BaseStats, ElementOrder, Ailments } from '../models/constants';
import { FusionTypes } from '../../compendium/constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium } from '../../compendium/models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import * as DLC_DEMONS from '../data/dlc-demons.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private _dlcDemons: { [name: string]: boolean };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private allDemons: Demon[];
  private allSkills: Skill[];

  constructor() {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const dlcDemons: { [name: string]: boolean } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = Object.assign({ name, fusion: FusionTypes.Normal }, json, {
        stats: BaseStats.map((val, i) => json.stats[i]),
        resists: ResistanceElements.map(val => json.resists[ShortElements[val]] || 'no'),
        ailments: Ailments.map(val => json.ailments && json.ailments.hasOwnProperty(val) ? json.ailments[val] : 'no'),
      });
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = Object.assign({
        name,
        cost: 0,
        learnedBy: [],
      }, json);

      skills[name].element = InverseShortElements[skills[name].element];

      if (skills[name].rank < 0) {
        skills[name].rank = 99;
      }
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      if (json.length !== 1) {
        specialRecipes[name] = json;
        demons[name].fusion = (json.length > 0) ? FusionTypes.Special : FusionTypes.Accident;
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
      if (!this.isElementDemon(name) && !this.isOverlappingResult(name)) {
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
      if (!included) {
        for (const name of names.split(',')) {
          const { race, lvl } = this.demons[name];
          delete demonEntries[name];

          ingredients[race] = ingredients[race].filter(l => l !== lvl);
          results[race] = results[race].filter(l => l !== lvl);
        }
      }
    }

    this.allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
    this.allSkills = skills;
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

  getAllDemons(): Demon[] {
    return this.allDemons;
  }

  getAllSkills(): Skill[] {
    return this.allSkills;
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
    return this.allIngredients[race];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race];
  }

  getSpecialFusionIngredients(name: string): string[] {
    return this.specialRecipes[name] ? this.specialRecipes[name] : [];
  }

  getSpecialFusionResults(): string[] {
    return Object.keys(this.specialRecipes).filter(name => !this.isElementDemon(name));
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.demons[name].race === 'Element';
  }

  isOverlappingResult(name: string) {
    return false;
  }
}
