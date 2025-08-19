import { Demon, Skill, CompendiumConfig } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

type NumDict = { [name: string]: number };

function dsumPrice(stats: number[], lvl: number) {
  const statTotal = stats.slice(2, 8).reduce((acc, i) => acc + i, 0);
  return 10 * statTotal * Math.floor(lvl / 10 + 1);
}

function dsshPrice(stats: number[], race: string) {
  const statTotal = stats.slice(2, 8).reduce((acc, i) => acc + i, -7);
  const a = Math.floor(statTotal / 10) + 1;
  const b = statTotal % 10;
  const price = b*a*(a+1)/2 + (10-b)*(a-1)*a/2 + a*2 + (b<8?0:1);
  return 70 * price / (race === 'Element' || race === 'Mitama' ? 0.35 : 1);
}

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] };
  private pairRecipes: { [name: string]: NamePair[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private elementDemons: string[];

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  compConfig: CompendiumConfig;

  constructor(compConfig: CompendiumConfig) {
    this.initImportedData(compConfig);
    this.updateDerivedData(compConfig);
  }

  initImportedData(compConfig: CompendiumConfig) {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const pairRecipes: { [name: string]: NamePair[] } = {};

    const statLen = compConfig.baseStats.length;
    const resLen = compConfig.resistElems.length;
    const resistCodes: NumDict = {};
    const isDsum = compConfig.appCssClasses.includes('dsum');
    const isDssh = compConfig.appCssClasses.includes('dssh');

    for (const [res, code] of Object.entries(compConfig.resistCodes)) {
      resistCodes[res] = ((code / 1000 | 0 + 8) << 10) + (code % 1000 / 2.5 | 0);
    }

    for (const [name, json] of Object.entries(compConfig.demonData)) {
      const skills = compConfig.appTitle !== 'Shin Megami Tensei IMAGINE' ?
        json['skills'].reduce((acc, skill, i) => { if (skill) {
          acc[skill.replace('*', '')] = i - 8; 
        } return acc; }, {}) : json['skills'];
      const price = isDsum ? dsumPrice(json['stats'], json['lvl']) :
        isDssh ? dsshPrice(json['stats'], json['race']) :
        Math.pow(Math.floor(json['lvl']), 3);

      demons[name] = {
        name,
        price,
        race:     json['race'],
        lvl:      json['lvl'],
        currLvl:  json['lvl'],
        fusion:   'normal',
        inherits: compConfig.inheritSkills ? compConfig.skillElems.indexOf(json['inherit']) : 24,
        drop:     json['drop'] || '-',
        stats:    json['stats'].slice(0, statLen),
        atks:     json['atks'] || [],
        resists:  json['resists'].substring(0, resLen).split('').map(x => resistCodes[x]),
        align:    json['align'] || compConfig.alignData.races[json['race']],
        skills,
        searchTags: [name, json['race']].join(',').toLocaleLowerCase()
      };
    }

    for (const [name, json] of Object.entries(compConfig.skillData)) {
      const powerUnit = json['element'] === 'recovery' ? ' Rec ' : ' Dmg ';

      skills[name] = {
        name,
        element: json['element'],
        power:   json['power'] || 0,
        cost:    json['cost'] || 0,
        rank:    (json['enemy'] ? 99 : 0) + (json['cost'] & 0x3FF || 0) / 100,
        effect:  (json['power'] ? json['power'].toString() + powerUnit : ' ') + (json['effect'] || ''),
        target:  json['target'],
        level:   0,
        learnedBy: []
      };
    }

    for (const demon of Object.values(demons).sort((a, b) => a.lvl - b.lvl)) {
      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: demon.name, level: lvl });
      }
    }

    if (compConfig.specialRecipes) {
      for (const [name, recipe] of Object.entries(compConfig.specialRecipes)) {
        demons[name].fusion = recipe['fusion'] || 'special';

        if (recipe['prereq']) {
          demons[name].prereq = recipe['prereq'];
        }

        if (recipe['special']) {
          specialRecipes[name] = <string[]>recipe['special'];
        }

        if (recipe['pairs']) {
          pairRecipes[name] = recipe['pairs'].map((pair: string) => {
            const [name1, name2] = pair.split(' x ');
            return { name1, name2 };
          });
        }
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.elementDemons = compConfig.elementTable.elems;
    this.specialRecipes = specialRecipes;
    this.pairRecipes = pairRecipes;
  }

  updateDerivedData(compConfig: CompendiumConfig) {
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of compConfig.races) {
      inversions[race] = {};
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      inversions[demon.race][demon.lvl] = name;
      ingredients[demon.race].push(demon.lvl);

      if (demon.fusion === 'normal') {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const [species, races] of Object.entries(compConfig.species)) {
      const triSpecies = '3' + species;

      inversions[species] = {};
      ingredients[species] = [];
      results[species] = [];

      inversions[triSpecies] = {};
      ingredients[triSpecies] = [];
      results[triSpecies] = [];

      for (let i = races.length; i > 0; i--) {
        const race = races[i - 1];
        let triLvlOffset = races.length - i;

        if (compConfig.alignData['races'][race].charAt(0) == 'd') {
          triLvlOffset -= 400;
        } else {
          Object.assign(inversions[species], inversions[race]);
          ingredients[species] = ingredients[species].concat(ingredients[race])
          results[species] = results[species].concat(results[race])
        }

        for (const [lvl, name] of Object.entries(inversions[race])) {
          const triLvl = (parseInt(lvl) * 100 + triLvlOffset) / 100;

          inversions[triSpecies][triLvl] = name.toString();
          ingredients[triSpecies].push(triLvl);
          results[triSpecies].push(triLvl);
        }
      }
    }
    
    for (const race of Object.keys(ingredients)) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    this._allDemons = Object.values(this.demons);
    this._allSkills = Object.values(this.skills);
    this.invertedDemons = inversions;
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

  getSkill(name: string): Skill {
    return this.skills[name];
  }

  getSkills(names: string[]): Skill[] {
    const skills = names.map(name => this.skills[name]);
    skills.sort((d1, d2) => (
      this.compConfig.elemOrder[d1.element] -
      this.compConfig.elemOrder[d2.element]
    ) * 10000 + d1.rank - d2.rank);
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
    return this.pairRecipes[name] || [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return [];
  }

  isElementDemon(name: string) {
    return this.elementDemons.indexOf(name) !== -1;
  }

  updateFusionSettings(config: { [setting: string]: boolean; }) { }
}
