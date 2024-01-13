import { Demon, Skill, CompendiumConfig } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private pairRecipes: { [name: string]: NamePair[] } = {};
  private entryRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  estimateKuzuPrice(stats: number[]): number {
    return Math.floor(Math.pow(stats.slice(stats.length - 4).reduce((acc, stat) => stat + acc, 0), 2) / 20);
  }

  estimateDesuPrice(stats: number[]): number {
    const x = stats.slice(stats.length - 4).reduce((acc, stat) => stat + acc, 0);
    return Math.floor(((-0.01171 * x + 5.0625) * x - 129) * x) + 1115;
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const pairRecipes: { [name: string]: NamePair[] } = {};
    const entryRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const isDesu = this.compConfig.isDesu;
    const resistCodes: { [code: string]: number } = {};

    for (const [res, code] of Object.entries(this.compConfig.resistCodes)) {
      resistCodes[res] = ((code / 1000 | 0) << 10) + (code % 1000 / 2.5 | 0);
    }

    for (const dataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(dataJson)) {
        demons[name] = {
          name: name,
          race: json['race'],
          lvl: json['lvl'],
          currLvl: json['lvl'],
          price: isDesu ? this.estimateDesuPrice(json['stats']) : 100 * (this.estimateKuzuPrice(json['stats']) + json['lvl']),
          inherits: 0,
          stats: json['stats'],
          resists: (json['nresists'] || json['resists']).split('').map(x => resistCodes[x]),
          skills: json['nskills'] || json['skills'],
          person: json['person'] || '',
          fusion: 'normal',
          prereq:  json['prereq'] || ''
        };
      }
    }

    for (const dataJson of this.compConfig.skillData) {
      for (const [name, json] of Object.entries(dataJson)) {
        skills[name] = {
          name: name,
          rank: json['rank'] || (json['cost'] & 0x3FF) / 10 || 0,
          cost: json['cost'] || 0,
          effect: json['effect'] || '',
          target: json['prereq'] || json['target'] || 'Self',
          element: json['elem'],
          learnedBy: [],
          level: 0
        };
      }
    }

    for (const race of this.compConfig.races) {
      inversions[race] = {};
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      inversions[demon.race][demon.lvl] = demon.name;

      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: demon.name, level: lvl });
      }
    }

    for (const [name, recipe] of Object.entries(this.compConfig.specialRecipes)) {
      const recipeList = <string[]>recipe;
      const entryList: string[] = [];
      const pairList: NamePair[] = [];
      const entry = demons[name];

      entry.fusion = recipeList.length > 1 ? 'special' : 'accident';
      entryRecipes[name] = entryList;
      pairRecipes[name] = pairList;

      for (const ingred of recipeList) {
        if (ingred.includes(' x ')) {
          const [name1, name2] = ingred.split(' x ');
          pairList.push({ name1, name2 });
          entry.fusion = 'special';
        } else {
          entryList.push(ingred);
        }
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.pairRecipes = pairRecipes;
    this.entryRecipes = entryRecipes;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const skills = Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (!this.isElementDemon(name)) {
        ingredients[demon.race].push(demon.lvl);
      }

      if (!this.pairRecipes[name] && !this.entryRecipes[name]) {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const race of this.compConfig.races) {
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
    skills.sort((d1, d2) => (
      this.compConfig.elemOrder[d1.element] -
      this.compConfig.elemOrder[d2.element]) * 10000 + d1.rank - d2.rank
    );
    return skills;
  }

  getIngredientDemonLvls(race: string): number[] {
    return this.allIngredients[race] || [];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race] || [];
  }

  getSpecialNameEntries(name: string): string[] {
    return this.entryRecipes[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return this.pairRecipes[name] || [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string): boolean {
    return this.compConfig.elementTable.elems.indexOf(name) !== -1;
  }

  updateFusionSettings(config: { [setting: string]: boolean; }) { }
}
