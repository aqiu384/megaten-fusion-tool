import { Races, SkillElementOrder, ResistCodes } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

import DEMON_DATA_JSON from '../data/demon-data.json';
import SKILL_DATA_JSON from '../data/skill-data.json';
import SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import FUSION_PREREQS_JSON from '../data/fusion-prereqs.json';
import SKILL_UPGRADES_JSON from '../data/skill-upgrades.json';
import UPGRADE_TYPES_JSON from '../data/upgrade-types.json';
import DEMON_PANELS_JSON from '../data/demon-panels.json';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
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

  initImportedData() {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    const archCodes = [3367, 3365, 3380, 3389, 3369];
    const gachCodes = [3965, 3980, 3989, 3969, 4478];

    for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
      const stars = Math.floor(json.grade / 20) + 1;

      demons[name] = {
        name,
        race:     json.race,
        lvl:      json.grade,
        currLvl:  json.grade,
        ai:       json.ai,
        fusion:   'normal',
        price:    Math.pow(json.grade, 3),
        inherits: 0,
        stats:    [stars].concat(json.stats, [json.cnum, (DEMON_PANELS_JSON[name] || []).length / 2]),
        resists:  json.resists.split('').map(char => ResistCodes[char]),
        skills:   {},
        baseSkills: [].concat(
          json.base.map((skill) => ({ skill, source: 0 })),
          json.arch.map((skill, i) => ({ skill, source: archCodes[i] })),
          (json['gach'] || []).map((skill, i) => ({ skill, source: gachCodes[i] }))
        )
      };
    }

    for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
      let effect = json['effect'];

      if (json['power']) {
        effect = json['power'] ? json['power'].toString() + (json.elem === 'rec' ? ' rec' : ' dmg') : '';
        effect += json['target'] ? ' to ' + json['target'].toLowerCase() : '';
        effect += json['effect'] ? ', ' + json['effect'] : '';
      } if (json.elem === 'ail') {
        effect = json['effect'] + ' to ' + (json['target'] || '').toLowerCase();
      } else if (json.elem === 'rec' || json.elem === 'sup') {
        effect = (json['effect'] + ',').replace(',', ' for ' + (json['target'] || 'User').toLowerCase() + ',');
        effect = effect.substring(0, effect.length - 1);
      }

      skills[name] = {
        name,
        element: json.elem,
        power:   json['power'] || 0,
        cost:    json['cost'] + 1000 || 0,
        rank:    json['points'] || 99,
        effect,
        target:  json['target'],
        level:   0,
        upgrade: '',
        learnedBy: [],
        transfer: []
      };
    }

    for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
      demons[name].fusion = 'accident';
      demons[name].prereq = prereq;
    }

    for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
      demons[name].fusion = 'special'
      specialRecipes[name] = json;
    }

    for (const [utype, snames] of Object.entries(SKILL_UPGRADES_JSON)) {
      for (const sname of snames) {
        skills[sname].upgrade = utype;
      }
    }

    for (const race of Races) {
      inversions[race] = {};
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      inversions[demon.race][demon.lvl] = demon.name;
      skills[demon.baseSkills[0].skill].transfer.push({ demon: demon.name, level: 0 });

      for (const { skill, source } of demon.baseSkills.slice(1)) {
        if (source > 3900) {
          skills[skill].transfer.push({ demon: demon.name, level: source });
        } else {
          skills[skill].learnedBy.push({ demon: demon.name, level: source });
        }
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.specialRecipes = specialRecipes;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const demonEntries = Object.assign({}, this.demons);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};
    const skills = Object.keys(this.skills).map(name => this.skills[name])
      .filter(skill => skill.learnedBy.length + skill.transfer.length > 0);

    for (const race of Races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      ingredients[demon.race].push(demon.lvl);

      if (demon.fusion === 'normal') {
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

  getDemonPanels(name: string): string[] {
    return DEMON_PANELS_JSON[name] || [];
  }

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank);
    return skills;
  }

  getSkillUpgrade(name: string): string[] {
    return UPGRADE_TYPES_JSON[this.skills[name].upgrade] || [];
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
