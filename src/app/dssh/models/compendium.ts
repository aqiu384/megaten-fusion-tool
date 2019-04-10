import { Races, BaseStats, ElementDemons, ElementOrder } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair, SpecialRecipe } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import NEMECHI_DATA_JSON from '../data/nemechi-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import SPECIAL_RECIPES from '../data/special-recipes.json';
import INHERIT_SKILLS from '../data/inherit-skills.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: SpecialRecipe };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private invertedSpecials: { [name: string]: { result: string, recipe: string }[] };
  private _dlcDemons: { [name: string]: boolean };
  private _inheritSkills: { [inherit: string]: string[] };

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
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    this._dlcDemons = {};
    this._inheritSkills = {};

    for (const demon of Object.keys(NEMECHI_DATA_JSON)) {
      this._dlcDemons[demon] = false;
    }

    for (const [inherit, skillz] of Object.entries(INHERIT_SKILLS)) {
      this._inheritSkills[inherit] = skillz;
    }

    for (const demonsJson of [ DEMON_DATA_JSON, NEMECHI_DATA_JSON ]) {
      for (const [name, json] of Object.entries(demonsJson)) {
        demons[name] = {
          name: name,
          race: json.race,
          lvl: json.lvl,
          price: 100 * (Math.floor(Math.pow(json.stats.slice(2).reduce((acc, stat) => stat + acc, 0), 2) / 20)),
          atks: json.atks,
          inherit: json.inherit,
          stats: json.stats,
          resists: json.resists,
          skills: json.skills.reduce((acc, skill) => { acc[skill] = 0; return acc; }, {}),
          person: json.person,
          fusion: 'normal',
        };
      }
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name: name,
        rank: json.cost ? json.cost / 100 : 0,
        cost: json.cost ? json.cost : 0,
        effect: json.effect,
        element: json.elem,
        power: json.power ? json.power : 0,
        learnedBy: [],
        level: 0
      };

      if (json.hasOwnProperty('unique')) {
        skills[name].rank += (json.unique ? 90 : 70);
      }
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inversions[demon.race][demon.lvl] = name;

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level: 0 });
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.invertedDemons = inversions;
    this.specialRecipes = {};
    this.initSpecialRecipes();
  }

  initSpecialRecipes() {
    const enigmaIngreds: string[] = [];
    const umaIngreds: string[] = [];

    for (const [name, recipeJson] of Object.entries(SPECIAL_RECIPES)) {
      const recipe: SpecialRecipe = {};
      const { cond: prereq, spec: ingreds, pair: pairs } = recipeJson;

      if (prereq || !ingreds || pairs) {
        this.specialRecipes[name] = recipe;
      }

      if (prereq) {
        this.demons[name].prereq = prereq;
      } if (prereq && ingreds) {
        this.demons[name].fusion = 'special';
        recipe.ingreds = ingreds;
      } if (pairs) {
        recipe.pairs = pairs.map(pair => {
          const [name1, name2] = pair.split(' x ');
          return { name1, name2 };
        });
      }
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      switch (demon.race) {
        case 'Deity':
        case 'Megami':
          enigmaIngreds.push(name);
          break;
        case 'Avatar':
        case 'Holy':
        case 'Beast':
        case 'Wilder':
          umaIngreds.push(name);
          break;
        case 'Mitama':
          demon.fusion = 'special';
          if (this.specialRecipes[name].ingreds) {
            demon.prereq = 'Perform triple fusion using one of the following ingredients and pairs';
          } break;
        case 'Entity':
          demon.fusion = 'special';
          demon.prereq = 'Perform fusion during new moon';
          break;
        case 'Zealot':
          demon.fusion = 'special';
          demon.prereq = 'Perform fusion during full moon';
          break;
        case 'Enigma':
          demon.fusion = 'accident';
          demon.prereq = 'Trigger fusion accident using one of the following ingredients during new moon';
          this.specialRecipes[name] = { ingreds: enigmaIngreds };
          break;
        case 'UMA':
          demon.fusion = 'accident';
          demon.prereq = 'Trigger fusion accident using one of the following ingredients during full moon';
          this.specialRecipes[name] = { ingreds: umaIngreds };
          break;
        case 'Rumor':
          demon.fusion = 'accident';
          demon.prereq = 'Recruitment Only';
          break;
        case 'Hero':
          demon.prereq = `Fuse one of the following ingredients with at least Lvl ${demon.prereq} Zeed`;
          break;
        case 'General':
          demon.prereq = `Fuse one of the following ingredients with at least Lvl ${demon.prereq} Zeed during new moon`;
          break;
        case 'Ranger':
          demon.fusion = 'accident';
          if (!demon.prereq) {
            demon.prereq = 'Purchase only';
          } break;
        default:
          break;
      }
    }

    enigmaIngreds.sort();
    umaIngreds.sort();
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
    const recipe = this.specialRecipes[name];
    return recipe && recipe.ingreds ? recipe.ingreds : [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    const recipe = this.specialRecipes[name];
    return recipe && recipe.pairs ? recipe.pairs : [];
  }

  getInheritSkills(inherit: string): { [skill: string]: number } {
    const skills = this._inheritSkills[inherit];
    return skills ? skills.reduce((acc, s) => { acc[s] = 0; return acc; }, {}) : {};
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return [];
  }

  isElementDemon(name: string): boolean {
    return ElementDemons.indexOf(name) !== -1;
  }
}
