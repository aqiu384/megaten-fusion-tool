import { Races, ResistanceElements, SkillElements, BaseStats, Ailments, SkillElementOrder } from './constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import * as FUSION_REQUIREMENTS_JSON from '../data/fusion-requirements.json';

export class Compendium implements ICompendium {
  private static CONVERTED_RACE = [ 'Fiend', 'UMA', 'Enigma' ];

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
      demons[name] = Object.assign({ name, fusion: 'normal' }, json, {
        stats: BaseStats.map(val => json.stats[val]),
        resists: ResistanceElements.map(val => json.resists[val] || 'no'),
        ailments: Ailments.map(val => json.ailments && json.ailments.hasOwnProperty(val) ? json.ailments[val] : 'no'),
        skills: json.skills.reduce((acc, skill) => { acc[skill] = 0; return acc }, {}),
        source: json.source.reduce((acc, skill) => { acc[skill] = 0; return acc }, {}),
      });
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = Object.assign({
        name,
        power: 0,
        accuracy: 0,
        cost: 0,
        inherit: json.element,
        rank: 0,
        learnedBy: [],
        dsource: []
      }, json);
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      specialRecipes[name] = json;

      if (json === 'Password') {
        demons[name].prereq = 'Password only';
        demons[name].fusion = 'accident';
      } else if (json === 'Accident') {
        demons[name].prereq = 'Fusion accident only';
        demons[name].fusion = 'accident';
      } else {
        if (json.indexOf(',') < 0) {
          demons[name].fusion = 'special';
        }

        for (const recipe of json.split(', ')) {
          for (const ingredient of recipe.split(' x ')) {
            if (!invSpecs[ingredient]) {
              invSpecs[ingredient] = [];
            }

            invSpecs[ingredient].push({ result: name, recipe });
          }
        }
      }
    }

    for (const [name, json] of Object.entries(FUSION_REQUIREMENTS_JSON)) {
      fusionRequirements[name] = json;
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level: 0 });
      }

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].dsource.push(name);
      }
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
    return Object.keys(this.specialRecipes).map(name => this.demons[name]);
  }

  getDemon(name: string): Demon {
    return this.demons[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
    return skills;
  }

  getIngredientDemonLvls(race: string): number[] {
    return this.allIngredients[race] || [];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race] || [];
  }

  getSpecialNameEntries(name: string): string[] {
    const recipe = this.specialRecipes[name];
    const isSpecial = recipe && recipe !== 'Password' && recipe !== 'Accident' && recipe.indexOf(', ') === -1;
    return isSpecial ? recipe.split(' x ') : [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    const recipe = this.specialRecipes[name];
    const names: NamePair[] = [];

    if (recipe && recipe !== 'Password' && recipe !== 'Accident' && recipe.indexOf(', ') !== -1) {
      for (const pair of recipe.split(', ')) {
        const [ name1, name2 ] = pair.split(' x ');
        names.push({ name1, name2 });
      }
    }

    return names;
  }

  getFusionRequirements(name: string): string[] {
    const { race } = this.getDemon(name);
    const fusionReq = this.fusionRequirements[name];
    const reqs = [];

    if (fusionReq) {
      reqs.push(fusionReq);
    }
    if (Compendium.CONVERTED_RACE.indexOf(race) !== -1 && !this.specialRecipes.hasOwnProperty(name)) {
      reqs.push(`${race} Converter Subapp enabled`);
    }

    return reqs.length > 0 ? reqs : ['None'];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return this.invertedSpecials[ingredient] ? this.invertedSpecials[ingredient] : [];
  }

  isElementDemon(name: string) {
    return this.demons[name].race === 'Prime';
  }
}
