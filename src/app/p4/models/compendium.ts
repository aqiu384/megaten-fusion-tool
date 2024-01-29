import { Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Demon, Skill, CompendiumConfig } from '../models';

type NumDict = { [name: string]: number };

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private invertedSpecials: { [ingred: string]: string[] };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const demons:   { [name: string]: Demon } = {};
    const enemies:  { [name: string]: Demon } = {};
    const skills:   { [name: string]: Skill } = {};
    const specials: { [name: string]: string[] } = {};
    const inverses: { [race: string]: { [lvl: number]: string } } = {};
    const invertedSpecials: { [ingred: string]: string[] } = {};
    const resistCodes: NumDict = {};
    const resistLvls: NumDict = {};
    const blankAilments = '-'.repeat(this.compConfig.ailmentElems.length);

    for (const [res, code] of Object.entries(this.compConfig.resistCodes)) {
      resistCodes[res] = (code / 10000 | 0) << 10;
      resistLvls[res] = code % 10000 / 2.5 | 0;
    }

    const codifyResists = (resCode: string, blankCode: string, resLvls: number) =>
      (resCode || blankCode).split('').map((x, i) =>
        resistCodes[x] + (resLvls?.[i] / 2.5 | 0 || resistLvls[x]));

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          race:       json['race'],
          lvl:        json['lvl'],
          currLvl:    json['lvl'],
          cardLvl:    json['cardlvl'] || 0,
          price:      Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          inherits:   parseInt(((json['affinities'] || [0]).map(a => a > 0 ? 1 : 0)).join(''), 2),
          affinities: json['affinities'],
          stats:      json['stats'],
          resists:    codifyResists(json['resists'], json['resists'], json['resmods']),
          ailments:   codifyResists(json['ailments'], blankAilments, json['ailmods']),
          skills:     json['skills'],
          fusion:     json['fusion'] || 'normal',
          prereq:     json['prereq'] || ''
        };
      }
    }

    for (const enemyDataJson of this.compConfig.enemyData) {
      for (const [name, enemy] of Object.entries(enemyDataJson)) {
        let drops = []
        
        if (enemy['material'] && enemy['material'] !== '-') {
          drops.push(enemy['material']);
        } if (enemy['gem'] && enemy['gem'] !== '-') {
          drops.push(enemy['gem']);
        } if (enemy['drops']) {
          drops = drops.concat(enemy['drops']);
        } if (!drops.length) {
          drops.push('-');
        }

        enemies[name] = {
          name,
          race:     enemy['race'],
          lvl:      enemy['lvl'],
          currLvl:  enemy['lvl'],
          cardLvl:  0,
          price:    0,
          inherits: 0,
          stats:    enemy['stats'].slice(0, 2),
          estats:   enemy['stats'].slice(2),
          resists:  codifyResists(enemy['resists'], enemy['resists'], enemy['resmods']),
          ailments: codifyResists(enemy['ailments'], blankAilments, enemy['ailmods']),
          skills:   enemy['skills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {}),
          fusion:   'normal',
          area:     enemy['area'],
          drop:     drops.join(', '),
          isEnemy:  true
        };
      }
    }

    for (const skillData of this.compConfig.skillData) {
      for (const [name, json] of Object.entries(skillData)) {
        skills[name] = {
          name,
          element:   json['element'],
          cost:      json['cost'] || 0,
          rank:      json['rank'] || 99,
          effect:    json['power'] ? '√' + json['power'] + ' power' + (json['effect'] ? ', ' + json['effect'] : '') : json['effect'],
          target:    json['target'] || 'Self',
          learnedBy: [],
          transfer:  [],
          level:     0
        };

        if (json['card']) {
          skills[name].transfer = json['card'].split(', ').map(d => ({ demon: d, level: demons[d] ? demons[d].cardLvl : -100 }));
        }
      }
    }

    for (const [name, json] of Object.entries(this.compConfig.specialRecipes)) {
      const ingreds = <string[]>json;
      specials[name] = ingreds;
      demons[name].fusion = 'special';

      if (ingreds.length === 2) {
        for (const ingred of ingreds) {
          if (!invertedSpecials[ingred]) { invertedSpecials[ingred] = []; }
          invertedSpecials[ingred].push(name);
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
    this.invertedSpecials = invertedSpecials;
  }

  updateDerivedData() {
    const ingredients: { [race: string]: number[] } = {};
    const results:     { [race: string]: number[] } = {};
    const skills: Skill[] = [];

    for (const skill of Object.values(this.skills)) {
      if (skill.learnedBy.length < 1) {
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

    const allies = Object.keys(this.demons).map(name => this.demons[name]);
    const enemies = Object.keys(this.enemies).map(name => this.enemies[name]);
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

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return this.invertedSpecials[ingredient] || [];
  }

  isElementDemon(name: string): boolean {
    return false;
  }

  updateFusionSettings(config: { [setting: string]: boolean; }) { }
}
