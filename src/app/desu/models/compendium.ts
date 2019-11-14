import { ElementOrder, Races, ResistCodes } from '../constants';
import { Demon, Skill, RacialSkill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import RACIAL_SKILLS_JSON from '../data/racial-skills.json';

export class DesuCompendium implements ICompendium {
  static readonly MITAMA_FUSIONS: { [mitama: string]: NamePair[] } = {
    'Ara Mitama': [ { name1: 'Erthys', name2: 'Aquans' }, { name1: 'Aeros', name2: 'Flaemis' } ],
    'Kusi Mitama': [ { name1: 'Erthys', name2: 'Flaemis' }, { name1: 'Aeros', name2: 'Aquans' } ],
    'Nigi Mitama': [ { name1: 'Erthys', name2: 'Aeros' } ],
    'Saki Mitama': [ { name1: 'Aquans', name2: 'Flaemis' } ]
  };

  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private racialSkills: { [race: string]: RacialSkill } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  private _dlcDemons: { [name: string]: boolean } = {};

  static estimateBasePrice(stats: number[]): number {
    const x = stats.slice(2).reduce((acc, stat) => stat + acc, 0);
    return Math.floor(((-0.01171 * x + 5.0625) * x - 129) * x) + 1115;
  }

  constructor(demonDataJsons: any[], skillDataJsons: any[], specialRecipesJsons: any[], dlcDemons: any) {
    this.initImportedData(demonDataJsons, skillDataJsons, specialRecipesJsons, dlcDemons);
    this.updateDerivedData();
  }

  initImportedData(demonDataJsons: any[], skillDataJsons: any[], specialRecipesJsons: any[], dlcDemons: any) {
    const demons:   { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const racials: { [race: string]: RacialSkill } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};

    for (const [race, json] of Object.entries(RACIAL_SKILLS_JSON)) {
      racials[race] = {
        skill:    json.skill,
        effect:   json.effect,
        enskill:  json.enskill || '',
        eneffect: json.eneffect || ''
      }
    }

    for (const demonData of demonDataJsons) {
      for (const [name, json] of Object.entries(demonData)) {
        demons[name] = {
          name,
          race:    json['race'],
          lvl:     json['lvl'],
          stats:   json['stats'],
          price:   DesuCompendium.estimateBasePrice(json['stats']),
          resists: json['resists'].split('').map(char => ResistCodes[char]),
          skills:  {},
          command: json['command'] || {},
          passive: json['passive'] || {},
          fusion:  'normal',
          unique:  json['unique'] === true,
          raceup:  json['raceup'] || 0
        };

        const racialSkill = racials[json['race']] || racials[name];

        if (racialSkill) {
          demons[name].racial = racialSkill;
        }

        if (json['raceup']) {
          demons[name].raceup = json['raceup'];
        }
      }
    }

    for (const skillData of skillDataJsons) {
      for (const [name, json] of Object.entries(skillData)) {
        skills[name] = {
          name,
          element:   json['element'],
          cost:      json['cost'] || 0,
          rank:      json['rank'] || 99,
          effect:    json['effect'],
          transfer:  [{ demon: json['prereq'] || '', level: -100 }],
          learnedBy: [],
          level:     0
        };

        if (skills[name].element === 'auto') {
          skills[name].rank = 0;
        }
      }
    }

    for (const specialRecipes of specialRecipesJsons) {
      for (const [name, json] of Object.entries(specialRecipes)) {
        specials[name] = specialRecipes[name];
        demons[name].fusion = 'special';
      }
    }

    for (const race of Races) {
      inverses[race] = {};
    }

    for (const [name, demon] of Object.entries(demons)) {
      inverses[demon.race][demon.lvl] = name;

      for (const [skill, level] of Object.entries(demon.command).concat(Object.entries(demon.passive))) {
        skills[skill].learnedBy.push({ demon: name, level });
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.dlcDemons = Object.assign({}, dlcDemons);
    this.racialSkills = racials;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills =       Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients:   { [race: string]: number[] } = {};
    const results:       { [race: string]: number[] } = {};

    for (const race of Races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      ingredients[demon.race].push(demon.lvl);

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
    return this.specialRecipes[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return DesuCompendium.MITAMA_FUSIONS[name] || [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return [];
  }

  isElementDemon(name: string): boolean {
    return this.demons[name].race === 'Element';
  }
}
