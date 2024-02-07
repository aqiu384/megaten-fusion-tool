import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';
import { Toggles } from '../../compendium/models/fusion-settings';
import { CompendiumConfig } from '../models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private normalExceptions: { [name: string]: string };

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
    const demons: { [name: string]: Demon } = {};
    const enemies: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string [] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const normalExceptions: { [name: string]: string } = {};
    const resistCodes: { [code: string]: number } = {};

    for (const [res, code] of Object.entries(this.compConfig.resistCodes)) {
      resistCodes[res] = ((code / 10000 | 0) << 10) + (code % 10000 / 2.5 | 0);
    }

    for (const demonDataJson of this.compConfig.demonData) {
      for (const [name, json] of Object.entries(demonDataJson)) {
        demons[name] = {
          name,
          item:       json['item'] || '',
          race:       json['race'],
          lvl:        json['lvl'],
          currLvl:    json['lvl'],
          skills:     json['skills'],
          price:      Math.pow(json['stats'].reduce((acc, stat) => stat + acc, 0), 2) + 2000,
          stats:      json['stats'],
          resists:    json['resists'].split('').map(x => resistCodes[x]),
          fusion:     json['fusion'] || 'normal',
          inherits:   parseInt(((json['affinities'] || [-10]).map(a => a > -10 ? '1' : '0')).join(''), 2),
          affinities: json['affinities'],
          prereq:     json['prereq'] || '',
          persona:    name,
          trait:      '',
          exp:        0
        };

        if (json['itemr']) {
          demons[name].item += (', ' + json['itemr']);
        }
      }
    }

    for (const enemyDataJson of this.compConfig.enemyData) {
      for (const [name, enemy] of Object.entries(enemyDataJson)) {
        const drops = [enemy['material'] || '-', enemy['armor'] || '-', enemy['card'] || '-'].filter(drop => drop !== '-');

        enemies[name] = {
          name,
          persona:  enemy['persona'],
          trait:    enemy['trait'],
          exp:      enemy['exp'],
          race:     enemy['race'],
          lvl:      enemy['lvl'],
          currLvl:  enemy['lvl'],
          price:    enemy['yen'],
          inherits: 0,
          stats:    enemy['stats'].slice(0, 2),
          estats:   enemy['stats'].slice(2),
          resists:  enemy['resists'].split('').map(x => resistCodes[x]),
          fusion:   'normal',
          skills:   (enemy['skills'] || []).reduce((acc, s) => { acc[s] = 0; return acc }, {}),
          area:     enemy['area'].join(', '),
          item:     drops.join(', ') || '-',
          isEnemy:  true
        };
      }
    }

    for (const skillDataJson of this.compConfig.skillData) {
      for (const [name, json] of Object.entries(skillDataJson)) {
        skills[name] = {
          name,
          element: json['element'],
          effect:  json['effect'],
          target:  json['target'] || 'Self',
          rank:    (json['normCost'] & 0x3FF) / 100 || 0,
          cost:    json['normCost'] || 0,
          transfer:  [],
          learnedBy: [],
          level: 0
        };

        if (json['card']) {
          skills[name].transfer = [{ demon: json['card'], level: -100 }];
        }

        if (json['unique']) {
          skills[name].rank = 99;
        }
      }
    }

    for (const [name, recipe] of Object.entries(this.compConfig.specialRecipes)) {
      const demon = demons[name];
      const json = <string[]>recipe;

      demon.fusion = 'special';
      specialRecipes[name] = json;

      if (json.length === 2) {
        normalExceptions[json[0]] = json[1];
        normalExceptions[json[1]] = json[0];
      }

      if (json.length === 0) {
        demon.fusion = 'recruit';
        demon.price += 200000;
      }
    }

    for (const race of this.compConfig.races) {
      inversions[race] = {};
    }

    for (const demon of Object.values(enemies)) {
      if (demon.item) {
        const items = demon.item.split(', ');
        const item = items[items.length - 1];

        if (skills[item]) {
          skills[item].transfer.unshift({ demon: demon.persona, level: 5275 });
        }
      }
    }

    for (const [name, demon] of Object.entries(demons)) {
      if (demon.item) {
        const [item, itemR] = demon.item.split(', ');

        if (skills[item]) {
          skills[item].transfer.unshift({ demon: name, level: 0 });
        } if (skills[itemR]) {
          skills[itemR].transfer.unshift({ demon: name, level: 3865 });
        }
      }

      if (demon.fusion !== 'party') {
        inversions[demon.race][demon.lvl] = name;
      }
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      for (const name of Object.keys(demon.skills)) {
        skills[name].learnedBy.push({
          demon: demon.name,
          level: demon.skills[name]
        });
      }
    }

    this.demons = demons;
    this.enemies = enemies;
    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.invertedDemons = inversions;
    this.normalExceptions = normalExceptions;
  }

  updateDerivedData(demonToggles: Toggles) {
    const demonEntries = Object.assign({}, this.demons);
    const skills = Object.keys(this.skills)
      .map(name => this.skills[name])
      .filter(skill => skill.learnedBy.length !== 0 || skill.transfer.length !== 0);

    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (demon.fusion !== 'party') {
        if (!this.isElementDemon(name)) {
          ingredients[demon.race].push(demon.lvl);
        }

        if (!this.specialRecipes.hasOwnProperty(name) || demon.race === 'World') {
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

    const allies = Object.keys(demonEntries).map(name => demonEntries[name]);
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
    return Object.keys(this.specialRecipes)
      .filter(name => !this.isElementDemon(name))
      .map(name => this.demons[name]);
  }

  getDemon(name: string): Demon {
    return this.demons[name] || this.enemies[name];
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

    retSkills.sort((d1, d2) =>
      (d1.level - d2.level) * 100 +
      this.compConfig.elemOrder[d1.element] -
      this.compConfig.elemOrder[d2.element]
    );

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

  getElementDemons(name: string) {
    return Object.keys(this.specialRecipes).filter(demon => this.isElementDemon(demon) && demon !== name);
  }

  getNormalException(name: string): string {
    return this.normalExceptions[name];
  }

  getInheritElems(inherits: number): number[] {
    return [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.specialRecipes.hasOwnProperty(name) && this.specialRecipes[name].length === 0;
  }

  isRecruitmentOnly(name: string) {
    return this.isElementDemon(name);
  }

  isExcludedDemon(name: string) {
    const { race, lvl } = this.getDemon(name);
    return this.allIngredients[race].indexOf(lvl) === -1;
  }

  updateFusionSettings(demonToggles: Toggles) {
    this.updateDerivedData(demonToggles);
  }
}
