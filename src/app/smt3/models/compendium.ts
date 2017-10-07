import { Races, ResistanceElements, SpecialResistances, BaseStats, ElementOrder } from '../models/constants';
import { Demon, Skill, SpecialRecipe } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: SpecialRecipe };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private _dlcDemons: { [name: string]: boolean };

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
    const specialRecipes: { [name: string]: SpecialRecipe } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const dlcDemons: { [name: string]: boolean } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = Object.assign({ name, fusion: 'normal' }, json, {
        stats: BaseStats.map((val, i) => json.stats[i]),
        resists: ResistanceElements.map(val => 'no')
      });

      for (const [special, elements] of Object.entries(SpecialResistances)) {
        if (json.resists.hasOwnProperty(special)) {
          for (const element of elements) {
            demons[name].resists[ElementOrder[element]] = json.resists[special];
          }
        }
      }

      for (const [element, resistance] of Object.entries(json.resists)) {
        demons[name].resists[ElementOrder[element]] = resistance;
      }
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = Object.assign({
        name,
        cost: 0,
        learnedBy: [],
        requires: ''
      }, json);

      if (!skills[name].rank) {
        skills[name].rank = 99;
      }
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      const demon = demons[name];
      const recipe = {
        pair: json.nor,
        entry: json.spe,
        lvl: json.lvl
      };

      specialRecipes[name] = recipe;
      demon.fusion = 'special';

      if (recipe.entry === 'Recruit') {
        demon.prereq = 'Recruitment only';
        demon.fusion = 'evolve';
      } else if (recipe.lvl && !demons.hasOwnProperty(recipe.entry)) {
        demon.prereq = `Fuse one of the following ingredients with a Deathstone at Kagatsuchi phase ${recipe.lvl}`;
      } else if (recipe.entry && recipe.pair) {
        demon.prereq = 'Fuse one of the following combos and sacrifice one of the following ingredients at Full Kagatsuchi';
      } else if (recipe.lvl) {
        demon.prereq = 'Evolve from one of the following ingredients';
        demon.fusion = 'evolve';
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
    return Object.keys(this.specialRecipes).map(name => this.demons[name]);
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
    const recipe = this.specialRecipes[name] || {};
    const entries: string[] = [];

    if (recipe.lvl && this.getDemon(recipe.entry)) {
      entries.push(recipe.entry);
    } else if (recipe.entry && !this.getDemon(recipe.entry)) {
      for (const lvl of this.getResultDemonLvls(recipe.entry)) {
        entries.push(this.reverseLookupDemon(recipe.entry, lvl));
      }
    } else if (recipe.entry) {
      entries.push(recipe.entry);
    }

    return entries;
  }

  getSpecialNamePairs(name: string): NamePair[] {
    const recipe = this.specialRecipes[name] || {};
    const pairs: NamePair[] = [];

    if (recipe.pair && recipe.pair.indexOf(', ') !== -1) {
      for (const pair of recipe.pair.split(', ')) {
        const [ name1, name2 ] = pair.split(' x ');
        pairs.push({ name1, name2 });
      }
    } else if (recipe.pair && recipe.pair.indexOf(' x ') === -1) {
      pairs.push({ name1: recipe.pair, name2: recipe.pair });
    } else if (recipe.pair) {
      const [name1, name2 ] = recipe.pair.split(' x ');
      pairs.push({ name1, name2 });
    }

    return pairs;
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
