import { Component, input, effect, computed } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Demon, Skill, Compendium } from '../../compendium/models';

export interface DemonLookup { [key: string]: Demon[]; }
export interface SkillLookup { [key: string]: Skill[]; }
export interface SkillPickModel {
  disabled: boolean;
  elem: string;
  skill: string;
  demon: string;
};

export const BLANK_DEMON: Demon = {
  name: '-', race: '-', lvl: 0, currLvl: 0, price: 0, inherits: 0,
  skills: {}, stats: [], resists: [], affinities: [],
  fusion: 'normal', prereq: '', searchTags: '-'
};

export const BLANK_SKILL: Skill = {
  name: '-', element: '-', inherit: '-', rank: 99, cost: 0,
  effect: '', target: '', level: 0, learnedBy: [{ demon: '-', level: 0 }]
};

export function makeSkillPickList(length: number): SkillPickModel[] {
  return Array.from({ length }, (): SkillPickModel => ({
    disabled: false,
    elem: '-',
    skill: BLANK_SKILL.name,
    demon: BLANK_DEMON.name
  }));
}

export class SkillLookupMaker {
  learnedBy: DemonLookup;
  elemTyped: SkillLookup;

  constructor(public compendium: Compendium, public inheritElems: string[], public skillElems: string[]) {
    this.learnedBy = { '-': [BLANK_DEMON] };
    this.elemTyped = { '-': [BLANK_SKILL] };

    for (const demon of this.compendium.allDemons.filter(d => d.fusion !== 'party' && !d.isEnemy)) {
      for (const sname of Object.keys(demon.skills)) {
        if (!this.learnedBy[sname]) { this.learnedBy[sname] = []; }
        this.learnedBy[sname].push(demon);
      }
    }

    for (const skill of this.compendium.allSkills.filter(s => s.rank < 50 && this.learnedBy[s.name])) {
      if (!this.elemTyped[skill.inherit]) { this.elemTyped[skill.inherit] = []; }
      this.elemTyped[skill.inherit].push(skill);
    }

    for (const sl of Object.values(this.elemTyped)) { sl.sort((a, b) => a.rank - b.rank); }
    for (const dl of Object.values(this.learnedBy)) { dl.sort((a, b) => a.lvl - b.lvl); }
  }

  getInnateSkills(demonT: Demon): Skill[] {
    return Object.entries(demonT.skills)
      .filter(pair => pair[1] < 2)
      .map(pair => this.compendium.getSkill(pair[0]))
      .concat(Array<Skill>(12).fill(BLANK_SKILL));
  }

  getInheritSkills(demonT: Demon, demonI: Demon): SkillLookup {
    const excludeElems: string[] = [];

    for (let i = 0; i < this.inheritElems.length; i++) {
      if (!(demonI.inherits & demonT.inherits & (1 << i))) {
        excludeElems.push(this.inheritElems[this.inheritElems.length - i - 1]);
      }
    }

    const elems = this.skillElems.filter(e => !excludeElems.includes(e));
    const learnedSkills = Object.keys(demonI.skills)
      .filter(s => demonI.skills[s] < 99)
      .map(s => this.compendium.getSkill(s))
      .filter(s => demonT.skills[s.name] > -1 || elems.includes(s.element) && s.rank < 50);

    return elems.reduce((acc, e) =>
      { acc[e] = this.elemTyped[e]; return acc; },
      { '-': [BLANK_SKILL].concat(learnedSkills) }
    );
  }
}

@Component({
  selector: 'app-recipe-skill-picker',
  imports: [FormField],
  template: `
    <td>
      <select [formField]="form$().elem">
        <option value="-">-</option>
        @for (elem of skillElems$(); track $index) {
          @if (skillIs$()[elem]) {
            <option [value]="elem">{{ elem }}</option>
          }
        }
      </select>
    </td>
    <td>
      <select [formField]="form$().skill">
        @for (skill of skillIs$()[elem$()]; track skill.name) {
          <option [value]="skill.name">{{ skill.name }}</option>
        }
      </select>
    </td>
    @if (showDemonPicker$()) {
      <td>
        @if (!form$().disabled().value()) {
          <select [formField]="form$().demon">
            @for (demon of learnedBy$()[skill$().name]; track demon.name) {
              <option [value]="demon.name">{{ demon.name }}</option>
            }
          </select>
        } @else {
          <select disabled><option>-</option></select>
        }
      </td>
    }
  `,
  host: {
    style: 'display: contents;'
  }
})
export class RecipeSkillPickerComponent {
  form$ = input.required<FieldTree<SkillPickModel>>({ alias: 'skillPickForm' });
  skillLookupMaker$ = input.required<SkillLookupMaker>({ alias: 'skillLookupMaker' });
  skillIs$ = input.required<SkillLookup>({ alias: 'skillIs' });
  showDemonPicker$ = input(true, { alias: 'showDemonPicker' });

  constructor() {
    effect(() => this.form$().elem().value.update(elem =>
      this.skillIs$()[elem] ? elem : '-'
    ));
    effect(() => this.form$().skill().value.update(skill =>
      this.skillIs$()[this.elem$()]?.find(s => s.name === skill) ?
        skill : this.skillIs$()[this.elem$()]?.[0].name ||
          Object.values(this.skillIs$())[0][0].name
    ));
    effect(() => this.form$().demon().value.update(demon =>
      this.learnedBy$()[this.skill$().name]?.find(d => d.name === demon) ?
        demon : this.learnedBy$()[this.skill$().name]?.[0].name ||
          Object.values(this.learnedBy$())[0][0].name
    ));
  }

  skillElems$ = computed(() => this.skillLookupMaker$().skillElems);
  compendium$ = computed(() => this.skillLookupMaker$().compendium);
  learnedBy$ = computed(() => this.skillLookupMaker$().learnedBy);
  elem$ = computed(() => this.form$().elem().value());
  skill$ = computed(() => this.compendium$().getSkill(this.form$().skill().value()) ?? BLANK_SKILL);
  demon$ = computed(() => this.compendium$().getDemon(this.form$().demon().value()) ?? BLANK_DEMON);
}
