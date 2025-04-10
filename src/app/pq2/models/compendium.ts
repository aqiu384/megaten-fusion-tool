import { Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';
import { Toggles } from '../../compendium/models/fusion-settings';

type NumDict = { [name: string]: number };

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  constructor(private compConfig: CompendiumConfig, demonToggles: Toggles) {
    this.initImportedData();
    this.updateDerivedData(demonToggles);
  }

  initImportedData() {
    const demons:   { [name: string]: Demon } = {};
    const enemies:  { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};
    const resistCodes: NumDict = {};

    for (const [res, code] of Object.entries(this.compConfig.resistCodes)) {
      resistCodes[res] = ((code / 10000 | 0) << 10) + (code % 10000 / 2.5 | 0);
    }

    const blankResists = '-'.repeat(this.compConfig.resistElems.length);
    const blankAilments = '-'.repeat(this.compConfig.ailmentElems.length);
    const codifyResists = (x: string) => (x || blankResists).split('').map(y => resistCodes[y]);
    const codifyAilments = (x: string) => (x || blankAilments).split('').map(y => resistCodes[y]);
    const hasDemonResists = this.compConfig.hasDemonResists;

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        const baseSkills = Object.values(json['skills']).reduce<number>((acc, lvl) => lvl === 0 ? acc + 1 : acc, 0);
        const price = Math.floor((800 + 120 * json['lvl']) * (1 + 0.25 * baseSkills) / 10) * 10;

        demons[name] = {
          name,
          race:     json['race'],
          lvl:      json['lvl'],
          currLvl:  json['lvl'],
          price:    json['price'] || price,
          inherits: this.compConfig.inheritTypes[json['inherit'] || json['inherits']],
          stats:    json['stats'],
          skills:   json['skills'],
          resists:  hasDemonResists ? codifyResists(json['resists']) : [],
          ailments: hasDemonResists ? codifyAilments(json['ailments']) : [],
          code:     json['code'] || 0,
          fusion:   json['fusion'] || 'normal',
          prereq:   json['prereq'] || ''
        };
      }
    }

    for (const enemyDataJson of this.compConfig.enemyData) {
      for (const [name, json] of Object.entries(enemyDataJson)) {
        enemies[name] = {
          name,
          race:     json['race'],
          lvl:      json['lvl'],
          currLvl:  json['lvl'],
          price:    0,
          inherits: 0,
          stats:    json['stats'],
          resists:  codifyResists(json['resists']),
          ailments: codifyAilments(json['ailments']),
          skills:   json['skills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {}),
          area:     json['area'],
          drop:     json['drops']?.join(', ') || '-',
          code:     0,
          fusion:   'normal',
          isEnemy:  true
        }
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.specialRecipes)) {
      specials[name] = <string[]>json;
      demons[name].fusion = 'special';
    }

    for (const skillDataJson of this.compConfig.skillData) {
      for (const [name, json] of Object.entries(skillDataJson)) {
        skills[name] = {
          name,
          element:   json['elem'] || json['element'],
          cost:      json['cost'] || 0,
          rank:      json['unique'] ? 99 : json['rank'] || (json['cost'] & 0x3FF) / 100 || 1,
          effect:    json['effect'],
          target:    json['target'] || 'Self',
          learnedBy: [],
          transfer:  [],
          code:      json['code'] || 0,
          level:     0
        };

        if (json['card']) {
          skills[name].transfer = json['card'].split(', ').map(d => ({ demon: d, level: -100 }));
        }
      }
    }

    for (const race of this.compConfig.races) {
      inverses[race] = {};
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      if (demon.fusion !== 'party') {
        inverses[demon.race][demon.lvl] = demon.name;
      }

      for (const [skill, level] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: demon.name, level });
      }
    }

    this.demons = demons;
    this.enemies = enemies;
    this.skills = skills;
    this.specialRecipes = specials;
    this.invertedDemons = inverses;
  }

  updateDerivedData(demonToggles: Toggles) {
    const demonEntries = Object.assign({}, this.demons);
    const skills:        Skill[] = [];
    const ingredients:   { [race: string]: number[] } = {};
    const results:       { [race: string]: number[] } = {};

    for (const skill of Object.values(this.skills)) {
      if (skill.learnedBy.length < 1 && skill.transfer.length < 1) {
        skill.rank = 99;
      } else {
        skills.push(skill);
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (demon.fusion !== 'party') {
        ingredients[demon.race].push(demon.lvl);

        if (!this.specialRecipes.hasOwnProperty(name)) {
          results[demon.race].push(demon.lvl);
        }
      }
    }

    for (const race of this.compConfig.races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    for (const [name, included] of Object.entries(demonToggles)) {
      if (!included) {
        const { race, lvl } = this.demons[name];
        delete demonEntries[name];

        ingredients[race] = ingredients[race].filter(l => l !== lvl);
        results[race] = results[race].filter(l => l !== lvl);
      }
    }

    const allies = Object.keys(demonEntries).map(name => <Demon>demonEntries[name]);
    const enemies = Object.keys(this.enemies).map(name => <Demon>this.enemies[name]);
    this._allDemons = enemies.concat(allies);
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
    return this.demons[name] || this.enemies[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const elemOrder = this.compConfig.elemOrder;
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (elemOrder[d1.element] - elemOrder[d2.element]) * 10000 + d1.rank - d2.rank);
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
    return [];
  }

  getInheritElems(inherits: number): number[] {
    return inherits.toString(2).padStart(this.compConfig.inheritElems.length, '0').split('').map(i => parseInt(i) * 100);
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string): boolean {
    return false;
  }

  updateFusionSettings(demonToggles: Toggles) {
    this.updateDerivedData(demonToggles);
  }
}
