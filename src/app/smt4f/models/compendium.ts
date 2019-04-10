import { Races, ResistanceElements, AffinityElements, BaseStats, ElementOrder, ResistCodes } from '../../smt4/models/constants';
import { Ailments } from '../models/constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import EVOLUTION_DATA_JSON from '../data/evolutions.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private _dlcDemons: { [name: string]: boolean } = {
    'Cleopatra': false,
    'Mephisto': false
  };

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
    const specialRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      demons[name] = Object.assign({ name, fusion: 'normal' }, json, {
        price: json.price * 2,
        stats: json.stats,
        resists: json.resists.split('').map(char => ResistCodes[char]),
        affinities: AffinityElements.map(val => json.affinities[val] ? json.affinities[val] : 0),
        ailments: json.ailments ?
          json.ailments.split('').map(char => ResistCodes[char]) :
          [ 100, 100, 100, 100, 100, 100, 100, 100 ]
      });
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name,
        element: json['element'],
        rank:    json['rank'],
        effect:  json['effect'],
        damage:  json['damage'] || '',
        target:  json['target'] || '',
        hits:    json['hits'] || '',
        cost:    json['cost'] || 0,
        learnedBy: [],
        level: 0
      };

      if (!skills[name].rank) {
        skills[name].rank = 99;
      }
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      if (json.length > 1) {
        specialRecipes[name] = json;
        demons[name].fusion = 'special';
      } else if (json.length === 0) {
        specialRecipes[name] = json;
        demons[name].fusion = 'accident';
        demons[name].prereq = 'Fusion accident only';
      }
    }

    for (const [name, { lvl, result }] of Object.entries(EVOLUTION_DATA_JSON)) {
      demons[name].evolvesTo = {
        price: demons[result].price,
        race1: demons[result].race,
        lvl1:  lvl,
        name1: result
      };

      demons[result].evolvesFrom = {
        price: demons[name].price,
        race1: demons[name].race,
        lvl1:  lvl,
        name1: name
      };
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

  isElementDemon(name: string) {
    return this.demons[name].race === 'Element';
  }

  isOverlappingResult(name: string) {
    return false;
  }
}
