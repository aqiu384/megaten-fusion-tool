import { Races, BaseStats, ElementOrder } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES from '../data/special-recipes.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private invertedSpecials: { [name: string]: { result: string, recipe: string }[] };
  private fusionRequirements: { [name: string]: string };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  constructor() {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string } = {};
    const fusionRequirements: { [name: string]: string } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const invSpecs: { [name: string]: { result: string, recipe: string }[] } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      if (json.order) {
        demons[name] = {
          name: name,
          race: json.order,
          lvl: json.lvl,
          stats: json.stats,
          resists: json.resists,
          skills: json.skills,
          person: json.person,
          fusion: 'normal',
          confine: json.fusable ? false : true
        };
      }
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name: name,
        rank: json.cost ? json.cost / 100 : 0,
        cost: json.cost ? json.cost : 0,
        effect: json.effect,
        target: json.target,
        element: json.elem,
        learnedBy: [],
        level: 0
      };
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level: lvl });
      }
    }

    for (const [name, ingreds] of Object.entries(SPECIAL_RECIPES)) {
      specialRecipes[name] = 'None';
      demons[name].fusion = 'accident';
      demons[name].prereq = 'Fusion accident only';
    }

    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.fusionRequirements = fusionRequirements;
    this.invertedDemons = inversions;
    this.invertedSpecials = invSpecs;
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

    this._allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
    this._allSkills = skills;
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
    return [];
  }

  getDemon(name: string): Demon {
    return this.demons[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
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
