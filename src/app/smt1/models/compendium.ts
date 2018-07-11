import { ElementOrder, ResistCodes } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private skills: { [name: string]: Skill };
  private specialRecipes: { [name: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };
  private invertedSpecials: { [name: string]: { result: string, recipe: string }[] };
  private elementDemons: string[];

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  dlcDemons: { [name: string]: boolean } = {};

  constructor(demonJson: any, skillJson: any, alignJson: any) {
    this.initImportedData(demonJson, skillJson, alignJson);
    this.updateDerivedData(alignJson);
  }

  initImportedData(demonJson: any, skillJson: any, alignJson: any) {
    const demons: { [name: string]: Demon } = {};
    const skills: { [name: string]: Skill } = {};
    const specialRecipes: { [name: string]: string[] } = {};
    const invSpecs: { [name: string]: { result: string, recipe: string }[] } = {};

    for (const [name, json] of Object.entries(demonJson)) {
      const stars = Math.floor(json.grade / 20) + 1;
      const estats = json.stats.map(x => Math.floor(x / (12 - stars)));

      estats[0] = Math.floor(estats[0] / 1.5);

      demons[name] = {
        name,
        race:    json.race,
        lvl:     json.lvl,
        fusion:  'normal',
        inherit: json.inherit || 'special',
        drop:    json.drop || '-',
        price:   Math.pow(json.lvl, 3),
        stats:   json.stats,
        resists: json.resists.split('').map(char => ResistCodes[char]),
        skills:  json.skills.reduce((acc, skill, i) => { acc[skill] = i - 8; return acc; }, {})
      };
    }

    for (const [name, json] of Object.entries(skillJson)) {
      const powerUnit = json.element === 'recovery' ? ' Rec ' : ' Dmg ';

      skills[name] = {
        name,
        element: json.element,
        power:   json.power || 0,
        cost:    json.cost || 0,
        rank:    json.enemy ? 99 : 0,
        effect:  (json.power ? json.power.toString() + powerUnit : ' ') + (json.effect || ''),
        target:  json.target,
        level:   0,
        learnedBy: []
      };
    }

    for (const [name, demon] of Object.entries(demons)) {
      for (const [skill, lvl] of Object.entries(demon.skills)) {
        skills[skill].learnedBy.push({ demon: name, level: lvl });
      }
    }

    this.demons = demons;
    this.skills = skills;
    this.elementDemons = alignJson['elems'];
    this.specialRecipes = specialRecipes;
    this.invertedSpecials = invSpecs;
  }

  updateDerivedData(alignJson: any) {
    const inversions: { [race: string]: { [lvl: number]: string } } = {};
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of Object.keys(alignJson['races'])) {
      inversions[race] = {};
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (!inversions[demon.race]) {
        inversions[demon.race] = {};
        ingredients[demon.race] = [];
        results[demon.race] = [];
      }

      inversions[demon.race][demon.lvl] = name;
      ingredients[demon.race].push(demon.lvl);
      results[demon.race].push(demon.lvl);
    }

    const specs: { [species: string]: string[] } = alignJson['species'];

    for (const [species, races] of Object.entries(specs)) {
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

        if (alignJson['races'][race].charAt(0) == 'd') {
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

    console.log(JSON.stringify(inversions, null, '\t'))

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
    return [];
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[] {
    return this.invertedSpecials[ingredient] ? this.invertedSpecials[ingredient] : [];
  }

  isElementDemon(name: string) {
    return this.elementDemons.indexOf(name) !== -1;
  }
}
