import { CompendiumConfig, Demon, Skill } from '../models';
import { Compendium as ICompendium, NamePair } from '../../compendium/models';

export class Compendium implements ICompendium {
  private demons: { [name: string]: Demon };
  private enemies: { [name: string]: Demon };
  private skills: { [name: string]: Skill };

  private specialNameEntries: { [name: string]: string[] } = {};
  private specialNamePairs: { [name: string]: NamePair[] } = {};
  private invertedSpecials: { [ingred: string]: string[] } = {};
  private invertedDemons: { [race: string]: { [lvl: number]: string } };

  private allIngredients: { [race: string]: number[] };
  private allResults: { [race: string]: number[] };
  private _allDemons: Demon[];
  private _allSkills: Skill[];

  constructor(private compConfig: CompendiumConfig) {
    this.initImportedData();
    this.updateDerivedData();
  }

  initImportedData() {
    const { demons, enemies, skills } = this.compConfig;
    const specialNameEntries: { [name: string]: string[] } = {};
    const specialNamePairs: { [name: string]: NamePair[] } = {};
    const invertedSpecials: { [ingred: string]: string[] } = {};
    const inversions: { [race: string]: { [lvl: number]: string } } = {};

    for (const [name1, results] of Object.entries(this.compConfig.mutations)) {
      invertedSpecials[name1] = results;
      for (const nameR of results) {
        if (!specialNameEntries[nameR]) { specialNameEntries[nameR] = []; }
        specialNameEntries[nameR].push(name1);
      }
    }

    for (const [name, prereq] of Object.entries(this.compConfig.fusionPrereqs)) {
      demons[name].prereq = prereq;
      if (demons[name].fusion === 'normal') { demons[name].fusion = 'special'; }
      specialNamePairs[name] = [{ name1: name, name2: name }];
    }

    for (const [name, recipe] of Object.entries(this.compConfig.specialRecipes)) {
      if (recipe.length > 0) {
        specialNamePairs[name] = [{ name1: recipe[0], name2: recipe[1] }];
      } else {
        demons[name].prereq = 'Fusion Accident'
        demons[name].fusion = 'accident'
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

    for (const enemy of Object.values(enemies).sort((a, b) => a.lvl - b.lvl)) {
      inversions[enemy.race][enemy.lvl] = enemy.name;

      for (const [skill, lvl] of Object.entries(enemy.transfers)) {
        skills[skill].transfer.push({ demon: enemy.name, level: lvl });
      }
    }

    for (const skill of Object.values(skills)) {
      if (skill.card !== '') {
        for (const dname of skill.card.split(', ')) {
          if (demons[dname]) { skill.learnedBy.push({ demon: dname, level: 5084 }) }
          else if (enemies[dname]) { skill.transfer.push({ demon: dname, level: 3680 }); }
        }
      }
    }

    this.demons = demons;
    this.enemies = enemies;
    this.skills = skills;

    this.specialNameEntries = specialNameEntries
    this.specialNamePairs = specialNamePairs;
    this.invertedSpecials = invertedSpecials;
    this.invertedDemons = inversions;
  }

  updateDerivedData() {
    const skills = Object.keys(this.skills).map(name => this.skills[name]);
    const ingredients: { [race: string]: number[] } = {};
    const results: { [race: string]: number[] } = {};

    for (const race of this.compConfig.races) {
      ingredients[race] = [];
      results[race] = [];
    }

    for (const [name, demon] of Object.entries(this.demons)) {
      if (this.demons[name].fusion === 'normal') {
        results[demon.race].push(demon.lvl);
      }
    }

    for (const [name, enemy] of Object.entries(this.enemies)) {
      ingredients[enemy.race].push(enemy.lvl);
    }

    for (const race of this.compConfig.races) {
      ingredients[race].sort((a, b) => a - b);
      results[race].sort((a, b) => a - b);
    }

    const allies = Object.keys(this.demons).map(name => <Demon>this.demons[name]);
    const enemies = Object.keys(this.enemies).map(name => <Demon>this.enemies[name]);
    this._allDemons = enemies.concat(allies);
    this._allSkills = skills.filter(s => s.rank < 90);
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
    return this._allDemons.filter(d => d.fusion === 'special');
  }

  getDemon(name: string): Demon {
    return this.enemies[name] || this.demons[name];
  }

  getEnemy(name: string): Demon {
    return this.enemies[name];
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

  getStatGrowths(growthType: string): number[][] {
    return this.compConfig.growthTypes[growthType] || [];
  }

  getIngredientDemonLvls(race: string): number[] {
    return this.allIngredients[race] || [];
  }

  getResultDemonLvls(race: string): number[] {
    return this.allResults[race] || [];
  }

  getSpecialNameEntries(name: string): string[] {
    return this.specialNameEntries[name] || [];
  }

  getSpecialNamePairs(name: string): NamePair[] {
    return this.specialNamePairs[name] || [];
  }

  getInheritElems(inherits: number): number[] {
    return inherits.toString(2).padStart(this.compConfig.inheritElems.length, '0').split('').map(i => parseInt(i) * 100);
  }

  reverseLookupDemon(race: string, lvl: number): string {
    return this.invertedDemons[race][lvl];
  }

  reverseLookupSpecial(ingredient: string): string[] {
    return this.invertedSpecials[ingredient] || [];
  }

  isElementDemon(name: string) {
    return false;
  }

  updateFusionSettings(config: { [setting: string]: boolean; }) { }
}
