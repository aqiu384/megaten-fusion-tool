import { Races, SkillElementOrder, ResistCodes, InheritElements, Gems } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import ENEMY_DATA_JSON from '../data/enemy-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import GROWTH_TYPES from '../data/growth-types.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private gems: { [name: string]: Demon };

  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private growthTypes: { [type: string]: number[][] };
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  constructor() {
    this.initImportedData();
    this.updateDerivedData();
  }

  private getResistsSummary(presists: number[], mresists: number[]): number[] {
    return [
      presists.slice(0, 7).reduce((acc, r) => acc + r, 0) / 7,
      presists[7],
      presists.slice(8, 11).reduce((acc, r) => acc + r, 0) / 3,
      presists[11],
      presists[12],
      presists[13],
      mresists[0],
      mresists[1],
      mresists[2],
      mresists[3],
      mresists.slice(4, 8).reduce((acc, r) => acc + r, 0) / 4,
      (mresists[8] + mresists[9]) / 2,
      (mresists[10] + mresists[11]) / 2,
      mresists[12]
    ];
  }

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const enemies: { [name: string]: Demon } = {};
    const gems: { [name: string]: Demon } = {};

    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const growthTypes: { [type: string]: number[][] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const learnRanks = [0, 3, 4, 5, 7, 8];

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      const presists = json.presists.split('').map(char => ResistCodes[char]);
      const mresists = json.mresists.split('').map(char => ResistCodes[char]);

      demons[name] = {
        name,
        presists,
        mresists,
        resists:   this.getResistsSummary(presists, mresists),
        race:      json.race,
        lvl:       json.lvl,
        currLvl:   json.lvl,
        fusion:    'normal',
        price:     0,
        stats:     json.stats,
        type:      json.type,
        subtype:   json.subtype,
        drop:      json.drops,
        growth:    json.growth,
        affinity:  json.affinity,
        atks:      json.atks,
        skills:    json.skills.reduce((acc, s, i) => { if (s.length > 1) { acc[s] = learnRanks[i]; } return acc; }, {}),
        traits:    [],
        contacts:  [],
        transfers: {},
        area:      ''
      };

      if (json.disinherits.length) {
        demons[name].inherits = (<string[]>json.disinherits).reduce((acc, d) => {
          acc[InheritElements.indexOf(d)] = false; return acc;
        }, Array(InheritElements.length).fill(true));
      }
    }

    for (const [name, json] of Object.entries(ENEMY_DATA_JSON)) {
      const presists = json.presists.split('').map(char => ResistCodes[char]);
      const mresists = json.mresists.split('').map(char => ResistCodes[char]);
      const eagers = Object.entries(json.eager).map(c => ({ actor: c[0], action: <string>c[1], result: 'Eager' }));
      const happys = Object.entries(json.happy).map(c => ({ actor: c[0], action: <string>c[1], result: 'Happy' }));

      enemies[name] = {
        name,
        presists,
        mresists,
        resists:   this.getResistsSummary(presists, mresists),
        type:      json.type,
        subtype:   json.subtype,
        traits:    json.traits.length ? json.traits : ['-'],
        race:      json.race,
        lvl:       json.lvl,
        currLvl:   json.lvl,
        fusion:    'normal',
        price:     Math.pow(json.lvl, 2),
        stats:     json.stats.slice(0, 2),
        estats:    json.stats.slice(2),
        atks:      json.atks,
        area:      json.areas.join(', '),
        drop:      json.drops,
        contacts:  eagers.concat(happys),
        skills:    (<string[]>json.skills).reduce((acc, s, i) => { acc[s] = i + 1; return acc; }, {}),
        transfers: (json.transfers || []).reduce((acc, s, i) => { acc[s] = i + 1; return acc; }, {}),
        isEnemy:   true,
        growth:    '',
        affinity:  ''
      };
    }

    for (let i = 0; i < Gems.length; i++) {
      gems[Gems[i]] = {
        name:      Gems[i],
        presists:  [],
        mresists:  [],
        resists:   [],
        type:      '',
        subtype:   '',
        traits:    [],
        race:      'Gem',
        lvl:       i + 1,
        currLvl:   i + 1,
        fusion:    'recruit',
        prereq:    'Item negotiation only',
        price:     0,
        stats:     [],
        estats:    [],
        atks:      [],
        area:      '',
        drop:      '',
        contacts:  [],
        skills:    {},
        transfers: {},
        growth:    '',
        affinity:  ''
      }
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      skills[name] = {
        name,
        element: json.element,
        power:   json['power'] || 0,
        range:   json['range'],
        cost:    0,
        rank:    json['power'] / 10 || 0,
        effect:  json.effect,
        target:  json.target.toString(),
        level:   0,
        learnedBy: [],
        transfer: []
      };
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      if (json['totem']) {
        demons[name].fusion = 'special';

        if (json['ingredients']) {
          demons[name].prereq = `Perform fusion that uses the following ingredients with ${json['totem']} totem`;
          specialRecipes[name] = json['ingredients'];
        } else {
          demons[name].prereq = `Perform fusion that creates one of the following results with ${json['totem']} totem`;
          specialRecipes[name] = [name, name, name];
        }

      } else {
        demons[name].fusion = 'accident';
        demons[name].prereq = 'Fusion accident only';
        specialRecipes[name] = [];
      }
    }

    for (const [name, json] of Object.entries(GROWTH_TYPES)) {
      growthTypes[name] = json;
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

    for (const [name, enemy] of Object.entries(enemies)) {
      inversions[enemy.race][enemy.lvl] = name;

      for (const [skill, lvl] of Object.entries(enemy.transfers)) {
        skills[skill].transfer.push({ demon: name, level: lvl });
      }
    }

    this.demons = demons;
    this.enemies = enemies;
    this.gems = gems;

    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.growthTypes = growthTypes;
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
      if (this.demons[name].fusion === 'normal') {
        ingredients[demon.race].push(demon.lvl);
        results[demon.race].push(demon.lvl);
      }
    }

    for (const [name, enemy] of Object.entries(this.enemies)) {
      ingredients[enemy.race].push(enemy.lvl);
    }

    for (const [name, gem] of Object.entries(this.gems)) {
      ingredients[gem.race].push(gem.lvl);
    }

    for (const race of Races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    for (const [name, entry] of Object.entries(this.specialRecipes)) {
      if (this.demons[name].prereq.includes('results')) {
        const resultRace = this.demons[name].race;
        this.specialRecipes[name] = results[resultRace].map(l => this.invertedDemons[resultRace][l]);
      }
    }

    const allies = Object.keys(this.demons).map(name => <Demon>this.demons[name]);
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
    return this.enemies[name] || this.demons[name] || this.gems[name];
  }

  getEnemy(name: string): Demon {
    return this.enemies[name];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
    return skills;
  }

  getStatGrowths(growthType: string): number[][] {
    return this.growthTypes[growthType] || [];
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
    return [];
  }

  isElementDemon(name: string) {
    return false;
  }
}
