import { Component, input, computed, effect, linkedSignal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTree, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

import { SkillLevelToShortStringPipeLocale, TranslateCompPipe } from '../pipes';
import { Demon, Skill, Compendium, SquareChart, RecipeGeneratorConfig } from '../../compendium/models';
import { createLeftRightCombos, createLeftRightRecipe } from '../models/recipe-generator';
import Translations from '../data/translations.json';

type DemonLookup = { [key: string]: Demon[]; }
type SkillLookup = { [key: string]: Skill[]; }

const BLANK_DEMON: Demon = {
  name: '-', race: '-', lvl: 0, currLvl: 0, price: 0, inherits: 0,
  skills: {}, stats: [], resists: [], affinities: [],
  fusion: 'normal', prereq: '', searchTags: '-'
};

const BLANK_SKILL: Skill = {
  name: '-', element: '-', inherit: '-', rank: 99, cost: 0,
  effect: '', target: '', level: 0, learnedBy: [{ demon: '-', level: 0 }]
};

interface SkillPickModel {
  disabled: boolean;
  elem: string;
  skill: Skill;
  demon: Demon;
};

function createSkillPickList(length: number): SkillPickModel[] {
  return Array.from({ length }, (): SkillPickModel => ({
    disabled: false,
    elem: '-',
    skill: BLANK_SKILL,
    demon: BLANK_DEMON
  }));
}

@Component({
  selector: 'td[app-recipe-inherit-elems]',
  imports: [CommonModule],
  template: `
    @for (elem of inheritElems(); track elem) {
      @if (skillLookup()[elem]) {
        <div [ngClass]="['element-icon', elem]">{{ elem }}</div>
      }
    }
  `
})
export class RecipeInheritElemsComponent {
  inheritElems = input.required<string[]>();
  skillLookup = input.required<SkillLookup>();
}

@Component({
  selector: 'app-recipe-skill-picker',
  imports: [FormsModule],
  template: `
    <td>
      <select [(ngModel)]="elem" [disabled]="disabled()">
        <option value="-">-</option>
        @for (elem of recipeConfig().skillElems; track elem) {
          @if (skillIs()[elem]) {
            <option [ngValue]="elem">{{ recipeConfig().displayElems[elem] || elem }}</option>
          }
        }
      </select>
    </td>
    <td>
      <select [(ngModel)]="skill" [disabled]="disabled()">
        @for (skill of skillIs()[elem()]; track skill.name) {
          <option [ngValue]="skill">{{ skill.name }}</option>
        }
      </select>
    </td>
    <td>
      <select [(ngModel)]="demon" [disabled]="disabled()">
        @for (demon of learnedBy()[skill().name]; track demon.name) {
          <option [ngValue]="demon">{{ demon.name }}</option>
        }
      </select>
    </td>
  `,
  host: {
    style: 'display: contents;'
  }
})
export class RecipeSkillPickerComponent {
  form = input.required<FieldTree<SkillPickModel>>({ alias: 'skillPickForm' });
  recipeConfig = input.required<RecipeGeneratorConfig>();
  demonT = input.required<Demon>();
  skillIs = input.required<SkillLookup>();
  learnedBy = input.required<DemonLookup>();
  innateCount = input.required<number>();
  index = input.required<number>();

  constructor() {
    effect(() => this.form().disabled().value.set(this.disabled()));
    effect(() => this.form().elem().value.set(this.elem()));
    effect(() => this.form().skill().value.set(this.skill()));
    effect(() => this.form().demon().value.set(this.demon()));
  }

  disabled = linkedSignal(() => this.index() < this.innateCount());

  elem = linkedSignal<{ demonT: Demon, skillIs: SkillLookup }, string>({
    source: () => ({ demonT: this.demonT(), skillIs: this.skillIs() }),
    computation: ({ demonT, skillIs }, prev) =>
      !prev || demonT !== prev.source.demonT || !skillIs[prev.value] ? '-' : prev.value
  });

  skill = linkedSignal<{ elem: string, skillIs: SkillLookup }, Skill>({
    source: () => ({ elem: this.elem(), skillIs: this.skillIs() }),
    computation: ({ elem, skillIs }, prev) =>
      !prev || !skillIs[elem].includes(prev.value) ? skillIs[elem][0] : prev.value
  });

  demon = linkedSignal(() => this.learnedBy()[this.skill().name][0]);
}

@Component({
  selector: 'app-recipe-generator',
  imports: [CommonModule, FormsModule, TranslateCompPipe, RecipeSkillPickerComponent, RecipeInheritElemsComponent],
  template: `
    <form>
      <ng-template #skillPickerHeader>
        <th style="width: 10%;">{{ msgs.Elem | translateComp:lang() }}</th>
        <th style="width: 15%;">{{ msgs.Skill | translateComp:lang() }}</th>
        <th style="width: 20%;">{{ msgs.Ingredient | translateComp:lang() }}</th>
      </ng-template>

      <h2>{{ msgs.RecipeGenerator | translateComp:lang() }}</h2>
      <table class="entry-table" style="width: 40%;">
        <tr><th colspan="3" class="title">{{ msgs.Target | translateComp:lang() }}</th></tr>
        <tr><th colspan="3">{{ msgs.Target | translateComp:lang() }}</th></tr>
        <tr>
          <td>
            <select [(ngModel)]="demonT" name="demonT">
              @for (demon of demonTs(); track demon.name) {
                <option [ngValue]="demon">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
        <tr>
          <td app-recipe-inherit-elems [inheritElems]="recipeConfig().inheritElems" [skillLookup]="skillTs()"></td>
        </tr>
      </table>
      <table class="entry-table" style="width: 70%;">
        <tr><th colspan="7" class="title">{{ msgs.IncludeIngredients | translateComp:lang() }}</th></tr>
        <tr>
          <th colspan="3">{{ msgs.LeftChain | translateComp:lang() }}</th>
          <th></th>
          <th colspan="3">{{ msgs.RightChain | translateComp:lang() }}</th>
        </tr>
        <tr>
          <td colspan="3">
            <select [(ngModel)]="demonL" name="demonL">
              @for (demon of demonLs(); track demon.name) {
                <option [ngValue]="demon">{{ demon.name }} ({{ demonRs()[demon.name].length }})</option>
              }
            </select>
          </td>
          <td></td>
          <td colspan="3">
            <select [(ngModel)]="demonR" name="demonR">
              @for (demon of demonRs()[demonL().name]; track demon.name) {
                <option [ngValue]="demon">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
        <tr>
          <td colspan="3" app-recipe-inherit-elems [inheritElems]="recipeConfig().inheritElems" [skillLookup]="skillLs()"></td>
          <td></td>
          <td colspan="3" app-recipe-inherit-elems [inheritElems]="recipeConfig().inheritElems" [skillLookup]="skillRs()"></td>
        </tr>
        <tr>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
          <th style="width: 5%;"></th>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
        </tr>
        <ng-container formArrayName="ingreds">
          @for (_ of recipeInputForm.ingredLs; track $index) {
            <tr>
              <app-recipe-skill-picker
                [skillPickForm]="recipeInputForm.ingredLs[$index]"
                [recipeConfig]="recipeConfig()"
                [demonT]="demonT()"
                [skillIs]="skillLs()"
                [learnedBy]="learnedBy()"
                [innateCount]="innateCount()"
                [index]="2 * $index">
              </app-recipe-skill-picker>
              <td></td>
              <app-recipe-skill-picker
                [skillPickForm]="recipeInputForm.ingredRs[$index]"
                [recipeConfig]="recipeConfig()"
                [demonT]="demonT()"
                [skillIs]="skillRs()"
                [learnedBy]="learnedBy()"
                [innateCount]="innateCount()"
                [index]="2 * $index + 1">
              </app-recipe-skill-picker>
            </tr>
          }
        </ng-container>
      </table>

      @if (fullRecipe()) {
        <table class="entry-table">
          <tr><th colspan="2" class="title">{{ msgs.FusionRecipe | translateComp:lang() }}</th></tr>
          <tr>
            <th>{{ msgs.LeftChain | translateComp:lang() }}</th>
            <th>{{ msgs.RightChain | translateComp:lang() }}</th>
          </tr>
          <tr>
            @if (recipeLeft().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeLeft(); track $index) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeLeft().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang() }}</td>
            }
            @if (recipeRight().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeRight(); track $index) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeRight().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang() }}</td>
            }
          </tr>
          @if (fusionPrereq()) {
            <tr><td colspan="2" style="padding: 1em; text-align: center;">
              {{ msgs.SpecialFusionCondition | translateComp:lang() }}: {{ fusionPrereq() }}
            </td></tr>
          }
          <tr><td colspan="2" style="padding: 1em; text-align: center;">
            @if (fullRecipe().stepR.length) {
              {{ recipeResult().join(' x ') }} = {{ fullRecipe().result }}<br>
              [{{ resultSkills().join(', ') }}]
            }
            @if (!fullRecipe().stepR.length) {
              {{ msgs.NoRecipesFound | translateComp:lang() }}
            }
          </td></tr>
        </table>
      }
    </form>
  `,
  styles: [`
    ul { padding: 0 1em; list-style: none; }
    select { min-height: 25px; width: 100%; }
    td[app-recipe-inherit-elems] { text-align: center; }
    div.element-icon { display: inline-block; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class RecipeGeneratorComponent {
  compendium = input.required<Compendium>();
  squareChart = input.required<SquareChart>();
  recipeConfig = input.required<RecipeGeneratorConfig>();
  maxSkills = input(8);
  lang = input('en');

  internalMaxSkills = 10;
  msgs = Translations.RecipeGeneratorComponent;
  skillLevelPipe = new SkillLevelToShortStringPipeLocale();

  createSkillPicks = () => Array.from({ length: this.internalMaxSkills / 2 }, (): SkillPickModel => ({
    disabled: false,
    elem: '-',
    skill: BLANK_SKILL,
    demon: BLANK_DEMON
  }));

  recipeInputModel = linkedSignal(() => ({
    demonT: BLANK_DEMON,
    demonL: BLANK_DEMON,
    demonR: BLANK_DEMON,
    ingredLs: createSkillPickList(this.internalMaxSkills / 2),
    ingredRs: createSkillPickList(this.internalMaxSkills / 2)
  }));

  recipeInputForm = form(this.recipeInputModel);

  constructor() {
    effect(() => this.recipeInputForm.demonT().value.set(this.demonT()));
    effect(() => this.recipeInputForm.demonL().value.set(this.demonL()));
    effect(() => this.recipeInputForm.demonR().value.set(this.demonR()));
  }

  demonT = linkedSignal(() => this.demonTs()[0]);
  demonL = linkedSignal(() => this.demonLs()[0]);
  demonR = linkedSignal(() => this.demonRs()[this.demonL().name][0]);

  skillTs = computed(() => this.createSkillLookup(this.demonT()));
  skillLs = computed(() => this.createSkillLookup(this.demonL()));
  skillRs = computed(() => this.createSkillLookup(this.demonR()));
  innateCount = computed(() => Object.values(this.demonT().skills).reduce((acc, l) => acc + (l < 2 ? 1 : 0), 0));

  demonTs = computed(() => {
    const demonTs = this.compendium().allDemons.filter(d => !d.isEnemy && d.fusion !== 'party' && d.fusion !== 'enemy');
    demonTs.sort((a, b) => a.name.localeCompare(b.name));
    return demonTs;
  });

  learnedBy = computed(() => {
    const learnedBy: DemonLookup = { '-': [BLANK_DEMON] };

    for (const demon of this.demonTs()) {
      for (const sname of Object.keys(demon.skills)) {
        if (!learnedBy[sname]) { learnedBy[sname] = []; }
        learnedBy[sname].push(demon);
      }
    }

    for (const dl of Object.values(learnedBy)) { dl.sort((a, b) => a.lvl - b.lvl); }
    return learnedBy;
  });

  elemTyped = computed(() => {
    const elemTyped: SkillLookup = { '-': [BLANK_SKILL] };

    for (const skill of this.compendium().allSkills.filter(s => s.rank < 50 && this.learnedBy()[s.name])) {
      if (!elemTyped[skill.inherit]) { elemTyped[skill.inherit] = []; }
      elemTyped[skill.inherit].push(skill);
    }

    for (const sl of Object.values(elemTyped)) { sl.sort((a, b) => a.rank - b.rank); }
    return elemTyped;
  });

  demonRs = computed(() => {
    const demonRs: DemonLookup = {};
    const combos = createLeftRightCombos(this.demonT().name, this.compendium(), this.squareChart(), this.recipeConfig());

    for (const [nameL, nameRs] of Object.entries(combos)) {
      demonRs[nameL] = nameRs.map(nameR => this.compendium().getDemon(nameR));
      demonRs[nameL].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (Object.keys(demonRs).length === 0) { demonRs['-'] = [BLANK_DEMON]; }
    return demonRs;
  });

  demonLs = computed(() => {
    const demonLs = Object.keys(this.demonRs()).map(nameL => this.compendium().getDemon(nameL) || BLANK_DEMON);
    demonLs.sort((a, b) => this.demonRs()[b.name].length - this.demonRs()[a.name].length);
    return demonLs;
  });

  fullRecipe = computed(() => {
    const { demonT, demonL, demonR, ingredLs: inputLs, ingredRs: inputRs } = this.recipeInputModel()
    const [ingredLs, ingredRs] = [inputLs, inputRs].map(inputIs => inputIs
      .filter(i => !i.disabled && i.demon.name !== '-')
      .reduce<{ [skill: string]: string }>((acc, i) => { acc[i.skill.name] = i.demon.name; return acc; }, {})
    );

    const lrConfig = { result: demonT.name, targetL: demonL.name, targetR: demonR.name, ingredLs, ingredRs };
    return createLeftRightRecipe(lrConfig, this.compendium(), this.squareChart(), this.recipeConfig());
  });

  fullRecipeSkillRef = computed(() => {
    const skillRef: { [demon: string]: string[] } = {};

    for (const [skill, demon] of Object.entries(this.fullRecipe().skills)) {
      if (!skillRef[demon]) { skillRef[demon] = []; }
      const slvl = this.compendium().getDemon(demon).skills[skill];
      skillRef[demon].push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang())}`.trim());
    }

    return skillRef;
  });

  recipeLeft = computed(() => this.decodeRecipechain(this.fullRecipe().chain1, this.fullRecipeSkillRef()));
  recipeRight = computed(() => this.decodeRecipechain(this.fullRecipe().chain2, this.fullRecipeSkillRef()));

  resultSkills = computed(() => {
    const resultSkills = []

    for (const [skill, slvl] of Object.entries(this.compendium().getDemon(this.fullRecipe().result).skills)
      .filter(s => s[1] < 2000)
      .sort((a, b) => a[1] - b[1])
    ) {
      resultSkills.push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang())}`.trim());
    }

    return resultSkills;
  });

  recipeResult = computed(() => {
    const recipeResult = [];

    for (const result of this.fullRecipe().stepR) {
      recipeResult.push(this.fullRecipeSkillRef()[result] ? `${result} [${this.fullRecipeSkillRef()[result].join(', ')}]` : result);
    }

    return recipeResult;
  });

  fusionPrereq = computed(() => this.compendium().getDemon(this.fullRecipe().result).prereq || '');

  private decodeRecipechain(chain: string[], skillRef: { [demon: string]: string[] }): string[] {
    const steps = [];

    for (let i = 0; i < chain.length - 2; i += 2) {
      const skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
      const skills2 = skillRef[chain[i + 1]] ? '[' + skillRef[chain[i + 1]].join(', ') + '] ' : '';
      steps.push(`${chain[i]} ${skills1}x ${chain[i + 1]} ${skills2}= ${chain[i + 2]}`);
    }

    return steps;
  }

  createSkillLookup(demon: Demon): SkillLookup {
    const excludeElems: string[] = [];
    const { inheritElems } = this.recipeConfig();

    for (let i = 0; i < inheritElems.length; i++) {
      if (!(demon.inherits & this.demonT().inherits & (1 << i))) {
        excludeElems.push(inheritElems[inheritElems.length - i - 1]);
      }
    }

    const elems = this.recipeConfig().skillElems.filter(e => !excludeElems.includes(e));
    const learnedSkills = Object.keys(demon.skills)
      .filter(s => demon.skills[s] < 99)
      .map(s => this.compendium().getSkill(s))
      .filter(s => elems.includes(s.element) && s.rank < 50);

    return elems.reduce((acc, e) =>
      { acc[e] = this.elemTyped()[e]; return acc; },
      { '-': [BLANK_SKILL].concat(learnedSkills) }
    );
  }
}
